import { pathToFileURL } from "url";

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
        if (char === "<" && type === "arrow")
            arrowDepth ++;
        if (char === ">" && type === "arrow")
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
        
        if (char == "\\") {
            const next = text[i + 1];
            if (next === "n") {
                current += "\n";
                i ++;
                continue;
            }
            current += next; i ++;
            continue;
        }

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
    memory[id].dissolve(id);
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
        case "mul":
            if (a.isType("str") && b.isType("num"))
                return new NumberValue(a.data.repeat(Math.max(b.data,0)));
            a = a.cast(scope, "num"); if (a.shouldReturn()) return a;
            b = b.cast(scope, "num"); if (b.shouldReturn()) return b;
            return new NumberValue(a.data + b.data);
        case "sub": case "div": case "pow": case "mod":
            a = a.cast(scope, "num"); if (a.shouldReturn()) return a;
            b = b.cast(scope, "num"); if (b.shouldReturn()) return b;
            switch (op) {
                case "sub":
                    if (a.isType("num") && b.isType("num"))
                        return new NumberValue(a.data - b.data);
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
        
        case "or": {
            const bool_a = a.cast(scope, "bool"); if (bool_a.shouldReturn()) return bool_a;
            const bool_b = b.cast(scope, "bool"); if (bool_b.shouldReturn()) return bool_b;
            return bool_a.data ? a : b;
        }
        case "and": {
            const bool_a = a.cast(scope, "bool"); if (bool_a.shouldReturn()) return bool_a;
            const bool_b = b.cast(scope, "bool"); if (bool_b.shouldReturn()) return bool_b;
            return bool_a.data ? b : a;
        }
        case "or_bool": {
            const bool_a = a.cast(scope, "bool"); if (bool_a.shouldReturn()) return bool_a;
            const bool_b = b.cast(scope, "bool"); if (bool_b.shouldReturn()) return bool_b;
            return new BoolValue(bool_a.data || bool_b.data);
        }
        case "and_bool": {
            const bool_a = a.cast(scope, "bool"); if (bool_a.shouldReturn()) return bool_a;
            const bool_b = b.cast(scope, "bool"); if (bool_b.shouldReturn()) return bool_b;
            return new BoolValue(bool_a.data && bool_b.data);
        }

        case "invert": {
            const bool_a = a.cast(scope, "bool"); if (bool_a.shouldReturn()) return bool_a;
            return new BoolValue(!bool_a.data);
        }

        default:
            return new ErrorReturn(scope, "UnknownOperation", "unknown operation", op);
    }
}

