import { sparql12ParserBuilder } from '@traqula/parser-sparql-1-2';
import type * as T11 from '@traqula/rules-sparql-1-1';
import type * as T12 from '@traqula/rules-sparql-1-2';
import * as ST from '../shaclTokens.js';
import type {
  RuleOrDataBlockType,
  Prologue1Type,
  ContextDefinitionImport,

} from '../shaclTypes.js';
import { shaclRuleBlock, shaclDataBlock } from './blocks.js';

const originalIri = sparql12ParserBuilder.getRule('iri');
const originalBaseDecl = sparql12ParserBuilder.getRule('baseDecl');
const originalPrefixDecl = sparql12ParserBuilder.getRule('prefixDecl');
const originalVersionDecl = sparql12ParserBuilder.getRule('versionDecl');

// [1] RuleSet ::= RuleOrDataBlock
export const shaclRuleSet: T11.SparqlGrammarRule<'shaclRuleSet', RuleOrDataBlockType> = {
  name: 'shaclRuleSet',
  impl: ({ SUBRULE, ACTION }) => () => {
    const content = SUBRULE(shaclRuleOrDataBlock);
    return ACTION(() => (content));
  },
};

// [2] RuleOrDataBlock ::= Prologue ( ( Rule | Data )+ ( Prologue1 ( Rule | Data )? )* )?
export const shaclRuleOrDataBlock: T11.SparqlGrammarRule<'shaclRuleOrDataBlock', RuleOrDataBlockType> = {
  name: 'shaclRuleOrDataBlock',
  impl: ({ ACTION, SUBRULE, SUBRULE2, OPTION, OPTION2, AT_LEAST_ONE, MANY, OR, OR2 }) => (C) => {
    const initialPrologue = SUBRULE(shaclPrologue);
    const elements: any[] = [];

    OPTION(() => {
      AT_LEAST_ONE(() => {
        const item = OR([
          // Placeholders
          { ALT: () => SUBRULE(shaclRuleBlock) },
          { ALT: () => SUBRULE(shaclDataBlock) },
        ]);
        ACTION(() => elements.push(item));
      });

      // ( Prologue1 ( Rule | Data )? )*
      MANY(() => {
        const decl = SUBRULE(prologue1);
        ACTION(() => elements.push(decl));

        // Optional Rule/Data after the declaration
        OPTION2(() => {
          const nextBlock = OR2([
            { ALT: () => SUBRULE2(shaclRuleBlock) },
            { ALT: () => SUBRULE2(shaclDataBlock) },
          ]);
          ACTION(() => elements.push(nextBlock));
        });
      });
    });

    return ACTION(() => (
      {
        type: 'RuleOrDataBlock',
        initialPrologue,
        elements,
        // TODO
        loc: C.astFactory.sourceLocation(undefined),
      }));
  },
};

// [3] Prologue ::= Prologue1*
export const shaclPrologue: T11.SparqlGrammarRule<'shaclPrologue', Prologue1Type[]> = {
  name: 'shaclPrologue',
  impl: ({ MANY, SUBRULE, ACTION }) => () => {
    const decls: Prologue1Type[] = [];
    MANY(() => {
      decls.push(SUBRULE(prologue1));
    });
    return ACTION(() => decls);
  },
};

// [4] Prologue1 ::= BaseDecl | PrefixDecl | VersionDecl | ImportsDecl
export const prologue1: T11.SparqlGrammarRule<'prologue1', Prologue1Type> = {
  name: 'prologue1',
  impl: ({ OR, SUBRULE }) => () => OR <Prologue1Type>([
    { ALT: () => SUBRULE(originalBaseDecl) },
    { ALT: () => SUBRULE(originalPrefixDecl) },
    { ALT: () => SUBRULE(originalVersionDecl) },
    { ALT: () => SUBRULE(importsDecl) },
  ]),
};

// [9] ImportsDecl ::= 'IMPORTS' IRIREF

export const importsDecl: T12.SparqlGrammarRule<'importsDecl', ContextDefinitionImport> = {
  name: 'importsDecl',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const token = CONSUME(ST.ImportsKeyword);
    const iri = SUBRULE(originalIri);
    return ACTION(() => ({
      type: 'contextDef',
      subType: 'import',
      import: iri,
      loc: C.astFactory.sourceLocation(token, iri),
    }));
  },
};
