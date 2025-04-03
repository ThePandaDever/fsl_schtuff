
const memory = {};

function split(text, type, useendbracket) {
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
    const splitChars = (typeof type == "string") ? (type.length === 1 ? type : "") : type;

    const operators = [
        "+","-","*","/","^","%",
        "."
    ]
    
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
        if (char === "<" && type == "arrow")
            arrowDepth ++;
        if (char === ">" && type == "arrow")
            arrowDepth --;
        
        if (char === open && 
            bracketDepth == (type == "bracket" ? 1 : 0) &&
            curlyDepth == (type == "curly" ? 1 : 0) &&
            squareDepth == (type == "square" ? 1 : 0) &&
            arrowDepth == (type == "arrow" ? 1 : 0)
        ) {
            if (current.trim())
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
            if (current.trim())
                tokens.push(current.trim());
            current = "";
            continue;
        }

        if (useendbracket && char === "}" && !operators.includes(text[i + 1]) && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            current += char;
            tokens.push(current.trim());
            current = "";
            continue;
        }

        if (splitChars.includes(char) && bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && arrowDepth == 0) {
            if (current.trim())
                tokens.push(current.trim());
            tokens.push(char);
            current = "";
            continue;
        }

        current += char;
    }

    if (current.trim())
        tokens.push(current.trim());

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

    return false;
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
const generateRandom = () => { randomI ++; return randomI.toString() }


const isNumeric = (t) => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);

function allocate(value) {
    const id = generateRandom();
    memory[id] = value;
    return id;
}
function deallocate(id) {
    delete memory[id];
}

function runOperation(scope, a,b,op) {
    switch (op) {
        case "add":
            if (a.isType("num") && b.isType("num"))
                return new NumberValue(a.data + b.data);
            return new StringValue(a.stringify() + " " + b.stringify());
        case "join":
            return new StringValue(a.stringify() + b.stringify());
        case "sub": case "mul": case "div": case "pow": case "mod":
            a = a.cast(scope, "num"); if (a.shouldReturn()) return a;
            b = b.cast(scope, "num"); if (b.shouldReturn()) return b;
            switch (op) {
                case "sub":
                    if (a.isType("num") && b.isType("num"))
                        return new NumberValue(a.data - b.data);
                case "mul":
                    if (a.isType("num") && b.isType("num"))
                        return new NumberValue(a.data * b.data);
                case "div":
                    if (a.isType("num") && b.isType("num"))
                        return new NumberValue(a.data / b.data);
                case "pow":
                    if (a.isType("num") && b.isType("num"))
                        return new NumberValue(a.data ** b.data);
                case "mod":
                    if (a.isType("num") && b.isType("num"))
                        return new NumberValue(a.data % b.data);
            }
            break;
        default:
            return new ErrorReturn(scope, "UnknownOperation", "unknown operation", op);
    }
}

