
function splitCode(code) {
    let tokens = [""];
    const splitChars = [
        "\"",
        "'",
        "`",
        "(",")",
        "[","]",
        "{","}",
        "<",">",
        ";",
        ":",
        ",",
        ".",
        "+","-","/","*",
        "|","&",
        " ",
        "\n",
    ]
    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        if (splitChars.includes(char)) {
            if (tokens[tokens.length - 1] == "") {
                tokens[tokens.length - 1] += char;
            } else {
                tokens.push(char);
            }
            tokens.push("");
        } else {
            tokens[tokens.length - 1] += char;
        }
    }
    return tokens;
}

let randomI = 0;
function generateRandom() {
    randomI ++;
    /*
    let str = "";
    for (let i = 0; i < 10; i++) {
        str += String(Math.sin(i * 14.45167 + (randomI * 24.22415))).slice(3,5);
    }
    return str;
    */
    return randomI.toString();
}
function stackElem(name) {
    return {"name": name};
}

const isValidVariable = (text) => /^[A-Za-z0-9_]+$/.test(text)
const memory = {};

const rules = {
    operators: {
        "+": "add",
        "++": "join",
        "-": "sub",
        "*": "mul",
        "/": "div",
        "%": "mod",
        "^": "pow"
    }
};

class Scope {
    constructor(base = null) {
        if (base instanceof Scope) {
            this.variables = { ...base.variables };
        } else if (base instanceof Object) {
            this.variables = Object.fromEntries(
                Object.entries(base).map(([key, value]) => [key, allocate(value)])
            );
        } else {
            this.variables = {};
        }
    }
    get(name, instance) {
        return memory[this.getAddress(name, instance)] ?? Value.getUndefined();
    }
    getAddress(name, instance) {
        return this.variables[name] ?? (instance ? instance.scope.getAddress(name, null) : null);
    }
    set(name,value) {
        if (value) {
            this.variables[name] = allocate(value);
        }
    }
}

class Node {
    constructor(code, flags = []) {
        this.parse(code, flags);
    }
    parse(code, flags = []) {
        this.kind = "unknown";
        this.rawText = code;

        const tokens = splitCode(code);

        let parenDepth = 0,
            squareDepth = 0,
            curlyDepth = 0,
            angleDepth = 0;
        
        let inSingle = false,
            inDouble = false,
            inQuote = false;
        
        let tokenStack = [];
        let tokenStack2 = [];

        if (flags.includes("list")) {
            this.kind = "list";
            this.data = [];
        }

        if (flags.includes("segment")) {
            this.kind = "segment";
            this.data = [];
        }

        //console.log("(",code.trim(),")");

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token === "'" && !(inDouble || inQuote))
                inSingle = !inSingle;
            if (token === "\"" && !(inSingle || inQuote))
                inDouble = !inDouble;
            if (token === "`" && !(inSingle || inDouble))
                inQuote = !inQuote;

            const inQuotes = inSingle || inDouble || inQuote;
            const inBrackets = parenDepth != 0 || squareDepth != 0 || curlyDepth != 0 || angleDepth != 0;

            if ((token === "" || token == "\n") && !inQuotes) continue // skip useless tokens

            tokenStack.push(token);
            tokenStack2.push(token);
            
            if (token === "'" || token === "\"" || token === "`") {
                if (this.kind == "unknown" && inQuotes)  {
                    this.kind = "string";
                    this.data = "";
                }
                continue
            }

            if (inQuotes) {
                if (this.kind == "string") {
                    this.data += token;
                }
                continue;
            } else if (!inBrackets && !["list","segment"].includes(this.kind)) {
                const isNumeric=t=>/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);
                if (isNumeric(token) && this.kind == "unknown") {
                    this.kind = "number";
                    this.data = Number(token);
                    continue;
                }

