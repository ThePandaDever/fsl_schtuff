
import { runFunction, astSegment } from "../src/fsl.js";

console.log("output:",runFunction(astSegment(process.argv[2]),"main"));

/*
import { generateAst } from "../old/oldish/src/astGen.js";
import { runAst, formatString } from "../old/oldish/src/interpreter.js";

console.log("output:",formatString(runAst(generateAst(process.argv[2]),"main",[],true)));
*/

/*
import { runCode } from "../old/oldfsl.js";
runCode(process.argv[2]);
*/