class Node {
    constructor(code, root) {
        this.code = code.trim();
        this.root = root ?? code;
        this.extData = this.getExtData();
        this.parse(this.code);
    }
    getExtData() {
        const stacked = [];
        const noArgs = [];
        const shortHandExec = [];
        const segmentTokens = split(this.root, ";", true);
        for (let i = 0; i < segmentTokens.length; i++) {
            const element = segmentTokens[i];
            const bracket = split(element, "bracket");
            const space1 = split(bracket[0]," ");
            if (space1[0] === "fn" && bracket.length >= 3) {
                const space2 = split(bracket[2]," ");
                if (space2[0] === "->")
                    stacked.push(space1[2]);
            }
            if (space1[0] === "#hasStack") {
                stacked.push(space1[2]);
            }
            if (space1[0] === "#noArgs") {
                noArgs.push(space1[2]);
            }
            if (space1[0] === "#shortHandExec") {
                shortHandExec.push(space1[2]);
            }
        }
        return {stacked:stacked,noArgs:noArgs,shortHandExec:shortHandExec};
    }
    parse(code) {
        if (!code.trim()) { this.kind = "empty"; return };
        //console.log(code.split("\n").map(l => l.trim()).join("\\n"));

        // segment (statement; statement)
        const segmentTokens = split(code, ";", true);
        if (segmentTokens.length > 1) {
            const elements = segmentTokens.filter(e => e !== ";");
            this.kind = "segment";
            this.elements = elements.filter(e => e.trim() != "").map(e => new Node(e, this.root)).filter(e => !!e?.kind);
            return;
        }
        
        // assignments
        const assignmentTokens = split(code, ["=",">","<","!","~","?","+","-","*","/","^","%","|","&"]);
        if (assignmentTokens.length > 2) {
            const key = assignmentTokens.shift();
            let assignment = "";
            let token = assignmentTokens.shift();
            while (["=",">","<","!","~","?","+","-","*","/","^","%","|","&", "v"].includes(token)) {
                assignment = assignment + token;
                token = assignmentTokens.shift();
            }
            assignmentTokens.reverse();
            assignmentTokens.push(token);
            assignmentTokens.reverse();
            const value = assignmentTokens.join("");
            
            switch (assignment) {
                case "=":
                    this.kind = "assignment";
                    this.type = "assign";
                    this.key = new Node(key, this.root);
                    this.value = new Node(value, this.root);
                    return;
                case ">v<=":
                    this.kind = "assignment";
                    this.type = "emoticon";
                    this.key = new Node(key, this.root);
                    this.value = new Node(value, this.root);
                    return;
            }
            const operator_assignments = {
                "+": "add",
                "++": "join",
                "-": "sub",
                "*": "mul",
                "/": "div",
                "^": "pow",
                "%": "mod",
                "||": "or",
                "&&": "and",
                "|||": "or_bool",
                "&&&": "and_bool"
            }
            if (assignment[assignment.length - 1] === "=") {
                assignment = assignment.slice(0,-1);
                const a = operator_assignments[assignment];
                if (a) {
                    this.kind = "assignment";
                    this.type = a;
                    this.key = new Node(key, this.root);
                    this.value = new Node(value, this.root);
                    return;
                }
            }
        }
        
        // functions (-> stack)
        const functionBracketTokens = split(code, "bracket");
        const functionSpaceTokens = split(functionBracketTokens[0] ?? "", " ").filter(t => t !== " ");
        const functionCurlyTokens = split(functionBracketTokens[2] ?? "", "curly");
        const functionStackTokens = split(functionCurlyTokens[0] ?? "", ["-",">"," "]).filter(t => t !== " ");
        if (functionSpaceTokens[0] === "fn" && is(functionBracketTokens[1], "bracket") && functionStackTokens.length == 3 && functionStackTokens[0] == "-" && functionStackTokens[1] == ">") {
            this.kind = "function";
            this.name = functionSpaceTokens[1];
            this.content = new Node(functionCurlyTokens[1] ?? "undefined", this.root);
            this.params = split(functionBracketTokens[1].slice(1,-1),",").filter(e => e !== ",").map(p => Parameter.parse(p));
            this.stack = functionStackTokens[2] ?? "";
            return;
        }

        // functions (no {})
        if (functionSpaceTokens[0] === "fn" && is(functionBracketTokens[1] ?? "", "bracket") && !is(functionBracketTokens[2] ?? "undefined", "curly")) {
            const name = functionSpaceTokens[1];
            
            this.kind = "function";
            this.name = name;
            this.content = new Node(functionBracketTokens.slice(2).join("") ?? "undefined", this.root);
            this.params = split(functionBracketTokens[1].slice(1,-1),",").filter(e => e !== ",").map(p => Parameter.parse(p));
            return;
        }

        // logic
        const logicTokens = split(code, ["|","&"]);
        if (logicTokens.length >= 3) {
            const b = logicTokens.pop();
            let logic = "";
            let token = logicTokens.pop();
            while (["|","&"].includes(token)) {
                logic = token + logic;
                token = logicTokens.pop();
            }
            logicTokens.push(token);
            const logicOperators = {
                "||": "or",
                "&&": "and",
                "|||": "or_bool",
                "&&&": "and_bool"
            }
            if (logicOperators[logic]) {
                this.kind = "operation";
                this.type = logicOperators[logic] ?? logic;
                this.a = new Node(logicTokens.join(""), this.root);
                this.b = new Node(b, this.root);
                return
            }
        }

        // comparisons
        const comparisonTokens = split(code, ["=",">","<","!","~","?"]);
        if (comparisonTokens.length >= 3) {
            const b = comparisonTokens.pop();
            let comparison = "";
            let token = comparisonTokens.pop();
            while (["=",">","<","!","~","?"].includes(token)) {
                comparison = token + comparison;
                token = comparisonTokens.pop();
            }
            comparisonTokens.push(token);
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
                this.a = new Node(comparisonTokens.join(""), this.root);
                this.b = new Node(b, this.root);
                return
            }
        }

