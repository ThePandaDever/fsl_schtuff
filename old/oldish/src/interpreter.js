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
    if (!content) { return ["null","null"]; }
    if (!scopeID) { error(content, "no scopeID"); }
    switch (content["type"]) {
        case "execution":
            return runExecution(runNode(content["key"],scopeID),content["args"], content["content"],scopeID);
        case "literal":
            return content["data"];
        case "reference":
            const local_scope = scopes[scopeID]["variables"];
            if (!Object.keys(local_scope).includes(content["key"])) {
                error(content["key"], "is not defined.");
            }
            return local_scope[content["key"]];
        case "function":
            if (!Object.keys(content).includes("key")) {
                return [{"type":"def","data":content},"function"];
            }
            return {"type":"def","data":content};
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
            let assignment_ref = scopes[scopeID]["variables"];
            for (let i = 0; i < content["key"].length - 1; i++) {
                const key = content["key"][i];
                if (!assignment_ref) {
                    error("cannot get path",content["key"].map(
                        v => {switch (v["type"]) { case "reference": return v["key"]; case "literal": return v["data"][0]; }}
                    ).join("."));
                }
                if (key["type"] == "reference") {
                    assignment_ref = assignment_ref[key["key"]];
                }
            }
            if (!assignment_ref) {
                error("cannot set path",content["key"].map(
                    v => {switch (v["type"]) { case "reference": return v["key"]; case "literal": return v["data"][0]; }}
                ).join("."));
            }
            const key = content["key"][content["key"].length - 1];
            if (key["type"] == "reference") {
                switch(content["assignment"]) {
                    case "set":
                        const set_data = runNode(content["value"],scopeID);
                        assignment_ref[key["key"]] = set_data;
                        return set_data;
                    case "inc_by":
                        let inc_by_data = runNode(content["value"],scopeID);
                        if(!assignment_ref[key["key"]]) { error("variable += val requires already made variable") }
                        inc_by_data = runMath("+",assignment_ref[key["key"]],inc_by_data);
                        assignment_ref[key["key"]] = inc_by_data;
                        return inc_by_data;
                    case "dec_by":
                        let dec_by_data = runNode(content["value"],scopeID);
                        if(!assignment_ref[key["key"]]) { error("variable -= val requires already made variable") }
                        dec_by_data = runMath("-",assignment_ref[key["key"]],dec_by_data);
                        assignment_ref[key["key"]] = dec_by_data;
                        return dec_by_data;
                    case "inc":
                        let inc_data = runNode(content["value"],scopeID);
                        if(!assignment_ref[key["key"]]) { error("variable ++ requires already made variable") }
                        inc_data = runMath("+",assignment_ref[key["key"]],[1,"num"]);
                        assignment_ref[key["key"]] = inc_data;
                        return inc_data;
                    case "dec":
                        let dec_data = runNode(content["value"],scopeID);
                        if(!assignment_ref[key["key"]]) { error("variable -- requires already made variable") }
                        dec_data = runMath("-",assignment_ref[key["key"]],[1,"num"]);
                        assignment_ref[key["key"]] = dec_data;
                        return dec_data;
                    default:
                        error("unknown assignment type",content["assignment"]);
                }
            }
            break
        case "object":
            let obj = {};
            const obj_keys = Object.keys(content["data"]);
            const obj_values = Object.values(content["data"]);
            for (let i = 0; i < obj_keys.length; i++) {
                obj[obj_keys[i]] = runNode(obj_values[i],scopeID);
            }
            return [obj,"obj"];
        case "array":
            let arr = [];
            const arr_values = content["data"];
            for (let i = 0; i < arr_values.length; i++) {
                arr.push(runNode(arr_values[i],scopeID));
            }
            return [arr,"arr"];
        case "key":
            return getKey(runNode(content["value"],scopeID),runNode(content["key"],scopeID));
        case "definition":
            console.log(content);
            break
        default:
            error("unknown node type '" + content["type"] + "'")
            return ["null","null"];
    }
}
function runExecution(key, args, content = null, scopeID) {
    switch (key[1]) {
        case "function":
            switch (key[0]["type"]) {
                case "js":
                    if (!(key[0]["flags"] && key[0]["flags"].includes("args_raw"))) {
                        args = runNodes(args,scopeID);
                    }
                    return key[0]["data"](args,scopeID);
                case "ref":
                    if (!(key[0]["flags"] && key[0]["flags"].includes("args_raw"))) {
                        args = runNodes(args,scopeID);
                    }
                    const func = functions[key[0]["data"]];
                    return runSegmentFunc({"functions":[func]},func["key"],args,randomStr())
                case "def":
                    if (!(key[0]["flags"] && key[0]["flags"].includes("args_raw"))) {
                        args = runNodes(args,scopeID);
                    }
                    let def_func = key[0]["data"];
                    def_func["key"] = "__NOKEYFUNCTION__" + randomStr();
                    return runSegmentFunc({"functions":[def_func]},def_func["key"],args,randomStr())
                default:
                    error("unknown function type",key[0]["type"])
            }
            break
        case "statement":
            if (!content) {
                error("statement doesnt have content")
            }
            switch (key[0]["type"]) {
                case "js":
                    if (!(key[0]["flags"] && key[0]["flags"].includes("args_raw"))) {
                        args = runNodes(args,scopeID);
                    }
                    return key[0]["data"](args,content,scopeID);
                default:
                    error("unknown statement type",key[0]["type"])
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
                const num_a = castType(a,"num",true);
                const num_b = castType(b,"num",true);
                return [num_a[0] + num_b[0],"num"];
            } catch {}
            return [castType(a,"str")[0] + " " + castType(b,"str")[0],"str"];
        case "++":
            return [castType(a,"str")[0] + castType(b,"str")[0],"str"];
        case "-":
            try {
                const num_a = castType(a,"num",true);
                const num_b = castType(b,"num",true);
                return [num_a[0] - num_b[0],"num"];
            } catch (e) {}
            error("cannot subtract",a[1],"by",b[1])
        case "*":
            try {
                const num_a = castType(a,"num",true);
                const num_b = castType(b,"num",true);
                return [num_a[0] * num_b[0],"num"];
            } catch {}
            try {
                const str_a = castType(a,"str",true);
                const num_b = castType(b,"num",true);
                return [str_a[0].repeat(num_b[0]),"str"];
            } catch {}
            error("cannot multiply",a[1],"by",b[1])
        case "/":
            try {
                const num_a = castType(a,"num",true);
                const num_b = castType(b,"num",true);
                return [num_a[0] / num_b[0],"num"];
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
            a = castType(a, "str");
            b = castType(b, "str");
            return [a[0] == b[0], "bool"];
        case "type_equal":
            return [a[1] == b[1], "bool"];
        case "greater": a = castType(a, "num"); b = castType(b, "num"); return [a[0] > b[0], "bool"];
        case "smaller": a = castType(a, "num"); b = castType(b, "num"); return [a[0] < b[0], "bool"];
        case "greater_equal": a = castType(a, "num"); b = castType(b, "num"); return [a[0] >= b[0], "bool"];
        case "smaller_equal": a = castType(a, "num"); b = castType(b, "num"); return [a[0] <= b[0], "bool"];
        default:
            error("unknown comparison",comparison);
    }
}
function getKey(value,key) {
    switch(value[1]) {
        case "obj":
            if (key[1] != "str") {
                error("cannot get key of",key[1],"from",value[1]);
            }
            return value[0][key[0]];
        case "arr":
            if (key[1] != "num") {
                error("cannot get key of",key[1],"from",value[1]);
            }
            return value[0][key[0]];
        case "str": case "num":
            value = castType(value,"str");
            if (key[1] != "num") {
                error("cannot get key of",key[1],"from",value[1]);
            }
            return [value[0][key[0]],"str"];
        default:
            error("cannot get key of",value[1]);
    }
    return ["null","null"];
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
        case "str":
            if (value[1] == "obj") {
                let data = "";
                for (let key in value[0]) {
                    if (value[0][key][1] != "str") {
                        data += "\"" + key + "\"" + ":" + castType(value[0][key],"str")[0] + ",";
                    } else {
                        data += "\"" + key + "\":\"" + value[0][key][0] + "\",";
                    }
                }
                return ["{" + data.slice(0,-1) + "}","str"];
            }
            if (value[1] == "arr") {
                let data = "";
                for (let key in value[0]) {
                    if (value[0][key][1] != "str") {
                        data += castType(value[0][key],"str")[0] + ",";
                    } else {
                        data += "\"" + value[0][key][0] + "\",";
                    }
                }
                return ["[" + data.slice(0,-1) + "]","str"];
            }
            if (value[1] == "function") {
                return ["<function:type=" + value[0]["type"] + ">","str"];
            }
            if (value[1] == "statement") {
                return ["<statement:type=" + value[0]["type"] + ">","str"];
            }
            return [value[0].toString(),"str"];
        case "num":
            if (typeof value[1] == "str") {
                if (isNumeric(value[0])) {
                    return [Number(value[0]),"num"]
                }
            }
            if (!tryTo) {
                error("cannot cast to",type);
            } else {
                return null;
            }
        case "bool":
            return [
                (value[0] != "" && value[1] == "str") ||
                (value[0] != 0 && value[1] == "num")
            ,"bool"]
        default:
            if (!tryTo) {
                error("cannot cast to",type);
            } else {
                return null;
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
            "log": [
                {
                    "type": "js",
                    "data": function(args, scopeID) {
                        console.log(...args.map(v => v[0]));
                        return ["null","null"];
                    }
                },
                "function"
            ],
            "type": [
                {
                    "type": "js",
                    "data": function(args, scopeID) {
                        return [args[0][1],"str"];
                    }
                },
                "function"
            ],
            "if": [
                {
                    "type": "js",
                    "data": function(args, content, scopeID) {
                        const condition = args.every(arg => castType(arg,"bool")[0]);
                        if (condition) {
                            const out = runSegment(content["content"],scopeID);
                            if (out[0] != "segmentNull" && out[1] != "null") {
                                return {"data":out};
                            }
                        }
                    }
                },
                "statement"
            ],
            "while": [
                {
                    "type": "js",
                    "flags": ["args_raw"],
                    "data": function(args, content, scopeID) {
                        let condition = args.every(arg => castType(runNode(arg,scopeID),"bool")[0]);
                        while (condition) {
                            const out = runSegment(content["content"],scopeID);
                            if (out[0] != "segmentNull" && out[1] != "null") {
                                return {"data":out};
                            }
                            condition = args.every(arg => castType(runNode(arg,scopeID),"bool")[0]);
                        }
                    }
                },
                "statement"
            ],
            "until": [
                {
                    "type": "js",
                    "flags": ["args_raw"],
                    "data": function(args, content, scopeID) {
                        let condition = args.every(arg => castType(runNode(arg,scopeID),"bool")[0]);
                        while (!condition) {
                            const out = runSegment(content["content"],scopeID);
                            if (out[0] != "segmentNull" && out[1] != "null") {
                                return {"data":out};
                            }
                            condition = args.every(arg => castType(runNode(arg,scopeID),"bool")[0]);
                        }
                    }
                },
                "statement"
            ],
        }
    }
}

export function error(...args) {
    console.error(...args);
    process.exit();
}
export function formatString(value) {
    return castType(value,"str")[0];
}