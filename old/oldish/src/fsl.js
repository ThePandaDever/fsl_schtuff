import * as fs from "node:fs";
import { generateAst } from "./astGen.js";
import { formatString, runAst } from "./interpreter.js";

if (process.argv.length == 3) {
    const ast = generateAst(fs.readFileSync(process.argv[2], 'utf8'));
    console.log("output:",formatString(runAst(ast,"main",[],true)));
} else {
    const code = fs.readFileSync('D:/fsl_schtuff/src/main.fsl', 'utf8');
    const ast = generateAst(code);
    console.log("output:",formatString(runAst(ast,"main",[],true)));
}
