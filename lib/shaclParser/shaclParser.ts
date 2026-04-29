import type { IRecognitionException } from '@traqula/chevrotain';
import { ParserBuilder } from '@traqula/core';
import { sparql12ParserBuilder } from '@traqula/parser-sparql-1-2';
import * as TR11 from '@traqula/rules-sparql-1-1';
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
import { shaclBuiltInCall } from './grammar/builtIn.js';
import { shaclPath, shaclPathElt, shaclPathPrimary } from './grammar/paths.js';
import { bodyBasic, bodyPattern, bodyPattern1, negation } from './grammar/patterns.js';
import { importsDecl, prologue1, shaclPrologue, shaclRuleOrDataBlock, shaclRuleSet } from './grammar/prologue.js';
import { shaclTokens } from './shaclTokens.js';
import type { RuleOrDataBlockType } from './shaclTypes.js';

const cleanup12ParserBuilder = ParserBuilder.create(sparql12ParserBuilder)
  // Delete rules that are in shacl Rules
  .deleteRule(TR11.gram.pathMod.name)
  .deleteRule(TR11.gram.pathNegatedPropertySet.name)
  .deleteRule(TR11.gram.pathOneInPropertySet.name)
  .deleteRule(TR11.gram.pathAlternative.name)
  // Delete forbidden built-in functions
  .deleteRule(TR11.gram.builtInBound.name)
  .deleteRule(TR11.gram.builtInRand.name)
  .deleteRule(TR11.gram.builtInMd5.name)
  .deleteRule(TR11.gram.builtInSha1.name)
  .deleteRule(TR11.gram.builtInSha256.name)
  .deleteRule(TR11.gram.builtInSha384.name)
  .deleteRule(TR11.gram.builtInSha512.name)
  .deleteRule(TR11.gram.builtInCoalesce.name)
  .deleteRule(TR11.gram.existsFunc.name)
  .deleteRule(TR11.gram.notExistsFunc.name)
  // Delete aggregate rules (not allowed in SHACL Rules)
  .deleteRule(TR11.gram.aggregate.name)
  .deleteRule(TR11.gram.aggregateCount.name)
  .deleteRule(TR11.gram.aggregateSum.name)
  .deleteRule(TR11.gram.aggregateMin.name)
  .deleteRule(TR11.gram.aggregateMax.name)
  .deleteRule(TR11.gram.aggregateAvg.name)
  .deleteRule(TR11.gram.aggregateSample.name)
  .deleteRule(TR11.gram.aggregateGroup_concat.name)
  // Delete query-form rules (SELECT, CONSTRUCT, DESCRIBE, ASK — not in SHACL Rules)
  .deleteRule(TR11.gram.queryOrUpdate.name)
  .deleteRule(TR11.gram.queryUnit.name)
  .deleteRule(TR11.gram.query.name)
  .deleteRule(TR11.gram.selectQuery.name)
  .deleteRule(TR11.gram.subSelect.name)
  .deleteRule(TR11.gram.selectClause.name)
  .deleteRule(TR11.gram.constructQuery.name)
  .deleteRule(TR11.gram.constructTemplate.name)
  .deleteRule(TR11.gram.constructTriples.name)
  .deleteRule(TR11.gram.describeQuery.name)
  .deleteRule(TR11.gram.askQuery.name)
  .deleteRule(TR11.gram.valuesClause.name)
  // Delete solution modifier rules (ORDER BY, GROUP BY, HAVING, LIMIT, OFFSET)
  .deleteRule(TR11.gram.whereClause.name)
  .deleteRule(TR11.gram.solutionModifier.name)
  .deleteRule(TR11.gram.groupClause.name)
  .deleteRule(TR11.gram.groupCondition.name)
  .deleteRule(TR11.gram.havingClause.name)
  .deleteRule(TR11.gram.havingCondition.name)
  .deleteRule(TR11.gram.orderClause.name)
  .deleteRule(TR11.gram.orderCondition.name)
  .deleteRule(TR11.gram.limitOffsetClauses.name)
  .deleteRule(TR11.gram.limitClause.name)
  .deleteRule(TR11.gram.offsetClause.name)
  // Delete graph-pattern rules (OPTIONAL, UNION, GRAPH, SERVICE, MINUS — not in SHACL Rules)
  .deleteRule(TR11.gram.groupGraphPattern.name)
  .deleteRule(TR11.gram.groupGraphPatternSub.name)
  .deleteRule(TR11.gram.graphPatternNotTriples.name)
  .deleteRule(TR11.gram.optionalGraphPattern.name)
  .deleteRule(TR11.gram.graphGraphPattern.name)
  .deleteRule(TR11.gram.serviceGraphPattern.name)
  .deleteRule(TR11.gram.minusGraphPattern.name)
  .deleteRule(TR11.gram.groupOrUnionGraphPattern.name)
  // Delete inline data / VALUES rules
  .deleteRule(TR11.gram.inlineData.name)
  .deleteRule(TR11.gram.dataBlock.name)
  .deleteRule(TR11.gram.inlineDataOneVar.name)
  .deleteRule(TR11.gram.inlineDataFull.name)
  .deleteRule(TR11.gram.dataBlockValue.name)
  // Delete update rules (SPARQL Update — not in SHACL Rules)
  .deleteRule(TR11.gram.updateUnit.name)
  .deleteRule(TR11.gram.update.name)
  .deleteRule(TR11.gram.update1.name)
  .deleteRule(TR11.gram.load.name)
  .deleteRule(TR11.gram.clear.name)
  .deleteRule(TR11.gram.drop.name)
  .deleteRule(TR11.gram.create.name)
  .deleteRule(TR11.gram.add.name)
  .deleteRule(TR11.gram.move.name)
  .deleteRule(TR11.gram.copy.name)
  .deleteRule(TR11.gram.quadPattern.name)
  .deleteRule(TR11.gram.quadData.name)
  .deleteRule(TR11.gram.insertData.name)
  .deleteRule(TR11.gram.deleteData.name)
  .deleteRule(TR11.gram.deleteWhere.name)
  .deleteRule(TR11.gram.modify.name)
  .deleteRule(TR11.gram.deleteClause.name)
  .deleteRule(TR11.gram.insertClause.name)
  .deleteRule(TR11.gram.graphOrDefault.name)
  .deleteRule(TR11.gram.graphRef.name)
  .deleteRule(TR11.gram.graphRefAll.name)
  .deleteRule(TR11.gram.quads.name)
  .deleteRule(TR11.gram.quadsNotTriples.name)
  // Delete dataset / FROM clause rules (not in SHACL Rules)
  .deleteRule(TR11.gram.datasetClause.name)
  .deleteRule(TR11.gram.defaultGraphClause.name)
  .deleteRule(TR11.gram.namedGraphClause.name)
  .deleteRule(TR11.gram.sourceSelector.name)
  .deleteRule(TR11.gram.usingClause.name)
  .deleteRule(TR11.gram.datasetClauseStar.name)
  .deleteRule(TR11.gram.usingClauseStar.name);

export const shaclParserBuilder = ParserBuilder.create(cleanup12ParserBuilder)
  // .addRuleRedundant(TR12.gram.versionDecl)
  // .addRuleRedundant(TR11.gram.baseDecl)
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
  .addRule(shaclDeclarationBlock)
  .patchRule(shaclPath)
  .patchRule(shaclPathElt)
  .patchRule(shaclPathPrimary)
  .patchRule(shaclBuiltInCall);

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
