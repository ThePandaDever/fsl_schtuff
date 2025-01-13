
import { runFunction } from "../src/fsl.js";

const out = runFunction(JSON.parse(process.argv[2]),"main",{},true,true);
if (out) {
    console.log("output:",out);
}

/*
import { formatString, runAst } from "../old/oldish/src/interpreter.js";

console.log("output:",formatString(runAst(JSON.parse(process.argv[2]),"main",[],true)));
*/