class Node {
    constructor(code) {
        this.code = code.trim();
        this.parse(this.code)
    }
    parse(code) {
        if (!code) { this.kind = "empty"; return };

        const comparisonTokens = split(code, ["=",">","<","!","~","?"]);
        console.log(code,comparisonTokens);
        if (comparisonTokens.length >= 3) {
            const b = comparisonTokens.pop();
            let comparison = "";
            let token = comparisonTokens.pop();
            while (["=",">","<","!","~","?"].includes(token)) {
                comparison = token + comparison;
                token = comparisonTokens.pop();
            }
            const comparisons = {
                "==": "equal",
                "!=": "not_equal",
                ">": "greater",
                "<": "smaller",
                ">=": "greater_equal",
                "<=": "smaller_equal",
                "~=": "string_equal",
                "?=": "type_equal"
            }
            if (comparisons[comparison]) {
                this.kind = "comparison";
                this.type = comparisons[comparison];
                this.a = new Node(comparisonTokens.join(""));
                this.b = new Node(b);
                return
            }
        }

        // keyPairs (key:value)
        const keyPairTokens = split(code, [":"]);
        if (keyPairTokens.length == 3 && keyPairTokens[1] == ":") {
            this.kind = "keyPair";
            this.key = new Node(keyPairTokens[0]);
            this.value = new Node(keyPairTokens[2]);
            return;
        }

        // ternary
        const ternaryTokens = split(code, ["?",":"]);
        if (ternaryTokens.filter(t => t === "?").length >= 1 && ternaryTokens.filter(t => t === ":").length >= 1) {
            let depth = 0;
            let start = 0;
            let end = 0;
            for (let i = 0; i < ternaryTokens.length; i++) {
                const token = ternaryTokens[i];
                
                if (token === "?") {
                    if (depth === 0)
                        start = i;
                    depth ++;
                }
                if (token === ":") {
                    depth --;
                    if (depth === 0)
                        end = i;
                }
            }
            this.kind = "ternary";
            this.cond = new Node(ternaryTokens.slice(0,start).join(""));
            this.trueVal = new Node(ternaryTokens.slice(start + 1,end).join(""));
            this.falseVal = new Node(ternaryTokens.slice(end + 1).join(""));
            return;
        }

        // functions (no {})
        const functionBracketTokens = split(code, "bracket");
        const functionSpaceTokens = split(functionBracketTokens[0], " ").filter(t => t !== " ");
        if (functionSpaceTokens[0] === "fn" && is(functionBracketTokens[1], "bracket") && !is(functionBracketTokens[2], "curly")) {
            const name = functionSpaceTokens[1];
            
            this.kind = "function";
            this.name = name;
            this.content = new Node(functionBracketTokens.slice(2).join("") ?? "undefined");
            this.params = split(functionBracketTokens[1].slice(1,-1),",").filter(e => e !== ",").map(p => Parameter.parse(p));
            return;
        }

        // operations
        const operatorTokens = split(code, ["+","-","*","/","^","%"]);
        if (operatorTokens.length > 2) {
            const operations = {
                "+": "add",
                "++": "join",
                "-": "sub",
                "*": "mul",
                "/": "div",
                "^": "pow",
                "%": "mod"
            }
            
            const tokens2 = [];
            for (let i = 0; i < operatorTokens.length; i++) {
                const token = operatorTokens[i];
                const token_next = operatorTokens[i + 1];
                const token_before = operatorTokens[i - 1];

                if (token === "+" && token_next === "+") {
                    tokens2.push("++");
                    i ++;
                    continue;
                }

                if (!Object.keys(operations).map(o => o[o.length - 1]).includes(token_next) && Object.keys(operations).map(o => o[o.length - 1]).includes(token_before) && ["+","-"].includes(token)) {
                    tokens2.push(token + token_next);
                    i ++;
                    continue;
                }

                tokens2.push(token);
            }

            this.kind = "operator";
            this.b = new Node(tokens2.pop());
            this.op = tokens2.pop();
            this.op = operations[this.op] ?? this.op
            this.a = new Node(tokens2.join(""));
            return;
        }
        
        // execution
        const bracketTokens = split(code, "bracket");
        if (is(bracketTokens[bracketTokens.length - 1],"bracket")) {
            const bracket = bracketTokens.pop();
            this.kind = "execution";
            this.args = new List(bracket.slice(1,-1));
            this.key = new Node(bracketTokens.join(""));
            return;
        }
        
        // segment ({statement; statement})
        if (is(code, "curly") && !(has(code.slice(1,-1), ",") || has(code.slice(1,-1), ":"))) {
            this.parse(code.slice(1,-1));
            return;
        }
        // segment (statement; statement)
        if (has(code, ";")) {
            const elements = split(code, ";", true).filter(e => e !== ";");
            this.kind = "segment";
            this.elements = elements.filter(e => e.trim() != "").map(e => new Node(e));
            return;
        }

        // property (value.key)
        const propertyTokens = split(code, ".").filter(e => e !== ".");
        if (propertyTokens.length > 1) {
            const property = propertyTokens.pop();
            this.kind = "property";
            this.key = property;
            this.value = new Node(propertyTokens.join("."));
            return;
        }
        
        // keys (value["key"])
        const keyTokens = split(code, "square");
        if (keyTokens.length > 1) {
            const key = keyTokens.pop();
            if (is(key,"square")) {
                this.kind = "key";
                this.key = new Node(key.slice(1,-1));
                this.value = new Node(keyTokens.join(""));
                return;
            }
        }

        // tuples / brackets
        if (is(code, "bracket")) {
            code = code.slice(1,-1);
            const elements = split(code, ",").filter(t => t !== ",");
            if (elements.length == 1) {
                this.parse(code);
            } else {
                this.kind = "tuple";
                this.elements = elements.map(e => new Node(e));
            }
            return;
        }
        
        // arrays
        if (is(code, "square")) {
            code = code.slice(1,-1);
            const elements = split(code, ",").filter(t => t !== ",");
            this.kind = "array";
            this.elements = elements.map(e => new Node(e));
            return;
        }

        if (is(code, "curly")) {
            code = code.slice(1, -1);
            const elements = split(code, ",").filter(t => t !== ",");
            this.kind = "object";
            this.elements = elements.map(e => new Node(e));
            return;
        }

        // functions ({})
        if (functionSpaceTokens[0] === "fn" && is(functionBracketTokens[1], "bracket")) {
            const name = functionSpaceTokens[1];
            
            this.kind = "function";
            this.name = name;
            this.content = new Node(functionBracketTokens.slice(2).join("") ?? "undefined");
            this.params = split(functionBracketTokens[1].slice(1,-1),",").filter(e => e !== ",").map(p => Parameter.parse(p));
            return;
        }

        // strings
        if (is(code,"single-q") || is(code,"double-q") || is(code,"back-q")) {
            this.kind = "string";
            this.data = unExcape(code.slice(1,-1));
            return;
        }
        // numbers
        if (isNumeric(code)) {
            this.kind = "number";
            this.data = Number(code);
            return;
        }

        // variable
        if (/^[A-Za-z0-9_]+$/.test(code)) {
            this.kind = "variable";
            this.key = code;
            return;
        }

        throw Error("unexpected tokens: '" + code.trim().split("\n").map(l => l.trim()).join("\\n") + "'");
    }

