
const MD5 = function(r){function n(r,n){var t,o,e,u,f;return e=2147483648&r,u=2147483648&n,f=(1073741823&r)+(1073741823&n),(t=1073741824&r)&(o=1073741824&n)?2147483648^f^e^u:t|o?1073741824&f?3221225472^f^e^u:1073741824^f^e^u:f^e^u}function t(r,t,o,e,u,f,a){return r=n(r,n(n(t&o|~t&e,u),a)),n(r<<f|r>>>32-f,t)}function o(r,t,o,e,u,f,a){return r=n(r,n(n(t&e|o&~e,u),a)),n(r<<f|r>>>32-f,t)}function e(r,t,o,e,u,f,a){return r=n(r,n(n(t^o^e,u),a)),n(r<<f|r>>>32-f,t)}function u(r,t,o,e,u,f,a){return r=n(r,n(n(o^(t|~e),u),a)),n(r<<f|r>>>32-f,t)}function f(r){var n,t="",o="";for(n=0;3>=n;n++)t+=(o="0"+(o=r>>>8*n&255).toString(16)).substr(o.length-2,2);return t}var a,i,C,c,g,h,d,v,S;for(r=function(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var o=r.charCodeAt(t);128>o?n+=String.fromCharCode(o):(127<o&&2048>o?n+=String.fromCharCode(o>>6|192):(n+=String.fromCharCode(o>>12|224),n+=String.fromCharCode(o>>6&63|128)),n+=String.fromCharCode(63&o|128))}return n}(r),a=function(r){for(var n,t=r.length,o=16*(((n=t+8)-n%64)/64+1),e=Array(o-1),u=0,f=0;f<t;)u=f%4*8,e[n=(f-f%4)/4]|=r.charCodeAt(f)<<u,f++;return e[n=(f-f%4)/4]|=128<<f%4*8,e[o-2]=t<<3,e[o-1]=t>>>29,e}(r),h=1732584193,d=4023233417,v=2562383102,S=271733878,r=0;r<a.length;r+=16)i=h,C=d,c=v,g=S,h=t(h,d,v,S,a[r+0],7,3614090360),S=t(S,h,d,v,a[r+1],12,3905402710),v=t(v,S,h,d,a[r+2],17,606105819),d=t(d,v,S,h,a[r+3],22,3250441966),h=t(h,d,v,S,a[r+4],7,4118548399),S=t(S,h,d,v,a[r+5],12,1200080426),v=t(v,S,h,d,a[r+6],17,2821735955),d=t(d,v,S,h,a[r+7],22,4249261313),h=t(h,d,v,S,a[r+8],7,1770035416),S=t(S,h,d,v,a[r+9],12,2336552879),v=t(v,S,h,d,a[r+10],17,4294925233),d=t(d,v,S,h,a[r+11],22,2304563134),h=t(h,d,v,S,a[r+12],7,1804603682),S=t(S,h,d,v,a[r+13],12,4254626195),v=t(v,S,h,d,a[r+14],17,2792965006),h=o(h,d=t(d,v,S,h,a[r+15],22,1236535329),v,S,a[r+1],5,4129170786),S=o(S,h,d,v,a[r+6],9,3225465664),v=o(v,S,h,d,a[r+11],14,643717713),d=o(d,v,S,h,a[r+0],20,3921069994),h=o(h,d,v,S,a[r+5],5,3593408605),S=o(S,h,d,v,a[r+10],9,38016083),v=o(v,S,h,d,a[r+15],14,3634488961),d=o(d,v,S,h,a[r+4],20,3889429448),h=o(h,d,v,S,a[r+9],5,568446438),S=o(S,h,d,v,a[r+14],9,3275163606),v=o(v,S,h,d,a[r+3],14,4107603335),d=o(d,v,S,h,a[r+8],20,1163531501),h=o(h,d,v,S,a[r+13],5,2850285829),S=o(S,h,d,v,a[r+2],9,4243563512),v=o(v,S,h,d,a[r+7],14,1735328473),h=e(h,d=o(d,v,S,h,a[r+12],20,2368359562),v,S,a[r+5],4,4294588738),S=e(S,h,d,v,a[r+8],11,2272392833),v=e(v,S,h,d,a[r+11],16,1839030562),d=e(d,v,S,h,a[r+14],23,4259657740),h=e(h,d,v,S,a[r+1],4,2763975236),S=e(S,h,d,v,a[r+4],11,1272893353),v=e(v,S,h,d,a[r+7],16,4139469664),d=e(d,v,S,h,a[r+10],23,3200236656),h=e(h,d,v,S,a[r+13],4,681279174),S=e(S,h,d,v,a[r+0],11,3936430074),v=e(v,S,h,d,a[r+3],16,3572445317),d=e(d,v,S,h,a[r+6],23,76029189),h=e(h,d,v,S,a[r+9],4,3654602809),S=e(S,h,d,v,a[r+12],11,3873151461),v=e(v,S,h,d,a[r+15],16,530742520),h=u(h,d=e(d,v,S,h,a[r+2],23,3299628645),v,S,a[r+0],6,4096336452),S=u(S,h,d,v,a[r+7],10,1126891415),v=u(v,S,h,d,a[r+14],15,2878612391),d=u(d,v,S,h,a[r+5],21,4237533241),h=u(h,d,v,S,a[r+12],6,1700485571),S=u(S,h,d,v,a[r+3],10,2399980690),v=u(v,S,h,d,a[r+10],15,4293915773),d=u(d,v,S,h,a[r+1],21,2240044497),h=u(h,d,v,S,a[r+8],6,1873313359),S=u(S,h,d,v,a[r+15],10,4264355552),v=u(v,S,h,d,a[r+6],15,2734768916),d=u(d,v,S,h,a[r+13],21,1309151649),h=u(h,d,v,S,a[r+4],6,4149444226),S=u(S,h,d,v,a[r+11],10,3174756917),v=u(v,S,h,d,a[r+2],15,718787259),d=u(d,v,S,h,a[r+9],21,3951481745),h=n(h,i),d=n(d,C),v=n(v,c),S=n(S,g);return(f(h)+f(d)+f(v)+f(S)).toLowerCase()};
function splitLogic(t){const e=[];let i="",r=!1,s=!1,n=0,u=0,c=0,o=!1;const l=/(\|\||&&)/;for(let p=0;p<t.length;p++){const m=t[p];if(o)i+=m,o=!1;else if("\\"!==m){if("'"!==m||s||o?'"'!==m||r||o||(s=!s):r=!r,r||s||("["===m?n++:"]"===m?n--:"{"===m?u++:"}"===m?u--:"("===m?c++:")"===m&&c--),!r&&!s&&0===n&&0===u&&0===c){const r=t.slice(p).match(l);if(r&&0===r.index){i.trim()&&(e.push(i.trim()),i=""),e.push(r[0]),p+=r[0].length-1;continue}}i+=m}else o=!0,i+=m}return i.trim()&&e.push(i.trim()),e}
function splitOperators(t,e){const i=[];let r="",s=!1,n=!1,u=0,c=0,o=0,l=!1;for(let p=0;p<t.length;p++){const m=t[p];l?(l=!1,r+=m):"\\"!==m?"'"!==m||n||u||c||o?'"'!==m||s||u||c||o?s||n?r+=m:("["===m?u++:"]"===m?u--:"{"===m?c++:"}"===m?c--:"("===m?o++:")"===m&&o--,e.includes(m)&&0===u&&0===c&&0===o?"+"!=m||"+"==m&&"+"!=t[p-1]&&"+"!=t[p+1]?(r.trim()&&i.push(r.trim()),i.push(m),r=""):("+"==m&&"+"==t[p+1]&&(i.push(r.trim()),r=""),r+=m,"+"==m&&"+"==t[p-1]&&(i.push(r.trim()),r="")):r+=m):(l||(n=!n),r+=m):(l||(s=!s),r+=m):(l=!0,r+=m)}return r.trim()&&i.push(r.trim()),i}
function splitStatement(t){const e=[];let i="",r=0,s=0,n=!1,u="",c=0;for(;c<t.length;){const o=t[c],l=t[c-1];'"'!==o&&"'"!==o||"\\"===l||(n?o===u&&(n=!1):(n=!0,u=o)),n?i+=o:"("===o?(s++,i+=o):")"===o?(s--,i+=o):"{"===o?(0===s&&0===r&&i.trim()&&(e.push(i.trim()),i=""),i+=o,r++):"}"===o?(r--,i+=o,0===s&&0===r&&i.trim()&&(e.push(i.trim()),i="")):";"===o&&0===r&&0===s?(e.push(i.trim()),i=""):i+=o,c++}return i.trim()&&e.push(i.trim()),e}
function splitSegment(t){let e=[],i="",r=!1,s=!1,n=0,u=0,c=0,o=-1;for(let l of t){o++;const p="\\"===(o>0?t[o-1]:null);if('"'!==l||r||p||(s=!s),"'"!==l||s||p||(r=!r),r||s)i+=l;else switch(l){case"{":c++,i+=l;break;case"}":c--,i+=l,0===n&&0===c&&0===u&&"("!==t[o+1]&&i&&(e.push(i.trim()),i="");break;case"[":u++,i+=l;break;case"]":u--,i+=l;break;case"(":n++,i+=l;break;case")":n--,i+=l;break;case";":0===n&&0===c&&0===u?i&&(e.push(i.trim()),i=""):i+=l;break;default:i+=l}}return i&&e.push(i.trim()),e}
function splitAssignment(t,l){let e=[],i="",r=!1,s=!1,n=!0,u=0,c=0,o=0,p=l.concat("="),m=-1;for(let h of t){m++;const f="\\"===(m>0?t[m-1]:null);if('"'!==h||r||f||(s=!s),"'"!==h||s||f||(r=!r),r||s)i+=h;else switch(h){case"{":o++,i+=h;break;case"}":o--,i+=h,0===u&&0===o&&0===c&&i&&(e.push(i.trim()),i="");break;case"[":c++,i+=h;break;case"]":c--,i+=h;break;case"(":u++,i+=h;break;case")":u--,i+=h;break;case"=":if(0===u&&0===o&&0===c&&n&&l.includes(t[m-1])&&n&&!l.includes(h)){i+=h,e.push(i.trim()),i="",n=!1;continue}0!==u||0!==o||0!==c||!n||p.includes(t[m+1])||p.includes(t[m-1])?i+=h:(l.includes(t[m-1])?(i+=h,i&&e.push(i.trim()),i=""):(i.trim()&&e.push(i.trim()),e.push(h),i=""),n=!1);break;default:0===u&&0===o&&0===c&&l.includes(t[m+1])&&p.includes(t[m+2])&&n&&(i.trim()&&e.push(i.trim()),i=""),i+=h}}return i&&e.push(i.trim()),e}
function splitByFirstSpace(t){const e=(t=t.trim()).indexOf(" ");if(-1===e)return[t];return[t.slice(0,e),t.slice(e+1)]}
function splitCharedCommand(t,e){const i=[];let r="",s=!1,n=!1,u=0,c=0,o=0,l=!1;for(let p=0;p<t.length;p++){const m=t[p];if(l)r+=m,l=!1;else if("\\"!==m)if('"'!==m||n||0!==u||0!==c||0!==o)if("'"!==m||s||0!==u||0!==c||0!==o){if(!s&&!n){if("("===m){u++,r+=m;continue}if("{"===m){c++,r+=m;continue}if("["===m){o++,r+=m;continue}if(")"===m&&u>0){u--,r+=m;continue}if("}"===m&&c>0){c--,r+=m;continue}if("]"===m&&o>0){o--,r+=m;continue}}m!==e||s||n||0!==u||0!==c||0!==o?r+=m:r.length>0&&(i.push(r.trim()),r="")}else n=!n,r+=m;else s=!s,r+=m;else l=!0,r+=m}return r.length>0&&i.push(r.trim()),i}
function splitCommand(t){const e=[];let i="",r=!1,s="",n=0,u=0,c=0,o=!1;for(let l=0;l<t.length;l++){const p=t[l];o?(i+=p,o=!1):"\\"!==p?r?(i+=p,p===s&&(r=!1)):'"'===p||"'"===p?(r=!0,s=p,i+=p):"("===p?(0===n&&0===u&&0===c?(i.trim()&&e.push(i.trim()),i="("):i+="(",n++):")"===p?(n--,0===n&&0===u&&0===c?(i+=")",i.trim()&&e.push(i.trim()),i=""):i+=")"):"{"===p?(0===n&&0===u&&0===c&&(i.trim()&&e.push(i.trim()),i=""),u++,i+=p):"}"===p?(u--,i+=p,0===n&&0===u&&0===c&&(i.trim()&&e.push(i.trim()),i="")):"["===p?(c++,i+=p):"]"===p?(c--,i+=p,0===n&&0===u&&0===c&&(""!==i&&e.push(i.trim()),i="")):i+=p:(o=!0,i+=p)}return""!==i&&e.push(i.trim()),e}
function splitReferences(t){const e=[];let i="",r=0,s=0,n=0,u=!1,c="";for(let o=0;o<t.length;o++){const l=t[o];u?(i+=l,l===c&&(u=!1)):'"'!==l&&"'"!==l?("("===l&&r++,"{"===l&&s++,"["===l&&n++,")"===l&&r--,"}"===l&&s--,"]"===l&&n--,"["!==l||1!==n?"]"!==l||0!==n?i+=l:(i+=l,0===r&&0===s&&(e.push(i.trim()),i="")):(0===r&&0===s&&""!==i&&(e.push(i.trim()),i=""),i+=l)):(u=!0,c=l,i+=l)}return i.length>0&&e.push(i.trim()),e}
function splitCommandParams(t){const e=[];let i="",r=!1,s=!1,n=0,u=0,c=0;for(let o=0;o<t.length;o++){const l=t[o];(r||s)&&"\\"===l&&o+1<t.length?(i+=l+t[o+1],o++):'"'!==l||s?"'"!==l||r?"{"!==l||r||s?"}"!==l||r||s?"["!==l||r||s?"]"!==l||r||s?"("!==l||r||s?")"!==l||r||s?","!==l||r||s||n>0||u>0||c>0?i+=l:(e.push(i.trim()),i=""):(c--,i+=l):(c++,i+=l):(u--,i+=l):(u++,i+=l):(n--,i+=l):(n++,i+=l):(s=!s,i+=l):(r=!r,i+=l)}return i&&e.push(i.trim()),e}
function splitComparison(t,i){i=i.filter(t=>">"!==t&&"<"!==t);let r=RegExp(`(${i.map(escapeRegExp).join("|")})`),$=[],s="",e=!1,m=!1,p=0,u=0,l=0;for(let n=0;n<t.length;n++){let h=t[n],o=t[n+1],_=t[n-1],f="\\"===_&&"'"===h,a="\\"===_&&'"'===h;"'"!==h||m||f||p||u||l?'"'!==h||e||a||p||u||l||(m=!m):e=!e,!e&&!m&&("["===h?p++:"]"===h?p--:"{"===h?u++:"}"===h?u--:"("===h?l++:")"===h&&l--),!r.test(h+o)||e||m||0!==p||0!==u||0!==l?![">","<"].includes(h)||e||m||0!==p||0!==u||0!==l?s+=h:(s.trim()&&$.push(s.trim()),$.push(h),s=""):(s.trim()&&$.push(s.trim()),$.push(h+o),s="",n++)}return s.trim()&&$.push(s.trim()),$}
function removeStr(t) {
    if ('"' != t[0] && "'" != t[0] || '"' != t[t.length - 1] && "'" != t[t.length - 1]) return t;
    let e = t.replaceAll("\\n", "\uE000");
    e = e.replaceAll("\\\"", "\uE001");
    e = e.replaceAll("\\'", "\uE002");
    return e.replace(/\uE000/g, "\n").replace(/\uE001/g, "\"").replace(/\uE002/g, "'").slice(1, -1);
}
function removeCurlyBrackets(t){return t.replace(/^\{|}$/g,"").trim()}
function removeSquareBrackets(t){return t.replace(/^\[|\]$/g,"").trim()}
function removeBrackets(t){return t.replace(/^\(|\)$/g,"").trim()}
function removeComments(t){return t.replace(/(["'])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\//g,((t,e)=>e?t:""))}
function isCurlyBrackets(t){return"string"==typeof t&&("{"==t[0]&&"}"==t[t.length-1])}
function isSquareBrackets(t){return"string"==typeof t&&("["==t[0]&&"]"==t[t.length-1])}
function isBrackets(t){return"string"==typeof t&&("("==t[0]&&")"==t[t.length-1])}
function isNoBrackets(t){return"string"==typeof t&&!(isBrackets(t)||isCurlyBrackets(t)||isSquareBrackets(t))}const isNumeric=t=>/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t);
function isValidVariableFormat(t){return/^[A-Za-z0-9_]+$/.test(t)}
function isValidFunctionFormat(t){return/^[A-Za-z0-9_.@#]+$/.test(t)}
function isValidDefinitionFormat(t){return/^[A-Za-z0-9_.@#]+$/.test(t)}
function isValidAssignFormat(t){return/^[A-Za-z0-9_.@#\[\]\" ]+$/.test(t)}
function randomStr(r=10){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n="";for(let t=0;t<r;t++)n+=e.charAt(Math.floor(Math.random()*e.length));return n}
function escapeRegExp(r){return r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}
function mergeNegativeNumbers(e,t){let r=[];for(let n=0;n<e.length;n++)t.includes(e[n-1])&&"-"===e[n]&&!isNaN(e[n+1])?(r.push(e[n]+e[n+1]),n++):r.push(e[n]);return r}
function hexToFloats(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
        hex = hex.split("").map(char => char + char).join("");
    }
    const hexR = parseInt(hex.substring(0, 2), 16);
    const hexG = parseInt(hex.substring(2, 4), 16);
    const hexB = parseInt(hex.substring(4, 6), 16);
    return {
        r: hexR / 255,
        g: hexG / 255,
        b: hexB / 255
    };
}

const Object_merge = function(e,t){if("object"!=typeof e||"object"!=typeof t)return t;{let o=Object_clone(e);for(let r in t)t.hasOwnProperty(r)&&("object"==typeof t[r]?o[r]=Object_merge(e[r],t[r]):o[r]=t[r]);return o}};
const Object_clone = function(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object_clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object_clone(e[r]));return n}}return e};
const Object_isSame = function(e,t){if("object"!=typeof e||"object"!=typeof t)return!1;{if(e===t)return!0;let r=Object.keys(e),f=Object.keys(t);if(r.length!==f.length)return!1;for(let n of f){if(!r.includes(n))return!1;let i=typeof e[n],o=typeof t[n];if(i!==o)return!1;if("object"===i&&"object"===o){if(!Object_isSame(e[n],t[n]))return!1}else if(e[n]!==t[n])return!1}return!0}};

const memory = {};

const code = `
print("hi".wow);
`;

export function astSegment(code, root = true) {
    code = removeComments(code);
    const elements = splitSegment(code);
    let ast = {"data":[],"definitions":[],"hash":MD5(code)};
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (!element)
            continue;
        
        const out = astNode(element);
        if (!out)
            continue;
        
        if (["function"].includes(out["kind"])) {
            if (root) {
                ast["definitions"].push(out);
            } else {
                error(null, "cannot define inside of a root segment");
            }
            continue;
        }

        ast["data"].push(out);
    }
    return ast;
}
function astNodes(code) {
    let args = [];
    if (typeof code == "string") {
        args = splitCommandParams(code);
    } else {
        args = code;
    }
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
    if (!code) { return null }
    if (code.length >= 2) {
        if (code.substring(0, 2) == "##") {
            return null;
        }
    }

    // number literal
    if (isNumeric(code)) {
        return [
            parseFloat(code),
            "num"
        ];
    }
    
    const firstSpaceTokens = splitByFirstSpace(code);
    const commandTokens = splitCommand(code);
    const highPriority = ["return"];
    if (firstSpaceTokens.length == 2 && isValidDefinitionFormat(firstSpaceTokens[0]) && highPriority.includes(firstSpaceTokens[0])) {
        if (!(isBrackets(commandTokens[1]) && commandTokens.length == 2) &&
            !(isBrackets(commandTokens[1]) && isCurlyBrackets(commandTokens[2]) && commandTokens.length == 3)) {
            return {
                "kind": "spacedCommand",
                "key": astNode(firstSpaceTokens[0]),
                "data": astNode(firstSpaceTokens[1])
            }
        }
    }

    const operators = ["+","++","-","*","/","%","^",];
    const comparisons = {
        "==": "equal",
        "!=": "not_equal",
        "~=": "string_equal",
        ":=": "type_equal",
        ">": "greater",
        "<": "smaller",
        ">=": "greater_equal",
        "<=": "smaller_equal",
    }
    
    const assignmentTokens = splitAssignment(code, operators);
    const assignments = {
        "=": "default",
        "+=": "addition",
        "++=": "join",
        "-=": "subtraction",
        "*=": "multiplication",
        "/=": "division",
        "%=": "modulo",
        "^=": "power"
    }
    if (assignmentTokens.length >= 3) {
        const comparisonTokens = splitComparison(code, Object.keys(comparisons));
        if (!(comparisonTokens.length >= 3)) {
            if (Object.keys(assignments).includes(assignmentTokens[1])) {
                return {
                    "kind": "assignment",
                    "key": astNode(assignmentTokens.shift()),
                    "type": assignments[assignmentTokens.shift()],
                    "value": astNode(assignmentTokens.join(" "))
                }
            }
        }
    }


    // logic symbols
    const logic = {
        "&&": "and",
        "||": "or",
    }
    const logicTokens = splitLogic(code);
    if (logicTokens.length > 1) {
        return {
            "kind": "logic",
            "b": astNode(logicTokens.pop()),
            "type": logic[logicTokens.pop()],
            "a": astNode(logicTokens.join(" ")),
        }
    }
    const spaceTokens = splitCharedCommand(code, " ");

    if (spaceTokens.length >= 3) {
        const spacedOperations = [
            "is",
            "in"
        ]
        if (spacedOperations.includes(spaceTokens[spaceTokens.length - 2])) {
            return {
                "kind": "operation",
                "b": astNode(spaceTokens.pop()),
                "operator": spaceTokens.pop(),
                "a": astNode(spaceTokens.join(" "))
            }
        }
    }

    // comparisons
    const comparisonTokens = splitComparison(code, Object.keys(comparisons));
    if (comparisonTokens.length >= 3) {
        return {
            "kind": "comparison",
            "b": astNode(comparisonTokens.pop()),
            "type": comparisons[comparisonTokens.pop()],
            "a": astNode(comparisonTokens.join(" ")),
        };
    }

    // operatiors
    const operationTokens = mergeNegativeNumbers(splitOperators(code, operators), operators);
    if (operationTokens.length > 1) {
        if (operators.includes(operationTokens[operationTokens.length - 2])) {
            return {
                "kind": "operation",
                "b": astNode(operationTokens.pop()),
                "operator": {
                    "+": "addition",
                    "++": "join",
                    "-": "subtraction",
                    "*": "multiplication",
                    "/": "division",
                    "%": "modulo",
                    "^": "power"
                }[operationTokens.pop()],
                "a": astNode(operationTokens.join(" ")),
            };
        }
    }

    const restricted = ["fn"];
    if (firstSpaceTokens.length == 2 && isValidDefinitionFormat(firstSpaceTokens[0]) && !restricted.includes(firstSpaceTokens[0])) {
        if (!(isBrackets(commandTokens[1]) && commandTokens.length == 2) &&
            !(isBrackets(commandTokens[1]) && isCurlyBrackets(commandTokens[2]) && commandTokens.length == 3)) {
            return {
                "kind": "spacedCommand",
                "key": astNode(firstSpaceTokens[0]),
                "data": astNode(firstSpaceTokens[1])
            }
        }
    }

    if (isBrackets(commandTokens[0])) {
        const commandTokens2 = splitCommand(code);
        const type = astNode(removeBrackets(commandTokens2.shift()))
        const data = astNode(commandTokens2.join());
        if (data) {
            if (data["kind"] !== "unknown") {
                return {
                    "kind": "cast",
                    "type": type,
                    "data": data
                }
            }
        }
    }

    // keys
    const keyTokens = splitReferences(code);
    if (keyTokens.length > 1) {
        if (isSquareBrackets(keyTokens[keyTokens.length - 1])) {
            return {
                "kind": "key",
                "key": astNode(removeSquareBrackets(keyTokens.pop())),
                "data": astNode(keyTokens.join(""))
            }
        }
    }

    // function
    if (firstSpaceTokens[0] == "fn") {
        const commandTokens2 = splitCommand(firstSpaceTokens[1]);
        if (commandTokens2.length == 3 &&
            isNoBrackets(commandTokens2[0]) &&
            isBrackets(commandTokens2[1]) &&
            isCurlyBrackets(commandTokens2[2])
        ) {
            return {
                "kind": "function",
                "data": {
                    "type": "definition",
                    "name": commandTokens2[0],
                    "args": astDefintionArguments(removeBrackets(commandTokens2[1])),
                    "data": astSegment(removeCurlyBrackets(commandTokens2[2])),
                }
            };
        }
    }

    if (commandTokens.length == 3) {
        if (
            commandTokens[0] === "fn" &&
            isBrackets(commandTokens[1]) &&
            isCurlyBrackets(commandTokens[2])
        ){
            return {
                "kind": "function",
                "data": {
                    "type": "definition",
                    "args": astDefintionArguments(removeBrackets(commandTokens[1])),
                    "data": astSegment(removeCurlyBrackets(commandTokens[2])),
                }
            };
        }
    }

    // execution
    if (commandTokens.length > 1) {
        if (isBrackets(commandTokens[commandTokens.length - 1])) {
            return {
                "kind": "execution",
                "args": astNodes(removeBrackets(commandTokens.pop())),
                "key": astNode(commandTokens.join("")),
            };
        }
        if (isCurlyBrackets(commandTokens[commandTokens.length - 1])) {
            if (isBrackets(commandTokens[commandTokens.length - 2])) {
                return {
                    "kind": "execution",
                    "content": astSegment(removeCurlyBrackets(commandTokens.pop()), false)["data"],
                    "args": astNodes(removeBrackets(commandTokens.pop())),
                    "key": astNode(commandTokens.join("")),
                };
            }
        }
    }

    const methodTokens = splitCharedCommand(code,".");
    if (methodTokens.length > 1) {
        const method = methodTokens.pop();
        if (isValidVariableFormat(method)) {
            return {
                "kind": "key",
                "key": [method,"str"],
                "data": astNode(methodTokens.join("."))
            }
        }
    }

    if (isBrackets(code)) {
        const tokens = splitCommandParams(removeBrackets(code));
        if (tokens.length > 1) {
            return {
                "kind": "tuple",
                "data": astNodes(tokens)
            };
        }
        return astNode(removeBrackets(code));
    }

    if (isSquareBrackets(code)) {
        const tokens = splitCommandParams(removeSquareBrackets(code));
        return {
            "kind": "array",
            "data": astNodes(tokens)
        }
    }

    if (isCurlyBrackets(code)) {
        const tokens = splitCommandParams(removeCurlyBrackets(code));
        let values = [], keys = [], valid = true;
        tokens.map(pair => {
            const pairTokens = splitCharedCommand(pair,":");
            if (pairTokens.length == 2) {
                keys.push(astNode(pairTokens[0]));
                values.push(astNode(pairTokens[1]));
                return;
            }
            valid = false;
        })
        if (valid) {
            return {
                "kind": "object",
                "values": values,
                "keys": keys
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

    // a..b range operator
    const rangeTokens = code.split("..");
    if (rangeTokens.length == 2) {
        return {
            "kind": "range",
            "a": astNode(rangeTokens[0]),
            "b": astNode(rangeTokens[1])
        }
    }

    if (code[0] === "#" && (code.length == 4 || code.length == 7)) {
        return inst(hexToFloats(code),"color");
    }

    // reference
    if (isValidVariableFormat(code)) {
        return {
            "kind": "variable",
            "name": code,
        };
    }
    
    return {
        "kind": "unknown",
        "data": code,
    };
}

export function runFunction(content, func, scope = {}, root = false, stringify = false) {
    if (root) {
        const out = runFunctionRaw(content, content, scope, stringify);
        if (out) {
            return out;
        }
    }
    if (func != "") {
        let funcDef = null;
        content["definitions"].map(def => {
            if (def["kind"] == "function") {
                if (def["data"]["name"] == func) {
                    funcDef = def;
                }
            }
        })
        if (funcDef) {
            return runFunctionRaw(content, funcDef["data"]["data"], scope, stringify);
        }
    }
}
function runFunctionRaw(content, segment, scope = {}, stringify = false) {
    const astID = allocate(content);
    const dataID = allocate({"scope":"","trace":allocate(traceMake(content)),"ast":astID,"memory_addresses":[]});
    const segmentScopeID = getScope(scope,segment["definitions"],dataID);
    const scopeID = getScope(memory[segmentScopeID], content["definitions"], dataID);
    memory[dataID]["scope"] = scopeID;
    let out = runSegmentRaw(segment["data"], dataID);

    if (stringify && out) {
        out = castType(null,out,"str")[0];
    }

    // cleanup
    const ids = memory[dataID]["memory_addresses"];
    deAllocate(scopeID, segmentScopeID, astID, memory[dataID]["trace"], dataID, ...ids);

    return out;
}
function runSegmentRaw(content, dataID) {
    traceAdd(dataID,"content");
    for (let i = 0; i < content.length; i++) {
        const out = runNode(content[i], dataID);
        if (typeof out == "object" && out && !Array.isArray(out)) {
            if (out["kind"] == "return") {
                return out["data"];
            }
        }
    }
    traceOut(dataID);
}
function runNodes(args, dataID) {
    return args.map(arg => runNode(arg, dataID));
}
function runNode(node, dataID, flags = [], extraData = {}) {
    if (Array.isArray(node)) {
        return node;
    }
    if (!node) {
        return inst("null","null");
    }
    switch(node["kind"]) {
        case "execution":
            return runExecution(runNode(node["key"], dataID), node["key"], node["args"], node["content"], dataID);
        case "spacedCommand":
            return runExecution(runNode(node["key"], dataID), node["key"], [runNode(node["data"], dataID)], null, dataID, "spaced");
        case "variable":
            // no im not explaining this
            if (flags.includes("check")) {
                return Object.keys(memory[memory[dataID]["scope"]]).includes(node["name"]);
            }
            if (Object.keys(memory[memory[dataID]["scope"]]).includes(node["name"])) {
                if (flags.includes("assignment")) {
                    return memory[memory[dataID]["scope"]][node["name"]];
                }
                return getMemory(memory[memory[dataID]["scope"]][node["name"]],dataID);
            } else {
                if (flags.includes("assignment")) {
                    const id = randomStr(10);
                    memory[dataID]["memory_addresses"].push(id);
                    memory[memory[dataID]["scope"]][node["name"]] = id;
                    return id;
                }
                error(dataID,"variable not defined",node["name"]);
                return inst("null","null");
            }
        case "operation":
            return runOperation(node["operator"], runNode(node["a"], dataID), runNode(node["b"], dataID), dataID);
        case "comparison":
            return runComparison(node["type"], runNode(node["a"], dataID), runNode(node["b"], dataID), dataID);
        case "logic":
            return runLogic(node["type"], runNode(node["a"], dataID), runNode(node["b"], dataID), dataID);
        case "assignment":
            let value = runNode(node["value"], dataID);
            const reference = runNode(node["key"], dataID, ["assignment"]);
            if (["addition","join","subtraction","multiplication","division","modulo","power"].includes(node["type"])) {
                const base = runNode(runNode(node["key"], dataID));
                value = runOperation(node["type"], base, value);
            }
            if (reference && typeof reference !== "object") {
                memory[reference] = value;
            } else {
                error(dataID, "cannot assign to non-allocatable value")
            }
            return value;
        case "key":
            const id = runKey(runNode(node["data"], dataID), runNode(node["key"], dataID), dataID);
            if (flags.includes("assignment")) {
                return id;
            }
            return getMemory(id, dataID);
        case "range":
            let range = [];
            const a = runNode(node["a"], dataID), b = runNode(node["b"], dataID);
            if (a[1] != "num" || b[1] != "num") {
                error(dataID, "both sides of range must be a num");
            }
            for (let i = a[0]; i <= b[0]; i++) {
                range.push(allocate(inst(i,"num"), dataID));
            }
            return inst(range, "tuple");
        case "cast":
            const type = runNode(node["type"], dataID);
            if (type[1] !== "type") {
                error(dataID, "cannot cast to non-type value");
            }
            return castType(dataID, runNode(node["data"], dataID), type[0]);

        case "tuple":
            return inst(node["data"].map(elem => allocate(runNode(elem, dataID), dataID)),"tuple");
        case "array":
            return inst(node["data"].map(elem => allocate(runNode(elem, dataID), dataID)),"arr");
        case "object":
            return inst({"keys":node["keys"].map(key => runNode(key, dataID)),"values":node["values"].map(value => allocate(runNode(value, dataID), dataID))},"obj");
        case "function":
            return inst(node["data"], "func");

        case "unknown":
            error(dataID, "unknown tokens", node["data"]);
            return inst("null","null");
        default:
            error(dataID,"unknown node type",node["kind"]);
    }
}
function runExecution(execution,value,args,content,dataID,type = "standard") {
    if (!execution)
        return inst("null","null");
    if (execution[1] !== "func") {
        error(dataID,"cannot run values of type",execution[1]);
        return inst("null","null");
    }
    if (typeof execution[0] == "string")
        execution[0] = memory[execution[0]];
    
    if (execution.length == 3) {
        if ((execution[2]["functionType"] ? execution[2]["functionType"] : "standard") != type) {
            if (execution[2]["functionStrict"] != null ? execution[2]["functionStrict"] : true) {
                error(dataID,"cannot run",type,"as",execution[2]["functionType"])
            }
        }
    }

    switch (execution[0]["type"]) {
        case "builtin":
            args = runNodes(args,dataID);
            const data = execution[0]["data"](dataID, value, ...args);
            if (data) {
                return data;
            }
            return inst("null","null");
        case "builtin_statement":
            const data2 = execution[0]["data"](dataID, value, content, ...args);
            if (data2) {
                return data2;
            }
            return inst("null","null");
        case "definition":
            args = runNodes(args,dataID);
            const ast = memory[memory[dataID]["ast"]];
            let scope = runArguments(execution[0]["args"], args, dataID);
            Object.entries(memory[memory[dataID]["scope"]]).forEach(entry => {
                if (!scope[entry[0]]) {
                    scope[entry[0]] = memory[entry[1]];
                }
            });
            const funcAstID = allocate(ast);
            const funcDataID = allocate({"scope":"","trace":allocate(traceMake(ast)),"ast":funcAstID,"memory_addresses":[]});
            const funcScopeID = getScope(scope, ast["definitions"], funcDataID);
            memory[funcDataID]["scope"] = funcScopeID;
            const out = runSegmentRaw(execution[0]["data"]["data"], funcDataID);
            deAllocate(funcAstID, funcScopeID, memory[funcDataID]["trace"], funcDataID, ...memory[funcDataID]["memory_addresses"]);
            if (out) {
                return out;
            } else {
                return inst("null","null");
            }
        default:
            error(dataID,"unknown function type",execution[0]["type"]);
            return inst("null","null");
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
function runOperation(operation, a, b, dataID) {
    if (a[1] === "color" && b[1] === "color") {
        return inst({
            "r": runOperation(operation, inst(a[0]["r"],"num"), inst(b[0]["r"],"num"))[0],
            "g": runOperation(operation, inst(a[0]["g"],"num"), inst(b[0]["g"],"num"))[0],
            "b": runOperation(operation, inst(a[0]["b"],"num"), inst(b[0]["b"],"num"))[0],
        },"color")
    }
    if (a[1] === "color") {
        return inst({
            "r": runOperation(operation, inst(a[0]["r"],"num"), b)[0],
            "g": runOperation(operation, inst(a[0]["g"],"num"), b)[0],
            "b": runOperation(operation, inst(a[0]["b"],"num"), b)[0],
        },"color")
    }
    if (b[1] === "color") {
        return inst({
            "r": runOperation(operation, a, inst(b[0]["r"],"num"))[0],
            "g": runOperation(operation, a, inst(b[0]["g"],"num"))[0],
            "b": runOperation(operation, a, inst(b[0]["b"],"num"))[0],
        },"color")
    }
    switch(operation) {
        case "addition":
            if (a[1] === "num" && b[1] === "num") {
                return inst(a[0] + b[0],"num");
            }
            return inst(castType(dataID, a,"str")[0] + " " + castType(dataID, b,"str")[0],"str");
        case "join":
            return inst(castType(dataID, a,"str")[0] + castType(dataID, b,"str")[0], "str");
        case "subtraction":
            if (a[1] === "num" && b[1] === "num") {
                return inst(a[0] - b[0],"num");
            }
            error(dataID, "cannot subtract", a[1], "by", b[1]);
        case "multiplication":
            if (a[1] === "num" && b[1] === "num") {
                return inst(a[0] * b[0],"num");
            }
            if (b[1] == "num") {
                return inst(castType(dataID, a,"str")[0].repeat(b[0]),"str");
            }
            if (a[1] == "num") {
                return inst(castType(dataID, b,"str")[0].repeat(a[0]),"str");
            }
            error(dataID, "cannot multiply", a[1], "by", b[1]);
        case "division":
            if (a[1] === "num" && b[1] === "num") {
                return inst(a[0] / b[0],"num");
            }
            error(dataID, "cannot divide", a[1], "by", b[1]);
        case "modulo":
            if (a[1] === "num" && b[1] === "num") {
                return inst(a[0] % b[0],"num");
            }
            error(dataID, "cannot modulo", a[1], "by", b[1]);
        case "power":
            if (a[1] === "num" && b[1] === "num") {
                return inst(a[0] ** b[0],"num");
            }
            error(dataID, "cannot raise", a[1], "to power", b[1]);
        case "is":
            if (b[1] !== "type") { return false; }
            return inst(a[1] == b[0],"bool");
        case "in":
            return inst(castType(dataID, b, "arr")[0].map(val => getMemory([val])).findIndex(val => isEqual(val, a)) !== -1, "bool")
        default:
            error(dataID, "unknown operation", operation);
    }
}
function runComparison(type, a, b, dataID) {
    switch (type) {
        case "equal":
            return inst(isEqual(a,b),"bool");
        case "not_equal":
            return inst(!isEqual(a,b),"bool");
        case "string_equal":
            return inst(castType(dataID, a,"str")[0] == castType(dataID, b,"str")[0],"bool");
        case "type_equal":
            return inst(a[1] === b[1]);
        
        case "greater":
            return inst(castType(dataID, a,"num")[0] > castType(dataID, b,"num")[0],"bool");
        case "smaller":
            return inst(castType(dataID, a,"num")[0] < castType(dataID, b,"num")[0],"bool");
        case "greater_equal":
            return inst(castType(dataID, a,"num")[0] >= castType(dataID, b,"num")[0],"bool");
        case "smaller_equal":
            return inst(castType(dataID, a,"num")[0] <= castType(dataID, b,"num")[0],"bool");
        
        default:
            error(dataID, "unknown comparison", type);
    }
    return inst("null","null");
}
function runLogic(type, a, b, dataID) {
    a = castType(dataID, a,"bool");
    b = castType(dataID, b,"bool");
    switch (type) {
        case "and":
            return inst(a[0] && b[0],"bool");
        case "or":
            return inst(a[0] || b[0],"bool");
        default:
            error(dataID, "unknown logic type", type);
    }
}
function runKey(value, key, dataID) {
    const indexedValue = castType(dataID, value, "arr", false, true);
    if (indexedValue) {
        const index = castType(dataID, key, "num", false, true);
        if (index) {
            return indexedValue[0][index[0]];
        }
    }
    if (value[0] && !Array.isArray(value[0]) && typeof value[0] == "object") {
        if (value[0]["keys"]) {
            const keyIndex = value[0]["keys"].findIndex(objKey => Object_isSame(objKey, key));
            if (keyIndex > -1) {
                return value[0]["values"][keyIndex];
            }
        }
    }
    return inst("null","null");
}

let typeAttributes = {
    "str": {
        "upper": inst(
            {
                "type": "builtin",
                "data": function(dataID, value, ...args) {
                    return 
                }
            },
            "func"
        )
    }
}

function getScope(scope, definitions, scopeDataID) {
    let data = {
        // constants
        "null": inst("null","null"),
        "true": inst(true,"bool"),
        "false": inst(false,"bool"),

        // types
        "str": inst("str","type"),
        "num": inst("num","type"),
        "bool": inst("bool","type"),
        "tuple": inst("tuple","type"),
        "type": inst("type","type"),
        "obj": inst("obj","type"),
        "arr": inst("arr","type"),
        "func": inst("func","type"),
        "nullish": inst("null","type"),
        "color": inst("color","type"),

        // functions
        "print": inst(
            {
                "type": "builtin",
                "data": function(dataID, value, ...args) {
                    print(dataID, ...args.map(arg => castType(dataID, arg,"str")[0]));

                    // if it is only 1 argument, return that argument
                    if (args.length == 1) {
                        return args[0];
                    }
                    // if it is more than 1 argument, return it as a tuple
                    return inst(args.map(arg => allocate(arg, dataID)),"tuple");
                }
            },
            "func"
        ),
        "typeof": inst( // typeof is both a function and a spaced command
            {
                "type": "builtin",
                "data": function(dataID, value, ...args) {
                    if (args.length == 1) {
                        return inst(args[0][1],"type");
                    } else {
                        return inst(args.map(arg => allocate([arg[1],"type"], dataID)),"tuple");
                    }
                }
            },
            "func",
            {
                "functionType": "spaced", // its a spaced command (typeof ":3")
                "functionStrict": false // it CAN be used as a normal function (typeof(":3"))
            }
        ),
        "return": inst(
            {
                "type": "builtin",
                "data": function(dataID, value, ...args) {
                    if (args.length > 0) {
                        if (args.length == 1) {
                            return {
                                "kind": "return",
                                "data": args[0]
                            };
                        } else {
                            return {
                                "kind": "return",
                                "data": inst(args.map(arg => allocate(arg)), "tuple")
                            };
                        }
                    } else {
                        return {
                            "kind": "return",
                            "data": null
                        }
                    }
                }
            },
            "func", {"functionType": "spaced", "functionStrict": false}
        ),
        // statements
        "if": inst(
            {
                "type": "builtin_statement",
                "data": function(dataID, value, content, ...args) {
                    const val = args.every(arg => castType(dataID, runNode(arg, dataID), "bool")[0]);
                    if (val) {
                        const out = runSegmentRaw(content, dataID);
                        if (out) { return {"kind":"return","data":out}; }
                    }
                }
            },
            "func"
        ),
        "while": inst(
            {
                "type": "builtin_statement",
                "data": function(dataID, value, content, ...args) {
                    let val = args.every(arg => castType(dataID, runNode(arg, dataID), "bool")[0]);
                    while (val) {
                        const out = runSegmentRaw(content, dataID);
                        if (out) { return {"kind":"return","data":out}; }
                        val = args.every(arg => castType(dataID, runNode(arg, dataID), "bool")[0]);
                    }
                }
            },
            "func"
        ),
        "until": inst(
            {
                "type": "builtin_statement",
                "data": function(dataID, value, content, ...args) {
                    let val = args.every(arg => castType(dataID, runNode(arg, dataID), "bool")[0]);
                    while (!val) {
                        const out = runSegmentRaw(content, dataID);
                        if (out) { return {"kind":"return","data":out}; }
                        val = args.every(arg => castType(dataID, runNode(arg, dataID), "bool")[0]);
                    }
                }
            },
            "func"
        ),
        "for": inst(
            {
                "type": "builtin_statement",
                "data": function(dataID, value2, content, ...args) {
                    if (args.length < 1 || args.length > 3) {
                        error(dataID, "unknown for syntax");
                    }
                    
                    let variable = null;
                    let value = null;
                    let step = 1;

                    let current = args.shift();
                    if (!Array.isArray(current)) {
                        if (current["kind"] == "variable") {
                            runNode({
                                "kind": "assignment",
                                "type": "default",
                                "key": current,
                                "value": inst(0, "num")
                            },dataID)
                            variable = current;
                        } else if (current["kind"] == "assignment") {
                            runNode(current, dataID);
                            variable = current["key"];
                        } else {
                            error(dataID, "first argument isnt assignment or variable");
                        }
                        if (args.length > 0) {
                            current = args.shift();
                            value = current;
                        }
                    } else {
                        value = current;
                    }
                    
                    
                    if (args.length > 0) {
                        step = castType(dataID,runNode(args.shift(),dataID),"num")[0];
                    }

                    let iter = runNode(value, dataID);
                    if (iter[1] == "num") {
                        for (let i = 0; i < iter[0]; i++) {
                            const out = runSegmentRaw(content, dataID);
                            if (out) { return {"kind":"return","data":out}; }
                            if (variable) {
                                runNode({
                                    "kind": "assignment",
                                    "type": "addition",
                                    "key": variable,
                                    "value": inst(step, "num")
                                },dataID)
                            }
                        }
                    } else {
                        iter = castType(dataID,iter,"bool")[0];
                        while (iter) {
                            const out = runSegmentRaw(content, dataID);
                            if (out) { return {"kind":"return","data":out}; }
                            if (variable) {
                                runNode({
                                    "kind": "assignment",
                                    "type": "addition",
                                    "key": variable,
                                    "value": inst(step, "num")
                                },dataID)
                            }
                            iter = castType(dataID,runNode(value,dataID),"bool")[0];
                        }
                    }
                }
            },
            "func"
        ),
    };
    const keys = Object.keys(definitions);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const def = definitions[key]["data"];
        if (definitions[key]["kind"] == "function") {
            data[def["name"]] = inst(allocate(def),"func");
            memory[scopeDataID]["memory_addresses"].push(data[def["name"]][0]);
        }
    }
    // allocate all the values and functions into memory
    data["scope"] = "FSL_SCOPE_ID";
    return allocate(allocateTypedObjectContents(Object_merge(scope, data), scopeDataID)[0]);
}
function allocate(value, dataID = null, staticID = null) {
    let id = staticID;
    if (!staticID) {
        id = randomStr(10);
    }
    if (dataID) {
        memory[dataID]["memory_addresses"].push(id);
    }
    memory[id] = value;
    //console.log("allocated",id,value);
    return id;
}
function allocateTypedObjectContents(object, dataID) {
    if (!Array.isArray(object) && typeof object == "object" && object) {
        let data = {};
        for (let i = 0; i < Object.keys(object).length; i++) {
            const key = Object.keys(object)[i];
            if (typeof object[key] == "object" && object) {
                data[key] = allocateTypedObject(object[key], dataID);
            } else {
                data[key] = object[key];
            }
            if (dataID) {
                memory[dataID]["memory_addresses"].push(data[key]);
            }
        }
        return inst(data,"obj");
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
function getMemory(id,dataID) {
    if (id == "FSL_SCOPE_ID") {
        return [{"keys":Object.keys(memory[memory[dataID]["scope"]]).map(key => inst(key, "str")), "values":Object.values(memory[memory[dataID]["scope"]])},"obj"];
    }
    return memory[id];
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

function castType(dataID, value, type, formatting = false, tryTo = false) {
    if (typeof value == "string") {
        if (value == "FSL_SCOPE_ID") {
            return inst("<object:fsl_scope>","str");
        }
        value = memory[value];
    }
    if (!value) { return inst("<error:stringify_error>","str"); }
    if (value[1] === "str" && type === "str" && formatting) {
        return inst("\""+value[0].toString()+"\"","str");
    }
    if (value[1] === type)
        return value;
    switch (type) {
        case "str":
            if (value[1] === "func") {
                let funcType = value[0]["type"];
                if (typeof value[0] == "string") {
                    funcType = memory[value[0]]["type"];
                }
                return inst("<func:"+funcType+">","str");
            }
            if (value[1] == "type") {
                return inst("<type:"+value[0]+">","str");
            }

            if (value[1] === "tuple") {
                return inst("("+value[0].map(e => castType(dataID, memory[e],"str",true)[0]).join(", ")+")","str");
            }
            if (value[1] === "obj") {
                return inst("{"+value[0]["keys"].map((key, index) => castType(dataID, key,"str", true)[0] + ":" + castType(dataID, value[0]["values"][value[0]["keys"].indexOf(key)],"str", true)[0]).join(", ")+"}","str");
            }
            if (value[1] === "arr") {
                return inst("["+value[0].map(value => castType(dataID, value,"str",true)[0]).join(", ")+"]","str");
            }
            if (value[1] === "color") {
                return inst("#"+Math.round(value[0]["r"] * 255).toString(16).padStart(2, '0')+Math.round(value[0]["g"] * 255).toString(16).padStart(2, '0')+Math.round(value[0]["b"] * 255).toString(16).padStart(2, '0'),"str");
            }

            return inst(value[0].toString(),"str");
        case "num":
            if (value[1] === "str") {
                if (isNumeric(value[0])) {
                    return inst(Number(value[0]),"num");
                }
            }
            break
        case "bool":
            switch (value[1]) {
                case "str":
                    return inst(value[0].length > 0,"bool");
                case "num":
                    return inst(value[0] > 0, "bool");
                case "tuple": case "arr":
                    return inst(value[0].length > 0,"bool");
                case "type":
                    return inst(value[0] !== "null","bool");
                case "obj":
                    return inst(Object.keys(value[0]).length > 0,"bool");
                case "color":
                    return inst(true,"bool");
            }
            return inst(false, "bool");
        case "tuple": case "arr":
            if (value[1] === "str" || value[1] === "num") {
                if (value[1] == "num") {
                    value[0] = value[0].toString();
                }
                return inst(value[0].split("").map(char => allocate(inst(char,"str"), dataID)),type);
            }
            if (value[1] === "obj") {
                return inst(Object.keys(value[0]).map(key => allocate(inst(key,"str"), dataID)),type)
            }
            if (value[1] === "tuple" || value[1] === "arr") {
                return inst(value[0],type);
            }
            return inst([],type);
        case "type":
            return inst(value[1],"type");
        case "color":
            switch (value[1]) {
                case "tuple": case "arr":
                    if (value[0].length === 3) {
                        const r = memory[value[0][0]], g = memory[value[0][1]], b = memory[value[0][2]];
                        if (r[1] === "num" && g[1] === "num" && b[1] === "num") {
                            return inst({"r":r[0],"g":g[0],"b":b[0]},"color");
                        }
                    }
                case "str":
                    return inst(hexToFloats(value[0]),"color");
                case "num":
                    return inst({"r":value[0],"g":value[0],"b":value[0]},"color");
            }
            return inst({"r":0,"g":0,"b":0},"color");
        default:
            if (tryTo) {
                return null;
            }
            error(dataID,"cannot cast type", value[1], "to type",type);
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
function inst(value,type,extra=null) { // short version of instance type
    if (type === "color") {
        if (value["r"] < 0) { value["r"] = 0 }
        if (value["g"] < 0) { value["g"] = 0 }
        if (value["b"] < 0) { value["b"] = 0 }
        if (value["r"] > 1) { value["r"] = 1 }
        if (value["g"] > 1) { value["g"] = 1 }
        if (value["b"] > 1) { value["b"] = 1 }
    }
    return instanceType(value,type,extra);
}
function instanceType(value,type,extra=null) {
    //console.log("instanced value of type", type /*, "value (",value,")"*/ );
    if (extra)
        return [value,type,extra];
    else
        return [value,type];
}
function isEqual(a,b) {
    if (!isTypeEqual(a[1],b[1])) {
        return false;
    }
    if (typeof a[0] !== typeof b[0]) {
        return false;
    }
    if (typeof a[0] == "object" && a) {
        return Object_isSame(a,b);
    }
    return a[0] === b[0];
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
    //console.log(JSON.stringify(astSegment(code)));
    const out = runFunction(astSegment(code),"main",{},true,true);
    if (out)
        print(null,"out:",out);
    if (Object.keys(memory).length) {
        console.warn(Object.keys(memory).length, "memory item(s) still allocated");
        console.warn(memory);
    }
}
