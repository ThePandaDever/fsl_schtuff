
const memory = {};

function split(text, type) {
    text = text.trim();
    const tokens = [];
    let current = "";

    let bracketDepth = 0,
        curlyDepth = 0,
        squareDepth = 0,
        arrowDepth = 0;
    let inSingle = false,
        inDouble = false,
        inTick = false;
    
    const brackets = {"bracket":["(",")"],"curly":["{","}"],"square":["[","]"],"arrow":["<",">"]}[type] ?? ["",""]; // get the bracket pairs
    const open = brackets[0],
        close = brackets[1];
    const splitChar = type.length === 1 ? type : "";
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char == "\\") { current += char + text[i + 1]; i ++; continue; }

        if (char == "'" && !(inDouble || inTick))
            inSingle = !inSingle;
        if (char == "\"" && !(inSingle || inTick))
            inDouble = !inDouble;
        if (char == "`" && !(inSingle || inDouble))
            inTick = !inTick;

        const inQuotes = inSingle || inDouble || inTick;

        if (inQuotes) {
            current += char;
            continue;
        }

        if (char === "(")
            bracketDepth ++;
        if (char === ")")
            bracketDepth --;
        if (char === "{")
            curlyDepth ++;
        if (char === "}")
            curlyDepth --;
        if (char === "[")
            squareDepth ++;
        if (char === "]")
            squareDepth --;
        if (char === "<")
            arrowDepth ++;
        if (char === ">")
            arrowDepth --;
        
        if (char === open && 
            bracketDepth == (type == "bracket" ? 1 : 0) &&
            curlyDepth == (type == "curly" ? 1 : 0) &&
            squareDepth == (type == "square" ? 1 : 0) &&
            arrowDepth == (type == "arrow" ? 1 : 0)
        ) {
            tokens.push(current.trim());
            if (text[i+1] == close && !tokens[tokens.length - 1])
                tokens.push("");
            else
                current = ")";
            current = open;
            continue;
        }
        if (char === close && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            current += close;
            continue;
        }

        if (char === splitChar && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            tokens.push(current);
            current = "";
            continue;
        }

        current += char;
    }

    if (current) {
        tokens.push(current.trim());
    }

    return tokens;
}

function has(text, type) {
    text = text.trim();
    const tokens = [];
    let current = "";

    let bracketDepth = 0,
        curlyDepth = 0,
        squareDepth = 0,
        arrowDepth = 0;
    let inSingle = false,
        inDouble = false,
        inTick = false;
    
    const brackets = {"bracket":["(",")"],"curly":["{","}"],"square":["[","]"],"arrow":["<",">"]}[type] ?? ["",""]; // get the bracket pairs
    const open = brackets[0],
        close = brackets[1];
    const splitChar = type.length === 1 ? type : "";
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char == "\\") { current += char + text[i + 1]; i ++; continue; }

        if (char == "'" && !(inDouble || inTick))
            inSingle = !inSingle;
        if (char == "\"" && !(inSingle || inTick))
            inDouble = !inDouble;
        if (char == "`" && !(inSingle || inDouble))
            inTick = !inTick;

        const inQuotes = inSingle || inDouble || inTick;

        if (inQuotes) {
            current += char;
            continue;
        }

        if (char === "(")
            bracketDepth ++;
        if (char === ")")
            bracketDepth --;
        if (char === "{")
            curlyDepth ++;
        if (char === "}")
            curlyDepth --;
        if (char === "[")
            squareDepth ++;
        if (char === "]")
            squareDepth --;
        if (char === "<")
            arrowDepth ++;
        if (char === ">")
            arrowDepth --;
        
        if (char === open && 
            bracketDepth == (type == "bracket" ? 1 : 0) &&
            curlyDepth == (type == "curly" ? 1 : 0) &&
            squareDepth == (type == "square" ? 1 : 0) &&
            arrowDepth == (type == "arrow" ? 1 : 0)
        ) {
            return true;
        }
        if (char === close && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            return true;
        }

        if (char === splitChar && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            return true;
        }

        current += char;
    }

    return false;;
}

function is(text, type) {
    const first = text[0],
        last = text[text.length - 1];
    
    const pairs = {
        "bracket": ["(",")"],
        "curly":["{","}"],
        "square":["[","]"],
        "arrow":["<",">"],
        "single-q":["'","'"],
        "double-q":['"','"'],
        "back-q":["`","`"]
    }

    const pair = pairs[type];
    return pair ? (first === pair[0] && last === pair[1]) : false;
}

