import type { Node } from '@traqula/core';
import type * as T12 from '@traqula/rules-sparql-1-2';

export type ContextDefinitionImport = Node & {
  type: 'contextDef';
  subType: 'import';
  import: T12.TermIri;
};

export type Prologue1Type = T12.ContextDefinition | ContextDefinitionImport;

export type ShaclBodyNode = Node & {
  type: 'shaclBody';
  patterns: T12.Pattern[];
};

export type ShaclRuleNode = Node & {
  type: 'shaclRule';
  token: string;
  head: T12.PatternBgp;
  body: T12.PatternGroup;
};

export type ShaclDataNode = Node & {
  type: 'shaclData';
  token: string;
  triples: T12.PatternBgp;
};

export type ShaclDeclarationNode = Node & {
  type: 'shaclDeclaration';
  declarationType: 'transitive' | 'symmetric' | 'inverse';
  args: T12.TermIri[];
};

export type ShaclHeadTemplate = Node & {
  type: 'shaclHeadTemplate';
  triples: T12.PatternBgp;
};

export type TriplesTemplateBlock = Node & {
  type: 'TriplesTemplateBlock';
  triples: T12.PatternBgp;
};

export type ShaclRuleBlockResult = ShaclDataNode | ShaclDeclarationNode | ShaclRuleNode;

export type RuleOrDataBlockType = Node & {
  type: 'RuleOrDataBlock';
  initialPrologue: Prologue1Type[];
  elements: (Prologue1Type | ShaclRuleBlockResult)[];
};
