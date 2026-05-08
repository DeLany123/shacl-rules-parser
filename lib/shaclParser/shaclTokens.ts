import { createToken } from '@traqula/core';
import { lex as l } from '@traqula/rules-sparql-1-2';

export const ImportsKeyword = createToken({ name: 'ImportsKeyword', pattern: /imports/iu });
export const RuleKeyword = createToken({ name: 'RuleKeyword', pattern: /rule/iu });
export const DataKeyword = createToken({ name: 'DataKeyword', pattern: /data/iu });

export const TransitiveKeyword = createToken({ name: 'TransitiveKeyword', pattern: /transitive/iu });
export const SymmetricKeyword = createToken({ name: 'SymmetricKeyword', pattern: /symmetric/iu });
export const InverseKeyword = createToken({ name: 'InverseKeyword', pattern: /inverse/iu });

export const NotKeyword = createToken({ name: 'NotKeyword', pattern: /not/iu });
export const ThenKeyword = createToken({ name: 'ThenKeyword', pattern: /then/iu });

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