function unExcape(text) {
    let current = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char == "\\") { current += text[i + 1]; i ++; continue; }

        current += char;
    }
    return current;
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

function allocate(value) {
    const id = generateRandom();
    memory[id] = value;
    return id;
}
function deallocate(id) {
    delete memory[id];
}

class Node {
    constructor(code) {
        this.code = code.trim();
        this.parse()
    }
    parse() {
        if (has(this.code, ";")) {
            const elements = split(this.code, ";");
            this.type = "segment";
            this.elements = elements.filter(e => e.trim() != "").map(e => new Node(e));
            return;
        }
        
        const bracketTokens = split(this.code, "bracket");
        if (is(bracketTokens[bracketTokens.length - 1],"bracket")) {
            const bracket = bracketTokens.pop();
            this.type = "execution";
            this.args = new List(bracket.slice(1,-1));
            this.key = new Node(bracketTokens.join(""));
            return;
        }

        if (is(this.code,"single-q") || is(this.code,"double-q") || is(this.code,"back-q")) {
            this.type = "string";
            this.data = unExcape(this.code.slice(1,-1));
            return;
        }

        if (/^[^'"`]*[a-zA-Z_1-9][^'"`]*$/.test(this.code)) {
            this.type = "variable";
            this.key = this.code;
            return;
        }

        throw Error("unexpected tokens: '" + this.code.trim().split("\n").map(l => l.trim()).join("\\n") + "'");
    }

    run(scope) {
        scope ??= new Scope();
        //console.log(this);
        switch (this.type) {
            case "segment": {
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    scope.newLayer();
                    console.log(scope);
                    const out = element.run(scope);
                    scope.exitLayer();
                    if (out instanceof ReturnValue) {
                        return out;
                    }
                }
                return new Undefined();
            }
            case "execution": {
                const key = this.key.run(scope);
                const args = this.args.run(scope);
                key.execute(args);
                break;
            }
            case "variable":
                return scope.get(this.key) ?? new Undefined();
            
            case "string":
                return new StringValue(this.data);

            default:
                throw Error("cannot run node of type '" + this.type + "'");
        }
    }
}
class List {
    constructor(code) {
        this.code = code;
        this.parse();
    }
    parse() {
        const elements = split(this.code, ",");
        this.type = "list";
        this.elements = elements.map(e => new Node(e));
    }
    run(scope) {
        return this.elements.map(e => e.run(scope));
    }
}

class Value {
    constructor(...params) {
        this.instance(...params);
    }

    instance() {
        this.type = "unknown";
    }

    stringify() {
        return `<unknown>`;
    }
    execute(args) {
        return ErrorValue()
    }
}

class Null extends Value {
    instance() {
        this.type = "null";
        this.data = "null";
    }

    stringify() {
        return `<null>`;
    }
}
class Undefined extends Null {
    instance() {
        super.instance();
        this.data = "undefined";
    }

    stringify() {
        return `<null:undefined>`;
    }
}
class ReturnValue extends Value {
    instance(value) {
        this.value = value;
    }
}
class ErrorValue extends Value {
    instance(scope, type, text) {
        this.type = "error";
        this.errorType = type;
        this.text = text;
    }
}

class StringValue extends Value {
    instance(data) {
        this.type = "str";
        this.data = data ?? "";
    }
}

class Scope {
    constructor(variables) {
        variables ??= {};
        this.layers = [];
    }

    newLayer(variables) {
        this.layers.push(new ScopeLayer(variables));
    }
    exitLayer() {
        const layer = this.layers.pop();
        layer.dissolve();
        return layer;
    }

    get(key) {
        return memory[this.getRef(key)];
    }
    getRef(key) {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            const r = layer.getRef(key);
            if (r)
                return r;
        }
    }
}
class ScopeLayer {
    constructor(variables) {
        variables ??= {};
        variables = Object.fromEntries(
            Object.entries(variables).map(([key, value]) => [key, allocate(value)])
        );
        this.variables = variables;
    }

    dissolve() {
        const refs = Object.values(this.variables);
        for (let i = 0; i < refs.length; i++) {
            deallocate(refs[i]);
        }
    }

    get(key) {
        return memory[this.getRef(key)];
    }
    getRef(key) {
        return this.variables[key];
    }
}

class Script extends Value {
    constructor(data) {
        super();
        this.ast = new Node(data["code"] ?? "");
    }

    run(func) {
        this.ast.run();
    }
}


const myScript = new Script({
    code: `
        print("sillies");
        print("wow");
    `
});
myScript.run(); // if u dont give it a function name it just runs root
