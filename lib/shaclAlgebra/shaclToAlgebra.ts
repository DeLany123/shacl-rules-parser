import { toAlgebra12Builder } from '@traqula/algebra-sparql-1-2';
import type { Algebra, AlgebraIndir } from '@traqula/algebra-transformations-1-1';
import type { ContextConfigs } from '@traqula/algebra-transformations-1-2';
import { createAlgebraContext } from '@traqula/algebra-transformations-1-2';
import { IndirBuilder } from '@traqula/core';
import type { ContextDefinition } from '@traqula/rules-sparql-1-2';
import type { RuleOrDataBlockType, ShaclDataNode, ShaclRuleNode } from '../shaclParser/shaclTypes.js';

const origTranslateGraphPattern = toAlgebra12Builder.getRule('translateGraphPattern');
const origTranslateBasicGraphPattern = toAlgebra12Builder.getRule('translateBasicGraphPattern');
const origTranslateQuad = toAlgebra12Builder.getRule('translateQuad');
const origTranslateBgp = toAlgebra12Builder.getRule('translateBgp');
const registerContextDefinitions = toAlgebra12Builder.getRule('registerContextDefinitions');

// Starting point
export const shaqlQuery: AlgebraIndir<'shaqlQuery', any, [RuleOrDataBlockType]> = {
  name: 'shaqlQuery',
  fun: ({ SUBRULE }) => (C, ast) => {
    // Register prefixes declared at the top of the document
    const initialContextDefs = ast.initialPrologue.filter((p): p is ContextDefinition => p.type === 'contextDef');
    SUBRULE(registerContextDefinitions, initialContextDefs);

    return ast.elements.map((element) => {
      // Interleaved prefix/base/version declarations
      if (element.type === 'contextDef') {
        SUBRULE(registerContextDefinitions, [ <ContextDefinition> element ]);
        return element;
      }

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

export interface ShaclRule extends Omit<Algebra.Construct, 'type'> {
  type: 'shaclRule';
}

export const data: AlgebraIndir<'data', Algebra.Pattern[], [ShaclDataNode]> = {
  name: 'data',
  fun: ({ SUBRULE }) => (C, dataNode) => {
    const bgp = <Algebra.Bgp> SUBRULE(origTranslateBgp, dataNode.triples);
    return bgp.patterns;
  },
};

// Map: ShaclRuleNode (AST) → ShaclRule (algebra)
export const translateShaclRule: AlgebraIndir<'translateShaclRule', ShaclRule, [ShaclRuleNode]> = {
  name: 'translateShaclRule',
  fun: ({ SUBRULE }) => (C, ruleAst) => {
    // Use translateGraphPattern for the body so property paths, filters, etc. are supported
    const patternAlgebra = SUBRULE(origTranslateGraphPattern, ruleAst.body);
    const flattenedTriples: any[] = [];

    // Flatten the head AST triples, then translate each one into an algebra quad
    SUBRULE(origTranslateBasicGraphPattern, ruleAst.head.triples, flattenedTriples);
    const templatePatterns = flattenedTriples.map(triple => SUBRULE(origTranslateQuad, triple));

    return {
      type: 'shaclRule',
      input: patternAlgebra,
      template: templatePatterns,
    };
  },
};

export const shaclAlgebraBuilder = IndirBuilder
  .create(toAlgebra12Builder)
  .addRule(shaqlQuery)
  .addRule(data)
  .addRule(translateShaclRule);

const algebraTranslatorEngine = shaclAlgebraBuilder.build();

export function toShaclAlgebra(ast: RuleOrDataBlockType, config: ContextConfigs = {}): any {
  const algebraContext = createAlgebraContext(config);
  return algebraTranslatorEngine.shaqlQuery(algebraContext, ast);
}
