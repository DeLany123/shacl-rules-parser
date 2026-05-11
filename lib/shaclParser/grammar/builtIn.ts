import * as T11 from '@traqula/rules-sparql-1-1';
import type * as T12 from '@traqula/rules-sparql-1-2';
import * as TR12 from '@traqula/rules-sparql-1-2';

/**
 * SHACL Rules BuiltInCall [91] — restricts SPARQL 1.2 builtInCall.
 *
 * Excluded vs SPARQL 1.2:
 *   BOUND, RAND, MD5, SHA1, SHA256, SHA384, SHA512, COALESCE,
 *   EXISTS, NOT EXISTS, and all aggregate functions.
 */
export const shaclBuiltInCall: T12.SparqlGrammarRule<'builtInCall', T12.Expression> = {
  name: 'builtInCall',
  impl: ({ OR, SUBRULE }) => () => OR([
    // String / datatype inspection
    { ALT: () => SUBRULE(T11.gram.builtInStr) },
    { ALT: () => SUBRULE(T11.gram.builtInLang) },
    { ALT: () => SUBRULE(T11.gram.builtInLangmatches) },
    { ALT: () => SUBRULE(T11.gram.builtInDatatype) },
    { ALT: () => SUBRULE(T11.gram.builtInIri) },
    { ALT: () => SUBRULE(T11.gram.builtInUri) },
    { ALT: () => SUBRULE(T11.gram.builtInBnodeSparqlJs) },
    // Numeric
    { ALT: () => SUBRULE(T11.gram.builtInAbs) },
    { ALT: () => SUBRULE(T11.gram.builtInCeil) },
    { ALT: () => SUBRULE(T11.gram.builtInFloor) },
    { ALT: () => SUBRULE(T11.gram.builtInRound) },
    // String manipulation
    { ALT: () => SUBRULE(T11.gram.builtInConcat) },
    { ALT: () => SUBRULE(T11.gram.substringExpression) },
    { ALT: () => SUBRULE(T11.gram.builtInStrlen) },
    { ALT: () => SUBRULE(T11.gram.strReplaceExpression) },
    { ALT: () => SUBRULE(T11.gram.builtInUcase) },
    { ALT: () => SUBRULE(T11.gram.builtInLcase) },
    { ALT: () => SUBRULE(T11.gram.builtInEncode_for_uri) },
    { ALT: () => SUBRULE(T11.gram.builtInContains) },
    { ALT: () => SUBRULE(T11.gram.builtInStrstarts) },
    { ALT: () => SUBRULE(T11.gram.builtInStrends) },
    { ALT: () => SUBRULE(T11.gram.builtInStrbefore) },
    { ALT: () => SUBRULE(T11.gram.builtInStrafter) },
    // Date / time
    { ALT: () => SUBRULE(T11.gram.builtInYear) },
    { ALT: () => SUBRULE(T11.gram.builtInMonth) },
    { ALT: () => SUBRULE(T11.gram.builtInDay) },
    { ALT: () => SUBRULE(T11.gram.builtInHours) },
    { ALT: () => SUBRULE(T11.gram.builtInMinutes) },
    { ALT: () => SUBRULE(T11.gram.builtInSeconds) },
    { ALT: () => SUBRULE(T11.gram.builtInTimezone) },
    { ALT: () => SUBRULE(T11.gram.builtInTz) },
    { ALT: () => SUBRULE(T11.gram.builtInNow) },
    { ALT: () => SUBRULE(T11.gram.builtInUuid) },
    { ALT: () => SUBRULE(T11.gram.builtInStruuid) },
    // Conditional / value construction
    { ALT: () => SUBRULE(T11.gram.builtInIf) },
    { ALT: () => SUBRULE(T11.gram.builtInStrlang) },
    { ALT: () => SUBRULE(T11.gram.builtInStrdt) },
    // Type testing
    { ALT: () => SUBRULE(T11.gram.builtInSameterm) },
    { ALT: () => SUBRULE(T11.gram.builtInIsiri) },
    { ALT: () => SUBRULE(T11.gram.builtInIsuri) },
    { ALT: () => SUBRULE(T11.gram.builtInIsblank) },
    { ALT: () => SUBRULE(T11.gram.builtInIsliteral) },
    { ALT: () => SUBRULE(T11.gram.builtInIsnumeric) },
    // Pattern matching
    { ALT: () => SUBRULE(T11.gram.regexExpression) },
    // SPARQL 1.2 extensions (all permitted by SHACL Rules)
    { ALT: () => SUBRULE(TR12.gram.buildInLangDir) },
    { ALT: () => SUBRULE(TR12.gram.buildInLangStrDir) },
    { ALT: () => SUBRULE(TR12.gram.buildInHasLang) },
    { ALT: () => SUBRULE(TR12.gram.buildInHasLangDir) },
    { ALT: () => SUBRULE(TR12.gram.buildInIsTriple) },
    { ALT: () => SUBRULE(TR12.gram.buildInTriple) },
    { ALT: () => SUBRULE(TR12.gram.buildInSubject) },
    { ALT: () => SUBRULE(TR12.gram.buildInPredicate) },
    { ALT: () => SUBRULE(TR12.gram.buildInObject) },
  ]),
};
