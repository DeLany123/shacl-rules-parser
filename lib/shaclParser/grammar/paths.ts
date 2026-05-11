import * as T11 from '@traqula/rules-sparql-1-1';
import type * as T12 from '@traqula/rules-sparql-1-2';

/**
 * SHACL Rules [48] Path ::= PathSequence
 *
 * Replaces SPARQL 1.2 path (which maps to PathAlternative) so that '|'
 * alternation is not permitted.
 */
export const shaclPath: T12.SparqlGrammarRule<'path', T12.Path> = {
  name: 'path',
  impl: ({ SUBRULE }) => () => SUBRULE(T11.gram.pathSequence),
};

/**
 * SHACL Rules [51] PathElt ::= PathPrimary
 *
 * Removes the optional PathMod so that '?', '*', '+' are not permitted.
 */
export const shaclPathElt: T12.SparqlGrammarRule<'pathElt', T12.Path> = {
  name: 'pathElt',
  impl: ({ SUBRULE }) => () => SUBRULE(T11.gram.pathPrimary),
};

/**
 * SHACL Rules [52] PathPrimary ::= iri | 'a' | '(' Path ')'
 *
 * Removes the '!' / PathNegatedPropertySet alternative.
 */
export const shaclPathPrimary: T12.SparqlGrammarRule<'pathPrimary', T12.Path> = {
  name: 'pathPrimary',
  impl: ({ SUBRULE, CONSUME, OR }) => () => OR([
    { ALT: () => SUBRULE(T11.gram.iri) },
    { ALT: () => SUBRULE(T11.gram.verbA) },
    { ALT: () => {
      CONSUME(T11.lex.symbols.LParen);
      const result = SUBRULE(T11.gram.path);
      CONSUME(T11.lex.symbols.RParen);
      return result;
    } },
  ]),
};
