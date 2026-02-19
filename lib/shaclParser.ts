import { ParserBuilder } from '@traqula/core';
import { sparql12ParserBuilder } from '@traqula/parser-sparql-1-2';
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

// Create the builder
export const shaclParserBuilder: ParserBuilder<SparqlContext, any, any> = sparql12ParserBuilder
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
// Build the Parser
export const shaclParser = shaclParserBuilder.build({
  tokenVocabulary: shaclTokens,
  lexerConfig: {
    positionTracking: 'full',
    skipValidations: false
  }
});