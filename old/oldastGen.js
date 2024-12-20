import { fsl_error, local_modules } from "./oldfsl.js";

const MD5 = function(r){function n(r,n){var t,o,e,u,f;return e=2147483648&r,u=2147483648&n,f=(1073741823&r)+(1073741823&n),(t=1073741824&r)&(o=1073741824&n)?2147483648^f^e^u:t|o?1073741824&f?3221225472^f^e^u:1073741824^f^e^u:f^e^u}function t(r,t,o,e,u,f,a){return r=n(r,n(n(t&o|~t&e,u),a)),n(r<<f|r>>>32-f,t)}function o(r,t,o,e,u,f,a){return r=n(r,n(n(t&e|o&~e,u),a)),n(r<<f|r>>>32-f,t)}function e(r,t,o,e,u,f,a){return r=n(r,n(n(t^o^e,u),a)),n(r<<f|r>>>32-f,t)}function u(r,t,o,e,u,f,a){return r=n(r,n(n(o^(t|~e),u),a)),n(r<<f|r>>>32-f,t)}function f(r){var n,t="",o="";for(n=0;3>=n;n++)t+=(o="0"+(o=r>>>8*n&255).toString(16)).substr(o.length-2,2);return t}var a,i,C,c,g,h,d,v,S;for(r=function(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var o=r.charCodeAt(t);128>o?n+=String.fromCharCode(o):(127<o&&2048>o?n+=String.fromCharCode(o>>6|192):(n+=String.fromCharCode(o>>12|224),n+=String.fromCharCode(o>>6&63|128)),n+=String.fromCharCode(63&o|128))}return n}(r),a=function(r){for(var n,t=r.length,o=16*(((n=t+8)-n%64)/64+1),e=Array(o-1),u=0,f=0;f<t;)u=f%4*8,e[n=(f-f%4)/4]|=r.charCodeAt(f)<<u,f++;return e[n=(f-f%4)/4]|=128<<f%4*8,e[o-2]=t<<3,e[o-1]=t>>>29,e}(r),h=1732584193,d=4023233417,v=2562383102,S=271733878,r=0;r<a.length;r+=16)i=h,C=d,c=v,g=S,h=t(h,d,v,S,a[r+0],7,3614090360),S=t(S,h,d,v,a[r+1],12,3905402710),v=t(v,S,h,d,a[r+2],17,606105819),d=t(d,v,S,h,a[r+3],22,3250441966),h=t(h,d,v,S,a[r+4],7,4118548399),S=t(S,h,d,v,a[r+5],12,1200080426),v=t(v,S,h,d,a[r+6],17,2821735955),d=t(d,v,S,h,a[r+7],22,4249261313),h=t(h,d,v,S,a[r+8],7,1770035416),S=t(S,h,d,v,a[r+9],12,2336552879),v=t(v,S,h,d,a[r+10],17,4294925233),d=t(d,v,S,h,a[r+11],22,2304563134),h=t(h,d,v,S,a[r+12],7,1804603682),S=t(S,h,d,v,a[r+13],12,4254626195),v=t(v,S,h,d,a[r+14],17,2792965006),h=o(h,d=t(d,v,S,h,a[r+15],22,1236535329),v,S,a[r+1],5,4129170786),S=o(S,h,d,v,a[r+6],9,3225465664),v=o(v,S,h,d,a[r+11],14,643717713),d=o(d,v,S,h,a[r+0],20,3921069994),h=o(h,d,v,S,a[r+5],5,3593408605),S=o(S,h,d,v,a[r+10],9,38016083),v=o(v,S,h,d,a[r+15],14,3634488961),d=o(d,v,S,h,a[r+4],20,3889429448),h=o(h,d,v,S,a[r+9],5,568446438),S=o(S,h,d,v,a[r+14],9,3275163606),v=o(v,S,h,d,a[r+3],14,4107603335),d=o(d,v,S,h,a[r+8],20,1163531501),h=o(h,d,v,S,a[r+13],5,2850285829),S=o(S,h,d,v,a[r+2],9,4243563512),v=o(v,S,h,d,a[r+7],14,1735328473),h=e(h,d=o(d,v,S,h,a[r+12],20,2368359562),v,S,a[r+5],4,4294588738),S=e(S,h,d,v,a[r+8],11,2272392833),v=e(v,S,h,d,a[r+11],16,1839030562),d=e(d,v,S,h,a[r+14],23,4259657740),h=e(h,d,v,S,a[r+1],4,2763975236),S=e(S,h,d,v,a[r+4],11,1272893353),v=e(v,S,h,d,a[r+7],16,4139469664),d=e(d,v,S,h,a[r+10],23,3200236656),h=e(h,d,v,S,a[r+13],4,681279174),S=e(S,h,d,v,a[r+0],11,3936430074),v=e(v,S,h,d,a[r+3],16,3572445317),d=e(d,v,S,h,a[r+6],23,76029189),h=e(h,d,v,S,a[r+9],4,3654602809),S=e(S,h,d,v,a[r+12],11,3873151461),v=e(v,S,h,d,a[r+15],16,530742520),h=u(h,d=e(d,v,S,h,a[r+2],23,3299628645),v,S,a[r+0],6,4096336452),S=u(S,h,d,v,a[r+7],10,1126891415),v=u(v,S,h,d,a[r+14],15,2878612391),d=u(d,v,S,h,a[r+5],21,4237533241),h=u(h,d,v,S,a[r+12],6,1700485571),S=u(S,h,d,v,a[r+3],10,2399980690),v=u(v,S,h,d,a[r+10],15,4293915773),d=u(d,v,S,h,a[r+1],21,2240044497),h=u(h,d,v,S,a[r+8],6,1873313359),S=u(S,h,d,v,a[r+15],10,4264355552),v=u(v,S,h,d,a[r+6],15,2734768916),d=u(d,v,S,h,a[r+13],21,1309151649),h=u(h,d,v,S,a[r+4],6,4149444226),S=u(S,h,d,v,a[r+11],10,3174756917),v=u(v,S,h,d,a[r+2],15,718787259),d=u(d,v,S,h,a[r+9],21,3951481745),h=n(h,i),d=n(d,C),v=n(v,c),S=n(S,g);return(f(h)+f(d)+f(v)+f(S)).toLowerCase()};

