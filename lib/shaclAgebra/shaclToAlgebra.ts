import { toAlgebra12Builder } from '@traqula/algebra-sparql-1-2';
import type { Algebra, AlgebraIndir } from '@traqula/algebra-transformations-1-1';
import type { ShaclRuleNode } from '../shaclParser/shaclTypes.js';

// 1. Retrieve the original SPARQL translation rules we want to reuse
const origTranslateGraphPattern = toAlgebra12Builder.getRule('translateGraphPattern');
const origTranslateBgp = toAlgebra12Builder.getRule('translateBgp');

// 2. Define the translation for a single SHACL Rule
// We map: ShaclRuleNode (AST) --> Algebra.Construct (Math)
export const translateShaclRule: AlgebraIndir<'translateShaclRule', Algebra.Construct, [ShaclRuleNode]> = {
  name: 'translateShaclRule',
  fun: $ => (C, ruleAst) => {
    // A. Translate the WHERE clause (body) into an Algebra Operation (e.g., Join, Filter, Bgp)
    // We pass this to the standard SPARQL graph pattern translator
    const patternAlgebra = $.SUBRULE(origTranslateGraphPattern, ruleAst.body);

    // B. Translate the RULE (head) clause into a Construct Template
    // Traqula's bgp translator returns an Algebra.Bgp. We just extract its patterns.
    const headBgpAlgebra = $.SUBRULE(origTranslateBgp, ruleAst.head);

    // C. Return a standard SPARQL Construct Algebra object!
    return {
      type: 'construct',
      input: patternAlgebra,
      template: headBgpAlgebra.patterns,
    };
  },
};
