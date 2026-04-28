import fs from 'node:fs';
import type { ContextConfigs } from '@traqula/algebra-transformations-1-2';
import { AlgebraFactory, createAlgebraContext } from '@traqula/algebra-transformations-1-2';
import { AstFactory, completeParseContext, type SparqlContext } from '@traqula/rules-sparql-1-2';
import { shaclAlgebraBuilder } from './lib/shaclAgebra/shaclToAlgebra.js';
import { shaclParser } from './lib/shaclParser/shaclParser.js';

const shaclInput = `
    PREFIX : <http://example/>

    DATA { :x :p 1 ; :q 2 . }

    RULE { ?x :bothPositive true . }
    WHERE { ?x :p ?v1  FILTER ( ?v1 > 0 )  ?x :q ?v2  FILTER ( ?v2 > 0 )  }
    `;

const astFactory: AstFactory = new AstFactory();
const algebraFactory: AlgebraFactory = new AlgebraFactory();
const context: SparqlContext = completeParseContext({ astFactory });
const result = shaclParser.shaclRuleSet(shaclInput, context);
console.log(JSON.stringify(result, null, 2));

console.log('====================================================');

// Algebra builder
const toAlgebra = shaclAlgebraBuilder.build();
const algebraFactoryConfig: ContextConfigs = {};
const algebraContext = createAlgebraContext(algebraFactoryConfig);
const algebraResult = toAlgebra.shaqlQuery(algebraContext, result);
console.log(JSON.stringify(algebraResult, null, 2));
const cleanJson = JSON.stringify(algebraResult, (key, value) => {
  if (key === 'loc') {
    return;
  }
  return value;
}, 2);
fs.writeFileSync('output-algebra.json', cleanJson);
