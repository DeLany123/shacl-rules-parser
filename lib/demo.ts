import { AstFactory } from '@traqula/rules-sparql-1-2';
import { shaclParser } from './shaclParser.js';
import { SparqlContext } from '@traqula/rules-sparql-1-2';

const shaclInput = `
PREFIX : <http://example/>

DATA { :x :p 1 ; :q 2 . }

RULE { ?x :bothPositive true . }
WHERE { ?x :p ?v1  FILTER ( ?v1 > 0 )  ?x :q ?v2  FILTER ( ?v2 > 0 )  }
`;

const factory: AstFactory = new AstFactory();

const context: SparqlContext = {
    astFactory: factory,
    prefixes: {}, // Starts empty, but the parser will populate this with the prefixes found in the SHACL input
    baseIRI: undefined, // No base IRI provided in this example
    skipValidation: false, // We want to validate that used variables are in scope
    parseMode: new Set(), // No special parse modes needed for this example
}
try {
  const result = shaclParser.shaclRuleSet(shaclInput, context as any);
  console.log(JSON.stringify(result, null, 2));
} catch (error: any) {
  console.log("\n PARSE ERROR");
  console.log("---------------");
  // Traqula errors often contain the specific message
  console.log(error.message); 
  console.log("---------------");
}