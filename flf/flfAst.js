
///*
import { generateAst } from "../src/astGen.js";

const ast = generateAst(process.argv[2]);
const long = JSON.stringify(ast,null,"    ");

if (long.length > 4000) {
    console.log(JSON.stringify(ast));
} else {
    console.log(long);
}
//*/

/*
import { generateAst } from "../old/oldastGen.js";
//console.log(JSON.stringify(generateAst(process.argv[2]),null,"    "));
console.log(JSON.stringify(generateAst(process.argv[2])))
*/