import * as fs from 'fs';
import type {SparqlContext} from '@traqula/rules-sparql-1-2';
import {AstFactory, completeParseContext} from '@traqula/rules-sparql-1-2';
import {shaclParser} from './shaclParser.js';

const shaclInput = `
PREFIX : <http://example/>

DATA { :x :p 1 ; :q 2 . }

RULE { ?x :bothPositive true . }
WHERE { ?x :p ?v1  FILTER ( ?v1 > 0 )  ?x :q ?v2  FILTER ( ?v2 > 0 )  }
`;

const factory: AstFactory = new AstFactory();

const context: SparqlContext = completeParseContext({ astFactory: factory });

try {
  const result = shaclParser.shaclRuleSet(shaclInput, context);
  console.log(JSON.stringify(result, null, 2));
  const cleanJson = JSON.stringify(result, (key, value) => {
    if (key === 'loc') return undefined;
    return value;
  }, 2);

// Schrijf het naar een bestand in je map
  fs.writeFileSync('output-ast.json', cleanJson);
} catch (error: any) {
  console.log("\n PARSE ERROR");
  console.log("===============");

  // Extract line and column from error message
  const lineMatch = error.message.match(/line (\d+), column (\d+)/);
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1], 10);
    const colNum = parseInt(lineMatch[2], 10);

    const lines = shaclInput.split('\n');
    console.log("\nInput being parsed:");
    console.log("-------------------");

    // Show all lines with line numbers
    for (const [idx, line] of lines.entries()) {
      const displayLineNum = idx + 1;
      console.log(`${displayLineNum.toString().padStart(2)}: ${line}`);

      // Add pointer for error line
      if (displayLineNum === lineNum) {
        const pointer = ' '.repeat(4 + colNum - 1) + '^';
        console.log(pointer);
      }
    }
    console.log("-------------------\n");
  }

  console.log(error.message);
  console.log("===============");

}
