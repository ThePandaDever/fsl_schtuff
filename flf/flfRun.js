
import { runFunction, astSegment } from "../src/fsl.js";
const out = runFunction(astSegment(process.argv[2]),"main",{},true,true);
if (out)
    console.log("output:",out);

/*
import { generateAst } from "../old/oldish/src/astGen.js";
import { runAst, formatString } from "../old/oldish/src/interpreter.js";

console.log("output:",formatString(runAst(generateAst(process.argv[2]),"main",[],true)));
*/

/*
import { runCode } from "../old/oldfsl.js";
runCode(process.argv[2]);
*/