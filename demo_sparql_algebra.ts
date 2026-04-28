import fs from 'node:fs';
import { toAlgebra } from '@traqula/algebra-sparql-1-1';
import { Parser } from '@traqula/parser-sparql-1-1';

const parser = new Parser();
const ast = parser.parse(
  'SELECT * WHERE { ?x <http://example.com/p> ?v1  FILTER ( ?v1 > 0 )  ?x <http://example.com/q> ?v2  FILTER ( ?v2 > 0 )  }',
);
const algebra = toAlgebra(ast);
console.log(algebra);
const cleanJson = JSON.stringify(algebra, (key, value) => {
  if (key === 'loc') {
    return;
  }
  return value;
}, 2);
fs.writeFileSync('output-algebra-sparql.json', cleanJson);
