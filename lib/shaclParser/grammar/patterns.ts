import { sparql12ParserBuilder } from '@traqula/parser-sparql-1-2';
import * as T11 from '@traqula/rules-sparql-1-1';
import type * as T12 from '@traqula/rules-sparql-1-2';
import * as ST from '../shaclTokens.js';
import type {
  ShaclBodyNode,
} from '../shaclTypes.js';

const originalTriplesBlock = sparql12ParserBuilder.getRule('triplesBlock');
const originalFilter = sparql12ParserBuilder.getRule('filter');
const originalBind = sparql12ParserBuilder.getRule('bind');

// [16] BodyPattern ::= '{' BodyPattern1 '}'

export const bodyPattern: T12.SparqlGrammarRule<'bodyPattern', ShaclBodyNode> = {
  name: 'bodyPattern',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const start = CONSUME(T11.lex.symbols.LCurly);
    const patterns: T12.Pattern[] = SUBRULE(bodyPattern1);
    const end = CONSUME(T11.lex.symbols.RCurly);
    return ACTION(() => ({
      type: 'shaclBody',
      patterns,
      loc: C.astFactory.sourceLocation(start, end),
    }));
  },
};

// [17] BodyPattern1 ::= BodyTriplesBlock? ( BodyNotTriples BodyTriplesBlock? )*
export const bodyPattern1: T12.SparqlGrammarRule<'bodyPattern1', T12.Pattern[]> = {
  name: 'bodyPattern1',
  impl: ({ OPTION, OPTION2, MANY, SUBRULE, SUBRULE2, SUBRULE3, SUBRULE4, SUBRULE5, OR, ACTION }) => () => {
    const elements: T12.Pattern[] = [];

    // First occurrence of triplesBlock
    OPTION(() => {
      const triples = SUBRULE(originalTriplesBlock);
      ACTION(() => elements.push(triples));
    });

    MANY(() => {
      // [18] BodyNotTriples ::= Filter | Negation | Assignment
      const nonTriple = OR <T12.Pattern>([
        { ALT: () => SUBRULE2(originalFilter) },
        { ALT: () => SUBRULE3(negation) },
        { ALT: () => SUBRULE4(originalBind) },
      ]);
      ACTION(() => elements.push(nonTriple));

      // Second occurrence of triplesBlock - use SUBRULE5
      OPTION2(() => {
        const triples = SUBRULE5(originalTriplesBlock);
        ACTION(() => elements.push(triples));
      });
    });

    return ACTION(() => elements);
  },
};

// [20] Negation ::= 'NOT' '{' BodyBasic '}'

export const negation: T12.SparqlGrammarRule<'negation', T12.PatternMinus> = {
  name: 'negation',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const startToken = CONSUME(ST.NotKeyword);
    CONSUME(T11.lex.symbols.LCurly);

    // [21] Parse the inner basic body
    const innerPatterns = SUBRULE(bodyBasic);

    const endToken = CONSUME(T11.lex.symbols.RCurly);

    return ACTION(() => ({
      type: 'pattern',
      subType: 'minus',
      patterns: innerPatterns,
      loc: C.astFactory.sourceLocation(startToken, endToken),
    }));
  },
};

// [21] BodyBasic ::= BodyTriplesBlock? ( Filter BodyTriplesBlock? )*
// [19] BodyTriplesBlock ::= TriplesBlock
export const bodyBasic: T12.SparqlGrammarRule<'bodyBasic', T12.Pattern[]> = {
  name: 'bodyBasic',
  impl: ({ OPTION, OPTION2, MANY, SUBRULE, SUBRULE2, SUBRULE3, ACTION }) => () => {
    const elements: T12.Pattern[] = [];

    // 1. Optional Triples (first occurrence)
    OPTION(() => {
      const triples = SUBRULE(originalTriplesBlock);
      ACTION(() => elements.push(triples));
    });

    // 2. Loop: ( Filter Triples? )*
    MANY(() => {
      const filter = SUBRULE2(originalFilter);
      ACTION(() => elements.push(filter));

      // Second occurrence of triplesBlock - use SUBRULE3
      OPTION2(() => {
        const triples = SUBRULE3(originalTriplesBlock);
        ACTION(() => elements.push(triples));
      });
    });

    return ACTION(() => elements);
  },
};