    run(scope) {
        scope ??= new Scope();
        //console.log(this);
        switch (this.kind) {
            case "segment": {
                scope.newLayer();
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    const out = element.run(scope);
                    if (out.shouldReturn())
                        return out;
                }
                scope.exitLayer();
                return new Undefined();
            }
            case "empty":
                return new Undefined();
            
            case "execution": {
                const key = this.key.run(scope);
                const args = this.args.run(scope);
                if (key.shouldReturn())
                    return key;
                if (!Array.isArray(args) && args.shouldReturn())
                    return args;
                const out = key.execute(scope, args, key.parent);
                if (out.shouldReturn())
                    return out;
                return out;
            }
            case "operator":
                const a = this.a.run(scope);
                const b = this.b.run(scope);
                if (a.shouldReturn()) return a;
                if (b.shouldReturn()) return b;

                return runOperation(scope, a, b, this.op);
            case "ternary":
                const trueVal = this.trueVal.run(scope);
                const falseVal = this.falseVal.run(scope);
                let cond = this.cond.run(scope);
                if (trueVal.shouldReturn()) return trueVal;
                if (falseVal.shouldReturn()) return falseVal;
                if (cond.shouldReturn()) return cond;
                cond = cond.cast(scope, "bool");
                if (cond.shouldReturn()) return cond;
                return cond.data ? trueVal : falseVal;

            case "variable":
                return scope.get(this.key) ?? new Undefined();
            case "key": {
                const value = this.value.run(scope);
                const key = this.key.run(scope);
                if (value.shouldReturn()) return value;
                if (key.shouldReturn()) return key;
                return value.getKey(scope, key);
            }
            case "property": {
                const value = this.value.run(scope);
                if (value.shouldReturn()) return value;
                return value.getProperty(scope, this.key);
            }
            
            case "string":
                return new StringValue(this.data);
            case "number":
                return new NumberValue(this.data);
            case "function":
                const func = new FunctionValue("def", this.content, this.name, this.params);
                if (this.name && scope)
                    scope.assign(this.name, func);
                return func;
            case "tuple": {
                const elems = this.elements.map(e => e.run(scope));
                const err = elems.filter(e => e.shouldReturn())
                if (err.length > 0)
                    return err[0];
                return new TupleValue(elems);
            }
            case "array": {
                const elems = this.elements.map(e => e.run(scope));
                const err = elems.filter(e => e.shouldReturn())
                if (err.length > 0)
                    return err[0];
                return new ArrayValue(elems);
            }
            case "object": {
                const elems = this.elements.map(e => e.run(scope));
                const err = elems.filter(e => e.shouldReturn())
                if (err.length > 0)
                    return err[0];
                const obj = new ObjectValue(scope, elems);
                if (obj.shouldReturn())
                    return obj;
                return obj;
            }
            case "keyPair": {
                const key = this.key.run(scope);
                if (key.shouldReturn())
                    return key;
                const value = this.value.run(scope);
                if (value.shouldReturn())
                    return value;
                return new KeyPair(key, value);
            }

            default:
                throw Error("cannot run node of kind '" + this.kind + "'");
        }
    }
}
class List {
    constructor(code) {
        this.code = code;
        this.parse();
    }
    parse() {
        const elements = split(this.code, ",").filter(t => t !== ",");
        console.log(elements);
        this.kind = "list";
        this.elements = elements.map(e => new Node(e));
    }
    run(scope) {
        const out = this.elements.map(e => e.run(scope));
        for (let i = 0; i < out.length; i++) {
            const e = out[i];
            if (e.shouldReturn())
                return e;
        }
        return out;
    }
}
class Parameter {
    constructor(kind, name, defaultValue, type) {
        this.kind = kind;
        this.name = name;
        this.defaultValue = defaultValue ?? new Undefined();
        this.type = type ?? "any";
    }

