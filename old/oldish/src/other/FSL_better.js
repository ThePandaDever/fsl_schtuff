let code = `fn main() {
  i = 0;
  for(10) {
    print(i = i + 1);
  }
}`

let ast = {"functions":{"main":{"content":[{"data":{"type":"assignment","key":{"type":"reference","key":"i"},"value":[0,"number"]},"type":"standalone"},{"type":"command","id":"for","args":[[10,"number"]],"content":[{"type":"command","id":"print","args":[{"type":"assignment","key":{"type":"reference","key":"i"},"value":{"type":"operation","data":[{"type":"reference","key":"i"},"+",[1,"number"]]}}]}]}],"key":"main","hash":"fn_05aa62e88a78d0b7bc26c9062040835c"}},"externals":{},"externals_ref":{},"hash":"ast_05aa62e88a78d0b7bc26c9062040835c"}

lookup_osl_command = (name) => {
  return {
    "print": "log",
    "for": "loop",
  }[name];
}

lookup_osl_operator = (name) => {
  return {
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
    "%": "%",
    "^": "^",
    "equal": "===",
  }[name];
}

lookup_osl_cast = (name) => {
  return {
    "number": ".toNum()",
    "string": ".toStr()",
  }[name];
}

eval_token = (token) => {
  let type = token?.type;
  if (type === "operation") {
    return "("+eval_token(token.data[0]) + " " + token.data[1] + " " + eval_token(token.data[2]) + ")";
  } else if (type === "comparison") {
    let a = eval_token(token.a);
    let b = eval_token(token.b);
    return a + " " + lookup_osl_operator(token.id) + " " + b;
  } else if (type === "command") {
    let main = lookup_osl_command(token.id) + " " + eval_token(token.args[0]);
    if (token.content) {
      main = main + " (\n" + eval_function(token).slice(1,token.length).join("\n");
    }
    return main;
  } else if (type === "cast") {
    return eval_token(token.value) + lookup_osl_cast(token.casts[0]);
  } else if (type === "assignment") {
    return eval_token(token.key) + " = " + eval_token(token.value);
  } else if (Array.isArray(token)) {
    if (token[1] === "string") {
      return `"${token[0]}"`;
    } else {
      return token[0];
    }
  } else if (type === "standalone") {
    return eval_token(token.data);
  } else if (type === "reference") {
    return `${token.key}`;
  } else {
    return token;
  }
}

eval_function = (func) => {
  let content = func.content;
  let out = ["def \"" + func.key + "\" ("];
  for (let i = 0; i < content.length; i++) {
    let command = content[i];
    out.push(eval_token(command));
  }
  out.push(")");
  return out
}

console.log(eval_function(ast.functions.main).join("\n"));