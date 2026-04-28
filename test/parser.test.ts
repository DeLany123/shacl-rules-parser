import { AstFactory, completeParseContext } from '@traqula/rules-sparql-1-2';
import type { SparqlContext } from '@traqula/rules-sparql-1-2';
import { describe, expect, it } from 'vitest';
import { ShaclParser, toShaclAlgebra } from '../lib/index.js';

const parser = new ShaclParser();

function parseContext(): SparqlContext {
  return completeParseContext({ astFactory: new AstFactory() });
}

describe('shaclParser', () => {
  it('parses a basic SHACL rule', () => {
    const result = parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :adult true . } WHERE { ?x :age ?a . FILTER (?a >= 18) }`,
      parseContext(),
    );
    expect(result.type).toBe('RuleOrDataBlock');
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('shaclRule');
  });

  it('parses a SHACL data block', () => {
    const result = parser.parse(
      `PREFIX : <http://example/>
       DATA { :x :p 1 . }`,
      parseContext(),
    );
    expect(result.type).toBe('RuleOrDataBlock');
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('shaclData');
  });

  it('parses an IF-THEN rule', () => {
    const result = parser.parse(
      `PREFIX : <http://example/>
       IF { ?x :age ?a . FILTER (?a >= 18) } THEN { ?x :adult true . }`,
      parseContext(),
    );
    expect(result.type).toBe('RuleOrDataBlock');
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('shaclRule');
  });

  it('parses an IMPORTS declaration', () => {
    const result = parser.parse(
      `IMPORTS <http://example/ontology>
       PREFIX : <http://example/>
       RULE { ?x :adult true . } WHERE { ?x :age ?a . FILTER (?a >= 18) }`,
      parseContext(),
    );
    expect(result.type).toBe('RuleOrDataBlock');
    expect(result.initialPrologue.some(p => p.subType === 'import')).toBe(true);
  });
});

describe('toShaclAlgebra', () => {
  it('translates a parsed SHACL rule set to algebra', () => {
    const ast = parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :adult true . } WHERE { ?x :age ?a . FILTER (?a >= 18) }`,
      parseContext(),
    );
    const algebra = toShaclAlgebra(ast);
    expect(algebra).toBeInstanceOf(Array);
    expect(algebra).toHaveLength(1);
    expect(algebra[0].type).toBe('shaclRule');
  });
});