                if (Object.keys(rules.operators).map(v => v[0]).includes(token[0])) {
                    try {
                        let isOp = false;
                        let best = null;
                        let besti = 0;
                        let bestname = "";
                        for (let opi = 0; opi < Object.keys(rules.operators).length; opi++) {
                            const key = Object.keys(rules.operators)[opi];
                            const name = Object.values(rules.operators)[opi];
                            const opTokens = splitCode(key).filter(v => v.length != 0);
                            const checkTokens = tokens.slice(i, i + opTokens.length);
                            //console.log(opTokens,checkTokens,opTokens.every((t, i2) => t === checkTokens[i2]));
                            if (opTokens.every((t, i2) => t === checkTokens[i2])) {
                                if (!Array.isArray(best) || checkTokens.length > best.length) {
                                    best = opTokens;
                                    besti = i;
                                    bestname = name;
                                }
                            }
                        }
                        if (best) {
                            isOp = true;
                            let can = false;
                            try {
                                const n = new Node(tokens.slice(besti+best.length).join(""));
                                can = n.kind !== "operation";
                            } catch {}
                            if (can) {
                                oldThis = this;
                                this.kind = "operation";
                                this.data = bestname;
                                this.a = oldThis;
                                this.b = new Node(tokens.slice(besti+best.length).join(""));
                            }
                            i += best.length - 1;
                            continue;
                        }
                    } catch {}
                }
            }

            if (isValidVariable(token) && this.kind == "unknown") {
                this.kind = "variable";
                this.data = token;
                continue;
            }

            if (token === "(") parenDepth ++
            if (token === "[") squareDepth ++
            if (token === "{") curlyDepth ++
            if (token === "<") angleDepth ++

            if (token === ")") parenDepth --
            if (token === "]") squareDepth --
            if (token === "}") curlyDepth --
            if (token === ">") angleDepth --

            if (token === "(" && parenDepth === 1 && !["list","segment","operation"].includes(this.kind)) {
                this.kind = "execution";
                this.data = new Node(tokenStack.slice(0, -1).join(""));
                this.arguments = new Node("");
                tokenStack = [];
                continue;
            }
            if (token === ")" && parenDepth === 0) {
                if (this.kind == "execution") {
                    this.arguments = new Node(tokenStack.slice(0, -1).join(""), ["list"]);
                }
                continue;
            }

            if (flags.includes("list") && tokenStack.length > 0) {
                if (token === ",") {
                    this.data.push(new Node(tokenStack.slice(0, -1).join("")));
                    tokenStack = [];
                }
                continue;
            }

            if (flags.includes("segment") && tokenStack.length > 0) {
                if (token === ";" || (
                    (token === ")" && parenDepth == 0) ||
                    (token === "]" && squareDepth == 0) ||
                    (token === "}" && curlyDepth == 0)
                )) {
                    this.data.push(new Node(tokenStack.slice(0, -1).join("")));
                    tokenStack = [];
                }
                continue;
            }

            if (parenDepth !== 0)
                continue;

            if (token == " ") continue;

            throw Error("unexpected token '" + token + "'");
        }
        if (flags.includes("list") && tokenStack.length > 0) {
            this.data.push(new Node(tokenStack.join("")));
        }
        if (flags.includes("segment") && tokenStack.length > 0) {
            this.data.push(new Node(tokenStack.join("")));
        }
    }
    stringify(indent = "") {
        let content = "unknown";
        let expand = false;
        switch (this.kind) {
            case "variable":
                content = `${this.data}`;
                break;
            case "execution":
                content = `${indent}    key: ${this.data.stringify(indent + "    ")},\n${indent}    arguments: ${this.arguments.stringify(indent + "    ")}`;
                expand = true;
                break;
            case "list": case "segment":
                content = this.data.map(elem => indent + "    " + elem.stringify(indent + "    ")).join(",\n");
                expand = true;
                break;
            case "operation":
                content = `${indent}    type: ${this.data}\n${indent}    a: ${this.a.stringify(indent + "    ")}\n${indent}    b: ${this.b.stringify(indent + "    ")}`;
                expand = true;
                break;
            
            case "string":
                content = this.data;
                break;
            case "number":
                content = this.data.toString();
                break;

            case "unknown":
                content = this.data;
                break;
        }
        return expand ? `Node: ${this.kind} {\n${content}\n${indent}}` : `Node: ${this.kind} { ${content} }`;
    }
    run(instance, scope) {
        instance ??= new Instance();
        scope ??= new Scope();
        switch (this.kind) {
            case "segment":
                for (let i = 0; i < this.data.length; i++) {
                    const element = this.data[i];
                    const out = element.run(instance, scope) ?? Value.getUndefined();
                    if (out.isError())
                        return out;
                }
                return Value.getUndefined();
            case "list":
                const listData = [];
                for (let i = 0; i < this.data.length; i++) {
                    const valueNode = this.data[i];
                    const value = valueNode.run(instance, scope) ?? Value.getUndefined();
                    if (value.isError()) {
                        return value;
                    }
                    listData.push(value);
                }
                return listData;
            
            case "execution":
                const key = this.data.run(instance, scope);
                const args = this.arguments.run(instance,scope);
                if (key.isError())
                    return key;
                if (args instanceof Value && args.isError())
                    return args;
                
                const out = key.execute(args, instance, scope);
                return out;
            case "operation":
                const a = this.a.run(instance, scope);
                const b = this.b.run(instance, scope);
                console.log(a,b);
                switch (this.data) {
                    case "add":
                        if (a.isTypeStr("num") && b.isTypeStr("num"))
                            return new Value(a.value + b.value, "num");
                        return new Value(a.stringify() + " " + b.stringify(), "str");
                    case "join":
                        return new Value(a.stringify() + b.stringify(), "str");
                    case "sub":
                        if (a.isTypeStr("num") && b.isTypeStr("num"))
                            return new Value(a.value + b.value, "num");
                        return a.isTypeStr("num") ? 
                            ErrorValue.throw(instance, "InvalidOperationSide", this, "wanted num on right side got ", b.getTypeStr()) :
                            ErrorValue.throw(instance, "InvalidOperationSide", this, "wanted num on left side got ", a.getTypeStr());
                }
                return Value.getUndefined();
            
            case "variable":
                const variableValue = scope.get(this.data, instance);
                return variableValue.isUndefined() ? ErrorValue.throw(instance, "UnknownVariableName", this,"unknown variable '",this.data,"'") : variableValue;
            
            case "string": case "number":
                return Value.instanceFromNode(this);
            default:
                return ErrorValue.throw(instance, "UnknownNodeType", this, "unknown node type '", this.kind,"'");
        }
    }
    runWithStack(instance, scope, stackData) {
        instance.addStack(stackData);
        return this.run(instance, scope);
    }
}