function deStr(str) {
    // Check if the string starts and ends with the same type of quotes
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        // Remove the surrounding quotes by slicing the string
        return str.slice(1, -1);
    }
    return str; // Return the original string if no surrounding quotes are found
}

function removeCurlyBraces(input) {
    // Use a regular expression to remove curly braces at the start and end of the string
    return input.replace(/^\{|\}$/g, '').trim();
}

function removeSquareBraces(input) {
    // Use a regular expression to remove square braces at the start and end of the string
    return input.replace(/^\[|\]$/g, '').trim();
}

function removeBraces(input) {
    // Use a regular expression to remove braces at the start and end of the string
    return input.replace(/^\(|\)$/g, '').trim();
}

function removeComments(code) {
    // First, remove multi-line comments
    let noMultiLineComments = code.replace(/\/\*[\s\S]*?\*\//g, '');

    // Then, remove single-line comments
    let noComments = noMultiLineComments.replace(/\/\/.*/g, '');

    // Return the cleaned-up code without comments
    return noComments;
}

function isCurlyBrackets(input) {
    return input[0] == "{" && input[input.length - 1] == "}";
}

function isSquareBrackets(input) {
    return input[0] == "[" && input[input.length - 1] == "]";
}

function isBrackets(input) {
    return input[0] == "(" && input[input.length - 1] == ")";
}

const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string);
function isValidVariableFormat(str) {
    const regex = /^[A-Za-z0-9_@#]+$/;
    return regex.test(str);
}
function isValidFunctionFormat(str) {
    const regex = /^[A-Za-z0-9_.@#]+$/;
    return regex.test(str);
}
function isValidDefinitionFormat(str) {
    const regex = /^[A-Za-z0-9_.@# ]+$/;
    return regex.test(str);
}
function isValidAssignFormat(str) {
    const regex = /^[A-Za-z0-9_.@#\[\]\" ]+$/;
    return regex.test(str);
}

function arrayEquals(a, b) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}
// id be dead if mist didnt make this :pray:
Object.isSame = function (obj1,obj2) {
    if (typeof obj1 === "object" && typeof obj2 === "object") {
        if (obj1 === obj2) return true;

        let obj1Keys = Object.keys(obj1);
        let obj2Keys = Object.keys(obj2);
        if (obj1Keys.length !== obj2Keys.length) return false;

        for (let key of obj2Keys) {
            if (!obj1Keys.includes(key)) return false;
            const obj1Type = typeof obj1[key];
            const obj2Type = typeof obj2[key];
            if (obj1Type !== obj2Type) return false;
            if (obj1Type === "object" && obj2Type === "object") {
            if (!Object.isSame(obj1[key], obj2[key])) return false;
            } else if (obj1[key] !== obj2[key]) return false;
        }
        return true;
    } else {
        return false;
    }
}
Object.flip = function (obj) {
    let newObj = {};
    for (let key in obj) {
    newObj[obj[key]] = key;
    }
    return newObj;
}


function splitLogic(input) {
    const result = [];
    let buffer = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBrackets = 0;
    let inBraces = 0;
    let inParens = 0;

    const logicalOperatorsRegex = /(\|\||&&)/;
    // Match logical operators

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Toggle flags for quotes
        if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
        } else if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
        }

        // Track brackets, braces, and parentheses nesting
        if (!inSingleQuote && !inDoubleQuote) {
            if (char === '[') {
                inBrackets++;
            } else if (char === ']') {
                inBrackets--;
            } else if (char === '{') {
                inBraces++;
            } else if (char === '}') {
                inBraces--;
            } else if (char === '(') {
                inParens++;
            } else if (char === ')') {
                inParens--;
            }
        }

        // Check if we're outside quotes, brackets, braces, and parentheses
        if (!inSingleQuote && !inDoubleQuote && inBrackets === 0 && inBraces === 0 && inParens === 0) {
            // Look ahead to see if we match a logical operator starting at this position
            const remainingInput = input.slice(i);
            const operatorMatch = remainingInput.match(logicalOperatorsRegex);

            // If a logical operator is found at the beginning of the remaining input
            if (operatorMatch && operatorMatch.index === 0) {
                // Push the current buffer content to the result (if there's anything in it)
                if (buffer.trim()) {
                    result.push(buffer.trim());
                    buffer = '';
                    // Clear buffer
                }

                // Push the matched operator to the result
                result.push(operatorMatch[0]);

                // Move the index to the end of the matched operator
                i += operatorMatch[0].length - 1;
                // -1 because `i++` will happen at the end of the loop
                continue;
                // Move to the next iteration after processing the operator
            }
        }

        // Append the current character to the buffer if it's not part of an operator
        buffer += char;
    }

    // Push any remaining buffer content to the result
    if (buffer.trim()) {
        result.push(buffer.trim());
    }

    return result;
}
function splitOperators(input) {
    const operators = ["+","-","*","/"];
    const result = [];
    let buffer = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBrackets = 0;
    let inBraces = 0;
    let inParens = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char == "\r" || char == "\n" || char == " ") {
            if (!inSingleQuote && !inDoubleQuote) {
                if (inBrackets == 0 && inBraces == 0 ** inParens == 0) {
                    continue;
                }
            }
        }

        // Toggle flags for quotes
        if (char === "'" && !inDoubleQuote && !inBrackets && !inBraces && !inParens) {
            inSingleQuote = !inSingleQuote;
        } else if (char === '"' && !inSingleQuote && !inBrackets && !inBraces && !inParens) {
            inDoubleQuote = !inDoubleQuote;
        }

        // Track brackets, braces, and parentheses nesting
        if (!inSingleQuote && !inDoubleQuote) {
            if (char === '[') {
                inBrackets++;
            } else if (char === ']') {
                inBrackets--;
            } else if (char === '{') {
                inBraces++;
            } else if (char === '}') {
                inBraces--;
            } else if (char === '(') {
                inParens++;
            } else if (char === ')') {
                inParens--;
            }
        }

        // Split on operators only when not inside quotes, brackets, braces, or parentheses
        if (operators.includes(char) && !inSingleQuote && !inDoubleQuote && inBrackets === 0 && inBraces === 0 && inParens === 0) {
            if (char != "+" || (char == "+" && (input[i-1] != "+" && input[i+1] != "+"))) {
                if (buffer.trim()) {
                    result.push(buffer.trim());
                }
                result.push(char);
                // Keep the operator as a separate element
                buffer = '';
            } else {
                if (char == "+" && input[i+1] == "+") {
                    result.push(buffer.trim());
                    buffer = "";
                }
                buffer += char;
                if (char == "+" && input[i-1] == "+") {
                    result.push(buffer.trim());
                    buffer = "";
                }
            }
        } else {
            buffer += char;
        }
    }

    // Push the last buffer if not empty
    if (buffer.trim()) {
        result.push(buffer.trim());
    }
    return result;
}
function splitComparsion(input) {
    const operators = /(==|!=|~=|\?=|>=|<=)/;
    const result = [];
    let buffer = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBrackets = 0;
    let inBraces = 0;
    let inParens = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const nextChar = input[i + 1];

        // Toggle flags for quotes
        if (char === "'" && !inDoubleQuote && !inBrackets && !inBraces && !inParens) {
            inSingleQuote = !inSingleQuote;
        } else if (char === '"' && !inSingleQuote && !inBrackets && !inBraces && !inParens) {
            inDoubleQuote = !inDoubleQuote;
        }

        // Track brackets, braces, and parentheses nesting
        if (!inSingleQuote && !inDoubleQuote) {
            if (char === '[') {
                inBrackets++;
            } else if (char === ']') {
                inBrackets--;
            } else if (char === '{') {
                inBraces++;
            } else if (char === '}') {
                inBraces--;
            } else if (char === '(') {
                inParens++;
            } else if (char === ')') {
                inParens--;
            }
        }

        // Check for multi-character operators (==, !=, ~=, etc.)
        if (operators.test(char + nextChar) && !inSingleQuote && !inDoubleQuote && inBrackets === 0 && inBraces === 0 && inParens === 0) {
            if (buffer.trim()) {
                result.push(buffer.trim());
            }
            result.push(char + nextChar);
            // Add the operator as a separate element
            buffer = '';
            i++;
            // Skip the next character as it's part of the operator
        } // Check for single-character operators (<, >)
        else if ([">", "<"].includes(char) && !inSingleQuote && !inDoubleQuote && inBrackets === 0 && inBraces === 0 && inParens === 0) {
            if (buffer.trim()) {
                result.push(buffer.trim());
            }
            result.push(char);
            // Add the single-character operator
            buffer = '';
        } // Append the character to the buffer if it's not part of an operator
        else {
            buffer += char;
        }
    }

    // Push the last buffer if not empty
    if (buffer.trim()) {
        result.push(buffer.trim());
    }
    return result;
}
function splitStatement(input) {
    const result = [];
    let currentPart = '';
    let braceCount = 0;
    let parenCount = 0;
    // Track parentheses
    let i = 0;
    let insideQuotes = false;
    // Track if we are inside quotes
    let quoteType = '';
    // Track the type of quote (either ' or ")
    
    while (i < input.length) {
        const char = input[i];

        // Check for the start of a quote
        if (char === '"' || char === "'") {
            // If we're not already inside quotes, enter quotes
            if (!insideQuotes) {
                insideQuotes = true;
                quoteType = char;
                // Remember the type of quote
            } else if (char === quoteType) {
                // If we encounter the same type of quote, exit quotes
                insideQuotes = false;
            }
        }

        // If we are outside quotes, handle braces and parentheses
        if (!insideQuotes) {
            if (char === '(') {
                parenCount++;
                // Enter parentheses
                currentPart += char;
                // Add the opening parenthesis
            } else if (char === ')') {
                parenCount--;
                // Exit parentheses
                currentPart += char;
                // Add the closing parenthesis
            } else if (char === '{') {
                // Push the part before the brace if not inside parentheses
                if (parenCount === 0 && braceCount == 0) {
                    if (currentPart.trim()) {
                        result.push(currentPart.trim());
                        currentPart = '';
                        // Reset for the next part
                    }
                }
                currentPart += char;
                // Add the opening brace
                braceCount++;
            } else if (char === '}') {
                braceCount--;
                currentPart += char;
                // Add the closing brace
                if (parenCount === 0 && braceCount == 0) {
                    if (currentPart.trim()) {
                        result.push(currentPart.trim());
                        currentPart = '';
                        // Reset for the next part
                    }
                }
            } else if (char === ';' && braceCount === 0 && parenCount === 0) {
                // Finalize on semicolon only if not inside braces or parentheses
                result.push(currentPart.trim());
                currentPart = '';
                // Reset for the next part
            } else {
                currentPart += char;
                // Collect other characters
            }
        } else {
            currentPart += char;
            // Add characters inside quotes directly
        }

        i++;
    }

    // Push any remaining part that wasn't processed
    if (currentPart.trim()) {
        result.push(currentPart.trim());
    }
    return result;
}
function splitSegment(input) {
    let result = [];
    let current = "";

    let inSingleQuotes = false;
    let inDoubleQuotes = false;

    let bracketDepth = 0;
    let squareDepth = 0;
    let curlyDepth = 0;

    let i = -1;
    for (let char of input) {
        i ++;
        if (char == '"' && !inSingleQuotes) {
            inDoubleQuotes = !inDoubleQuotes;
        }
        if (char == "'" && !inDoubleQuotes) {
            inSingleQuotes = !inSingleQuotes;
        }

        let inAnyQuotes = inSingleQuotes || inDoubleQuotes;

        if (!inAnyQuotes) {
            switch (char) {
                case "{":
                    curlyDepth ++;
                    current += char;
                    break
                case "}":
                    curlyDepth --;
                    current += char;
                    if (bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && (input[i+1] != "(")) {
                        if (current) {
                            result.push(current.trim());
                            current = "";
                        }
                    }
                    break;

                case "[":
                    squareDepth ++;
                    current += char;
                    break
                case "]":
                    squareDepth --;
                    current += char;
                    break;

                case "(":
                    bracketDepth ++;
                    current += char;
                    break
                case ")":
                    bracketDepth --;
                    current += char;
                    break;

                case ";":
                    if (bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0) {
                        if (current) {
                            result.push(current.trim());
                            current = "";
                        }
                    } else {
                        current += char;
                    }
                    break

                default:
                    current += char;
            }
        } else {
            current += char;
        }
    }

    if (current) {
        result.push(current.trim());
    }

    return result;
}
function splitAssignment(input) {
    let result = [];
    let current = "";

    let inSingleQuotes = false;
    let inDoubleQuotes = false;

    let notset = true;

    let bracketDepth = 0;
    let squareDepth = 0;
    let curlyDepth = 0;

    let ops = ["+","-","*","/"];
    let opsae = ops.concat("=");

    let i = -1;
    for (let char of input) {
        i ++;
        if (char == '"' && !inSingleQuotes) {
            inDoubleQuotes = !inDoubleQuotes;
        }
        if (char == "'" && !inDoubleQuotes) {
            inSingleQuotes = !inSingleQuotes;
        }

        let inAnyQuotes = inSingleQuotes || inDoubleQuotes;

        if (!inAnyQuotes) {
            switch (char) {
                case "{":
                    curlyDepth ++;
                    current += char;
                    break
                case "}":
                    curlyDepth --;
                    current += char;
                    if (bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0) {
                        if (current) {
                            result.push(current.trim());
                            current = "";
                        }
                    }
                    break;

                case "[":
                    squareDepth ++;
                    current += char;
                    break
                case "]":
                    squareDepth --;
                    current += char;
                    break;

                case "(":
                    bracketDepth ++;
                    current += char;
                    break
                case ")":
                    bracketDepth --;
                    current += char;
                    break;

                case "=":
                    if (bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0) {
                        if (ops.includes(input[i-1]) && notset) {
                            current += char;
                            result.push(current.trim());
                            current = "";
                            notset = false;
                            continue;
                        }
                    }
                    if (bracketDepth == 0 && curlyDepth == 0 && squareDepth == 0 && notset) {
                        if (!(ops.includes(input[i-1]))) {
                            if (current.trim()) {
                                result.push(current.trim());
                            }
                            result.push(char);
                            current = "";
                        } else {
                            current += char;
                            if (current) {
                                result.push(current.trim());
                            }
                            current = "";
                        }
                    } else {
                        current += char;
                    }
                    break
                default:
                    if (ops.includes(input[i+1]) && opsae.includes(input[i+2]) && notset) {
                        if (current.trim()) {
                            result.push(current.trim());
                        }
                        current = "";
                    }
                    current += char;
            }
        } else {
            current += char;
        }
    }

    if (current) {
        result.push(current.trim());
    }

    return result;
}
function splitByFirstSpace(str) {
    const firstSpaceIndex = str.indexOf(' ');

    if (firstSpaceIndex === -1) {
        return [str];
    }

    const firstPart = str.slice(0, firstSpaceIndex);
    const secondPart = str.slice(firstSpaceIndex + 1);

    return [firstPart, secondPart];
}
function splitCharedCommand(str, chr) {
    const result = [];
    let buffer = '';
    let insideDoubleQuotes = false;
    let insideSingleQuotes = false;
    let parensDepth = 0;
    let curlyDepth = 0;
    let squareDepth = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        // Handle quote states
        if (char === '"' && !insideSingleQuotes && parensDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
            insideDoubleQuotes = !insideDoubleQuotes;
            buffer += char;
            continue;
        }
        if (char === "'" && !insideDoubleQuotes && parensDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
            insideSingleQuotes = !insideSingleQuotes;
            buffer += char;
            continue;
        }

        // Handle brackets depth
        if (!insideDoubleQuotes && !insideSingleQuotes) {
            if (char === '(') {
                parensDepth++;
                buffer += char;
                continue;
            }
            if (char === '{') {
                curlyDepth++;
                buffer += char;
                continue;
            }
            if (char === '[') {
                squareDepth++;
                buffer += char;
                continue;
            }
            if (char === ')' && parensDepth > 0) {
                parensDepth--;
                buffer += char;
                continue;
            }
            if (char === '}' && curlyDepth > 0) {
                curlyDepth--;
                buffer += char;
                continue;
            }
            if (char === ']' && squareDepth > 0) {
                squareDepth--;
                buffer += char;
                continue;
            }
        }

        // Split by spaces if not inside quotes or brackets
        if (char === chr && !insideDoubleQuotes && !insideSingleQuotes && parensDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
            if (buffer.length > 0) {
                result.push(buffer.trim());
                buffer = '';
            }
        } else {
            buffer += char;
        }
    }

    // Push the final buffer
    if (buffer.length > 0) {
        result.push(buffer.trim());
    }

    return result;
}
function splitCommand(input) {
    const result = [];
    let currentPart = '';
    let isInQuotes = false;
    let quoteChar = '';
    let depth = 0;
    let cdepth = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Handle quotes (either single ' or double ")
        if (isInQuotes) {
            currentPart += char;
            if (char === quoteChar) {
                isInQuotes = false;
                // End of quoted part
            }
        } else if (char === '"' || char === "'") {
            isInQuotes = true;
            quoteChar = char;
            currentPart += char;
        } // Handle opening brackets (parentheses, curly braces, square brackets)
        else if (char === '(') {
            if (depth == 0 && cdepth == 0) {
                if (currentPart != "") {
                    result.push(currentPart.trim());
                }
                currentPart = "(";
            } else {
                currentPart += "(";
            }
            depth++;
        } // Handle closing parentheses
        else if (char === ')') {
            depth--;
            if (depth == 0 && cdepth == 0) {
                currentPart += ")";
                if (currentPart != "") {
                    result.push(currentPart.trim());
                }
                currentPart = "";
            } else {
                currentPart += ")";
            }
        } // Regular characters
        else {
            currentPart += char;
        }
        if (char === '{') {
            cdepth++;
        } else if (char === '}') {
            cdepth--;
        }
    }

    if (currentPart != "") {
        result.push(currentPart.trim())
    }

    return result;
}
function splitReferences(str) {
    const result = [];
    let buffer = '';
    let parensDepth = 0;
    let curlyDepth = 0;
    let squareDepth = 0;
    let isInQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (isInQuotes) {
            buffer += char;
            if (char === quoteChar) {
                isInQuotes = false;
                // End of quoted part
            }
            continue;
        } else if (char === '"' || char === "'") {
            isInQuotes = true;
            quoteChar = char;
            buffer += char;
            continue;
        }

        if (char === '(') parensDepth++;
        if (char === '{') curlyDepth++;
        if (char === '[') squareDepth++;

        if (char === ')') parensDepth--;
        if (char === '}') curlyDepth--;
        if (char === ']') squareDepth--;

        // Handle brackets opening
        if (char === '[' && squareDepth == 1) {

            if (parensDepth === 0 && curlyDepth === 0) {
                if (buffer != "") {
                    result.push(buffer);
                    buffer = '';
                }
            }

            // Start a new bracketed section
            buffer += char;

            continue;
        }

        // Handle brackets closing
        if (char === ']' && squareDepth == 0) {

            buffer += char; // Add closing bracket

            // Decrease depth for corresponding bracket type

            // If we've closed all the depth of that type, push the buffer
            if (parensDepth === 0 && curlyDepth === 0) {
                result.push(buffer);
                buffer = '';
            }
            continue;
        }

        buffer += char;
    }

    // Push any remaining buffer
    if (buffer.length > 0) {
        result.push(buffer);
    }

    return result;
}
function splitCommandParams(input) {
    const result = [];
    let currentSegment = '';
    let inDoubleQuotes = false;
    let inSingleQuotes = false;
    let inCurlyBraces = 0;
    let inSquareBrackets = 0;
    let inParentheses = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Handle escaping in quotes (e.g. "this, is a \"comma\" example")
        if (inDoubleQuotes && char === '\\' && i + 1 < input.length) {
            currentSegment += char + input[i + 1];
            i++;
            // Skip the escaped character
            continue;
        } else if (inSingleQuotes && char === '\\' && i + 1 < input.length) {
            currentSegment += char + input[i + 1];
            i++;
            // Skip the escaped character
            continue;
        }

        // Handle opening and closing of delimiters
        if (char === '"' && !inSingleQuotes && !inCurlyBraces && !inSquareBrackets && !inParentheses) {
            inDoubleQuotes = !inDoubleQuotes;
            currentSegment += char;
        } else if (char === "'" && !inDoubleQuotes && !inCurlyBraces && !inSquareBrackets && !inParentheses) {
            inSingleQuotes = !inSingleQuotes;
            currentSegment += char;
        } else if (char === '{' && !inDoubleQuotes && !inSingleQuotes) {
            inCurlyBraces++;
            currentSegment += char;
        } else if (char === '}' && !inDoubleQuotes && !inSingleQuotes) {
            inCurlyBraces--;
            currentSegment += char;
        } else if (char === '[' && !inDoubleQuotes && !inSingleQuotes) {
            inSquareBrackets++;
            currentSegment += char;
        } else if (char === ']' && !inDoubleQuotes && !inSingleQuotes) {
            inSquareBrackets--;
            currentSegment += char;
        } else if (char === '(' && !inDoubleQuotes && !inSingleQuotes) {
            inParentheses++;
            currentSegment += char;
        } else if (char === ')' && !inDoubleQuotes && !inSingleQuotes) {
            inParentheses--;
            currentSegment += char;
        } else if (char === ',' && !inDoubleQuotes && !inSingleQuotes && inCurlyBraces === 0 && inSquareBrackets === 0 && inParentheses === 0) {
            // Split if comma is outside of any delimiters
            result.push(currentSegment.trim());
            currentSegment = '';
        } else {
            currentSegment += char;
        }
    }

    // Push the last segment if it exists
    if (currentSegment) {
        result.push(currentSegment.trim());
    }
    return result;
}

