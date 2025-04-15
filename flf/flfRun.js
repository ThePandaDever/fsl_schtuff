
/*
import { runFunction, astSegment } from "../src/fsl.js";
const out = runFunction(astSegment(process.argv[2]),"main",{},true,true);
if (out)
    console.log("output:",out);
*/

import { Script } from "D:\\fsl_schtuff\\src\\node\\fsl.js";

try {
    const myScript = new Script({
        code: process.argv[2] ?? "print(\"hi\");"
    });

    let out = myScript.run();
    if (out.shouldReturn())
        out = out.getReturnValue();
    if (!out.isUndefined())
        console.log(out.stringify());
} catch (e) {
    console.log(e.toString());
}


/*
import { generateAst } from "../old/oldish/src/astGen.js";
import { runAst, formatString } from "../old/oldish/src/interpreter.js";

console.log("output:",formatString(runAst(generateAst(process.argv[2]),"main",[],true)));
*/

/*
import { runCode } from "../old/oldfsl.js";
runCode(process.argv[2]);
*/