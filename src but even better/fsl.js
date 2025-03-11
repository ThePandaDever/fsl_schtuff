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

class Node {
    constructor(data = null) {
        if (typeof data === "string") {
            this.parse(data);
        }
    }
    parse(text) {
        const tokens = splitCode(text);

        const isValidVariable = (text) => /^[A-Za-z0-9_]+$/.test(text);

        let parenDepth = 0,
            squareDepth = 0,
            curlyDepth = 0,
            angleDepth = 0;
        
        let inSingle = false,
            inDouble = false,
            inQuote = false;
        
        let type = null;
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

            if (inQuotes) continue;
            if (token === "'" || token === "\"" || token === "`") continue;

            if (token === "(") parenDepth ++
            if (token === "[") squareDepth ++
            if (token === "{") curlyDepth ++
            if (token === "<") angleDepth ++

            if (token === ")") parenDepth --
            if (token === "]") squareDepth --
            if (token === "}") curlyDepth --
            if (token === ">") angleDepth --

            if (isValidVariable(token) && type == null && !inBrackets) {
                type = "var";
                continue;
            }

            if (token === "(" && parenDepth == 1 && squareDepth == 0 && curlyDepth == 0 && angleDepth == 0 && i > 0) {
                type = "execution";
                continue;
            }

            if (token === ";") {
                type = "segment";
                break;
            }

            if (inBrackets) continue;

            if (token === ",") {
                type = "list";
                continue;
            }

            if (token === "\n" || token === "") continue;

            throw Error("unexpected token '" + token + "'");
        }
        if (parenDepth != 0) throw Error("unclosed or overclosed parenthesis");
        if (squareDepth != 0) throw Error("unclosed or overclosed square brackets");
        if (curlyDepth != 0) throw Error("unclosed or overclosed curly brackets");
        if (angleDepth != 0) throw Error("unclosed or overclosed angle brackets");

        this.kind = type;

        if (type === "segment") {
            const elements = [];
            
            let tokenStack = [];
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];

                tokenStack.push(token);
                
                if (token === "'" && !(inDouble || inQuote))
                    inSingle = !inSingle;
                if (token === "\"" && !(inSingle || inQuote))
                    inDouble = !inDouble;
                if (token === "`" && !(inSingle || inDouble))
                    inQuote = !inQuote;

                const inQuotes = inSingle || inDouble || inQuote;
                const inBrackets = parenDepth != 0 || squareDepth != 0 || curlyDepth != 0 || angleDepth != 0;

                if (inQuotes) continue;
                if (token === "'" || token === "\"" || token === "`") continue;

                if (token === "(") parenDepth ++
                if (token === "[") squareDepth ++
                if (token === "{") curlyDepth ++
                if (token === "<") angleDepth ++

                if (token === ")") parenDepth --
                if (token === "]") squareDepth --
                if (token === "}") curlyDepth --
                if (token === ">") angleDepth --

                if (inBrackets) continue;

                if (
                    token === ";" || (
                    (token === ")" && parenDepth == 0) ||
                    (token === "]" && squareDepth == 0) ||
                    (token === "}" && curlyDepth == 0))
                ) {
                    elements.push(new Node(tokenStack.slice(0,-1).join("")));
                    tokenStack = [];
                    continue;
                }
            }
            this.elements = elements;
        } else if (type === "list") {
            const elements = [];
            
            let tokenStack = [];
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];

                tokenStack.push(token);
                
                if (token === "'" && !(inDouble || inQuote))
                    inSingle = !inSingle;
                if (token === "\"" && !(inSingle || inQuote))
                    inDouble = !inDouble;
                if (token === "`" && !(inSingle || inDouble))
                    inQuote = !inQuote;

                const inQuotes = inSingle || inDouble || inQuote;
                const inBrackets = parenDepth != 0 || squareDepth != 0 || curlyDepth != 0 || angleDepth != 0;

                if (inQuotes) continue;
                if (token === "'" || token === "\"" || token === "`") continue;

                if (token === "(") parenDepth ++
                if (token === "[") squareDepth ++
                if (token === "{") curlyDepth ++
                if (token === "<") angleDepth ++

                if (token === ")") parenDepth --
                if (token === "]") squareDepth --
                if (token === "}") curlyDepth --
                if (token === ">") angleDepth --

                if (inBrackets) continue;

                if (token === ",") {
                    elements.push(new Node(tokenStack.slice(0,-1).join("")));
                    tokenStack = [];
                    continue;
                }
            }
            this.elements = elements;
        } else if (type == "execution") {
            let tokenStack = [];
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];

                tokenStack.push(token);
                
                if (token === "'" && !(inDouble || inQuote))
                    inSingle = !inSingle;
                if (token === "\"" && !(inSingle || inQuote))
                    inDouble = !inDouble;
                if (token === "`" && !(inSingle || inDouble))
                    inQuote = !inQuote;

                const inQuotes = inSingle || inDouble || inQuote;
                const inBrackets = parenDepth != 0 || squareDepth != 0 || curlyDepth != 0 || angleDepth != 0;

                if (inQuotes) continue;
                if (token === "'" || token === "\"" || token === "`") continue;

                if (token === "(") parenDepth ++
                if (token === "[") squareDepth ++
                if (token === "{") curlyDepth ++
                if (token === "<") angleDepth ++

                if (token === ")") parenDepth --
                if (token === "]") squareDepth --
                if (token === "}") curlyDepth --
                if (token === ">") angleDepth --

                if (token === "(" && parenDepth == 1 && squareDepth == 0 && curlyDepth == 0 && angleDepth == 0 && i > 0) {
                    this.key = new Node(tokens.slice(0, i).join(""));
                    tokenStack = [];
                }
                if (token === ")" && parenDepth == 0 && squareDepth == 0 && curlyDepth == 0 && angleDepth == 0) {
                    this.args = new Node(tokenStack.slice(0, -1).join(""));
                }
            }
        }
    }
}

class Script {
    constructor(code = "", name = "script") {
        this.node = new Node(code);
    }

    run() {

    }
}

const code = `
print("hello world!","wow");
wow();
`

const myScript = new Script(code, "script");
myScript.run();
console.log(JSON.stringify(myScript, null, "  "));
