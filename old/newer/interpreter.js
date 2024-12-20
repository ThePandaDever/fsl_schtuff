import { MD5,randomStr } from "./utils.js"

export var memory = {};

const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string);

export function runCompiled(string, env = {}) {
    const code = string.match(/"([^"\\]*(\\.)?)*"|\\.|[^"\s]+/g);
    env = runCompiledFuncRaw(code, "ENTRY");
    env = runCompiledFuncRaw(code, "main", env);
    //console.log(env);
    return env["outval"];
}
export function runCompiledFunc(string, eventName, env = {}) {
    const code = string.match(/"([^"\\]*(\\.)?)*"|\\.|[^"\s]+/g);
    return runCompiledFuncRaw(code, eventName, env);
}
export function runCompiledFuncRaw(code, eventName, env = {}) {
    const env_keys = Object.keys(env);

    if (!env_keys.includes("events")) {env["events"] = {}}
    if (!env_keys.includes("outval")) {env["outval"] = null}
    if (!env_keys.includes("id")) {env["id"] = MD5(randomStr())}
    if (!env_keys.includes("main_val")) {env["main_val"] = ""}
    env["param_stack"] = [];
    const id = env["id"];
    memory[id] = [];

    let current_event = "";
    for (let i = 0; i < code.length; i++) {
        const command = code[i];
        switch (command) {
            case "#":
                i ++;
                env["events"][code[i]] = [i,code.length];
                current_event = code[i];
                break
            case "-#":
                env["events"][current_event][1] = i;
                current_event = "";
                break
            case "msv": i += 2; break
            case "ldm": i ++; break
            case "svm": case "smr": i ++; break
            case "dlm": i ++; break
            case "gma": break
            case "cps": break
            case "aps": i ++; break
            case "exc": break
            case "scv": i ++; break
            case "str": break
            case "eql": i += 2; break
            case "tql": break
            case "inv": break
            case "gtr": case "sml": case "geq": case "seq": i += 2; break
            case "add": case "sub": case "mul": case "div": i += 2; break
            case "and": case "or": i += 2; break
            case "ret": break
            case "call": i ++; break
            default:
                console.error("load",command,i,code[i-1],code.map((item, index) => `${index}: ${item}`));
                break
        }
    }
    const evnt = env["events"][eventName];
    if (!evnt) {return {"outval":null}}
    let running = true;
    let i = evnt[0];
    while (running) {
        i ++;
        if (i >= evnt[1]) {
            running = false;
        }
        const command = code[i];
        switch (command) {
            case "#": i ++; break; case "-#": break
            case "msv": 
                i ++;
                const msv_address = id + "_" + code[i];
                memory[id].push(msv_address);
                i ++;
                memory[msv_address] = code[i]
                break
            case "ldm":
                i ++;
                const ldm_address = id + "_" + code[i];
                env["main_val"] = memory[ldm_address];
                env["memory_address"] = ldm_address;
                break
            case "svm":
                i ++;
                const svm_address = id + "_" + code[i];
                memory[svm_address] = env["main_val"];
                break
            case "smr": // save memory (with) runtime (address)
                i ++;
                const smr_address = runCompiledVal(code[i],env);
                memory[smr_address] = env["main_val"];
                break
            case "dlm":
                i ++;
                const dlm_address = id + "_" + code[i];
                delete memory[dlm_address];
                break
            case "gma": // get memory address
                env["main_val"] = env["memory_address"];
                break
            case "cps":
                env["param_stack"] = [];
                break
            case "aps":
                i ++;
                env["param_stack"].push(runCompiledVal(code[i],env));
                break
            case "exc":
                env = runCompiledExc(env["main_val"],env);
                break
            case "scv":
                i ++;
                env["main_val"] = runCompiledVal(code[i],env);
                break
            case "str":
                env["main_val"] = env["main_val"].toString();
                break
            case "eql":
                env["main_val"] = memory[id + "_" + code[i+1]] == memory[id + "_" + code[i+2]];
                i += 2;
                break
            case "tql":
                env["main_val"] = true;
                break
            case "inv":
                env["main_val"] = !env["main_val"];
                break
            case "gtr": case "sml": case "geq": case "seq":
                i ++;
                const cm_a = memory[id+"_"+code[i]];
                i ++;
                const cm_b = memory[id+"_"+code[i]];
                switch (command) {
                    case "gtr":
                        env["main_val"] = cm_a > cm_b;
                        break
                    case "sml":
                        env["main_val"] = cm_a < cm_b;
                        break
                    case "geq":
                        env["main_val"] = cm_a >= cm_b;
                        break
                    case "seq":
                        env["main_val"] = cm_a <= cm_b;
                        break
                }
                break
            case "add": case "sub": case "mul": case "div":
                i ++;
                const op_a = memory[id+"_"+code[i]];
                i ++;
                const op_b = memory[id+"_"+code[i]];
                switch (command) {
                    case "add":
                        env["main_val"] = op_a + op_b;
                        break
                    case "sub":
                        env["main_val"] = op_a - op_b;
                        break
                    case "mul":
                        env["main_val"] = op_a * op_b;
                        break
                    case "div":
                        env["main_val"] = op_a / op_b;
                        break
                }
                break
            case "and": case "or":
                i ++;
                const lg_a = memory[id+"_"+code[i]];
                i ++;
                const lg_b = memory[id+"_"+code[i]];
                switch (command) {
                    case "and":
                        env["main_val"] = lg_a && lg_b;
                        break
                    case "or":
                        env["main_val"] = lg_a || lg_b;
                        break
                }
                break
            case "ret":
                env["outval"] = env["main_val"];
                return env;
            case "call":
                i ++;
                const call_out = runCompiledFuncRaw(
                    code,
                    code[i],
                    env["param_stack"].reduce((map, value, index) => {
                        map[`p${index}`] = value;
                        return map;
                    }, {})
                )
                env["main_val"] = call_out["outval"];
                break
            default:
                console.error("run",command,i);
                break
        }
    }
    return env;
}
function runCompiledVal(val,env) {
    if (val[0] == "\"" && val[val.length-1] == "\"") {
        return val.slice(1, -1).replace(/\\"/g, '"');
    }
    if (isNumeric(val)) {
        return Number(val);
    }
    if (val == "true") {
        return true;
    }
    if (val == "false") {
        return false;
    }
    if (!Object.keys(memory).includes(env["id"] + "_" + val)) {
        console.log(env["id"] + "_" + val, memory)
    }
    console.log(memory,memory[env["id"] + "_" + val])
    return memory[env["id"] + "_" + val];
}
function runCompiledExc(val,env) {
    switch (val) {
        case "log":
            console.log(env["param_stack"].join(" "))
            break
        case "test":
            env["main_val"] = env["param_stack"][0];
            break
        default:
            console.error("unknown exc " + val)
            break
    }
    return env;
}