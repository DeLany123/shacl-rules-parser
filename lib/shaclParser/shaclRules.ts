import { ParserRule } from '@traqula/core';
import { sparql12ParserBuilder } from '@traqula/parser-sparql-1-2';
import * as ST from './shaclTokens.js';
import { SparqlGrammarRule, SparqlRule, TermIri } from '@traqula/rules-sparql-1-1';
import { Node } from '@traqula/core';
import * as T11 from '@traqula/rules-sparql-1-1';
import type * as T12 from '@traqula/rules-sparql-1-2';


// Reuse sparql rules
const originalVersionDecl = sparql12ParserBuilder.getRule('versionDecl');
const originalBaseDecl = sparql12ParserBuilder.getRule('baseDecl');
const originalPrefixDecl = sparql12ParserBuilder.getRule('prefixDecl');
const originalIri = sparql12ParserBuilder.getRule('iri');
const originalTriplesBlock = sparql12ParserBuilder.getRule('triplesBlock');
const originalFilter = sparql12ParserBuilder.getRule('filter');
const originalBind = sparql12ParserBuilder.getRule('bind');

// [1] RuleSet ::= RuleOrDataBlock
export const shaclRuleSet: ParserRule<any, 'shaclRuleSet', any> = {
  name: 'shaclRuleSet',
  impl: ({ SUBRULE, ACTION }) => (context) => {
    const content = SUBRULE(shaclRuleOrDataBlock);
    return ACTION(() => ({ type: 'RuleSet', content }));
  }
};

// [2] RuleOrDataBlock ::= Prologue ( ( Rule | Data )+ ( Prologue1 ( Rule | Data )? )* )?
export const shaclRuleOrDataBlock: SparqlGrammarRule<'shaclRuleOrDataBlock', any> = {
  name: 'shaclRuleOrDataBlock',
  impl: ({ACTION, SUBRULE, SUBRULE2, SUBRULE3, SUBRULE4, SUBRULE5, CONSUME, OPTION, OPTION2, AT_LEAST_ONE, MANY, OR, OR2 }) => (context) => {
    const initialPrologue = SUBRULE(shaclPrologue); 
    const elements: any[] = [];

    OPTION(() => {
      AT_LEAST_ONE(() => {
        const item = OR([
           // Placeholders
           { ALT: () => SUBRULE(shaclRuleBlock) },
           { ALT: () => SUBRULE2(shaclDataBlock) }
        ]);
        ACTION(() => elements.push(item));
      });

      // ( Prologue1 ( Rule | Data )? )*
      MANY(() => {
        const decl = SUBRULE3(prologue1);
        elements.push(decl);

        // Optional Rule/Data after the declarati on
        OPTION2(() => {
           OR2([
             { ALT: () => SUBRULE4(shaclRuleBlock) },
             { ALT: () => SUBRULE5(shaclDataBlock) }
           ]);
        });
      });
    });

    return ACTION(() => ({ type: 'RuleOrDataBlock', initialPrologue, elements }));
  }
};

// [3] Prologue ::= Prologue1*
export const shaclPrologue: SparqlGrammarRule<'shaclPrologue', Prologue1Type[]> = {
  name: 'shaclPrologue',
  impl: ({ MANY, SUBRULE, ACTION }) => (C) => {
    const decls: Prologue1Type[] = [];
    MANY(() => {
      decls.push(SUBRULE(prologue1));
    });
    return ACTION(() => decls);
  }
}

type Prologue1Type = T12.ContextDefinition | ContextDefinitionImport;

// [4] Prologue1 ::= BaseDecl | PrefixDecl | VersionDecl | ImportsDecl
export const prologue1: SparqlGrammarRule<'prologue1', Prologue1Type> = {
  name: 'prologue1',
  impl: ({ OR, SUBRULE, ACTION }) => (C) => {
    return OR <Prologue1Type>([
      { ALT: () => SUBRULE(originalBaseDecl) },   // [5] Reuse SPARQL
      { ALT: () => SUBRULE(originalPrefixDecl) }, // [6] Reuse SPARQL
      { ALT: () => SUBRULE(originalVersionDecl) },// [7] Reuse SPARQL
      { ALT: () => SUBRULE(importsDecl) }         // [9] New
    ]);
  }
};

/*
GPT stelt dit voor
return OR<Prologue1Type>([
      { ALT: () => SUBRULE(C.parser.baseDecl) },   
      { ALT: () => SUBRULE(C.parser.prefixDecl) }, 
      { ALT: () => SUBRULE(C.parser.versionDecl) },
      { ALT: () => SUBRULE(importsDecl) }         
    ]);
*/

// [9] ImportsDecl ::= 'IMPORTS' IRIREF

type ContextDefinitionImport = Node & {
  type: 'contextDef';
  subType: 'import';
  import: TermIri;
}

export const importsDecl: SparqlGrammarRule<'importsDecl', ContextDefinitionImport> = {
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
  }
};

// [14] DATA ::= 'DATA' TriplesTemplateBlock

type shaclDataNode = Node & {
  type: 'shaclData';
  token: string; // Proposal of gpt, but not sure if useful
  triples: T12.PatternBgp;
}

