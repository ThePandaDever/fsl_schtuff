
function tokenise(code) {
    let tokens = [""];
    let splitTokens = [
        "\"",
        "'",
        "`",
        "\n",
        "\\",
        "(",")",
        "[","]",
        "{","}",
        "<",">",
        ",",
        ":",
        " ",
    ]
    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        if (splitTokens.includes(char)) {
            if (tokens[tokens.length - 1] != "")
                tokens.push("");
        }
        tokens[tokens.length - 1] += char;
        if (splitTokens.includes(char)) {
            if (tokens[tokens.length - 1] != "")
                tokens.push("");
        }
    }
    if (tokens[tokens.length-1] == "")
        tokens.pop();
    return tokens;
}

function convert(tokens) {
    return generateSegment(createSegment(group(identify(tokens))));
}
function identify(rawTokens) {
    let tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        let token = rawTokens[i];
        let tokenData = "?";
        switch (token) {
            case "(":  tokenData = "bracketOpen";                                break;
            case ")":  tokenData = "bracketClose";                               break;
            case "{":  tokenData = "curlyBracketOpen";                           break;
            case "}":  tokenData = "curlyBracketClose";                          break;
            case "[":  tokenData = "squareBracketOpen";                          break;
            case "]":  tokenData = "squareBracketClose";                         break;
            case "<":  tokenData = "arrowBracketOpen";                           break;
            case ">":  tokenData = "arrowBracketClose";                          break;
            
            case ";":  tokenData = "semicolon";                                  break;
            case "\n": tokenData = "newline";                                    break;
            case " ":  tokenData = "space";                                      break;
            case "\\": i ++; tokenData = {"type":"excape","value":rawTokens[i]}; break;

            case "'":  tokenData = "singleQuotes";                               break;
            case "\"": tokenData = "doubleQuotes";                               break;
            case "`":  tokenData = "backQuotes";                                 break;
            
            case "fn": tokenData = "functionDefinition";                         break;
            
            default:
                tokenData = {"type":"text","value":token};
        }
        tokens.push(tokenData);
    }
    return tokens;
}
function group(tokens) {
    let newTokens = [];
    
    let singleQuotes = false;
    let doubleQuotes = false;
    let backQuotes = false;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        switch (token) {
            case "singleQuotes":
                if (!(doubleQuotes || backQuotes)) {
                    singleQuotes = !singleQuotes;
                    newTokens.push(token);
                    if (singleQuotes) {
                        newTokens.push({"type":"text","value":""});
                    }
                    continue;
                }
            case "doubleQuotes":
                if (!(singleQuotes || backQuotes)) {
                    doubleQuotes = !doubleQuotes;
                    newTokens.push(token);
                    if (doubleQuotes) {
                        newTokens.push({"type":"text","value":""});
                    }
                    continue;
                }
            case "backQuotes":
                if (!(singleQuotes || doubleQuotes)) {
                    backQuotes = !backQuotes;
                    newTokens.push(token);
                    if (backQuotes) {
                        newTokens.push({"type":"text","value":""});
                    }
                    continue;
                }
        }
        if (singleQuotes || doubleQuotes || backQuotes) {
            newTokens[newTokens.length - 1]["value"] += reConstruct(token);
        } else {
            newTokens.push(token);
        }
    }
    return newTokens;
}
function groupBrackets(tokens) {
    let newTokens = [];

    let bracketDepth = 0;
    let curlyBracketDepth = 0;
    let squareBracketDepth = 0;
    let arrowBracketDepth = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        switch (token) {
            case "bracketClose": bracketDepth --; break;
            case "curlyBracketClose": curlyBracketDepth --; break;
            case "squareBracketClose": squareBracketDepth --; break;
            case "arrowBracketClose": arrowBracketDepth --; break;
        }

        if (
            bracketDepth == 0 &&
            curlyBracketDepth == 0 &&
            squareBracketDepth == 0 &&
            arrowBracketDepth == 0
        ) {
            newTokens.push(token);
        } else {
            newTokens[newTokens.length - 1].push(token);
        }

        switch (token) {
            case "bracketOpen":
                if (bracketDepth == 0 && curlyBracketDepth == 0 && squareBracketDepth == 0 && arrowBracketDepth == 0) {newTokens.push([])}
                bracketDepth ++;
                break;
            case "curlyBracketOpen":
                if (bracketDepth == 0 && curlyBracketDepth == 0 && squareBracketDepth == 0 && arrowBracketDepth == 0) {newTokens.push([])}
                curlyBracketDepth ++;
                break;
            case "squareBracketOpen":
                if (bracketDepth == 0 && curlyBracketDepth == 0 && squareBracketDepth == 0 && arrowBracketDepth == 0) {newTokens.push([])}
                squareBracketDepth ++;
                break;
            case "arrowBracketOpen":
                if (bracketDepth == 0 && curlyBracketDepth == 0 && squareBracketDepth == 0 && arrowBracketDepth == 0) {newTokens.push([])}
                arrowBracketDepth ++;
                break;
        }
    }
    return newTokens;
}
function reConstruct(token) {
    if (typeof token == "object") {
        switch (token["type"]) {
            case "text": return token["value"];
            case "excape": return "\\" + token["value"];
        }
    } else {
        switch (token) {
            case "bracketOpen": return "(";
            case "bracketClose": return ")";
            case "curlyBracketOpen": return "{";
            case "curlyBracketClose": return "}";
            case "squareBracketOpen": return "[";
            case "squareBracketClose": return "]";
            case "arrowBracketOpen": return "<";
            case "arrowBracketClose": return ">";

            case "semicolon": return ";";
            case "newline": return "\n";
            case "space": return " ";

            case "singleQuotes": return "'";
            case "doubleQuotes": return "\"";
            case "backQuotes": return "`";

            case "functionDefinition": return "fn";
        }
        return token;
    }
}
function createSegment(tokens) {
    let statements = [[]];

    let bracketDepth = 0;
    let curlyBracketDepth = 0;
    let squareBracketDepth = 0;
    let arrowBracketDepth = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        switch (token) {
            case "bracketOpen": bracketDepth ++;              break;
            case "bracketClose": bracketDepth --;             break;
            case "curlyBracketOpen": curlyBracketDepth ++;    break;
            case "curlyBracketClose": curlyBracketDepth --;   break;
            case "squareBracketOpen": squareBracketDepth ++;  break;
            case "squareBracketClose": squareBracketDepth --; break;
            case "arrowBracketOpen": arrowBracketDepth ++;    break;
            case "arrowBracketClose": arrowBracketDepth --;   break;
        }
        let validSplit = (
            bracketDepth == 0 &&
            curlyBracketDepth == 0 &&
            squareBracketDepth == 0 &&
            arrowBracketDepth == 0
        );
        if (validSplit) {
            switch (token) {
                case "semicolon":
                    if (!!statements[statements.length-1]) {
                        statements.push([]);
                    }
                    break;
                case "newline":
                    break;
                case "curlyBracketClose":
                    statements[statements.length-1].push(token);
                    if (!!statements[statements.length-1]) {
                        statements.push([]);
                    }
                    break;
                default:
                    statements[statements.length-1].push(token);
                    break;
            }
        } else {
            statements[statements.length-1].push(token);
        }
    }
    return statements;
}
function generateSegment(tokens) {
    console.log(JSON.stringify(tokens.map(token => groupBrackets(token))));
    return tokens;
}

let code = `
fn test() {
  print("silly");
}
test();
print("bleh \\"wow\\"");
`

//console.log(convert(tokenise(code)).map(t => reConstruct(t)).join(""))
//console.log(convert(tokenise(code)));
convert(tokenise(code));