        // ternary
        const ternaryTokens = split(code, ["?",":"]);
        if (ternaryTokens.filter(t => t === "?").length >= 1 && ternaryTokens.filter(t => t === ":").length >= 1) {
            let depth = 0;
            let start = 0;
            let end = 0;
            for (let i = 0; i < ternaryTokens.length; i++) {
                const token = ternaryTokens[i];
                
                if (token === "?" && ternaryTokens[i+1] !== "?") {
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
            this.cond = new Node(ternaryTokens.slice(0,start).join(""), this.root);
            this.trueVal = new Node(ternaryTokens.slice(start + 1,end).join(""), this.root);
            this.falseVal = new Node(ternaryTokens.slice(end + 1).join(""), this.root);
            return;
        }

        // keyPairs (key:value)
        const keyPairTokens = split(code, [":"]);
        if (keyPairTokens.length == 3 && keyPairTokens[1] == ":") {
            this.kind = "keyPair";
            this.key = new Node(keyPairTokens[0], this.root);
            this.value = new Node(keyPairTokens[2], this.root);
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

            this.kind = "operation";
            this.b = new Node(tokens2.pop(), this.root);
            this.type = tokens2.pop();
            this.type = operations[this.type] ?? this.type
            this.a = new Node(tokens2.join(" "), this.root);
            return;
        }

        // nullish-coalescense (val ?? default)
        const cTokens = split(code, "?");
        cTokens.reverse();
        let point = -1;
        for (let i = 0; i < cTokens.length; i++) {
            const token = cTokens[i];
            if (token == "?" && cTokens[i-1] == "?") {
                point = i;
                break;
            }
        }
        if (point != -1) {
            const defaultTokens = cTokens.slice(0,point-1);
            defaultTokens.reverse();
            const valueTokens = cTokens.slice(point+1);
            valueTokens.reverse();
            this.kind = "nullish_coalescense";
            this.default = new Node(defaultTokens.join(""));
            this.value = new Node(defaultTokens.join(""));
            return;
        }

        // prefixes
        const prefixes = {
            "!": "invert"
        }

        if (prefixes[code[0]]) {
            this.kind = "operation";
            this.type = prefixes[code[0]];
            this.a = new Node(code.slice(1));
            return;
        }
        
        // execution
        const bracketTokens = split(code, "bracket");
        if (is(bracketTokens[bracketTokens.length - 1] ?? "","bracket") && bracketTokens.length > 1) {
            const bracket = bracketTokens.pop();
            this.kind = "execution";
            this.args = new List(bracket.slice(1,-1), this.root);
            this.key = new Node(bracketTokens.join(""), this.root);
            return;
        }

        // casting ((type)value)
        const castTokens = split(code, "bracket");
        if (is(castTokens[0] ?? "","bracket") && castTokens.length >= 2 && castTokens[1] && castTokens[1][0] !== ".") {
            this.kind = "cast";
            this.type = new Node(castTokens.shift().slice(1,-1), this.root);
            this.data = new Node(castTokens.join(""), this.root);
            return
        }
        
        // segment ({statement; statement})
        if (is(code, "curly") && !(has(code.slice(1,-1), ",") || has(code.slice(1,-1), ":"))) {
            this.parse(code.slice(1,-1));
            return;
        }
        
        // keys (value["key"])
        const keyTokens = split(code, "square");
        if (keyTokens.length > 1) {
            const key = keyTokens.pop();
            if (is(key,"square")) {
                this.kind = "key";
                this.key = new Node(key.slice(1,-1), this.root);
                this.value = new Node(keyTokens.join(""), this.root);
                return;
            }
        }

        // numbers
        if (isNumeric(code)) {
            this.kind = "number";
            this.data = Number(code);
            return;
        }

        // property (value.key)
        const propertyTokens = split(code, ".").filter(e => e !== ".");
        if (propertyTokens.length > 1) {
            const property = propertyTokens.pop();
            this.kind = "property";
            this.key = property;
            this.value = new Node(propertyTokens.join("."), this.root);
            return;
        }

        // tuples / brackets
        if (is(code, "bracket")) {
            code = code.slice(1,-1);
            const elements = split(code, ",").filter(t => t !== ",");
            if (elements.length == 1) {
                this.parse(code);
            } else {
                this.kind = "tuple";
                this.elements = elements.map(e => new Node(e, this.root));
            }
            return;
        }
        
        // arrays
        if (is(code, "square")) {
            code = code.slice(1,-1);
            const elements = split(code, ",").filter(t => t !== ",");
            this.kind = "array";
            this.elements = elements.map(e => new Node(e, this.root));
            return;
        }

        // objects
        if (is(code, "curly")) {
            code = code.slice(1, -1);
            const elements = split(code, ",").filter(t => t !== ",");
            this.kind = "object";
            this.elements = elements.map(e => new Node(e, this.root));
            return;
        }

        // functions ({})
        if (functionSpaceTokens[0] === "fn" && is(functionBracketTokens[1], "bracket")) {
            const name = functionSpaceTokens[1];
            
            this.kind = "function";
            this.name = name;
            this.content = new Node(functionBracketTokens.slice(2).join("") ?? "undefined", this.root);
            this.params = split(functionBracketTokens[1].slice(1,-1),",").filter(e => e !== ",").map(p => Parameter.parse(p));
            return;
        }

        // stacked executions (name(args) stack)
        if (bracketTokens.length > 2 && this.extData["stacked"].includes(bracketTokens[0]) && is(bracketTokens[1],"bracket")) {
            this.kind = "execution";
            this.key = new Node(bracketTokens.shift(), this.root);
            this.args = new List(bracketTokens.shift().slice(1,-1), this.root);
            this.stack = new Node(bracketTokens.join(""), this.root);
            return;
        }

        // stacked executions no args (name {})
        const curlyTokens = split(code, "curly");
        if (is(curlyTokens[curlyTokens.length - 1] ?? "","curly") && this.extData["noArgs"] && curlyTokens.length > 1) {
            const bracket = curlyTokens.pop();
            this.kind = "execution";
            this.key = new Node(curlyTokens.join(""), this.root);
            this.stack = new Node(bracket.slice(1,-1), this.root);
            return;
        }

        // stacked executions no args no {} (name stack)
        const spaceTokens1 = split(code, " ").filter(t => t !== " ");
        if (this.extData["noArgs"].includes(spaceTokens1[0]) & this.extData["shortHandExec"].includes(spaceTokens1[0]) && spaceTokens1.length > 1) {
            this.kind = "execution";
            this.key = new Node(spaceTokens1[0], this.root);
            this.stack = new Node(spaceTokens1.slice(1).join(" "), this.root);
            return;
        }

        // strings
        if (is(code,"single-q") || is(code,"double-q") || is(code,"back-q")) {
            this.kind = "string";
            this.data = unExcape(code.slice(1,-1));
            return;
        }

        // variable
        if (/^[A-Za-z0-9_]+$/.test(code)) {
            this.kind = "variable";
            this.key = code;
            return;
        }

        // tags
        const tagSpaceTokens = split(code, " ");
        const tags = [
            "#hasStack",
            "#noArgs",
            "#shortHandExec"
        ]
        if (tags.includes(tagSpaceTokens[0]))
            return null;

        throw Error("unexpected tokens: '" + code.trim().split("\n").map(l => l.trim()).join("\\n") + "'");
    }

    run(scope, flags) {
        scope ??= new Scope();
        scope.code = this.code;
        //console.log(this);
        switch (this.kind) {
            case "segment": {
                scope.newLayer();
                for (let i = 0; i < this.elements.length; i++) {
                    const element = this.elements[i];
                    const out = element.run(scope);
                    if (out && out.shouldReturn()) {
                        if (!(flags && flags.includes("noExitScope")))
                            scope.exitLayer();
                        return out;
                    }
                }
                if (!(flags && flags.includes("noExitScope")))
                    scope.exitLayer();
                return new Undefined();
            }
            case "empty":
                return new Undefined();
            
            case "execution": {
                const key = this.key.run(scope);
                const args = !!key?.dontArgs ? this.args : this.args?.run(scope);
                if (key.shouldReturn())
                    return key;
                if (!Array.isArray(args) && args instanceof Value && args?.shouldReturn())
                    return args;
                scope.code = this.code;
                const out = key.execute(scope, args, key.parent, this.stack);
                if (out.shouldReturn())
                    return out;
                return out;
            }
            case "operation": {
                const a = this?.a?.run(scope);
                const b = this?.b?.run(scope);
                if (a?.shouldReturn()) return a;
                if (b?.shouldReturn()) return b;
                scope.code = this.code;
                return runOperation(scope, a, b, this.type);
            }
            case "ternary":
                let cond = this.cond.run(scope);
                if (cond.shouldReturn()) return cond;
                scope.code = this.code;
                cond = cond.cast(scope, "bool");
                if (cond.shouldReturn()) return cond;
                return cond.data ? this.trueVal.run(scope) : this.falseVal.run(scope);
            case "comparison": {
                let a = this.a.run(scope);
                let b = this.b.run(scope);
                if (a.shouldReturn()) return a;
                if (b.shouldReturn()) return b;
                scope.code = this.code;
                if (["greater","smaller","greater_equal","smaller_equal"].includes(this.type)) {
                    a = a.cast(scope, "num");
                    b = b.cast(scope, "num");
                }
                if (a.shouldReturn()) return a;
                if (b.shouldReturn()) return b;
                switch (this.type) {
                    case "equal":
                        return new BoolValue(a.equal(b));
                    case "not_equal":
                        return new BoolValue(!a.equal(b));
                    case "greater":
                        return new BoolValue(a.data > b.data);
                    case "smaller":
                        return new BoolValue(a.data < b.data);
                    case "greater_equal":
                        return new BoolValue(a.data >= b.data);
                    case "smaller_equal":
                        return new BoolValue(a.data <= b.data);
                    case "string_equal":
                        a = a.cast(scope, "str");
                        b = b.cast(scope, "str");
                        if (a.shouldReturn()) return a;
                        if (b.shouldReturn()) return b;
                        return new BoolValue(a.data === b.data);
                    case "type_equal":
                        return new BoolValue(a.isType(b.getType()));
                    default:
                        return new ErrorReturn(scope, "UnknownComparison", "unknown comparison " + this.type)
                }
                break;
            }
            case "assignment": {
                let value = this.value.run(scope);
                if (value.shouldReturn()) return value;
                
                if (["add","join","mul","sub","div","pow","mod","or","and","or_bool","and_bool"].includes(this.type)) {
                    const oldValue = this.key.run(scope);
                    if (oldValue.shouldReturn())
                        return oldValue;
                    scope.code = this.code;
                    value = runOperation(scope, oldValue, value, this.type);
                    if (value.shouldReturn())
                        return value;
                    const out = this.key.assign(scope, value);
                    if (out)
                        return out;
                    return value;
                }

                scope.code = this.code;

                switch (this.type) {
                    case "assign": {
                        const out = this.key.assign(scope, value);
                        if (out)
                            return out;
                        break;
                    }
                    case "emoticon": {
                        const list = [":3",">-<","c:","^-^","owo","uwu","^w^",":D",":P","x3",";3",":>",">w<","^_^",":o"];
                        value = value.cast(scope, "num");
                        if (value.shouldReturn())
                            return value;
                        scope.code = this.code;
                        value = new StringValue(new Array(value.data).fill("").map(_ => list[Math.floor(Math.random() * list.length)]).join(" "));
                        const out = this.key.assign(scope, value);
                        if (out)
                            return out;
                        break;
                    }
                    default:
                        return new ErrorReturn(scope, "UnknownAssignment", "unknown assignment " + this.type)
                }
                return value;
            }
            case "cast": {
                const type = this.type.run(scope);
                if (type.shouldReturn()) return type;
                if (!type.isType("Type"))
                    return new ErrorReturn(scope, "CannotCast", "cast's type is not a Type, rather a " + type.getType())
                const data = this.data.run(scope);
                if (data.shouldReturn()) return data;
                scope.code = this.code;
                return data.cast(scope, type.name);
            }
            case "nullish_coalescense": {
                const value = this.value.run(scope);
                if (value.shouldReturn())
                    return value;
                return value.isNullish() ? this.default.run(scope) : value;
            }

            case "variable":
                const varRef = scope.getRef(this.key) ?? generateRandom();
                const varData = memory[varRef] ?? new Undefined();
                varData.ref = varRef;
                memory[varRef + "_node"] = this;
                return varData;
            case "key": {
                const value = this.value.run(scope);
                if (value.shouldReturn()) return value;
                const key = this.key.run(scope);
                if (key.shouldReturn()) return key;
                scope.code = this.code;
                return value.getKey(scope, key);
            }
            case "property": {
                const value = this.value.run(scope);
                if (value.shouldReturn()) return value;
                scope.code = this.code;
                return value.getProperty(scope, this.key);
            }
            
            case "string":
                return new StringValue(this.data);
            case "number":
                return new NumberValue(this.data);
            case "function":
                const func = new FunctionValue("def", this.content, this.name, this.stack, this.params, this.code);
                if (this.name && scope)
                    scope.assign(this.name, func);
                return func;
            case "tuple": {
                const elems = this.elements.map(e => e.run(scope));
                const err = elems.filter(e => e.shouldReturn())
                if (err.length > 0)
                    return err[0];
                scope.code = this.code;
                return new TupleValue(elems);
            }
            case "array": {
                const elems = this.elements.map(e => e.run(scope));
                const err = elems.filter(e => e.shouldReturn())
                if (err.length > 0)
                    return err[0];
                scope.code = this.code;
                return new ArrayValue(elems);
            }
            case "object": {
                const elems = this.elements.map(e => e.run(scope));
                const err = elems.filter(e => e.shouldReturn())
                if (err.length > 0)
                    return err[0];
                scope.code = this.code;
                const obj = new ObjectValue(scope, elems);
                if (obj.shouldReturn())
                    return obj;
                scope.code = this.code;
                return obj;
            }
            case "keyPair": {
                const key = this.key.run(scope);
                if (key.shouldReturn())
                    return key;
                const value = this.value.run(scope);
                if (value.shouldReturn())
                    return value;
                scope.code = this.code;
                return new KeyPair(key, value);
            }

            default:
                return new ErrorReturn(scope, "CannotRunNode", "cannot run node of kind " + this.kind);
        }
    }

    assign(scope, value) {
        switch (this.kind) {
            case "variable":
                scope.assign(this.key, value);
                return value;
            case "key": {
                const self = this.value.run(scope);
                if (self.shouldReturn()) return self;
                const key = this.key.run(scope);
                if (key.shouldReturn()) return key;
                const ref = self.setKey(scope, key, value);
                if (ref && typeof ref !== "string" && ref.shouldReturn())
                    return ref;
                return memory[ref];
            }
            case "property": {
                const self = this.value.run(scope);
                if (self.shouldReturn()) return self;
                const ref = self.setProperty(scope, this.key, value);
                if (ref && typeof ref !== "string" && ref.shouldReturn())
                    return ref;
                return memory[ref];
            }
            default:
                return new ErrorReturn(scope, "CannotAssign", "cannot assign to node of type " + this.kind);
        }
    }
}
class List {
    constructor(code, root) {
        this.code = code;
        this.root = root;
        this.parse();
    }
    parse() {
        const elements = split(this.code, ",").filter(t => t !== ",");
        this.kind = "list";
        this.elements = elements.map(e => new Node(e, this.root)).filter(e => !!e?.kind);
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
            defaultValue = new Node(assignmentTokens.join("="), this.root);
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
        const value = ref ? memory[ref] : new Undefined();
        value.parent = this;
        return value;
    }
    getKeyRef(scope, key) {
        return new ErrorReturn(scope, "CannotGetKey", "cannot get key of type", key.getType(), "from type", this.getType());
    }
    setKey(scope, key, value) {
        const ref = this.getKeyRef(scope, key);
        if (ref && typeof ref !== "string" && ref.shouldReturn())
            return ref;
        if (ref) {
            memory[ref].dissolve();
            memory[ref] = value;
            return ref;
        } else {
            const newRef = this.setKeyRef(scope, key, value);
            if (newRef && typeof newRef !== "string" && newRef.shouldReturn())
                return newRef;
            memory[newRef] = value;
            return newRef;
        }
    }
    setKeyRef(scope, key, value) {
        return new ErrorReturn(scope, "CannotSetKey", "cannot set key of type", key.getType(), "from type", this.getType());
    }