export const shaclDataBlock: SparqlGrammarRule<'shaclDataBlock', shaclDataNode> = {
  name: 'shaclDataBlock',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const token = CONSUME(ST.DataKeyword); // What to do with this?
    const triplesBlock = SUBRULE(triplesTemplateBlock);
    return ACTION(() => ({
      type: 'shaclData',
      token: token.image,
      triples: triplesBlock.triples,
      loc: C.astFactory.sourceLocation(token, triplesBlock)
    }));
  }
};

// [10] Rule ::= Rule1 | Rule2 | Declaration

type ShaclRuleBlockResult = shaclDataNode | ShaclDeclarationNode | ShaclRuleNode;

export const shaclRuleBlock: SparqlGrammarRule<'shaclRuleBlock', ShaclRuleBlockResult> = {
    name: 'shaclRuleBlock',
    impl: ({ CONSUME, SUBRULE, SUBRULE2, ACTION, OR }) => (C) => {
      return OR<ShaclRuleBlockResult>([
        { ALT: () => SUBRULE(shaclRule1) },
        // { ALT: () => SUBRULE(rule2) }, // TODO
        { ALT: () => SUBRULE2(shaclDeclarationBlock) }
      ]);
    }
};


// [11] Rule1 ::= 'RULE' HeadTemplate 'WHERE' BodyPattern

type ShaclRuleNode = Node & {
  type: 'shaclRule';
  head: T12.PatternBgp; // Reuse the same structure as the BGP in SPARQL
  body: T12.PatternGroup; // Reuse the same structure as the WHERE clause in SPARQL
}


export const shaclRule1: SparqlGrammarRule<'rule1', ShaclRuleNode> = {
  name: 'rule1',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const start = CONSUME(ST.RuleKeyword);
    const head = SUBRULE(triplesTemplateBlock);
    CONSUME(T11.lex.where);
    const body = SUBRULE(bodyPattern);

    return ACTION(() => ({
      type: 'shaclRule',
      head: head.triples,
      body: {
        type: 'pattern',
        subType: 'group',
        patterns: body.patterns,
        loc: body.loc
      },
      loc: C.astFactory.sourceLocation(start, body)
    }));
  }
};

// [16] BodyPattern ::= '{' BodyPattern1 '}'

type ShaclBodyNode = Node & {
  type: 'shaclBody';
  patterns: T12.Pattern[];
}

export const bodyPattern: SparqlGrammarRule<'bodyPattern', ShaclBodyNode> = {
  name: 'bodyPattern',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const start = CONSUME(T11.lex.symbols.LCurly);
    const patterns = SUBRULE(bodyPattern1);
    const end = CONSUME(T11.lex.symbols.RCurly);
    return ACTION(() => ({
      type: 'shaclBody',
      patterns,
      loc: C.astFactory.sourceLocation(start, end)
    }));
  }
};

// [17] BodyPattern1 ::= BodyTriplesBlock? ( BodyNotTriples BodyTriplesBlock? )*
export const bodyPattern1: SparqlGrammarRule<'bodyPattern1', T12.Pattern[]> = {
  name: 'bodyPattern1',
  impl: ({ OPTION, OPTION2, MANY, SUBRULE, SUBRULE2, SUBRULE3, SUBRULE4, SUBRULE5, OR, ACTION }) => (C) => {
    const elements: T12.Pattern[] = [];

    // First occurrence of triplesBlock
    OPTION(() => {
      const triples = SUBRULE(originalTriplesBlock);
      ACTION(() => elements.push(triples));
    });

    MANY(() => {
      // [18] BodyNotTriples: ENFORCE SHACL STRICTNESS
      const nonTriple = OR <T12.Pattern>([
        { ALT: () => SUBRULE2(originalFilter) },
        { ALT: () => SUBRULE3(negation) },
        { ALT: () => SUBRULE4(originalBind) }
      ]);
      ACTION(() => elements.push(nonTriple));
      
      // Second occurrence of triplesBlock - use SUBRULE5
      OPTION2(() => {
        const triples = SUBRULE5(originalTriplesBlock);
        ACTION(() => elements.push(triples));
      });
    });

    return ACTION(() => elements);
  }
};

// [13] Declaration

export type ShaclDeclarationNode = Node & {
  type: 'shaclDeclaration';
  declarationType: 'transitive' | 'symmetric' | 'inverse';
  args: T12.TermIri[]; // List of IRIs involved
};

// We define a small internal interface for the intermediate object
interface InternalDecl {
    token: any; // IToken
    args: T12.TermIri[];
}

