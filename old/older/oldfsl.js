import { generateAst } from "./oldastGen.js";
import * as fs from "node:fs";

var code = "";

/*fs.readFile('old/main.fsl', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    code = data;
  
    //let at = performance.now();
    var ast = generateAst(code);
    console.log(JSON.stringify(ast))
    //console.log(performance.now() - at)
    
    //let t = performance.now();
    fsl_runAst(ast, "main");
    //console.log(performance.now() - t)

    //console.log(fsl_memory);
});*/
export function runCode(code) {
    var ast = generateAst(code);
    fsl_runAst(ast, "main");
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
function privateEval(input) {
	return eval("(function(){" + input + "}())");
}

Object.isSame = function (obj1,obj2) {
    if (typeof obj1 === "object" && typeof obj2 === "object") {
        if (obj1 === obj2) return true;

        let obj1Keys = Object.keys(obj1);
        let obj2Keys = Object.keys(obj2);
        if (obj1Keys.length !== obj2Keys.length) return false;

        for (let key of obj2Keys) {
            if (!obj1Keys.includes(key)) return false;
            const obj1Type = typeof obj1[key];
            const obj2Type = typeof obj2[key];
            if (obj1Type !== obj2Type) return false;
            if (obj1Type === "object" && obj2Type === "object") {
            if (!Object.isSame(obj1[key], obj2[key])) return false;
            } else if (obj1[key] !== obj2[key]) return false;
        }
        return true;
    } else {
        return false;
    }
}
Object.flip = function (obj) {
    let newObj = {};
    for (let key in obj) {
        newObj[obj[key]] = key;
    }
    return newObj;
}
Object.clone=function(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object.clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object.clone(e[r]));return n}}return e};

export var fsl_memory = {};
export var local_modules = {};

var dir = fs.readdirSync("./");
for(const filer in dir) {
    const file = dir[filer];
    const tokens = file.split(".");
    if (tokens[1] == "fsl") {
        var code = fs.readFileSync(file,"utf8");
        local_modules[tokens[0]] = generateAst(code);
    }
}

console.log(local_modules);

// lays out how many arguments and what those argument's types are for strict commands
var fsl_command_args = {
    "log": ["any"],

    "if": ["any"],

    "while": ["any"],
    "until": ["any"]
}
// list of commands that should'nt have their arguments evaluated automatically
var fsl_command_dontEval = [
    "for"
]

var fsl_method_args = {
    "string":{
        "upper":[],
        "lower":[],
        "trim":[],
        "toCase":["string"],
        "substring":["number","number"],
        "replace":["string","string"]
    },
    "global":{
        "cast":["string"],
		"toString":[]
    }
}

var fsl_function_memids = {
    "sin":"fn_math_sin",
    "cos":"fn_math_cos",
    "round":"fn_math_round",
    "floor":"fn_math_floor",
    "ceil":"fn_math_ceil",
    "toDegrees":"fn_math_deg",
    "toRadians":"fn_math_rads",
}
var fsl_function_args = {
    "fn_math_sin":["number"],
    "fn_math_cos":["number"],
    "fn_math_round":["number"],
    "fn_math_floor":["number"],
    "fn_math_ceil":["number"],
    "fn_math_deg":["number"],
    "fn_math_rads":["number"],
}

var fsl_default_variables = {
    "math":{
        "pi": [Math.PI,"number"]
    }
}

