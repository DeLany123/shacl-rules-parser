import {toAlgebra12Builder} from '@traqula/algebra-sparql-1-2';
import type { Algebra, AlgebraIndir } from '@traqula/algebra-transformations-1-1';
import { Types} from '@traqula/algebra-transformations-1-1';
import type { RuleOrDataBlockType, shaclDataNode, ShaclRuleNode} from '../shaclParser/shaclTypes.js';

const origTranslateGraphPattern = toAlgebra12Builder.getRule('translateGraphPattern');
const origTranslateBasicGraphPattern = toAlgebra12Builder.getRule('translateBasicGraphPattern');
const origTranslateQuad = toAlgebra12Builder.getRule('translateQuad');
const origTranslateBgp = toAlgebra12Builder.getRule('translateBgp');

// Starting point
export const shaqlQuery: AlgebraIndir<'shaqlQuery', any, [RuleOrDataBlockType]> = {
  name: 'shaqlQuery',
  fun: ({ SUBRULE }) => (C, ast) => {
    return ast.elements.map((element) => {
      if (element.type === 'shaclData') {
        return SUBRULE(data, element);
      }
      if (element.type === 'shaclRule') {
        return SUBRULE(translateShaclRule, element);
      }
      return element;
    });
  },
};

// Map: ShaclDataNode
export const data: AlgebraIndir<'data', Algebra.Operation, [shaclDataNode]> = {
  name: 'data',
  fun: ({ SUBRULE }) => (C, dataNode) => SUBRULE(origTranslateBgp, dataNode.triples),
};

// Map: ShaclRuleNode (AST) --> Algebra.Construct (Math)
export const translateShaclRule: AlgebraIndir<'translateShaclRule', Algebra.Operation, [ShaclRuleNode]> = {
  name: 'translateShaclRule',
  fun: ({ SUBRULE }) => (C, ruleAst) => {
    // We use translateGraphPattern because the body CAN contain property paths, filters, etc.
    const patternAlgebra = SUBRULE(origTranslateGraphPattern, ruleAst.body);
    // B. Translate the RULE template (head) into a strict Pattern[]
    const flattenedTriples: any[] = [];

    // 1. Flatten the AST triples
    SUBRULE(origTranslateBasicGraphPattern, ruleAst.head.triples, flattenedTriples);

    // 2. Translate each flat AST triple into an Algebra.Pattern
    const templatePatterns = flattenedTriples.map(triple =>
      SUBRULE(origTranslateQuad, triple));

    // C. Return a standard SPARQL Construct Algebra object!
    return {
      type: Types.CONSTRUCT,
      input: patternAlgebra,
      template: templatePatterns,
    };
  },
};
