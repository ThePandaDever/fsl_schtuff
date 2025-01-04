import { error } from "./interpreter.js";
import * as splitters from "./splitters.js";
import * as utils from "./utils.js";

const Object_clone = function(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object_clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object_clone(e[r]));return n}}return e};

function removeStr(input) {
    if ((input[0] == '"' || input[0] == "'") && (input[input.length-1] == '"' || input[input.length-1] == "'")) {
        let temp = input.replace(/\\\\n/g, '\uE000');
        temp = temp.replace(/\\n/g, '\n');
        let result = temp.replace(/\uE000/g, '\\n');
        return result.slice(1,-1);
    } else {
        return input;
    }
}
function removeCurlyBrackets(input) {return input.replace(/^\{|}$/g, '').trim();}
function removeSquareBrackets(input) {return input.replace(/^\[|\]$/g, '').trim();}
function removeBrackets(input) {return input.replace(/^\(|\)$/g, '').trim();}
function removeComments(code) {return code.replace(/(["'])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\//g,(match, quote) => (quote ? match : ""));}

function isCurlyBrackets(input) {if (typeof input != "string") {return false} return input[0] == "{" && input[input.length - 1] == "}";}
function isSquareBrackets(input) {if (typeof input != "string") {return false} return input[0] == "[" && input[input.length - 1] == "]";}
function isBrackets(input) {if (typeof input != "string") {return false} return input[0] == "(" && input[input.length - 1] == ")";}
function isNoBrackets(input) {if (typeof input != "string") {return false} return !(isBrackets(input) || isCurlyBrackets(input) || isSquareBrackets(input));}
const isNumeric = (string) => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(string);
function isValidVariableFormat(str) {const regex = /^[A-Za-z0-9_@#]+$/;return regex.test(str);}
function isValidFunctionFormat(str) {const regex = /^[A-Za-z0-9_.@#]+$/;return regex.test(str);}
function isValidDefinitionFormat(str) {const regex = /^[A-Za-z0-9_.@# ]+$/;return regex.test(str);}
function isValidAssignFormat(str) {const regex = /^[A-Za-z0-9_.@#\[\]\" ]+$/;return regex.test(str);}

const spacedCommandsHighPriority = [
    "return"
]

export function generateAst(content) {
    return generateAstSegment(content);
}
function generateAstSegment(content) {
    var out = {"content":[]};

    const segmentTokens = splitters.splitSegment(content);
    for (let i = 0; i < segmentTokens.length; i++) {
        const segmentToken = segmentTokens[i];
        const data = generateAstNode(removeComments(segmentToken));
        if (!data) { continue }
        switch (data["type"]) {
            case "function":
                if (!Object.keys(out).includes("functions")) {
                    out["functions"] = {}
                }
                delete data["type"]
                out["functions"][data["hash"]] = data;
                break
            default:
                out["content"].push(data);
        }
    }

    return out;
}
function generateAstNode(content) {
    const commandTokens = splitters.splitCommand(content);
    const spacedTokens = splitters.splitCharedCommand(content," ");
    const logicTokens = splitters.splitLogic(content);
    const comparisonTokens = splitters.splitComparsion(content);
    const operatorTokens = splitters.splitOperators(content);
    const methodTokens = splitters.splitCharedCommand(content,".");
    const assignmentTokens = splitters.splitAssignment(content);
    const keyTokens = splitters.splitReferences(content);

    if (!content) { return null }
    
    if (spacedTokens.length > 1) {
        if (commandTokens.length == 1) {
            if (spacedCommandsHighPriority.includes(spacedTokens[0])) {
                return {
                    "type": "spaced command",
                    "name": spacedTokens.shift(),
                    "data": generateAstNode(spacedTokens.join(" "))
                }
            }
        } else {
            let spacedTokens2 = Object_clone(spacedTokens);
            if (spacedTokens2.length > 2 && commandTokens.length == 2) {
                
                const content = spacedTokens2.pop()
                const name = spacedTokens2.pop();
                const type = spacedTokens2.pop();

                if (type != "fn" && isValidDefinitionFormat(type) && isValidDefinitionFormat(name)) {
                    return {
                        "type": "definition",
                        "id": type,
                        "name": name,
                        "attributes": spacedTokens2,
                        "content": generateAstSegment(removeCurlyBrackets(content))
                    }
                }
            }
        }
    }

    if (assignmentTokens.length == 3 || assignmentTokens.length == 2) {
        const assignmentType = {
            "=": "set",
            "+=": "inc_by",
            "-=": "dec_by",
            "++": "inc",
            "--": "dec",
        }[assignmentTokens[1]]
        const spacedTokens = splitters.splitCharedCommand(assignmentTokens[0]," ");
        const name = spacedTokens.pop();
        if (assignmentTokens.length == 2 && assignmentType) {
            return {
                "type": "assignment",
                "key": generateAstPath(name),
                "assignment": assignmentType,
                "attributes": spacedTokens
            }
        }
        if (assignmentType) {
            return {
                "type": "assignment",
                "key": generateAstPath(name),
                "assignment": assignmentType,
                "value": generateAstNode(assignmentTokens[2]),
                "attributes": spacedTokens
            }
        }
    }

    // definition
    if (commandTokens.length == 3) {
        const temp = splitters.splitCharedCommand(commandTokens[0]," ");
        if (temp.includes("fn")) {
            const args = splitters.splitCommandParams(removeBrackets(commandTokens[1])).map(item => {
                const tokens = splitters.splitCharedCommand(item," ");
                if (tokens.length == 1 && isValidVariableFormat(tokens[0])) {
                    return {"name":tokens[0],"type":"any"};
                }
                const startAssignmentTokens = splitters.splitAssignment(item);
                if (startAssignmentTokens.length == 3 && isValidVariableFormat(startAssignmentTokens[0]) && startAssignmentTokens[1] == "=") {
                    return {"name":startAssignmentTokens[0],"type":"any","default":generateAstNode(startAssignmentTokens[2])};
                }
                let type = tokens.shift();
                if (isSquareBrackets(type)) {
                    type = splitters.splitCommandParams(removeSquareBrackets(type));
                } else {
                    if (!isValidVariableFormat(type)) {
                        console.warn("unknown type " + type)
                        return null;
                    }
                }

                const other = tokens.join(" ");
                if (tokens.length == 1 && isValidVariableFormat(tokens[0])) {
                    return {"name":tokens[0],"type":type};
                }

                const assignmentTokens = splitters.splitAssignment(other);
                if (assignmentTokens.length == 3 && isValidVariableFormat(assignmentTokens[0]) && assignmentTokens[1] == "=") {
                    return {"name":assignmentTokens[0],"type":type,"default":generateAstNode(assignmentTokens[2])};
                }
            });
            if (temp.length < 2) {
                if (temp.length == 1) {
                    if (temp[0] == "fn") {
                        return {
                            "type": "function",
                            "args": args,
                            "content": generateAstSegment(
                                removeCurlyBrackets(commandTokens[2])
                            ),
                            "hash": utils.MD5(content)
                        };
                    }
                }
            }
            const name = temp.pop();
            const type = temp.pop();
            if (
                !isBrackets(commandTokens[0]) &&
                isBrackets(commandTokens[1]) &&
                isCurlyBrackets(commandTokens[2]) && 
                (
                    type == "fn" &&
                    isValidVariableFormat(name)
                )
            ) {
                return {
                    "type": "function",
                    "key": name,
                    "attributes": temp,
                    "args": args,
                    "content": generateAstSegment(
                        removeCurlyBrackets(commandTokens[2])
                    ),
                    "hash": utils.MD5(content)
                };
            }
        }
    }

    if (commandTokens.length > 1) {
        const tokens = commandTokens;
        if (isCurlyBrackets(tokens[tokens.length - 1]) && tokens.length >= 3) {
            // statement
            let content = removeCurlyBrackets(tokens.pop());
            let args = removeBrackets(tokens.pop());
            let key = tokens.join("");
            return {
                "type": "execution",
                "key": generateAstNode(key),
                "args": generateAstParams(args),
                "content": generateAstSegment(content)
            }
        }
        if (isBrackets(tokens[tokens.length - 1]) && tokens.length >= 2) {
            // command
            let args = removeBrackets(tokens.pop());
            let key = tokens.join("");
            return {
                "type": "execution",
                "key": generateAstNode(key),
                "args": generateAstParams(args)
            }
        }
    }
    
    if (logicTokens.length > 1) {
        const operators = {
            "||": "or",
            "&&": "and"
        }
        if (Object.keys(operators).includes(logicTokens[logicTokens.length - 2])) {
            return {
                "type": "logic",
                "b": generateAstNode(logicTokens.pop()),
                "operator": operators[logicTokens.pop()],
                "a": generateAstNode(logicTokens.join(" "))
            }
        }
    }

    if (comparisonTokens.length == 3) {
        const comparisons = {
            "==": "equal",
            "!=": "not_equal",
            "~=": "string_equal",
            ":=": "type_equal",
            ">": "greater",
            "<": "smaller",
            ">=": "greater_equal",
            "<=": "smaller_equal"
        }
        if (Object.keys(comparisons).includes(comparisonTokens[1])) {
            return {
                "type": "comparison",
                "comparison": comparisons[comparisonTokens[1]],
                "a": generateAstNode(comparisonTokens[0]),
                "b": generateAstNode(comparisonTokens[2])
            }
        }
    }

    if (operatorTokens.length > 1) {
        const b = generateAstNode(operatorTokens.pop());
        const op = operatorTokens.pop();
        const a = generateAstNode(operatorTokens.join(" "));
        return {
            "type": "operator",
            "operator": op,
            "a": a,
            "b": b
        };
    }

    if (spacedTokens.length > 1 && commandTokens.length == 1) {
        if (isValidVariableFormat(spacedTokens[0])) {
            return {
                "type": "spaced command",
                "name": spacedTokens.shift(),
                "data": generateAstNode(spacedTokens.join(" "))
            }
        }
    }

    if (methodTokens.length > 1) {
        const methodCommandTokens = splitters.splitCommand(methodTokens.pop());
        if (
            methodCommandTokens.length == 1 &&
            isNoBrackets(methodCommandTokens[0])
        ) {
            return {
                "type": "key",
                "value": generateAstNode(methodTokens.join(".")),
                "key": generateAstNode(methodCommandTokens[0])
            }
        }
    }

    if (isCurlyBrackets(content)) {
        const keys = splitters.splitCharedCommand(removeCurlyBrackets(content),",");
        let data = {};
        for (let i = 0; i < keys.length; i++) {
            const pair = keys[i];
            const tokens = splitters.splitCharedCommand(pair,":");
            if (tokens.length == 2) {
                const key = removeStr(tokens[0]);
                data[key] = generateAstNode(tokens[1]);
            } else {
                error("unknown object key syntax", key);
            }
        }
        return {
            "type": "object",
            "data": data
        }
    }
    
    if (isSquareBrackets(content)) {
        const values = splitters.splitCharedCommand(removeSquareBrackets(content),",");
        let data = [];
        for (let i = 0; i < values.length; i++) {
            data.push(generateAstNode(values[i]));
        }
        return {
            "type": "array",
            "data": data
        }
    }

    if (isNumeric(content)) {
        return {
            "type": "literal",
            "data": [Number(content),"num"]
        }
    }

    if (methodTokens.length > 1) {
        const methodCommandTokens = splitters.splitCommand(methodTokens.pop());
        if (
            methodCommandTokens.length == 2 &&
            (!isBrackets(methodCommandTokens[0]) && !isSquareBrackets(methodCommandTokens[0]) && !isCurlyBrackets(methodCommandTokens[0])) &&
            (isBrackets(methodCommandTokens[1]) && !isSquareBrackets(methodCommandTokens[1]) && !isCurlyBrackets(methodCommandTokens[1]))
        ) {
            return {
                "type": "method",
                "key": methodCommandTokens[0],
                "args": generateAstParams(removeBrackets(methodCommandTokens[1])),
                "value": generateAstNode(methodTokens.join("."))
            }
        }
    }

    if ((content[0] == '"' && content[content.length-1] == '"') || (content[0] == "'" && content[content.length-1] == "'")) {
        return {
            "type": "literal",
            "data": [removeStr(content),"str"]
        };
    }

    if (keyTokens.length > 1) {
        const key = keyTokens.pop();
        if (isSquareBrackets(key)) {
            return {
                "type": "key",
                "value": generateAstNode(keyTokens.join(" ")),
                "key": generateAstNode(removeSquareBrackets(key))
            }
        }
    }

    const constants = {
        "true": [true,"bool"],
        "false": [false,"bool"],
    }
    if (Object.keys(constants).includes(content)) {
        return {"type": "literal", "data": constants[content]};
    }

    if (isValidVariableFormat(content)) {
        return {
            "type": "reference",
            "key": content
        };
    }
    
    if (isBrackets(content)) {
        return generateAstNode(removeBrackets(content));
    }

    utils.fsl_error("unknown node '" + content + "'")
    return {
        "type": "empty"
    };
}
function generateAstParams(content) {
    let data = [];
    const tokens = splitters.splitCommandParams(content);
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        data.push(generateAstNode(token));
    }
    return data;
}
function generateAstPath(path) {
    let totalPath = [];
    let remainingPath = path;
    while (remainingPath) {
        const keyTokens = splitters.splitReferences(remainingPath);
        if (keyTokens.length > 1 && isSquareBrackets(keyTokens[keyTokens.length - 1])) {
            const key = generateAstNode(removeSquareBrackets(keyTokens.pop()));
            totalPath.push(key);
            remainingPath = keyTokens.join();
        } else {
            const methodTokens = splitters.splitCharedCommand(remainingPath, ".");
            if (methodTokens.length > 1) {
                totalPath.push({"type":"literal","data":[methodTokens.pop(),"str"]});
                remainingPath = methodTokens.join(".");
            } else {
                totalPath.push({"type":"reference","key":remainingPath});
                remainingPath = "";
            }
        }
    }
    return totalPath.reverse();
}