var fsl_function_varidcurrent = {};
function fsl_runBaseFuncCode(key, args) {
    switch (key) {
        case "fn_math_sin":
            return [Math.sin(args[0][0] * (Math.PI / 180)),"number"];
        case "fn_math_cos":
            return [Math.cos(args[0][0] * (Math.PI / 180)),"number"];
        case "fn_math_round":
            return [Math.round(args[0][0]),"number"];
        case "fn_math_floor":
            return [Math.floor(args[0][0]),"number"];
        case "fn_math_ceil":
            return [Math.ceil(args[0][0]),"number"];
        case "fn_math_deg":
            return [args[0][0] * (180 / Math.PI),"number"];
        case "fn_math_rads":
            return [args[0][0] * (Math.PI / 180),"number"];
    }
    return [null,"null"];
}
function fsl_runBaseFunc(key, args) {
    let temp = fsl_function_args[key];
    if (temp) {
        const argRawTypes = args.map((v) => v[1]);
        for (let i = 0; i < argRawTypes.length; i++) {
            const type = temp[i];
            args[i] = fsl_castType(args[i],type,false);
        }
        const argTypes = args.map((v) => v[1]);
        if (!Object.isSame(temp,argTypes)) {
            if (argTypes.length != temp.length) {
                fsl_error("function got too many/few arguments");
            }
            for (let i = 0; i < argTypes.length; i++) {
                const arg = argTypes[i];
                const argExpected = temp[i];
                if (arg != argExpected) {
                    fsl_error("expected " + argExpected + " got " + arg)
                }
            }
        }
    }
    return fsl_runBaseFuncCode(key,args);
}
export function fsl_runAst(code, func, params = []) {
    const fn = code["functions"][func];

    if (!fn) {
        fsl_error("function not found '" + func + "'");
        return null;
    }
    
    if (!Object.keys(fsl_memory).includes(code["hash"])) {
        fsl_memory[code["hash"]] = code;
    }
    
    const id = makeid(25);

    fsl_memory[id] = {
        "scope": {},
        "leftovers": []
    };

    for (let i = 0; i < Object.keys(code["functions"]).length; i++) {
        const func_name = Object.keys(code["functions"])[i];
        const func = code["functions"][func_name];
        if (!Object.keys(fsl_memory).includes(func["hash"])) {
            fsl_memory[func["hash"]] = {
                "parent": code["hash"],
                "key": func_name,
                "content": func
            };
            const fnid = makeid(17);
            fsl_memory[fnid] = [func["hash"],"function"];
            fsl_memory[id]["scope"][func_name] = fnid;
        } else {
            const fnid = makeid(17);
            fsl_memory[fnid] = [func["hash"],"function"];
            fsl_memory[id]["scope"][func_name] = fnid;
        }
    }

    for (let i = 0; i < Object.keys(fsl_function_memids).length; i++) {
        const name = Object.keys(fsl_function_memids)[i];
        const fnmemid = fsl_function_memids[name];
        if (!Object.keys(fsl_function_varidcurrent).includes(fnmemid)) {
            const memid = makeid(15);
            fsl_memory[memid] = [fnmemid,"function"];
            fsl_memory[id]["scope"][name] = memid;
            fsl_function_varidcurrent[name] = memid
        } else {
            fsl_memory[id]["scope"][fsl_function_varidcurrent[name]] = memid;
        }
    }

    for (let i = 0; i < Object.keys(fsl_default_variables).length; i++) {
        const name = Object.keys(fsl_default_variables)[i];
        const memid = makeid(21);
        fsl_memory[memid] = [fsl_createObj(fsl_default_variables[name],id),"object"];
        fsl_memory[id]["scope"][name] = memid;
    }

    if (fn["arg_map"]) {
        let paramMap = fn["arg_map"];
        if (params.length < paramMap.length) {
            fsl_error("not enough arguments passed");
        }
        let paramTypes = fn["args"];
        for (let i = 0; i < params.length; i++) {
            const paramValue = params[i];
            const paramName = paramMap[i];
            const paramID = makeid(18);
            fsl_memory[paramID] = paramValue;
            fsl_memory[id]["scope"][paramName] = paramID;
            if (!fsl_isTypeEqual(paramTypes[paramName], paramValue[1])) {
                fsl_error("expected " + paramTypes[paramName] + " got " + paramValue[1]);
            }
        }
    }

    const out = fsl_runSegment(fn["content"], id);
	
	// make a check to see if any variables point to a leftover, in which it
	// adds to a global leftovers to not have memory leaks
	// fsl_checkLeftover() or somthing
	for(let i = 0; i < fsl_memory[id].leftovers; i ++) {
		fsl_removeMemory(fsl_memory[id].leftovers[i]);
	}
	
    return out;
}
function fsl_runSegment(data, id) {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element["type"] == "return") {
            return fsl_runArgument(element["value"],id);
        }
        const out = fsl_runElement(element, id);
        if (Array.isArray(out)) {
            return out;
        }
    }
}
function fsl_runElement(element, id) {
    if (!element["type"]) { return }
    switch(element["type"]) {
        case "command":
            const out = fsl_runCommand(element, id);
            if (Array.isArray(out)) {
                return out;
            }
            break
        case "standalone":
            fsl_runArgument(element["data"], id);
            break
        default:
            fsl_error("unknown element type '" + element["type"] + "'", "ast")
    }
}
function fsl_runCommand(command, id) {
    let args = [];
    if (command["args"]) {
        if (Object.keys(fsl_command_args).includes(command["id"])) {
            // command has strict arguments
            if (Object.keys(fsl_command_args[command["id"]]).length !== command["args"].length) {
                fsl_error("command has too many / too few arguments.");
                return [null,"null"];
            } else {
                for (let argi = 0; argi < command["args"].length; argi++) { // loop over all the command's arguments
                    const arg = command["args"][argi];
                    if (Array.isArray(arg)) { // if the argument is a pure value
                        if (!fsl_isType(arg,fsl_command_args[command["id"]][argi])) {
                            fsl_error("command expected " + fsl_command_args[command["id"]][argi] + " got " + arg[1]);
                            return [null,"null"];
                        }
                    }
                }
            }
        }
        if (!fsl_command_dontEval.includes(command["id"])) {
            args = fsl_runArguments(command["args"], id);
        } else {
            args = command["args"];
        }
    }

    switch (command["id"]) {
        case "print":
            fsl_log(fsl_format(args, id));
            break
        case "log":
            console.log(args[0][0]);
            break
        
        case "if":
            let if_val = fsl_castType(args[0],"bool");
            if (if_val[0]) {
                fsl_runSegment(command["content"],id);
            }
            break

        case "while":
            let while_val = fsl_castType(args[0],"bool");
            while (while_val[0]) {
                fsl_runSegment(command["content"],id);
                while_val = fsl_castType(fsl_runArgument(command["args"][0],id),"bool");
            }
            break
        case "until":
            let until_val = fsl_castType(args[0],"bool");
            while (!until_val[0]) {
                fsl_runSegment(command["content"],id);
                until_val = fsl_castType(fsl_runArgument(command["args"][0],id),"bool");
            }
            break
        
        case "for":
            if (args.length == 1) { // for (5) {}
                let times = fsl_castType(fsl_runArgument(args[0],id),"number")[0];
                for (let i = 0; i < times; i++) {
                    fsl_runSegment(command["content"],id);
                }
                return;
            }
            if (args.length == 2 && Array.isArray(args[1])) { // for (i = 1, 5) {}
                if (args[0]["type"] != "assignment") { fsl_error("arg 1 must be assignment") }
                const times = fsl_castType(fsl_runArgument(args[1],id),"number")[0];
                let iter = fsl_runArgument(args[0],id);
                const iter_id = iter[2]["ref"];
                for (let i = 0; i < times; i++) {
                    fsl_runSegment(command["content"],id);
                    if (i < times - 1) {
                        fsl_memory[iter_id][0] ++;
                    }
                }
                return;
            }
            if (args.length == 2 && !Array.isArray(args[1])) { // for (i = 1, i <= 5) {}
                if (args[0]["type"] != "assignment") { fsl_error("arg 1 must be assignment") }
                let iter = fsl_runArgument(args[0],id);
                const iter_id = iter[2]["ref"];
                while (fsl_castType(fsl_runArgument(args[1],id),"bool")[0]) {
                    fsl_runSegment(command["content"],id);
                    fsl_memory[iter_id][0] ++;
                }
                return;
            }
            if (args.length == 3 && Array.isArray(args[1]) && Array.isArray(args[2])) { // for (i = 1, 5, 1) {}
                if (args[0]["type"] != "assignment") { fsl_error("arg 1 must be assignment") }
                const times = fsl_castType(fsl_runArgument(args[1],id),"number")[0];
                let iter = fsl_runArgument(args[0],id);
                const iter_id = iter[2]["ref"];
                const step = fsl_castType(fsl_runArgument(args[2],id),"number")[0];
                for (let i = 0; i < times; i++) {
                    fsl_runSegment(command["content"],id);
                    if (i < times - 1) {
                        fsl_memory[iter_id][0] += step;
                    }
                }
                return;
            }
            if (args.length == 3 && !Array.isArray(args[1]) && Array.isArray(args[2])) { // for (i = 1, i <= 5, 1) {}
                if (args[0]["type"] != "assignment") { fsl_error("arg 1 must be assignment") }
                let iter = fsl_runArgument(args[0],id);
                const iter_id = iter[2]["ref"];
                const step = fsl_castType(fsl_runArgument(args[2],id),"number")[0];
                while (fsl_castType(fsl_runArgument(args[1],id),"bool")[0]) {
                    fsl_runSegment(command["content"],id);
                    fsl_memory[iter_id][0] += step;
                }
                return;
            }
            if (args.length == 3 && !Array.isArray(args[1]) && !Array.isArray(args[2])) { // for (i = 1, i <= 5, i ++) {}
                if (args[0]["type"] != "assignment") { fsl_error("arg 1 must be assignment") }
                let iter = fsl_runArgument(args[0],id);
                while (fsl_castType(fsl_runArgument(args[1],id),"bool")[0]) {
                    fsl_runSegment(command["content"],id);
                    fsl_runArgument(args[2],id);
                }
                return;
            }
            if (args.length == 3 && Array.isArray(args[1]) && !Array.isArray(args[2])) { // for (i = 1, 5, i ++) {}
                if (args[0]["type"] != "assignment") { fsl_error("arg 1 must be assignment") }
                const times = fsl_castType(fsl_runArgument(args[1],id),"number")[0];
                let iter = fsl_runArgument(args[0],id);
                const iter_id = iter[2]["ref"];
                for (let i = 0; i < times; i++) {
                    fsl_runSegment(command["content"],id);
                    if (i < times - 1) {
                        fsl_runArgument(args[2],id);
                    }
                }
                return;
            }
            fsl_error("unknown for syntax");
            break
        default:
            const func_key = fsl_memory[fsl_memory[id]["scope"][command["id"]]];
            if (func_key) {
                const func = fsl_memory[func_key[0]];
                const ast = fsl_memory[func["parent"]];
                fsl_runAst(ast, func["key"], args);
            }
            break
    }
}
function fsl_runArguments(args, id) {
    var out = [];
    for (let i = 0; i < args.length; i++) {
        out.push(fsl_runArgument(args[i], id));
    }
    return out;
}
function fsl_runArgument(content, id, ref="", flags = []) {
    if (Array.isArray(content)) {
        return content; // argument is a value, no need to eval it.
    }
    if (!content) {
        fsl_error("invalid argument", "ast");
        return [null, "null"];
    }
    if (!ref) {
        ref = "";
    }
    if (typeof flags !== 'object') {
        flags = []
    }
    switch (content["type"]) {
        case "operation": // 5 + 3
            let oper_data = content["data"];
            let oper_val = fsl_runArgument(oper_data[0], id);
            for (let oper_i = 0; oper_i < oper_data.length; oper_i++) {
                const op = oper_data[oper_i];
                switch (op) {
                    case "+": case "++": case "-": case "*": case "/":
                        oper_i ++;
                        oper_val = fsl_runOperation(op, fsl_runArgument(oper_val, id), fsl_runArgument(oper_data[oper_i], id));
                        break
                }
            }
            return oper_val;
        case "comparison": // 5 == 3
            return fsl_runComparison(
                content["id"],
                fsl_runArgument(content["a"],id), 
                fsl_runArgument(content["b"],id)
            );
        case "reference": // myVar
            const ref_scope = fsl_memory[id]["scope"];
            const ref_key = content["key"];
            if (Object.keys(ref_scope).includes(ref_key)) {
                const ref_id = ref_scope[ref_key];
                let val = fsl_memory[ref_id];
                if (!val) { fsl_error("reference to mem '" + ref_id + "', but doesnt exist","internal") }
                if (val.length == 2) {val[2] = {}}
                if (typeof(val[2]) != "object") {val[2] = {}}
                val[2]["ref"] = ref_id;
                return val;
            } else {
                if (!flags.includes("nokill")) {
                    fsl_error("unknown variable '" + content["key"] + "'")
                }
            }
            return [null,"null"];
        case "object": // {"key":"value"}
            let obj = {};
            for (let keyi = 0; keyi < content["keys"].length; keyi++) {
                const key_id = makeid(15);
                fsl_memory[key_id] = fsl_runArgument(content["values"][keyi],id);
                obj[content["keys"][keyi]] = key_id;
            }
            return [obj,"object"];
        case "array": // ["value"]
            let arr = [];
            for (let keyi = 0; keyi < content["values"].length; keyi++) {
                const key_id = makeid(15);
                fsl_memory[key_id] = fsl_runArgument(content["values"][keyi],id);
                arr.push(key_id);
            }
            return [arr,"array"];
        case "key_get": // obj["key"]
            return fsl_getKey(fsl_runArgument(content["value"],id), content["keys"], id, flags.includes("nokill"));
        case "methods": // value.myMethod()
            let method_val = fsl_runArgument(content["value"],id);
            const method_list = content["list"];
            for (let i = 0; i < method_list.length; i++) {
                const method = method_list[i];
                switch (method["type"]) {
                    case "method":
                        method_val = fsl_runMethod(method_val,method["key"],method["args"],id);
                        break
                    case "get_key":
                        method_val = fsl_getKey(method_val,[method["key"],"string"]);
                        break
                    default:
                        fsl_error("unknown method type " + method["type"],"ast");
                }
            }
            return method_val;
        case "assignment": // var = value
            return fsl_setAssignment(content["key"], content["value"], id);
        case "assignment_math": // var ++
            let assign_val = fsl_runArgument(content["key"], id);
            switch (content["id"]) {
                case "inc":
                    return fsl_setAssignment(content["key"], fsl_runOperation("+",assign_val,[1,"number"]), id);
                case "inc_by":
                    return fsl_setAssignment(content["key"], fsl_runOperation("+",assign_val,fsl_runArgument(content["value"],id)), id);
                case "dec":
                    return fsl_setAssignment(content["key"], fsl_runOperation("-",assign_val,[1,"number"]), id);
                case "dec_by":
                    return fsl_setAssignment(content["key"], fsl_runOperation("-",assign_val,fsl_runArgument(content["value"],id)), id);
            }
            return [null,"null"];
        case "logic": // true && false
            const lgc_data = content["data"];
            let lgc_val = fsl_runArgument(lgc_data[0],id);
            for (let lgc_token = 1; lgc_token < lgc_data.length; lgc_token++) {
                const token = lgc_data[lgc_token];
                switch (token) {
                    case "and":
                        lgc_token ++;
                        let lgc_and_value = fsl_castType(fsl_runArgument(lgc_data[lgc_token],id),"bool");
                        if (lgc_and_value[1] != "bool") {
                            fsl_error("value isnt bool");
                            return [false, "bool"]
                        }
                        lgc_val = lgc_val && lgc_and_value[0];
                        break
                    case "or":
                        lgc_token ++;
                        let lgc_or_value = fsl_castType(fsl_runArgument(lgc_data[lgc_token],id),"bool");
                        if (lgc_or_value[1] != "bool") {
                            fsl_error("value isnt bool");
                            return [false, "bool"]
                        }
                        lgc_val = lgc_val || lgc_or_value[0];
                        break
                    default:
                        fsl_error("unexpected value '" + fsl_castType(token, "string"));
                        return [false, "false"];
                }
            }
            return [lgc_val,"bool"];
        case "invert": //\ !value
            // run the value, then convert it to a bool, then invert it, then return
            return [!(fsl_castType(fsl_runArgument(content["value"],id),"bool")[0]),"bool"];
        case "boolify": //\ ?value
            // run the value, then convert it to a bool, then return
            return [fsl_castType(fsl_runArgument(content["value"],id),"bool")[0],"bool"];
        case "cast": // (type)value
            const casts = content["casts"];
            let cast_value = fsl_runArgument(content["value"],id);
            for (let casti = 0; casti < casts.length; casti++) {
                const cast = casts[casti];
                if (!Array.isArray(cast)) {
                    // if it simply just a type cast.
                    cast_value = fsl_castType(cast_value, cast)
                }
            }
            return cast_value;
        case "command": // myFunc()
            const func_key = fsl_runArgument(content["key"], id);
            if (func_key) {
                if (Object.values(fsl_function_memids).includes(func_key[0])) {
                    const args = fsl_runArguments(content["args"],id);
                    const out = fsl_runBaseFunc(func_key[0], args);
                    if (Array.isArray(out)) {
                        return out;
                    }
                } else {
                    const func = fsl_memory[func_key[0]];
                    if (func) {
                        const args = fsl_runArguments(content["args"],id);
                        const ast = fsl_memory[func["parent"]];
                        const out = fsl_runAst(ast, func["key"], args);
                        if (Array.isArray(out)) {
                            return out;
                        }
                    } else {
                        fsl_error("unknown function '" + content["key"]["key"] + "'")
                    }
                }
            }
            return [null, "null"];
        case "pointer": //\ *variable
            let ref_val = fsl_runArgument(content["value"], id);
            if (ref_val.length == 2) { fsl_error("cannot point to non-referenced value") }
            if (!ref_val[2]["ref"]) { fsl_error("cannot point to non-referenced value") }
            return [ref_val[2]["ref"],"pointer"];
        case "function": // fn() {}
            if (true) {
                const fn_id = "infn_" + makeid(15);
                const fn_astid = "infnast_" + makeid(15);
                fsl_memory[fn_astid] = {"functions":{"FSLINTinlineFunc":content}}
                fsl_memory[fn_id] = {
                    "parent": fn_astid,
                    "key": "FSLINTinlineFunc",
                    "content": content
                }
                if (content["runArgs"]) {
                    return fsl_runAst(
                        {"functions":{"FSLINTinlineFunc":content}},
                        "FSLINTinlineFunc",
                        fsl_runArguments(content["runArgs"],id)
                    );
                }
                return [
                    fn_id,"function"
                ]
            }
            break
        default:
            fsl_error("unknown argument type '" + content["type"] + "'", "ast")
    }
    return [null, "null"];
}

