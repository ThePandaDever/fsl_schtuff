import { randomStr, Object_merge, Object_isSame } from "./utils.js";

const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string);

var scopes = {};
var functions = {};

export var funcCacheKey = {};

export function runAst(content, func = "main", args = [], start = false) {
    const scopeID = randomStr();
    if (start) {
        const out = runSegmentFunc(content, "", args, scopeID);
        if (out[1] != "null" && out[0] != "segmentNull") {
            return out;
        }
    }
    return runSegmentFunc(content, func, args, scopeID);
}
function runSegmentFunc(content, funcName, args = [], scopeID) {
    if (!Object.keys(scopes).includes(scopeID)) {
        // initialise the scope if missing
        let scope = getDefaultScope();
        // add functions as variables
        if (Object.keys(content).includes("functions")) {
            const keys = Object.keys(content["functions"]);
            const values = Object.values(content["functions"]);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const name = values[i]["key"];
                scope["variables"][name] = [{"type":"ref","data":key},"function"]
                functions[key] = values[i];
            }
        }
        scopes[scopeID] = scope;
    }
    // its not running in a function
    if (funcName == "" && Object.keys(content).includes("content")) {
        return runSegment(content["content"], scopeID);
    }
    // search for the function its trying to run
    if (Object.keys(content).includes("functions")) {
        const keys = Object.keys(content["functions"]);
        const values = Object.values(content["functions"]);
        let id = "";
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const func = values[i];
            if (funcMatches(func,funcName,args)) {
                id = key;
            }
        }
        if (id) {
            const func = content["functions"][id];

            // setup args
            let scope = scopes[scopeID];
            for (let i = 0; i < func["args"].length; i++) {
                const arg = func["args"][i];
                const passed_arg = args[i];
                if (passed_arg) {
                    scope["variables"][arg["name"]] = passed_arg;
                } else {
                    scope["variables"][arg["name"]] = runNode(arg["default"],scopeID);
                }
            }
            scopes[scopeID] = scope;

            return runSegment(func["content"]["content"], scopeID);
        }
    }
    return ["functionNull","null"];
}
function runSegment(content, scopeID) {
    for (let i = 0; i < content.length; i++) {
        const node = content[i];
        const out = runNode(node, scopeID);
        if (typeof out == "object" && !Array.isArray(out) && out) {
            return out["data"];
        }
    }
    return ["segmentNull","null"];
}
function runNodes(content, scopeID) {
    let out = [];
    for (let i = 0; i < content.length; i++) {
        out.push(runNode(content[i],scopeID));
    }
    return out;
}
function runNode(content, scopeID) {
    switch (content["type"]) {
        case "execution":
            return runExecution(runNode(content["key"],scopeID),runNodes(content["args"],scopeID),scopeID);
        case "literal":
            return content["data"];
        case "reference":
            const local_scope = scopes[scopeID]["variables"];
            if (!Object.keys(local_scope).includes(content["key"])) {
                error(content["key"], "is not defined.");
            }
            return local_scope[content["key"]];
        case "function":
            return [{"type":"def","data":content}];
        case "spaced command":
            switch (content["name"]) {
                case "return":
                    return {"data":runNode(content["data"],scopeID)}
                default:
                    error("unknown spaced command type", content["name"]);
            }
            return
        case "operator":
            return runMath(content["operator"],runNode(content["a"],scopeID),runNode(content["b"],scopeID));
        case "comparison":
            return runComparison(content["comparison"],runNode(content["a"],scopeID),runNode(content["b"],scopeID))
        case "logic":
            const logic_a = castType(runNode(content["a"],scopeID),"bool");
            const logic_b = castType(runNode(content["b"],scopeID),"bool");
            switch (content["operator"]) {
                case "or":
                    return [logic_a[0] || logic_b[0],"bool"];
                case "and":
                    return [logic_a[0] && logic_b[0],"bool"];
                default:
                    error("unknown logic operator", content["operator"]);
            }
            break
        case "assignment":
            //console.log(content["key"])
            break
        default:
            error("unknown node type '" + content["type"] + "'")
            return ["null","null"];
    }
}
function runExecution(key, args, scopeID) {
    switch (key[1]) {
        case "function":
            switch (key[0]["type"]) {
                case "js":
                    return key[0]["data"](args,scopeID);
                case "ref":
                    const func = functions[key[0]["data"]];
                    return runSegmentFunc({"functions":[func]},func["key"],args,randomStr())
                default:
                    error("unknown function type",key[0]["type"])
            }
            break
        default:
            error("cannot run",key[1])
    }
    return ["null","null"];
}
function runMath(operator,a,b) {
    switch (operator) {
        case "+":
            try {
                const num_a = castType(a,"number",true);
                const num_b = castType(b,"number",true);
                return [num_a[0] + num_b[0],"number"];
            } catch {}
            return [castType(a,"string")[0] + " " + castType(b,"string")[0],"string"];
        case "++":
            return [castType(a,"string")[0] + castType(b,"string")[0],"string"];
        case "-":
            try {
                const num_a = castType(a,"number",true);
                const num_b = castType(b,"number",true);
                return [num_a[0] - num_b[0],"number"];
            } catch (e) {}
            error("cannot subtract",a[1],"by",b[1])
        case "*":
            try {
                const num_a = castType(a,"number",true);
                const num_b = castType(b,"number",true);
                return [num_a[0] * num_b[0],"number"];
            } catch {}
            try {
                const str_a = castType(a,"string",true);
                const num_b = castType(b,"number",true);
                return [str_a[0].repeat(num_b[0]),"string"];
            } catch {}
            error("cannot multiply",a[1],"by",b[1])
        case "/":
            try {
                const num_a = castType(a,"number",true);
                const num_b = castType(b,"number",true);
                return [num_a[0] / num_b[0],"number"];
            } catch (e) {}
            error("cannot divide",a[1],"by",b[1])
        default:
            error("unknown operator",operator);
    }
    return ["null","null"];
}
function runComparison(comparison,a,b) {
    switch (comparison) {
        case "equal":
            // needs object and array support
            return [a[0] == b[0] && typeEqual(a[1],b[1]), "bool"];
        case "not_equal":
            // needs object and array support
            return [!(a[0] == b[0] && typeEqual(a[1],b[1])), "bool"];
        case "string_equal":
            a = castType(a, "string");
            b = castType(b, "string");
            return [a[0] == b[0], "bool"];
        case "type_equal":
            return [a[1] == b[1], "bool"];
        case "greater": a = castType(a, "number"); b = castType(b, "number"); return [a[0] > b[0], "bool"];
        case "smaller": a = castType(a, "number"); b = castType(b, "number"); return [a[0] < b[0], "bool"];
        case "greater_equal": a = castType(a, "number"); b = castType(b, "number"); return [a[0] >= b[0], "bool"];
        case "smaller_equal": a = castType(a, "number"); b = castType(b, "number"); return [a[0] <= b[0], "bool"];
        default:
            error("unknown comparison",comparison);
    }
}