    getProperty(scope, key) {
        const ref = this.getPropertyRef(scope, key);
        if (ref instanceof Value && ref.shouldReturn())
            return ref;
        const value = (ref ? memory[ref] : new Undefined()) ?? new Undefined();
        value.parent = this;
        return value;
    }
    getPropertyRef(scope, key) {
        if (this.properties && this.properties[key])
            return this.properties[key];
        const type = scope.get(this.getType());
        if (type) {
            if (type.properties && type.properties[key])
                return type.properties[key];
        }
        switch (key) {
            case "getType":
                return allocate(new FunctionValue("builtin", function(scope, args, self) {
                    return types[self.type] ?? new Undefined();
                }));
            case "ptr":
                return this.ref ?? new Undefined();
        }
        return new ErrorReturn(scope, "CannotGetProperty", "cannot get property", key, "from type", this.getType());
    }
    setProperty(scope, key, value) {
        const ref = this.setPropertyRef(scope, key, value);
        if (ref && typeof ref !== "string" && ref.shouldReturn())
            return refef;
        memory[ref] = value;
        return ref;
    }
    setPropertyRef(scope, key, value) {
        if (!this.properties)
            this.properties = {};
        this.properties[key] = allocate(value);
        return this.properties[key];
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
        if (type === "str") return new StringValue(this.stringify());
        return new ErrorReturn(scope, "CannotCast", "cannot cast", this.getType(), "to", type);
    }
    boolify() { return true; }
    stringify(objectFormat) { return `<${this.type ?? "unknown"}>`; }
    execute(scope, args, self, stack) {
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
        this.code = scope.code
    }