function fsl_runOperation(op,a,b) {
    switch (op) {
        case "+":
            if (a[1] == "number" && b[1] == "number") {
                return [a[0] + b[0], "number"];
            }
            a = fsl_castType(a, "string")
            if (a[0] == "") {
                return [fsl_castType(b, "string")[0],"string"];
            }
            return [a[0] + " " + fsl_castType(b, "string")[0], "string"];
        case "++":
            return [fsl_castType(a, "string")[0] + fsl_castType(b, "string")[0], "string"];
        case "-":
            a = fsl_castType(a,"number");
            b = fsl_castType(b,"number");
            if (a[1] == "number" && b[1] == "number") {
                return [a[0] - b[0], "number"];
            }
            fsl_error("cannot subtract " + b[1] + " from " + a[1]);
            return [null,"null"];
        case "*":
            if (a[1] == "number" && b[1] == "number") {
                return [a[0] * b[0], "number"];
            }
            b = fsl_castType(b,"number");
            if (a[1] == "string" && b[1] == "number") {
                let num = fsl_castType(b, "number")[0];
                if (num % 1 != 0) {
                    fsl_error("cannot repeat string by decimal");
                    return ["","string"];
                }
                return [fsl_castType(a, "string")[0].repeat(num), "string"];
            }
            fsl_error("cannot multiply " + b[1] + " by " + a[1]);
        case "/":
            a = fsl_castType(a,"number");
            b = fsl_castType(b,"number");
            if (a[1] == "number" && b[1] == "number") {
                return [a[0] / b[0], "number"];
            }
            fsl_error("cannot subtract " + b[1] + " from " + a[1]);
            return [null,"null"];
    }
    return [null, "null"];
}
function fsl_runComparison(op, a, b) {
    switch (op) {
        case "equal":
            return [Object.isSame(a,b), "bool"];
        case "not_equal":
            return [!Object.isSame(a,b), "bool"];
        case "string_equal":
            return [fsl_castType(a,"string")[0] == fsl_castType(b,"string")[1], "bool"];
        case "type_equal":
            return [fsl_isTypeEqual(a[1],b[1]),"bool"];
        case "greater": case "smaller": case "greater_equal": case "smaller_equal":
            a = fsl_castType(a, "number");
            b = fsl_castType(b, "number");
            
            if (a[1] != "number" || b[1] != "number")
                return [false,"bool"];
            
            switch (op) {
                case "greater":
                    return [a[0] > b[0], "bool"]
                case "smaller":
                    return [a[0] < b[0], "bool"]
                case "greater_equal":
                    return [a[0] >= b[0], "bool"]
                case "smaller_equal":
                    return [a[0] <= b[0], "bool"]
            }
            return [false,"bool"]
    }
}
function fsl_runMethod(baseVal,key,args,id) {
    const value = baseVal[0];
    const type = baseVal[1];

    args = fsl_runArguments(args,id);

    let temp = fsl_method_args[type];
    if (temp) {
        temp = temp[key];
        if (temp) {
            const argRawTypes = args.map((v) => v[1]);
            for (let i = 0; i < argRawTypes.length; i++) {
                const atype = temp[i];
                args[i] = fsl_castType(args[i],atype,false);
            }
            const argTypes = args.map((v) => v[1]);
            if (!Object.isSame(temp,argTypes)) {
                if (argTypes.length != temp.length) {
                    fsl_error("method got too many/few arguments");
                }
                for (let i = 0; i < argTypes.length; i++) {
                    const arg = argTypes[i];
                    const argExpected = temp[i];
                    if (arg != argExpected) {
                        fsl_error("expected " + argExpected + " got " + arg)
                    }
                }
            }
        }
    }
	
	
    temp = fsl_method_args["global"];
	if (temp) {
        temp = temp[key];
		const argRawTypes = args.map((v) => v[1]);
		for (let i = 0; i < argRawTypes.length; i++) {
			const atype = temp[i];
			args[i] = fsl_castType(args[i],atype,false);
		}
		const argTypes = args.map((v) => v[1]);
		if (!Object.isSame(temp,argTypes)) {
			if (argTypes.length != temp.length) {
				fsl_error("method got too many/few arguments");
			}
			for (let i = 0; i < argTypes.length; i++) {
				const arg = argTypes[i];
				const argExpected = temp[i];
				if (arg != argExpected) {
					fsl_error("expected " + argExpected + " got " + arg)
				}
			}
		}
	}

    switch (type) {
        case "string":
            switch (key) {
                case "upper":
                    return [value.toUpperCase(),"string"]
                case "lower":
                    return [value.toLowerCase(),"string"]
                case "trim":
                    return [value.trim(),"string"]
                case "toCase":
                    switch (args[0][0]) {
                        case "upper":
                            return [value.toUpperCase(),"string"]
                        case "lower":
                            return [value.toLowerCase(),"string"]
                        default:
                            fsl_error("unknown case '" + args[0][0] + "'")
                    }
                case "substring":
                    return [value.substring(args[0][0],args[1][0]),"string"]
                case "replace":
                    return [value.replaceAll(args[0][0],args[1][0]),"string"]
                case "split":
                    return [fsl_createObj(value.split(args[0][0]).map((v) => [v,"string"]),id),"array"]
            }
            break
    }
	switch (key) {
		case "cast":
			return fsl_castType(baseVal,args[0][0]);
		case "toString":
			return fsl_castType(baseVal,"string");
        default:
            fsl_error("no method '" + key + "' for type " + type)
	}
    console.log(value,key,args);
}