function typeEqual(a,b) {
    if (a == "any" || b == "any") {
        return true;
    }
    return a == b;
}
function typesEqual(a,b) {
    for (let i = 0; i < a.length; i++) {
        if (typeEqual(a[i],b)) {
            return true;
        }
    }
    return false;
}
function castType(value,type,tryTo = false) {
    if (!Array.isArray(value)) { return ["null","null"]; }
    if (value[1] == type) { return value; }
    switch (type) {
        case "string":
            if (typeof value[1] == "object") {
                return [JSON.stringify(value),"string"];
            }
            return [value[0].toString(),"string"];
        case "number":
            if (typeof value[1] == "string") {
                if (isNumeric(value[0])) {
                    return [Number(value[0]),"number"]
                }
            }
        default:
            if (!tryTo) {
                error("cannot cast to",type);
            }
    }
}

function funcMatches(func,key,args) {
    if (func["key"] != key) { return false; } // its not the same name
    if (func["args"].length == 0 && args.length == 0) { return true; } // there arent any args, no need to check
    // there are more arguments passed in,
    // however, this isnt done for less arguments passed in, due to param = value args
    if (args.length > func["args"].length) { return false; }
    for (let i = 0; i < func["args"].length; i++) {
        if (i >= args.length) {
            // if the variable doesnt have a default (arg = val) then theres a missing param
            if (!Object.keys(func["args"][i]).includes("default")) {
                return false;
            }
        } else {
            const arg = args[i];
            if (!Array.isArray(arg)) {
                error("invalid passed in arg",arg);
                return false;
            }
            if (!argMatches(func["args"][i], arg)) {
                return false;
            }
        }
    }
    return true;
}
function argMatches(arg,match) {
    if (Array.isArray(arg["type"])) {
        if (!typesEqual(arg["type"],match[1])) {
            return false;
        }
    } else {
        if (!typeEqual(arg["type"],match[1])) {
            return false;
        }
    }
    return true;
}

function getDefaultScope() {
    return {
        "variables": {
            "print": [
                {
                    "type": "js",
                    "data": function(args, scopeID) {
                        console.log(...args.map(v => formatString(v)));
                        return ["null","null"];
                    }
                },
                "function"
            ],
            "type": [
                {
                    "type": "js",
                    "data": function(args, scopeID) {
                        return [args[0][1],"string"];
                    }
                },
                "function"
            ]
        }
    }
}

export function error(...args) {
    console.error(...args);
    process.exit();
}
export function formatString(value) {
    return castType(value,"string")[0];
}