
const code = `
fn main2(str funny) {
    print("mul,tiline string
    
    funny", 10);
}
print("funny");
main2("not funny" + (10 * 10));`;


function tokenise(n,e){try{let t=0,s="",i=0,u=0,o=[],r=[];const h=n.length;for(;t<h;)s=n[t],'"'===s?(i=1-i,o.push('"')):o.push(s),0===i&&("["!==s&&"{"!==s&&"("!==s||u++,"]"!==s&&"}"!==s&&")"!==s||u--,u=u<0?0:u),t++,0===i&&n[t]===e&&0===u&&(r.push(o.join("")),o=[],t++);return r.push(o.join("")),r}catch(n){return[]}}
function tokeniseEscaped(n,e){try{let t=0,s="",i=0,u=0,o=[],r=[],h=!1;const p=n.length;for(;t<p;)s=n[t],0!==i||h||("["!==s&&"{"!==s&&"("!==s||u++,"]"!==s&&"}"!==s&&")"!==s||u--,u=u<0?0:u),'"'!==s||h?"\\"!==s||h?(o.push(s),h=!1):(h=!h,o.push("\\")):(i=1-i,o.push('"')),t++,0===i&&n[t]===e&&0===u&&(r.push(o.join("")),o=[],t++);return r.push(o.join("")),r}catch(n){return[]}}
function autoTokenise(n,e){return-1!==n.indexOf("\\")?tokeniseEscaped(n,e??" "):-1!==n.indexOf('"')||-1!==n.indexOf("[")||-1!==n.indexOf("{")||-1!==n.indexOf("(")?tokenise(n,e??" "):n.split(e??" ")}

function tokeniseLines(code) {
  let out = [];
  let current = "";
  let quotes = false;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "\"") {
      quotes = !quotes;
      current += code[i];
    } else if ((code[i] === "\n" || code[i] === ";") && !quotes && current.length > 0) {
      out.push(current.trim());
      current = "";
    } else {
      current += code[i];
    }
  }

  if (current.length > 0) {
    out.push(current);
  }

  return out;
}

function tokeniseFunction(func) {
  let out = {};
  let current = "";

  let tokens = autoTokenise(func, "(");
  let name = tokens[0];
  let args = autoTokenise(autoTokenise(tokens.slice(1,tokens.length).join("("),")")[0],",");


  return {
    name: name,
    args: args
  };
}

funcs = {
  print: function(args) {
    console.log(...args);
  }
};

function runFunc(func) {
  if (funcs[func.name]) {
    funcs[func.name](func.args);
  } else {
    console.error(`Function ${func.name} not found`);
  }
}


function generateAST(code) {
  code = tokeniseLines(code);

  for (let i = 0; i < code.length; i++) {
    let line = code[i];
    let tokens = autoTokenise(line," ");
    switch (tokens[0]) {
      case "fn":
        func = tokeniseFunction(tokens[1]);
        console.log(func);
        break;
      case "}": break;
      default:
        runFunc(tokeniseFunction(line));
        break;
    }
  }

  console.log(code)
}

generateAST(code);