    static parse(code) {
        if (code.startsWith("...")) {
            return new Parameter("spread", code.slice(3).trim(), null, null);
        }
        let kind = "default";
        const assignmentTokens = split(code, "=").filter(t => t !== "=");
        const spaceTokens = split(assignmentTokens.shift(), " ").filter(t => t !== " ");
        let defaultValue = null;
        let type = null;
        let name = null;
        if (assignmentTokens.length >= 1)
            defaultValue = new Node(assignmentTokens.join("="));
        if (spaceTokens.length == 1)
            name = spaceTokens[0];
        else if (spaceTokens.length == 2) {
            type = spaceTokens[0];
            name = spaceTokens[1];
        } else {
            throw Error("unknown parameter syntax: " + code);
        }

        return new Parameter(kind, name, defaultValue, type);
    }
}

class Value {
    constructor(...params) {
        this.ref = null;
        return this.instance(...params);
    }

    instance() {
        this.type = "unknown";
    }
    dissolve(ref) {}
    shouldReturn() { return false; }

    isNullish() { return this.type == "null"; }
    isUndefined() { return this instanceof Undefined; }

    getType() { return this.type; }
    isType(type) { return Value.isTypeEqual(this.getType(), type); }
    static isTypeEqual(typea, typeb) {
        return (typea === "any" || typeb === "any") ? true : typea === typeb;
    }

    getKey(scope, key) {
        const ref = this.getKeyRef(scope, key);
        if (ref instanceof Value && ref.shouldReturn())
            return ref;
        return ref ? memory[ref] : new Undefined();
    }
    getKeyRef(scope, key) {
        return new ErrorReturn(scope, "CannotGetKey", "cannot get key of type", key.getType(), "from type", this.getType());
    }
    getProperty(scope, key) {
        const ref = this.getPropertyRef(scope, key);
        if (ref instanceof Value && ref.shouldReturn())
            return ref;
        const value = ref ? memory[ref] : new Undefined();
        value.parent = this;
        return value;
    }
    getPropertyRef(scope, key) {
        const type = scope.get(this.getType());
        if (type) {
            if (type.properties && type.properties[key])
                return type.properties[key];
        }
        return new ErrorReturn(scope, "CannotGetProperty", "cannot get property", key, "from type", this.getType());
    }

    equal(other) {
        return other.getType() === this.getType() && this.equalData(other);
    }
    equalData(other) {
        return false;
    }
    cast(scope, type) {
        if (this.isType(type)) return this;
        if (type === "bool") return new BoolValue(this.boolify());
        return new ErrorReturn(scope, "CannotCast", "cannot cast", this.type, "to", type);
    }
    boolify() { return true; }
    stringify(objectFormat) { return `<${this.type ?? "unknown"}>`; }
    execute(scope, args) {
        return new ErrorReturn(scope, "CannotExecute", "cannot execute of type", this.getType());
    }
}

class Null extends Value {
    instance() {
        this.type = "null";
        this.data = "null";
    }

    isNullish() {
        return true;
    }

    equalData(other) {
        return other.data === this.data;
    }
    boolify() {
        return false;
    }
    stringify() { return `<null>`; }
}
class Undefined extends Null {
    instance() {
        super.instance();
        this.data = "undefined";
    }

    stringify() { return `<null:undefined>`; }
}
class ReturnValue extends Value {
    instance(value) {
        this.value = value;
    }

    shouldReturn() {
        return true;
    }
    getReturnValue() {
        return this.value;
    }
}
class ErrorReturn extends ReturnValue {
    instance(scope, type, ...data) {
        this.value = new ErrorValue(scope, type, ...data);
    }

    getReturnValue() {
        return this;
    }

    stringify() {
        return this.value.stringify();
    }
}

class ErrorValue extends Value {
    instance(scope, type, ...data) {
        this.type = "Error";
        this.errorType = type;
        this.data = data;
    }

