export function splitLogic(input) {
    const result = [];
    let buffer = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBrackets = 0;
    let inBraces = 0;
    let inParens = 0;
    let escape = false;  // To track if we are escaping a character

    const logicalOperatorsRegex = /(\|\||&&)/;

    // Match logical operators
    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Handle escape sequences
        if (escape) {
            buffer += char;
            escape = false;
            continue;
        }

        // Check for escape character
        if (char === '\\') {
            escape = true;
            buffer += char;
            continue;
        }

        // Toggle flags for quotes (but skip if the quote is escaped)
        if (char === "'" && !inDoubleQuote && !escape) {
            inSingleQuote = !inSingleQuote;
        } else if (char === '"' && !inSingleQuote && !escape) {
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
export function splitOperators(input) {
    const operators = ["+", "-", "*", "/"];
    const result = [];
    let buffer = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBrackets = 0;
    let inBraces = 0;
    let inParens = 0;
    let escapeNext = false; // Flag for escaping characters

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (escapeNext) {
            // If the previous character was an escape, we don't toggle the quote flag
            escapeNext = false;
            buffer += char;
            continue;
        }

        if (char === '\\') {
            // Set escape flag if we encounter a backslash
            escapeNext = true;
            buffer += char;
            continue;
        }

        if (char === "'" && !inDoubleQuote && !inBrackets && !inBraces && !inParens) {
            // Toggle single quote unless escaped
            if (!escapeNext) {
                inSingleQuote = !inSingleQuote;
            }
            buffer += char;
        } else if (char === '"' && !inSingleQuote && !inBrackets && !inBraces && !inParens) {
            // Toggle double quote unless escaped
            if (!escapeNext) {
                inDoubleQuote = !inDoubleQuote;
            }
            buffer += char;
        } else if (!inSingleQuote && !inDoubleQuote) {
            // Track brackets, braces, and parentheses nesting
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

            // Split on operators only when not inside quotes, brackets, braces, or parentheses
            if (operators.includes(char) && inBrackets === 0 && inBraces === 0 && inParens === 0) {
                if (char != "+" || (char == "+" && (input[i-1] != "+" && input[i+1] != "+"))) {
                    if (buffer.trim()) {
                        result.push(buffer.trim());
                    }
                    result.push(char); // Keep the operator as a separate element
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
        } else {
            // Continue accumulating characters inside quotes or other structures
            buffer += char;
        }
    }

    // Push the last buffer if not empty
    if (buffer.trim()) {
        result.push(buffer.trim());
    }

    return result;
}
export function splitComparsion(input) {
    const operators = /(==|!=|~=|:=|>=|<=)/;
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
        const prevChar = input[i - 1];

        // Check for escaped quotes (preceded by a backslash)
        const isEscapedSingleQuote = prevChar === '\\' && char === "'";
        const isEscapedDoubleQuote = prevChar === '\\' && char === '"';

        // Toggle flags for quotes, but ignore escaped quotes
        if (char === "'" && !inDoubleQuote && !isEscapedSingleQuote && !inBrackets && !inBraces && !inParens) {
            inSingleQuote = !inSingleQuote;
        } else if (char === '"' && !inSingleQuote && !isEscapedDoubleQuote && !inBrackets && !inBraces && !inParens) {
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
export function splitStatement(input) {
    const result = [];
    let currentPart = '';
    let braceCount = 0;
    let parenCount = 0;
    let insideQuotes = false;
    let quoteType = '';
    let i = 0;

    while (i < input.length) {
        const char = input[i];
        const prevChar = input[i - 1];

        // Handle escaped quotes (preceded by a backslash)
        const isEscapedQuote = prevChar === '\\';

        // Check for the start of a quote
        if ((char === '"' || char === "'") && !isEscapedQuote) {
            if (!insideQuotes) {
                insideQuotes = true;
                quoteType = char;
                // Remember the type of quote
            } else if (char === quoteType) {
                insideQuotes = false;
                // Exit quotes only if the same type of quote is encountered
            }
        }

        // If we are outside quotes, handle braces and parentheses
        if (!insideQuotes) {
            if (char === '(') {
                parenCount++;
                currentPart += char;
            } else if (char === ')') {
                parenCount--;
                currentPart += char;
            } else if (char === '{') {
                if (parenCount === 0 && braceCount === 0) {
                    if (currentPart.trim()) {
                        result.push(currentPart.trim());
                        currentPart = '';
                    }
                }
                currentPart += char;
                braceCount++;
            } else if (char === '}') {
                braceCount--;
                currentPart += char;
                if (parenCount === 0 && braceCount === 0) {
                    if (currentPart.trim()) {
                        result.push(currentPart.trim());
                        currentPart = '';
                    }
                }
            } else if (char === ';' && braceCount === 0 && parenCount === 0) {
                result.push(currentPart.trim());
                currentPart = '';
            } else {
                currentPart += char;
            }
        } else {
            currentPart += char;
        }

        i++;
    }

    // Push any remaining part that wasn't processed
    if (currentPart.trim()) {
        result.push(currentPart.trim());
    }

    return result;
}
export function splitSegment(input) {
    let result = [];
    let current = "";

    let inSingleQuotes = false;
    let inDoubleQuotes = false;

    let bracketDepth = 0;
    let squareDepth = 0;
    let curlyDepth = 0;

    let i = -1;
    for (let char of input) {
        i++;

        // Handle escaped quotes
        const prevChar = i > 0 ? input[i - 1] : null;
        const isEscapedQuote = prevChar === '\\';

        // Toggle quotes unless the quote is escaped
        if (char === '"' && !inSingleQuotes && !isEscapedQuote) {
            inDoubleQuotes = !inDoubleQuotes;
        }
        if (char === "'" && !inDoubleQuotes && !isEscapedQuote) {
            inSingleQuotes = !inSingleQuotes;
        }

        let inAnyQuotes = inSingleQuotes || inDoubleQuotes;

        // Handle other characters when not inside quotes
        if (!inAnyQuotes) {
            switch (char) {
                case "{":
                    curlyDepth++;
                    current += char;
                    break;
                case "}":
                    curlyDepth--;
                    current += char;
                    if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0 && input[i + 1] !== "(") {
                        if (current) {
                            result.push(current.trim());
                            current = "";
                        }
                    }
                    break;
                case "[":
                    squareDepth++;
                    current += char;
                    break;
                case "]":
                    squareDepth--;
                    current += char;
                    break;
                case "(":
                    bracketDepth++;
                    current += char;
                    break;
                case ")":
                    bracketDepth--;
                    current += char;
                    break;
                case ";":
                    if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
                        if (current) {
                            result.push(current.trim());
                            current = "";
                        }
                    } else {
                        current += char;
                    }
                    break;
                default:
                    current += char;
            }
        } else {
            current += char;
        }
    }

    // Push any remaining part if necessary
    if (current) {
        result.push(current.trim());
    }

    return result;
}
export function splitAssignment(input) {
    let result = [];
    let current = "";

    let inSingleQuotes = false;
    let inDoubleQuotes = false;

    let notset = true;

    let bracketDepth = 0;
    let squareDepth = 0;
    let curlyDepth = 0;

    let ops = ["+", "-", "*", "/"];
    let opsae = ops.concat("=");

    let i = -1;
    for (let char of input) {
        i++;

        const prevChar = i > 0 ? input[i - 1] : null;
        const isEscapedQuote = prevChar === '\\';

        // Toggle quotes unless the quote is escaped
        if (char === '"' && !inSingleQuotes && !isEscapedQuote) {
            inDoubleQuotes = !inDoubleQuotes;
        }
        if (char === "'" && !inDoubleQuotes && !isEscapedQuote) {
            inSingleQuotes = !inSingleQuotes;
        }

        let inAnyQuotes = inSingleQuotes || inDoubleQuotes;

        // Process outside of quotes
        if (!inAnyQuotes) {
            switch (char) {
                case "{":
                    curlyDepth++;
                    current += char;
                    break;
                case "}":
                    curlyDepth--;
                    current += char;
                    if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
                        if (current) {
                            result.push(current.trim());
                            current = "";
                        }
                    }
                    break;

                case "[":
                    squareDepth++;
                    current += char;
                    break;
                case "]":
                    squareDepth--;
                    current += char;
                    break;

                case "(":
                    bracketDepth++;
                    current += char;
                    break;
                case ")":
                    bracketDepth--;
                    current += char;
                    break;

                case "=":
                    if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0 && notset) {
                        // Assignment with operator (e.g., x+=2)
                        if (ops.includes(input[i - 1]) && notset && !(ops.includes(char))) {
                            current += char;
                            result.push(current.trim());
                            current = "";
                            notset = false;
                            continue;
                        }
                    }
                    if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0 && notset && !(opsae.includes(input[i + 1])) && !(opsae.includes(input[i - 1]))) {
                        // If not inside any brackets/braces/square brackets and operator not set
                        if (!(ops.includes(input[i - 1]))) {
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
                        notset = false;
                    } else {
                        current += char;
                    }
                    break;

                default:
                    // Handle operators or other characters
                    if (ops.includes(input[i + 1]) && opsae.includes(input[i + 2]) && notset) {
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
export function splitByFirstSpace(str) {
    // Trim leading and trailing spaces first (optional)
    str = str.trim();

    const firstSpaceIndex = str.indexOf(' ');

    // If there's no space, return the whole string as the first part
    if (firstSpaceIndex === -1) {
        return [str];
    }

    // Split into the first part and the rest of the string
    const firstPart = str.slice(0, firstSpaceIndex);
    const secondPart = str.slice(firstSpaceIndex + 1);

    return [firstPart, secondPart];
}
export function splitCharedCommand(str, chr) {
    const result = [];
    let buffer = '';
    let insideDoubleQuotes = false;
    let insideSingleQuotes = false;
    let parensDepth = 0;
    let curlyDepth = 0;
    let squareDepth = 0;
    let escaping = false;  // Track if we are escaping a character

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        // Handle escape sequences (escape character is backslash \)
        if (escaping) {
            buffer += char;
            escaping = false;  // Reset escaping after the character is added
            continue;
        }

        // Check if the current character is an escape character
        if (char === '\\') {
            escaping = true;  // Mark that the next character should be treated as escaped
            buffer += char;
            continue;
        }

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

        // Split by the specified character if not inside quotes or brackets
        if (char === chr && !insideDoubleQuotes && !insideSingleQuotes && parensDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
            if (buffer.length > 0) {
                result.push(buffer.trim());
                buffer = '';
            }
        } else {
            buffer += char;
        }
    }

    // Push the final buffer if it contains any content
    if (buffer.length > 0) {
        result.push(buffer.trim());
    }

    return result;
}
export function splitCommand(input) {
    const result = [];
    let currentPart = '';
    let isInQuotes = false;
    let quoteChar = '';
    let depth = 0;        // Parentheses depth
    let cdepth = 0;       // Curly braces depth
    let sdepth = 0;       // Square brackets depth
    let escaping = false; // Flag for escaping characters

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Handle escaping
        if (escaping) {
            currentPart += char; // Add the escaped character to the current part
            escaping = false;     // Reset escaping flag
            continue;
        }

        // Handle escape sequences (escape character is backslash)
        if (char === '\\') {
            escaping = true; // Next character should be treated as a literal
            currentPart += char; // Add the backslash to the current part
            continue;
        }

        // Handle quotes (either single ' or double ")
        if (isInQuotes) {
            currentPart += char;
            if (char === quoteChar) {
                isInQuotes = false; // End of quoted part
            }
        } else if (char === '"' || char === "'") {
            isInQuotes = true;
            quoteChar = char; // Track which type of quote we are inside
            currentPart += char;
        } // Handle opening brackets (parentheses, curly braces, square brackets)
        else if (char === '(') {
            if (depth === 0 && cdepth === 0 && sdepth === 0) {
                if (currentPart !== "") {
                    result.push(currentPart.trim());
                }
                currentPart = "(";
            } else {
                currentPart += "(";
            }
            depth++;
        } else if (char === ')') {
            depth--;
            if (depth === 0 && cdepth === 0 && sdepth === 0) {
                currentPart += ")";
                if (currentPart !== "") {
                    result.push(currentPart.trim());
                }
                currentPart = "";
            } else {
                currentPart += ")";
            }
        } // Handle curly braces
        else if (char === '{') {
            cdepth++;
            currentPart += char;
        } else if (char === '}') {
            cdepth--;
            currentPart += char;
            if (depth === 0 && cdepth === 0 && sdepth === 0) {
                if (currentPart !== "") {
                    result.push(currentPart.trim());
                }
                currentPart = "";
            }
        } // Handle square brackets
        else if (char === '[') {
            sdepth++;
            currentPart += char;
        } else if (char === ']') {
            sdepth--;
            currentPart += char;
            if (depth === 0 && cdepth === 0 && sdepth === 0) {
                if (currentPart !== "") {
                    result.push(currentPart.trim());
                }
                currentPart = "";
            }
        } // Regular characters
        else {
            currentPart += char;
        }
    }

    if (currentPart !== "") {
        result.push(currentPart.trim());
    }

    return result;
}
export function splitReferences(str) {
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
                isInQuotes = false; // End of quoted part
            }
            continue;
        } else if (char === '"' || char === "'") {
            isInQuotes = true;
            quoteChar = char;
            buffer += char;
            continue;
        }

        // Handle bracket depths
        if (char === '(') parensDepth++;
        if (char === '{') curlyDepth++;
        if (char === '[') squareDepth++;

        if (char === ')') parensDepth--;
        if (char === '}') curlyDepth--;
        if (char === ']') squareDepth--;

        // Handle opening square brackets (start a new reference)
        if (char === '[' && squareDepth === 1) {
            // If outside parentheses or curly braces, push the current buffer
            if (parensDepth === 0 && curlyDepth === 0 && buffer !== '') {
                result.push(buffer.trim());
                buffer = '';
            }

            // Start a new bracketed section
            buffer += char;
            continue;
        }

        // Handle closing square brackets
        if (char === ']' && squareDepth === 0) {
            buffer += char; // Add closing bracket
            // If we've closed all the depth of that type, push the buffer
            if (parensDepth === 0 && curlyDepth === 0) {
                result.push(buffer.trim());
                buffer = '';
            }
            continue;
        }

        // If we're inside a reference section (square brackets), keep accumulating the characters
        if (squareDepth > 0) {
            buffer += char;
            continue;
        }

        // Regular characters outside of any quotes or brackets
        buffer += char;
    }

    // Push any remaining buffer
    if (buffer.length > 0) {
        result.push(buffer.trim());
    }

    return result;
}
export function splitCommandParams(input) {
    const result = [];
    let currentSegment = '';
    let inDoubleQuotes = false;
    let inSingleQuotes = false;
    let inCurlyBraces = 0;
    let inSquareBrackets = 0;
    let inParentheses = 0;

    // Helper function to check if we are inside any delimiter
    function isInAnyDelimiter() {
        return inDoubleQuotes || inSingleQuotes || inCurlyBraces > 0 || inSquareBrackets > 0 || inParentheses > 0;
    }

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Handle escape characters inside quotes or other delimiters
        if ((inDoubleQuotes || inSingleQuotes) && char === '\\' && i + 1 < input.length) {
            // If the next character exists, add the escape sequence
            currentSegment += char + input[i + 1];
            i++; // Skip the escaped character
            continue;
        }

        // Handle opening and closing of delimiters
        if (char === '"' && !inSingleQuotes) {
            inDoubleQuotes = !inDoubleQuotes;
            currentSegment += char;
        } else if (char === "'" && !inDoubleQuotes) {
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
        } else if (char === ',' && !isInAnyDelimiter()) {
            // Split by comma if outside any quotes or brackets
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