class Value {
    constructor(data = null, type = null) {
        this.type = type ?? "null";
        this.data = data ?? "null";
    }

    execute(args, instance, scope) {
        return ErrorValue.throw(instance, "InvalidExecutionType", this, "cannot run value of type " + this.type);
    }
    stringify() {
        return (
            this.type === "func" ? `<func:${this.name}${this.address ? `:${this.address}` : ``}>` :
            this.type === "error" ? `${this.data.type}: ${this.data.text}` :
            this.type === "str" ? `${this.data}` :
            this.type === "num" ? `${this.data}` :
            this.type === "null" ? `${this.data}` :
            `<${this.type}>`
        );
    }

    isError() {
        return this.isTypeStr("error");
    }
    isNull() {
        return this.isTypeStr("null");
    }
    isUndefined() {
        return this.isTypeStr("null") && this.data === "undefined";
    }
    isTypeStr(type) {
        return this.getTypeStr() === type;
    }
    getTypeStr() {
        return this.type;
    }

    static instanceFromNode(node = null) {
        if (node instanceof Node) {
            switch (node.kind) {
                case "string":
                    return new Value(node.data,"str");
                case "number":
                    return new Value(node.data,"num");
                default:
                    throw Error("cannot instance value from node type " + node.kind);
            }
        } else {
            throw Error("cannot instance value from non-node when calling instanceFromNode.");
        }
    }
    static getNull() {
        return new Value();
    }
    static getUndefined() {
        return new Value("undefined", "null");
    }
}