    static getTypes() {
        return [
            "CannotExecute",
            "CannotCast",
            "CannotGetKey",
            "CannotGetProperty",
            "UnknownFunctionType",
            "UnknownOperation",
            "TypeMismatchError",
            "UnexpectedDecimal",
            "UnexpectedNonKeyPair"
        ]
    }

    equalData(other) {
        return other.errorType === this.errorType;
    }
    stringify() {
        return `<${this.errorType}: ${this.data.join(" ")}>`;
    }
}
class FunctionValue extends Value {
    instance(type, data, name, params) {
        this.type = "Func";
        this.funcType = type;
        this.data = data;
        this.name = name;
        this.params = params;
    }

    execute(scope, args, self) {
        switch (this.funcType) {
            case "builtin": {
                return this.data(scope, args, self) ?? new Undefined();
            }
            case "def": {
                const vars = {};
                const params = [...this.params];
                let i = 0;
                while (params.length > 0) {
                    const param = params.shift();
                    switch (param["kind"]) {
                        case "default": {
                            let a = args[i];
                            let defaultVal = param.defaultValue;
                            if (defaultVal instanceof Node)
                                defaultVal = defaultVal.run(scope);
                            a = a && !a.isNullish() ? a : defaultVal
                            if (!a.isType(param.type))
                                    return new ErrorReturn(scope, "TypeMismatchError", "wanted",param.type,"got",a.type);
                            vars[param.name] = a;
                            break;
                        }
                        case "spread":
                            vars[param.name] = new TupleValue(args);
                            args = [];
                            break;
                    }
                    i ++;
                }
                scope.newLayer(vars);
                let out = this.data.run(scope);
                scope.exitLayer();
                if (out.shouldReturn())
                    out = out.getReturnValue();
                return out;
            }
            default:
                return new ErrorReturn(scope, "UnknownFunctionType", "unknown function type", this.funcType);
        }
    }

    equalData(other) {
        return other.funcType === other.funcType && other.funcType === this.name
    }
    stringify() { return `<Func:${this.name ?? "anon"}:${this.funcType}>`; }
}
class StringValue extends Value {
    instance(data) {
        this.type = "str";
        this.data = data ?? "";
    }

    equalData(other) {
        return other.data === this.data;
    }
    stringify(objectFormat) { return objectFormat ? JSON.stringify(this.data) : this.data; }
}
class NumberValue extends Value {
    instance(data) {
        this.type = "num";
        this.data = data ?? 0;
    }

    equalData(other) {
        return other.data === this.data;
    }
    stringify() { return this.data.toString(); }
}
class BoolValue extends Value {
    instance(data) {
        this.type = "bool";
        this.data = !!data;
    }
    
    equalData(other) {
        return other.data === this.data;
    }
    stringify() { return this.data.toString(); }
}
class TupleValue extends Value {
    instance(elements) {
        this.type = "Tuple";
        this.elements = (elements ?? []).map(e => allocate(e));
    }

    getKeyRef(scope, key) {
        if (key.isType("num")) {
            const isWhole = key.data === Math.round(key.data);
            if (isWhole) {
                return this.elements[key.data];
            } else {
                return new ErrorReturn(scope, "UnexpectedDecimal", "key index for", this.getType(), "was not a whole number");
            }
        }
        return super.getKeyRef(scope, key);
    }

    equalData(other) {
        return this.elements.length === other.elements.length && this.elements.every((e,i) => e.equal(other.elements[i]));
    }
    stringify() {
        return `<Tuple:[${this.elements.map(e => memory[e].stringify(true)).join(",")}]>`;
    }
}
class ArrayValue extends TupleValue {
    instance(elements) {
        super.instance(elements);
        this.type = "Array";
    }

    stringify() {
        return `[${this.elements.map(e => memory[e].stringify(true)).join(",")}]`;
    }
}
class ObjectValue extends Value {
    instance(scope, pairs) {
        this.type = "Object";
        this.keys = [];
        this.values = [];
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (pair instanceof KeyPair) {
                this.keys.push(allocate(pair.key));
                this.values.push(allocate(pair.value));
            } else {
                return new ErrorReturn(scope, "UnexpectedNonKeyPair", "unexpected non key pair in object");
            }
        }
    }

    getKeyRef(scope, key) {
        for (let i = 0; i < this.keys.length; i++) {
            const key2 = memory[this.keys[i]];
            if (key2.equal(key)) {
                return this.values[i];
            }
        }
    }

    equalData(other) {
        return other.keys.length === this.keys.length && this.keys.every((e,i) => e.equal(other.keys[i])) && this.values.every((e,i) => e.equal(other.values[i]))
    }
    stringify() {
        return `{${this.keys.map((k,i) => `${memory[k].stringify(true)}:${memory[this.values[i]].stringify(true)}`).join(",")}}`;
    }
}
class TypeValue extends Value {
    instance(name, properties) {
        this.type = "type";
        this.name = name;
        this.properties = properties ?? {};
        
        this.properties = Object.fromEntries(
            Object.entries(this.properties).map(([key, value]) => [key, allocate(value)])
        );
    }

