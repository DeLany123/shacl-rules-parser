import type { IRecognitionException } from '@traqula/chevrotain';
import { ParserBuilder } from '@traqula/core';
import { sparql12ParserBuilder } from '@traqula/parser-sparql-1-2';
import * as TR11 from '@traqula/rules-sparql-1-1';
import * as TR12 from '@traqula/rules-sparql-1-2';
import type { SparqlContext } from '@traqula/rules-sparql-1-2';
import { formatShaclError } from './errorHelper.js';
import {
  shaclDataBlock,
  shaclDeclarationBlock,
  shaclHeadTemplate,
  shaclRule1,
  shaclRule2,
  shaclRuleBlock,
  triplesTemplateBlock,
} from './grammar/blocks.js';
import { bodyBasic, bodyPattern, bodyPattern1, negation } from './grammar/patterns.js';
import { importsDecl, prologue1, shaclPrologue, shaclRuleOrDataBlock, shaclRuleSet } from './grammar/prologue.js';
import { shaclTokens } from './shaclTokens.js';
import type { RuleOrDataBlockType } from './shaclTypes.js';

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
  .addRule(shaclRule2)
  .addRule(bodyPattern)
  .addRule(bodyPattern1)
  .addRule(shaclHeadTemplate)
  .addRule(negation)
  .addRule(bodyBasic)
  .addRule(triplesTemplateBlock)
  .addRule(shaclDeclarationBlock);

export type ShaclParserType = ReturnType<typeof shaclParserBuilder.build>;

function buildParserInstance(errorHandler: (errors: IRecognitionException[]) => void): ShaclParserType {
  return shaclParserBuilder.build({
    tokenVocabulary: shaclTokens,
    parserConfig: { skipValidations: false },
    lexerConfig: {
      positionTracking: 'full',
      skipValidations: false,
      ensureOptimizations: true,
    },
    errorHandler,
  });
}

export class ShaclParser {
  private readonly parser: ShaclParserType;
  private input = '';

  public constructor() {
    this.parser = buildParserInstance((errors) => {
      throw new Error(formatShaclError(this.input, errors));
    });
  }

  public parse(input: string, context: SparqlContext): RuleOrDataBlockType {
    this.input = input;
    return this.parser.shaclRuleSet(input, context);
  }
}
