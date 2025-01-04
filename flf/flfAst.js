
import { astSegment } from "../src/fsl.js";

const ast = astSegment(process.argv[2]);
const long = JSON.stringify(ast,null,"    ");

if (long.length > 2000) {
    console.log(JSON.stringify(ast));
} else {
    console.log(long);
}

/*
import { generateAst } from "../old/oldish/src/astGen.js";

const ast = generateAst(process.argv[2]);
const long = JSON.stringify(ast,null,"    ");

if (long.length > 2000) {
    console.log(JSON.stringify(ast));
} else {
    console.log(long);
}
*/

/*
import { generateAst } from "../old/oldastGen.js";
//console.log(JSON.stringify(generateAst(process.argv[2]),null,"    "));
console.log(JSON.stringify(generateAst(process.argv[2])))
*/