    equalData(other) {
        return this.name === other.name;
    }
}
class KeyPair extends Value {
    instance(key, value) {
        this.type = "KeyPair";
        this.key = key;
        this.value = value;
    }

    equalData(other) {
        return other.key.equal(this.key) && other.value.equal(this.value);
    }
    stringify() {
        return `<KeyPair:${this.key.stringify(true)}:${this.value.stringify(true)}>`;
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
        const ref = this.getRef(key);
        const value = memory[ref];
        if (value)
            value.ref = ref;
        return value;
    }
    getRef(key) {
        this.layers.reverse();
        const layers = this.layers;
        this.layers.reverse();
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            const r = layer.getRef(key);
            if (r)
                return r;
        }
    }
    assign(key, value) {
        const ref = this.getRef(key);
        if (ref) {
            memory[ref].dissolve();
            memory[ref] = value;
        } else {
            const newRef = allocate(value);
            this.assignRef(key, newRef);
            return newRef;
        }
        return ref;
    }
    assignRef(key, ref) {
        const top = this.layers[this.layers.length - 1];
        top.variables[key] = ref;
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

export class Script extends Value {
    constructor(data) {
        super();
        this.ast = new Node(data["code"] ?? "");
    }

    run(func) {

        const scope = new Scope();
        scope.newLayer(globalScope);

        return this.ast.run(scope);
    }
}

const globalScope = {
    print: new FunctionValue("builtin",function(scope, args) {
        console.log(...args.map(a => a.stringify()));
        return new TupleValue(args);
    },"print"),
    log: new FunctionValue("builtin",function(scope, args) {
        console.log(...args);
    },"print"),
    test: new FunctionValue("builtin",function(scope, args) {
        return new StringValue("hi");
    },"test"),

    return: new FunctionValue("builtin",function(scope, args) {
        return new ReturnValue(args.length > 0 ? args.length > 1 ? new TupleValue(args) : args[0] : new Undefined());
    }),

    // types
    str: new TypeValue("str", {
        upper: new FunctionValue("builtin",function(scope, args, self) {
            return new StringValue(self.data.toUpperCase());
        }),
        lower: new FunctionValue("builtin",function(scope, args, self) {
            return new StringValue(self.data.toUpperCase());
        }),
        trim: new FunctionValue("builtin",function(scope, args, self) {
            return new StringValue(self.data.trim());
        }),
    }),
    num: new TypeValue("num"),
    bool: new TypeValue("bool"),
    Nullish: new TypeValue("null"),
    Error: new TypeValue("Error"),
    Func: new TypeValue("Func"),
    Tuple: new TypeValue("Tuple"),
    Array: new TypeValue("Array", {
        map: new FunctionValue("builtin",function(scope, args, self) {
            let newElems = [];
            for (let i = 0; i < self.elements.length; i++) {
                const e = self.elements[i];
                scope.newLayer();
                const v = (args[0] ?? new Undefined()).execute(scope, [memory[e], new NumberValue(i)]);
                if (v.shouldReturn())
                    return v;
                scope.exitLayer();
                newElems.push(v);
            }
            return new ArrayValue(newElems);
        })
    }),
    Type: new TypeValue("Type"),

    // constants
    true: new BoolValue(true),
    false: new BoolValue(false),
    null: new Null(),
    undefined: new Undefined(),
};

if (import.meta.url === `file:///d:/fsl_schtuff/src%20but%20even%20better/fsl.js`) {
    const myScript = new Script({
        code: `
            print(5 == 3, 5 != 3, 5 > 3, 5 < 3, 5 >= 3, 5 <= 3, 5 ~= 3, 5 ?= 3);
        `
    });

    //console.log(JSON.stringify(myScript.ast, null, "  "));
    
    const out = myScript.run(); // if u dont give it a function name it just runs root
    if (!out.isUndefined())
        console.log(out.stringify());
}