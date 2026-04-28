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

describe('path expressions — valid SHACL subsets', () => {
  it('accepts a simple IRI predicate', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result true . } WHERE { ?x :p ?y . }`,
      parseContext(),
    )).not.toThrow();
  });

  it('accepts the "a" keyword as predicate', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :isTyped true . } WHERE { ?x a :C . }`,
      parseContext(),
    )).not.toThrow();
  });

  it('accepts a sequence path ( :a/:b )', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?z . } WHERE { ?x :a/:b ?z . }`,
      parseContext(),
    )).not.toThrow();
  });

  it('accepts an inverse path ( ^:a )', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x ^:a ?y . }`,
      parseContext(),
    )).not.toThrow();
  });

  it('accepts a grouped sequence path ( (:a/:b) )', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?z . } WHERE { ?x (:a/:b) ?z . }`,
      parseContext(),
    )).not.toThrow();
  });
});

describe('path expressions — forbidden SPARQL features (negative tests)', () => {
  it('rejects path alternation ( :a|:b ) in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :a|:b ?y . }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects optional path modifier ( :a? ) in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :a? ?y . }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects zero-or-more path modifier ( :a* ) in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :a* ?y . }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects one-or-more path modifier ( :a+ ) in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :a+ ?y . }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects negated property set ( !:a ) in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x !:a ?y . }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects path alternation inside NOT { } negation block', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result true . } WHERE { ?x :p ?v . NOT { ?x :a|:b ?y . } }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects one-or-more path modifier inside NOT { } negation block', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result true . } WHERE { ?x :p ?v . NOT { ?x :a+ ?y . } }`,
      parseContext(),
    )).toThrow();
  });

   it('rejects IF-THEN rule with path alternation in body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       IF { ?x :a|:b ?y . } THEN { ?x :result ?y . }`,
      parseContext(),
    )).toThrow();
  });
});

describe('forbidden built-in functions (negative tests)', () => {
  it('rejects BOUND() in FILTER', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER(BOUND(?y)) }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects RAND() in FILTER', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER(RAND() > 0.5) }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects MD5() in FILTER', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER(MD5(?y) = "abc") }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects SHA1() in FILTER', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER(SHA1(?y) = "abc") }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects SHA256() in FILTER', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER(SHA256(?y) = "abc") }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects COALESCE() in FILTER', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER(COALESCE(?y, 0) = 0) }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects EXISTS {} in FILTER', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER(EXISTS { ?x :q ?z . }) }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects NOT EXISTS {} in FILTER', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER NOT EXISTS { ?x :q ?z . } }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects COUNT aggregate in FILTER expression', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . FILTER(COUNT(*) > 0) }`,
      parseContext(),
    )).toThrow();
  });
});

describe('forbidden graph patterns (negative tests)', () => {
  it('rejects OPTIONAL { } in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . OPTIONAL { ?x :q ?z . } }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects UNION in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { { ?x :a ?y . } UNION { ?x :b ?y . } }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects MINUS { } in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . MINUS { ?x :q ?z . } }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects VALUES in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { VALUES ?x { :a } ?x :p ?y . }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects SERVICE { } in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { ?x :p ?y . SERVICE <http://example/sparql> { ?x :q ?z . } }`,
      parseContext(),
    )).toThrow();
  });

  it('rejects GRAPH { } in rule body', () => {
    expect(() => parser.parse(
      `PREFIX : <http://example/>
       RULE { ?x :result ?y . } WHERE { GRAPH :g { ?x :p ?y . } }`,
      parseContext(),
    )).toThrow();
  });
});
