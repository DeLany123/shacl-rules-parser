import { Parser } from '@traqula/parser-sparql-1-1';
import { toAlgebra } from '@traqula/algebra-sparql-1-1';
const parser = new Parser();
const ast = parser.parse('SELECT * WHERE { ?x ?y ?z }');
const algebra = toAlgebra(ast);
console.log(algebra);