function generateAstFunction(content) {
    let ast = {
        "content": generateAstSegment(content)
    };

    return ast;
}
function generateAstSegment(content) {
    let ast = []
    for (let segment_i = 0; segment_i < content.length; segment_i++) {
        let segment_item = generateAstSegmentItem(splitCommand(removeComments(content[segment_i])), removeComments(content[segment_i]));
        if (segment_item != null) {
            ast.push(segment_item);
        }
    }
    return ast;
}
function generateAstSegmentItem(content, raw) {
    let ast = {}
    if (raw.startsWith("//")) { return {}; }

    let first = splitByFirstSpace(raw);
    if (first.length > 1) {
        switch (first[0]) {
            case "return":
                return {
                    "type":"return",
                    "value":generateAstArgument(first[1])
                }
        }
    }
    if (content.length == 2) {
        if (!isBrackets(content[0]) && !isCurlyBrackets(content[0]) && isBrackets(content[1]) && !isCurlyBrackets(content[1])) {
            if (isValidVariableFormat(content[0])) {
                ast = generateAstCommand(content);
                if (Object.keys(ast).length > 0) {
                    return ast;
                }
            }
        }
    } else if (content.length > 2) {
        if (!isBrackets(content[0]) && !isCurlyBrackets(content[0]) && isBrackets(content[1]) && !isCurlyBrackets(content[1])) {
            if (isValidVariableFormat(content[0])) {
                ast = generateAstStatement(content);
                if (Object.keys(ast).length > 0) {
                    return ast;
                }
            }
        }
    }
    let stat = splitStatement(raw);
    if (stat.length == 2) {
        if (!isBrackets(stat[0]) && !isCurlyBrackets(stat[0]) && !isBrackets(stat[1]) && isCurlyBrackets(stat[1])) {
            if (isValidVariableFormat(stat[0])) {
                ast = {
                    "type":"command",
                    "id":stat[0],
                    "content":generateAstSegment(splitSegment(removeCurlyBraces(stat[1])))
                }
                return ast;
            }
            let tkns = stat[0].split(" ");
            let type = tkns.shift();
            let name = tkns.shift();
            if (isValidDefinitionFormat(name)) {
                ast = {
                    "type":"definition",
                    "id":type,
                    "name":name,
                    "raw":splitSegment(removeCurlyBraces(stat[1]))
                }
                return ast;
            }
        }
    }
    ast = generateAstArgument(raw, ["standalone"]);
    if (ast) {
        if (Object.keys(ast).length > 0) {
            let oast = ast;
            ast = {}
            ast["data"] = oast;
            ast["type"] = "standalone";
            return ast;
        }
    }
    
    return ast;
}
function generateAstCommand(item) {
    let ast = {};

    if (isValidVariableFormat(item[0])) {
        ast["type"] = "command";
        ast["id"] = item[0];
        ast["args"] = generateAstArguments(splitCommandParams(removeBraces(item[1])));
    }
    
    return ast;
}
function generateAstStatement(item) {
    let ast = {};

    ast["type"] = "command";
    ast["id"] = item[0];
    ast["args"] = generateAstArguments(splitCommandParams(removeBraces(item[1])));
    if (item.length == 3) {
        if (isCurlyBrackets(item[2])) {
            ast["content"] = generateAstSegment(splitSegment(removeCurlyBraces(item[2])));
        }
    }

    return ast;
}
function generateAstArguments(args) {
    let arr = [];
    for (let arg of args) {
        arr.push(generateAstArgument(arg));
    }
    return arr;
}
function generateAstArgument(item, flags) {
    if (typeof (flags) != 'object') {
        flags = []
    }

    let assign = splitAssignment(item);
    if (assign.length == 3 && isValidAssignFormat(assign[0])) {
        switch (assign[1]) {
            case "=":
                return {
                    "type": "assignment",
                    "key": generateAstArgument(assign[0]),
                    "value": generateAstArgument(assign[2])
                }
            case "+=":
                return {
                    "type": "assignment_math",
                    "id": "inc_by",
                    "key": generateAstArgument(assign[0]),
                    "value": generateAstArgument(assign[2])
                }
            case "-=":
                return {
                    "type": "assignment_math",
                    "id": "dec_by",
                    "key": generateAstArgument(assign[0]),
                    "value": generateAstArgument(assign[2])
                }
            default:
                console.warn(assign[1]);
        }
    } else if (assign.length == 2 && isValidFunctionFormat(assign[0])) {
        switch(assign[1]) {
            case "++":
                return {
                    "type": "assignment_math",
                    "id": "inc",
                    "key": generateAstArgument(assign[0])
                }
            case "--":
                return {
                    "type": "assignment_math",
                    "id": "dec",
                    "key": generateAstArgument(assign[0])
                }
        }
    }

    // numbers
    if (isNumeric(item)) {
        return [Number(item), "number"]
    }

    let logic = splitLogic(item);
    if (logic.length > 1) {
        let data = [];
        let i = 0;
        while (i < logic.length) {
            switch (logic[i]) {
                case "and":
                    data.push("and");
                    break
                case "or":
                    data.push("or");
                    break
                case "&&":
                    data.push("and");
                    break
                case "||":
                    data.push("or");
                    break
                default:
                    if (isBrackets(logic[i])) {
                        data.push(generateAstArgument(logic[i]));
                    } else {
                        data.push(generateAstArgument(logic[i]));
                    }
                    break
            }
            i++;
        }
        let ast = {};
        ast["type"] = "logic";
        ast["data"] = data;
        return ast;
    }

    let comparison = splitComparsion(item);
    if (comparison.length == 3) {
        let a = generateAstArgument(comparison[0]);
        let b = generateAstArgument(comparison[2]);
        let type = "";
        let comparison_table = {
            "==": "equal",
            "!=": "not_equal",
            "~=": "string_equal",
            ":=": "type_equal",
            ">": "greater",
            "<": "smaller",
            ">=": "greater_equal",
            "<=": "smaller_equal"
        }
        type = comparison_table[comparison[1]]
        return {
            "type": "comparison",
            "id": type,
            "a": a,
            "b": b
        };
    }

    if (item[0] == "*") { // reference
        const val = item.substring(1);
        return {
            "type": "pointer",
            "value": generateAstArgument(val)
        };
    }

    let operators = splitOperators(item);
    if (operators.length > 1) {
        let data = [];
        let i = 0;
        while (i < operators.length) {
            switch (operators[i]) {
                case "+": case "++": case "-": case "*": case "/":
                    data.push(operators[i]);
                    break
                default:
                    data.push(generateAstArgument(operators[i]));
                    break
            }
            i++;
        }
        let ast = {};
        ast["type"] = "operation";
        ast["data"] = data;
        return ast;
    }

    
    if (item[0] == "!") {
        const val = item.substring(1);
        return {
            "type": "invert",
            "value": generateAstArgument(val)
        };
    }
    if (item[0] == "?") {
        const val = item.substring(1);
        return {
            "type": "boolify",
            "value": generateAstArgument(val)
        };
    }
    
    let methods = splitCharedCommand(item,".");
    if (methods.length > 1) {
        let ast = {
            "type": "methods",
            "value": generateAstArgument(methods[0]),
            "list": []
        }
        
        for (let methodi = 1; methodi < methods.length; methodi++) {
            let squareRefs = splitReferences(methods[methodi]);
            let method = squareRefs[0];
            let cmd = splitCommand(method);
            let isKey = cmd.length == 1 &&
                (!isBrackets(cmd[0]) && !isCurlyBrackets(cmd[0]) && !isSquareBrackets(cmd[0]));
            let isMethod = cmd.length == 2 &&
                (!isBrackets(cmd[0]) && !isCurlyBrackets(cmd[0]) && !isSquareBrackets(cmd[0])) &&
                (isBrackets(cmd[1]) && !isCurlyBrackets(cmd[1]) && !isSquareBrackets(cmd[1]));


            if (isKey) {
                ast["list"].push({
                    "type": "get_key",
                    "key": cmd[0]
                })
            }
            if (isMethod) {
                ast["list"].push({
                    "type": "method",
                    "key": cmd[0],
                    "args": generateAstArguments(
                        splitCommandParams(
                            removeBraces(cmd[1])
                        )
                    )
                })
            }
            squareRefs.shift();
            for (const key of squareRefs) {
                if (isSquareBrackets(key)) {
                    ast["list"].push({
                        "type": "key",
                        "value": generateAstArgument(removeSquareBraces(key))
                    })
                } else {
                    console.warn("unexpected token '" + key + "'")
                }
            }
        }
        return ast;
    }

    let command = splitCommand(item);
    if (command.length == 3 || command.length == 4) {
        if (command[0] == "fn" && (isBrackets(command[1]) && isCurlyBrackets(command[2]))) {
            let ast_fn = {};
            ast_fn["key"] = "inlineFunc";
            ast_fn["hash"] = "infn_" + MD5(item);
            if (isBrackets(command[1])) {
                let pairs = splitCommandParams(removeBraces(command[1]));
                if (pairs.length > 0) {

                    let ast_fn_args = {};
                    let ast_fn_arg_map = [];
                    for (let raw_pair of pairs) {
                        let pair = splitCharedCommand(raw_pair, " ");
                        if (pair.length == 2) {
                            ast_fn_args[pair[1]] = pair[0];
                            ast_fn_arg_map.push(pair[1]);
                        }
                    }

                    ast_fn["args"] = ast_fn_args
                    ast_fn["arg_map"] = ast_fn_arg_map
                }
            }
            ast_fn["type"] = "function";
            ast_fn["content"] = generateAstSegment(splitSegment(removeCurlyBraces(command[2])));
            if (command.length == 4) {
                ast_fn["runArgs"] = generateAstArguments(splitCommandParams(removeBraces(command[3])));
            }
            return ast_fn;
        }
    }
    if (command.length == 2) {
        if (command[0] != "") {
            if ((!isBrackets(command[0]) && !isCurlyBrackets(command[0]) && !isSquareBrackets(command[0])) &&
                (isBrackets(command[1]) && !isCurlyBrackets(command[1]) && !isSquareBrackets(command[1]))) {
                if (isValidFunctionFormat(command[0])) {
                    return {
                        "type": "command",
                        "key": generateAstArgument(command[0]),
                        "args": generateAstArguments(splitCommandParams(removeBraces(command[1])))
                    }
                }
            }
        }
    }
    if (command.length > 1) {
        let isCasts = false;
        for (let index = 0; index < command.length-1; index++) {
        }
        if (isCasts) {
            let casts = [];
            for (let index = 0; index < command.length-1; index++) {
                const element = command[index];
                if (isBrackets(element)) {
                    const type = removeBraces(element);
                    if (isValidVariableFormat(type)) {
                        casts.push(type);
                    } else {
                        casts.push(generateAstArgument(type));
                    }
                } else {
                    console.error("unexpected token",element);
                }
            }
            return {
                "type":"cast",
                "casts": casts,
                "value": generateAstArgument(command[command.length-1])
            }
        }
    }

    // constants
    switch (item) {
        case "true":
            return [true, "bool"];
        case "false":
            return [false, "bool"];
        case "null":
            return [null, "null"];
    }

    // strings
    if (item[0] == '"' && item[item.length - 1] == '"') {
        return [item.substring(1, item.length - 1), "string"];
    }
    if (item[0] == "'" && item[item.length - 1] == "'") {
        return [item.substring(1, item.length - 1), "string"];
    }

    let references = splitReferences(item);
    if (references.length > 1) {
        let ast = {
            "type": "key_get",
            "value": generateAstArgument(references[0])
        }
        let keys = []
        for (let i = 1; i < references.length; i++) {
            if (isSquareBrackets(references[i])) {
                keys.push({
                    "type": "key",
                    "value": generateAstArgument(removeSquareBraces(references[i]))
                })
            } else {
                console.warn("unexpected token '" + references[i] + "'")
            }
        }
        ast["keys"] = keys
        return ast;
    }

    if (isCurlyBrackets(item)) {
        let obj = {
            "type": "object",
            "keys": [],
            "values": []
        };
        let pairs = splitCommandParams(removeCurlyBraces(item))
        for (let pair of pairs) {
            let pair_tokens = splitCharedCommand(pair.trim(), ":");
            obj["keys"].push(deStr(pair_tokens[0].trim()));
            obj["values"].push(generateAstArgument(pair_tokens[1].trim()));
        }
        return obj;
    }
    if (isSquareBrackets(item)) {
        let arr = {
            "type": "array",
            "values": []
        }
        let items = splitCommandParams(removeSquareBraces(item).trim())
        for (let itm of items) {
            arr["values"].push(generateAstArgument(itm.trim()));
        }
        return arr;
    }

    if (isBrackets(item)) {
        return generateAstArgument(removeBraces(item))
    }

    if (flags.includes("func")) {
        return item;
    }
    if (flags.includes("standalone")) {
        return {}
    }
    if (isValidVariableFormat(item)) {
        return {
            "type": "reference",
            "key": item
        };
    } else {
        console.warn("unexpected argument '" + item + "'");
    }
}
export function generateAst(code) {
    let ast = {
        "functions": {},
        "externals": {},
        "externals_ref": {},
        "hash": "ast_" + MD5(code)
    };
    
    let topLayer = splitSegment(code);
    for (let i = 0; i < topLayer.length; i++) {
        let def = splitStatement(topLayer[i]);
        if (def.length == 2) {
            let defcmd = splitCommand(def[0]);
            let defspaced = defcmd[0].split(" ");
            switch (defspaced[0]) {
                case "def":
                    defspaced.shift();
                    const name = defspaced[0];
                    defspaced.shift();
                    break
            }
        }
    }
    for (let i = 0; i < topLayer.length; i++) {
        let def = splitStatement(topLayer[i]);

        if (def.length == 1) {
            let defcmd = splitCommand(def[0]);
            let defspaced = defcmd[0].split(" ");

            switch (defspaced[0]) {
                case "import":
                    if (defspaced.length > 1) {
                        let id = defspaced[1];
                        if (Object.keys(local_modules).includes(id)) {
                            if (defspaced.length == 2) {
                                ast["externals"][id] = generateAst(local_modules[id]);
                                ast["externals_ref"][id] = id;
                            } else if (defspaced.length == 4) {
                                if (defspaced[2] == "as") {
                                    ast["externals"][id] = generateAst(local_modules[id]);
                                    ast["externals_ref"][defspaced[3]] = id;
                                } else {
                                    console.warn("unknown import syntax '" + defspaced.join(" ") + "'");
                                }
                            }
                        } else {
                            console.warn("unknown module '" + defspaced[1] + "'");
                        }
                    }
                    break
            }
        }
        if (def.length == 2) {
            let defcmd = splitCommand(def[0]);
            let defspaced = defcmd[0].split(" ");

            switch (defspaced[0]) {
                case "fn":
                    let content = []
                    if (def.length == 2) {
                        content = splitSegment(removeCurlyBraces(def[1]));
                    }
                    let ast_fn = generateAstFunction(content);
                    ast_fn["key"] = defspaced[1];
                    ast_fn["hash"] = "fn_" + MD5(topLayer[i]);

                    if (defcmd.length == 2) {
                        if (isBrackets(defcmd[1])) {
                            let pairs = splitCommandParams(removeBraces(defcmd[1]));
                            if (pairs.length > 0) {

                                let ast_fn_args = {};
                                let ast_fn_arg_map = [];
                                for (let raw_pair of pairs) {
                                    let pair = splitCharedCommand(raw_pair, " ");
                                    if (pair.length == 2) {
                                        ast_fn_args[pair[1]] = pair[0];
                                        ast_fn_arg_map.push(pair[1]);
                                    }
                                }

                                ast_fn["args"] = ast_fn_args
                                ast_fn["arg_map"] = ast_fn_arg_map
                            }
                        }
                    } else {
                        fsl_error("function defined without parameters");
                    }

                    ast["functions"][defspaced[1]] = ast_fn;
                    break
            }
        }
    }

    return ast;
}