    static getTypes() {
        return [
            "CannotExecute",
            "CannotCast",
            "CannotGetKey",
            "CannotSetKey",
            "CannotGetProperty",
            "CannotSetProperty",
            "CannotRunNode",
            "CannotAssign",
            "UnknownFunctionType",
            "UnknownOperation",
            "UnknownComparison",
            "UnknownAssignment",
            "TypeMismatchError",
            "UnexpectedDecimal",
            "UnexpectedNonKeyPair"
        ]
    }

    equalData(other) {
        return other.errorType === this.errorType;
    }
    stringify() {
        return `${this.errorType} Error: ${this.data.join(" ")}${!!this.code ? `; in:\n${this.code}` : ""}`;
    }
}
class ErrorType extends Value {
    instance(type) {
        this.type = "ErrorType";
        this.errorType = type;
    }

    stringify() {
        return `<ErrorType:${this.errorType}>`;
    }
}
class FunctionValue extends Value {
    instance(type, data, name, stack, extra, extra2) {
        this.type = "Func";
        this.funcType = type;
        this.data = data;
        this.name = name;
        this.stack = stack;
        this.extra = extra;
        if (extra2)
            this.extra2 = extra2;
        if (type === "builtin")
            this.dontArgs = stack ?? false;
    }

    execute(scope, args, self, stack) {
        if (this.funcType === "builtin" && this.typeParent) {
            let methodType = this.typeParent;
            if (!self.isType(methodType) && args.length >= 1)
                self = args.shift();
            else if (!self.isType(methodType))
                return new ErrorReturn(scope, "TypeMismatchError", `${methodType} method ran on non ${methodType} (${self.getType()})`);
        }
        self ??= new Undefined();
        switch (this.funcType) {
            case "builtin": case "builtin_self": {
                args ??= [];
                return this.data(scope, args, self, stack) ?? new Undefined();
            }
            case "stack": {
                args ??= [];
                return this.data(scope, args, self, this.extra) ?? new Undefined();
            }
            case "def": {
                const vars = {};
                const params = [...this.extra];
                let i = 0;
                while (params.length > 0) {
                    const param = params.shift();
                    switch (param["kind"]) {
                        case "default": {
                            let a = args ? args[i] : null;
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
                if (this.stack)
                    vars[this.stack] = new FunctionValue("stack",function(scope, args, self, stack) {
                        return stack.run(scope);
                    }, this.stack, null, stack)
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

    getPropertyRef(scope, key) {
        switch (key) {
            case "code":
                return allocate(this.funcType === "def" ? new StringValue(this.extra2) :
                    this.funcType === "stack" ? new StringValue(this.extra.code) :
                    new Undefined());
        }
        return super.getPropertyRef(scope, key);
    }

    equalData(other) {
        return other.funcType === other.funcType && other.name === this.name
    }
    stringify() { return `<Func:${this.name ?? "anon"}:${this.funcType}>`; }
}
class StringValue extends Value {
    instance(data) {
        this.type = "str";
        this.data = data ?? "";
    }

    cast(scope, type) {
        if (type == "str" && isNumeric(this.data))
            return new NumberValue(Number(type));
        return super.cast(scope, type);
    }
    equalData(other) {
        return other.data === this.data;
    }
    boolify() {
        return this.data.length > 0;
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
        this.elements = (elements ?? []).map(e => typeof e === "string" ? e : allocate(e));
    }

    getKeyRef(scope, key) {
        if (key.isType("num")) {
            const isWhole = key.data === Math.round(key.data);
            if (isWhole) {
                if (key.data < 0)
                    return this.elements[this.elements.length + key.data];
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
    cast(scope, type) {
        if (type === "Arr") return new ArrayValue(this.elements);
        return super.cast(scope, type);
    }
    stringify() {
        return `<Tuple:[${this.elements.map(e => memory[e].stringify(true)).join(",")}]>`;
    }
}
class ArrayValue extends TupleValue {
    instance(elements) {
        super.instance(elements);
        this.type = "Arr";
    }

    cast(scope, type) {
        if (type === "Tuple") return new TupleValue(this.elements);
        return super.cast(scope, type);
    }
    stringify() {
        return `[${this.elements.map(e => memory[e].stringify(true)).join(",")}]`;
    }
}
class ObjectValue extends Value {
    instance(scope, pairs) {
        this.type = "Obj";
        this.keys = [];
        this.values = [];
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (pair instanceof KeyPair) {
                this.keys.push(pair.key);
                this.values.push(pair.value);
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
    setKeyRef(scope, key, value) {
        this.keys.push(allocate(key));
        this.values.push(allocate(value));
    }

    equalData(other) {
        return other.keys.length === this.keys.length && this.keys.every((e,i) => e.equal(other.keys[i])) && this.values.every((e,i) => e.equal(other.values[i]))
    }
    stringify() {
        return `{${this.keys.map((k,i) => `${memory[k].stringify(true)}:${memory[this.values[i]].stringify(true)}`).join(",")}}`;
    }
}
const types = {};
class TypeValue extends Value {
    instance(name, properties) {
        this.type = "Type";
        this.name = name;
        this.properties = properties ?? {};
        
        this.properties = Object.fromEntries(
            Object.entries(this.properties).map(([key, value]) => {
                value.typeParent = this.name;
                return [key, allocate(value)];
            })
        );

        types[name] = this;
    }

    getPropertyRef(scope, key) {
        switch (key) {
            case "properties":
                return allocate(new ObjectValue(scope, Object.entries(this.properties).map(([key, value]) => new KeyPair(new StringValue(key), null, value))));
        }
        return super.getPropertyRef(scope, key);
    }

    equalData(other) {
        return this.name === other.name;
    }
    stringify() {
        return `<Type:${this.name}>`;
    }
}
class KeyPair extends Value {
    instance(key, value, valueRef) {
        this.type = "KeyPair";
        this.key = allocate(key);
        this.value = valueRef ?? allocate(value);
    }

    getPropertyRef(scope, key) {
        switch (key) {
            case "key":
                return this.key;
            case "value":
                return this.value;
        }
        return super.getPropertyRef(scope, key);
    }

    equalData(other) {
        return memory[other.key].equal(memory[this.key]) && memory[other.value].equal(memory[this.value]);
    }
    stringify() {
        return `<KeyPair:${memory[this.key].stringify(true)}:${memory[this.value].stringify(true)}>`;
    }
}
class APIValue extends Value {
    instance(name, properties) {
        this.type = "Api";
        this.name = name;
        this.properties = properties ?? {};
        
        this.properties = Object.fromEntries(
            Object.entries(this.properties).map(([key, value]) => {
                return [key, allocate(value)];
            })
        );
    }

    getPropertyRef(scope, key) {
        switch (key) {
            case "properties":
                return allocate(new ObjectValue(scope, Object.entries(this.properties).map(([key, value]) => new KeyPair(new StringValue(key), null, value))));
        }
        return super.getPropertyRef(scope, key);
    }

    equalData(other) {
        return this.name === other.name;
    }
    stringify() {
        return `<API:${this.name}>`;
    }
}

class Scope {
    constructor(variables) {
        variables ??= {};
        this.layers = [];
        this.code = "";
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
        const layers = [...this.layers];
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
        console.log(key);
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
    assignTop(key, value) {
        const ref = this.layers[this.layers.length-1].getRef(key);
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
}
class ScopeLayer {
    constructor(variables) {
        variables ??= {};
        variables["@stackValue"] = new BoolValue(false);
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
        const code = data["code"] ?? ""
        this.ast = new Node(code, globalLib + code);
    }

    run(func) {
        const scope = new Scope();
        scope.newLayer(globalScope);

        const gLibOut = globalLib_ast.run(scope, ["noExitScope"]);
        if (gLibOut.shouldReturn())
            return gLibOut;
        const out = this.ast.run(scope);
        scope.exitLayer();
        return out;
    }
}

const globalScope = {
    print: new FunctionValue("builtin",function(scope, args) {
        console.log(...args.map(a => a.stringify()));
        return args.length == 1 ? args[0] : new TupleValue(args);
    },"print"),
    log: new FunctionValue("builtin",function(scope, args) {
        console.log(...args);
    },"print"),

    return: new FunctionValue("builtin",function(scope, args) {
        return new ReturnValue(args.length > 0 ? args.length > 1 ? new TupleValue(args) : args[0] : new Undefined());
    }, "return"),

    try: new FunctionValue("builtin",function(scope, args, self, stack) {
        let out = new Undefined();

        if (stack)
            out = stack.run(scope);
        
        let filter;
        if (args && args[0]?.getType() === "ErrorType") {
            filter = args[0].errorType;
        }

        const outNode = args ? memory[args.shift()?.ref + "_node"] : null;
        if (out instanceof ErrorReturn && (!filter || out.value.errorType === filter)) {
            out = out.value;
            scope.assign("@try_error", out);
            scope.assign("@stack_value", new BoolValue(false));
            if (outNode) {
                outNode.assign(scope, out);
            }
        } else if (outNode) {
            outNode.assign(scope, new Undefined());
            scope.assign("@try_error", new Undefined());
            scope.assign("@stack_value", new BoolValue(true));
        }
        console.log(scope.get("@try_error"));

        return out;
    }, "try"),
    catch: new FunctionValue("builtin",function(scope, args, self, stack) {
        const out = scope.get("@try_error");

        const outNode = memory[args.shift()?.ref + "_node"];
        if (out.isType("Error")) {
            scope.assign("@try_error", out);
            if (outNode) {
                outNode.assign(scope, out);
            }
            if (stack)
                return stack.run(scope);
        }
    }, "catch"),
    while: new FunctionValue("builtin",function(scope, args, self, stack) {
        let out = new Undefined();
        scope.assign("@stack_value", new BoolValue(true));
        while (true) {
            let conds = args.elements.map(a => {
                a = a.run(scope);
                if (a.shouldReturn())
                    return a;
                return a.cast(scope, "bool");
            });
            for (let i = 0; i < conds.length; i++) {
                const cond = conds[i];
                if (cond.shouldReturn())
                    return cond;
                if (!cond.data) {
                    scope.assign("@stack_value", new BoolValue(false));
                    return;
                }
            }
            
            if (stack) {
                out = stack.run(scope);
                if (out.shouldReturn())
                    return out;
            }
        }
    }, "while", true),

    // types
    str: new TypeValue("str", {
        upper: new FunctionValue("builtin",function(scope, args, self) {
            return new StringValue(self.data.toUpperCase());
        }, "upper"),
        lower: new FunctionValue("builtin",function(scope, args, self) {
            return new StringValue(self.data.toLowerCase());
        }, "lower"),
        trim: new FunctionValue("builtin",function(scope, args, self) {
            return new StringValue(self.data.trim());
        }, "trim"),
    }),
    num: new TypeValue("num"),
    bool: new TypeValue("bool", {
        while: new FunctionValue("builtin",function(scope,args,self) {
            
        }, "while"),
    }),
    Nullish: new TypeValue("null"),
    Error: new TypeValue("Error", {
        getErrorType: new FunctionValue("builtin",function(scope,args,self) {
            return new StringValue(self.errorType);
        }, "getErrorType")
    }),
    ErrorType: new TypeValue("ErrorType", Object.fromEntries(
        ErrorValue.getTypes().map(t => [t, new ErrorType(t)])
    )),
    Func: new TypeValue("Func"),
    Tuple: new TypeValue("Tuple"),
    Arr: new TypeValue("Arr", {
        map: new FunctionValue("builtin",function(scope, args, self) {
            let newElems = [];
            for (let i = 0; i < self.elements.length; i++) {
                const e = self.elements[i];
                scope.newLayer();
                const v = (args[0] ?? new Undefined()).execute(scope, [memory[e], new NumberValue(i)]);
                if (v.shouldReturn()) {
                    scope.exitLayer();
                    return v;
                }
                scope.exitLayer();
                newElems.push(v);
            }
            return new ArrayValue(newElems);
        }, "map"),
        filter: new FunctionValue("builtin",function(scope, args, self) {
            let newElems = [];
            for (let i = 0; i < self.elements.length; i++) {
                const e = self.elements[i];
                scope.newLayer();
                let keep = (args[0] ?? new Undefined()).execute(scope, [memory[e], new NumberValue(i)]);
                if (keep.shouldReturn())
                    return keep;
                scope.exitLayer();
                keep = keep.cast(scope, "bool");
                if (keep.shouldReturn()) {
                    scope.exitLayer();
                    return keep;
                }
                if (keep.data)
                    newElems.push(memory[e]);
            }
            return new ArrayValue(newElems);
        }, "filter"),
        some: new FunctionValue("builtin",function(scope, args, self) {
            for (let i = 0; i < self.elements.length; i++) {
                const e = self.elements[i];
                scope.newLayer();
                let cond = (args[0] ?? new Undefined()).execute(scope, [memory[e], new NumberValue(i)]);
                if (cond.shouldReturn())
                    return cond;
                scope.exitLayer();
                cond = cond.cast(scope, "bool");
                if (cond.shouldReturn()) {
                    scope.exitLayer();
                    return cond;
                }
                if (cond.data)
                    return new BoolValue(true);
            }
            return new BoolValue(false);
        }, "some"),
        every: new FunctionValue("builtin",function(scope, args, self) {
            for (let i = 0; i < self.elements.length; i++) {
                const e = self.elements[i];
                scope.newLayer();
                let cond = (args[0] ?? new Undefined()).execute(scope, [memory[e], new NumberValue(i)]);
                if (cond.shouldReturn())
                    return cond;
                scope.exitLayer();
                cond = cond.cast(scope, "bool");
                if (cond.shouldReturn()) {
                    scope.exitLayer();
                    return cond;
                }
                if (!cond.data)
                    return new BoolValue(false);
            }
            return new BoolValue(true);
        }, "every"),
        reduce: new FunctionValue("builtin",function(scope, args, self) {
            let val = args[1];
            for (let i = 0; i < self.elements.length; i++) {
                const e = self.elements[i];
                scope.newLayer();
                val = (args[0] ?? new Undefined()).execute(scope, [val, memory[e], new NumberValue(i)]);
                if (val.shouldReturn()) {
                    scope.exitLayer();
                    return val;
                }
                scope.exitLayer();
            }
            return val;
        }, "reduce"),
    }),
    Obj: new TypeValue("Obj"),
    Type: new TypeValue("Type"),
    Pointer: new TypeValue("Pointer"),

    // apis
    Scope: new APIValue("Scope", {
        getLayers: new FunctionValue("builtin",function(scope,args) {
            return new ArrayValue(scope.layers.map(l => new ObjectValue(scope, Object.entries(l.variables).map(e => new KeyPair(new StringValue(e[0]), null, e[1])))))
        }),
    }),

    // constants
    true: new BoolValue(true),
    false: new BoolValue(false),
    null: new Null(),
    undefined: new Undefined(),
};

const globalLib = `
#hasStack if;
fn if(...cond) -> stack {
    Scope.getLayers()[-3]["@stackValue"] = (cond = ((Arr)cond).every(fn(v) (bool)v));
    return(
        cond ? 
        stack() :
        undefined
    );
}
#hasStack then;
#noArgs then;
#shortHandExec then;
fn then(...cond) -> stack {
    return(Scope.getLayers()[-3]["@stackValue"] ? stack() : undefined);
}
#hasStack else;
#noArgs else;
#shortHandExec else;
fn else(...cond) -> stack {
    return(!Scope.getLayers()[-3]["@stackValue"] ? stack() : undefined);
}

#hasStack for;

#hasStack try;
#noArgs try;
#shortHandExec try;
#hasStack catch;
#noArgs catch;
#shortHandExec catch;

#hasStack while;
`
const globalLib_ast = new Node(globalLib, globalLib);

if (process.argv[1] === `d:\\fsl_schtuff\\src\\node\\fsl.js`) {
    console.profile()
    console.time("ast");
    const myScript = new Script({
        code: `
            for(i, 10) {
                print(i);
            }
        `,
        code: `
            try {
                print(5 - 5);
            } catch (e) {
                print(e);
            } then {
                print(":D");
            }
        `
    });
    console.timeEnd("ast");

    //console.log(JSON.stringify(myScript.ast, null, "  "));
    
    console.time();
    let out = myScript.run(); // if u dont give it a function name it just runs root
    console.timeEnd();
    console.profileEnd();
    //console.log(JSON.stringify(memory));
    if (out.shouldReturn())
        out = out.getReturnValue();
    if (!out.isUndefined())
        console.log(out.stringify());
}