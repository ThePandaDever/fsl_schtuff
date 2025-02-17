
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
            tokens.push(char);
            tokens.push("");
        } else {
            tokens[tokens.length - 1] += char;
        }
    }
    return tokens;
}

const isValidVariable = (text) => /^[A-Za-z0-9_]+$/.test(text)

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

        if (flags.includes("list")) {
            this.kind = "list";
            this.data = [];
        }

        if (flags.includes("segment")) {
            this.kind = "segment";
            this.data = [];
        }
        console.log("("+code+")");
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token === "'" && !(inDouble || inQuote))
                inSingle = !inSingle;
            if (token === "\"" && !(inSingle || inQuote))
                inDouble = !inDouble;
            if (token === "`" && !(inSingle || inDouble))
                inQuote = !inQuote;

            const inQuotes = inSingle || inDouble || inQuote;

            if ((token === "" || token == "\n" || (token == " " && flags.includes("list"))) && !inQuotes) continue // skip useless tokens

            tokenStack.push(token);
            
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

            if (token === "(" && parenDepth === 1 && !["list","segment"].includes(this.kind)) {
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

            if (flags.includes("list")) {
                if (token === ",") {
                    this.data.push(new Node(tokenStack.slice(0, -1).join("")));
                    tokenStack = [];
                }
                continue;
            }

            if (flags.includes("segment")) {
                console.log(token,parenDepth);
                if (token === ";" || (
                    (token === ")" && parenDepth == 0) ||
                    (token === "]" && squareDepth == 0) ||
                    (token === "}" && curlyDepth == 0)
                )) {
                    this.data.push(new Node(tokenStack.slice(0, -1).join("")));
                    console.log(this);
                    tokenStack = [];
                }
                continue;
            }

            if (parenDepth !== 0) {
                continue;
            } else {

            }

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
            case "string":
                content = this.data;
                break;

            case "unknown":
                content = this.data;
                break;
        }
        return expand ? `Node: ${this.kind} {\n${content}\n${indent}}` : `Node: ${this.kind} { ${content} }`;
    }
}

const code = `
crazy()
print(silly(), "Hello World", "silly");
`

console.log(new Node(code,["segment"]).stringify())