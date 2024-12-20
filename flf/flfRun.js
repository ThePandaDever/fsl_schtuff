
///*
import { generateAst } from "../src/astGen.js";
import { runAst, formatString } from "../src/interpreter.js";

console.log("output:",formatString(runAst(generateAst(process.argv[2]),"main",[],true)));
//*/

/*
import { runCode } from "../old/oldfsl.js";
runCode(process.argv[2]);
*/