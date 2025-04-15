function quit(...text) {
    console.error(...text);
    process.exit();
}

function getValue(value) {
    if (Array.isArray(value)) { return value[0]; }
    return null;
}
function inst(value, type) { return [value, type]; }
function cast(value, type) {
    if (typeof value == "object" && !value) { return inst("null","null"); }
    if (value[1] === type)
        return value;
    switch (type) {
        case "str":
            if (value[1] == "func") {
                return inst("<func>","str");
            }
            return inst(value[0].toString(),"str");
        default:
            quit("cannot cast type", value[1], "to type",type);
    }
}

const fsl_print = [
    function(...args) {
        console.log(args.map(arg => cast(arg, "str")[0]).join(" "));
    },
    "func"
]
// generated code
`;
function compileSegment(segment) {
    let out = "";
    for (let i = 0; i < segment["data"].length; i++) {
        const node = segment["data"][i];
        out += compileNode(node) + ";\n"
    }
    return boilerplate + out
}
function compileNode(node) {
    if (Array.isArray(node)) {
        return `inst(${JSON.stringify(node[0])},${JSON.stringify(node[1])})`;
    }
    switch (node["kind"]) {
        case "execution":
            return `getValue(${compileNode(node["key"])})(${node["args"].map(arg => compileNode(arg)).join(",")})`
        case "variable":
            return `fsl_${node["name"]}`;
        default:
            quit("cannot compile",node["kind"],"\n",node);
    }
}

code = `
print("hello world", print);
`