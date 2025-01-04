
const MD5 = function(r){function n(r,n){var t,o,e,u,f;return e=2147483648&r,u=2147483648&n,f=(1073741823&r)+(1073741823&n),(t=1073741824&r)&(o=1073741824&n)?2147483648^f^e^u:t|o?1073741824&f?3221225472^f^e^u:1073741824^f^e^u:f^e^u}function t(r,t,o,e,u,f,a){return r=n(r,n(n(t&o|~t&e,u),a)),n(r<<f|r>>>32-f,t)}function o(r,t,o,e,u,f,a){return r=n(r,n(n(t&e|o&~e,u),a)),n(r<<f|r>>>32-f,t)}function e(r,t,o,e,u,f,a){return r=n(r,n(n(t^o^e,u),a)),n(r<<f|r>>>32-f,t)}function u(r,t,o,e,u,f,a){return r=n(r,n(n(o^(t|~e),u),a)),n(r<<f|r>>>32-f,t)}function f(r){var n,t="",o="";for(n=0;3>=n;n++)t+=(o="0"+(o=r>>>8*n&255).toString(16)).substr(o.length-2,2);return t}var a,i,C,c,g,h,d,v,S;for(r=function(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var o=r.charCodeAt(t);128>o?n+=String.fromCharCode(o):(127<o&&2048>o?n+=String.fromCharCode(o>>6|192):(n+=String.fromCharCode(o>>12|224),n+=String.fromCharCode(o>>6&63|128)),n+=String.fromCharCode(63&o|128))}return n}(r),a=function(r){for(var n,t=r.length,o=16*(((n=t+8)-n%64)/64+1),e=Array(o-1),u=0,f=0;f<t;)u=f%4*8,e[n=(f-f%4)/4]|=r.charCodeAt(f)<<u,f++;return e[n=(f-f%4)/4]|=128<<f%4*8,e[o-2]=t<<3,e[o-1]=t>>>29,e}(r),h=1732584193,d=4023233417,v=2562383102,S=271733878,r=0;r<a.length;r+=16)i=h,C=d,c=v,g=S,h=t(h,d,v,S,a[r+0],7,3614090360),S=t(S,h,d,v,a[r+1],12,3905402710),v=t(v,S,h,d,a[r+2],17,606105819),d=t(d,v,S,h,a[r+3],22,3250441966),h=t(h,d,v,S,a[r+4],7,4118548399),S=t(S,h,d,v,a[r+5],12,1200080426),v=t(v,S,h,d,a[r+6],17,2821735955),d=t(d,v,S,h,a[r+7],22,4249261313),h=t(h,d,v,S,a[r+8],7,1770035416),S=t(S,h,d,v,a[r+9],12,2336552879),v=t(v,S,h,d,a[r+10],17,4294925233),d=t(d,v,S,h,a[r+11],22,2304563134),h=t(h,d,v,S,a[r+12],7,1804603682),S=t(S,h,d,v,a[r+13],12,4254626195),v=t(v,S,h,d,a[r+14],17,2792965006),h=o(h,d=t(d,v,S,h,a[r+15],22,1236535329),v,S,a[r+1],5,4129170786),S=o(S,h,d,v,a[r+6],9,3225465664),v=o(v,S,h,d,a[r+11],14,643717713),d=o(d,v,S,h,a[r+0],20,3921069994),h=o(h,d,v,S,a[r+5],5,3593408605),S=o(S,h,d,v,a[r+10],9,38016083),v=o(v,S,h,d,a[r+15],14,3634488961),d=o(d,v,S,h,a[r+4],20,3889429448),h=o(h,d,v,S,a[r+9],5,568446438),S=o(S,h,d,v,a[r+14],9,3275163606),v=o(v,S,h,d,a[r+3],14,4107603335),d=o(d,v,S,h,a[r+8],20,1163531501),h=o(h,d,v,S,a[r+13],5,2850285829),S=o(S,h,d,v,a[r+2],9,4243563512),v=o(v,S,h,d,a[r+7],14,1735328473),h=e(h,d=o(d,v,S,h,a[r+12],20,2368359562),v,S,a[r+5],4,4294588738),S=e(S,h,d,v,a[r+8],11,2272392833),v=e(v,S,h,d,a[r+11],16,1839030562),d=e(d,v,S,h,a[r+14],23,4259657740),h=e(h,d,v,S,a[r+1],4,2763975236),S=e(S,h,d,v,a[r+4],11,1272893353),v=e(v,S,h,d,a[r+7],16,4139469664),d=e(d,v,S,h,a[r+10],23,3200236656),h=e(h,d,v,S,a[r+13],4,681279174),S=e(S,h,d,v,a[r+0],11,3936430074),v=e(v,S,h,d,a[r+3],16,3572445317),d=e(d,v,S,h,a[r+6],23,76029189),h=e(h,d,v,S,a[r+9],4,3654602809),S=e(S,h,d,v,a[r+12],11,3873151461),v=e(v,S,h,d,a[r+15],16,530742520),h=u(h,d=e(d,v,S,h,a[r+2],23,3299628645),v,S,a[r+0],6,4096336452),S=u(S,h,d,v,a[r+7],10,1126891415),v=u(v,S,h,d,a[r+14],15,2878612391),d=u(d,v,S,h,a[r+5],21,4237533241),h=u(h,d,v,S,a[r+12],6,1700485571),S=u(S,h,d,v,a[r+3],10,2399980690),v=u(v,S,h,d,a[r+10],15,4293915773),d=u(d,v,S,h,a[r+1],21,2240044497),h=u(h,d,v,S,a[r+8],6,1873313359),S=u(S,h,d,v,a[r+15],10,4264355552),v=u(v,S,h,d,a[r+6],15,2734768916),d=u(d,v,S,h,a[r+13],21,1309151649),h=u(h,d,v,S,a[r+4],6,4149444226),S=u(S,h,d,v,a[r+11],10,3174756917),v=u(v,S,h,d,a[r+2],15,718787259),d=u(d,v,S,h,a[r+9],21,3951481745),h=n(h,i),d=n(d,C),v=n(v,c),S=n(S,g);return(f(h)+f(d)+f(v)+f(S)).toLowerCase()};
function splitLogic(t){const e=[];let i="",r=!1,s=!1,n=0,u=0,c=0,o=!1;const l=/(\|\||&&)/;for(let p=0;p<t.length;p++){const m=t[p];if(o)i+=m,o=!1;else if("\\"!==m){if("'"!==m||s||o?'"'!==m||r||o||(s=!s):r=!r,r||s||("["===m?n++:"]"===m?n--:"{"===m?u++:"}"===m?u--:"("===m?c++:")"===m&&c--),!r&&!s&&0===n&&0===u&&0===c){const r=t.slice(p).match(l);if(r&&0===r.index){i.trim()&&(e.push(i.trim()),i=""),e.push(r[0]),p+=r[0].length-1;continue}}i+=m}else o=!0,i+=m}return i.trim()&&e.push(i.trim()),e}function splitOperators(t){const e=["+","-","*","/"],i=[];let r="",s=!1,n=!1,u=0,c=0,o=0,l=!1;for(let p=0;p<t.length;p++){const m=t[p];l?(l=!1,r+=m):"\\"!==m?"'"!==m||n||u||c||o?'"'!==m||s||u||c||o?s||n?r+=m:("["===m?u++:"]"===m?u--:"{"===m?c++:"}"===m?c--:"("===m?o++:")"===m&&o--,e.includes(m)&&0===u&&0===c&&0===o?"+"!=m||"+"==m&&"+"!=t[p-1]&&"+"!=t[p+1]?(r.trim()&&i.push(r.trim()),i.push(m),r=""):("+"==m&&"+"==t[p+1]&&(i.push(r.trim()),r=""),r+=m,"+"==m&&"+"==t[p-1]&&(i.push(r.trim()),r="")):r+=m):(l||(n=!n),r+=m):(l||(s=!s),r+=m):(l=!0,r+=m)}return r.trim()&&i.push(r.trim()),i}function splitComparsion(t){const e=/(==|!=|~=|:=|>=|<=)/,i=[];let r="",s=!1,n=!1,u=0,c=0,o=0;for(let l=0;l<t.length;l++){const p=t[l],m=t[l+1],h=t[l-1];"'"!==p||n||"\\"===h&&"'"===p||u||c||o?'"'!==p||s||"\\"===h&&'"'===p||u||c||o||(n=!n):s=!s,s||n||("["===p?u++:"]"===p?u--:"{"===p?c++:"}"===p?c--:"("===p?o++:")"===p&&o--),!e.test(p+m)||s||n||0!==u||0!==c||0!==o?![">","<"].includes(p)||s||n||0!==u||0!==c||0!==o?r+=p:(r.trim()&&i.push(r.trim()),i.push(p),r=""):(r.trim()&&i.push(r.trim()),i.push(p+m),r="",l++)}return r.trim()&&i.push(r.trim()),i}function splitStatement(t){const e=[];let i="",r=0,s=0,n=!1,u="",c=0;for(;c<t.length;){const o=t[c],l=t[c-1];'"'!==o&&"'"!==o||"\\"===l||(n?o===u&&(n=!1):(n=!0,u=o)),n?i+=o:"("===o?(s++,i+=o):")"===o?(s--,i+=o):"{"===o?(0===s&&0===r&&i.trim()&&(e.push(i.trim()),i=""),i+=o,r++):"}"===o?(r--,i+=o,0===s&&0===r&&i.trim()&&(e.push(i.trim()),i="")):";"===o&&0===r&&0===s?(e.push(i.trim()),i=""):i+=o,c++}return i.trim()&&e.push(i.trim()),e}function splitSegment(t){let e=[],i="",r=!1,s=!1,n=0,u=0,c=0,o=-1;for(let l of t){o++;const p="\\"===(o>0?t[o-1]:null);if('"'!==l||r||p||(s=!s),"'"!==l||s||p||(r=!r),r||s)i+=l;else switch(l){case"{":c++,i+=l;break;case"}":c--,i+=l,0===n&&0===c&&0===u&&"("!==t[o+1]&&i&&(e.push(i.trim()),i="");break;case"[":u++,i+=l;break;case"]":u--,i+=l;break;case"(":n++,i+=l;break;case")":n--,i+=l;break;case";":0===n&&0===c&&0===u?i&&(e.push(i.trim()),i=""):i+=l;break;default:i+=l}}return i&&e.push(i.trim()),e}function splitAssignment(t){let e=[],i="",r=!1,s=!1,n=!0,u=0,c=0,o=0,l=["+","-","*","/"],p=l.concat("="),m=-1;for(let h of t){m++;const f="\\"===(m>0?t[m-1]:null);if('"'!==h||r||f||(s=!s),"'"!==h||s||f||(r=!r),r||s)i+=h;else switch(h){case"{":o++,i+=h;break;case"}":o--,i+=h,0===u&&0===o&&0===c&&i&&(e.push(i.trim()),i="");break;case"[":c++,i+=h;break;case"]":c--,i+=h;break;case"(":u++,i+=h;break;case")":u--,i+=h;break;case"=":if(0===u&&0===o&&0===c&&n&&l.includes(t[m-1])&&n&&!l.includes(h)){i+=h,e.push(i.trim()),i="",n=!1;continue}0!==u||0!==o||0!==c||!n||p.includes(t[m+1])||p.includes(t[m-1])?i+=h:(l.includes(t[m-1])?(i+=h,i&&e.push(i.trim()),i=""):(i.trim()&&e.push(i.trim()),e.push(h),i=""),n=!1);break;default:0===u&&0===o&&0===c&&l.includes(t[m+1])&&p.includes(t[m+2])&&n&&(i.trim()&&e.push(i.trim()),i=""),i+=h}}return i&&e.push(i.trim()),e}function splitByFirstSpace(t){const e=(t=t.trim()).indexOf(" ");if(-1===e)return[t];return[t.slice(0,e),t.slice(e+1)]}function splitCharedCommand(t,e){const i=[];let r="",s=!1,n=!1,u=0,c=0,o=0,l=!1;for(let p=0;p<t.length;p++){const m=t[p];if(l)r+=m,l=!1;else if("\\"!==m)if('"'!==m||n||0!==u||0!==c||0!==o)if("'"!==m||s||0!==u||0!==c||0!==o){if(!s&&!n){if("("===m){u++,r+=m;continue}if("{"===m){c++,r+=m;continue}if("["===m){o++,r+=m;continue}if(")"===m&&u>0){u--,r+=m;continue}if("}"===m&&c>0){c--,r+=m;continue}if("]"===m&&o>0){o--,r+=m;continue}}m!==e||s||n||0!==u||0!==c||0!==o?r+=m:r.length>0&&(i.push(r.trim()),r="")}else n=!n,r+=m;else s=!s,r+=m;else l=!0,r+=m}return r.length>0&&i.push(r.trim()),i}function splitCommand(t){const e=[];let i="",r=!1,s="",n=0,u=0,c=0,o=!1;for(let l=0;l<t.length;l++){const p=t[l];o?(i+=p,o=!1):"\\"!==p?r?(i+=p,p===s&&(r=!1)):'"'===p||"'"===p?(r=!0,s=p,i+=p):"("===p?(0===n&&0===u&&0===c?(i.trim()&&e.push(i.trim()),i="("):i+="(",n++):")"===p?(n--,0===n&&0===u&&0===c?(i+=")",i.trim()&&e.push(i.trim()),i=""):i+=")"):"{"===p?(0===n&&0===u&&0===c&&(i.trim()&&e.push(i.trim()),i=""),u++,i+=p):"}"===p?(u--,i+=p,0===n&&0===u&&0===c&&(i.trim()&&e.push(i.trim()),i="")):"["===p?(c++,i+=p):"]"===p?(c--,i+=p,0===n&&0===u&&0===c&&(""!==i&&e.push(i.trim()),i="")):i+=p:(o=!0,i+=p)}return""!==i&&e.push(i.trim()),e}function splitReferences(t){const e=[];let i="",r=0,s=0,n=0,u=!1,c="";for(let o=0;o<t.length;o++){const l=t[o];u?(i+=l,l===c&&(u=!1)):'"'!==l&&"'"!==l?("("===l&&r++,"{"===l&&s++,"["===l&&n++,")"===l&&r--,"}"===l&&s--,"]"===l&&n--,"["!==l||1!==n?"]"!==l||0!==n?i+=l:(i+=l,0===r&&0===s&&(e.push(i.trim()),i="")):(0===r&&0===s&&""!==i&&(e.push(i.trim()),i=""),i+=l)):(u=!0,c=l,i+=l)}return i.length>0&&e.push(i.trim()),e}function splitCommandParams(t){const e=[];let i="",r=!1,s=!1,n=0,u=0,c=0;for(let o=0;o<t.length;o++){const l=t[o];(r||s)&&"\\"===l&&o+1<t.length?(i+=l+t[o+1],o++):'"'!==l||s?"'"!==l||r?"{"!==l||r||s?"}"!==l||r||s?"["!==l||r||s?"]"!==l||r||s?"("!==l||r||s?")"!==l||r||s?","!==l||r||s||n>0||u>0||c>0?i+=l:(e.push(i.trim()),i=""):(c--,i+=l):(c++,i+=l):(u--,i+=l):(u++,i+=l):(n--,i+=l):(n++,i+=l):(s=!s,i+=l):(r=!r,i+=l)}return i&&e.push(i.trim()),e}
function removeStr(t){if('"'!=t[0]&&"'"!=t[0]||'"'!=t[t.length-1]&&"'"!=t[t.length-1])return t;{let e=t.replace(/\\\\n/g,"\uE000");return e=e.replace(/\\n/g,"\n"),e.replace(/\uE000/g,"\\n").slice(1,-1)}}function removeCurlyBrackets(t){return t.replace(/^\{|}$/g,"").trim()}function removeSquareBrackets(t){return t.replace(/^\[|\]$/g,"").trim()}function removeBrackets(t){return t.replace(/^\(|\)$/g,"").trim()}function removeComments(t){return t.replace(/(["'])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\//g,((t,e)=>e?t:""))}function isCurlyBrackets(t){return"string"==typeof t&&("{"==t[0]&&"}"==t[t.length-1])}function isSquareBrackets(t){return"string"==typeof t&&("["==t[0]&&"]"==t[t.length-1])}function isBrackets(t){return"string"==typeof t&&("("==t[0]&&")"==t[t.length-1])}function isNoBrackets(t){return"string"==typeof t&&!(isBrackets(t)||isCurlyBrackets(t)||isSquareBrackets(t))}const isNumeric=t=>/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);function isValidVariableFormat(t){return/^[A-Za-z0-9_@#]+$/.test(t)}function isValidFunctionFormat(t){return/^[A-Za-z0-9_.@#]+$/.test(t)}function isValidDefinitionFormat(t){return/^[A-Za-z0-9_.@#]+$/.test(t)}function isValidAssignFormat(t){return/^[A-Za-z0-9_.@#\[\]\" ]+$/.test(t)}
function randomStr(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const Object_merge = function(e,t){if("object"!=typeof e||"object"!=typeof t)return t;{let o=Object_clone(e);for(let r in t)t.hasOwnProperty(r)&&("object"==typeof t[r]?o[r]=Object_merge(e[r],t[r]):o[r]=t[r]);return o}};
const Object_clone = function(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object_clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object_clone(e[r]));return n}}return e};
const Object_isSame = function(e,t){if("object"!=typeof e||"object"!=typeof t)return!1;{if(e===t)return!0;let r=Object.keys(e),f=Object.keys(t);if(r.length!==f.length)return!1;for(let n of f){if(!r.includes(n))return!1;let i=typeof e[n],o=typeof t[n];if(i!==o)return!1;if("object"===i&&"object"===o){if(!Object_isSame(e[n],t[n]))return!1}else if(e[n]!==t[n])return!1}return!0}};

const memory = {};

const code = `
//print("hi" + "wow" ++ "!", 5 + "wow", "wow" + 5, 5 + 5);
print(5 + 3 + -4 - 3 * 5 / 6 - 6 * 4);
`;

export function astSegment(code) {
    const elements = splitSegment(code);
    let ast = {"data":[],"definitions":[]};
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (!element)
            continue;

        const out = astNode(element);
        if (!out)
            continue;

        if (["function"].includes(out["type"])) {
            ast["definitions"].push(out);
            continue;
        }

        ast["data"].push(out);
    }
    return ast;
}
function astNodes(code) {
    const args = splitCommandParams(code);
    let data = [];
    for (let i = 0; i < args.length; i++) {
        data.push(astNode(args[i]));
    }
    return data;
}
function astDefintionArguments(code) {
    const args = splitCommandParams(code);
    let data = [];
    for (let i = 0; i < args.length; i++) {
        const spacedTokens = splitCharedCommand(args[i], " ");
        let types = [];
        let name = "";
        let value = null;
        if (spacedTokens.indexOf("=") == 1) {
            name = spacedTokens.shift();
            spacedTokens.shift();
            value = astNode(spacedTokens.join(" "));
            types = ["any"];
        } else if (spacedTokens.indexOf("=") == 2) {
            const typeCode = spacedTokens.shift();
            if (isNoBrackets(typeCode) && isValidDefinitionFormat(typeCode)) {
                types = [typeCode];
            } else if (isSquareBrackets(typeCode)) {
                types = splitCommandParams(removeSquareBrackets(typeCode));
            }
            name = spacedTokens.shift();
            spacedTokens.shift();
            value = astNode(spacedTokens.join(" "));
        } else {
            if (spacedTokens.length == 2) {
                const typeCode = spacedTokens.shift();
                if (isNoBrackets(typeCode) && isValidDefinitionFormat(typeCode)) {
                    types = [typeCode];
                } else if (isSquareBrackets(typeCode)) {
                    types = splitCommandParams(removeSquareBrackets(typeCode));
                }
            } else if (spacedTokens.length == 1) {
                types = ["any"];
            }
            name = spacedTokens.shift();
        }
        data.push({"types":types,"name":name,"value":value});
    }
    return data;
}
function astNode(code) {
    const firstSpaceTokens = splitByFirstSpace(code);
    
    if (code.length >= 2) {
        if (code.substring(0, 2) == "##") {
            return null;
        }
    }

    const operationTokens = splitOperators(code);
    if (operationTokens.length > 1) {
        if (["+","-","*","/","%","^",].includes(operationTokens[operationTokens.length - 2])) {
            return {
                "type": "operation",
                "b": astNode(operationTokens.pop()),
                "operator": operationTokens.pop(),
                "a": astNode(operationTokens.join(" ")),
            };
        }
    }

    // function
    if (firstSpaceTokens[0] == "fn") {
        const commandTokens = splitCommand(firstSpaceTokens[1]);
        if (commandTokens.length == 3 &&
            isNoBrackets(commandTokens[0]) &&
            isBrackets(commandTokens[1]) &&
            isCurlyBrackets(commandTokens[2])
        ) {
            return {
                "type": "function",
                "data": {
                    "type": "definition",
                    "name": commandTokens[0],
                    "args": astDefintionArguments(removeBrackets(commandTokens[1])),
                    "data": astSegment(removeCurlyBrackets(commandTokens[2])),
                }
            };
        }
    }

    const commandTokens = splitCommand(code);

    // execution
    if (commandTokens.length > 1) {
        if (isBrackets(commandTokens[commandTokens.length - 1])) {
            return {
                "type": "execution",
                "args": astNodes(removeBrackets(commandTokens.pop())),
                "key": astNode(commandTokens.join("")),
            };
        }
    }

    // string literal
    if ((code[0] == "\"" && code[code.length - 1] == "\"") || (code[0] == "'" && code[code.length - 1] == "'")) {
        return [
            removeStr(code),
            "str"
        ];
    }

    // number literal
    if (isNumeric(code)) {
        return [
            parseFloat(code),
            "num"
        ];
    }
    
    // reference
    if (isValidVariableFormat(code)) {
        return {
            "type": "variable",
            "name": code,
        };
    }
    
    return {
        "type": "unknown",
        "data": code,
    };
}

export function runFunction(content, func, scope = {}) {
    const astID = allocate(content);
    const dataID = allocate({"scope":"","trace":allocate(traceMake(content)),"ast":astID,"memory_addresses":[]});
    const scopeID = getScope(scope, content["definitions"], dataID);
    memory[dataID]["scope"] = scopeID;
    const out = runSegmentRaw(content["data"], dataID);
    // cleanup
    const ids = memory[dataID]["memory_addresses"];
    deAllocate(scopeID, astID, memory[dataID]["trace"], dataID, ...ids);

    return ["null","null"];
}
function runSegmentRaw(content, dataID) {
    traceAdd(dataID,"content");
    for (let i = 0; i < content.length; i++) {
        const out = runNode(content[i], dataID);
        if (typeof out == "object" && out && Array.isArray(out))
            if (out["type"] == "return")
                return out["data"];
    }
    traceOut(dataID);
}
function runNodes(args, dataID) {
    return args.map(arg => runNode(arg, dataID));
}
function runNode(node, dataID) {
    if (Array.isArray(node)) {
        return node;
    }

    switch(node["type"]) {
        case "execution":
            return runExecution(runNode(node["key"], dataID), runNodes(node["args"], dataID), dataID);
        case "variable":
            // no im not explaining this
            if (Object.keys(memory[memory[dataID]["scope"]]).includes(node["name"])) {
                return memory[memory[memory[dataID]["scope"]][node["name"]]];
            } else {
                error(dataID,"variable not defined",node["name"]);
                return ["null","null"];
            }
        case "unknown":
            error(dataID, "unknown tokens", node["data"]);
            return ["null","null"];
        default:
            error(dataID,"unknown node type",node["type"]);
    }
}
function runExecution(execution,args,dataID) {
    if (!execution)
        return ["null","null"];
    if (execution[1] !== "function") {
        error(dataID,"cannot run values of type",execution[1]);
        return ["null","null"];
    }
    if (typeof execution[0] == "string")
        execution[0] = memory[execution[0]];

    switch (execution[0]["type"]) {
        case "builtin":
            return execution[0]["data"](dataID, ...args);
        case "definition":
            const ast = memory[memory[dataID]["ast"]];
            let scope = runArguments(execution[0]["args"], args, dataID);
            const funcAstID = allocate(ast);
            const funcDataID = allocate({"scope":"","trace":allocate(traceMake(ast)),"ast":funcAstID,"memory_addresses":[]});
            const funcScopeID = getScope(scope, ast["definitions"], funcDataID);
            memory[funcDataID]["scope"] = funcScopeID;
            const out = runSegmentRaw(execution[0]["data"]["data"], funcDataID);
            deAllocate(funcAstID, funcScopeID, memory[funcDataID]["trace"], funcDataID, ...memory[funcDataID]["memory_addresses"]);
            return out;
        default:
            error(dataID,"unknown function type",execution[0]["type"]);
            return ["null","null"];
    }
}
function runArguments(definition, args, dataID) {
    let data = {};
    for (let i = 0; i < definition.length; i++) {
        const definitionArg = definition[i];
        const passedArg = args[i];
        if (!passedArg) {
            if (definitionArg["value"]) {
                data[definitionArg["name"]] = runNode(definitionArg["value"], dataID);
            } else {
                error(dataID,"missing argument",definitionArg["name"]);
            }
        } else {
            if (isTypes(passedArg[1],definitionArg["types"])) {
                data[definitionArg["name"]] = passedArg;
            } else {
                error(dataID,"expected",definitionArg["types"].join(" or "),"got",passedArg[1]);
            }
        }
    }
    return data;
}

function getScope(scope, definitions, scopeDataID) {
    let data = {
        // constants
        "null": ["null","null"],
        "true": [true,"bool"],
        "false": [false,"bool"],

        "print": [
            {
                "type": "builtin",
                "data": function(dataID, ...args) {
                    print(dataID, ...args.map(arg => castType(arg,"str")[0]));
                }
            },
            "function"
        ]
    };
    const keys = Object.keys(definitions);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const def = definitions[key]["data"];
        if (definitions[key]["type"] == "function") {
            data[def["name"]] = [allocate(def),"function"];
            memory[scopeDataID]["memory_addresses"].push(data[def["name"]][0]);
        }
    }
    // allocate all the values and functions into memory
    return allocate(allocateTypedObjectContents(Object_merge(scope, data), scopeDataID)[0]);
}
function allocate(value) {
    const id = randomStr(10);
    memory[id] = value;
    //console.log("allocated",id,value);
    return id;
}
function allocateInScope(value, scope) {
    const id = allocate(value);
    memory[scope].push(id);
    return id;
}
function allocateObjectContents(object) {
    if (typeof object != "object")
        return null;
    
    if (!object) {
        return allocate(["null","null"]);
    }
    if (Array.isArray(object)) {
        let data = [];
        for (let i = 0; i < object.length; i++) {
            if (typeof object[i] == "object") {
                data.push(allocateObject(object[i]));
            } else {
                data.push(allocate(object[i]));
            }
        }
        return data;
    } else {
        let data = {};
        for (let i = 0; i < Object.keys(object).length; i++) {
            const key = Object.keys(object)[i];
            if (typeof object[key] == "object") {
                data[key] = allocateObject(object[key]);
            } else {
                data[key] = allocate(object[key]);
            }
        }
        return data;
    }
}
function allocateObject(object) {
    return allocate(allocateObjectContents(object));
}
function allocateTypedObjectContents(object, dataID) {
    if (!Array.isArray(object)) {
        let data = {};
        for (let i = 0; i < Object.keys(object).length; i++) {
            const key = Object.keys(object)[i];
            if (typeof object[key] == "object") {
                data[key] = allocateTypedObject(object[key], dataID);
            } else {
                data[key] = allocate(object[key]);
            }
            if (dataID) {
                memory[dataID]["memory_addresses"].push(data[key]);
            }
        }
        return [data,"object"];
    }
    return object;
}
function allocateTypedObject(object) {
    return allocate(allocateTypedObjectContents(object));
}
function deAllocate(...ids) {
    for (let i = 0; i < ids.length; i++) {
        delete memory[ids[i]];
        //console.log("deallocated",ids[i]);
    }
}

