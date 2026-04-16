// @ts-check
import { LexerBuilder } from '@traqula/core';
import { shaclTokens } from './shaclTokens.js';
import { ShaclParser } from './shaclParser.js';
import { AstFactory } from '@traqula/rules-sparql-1-1';


const lexer = LexerBuilder.create()
    .add(...shaclTokens)
    .build();

// Your complex snippet
const shaclInput = `
PREFIX : <http://example/>

DATA { :x :p 1 ; :q 2 . }

RULE { ?x :bothPositive true . }
WHERE { ?x :p ?v1  FILTER ( ?v1 > 0 )  ?x :q ?v2  FILTER ( ?v2 > 0 )  }
`;

const lexingResult = lexer.tokenize(shaclInput);

const context = { 
    astFactory: new AstFactory() 
};

// const result = shaclParser.shaclRuleSet(shaclInput, new Sparql);