function fsl_getKeys(val, keys, id, ref = false) {
    let curval = val;
    for (let keyi = 0; keyi < keys.length; keyi++) {
        const key = keys[keyi];
        if (key["type"] == "key") {
            const key_name = fsl_runArgument(key["value"], id);
            curval = fsl_getKey(curval,key_name,ref);
        }
    }
    return curval;
}
function fsl_getKey(val,key,ref=false) {
    switch (val[1]) {
        case "object":
            return fsl_getKey_Object(val, key, ref);
            break
        case "array":
            return fsl_getKey_Array(val, key, ref);
            break
        default:
            fsl_error("cannot get key from type " + val[1]);
    }
}
function fsl_getKey_Object(original, key, ref = false) {
    switch(key[1]) {
        case "number": case "string":
            if (Object.keys(original[0]).includes(key[0])) {
                let val = fsl_memory[original[0][key[0]]];

                if (val.length == 2) { val[2] = {} }
                val[2]["ref"] = original[0][key[0]];

                return val;
            } else {
                if (ref) {
                    let id = makeid(14);
                    fsl_memory[id] = null;
                    fsl_memory[original[2]["ref"]][0][key[0]] = id;
                    return [null,"null",{"ref":id}];
                }
                fsl_error("key '" + fsl_castType(key,"string")[0] + "' doesnt exist");
                return [null,"null"];
            }
        default:
            fsl_error("cannot get key of type " + key[1] + " from type " + original[1]);
            return [null,"null"];
    }
}
function fsl_getKey_Array(original, key, ref = false, nokill = false) {
    switch(key[1]) {
        case "number":
            let i = key[0]-1;
            let val = "";
            if (i < 0 || key[0] > original[0].length) {
                if (i >= 0 && ref) {
                    let id = makeid(14);
                    fsl_memory[id] = null;
                    val = fsl_memory[original[2]["ref"]];
                    if (i == val[0].length) {
                        val[0].push(id);
                    }
                    return [null,"null",{"ref":id}];
                }
                fsl_error("index out of range")
            }
            val = fsl_memory[original[0][i]];

            if (val.length == 2) { val[2] = {} }
            val[2]["ref"] = original[0][i];

            return val;
        default:
            fsl_error("cannot get key of type " + key[1] + " from type " + original[1]);
            return [null,"null"];
    }
}