class Func extends Value {
    constructor(type = null, data = null, name = null) {
        const address = allocate(data);
        super(address, "func");
        this.name = name ?? "anon";
        this.func_type = type;
        this.type = "func";
    }

    execute(args, instance, scope) {
        switch (this.func_type) {
            case "js":
                return memory[this.data](instance, scope, ...args);
            default:
                return ErrorValue.throw(instance, "InvalidFunctionType", this, "unknown function type '", this.func_type, "'")
        }
    }
}

class ErrorValue extends Value {
    constructor(data, type, stack, code, ast) {
        super(data, type ?? "error");
        this.stack = stack ?? [{"name":"?"}];
        this.code = code;
        this.ast = ast;
    }

    static getTypes() {
        return [
            "UnknownNodeType",
            "InvalidExecutionType",
            "InvalidFunctionType",
            "UnknownVariableName",
            "InvalidOperationSide",
        ]
    }
    static throw(instance, type, node, ...data) {
        if (!(instance instanceof Instance)) {
            throw Error("instance not supplied");
        }
        if (!this.getTypes().includes) {
            throw Error("unknown error type");
        }
        return new ErrorValue({"type":type,"text":data.join("")}, "error", instance ? instance.stack : [], node.rawText, node.stringify());
    }
}

class Instance {
    constructor() {
        this.scope = new Scope({
            print: new Func("js",function(instance, scope, ...args) {
                instance.data.log(...args);
            },"print"),
        });
        this.resetStack();
        this.data = {};
    }
    addStack(element) {
        if (element) {
            this.stack.push(element);
        }
    }
    resetStack() {
        this.stack = [];
    }
}


class Script {
    constructor(code, name) {
        this.node = new Node(code,["segment"]);
        this.name = name ?? "script";
    }
    run(data, instance, scope, isntRoot) {
        data.log ??= function(txt) { console.log(...txt); }
        data.logwarning ??= function(txt) { console.warn(...txt); }
        data.logerror ??= function(txt) { console.error(...txt); }
        data.error ??= function(err) { console.error(err.stringify()) }

        instance ??= new Instance();
        scope ??= new Scope();
        isntRoot ??= false;

        instance.data = data;

        const out = this.node.runWithStack(instance, scope, stackElem(data["name"]));
        if (!isntRoot && out.isError()) {
            data.error(out);
            return Value.getNull();
        }
        return out;
    }
    stringify(indent) {
        indent ??= "";
        return `${indent}Script: ${this.name} {\n${indent + "    "}${this.node.stringify(indent+"    ")}\n${indent}}`;
    }
}

function allocate(value) {
    const address = generateRandom();
    memory[address] = value;
    return address;
}

const code = `
print(8 - 1 - 41);
`

const a = performance.now();

const s = new Script(code);
const o = s.run({
    name: "script",

    log: function(...txt) {
        console.log(...txt.map(v => v.stringify()));
    },
    error: function(err) {
        const stack = err.stack;
        console.error(`error ${err.stringify()} in ${(stack[stack.length-1] ?? {"name":"unknown"}).name}${err.code ? ` in:\n${err.code.split("\n").map(l => "  " + l.trim()).join("\n")}\n` : ""}${stack.length > 0 ? "  \n  in " : ""}${stack.map(v => v.name).join("\n  in ")}${err.ast ? `\n\n  ast tree:\n${err.ast.split("\n").map(l => "    " + l).join("\n")}` : ""}`);
    }
});

const t = performance.now() - a;
console.log(s.node.stringify());

if (!o.isNull() && !o.isError())
    console.log(o);
