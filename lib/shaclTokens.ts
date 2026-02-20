import { LexerBuilder, createToken } from '@traqula/core';
import { gram, lex as l } from '@traqula/rules-sparql-1-2';
// import { lex as l1 } from '@traqula/rules-sparql-1-1';

export const ImportsKeyword = createToken({ name : "ImportsKeyword", pattern: /IMPORTS/i });
export const RuleKeyword = createToken({ name : "RuleKeyword", pattern: /RULE/i });
export const DataKeyword = createToken({ name : "DataKeyword", pattern: /DATA/i });

export const TransitiveKeyword= createToken({ name: "TransitiveKeyword",pattern: /TRANSITIVE/i });
export const SymmetricKeyword = createToken({ name: "SymmetricKeyword", pattern: /SYMMETRIC/i });
export const InverseKeyword   = createToken({ name: "InverseKeyword",   pattern: /INVERSE/i });

export const NotKeyword = createToken({ name: "NotKeyword", pattern: /NOT/i });

export const shaclTokens = [
    ImportsKeyword,
    RuleKeyword,
    TransitiveKeyword,
    SymmetricKeyword,
    InverseKeyword,
    ...l.sparql12LexerBuilder.tokenVocabulary,
    DataKeyword,
    NotKeyword,

];

/*
export const shaclTokens = [
    ImportsKeyword,
    RuleKeyword,
    ... LexerBuilder.create(l.sparql12LexerBuilder)
        .add(ImportsKeyword, RuleKeyword)
        .addBefore(l1., DataKeyword).tokenVocabulary,
    DataKeyword,
]
*/ 