function fsl_getAssignment(key,id) {
    return fsl_memory[fsl_memory[id]["scope"][key]];
}
function fsl_setAssignment(key,data,id) {
    const var_data = Object.clone(fsl_runArgument(data, id));
    
    let var_key = fsl_runArgument(key,id,null,["nokill"]);
    if (var_data[1] == "pointer") {
        fsl_memory[id]["scope"][key["key"]] = var_data[0];
        return
    }
    if (!var_key[2]) {
        if (key["type"] == "reference") {
            let vid = makeid(14);
            if (var_data.length == 2) { var_data[2] = {} }
            fsl_memory[vid] = var_data;
            fsl_memory[id]["scope"][key["key"]] = vid;
        }
    } else {
        if (var_key[2]) {
            const vid = var_key[2]["ref"];
            if (vid) {
                fsl_removeMemory(vid);
                fsl_memory[vid] = var_data;
            }
        }
    }

    return var_data;
}

function fsl_removeMemory(id) {
    const value = fsl_memory[id];
    if (Array.isArray(value)) {
        switch (value[1]) {
            case "object":
                let obj_ids = Object.values(value[0]);
                for (let idi = 0; idi < obj_ids.length; idi++) {
                    const id = obj_ids[idi];
                    fsl_removeMemory(id);
                }
                break
            case "array":
                let arr_ids = value[0];
                for (let idi = 0; idi < arr_ids.length; idi++) {
                    const id = arr_ids[idi];
                    fsl_removeMemory(id);
                }
                break
        }
    }
    delete fsl_memory[id];
}

