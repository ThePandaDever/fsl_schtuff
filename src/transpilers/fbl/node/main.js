
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
const isNumeric = (t) => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);
function randomStr(r=10){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n="";for(let t=0;t<r;t++)n+=e.charAt(Math.floor(Math.random()*e.length));return n}
let segments = {};

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

    compile(id, data) {
        id ??= "_";
        data ??= new Data();
        switch(this.kind) {
            case "segment":
                
            default:
                throw Error("unsupported node " + this.kind);
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
class Data {
    
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
}
class ScopeLayer {
    constructor(variables) {
        variables ??= {};
        this.variables = variables;
    }
}

class Script {
    constructor(data) {
        const code = data["code"] ?? ""
        this.ast = new Node(code, globalLib + code);
    }
    compile() {
        return this.ast.compile();
    }
}

const globalLib = `
#hasStack if;

#hasStack else;
#noArgs else;
#shortHandExec else;

#hasStack try;
#noArgs try;

#hasStack catch;
#noArgs catch;

#hasStack while;
`

const code = `
print("haii :3");
`;

const ast = new Script({"code":code});
console.log(ast.compile());
