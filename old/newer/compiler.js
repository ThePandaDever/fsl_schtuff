import { MD5,randomStr } from "./utils.js"

function flatten(array) {
    var total = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (Array.isArray(element)) {
            total = total.concat(flatten(element));
        } else {
            total.push(element);
        }
    }
    return total;
}
export function compileAst(content) {
    return compileAstRaw(content).join(" ")
}
export function compileAstRaw(content) {
    const id = MD5(JSON.stringify(content));
    const out = [
        ["# ENTRY",
        ["msv",compileReference("print",id),"log"], // make standard val
        ["msv",compileReference("test",id),"test"],
        "-#"]
    ];
    const collected = collectAst(content);
    let mainfunc = null;
    for (let i = 0; i < Object.keys(collected["functions"]).length; i++) {
        const funcKey = Object.keys(collected["functions"])[i];
        const func = Object.values(collected["functions"])[i];
        out.push(compileFunction(func,funcKey,id));
        if (func["key"] == "main") {
            mainfunc = funcKey;
        }
    }
    //console.log(JSON.stringify(collected,null,"    "));
    if (mainfunc) {
        out.push("# main cps call e_" + mainfunc + " ret -#")
    }
    //console.log(flatten(out))
    return flatten(out);
}
function compileSegment(content,id) {
    var data = [[],[]];

    data[0] = compileSegmentContent(content["content"],id);
    data[1] = compileSegmentFunctions(content["functions"],id);

    return data;
}
function compileSegmentFunctions(content,id) {
    var out = [];

    return out;
}
function compileFunction(func,funcKey,id) {
    let out = [];
    // # funcname
    out.push("# e_" + funcKey);
    // func content
    out.push(compileSegmentContent(func["content"],id));
    // end func
    out.push("-#");
    return out;
}
function compileSegmentContent(content,id) {
    var out = [];

    if (!content || content.length == 0) { return []; }

    const segmentContent = content["content"];
    for (let i = 0; i < segmentContent.length; i++) {
        const node = segmentContent[i];
        out.push(compileNode(node,id));
    }

    return out;
}
function compileNode(content,id) {
    var out = [];

    switch (content["type"]) {
        case "execution":
            if (content["args"].length > 0) {
                var argids = [];
                for (let i = 0; i < content["args"].length; i++) {
                    const arg = compileNode(content["args"][i],id);
                    const argid = compileReference(JSON.stringify(arg),id);

                    const argout = [arg,["svm",argid]];
                    out.push(argout);
                    argids.push(argid);
                }
                out.push("cps"); // clear param stack
                for (let argi = 0; argi < argids.length; argi++) {
                    out = out.concat(["aps",argids[argi]])
                }
            }
            out.push(compileNode(content["key"],id));
            out.push("exc"); // execute
            if (content["args"].length > 0) {
                for (let argi = 0; argi < argids.length; argi++) {
                    out = out.concat(["dlm",argids[argi]]); // delete remaining memory (delete memory)
                }
            }
            break
        case "reference":
            out.push("ldm"); // load memory
            out.push(compileReference(content["key"],id));
            break
        case "literal":
            const literal_data = content["data"];
            switch (literal_data[1]) {
                case "string":
                    out.push(["scv",`\"${literal_data[0].replaceAll(/"/g,"\\\"")}\"`]); // set current value
                    break
                case "number":
                    out.push(["scv",literal_data[0]]);
                    break
                case "bool":
                    out.push(["scv",String(literal_data[0])]);
                    break
                default:
                    console.warn("needs compilation for literal type " + literal_data[1]);
            }
            break
        case "operator":
            const op_a = compileNode(content["a"]);
            const op_b = compileNode(content["b"]);
            const op_a_ref = compileReference(JSON.stringify(op_a)+"a",id);
            const op_b_ref = compileReference(JSON.stringify(op_b)+"b",id);
            return [op_a,"svm",op_a_ref,op_b,"svm",op_b_ref,{"+":"add","-":"sub","*":"mul","/":"div"}[content["operator"]],op_a_ref,op_b_ref];
        case "logic":
            const lg_a = compileNode(content["a"]);
            const lg_b = compileNode(content["b"]);
            const lg_a_ref = compileReference(JSON.stringify(lg_a)+"a",id);
            const lg_b_ref = compileReference(JSON.stringify(lg_b)+"b",id);
            return [lg_a,"svm",lg_a_ref,lg_b,"svm",lg_b_ref,{"or":"or","and":"and"}[content["operator"]],lg_a_ref,lg_b_ref];
        case "comparison":
            const co_a = compileNode(content["a"]);
            const co_b = compileNode(content["b"]);
            const co_a_ref = compileReference(JSON.stringify(co_a)+"a",id);
            const co_b_ref = compileReference(JSON.stringify(co_b)+"b",id);
            return [co_a,"svm",co_a_ref,co_b,"svm",co_b_ref,{
                "equal":"eql",
                "not_equal":["eql","inv"],
                "string_equal":["ldm",co_a_ref,"str","svm",co_a_ref,"ldm",co_b_ref,"str","svm",co_b_ref,"eql"],
                "type_equal":"tql",
                "greater":"gtr",
                "smaller":"sml",
                "greater_equal":"geq",
                "smaller_equal":"seq"
            }[content["comparison"]],co_a_ref,co_b_ref];
        case "spaced command":
            switch (content["name"]) {
                case "return":
                    return [
                        compileNode(content["data"]),
                        "ret"
                    ]
                default:
                    console.warn("unknown spaced command " + content["name"]);
                    break
            }
        case "assignment":
            console.log(content);
            switch (content["assignment"]) {
                case "set":
                    return [
                        compileNode(content["key"]),"gma","svm",compileReference(content["key"]+"ref",id),
                        compileNode(content["value"]),"smr",compileReference(content["key"]+"ref",id)
                    ]
                default:
                    console.warn("unknown assignment type " + content["assignment"]);
            }
            break
        default:
            console.warn("needs compilation for " + content["type"]);
            break
    }

    return out;
}
function compileReference(key,id) {
    return MD5(key + id)
}
function collectAst(content) {
    return collectSegment(content);
}
function collectSegment(content) {
    var data = {"functions":{}};
    if (Object.keys(content).includes("functions")) {
        data = Object.merge(data,{"functions":content["functions"]});
        for (let i = 0; i < Object.keys(content["functions"]).length; i++) {
            const k = Object.keys(content["functions"])[i];
            const v = Object.values(content["functions"])[i];
            data = Object.merge(data,collectSegment(v["content"]))
        }
    }
    return data;
}