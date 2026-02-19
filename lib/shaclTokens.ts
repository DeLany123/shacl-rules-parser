import { createToken } from '@traqula/core';
import { gram, lex as l } from '@traqula/rules-sparql-1-1';

export const VersionKeyword = createToken({ name : "VersionKeyword", pattern: /VERSION/i });
export const ImportsKeyword = createToken({ name : "ImportsKeyword", pattern: /IMPORTS/i });
export const RuleKeyword = createToken({ name : "RuleKeyword", pattern: /RULE/i });
export const DataKeyword = createToken({ name : "DataKeyword", pattern: /DATA/i });

export const TransitiveKeyword= createToken({ name: "TransitiveKeyword",pattern: /TRANSITIVE/i });
export const SymmetricKeyword = createToken({ name: "SymmetricKeyword", pattern: /SYMMETRIC/i });
export const InverseKeyword   = createToken({ name: "InverseKeyword",   pattern: /INVERSE/i });

export const NotKeyword = createToken({ name: "NotKeyword", pattern: /NOT/i });

export const shaclTokens = [
    VersionKeyword,
    ImportsKeyword,
    RuleKeyword,
    TransitiveKeyword,
    SymmetricKeyword,
    InverseKeyword,
    ...l.sparql11LexerBuilder.tokenVocabulary,
    DataKeyword,
    NotKeyword,

];

/*
export const shaclTokens = [
    VersionKeyword,
    ImportsKeyword,
    RuleKeyword,
    ... LexerBuilder.create(l.sparql11LexerBuilder)
        .add(VersionKeyword, ImportsKeyword, RuleKeyword)
        .addBefore(l.insertDataClause, DataKeyword).tokenVocabulary,
    DataKeyword,
]
*/