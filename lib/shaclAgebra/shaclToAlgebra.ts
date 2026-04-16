import {toAlgebra12Builder} from '@traqula/algebra-sparql-1-2';
import type {Algebra, AlgebraIndir} from '@traqula/algebra-transformations-1-1';
import {IndirBuilder} from '@traqula/core';
import type {RuleOrDataBlockType, shaclDataNode, ShaclRuleNode} from '../shaclParser/shaclTypes.js';
import {ContextDefinition} from "@traqula/rules-sparql-1-2";
import {ContextConfigs, createAlgebraContext} from "@traqula/algebra-transformations-1-2";

const origTranslateGraphPattern = toAlgebra12Builder.getRule('translateGraphPattern');
const origTranslateBasicGraphPattern = toAlgebra12Builder.getRule('translateBasicGraphPattern');
const origTranslateQuad = toAlgebra12Builder.getRule('translateQuad');
const origTranslateBgp = toAlgebra12Builder.getRule('translateBgp');
const registerContextDefinitions = toAlgebra12Builder.getRule('registerContextDefinitions');

// Starting point
export const shaqlQuery: AlgebraIndir<'shaqlQuery', any, [RuleOrDataBlockType]> = {
  name: 'shaqlQuery',
  fun: ({SUBRULE}) => (C, ast) => {
    // Register prefixes that are at the top
    const initialContextDefs = ast.initialPrologue.filter(p => p.type === 'contextDef');
    SUBRULE(registerContextDefinitions, <ContextDefinition[]>initialContextDefs);
    // STAP 2: Loop over de elementen
    return ast.elements.map((element) => {
      // Als het element een prefix is (interleaved in het document)
      if (element.type === 'contextDef') {
        // Registreer deze prefix direct in de Algebra Context C
        SUBRULE(registerContextDefinitions, [ <ContextDefinition> element ]);
        return element;
      }

      // Als het element data is
      if (element.type === 'shaclData') {
        return SUBRULE(data, element);
      }

      // Als het element een rule is
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

export const data: AlgebraIndir<'data', Algebra.Pattern[], [shaclDataNode]> = {
  name: 'data',
  fun: ({ SUBRULE }) => (C, dataNode) => {
    const bgp = <Algebra.Bgp> SUBRULE(origTranslateBgp, dataNode.triples);
    return bgp.patterns;
  },
};
// export type shaclOperation = Algebra.Operation & ShaclRule;

// Map: ShaclRuleNode (AST) --> Algebra.Construct (Math)
// TODO can maybe reuse construct
// TODO integrationtest for demo
export const translateShaclRule: AlgebraIndir<'translateShaclRule', ShaclRule, [ShaclRuleNode]> = {
  name: 'translateShaclRule',
  fun: ({ SUBRULE }) => (C, ruleAst) => {
    // We use translateGraphPattern because the WHERE template (body) can contain property paths, filters, etc.
    // Translate the RULE template (head) into a strict Pattern[]
    const patternAlgebra = SUBRULE(origTranslateGraphPattern, ruleAst.body);
    const flattenedTriples: any[] = [];

    // 1. Flatten the AST triples
    SUBRULE(origTranslateBasicGraphPattern, ruleAst.head.triples, flattenedTriples);

    // 2. Translate each flat AST triple into an Algebra.Pattern
    const templatePatterns = flattenedTriples.map(triple =>
      // TOOD, gebruikt context hiervoor, deze moet nog opgevuld worden.
      SUBRULE(origTranslateQuad, triple));

    // C. Return a standard SPARQL Construct Algebra object!
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

export function toShaclAlgebra(ast: RuleOrDataBlockType, config: ContextConfigs = {}) {
  const algebraContext = createAlgebraContext(config);
  return algebraTranslatorEngine.shaqlQuery(algebraContext, ast);
}
