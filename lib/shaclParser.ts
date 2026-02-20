import { ParserBuilder } from '@traqula/core';
import type { IRecognitionException } from '@traqula/chevrotain';
import { sparql12ParserBuilder, SparqlParser } from '@traqula/parser-sparql-1-2';
import * as TR11 from '@traqula/rules-sparql-1-1';
import * as TR12 from '@traqula/rules-sparql-1-2';
import { shaclTokens } from './shaclTokens.js';
import { 
  shaclRuleSet, 
  shaclRuleOrDataBlock, 
  shaclPrologue, 
  prologue1, 
  importsDecl, 
  shaclDataBlock,
  shaclDeclarationBlock,
  shaclRuleBlock,
  shaclRule1,
  triplesTemplateBlock,
  bodyPattern,
  bodyPattern1,
  shaclHeadTemplate,
  negation,
  bodyBasic
} from './shaclRules.js';
import { SparqlContext } from '@traqula/rules-sparql-1-2';

function defaultErrorHandler(errors: IRecognitionException[]): void {
    const firstError = errors[0];
    const messageBuilder: string[] = [ 'Parse error' ];
    const lineIdx = firstError.token.startLine;
    messageBuilder.push(` at line ${lineIdx}, column ${firstError.token.startColumn}`);
    messageBuilder.push(`\nToken found: '${firstError.token.image}' (type: ${firstError.token.tokenType.name})`);
    messageBuilder.push(`\n${firstError.message}`);
    throw new Error(messageBuilder.join(''));
  }

// Create the builder
export const shaclParserBuilder = ParserBuilder.create(sparql12ParserBuilder)
.addRuleRedundant(TR12.gram.versionDecl)
.addRuleRedundant(TR11.gram.baseDecl)
.addRule(shaclRuleSet)
.addRule(shaclRuleOrDataBlock)
.addRule(shaclPrologue)
.addRule(prologue1)
.addRule(importsDecl)
.addRule(shaclDataBlock)
.addRule(shaclRuleBlock)
.addRule(shaclRule1)
.addRule(bodyPattern)
.addRule(bodyPattern1)
.addRule(shaclHeadTemplate)
.addRule(negation)
.addRule(bodyBasic)
.addRule(triplesTemplateBlock)
.addRule(shaclDeclarationBlock);

type Parser = ReturnType<typeof shaclParserBuilder.build>;

// Build the Parser
export const shaclParser: Parser = shaclParserBuilder.build({
  tokenVocabulary: shaclTokens,
  parserConfig: {
    skipValidations: false,
  },
  lexerConfig: {
    positionTracking: 'full',
    skipValidations: false
  },
  errorHandler: (errors) => defaultErrorHandler(errors)
});