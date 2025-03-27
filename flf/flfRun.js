
/*
import { runFunction, astSegment } from "../src/fsl.js";
const out = runFunction(astSegment(process.argv[2]),"main",{},true,true);
if (out)
    console.log("output:",out);
*/

import { Script } from "../src but even better/fsl.js";

const myScript = new Script({
    code: process.argv[2]
});

const out = myScript.run();
if (!out.isUndefined())
    console.log(out);

/*
import { generateAst } from "../old/oldish/src/astGen.js";
import { runAst, formatString } from "../old/oldish/src/interpreter.js";

console.log("output:",formatString(runAst(generateAst(process.argv[2]),"main",[],true)));
*/

/*
import { runCode } from "../old/oldfsl.js";
runCode(process.argv[2]);
*/