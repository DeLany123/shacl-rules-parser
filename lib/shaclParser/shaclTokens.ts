import { createToken } from '@traqula/core';
import { lex as l } from '@traqula/rules-sparql-1-2';

// Import { lex as l1 } from '@traqula/rules-sparql-1-1';

export const ImportsKeyword = createToken({ name: 'ImportsKeyword', pattern: /imports/iu });
export const RuleKeyword = createToken({ name: 'RuleKeyword', pattern: /rule/i });
export const DataKeyword = createToken({ name: 'DataKeyword', pattern: /data/i });

export const TransitiveKeyword = createToken({ name: 'TransitiveKeyword', pattern: /transitive/i });
export const SymmetricKeyword = createToken({ name: 'SymmetricKeyword', pattern: /symmetric/i });
export const InverseKeyword = createToken({ name: 'InverseKeyword', pattern: /inverse/i });

export const NotKeyword = createToken({ name: 'NotKeyword', pattern: /not/i });
export const ThenKeyword = createToken({ name: 'ThenKeyword', pattern: /then/i });

export const shaclTokens = [
  ImportsKeyword,
  RuleKeyword,
  TransitiveKeyword,
  SymmetricKeyword,
  InverseKeyword,
  ...l.sparql12LexerBuilder.tokenVocabulary,
  DataKeyword,
  NotKeyword,
  ThenKeyword,

];

//
// export const shaclTokens = [
//     ImportsKeyword,
//     RuleKeyword,
//     ... LexerBuilder.create(l.sparql12LexerBuilder)
//         .add(ImportsKeyword, RuleKeyword)
//         .addBefore(l1., DataKeyword).tokenVocabulary,
//     DataKeyword,
// ]
//