function fsl_stringifyObj(val) {
    let str = "";
    switch (val[1]) {
        case "object":
            for (let i = 0; i < Object.keys(val[0]).length; i++) {
                const key = Object.keys(val[0])[i];
                const value = Object.values(val[0])[i];
                str += "\"" + key + "\"" + ":" + fsl_stringifyObj(fsl_memory[value])[0];
                if (i < Object.keys(val[0]).length - 1) {
                    str += ",";
                }
            }
            str = "{" + str + "}"
            break
        case "array":
            for (let i = 0; i < val[0].length; i++) {
                const value = val[0][i];
                str += fsl_stringifyObj(fsl_memory[value])[0];
                if (i < Object.keys(val[0]).length - 1) {
                    str += ",";
                }
            }
            str = "[" + str + "]"
            break
        case "string":
            str = "\"" + val[0] + "\""
            break
        default:
            str = fsl_castType(val, "string")[0];
            break
    }
    return [str,"string"];
}
function fsl_createObj(obj,mid) {
    if (typeof(obj) != "object") {return obj}

    if (Array.isArray(obj)) {
        let out = [];
        for (let i = 0; i < obj.length; i++) {
            const element = obj[i];
            const id = makeid(21);
            fsl_memory[id] = element;
            fsl_memory[mid]["leftovers"].push(id);
            out.push(id);
        }
        return out;
    } else {
        let out = {};
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const id = makeid(21);
            fsl_memory[id] = obj[key];
            fsl_memory[mid]["leftovers"].push(id);
            out[key] = id;
        }
        return out;
    }
}
function fsl_castType(value, type, error = true) {
    if (!Array.isArray(value)) {
        console.error("[fsl] [error] value ",value," isn't valid");
        return [null,"null"]
    }

    if (value[1] == type) {
        return value;
    }

    if (value.length == 3) {
        if (value[2].explicit === true) {
            let str = "null";
            if (value != null) {
                value.pop();
                str = fsl_castType(value,"string")[0];
            }
            fsl_error("value '" + str + "' is explicit, and cant be casted");
            return value;
        }
    }

    switch (type) {
        case "string":
            if (value[1] == "null") {
                return ["null","string"];
            }
            if (value[1] == "object" || value[1] == "array") {
                return fsl_stringifyObj(value);
            }
            if (value[1] == "function") {
                return ["<func:" + value[0] + ">","string"]
            }
            return [value[0].toString(),"string"];
        case "bool":
            return [!(
                (value[1] === "string" && value[0] === "") ||
                (value[1] === "bool" && value[0] === false) ||
                (value[1] === "array" && value[0].length === 0) ||
                (value[1] === "object" && Object.keys(value[0]).length === 0) ||
                (value[1] === "null")
            ),"bool"];
        case "number":
            if (value[1] == "string") {
                let num = Number(value[0]);
                return [num, "number"];
            }
            if (value[1] == "bool")
                return [value[0] + 0, "number"];
            if (value[1] == "array")
                return [value[0].length, "number"];
            if (value[1] == "object")
                return [Object.keys(value[0]).length, "number"];
            return [0, "number"];
        default:
            if (error) {
                fsl_error("cannot cast '" + value[1] + "' into '" + type + "'");
                return [null,"null"];
            }
            return value;
    }
}
function fsl_format(data, id) {
    let text = "";
    for (let i = 0; i < data.length; i++) {
        text += fsl_castType(data[i], "string")[0];
        if (i < data.length - 1) { // if not last element
            text += ", ";
        }
    }
    return text;
}
function fsl_isType(value, type) {
    return fsl_isTypeEqual(value[1], type);
}
function fsl_isTypeEqual(typeA, typeB) {
    if (typeA === "any")
        return true;
    if (typeB === "any")
        return true;
    return typeA === typeB;
}

export function fsl_log(text, name) {
    if (!name) { name = "fsl" }
    console.log("[" + name + "]" + " " + "[log]" + " " + text);
}
export function fsl_warn(text, name) {
    if (!name) { name = "fsl" }
    console.warn("[" + name + "]" + " " + "[warning]" + " " + text);
}
export function fsl_error(text, name) {
    if (!name) { name = "fsl" }
    console.error("[" + name + "]" + " " + "[error]" + " " + text);
    process.exit(1);
}