export const shaclDeclarationBlock: SparqlGrammarRule<'declaration', ShaclDeclarationNode> = {
  name: 'declaration',
  impl: ({ CONSUME, CONSUME2, CONSUME3, CONSUME4, CONSUME5, CONSUME6, SUBRULE, SUBRULE2, SUBRULE3, SUBRULE4, OR, ACTION }) => (C) => {
    
    // The OR block returns the raw data needed to build the node
    const result = OR<InternalDecl>([
      { ALT: () => {
          const t = CONSUME(ST.TransitiveKeyword);
          CONSUME(T11.lex.symbols.LParen);
          const arg = SUBRULE(originalIri);
          CONSUME(T11.lex.symbols.RParen);
          return {token: t, args: [arg] };
      }},
      { ALT: () => {
          const t = CONSUME2(ST.SymmetricKeyword);
          CONSUME2(T11.lex.symbols.LParen);
          const arg = SUBRULE2(originalIri);
          CONSUME3(T11.lex.symbols.RParen);
          return {token: t, args: [arg] };
      }},
      { ALT: () => {
          const t = CONSUME3(ST.InverseKeyword);
          CONSUME4(T11.lex.symbols.LParen);
          const arg1 = SUBRULE3(originalIri);
          CONSUME5(T11.lex.symbols.comma);
          const arg2 = SUBRULE4(originalIri);
          CONSUME6(T11.lex.symbols.RParen);
          return {token: t, args: [arg1, arg2] };
      }}
    ]);

    return ACTION(() => ({
      type: 'shaclDeclaration',
      declarationType: result.token.image.toLowerCase(),
      args: result.args,
      loc: C.astFactory.sourceLocation(result.token, result.token) // Simplified loc
    }));
  }
};

// [15] HeadTemplate ::= TriplesTemplateBlock
// Something like this, is it necessary? Or can we directly use triplesTemplateBlock in 11 for example??

type ShaclHeadTemplate = Node & {
  type: 'shaclHeadTemplate';
  triples: T12.PatternBgp; // Reuse the same structure as the BGP in SPARQL
}

export const shaclHeadTemplate: SparqlGrammarRule<'shaclHeadTemplate', ShaclHeadTemplate> = {
  name: 'shaclHeadTemplate',
  impl: ({ SUBRULE, ACTION }) => (C) => {
    const triplesBlock = SUBRULE(triplesTemplateBlock);
    return ACTION(() => ({
      type: 'shaclHeadTemplate',
      triples: triplesBlock.triples, // Unwrap to get the raw PatternBgp
      loc: C.astFactory.sourceLocation(triplesBlock)
    }));
  }
};

// [20] Negation ::= 'NOT' '{' BodyBasic '}'

export const negation: SparqlGrammarRule<'negation', T12.PatternMinus> = {
  name: 'negation',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const startToken = CONSUME(ST.NotKeyword);
    CONSUME(T11.lex.symbols.LCurly);
    
    // [21] Parse the inner basic body
    const innerPatterns = SUBRULE(bodyBasic);
    
    const endToken = CONSUME(T11.lex.symbols.RCurly);

    return ACTION(() => ({
      type: 'pattern',
      subType: 'minus',
      patterns: innerPatterns,
      loc: C.astFactory.sourceLocation(startToken, endToken)
    }));
  }
};

// [21] BodyBasic ::= BodyTriplesBlock? ( Filter BodyTriplesBlock? )*
// [19] BodyTriplesBlock ::= TriplesBlock
export const bodyBasic: SparqlGrammarRule<'bodyBasic', T12.Pattern[]> = {
  name: 'bodyBasic',
  impl: ({ OPTION, OPTION2, MANY, SUBRULE, SUBRULE2, SUBRULE3, ACTION }) => (C) => {
    const elements: T12.Pattern[] = [];

    // 1. Optional Triples (first occurrence)
    OPTION(() => {
      const triples = SUBRULE(originalTriplesBlock);
      ACTION(() => elements.push(triples));
    });

    // 2. Loop: ( Filter Triples? )*
    MANY(() => {
      const filter = SUBRULE2(originalFilter);
      ACTION(() => elements.push(filter));
      
      // Second occurrence of triplesBlock - use SUBRULE3
      OPTION2(() => {
        const triples = SUBRULE3(originalTriplesBlock);
        ACTION(() => elements.push(triples));
      });
    });

    return ACTION(() => elements);
  }
};

// [22] TriplesTemplateBlock ::= '{' TriplesTemplate? '}'
// Looked at the original GraphQuads rule for this in rules-sparql-1-1
type TriplesTemplateBlock = Node & {
  type: 'TriplesTemplateBlock'; // Better name?
  triples: T12.PatternBgp; // Reuse these
}

export const triplesTemplateBlock: SparqlGrammarRule<'triplesTemplateBlock', TriplesTemplateBlock> = {
  name: 'triplesTemplateBlock',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const startToken = CONSUME(T11.lex.symbols.LCurly);
    const triples = SUBRULE(originalTriplesTemplate);
    const endToken = CONSUME(T11.lex.symbols.RCurly);
    return ACTION(() => ({
      type: 'TriplesTemplateBlock',
      triples,
      loc: C.astFactory.sourceLocation(startToken, endToken)
    }));
  }
}

// [23] TriplesTemplate ::= TriplesSameSubject ( '.' TriplesTemplate? )?
// This is the same one as the sparql rule. So can reuse from Traqula
const originalTriplesTemplate = sparql12ParserBuilder.getRule(T11.gram.triplesTemplate.name);
