import { formatString, runAst } from "../src/interpreter.js";

console.log("output:",formatString(runAst(JSON.parse(process.argv[2]),"main",[],true)));