function traceMake(ast) {
    return {"ast":ast,"path":[]};
}
function traceDirectAdd(trace, node) {
    trace["path"].push(node);
    return trace;
}
function traceAdd(dataID, node) {
    let trace = memory[memory[dataID]["trace"]];
    trace = traceDirectAdd(trace, node);
    memory[memory[dataID]["trace"]] = trace;
    return dataID;
}
function traceDirectOut(trace) {
    trace["path"].pop();
    return trace;
}
function traceOut(dataID) {
    let trace = memory[memory[dataID]["trace"]];
    trace = traceDirectOut(trace);
    memory[memory[dataID]["trace"]] = trace;
    return dataID;
}

function castType(value, type) {
    if (value[1] === type)
        return value;
    switch (type) {
        case "str":
            if (value[1] === "function") {
                return ["<function:"+value[0]["type"]+">","str"];
            }
            return [value[0].toString(),"str"];
        default:
            error(dataID,"cannot cast to type",type);
            
    }
}
function isTypeEqual(typeA,typeB) {
    if (typeA === typeB) {
        return true;
    }
    if (typeA === "any" || typeB === "any") {
        return true;
    }
    return false;
}
function isTypes(type,types) {
    for (let i = 0; i < types.length; i++) {
        if (!isTypeEqual(type,types[i])) {
            return false;
        }
    }
    return true;
}

function print(dataID, ...text) {
    console.log(...text);
}
function error(dataID, ...text) {
    console.error(...text);
    process.exit();
}

// is being run directly (nodeJS)
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g,"/")}`) {
    //console.log(JSON.stringify(astSegment(code),null,"    "));
    console.log("out:",runFunction(astSegment(code)));
    console.log(memory);
}
