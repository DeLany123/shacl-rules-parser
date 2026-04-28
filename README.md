# SHACL Rules 1.2 Parser

A [Traqula](https://github.com/comunica/traqula)-based parser for the [SHACL-RULE](https://www.w3.org/TR/shacl/#rules) syntax extended for RDF 1.2.

## Features

- Parses SHACL rule sets expressed in a SPARQL-like syntax (`RULE`/`DATA`/`IF-THEN` blocks)
- Supports `IMPORTS` declarations and standard `PREFIX`/`BASE` declarations
- Translates the resulting AST to a SPARQL algebra representation via `toShaclAlgebra`
- Built on top of the [Traqula](https://github.com/comunica/traqula) SPARQL 1.2 parser

## Installation

```bash
npm install @landmaes/shacl-rule-1-2-parser
```

## Usage

### Parsing a SHACL rule set

```typescript
import { AstFactory, completeParseContext } from '@traqula/rules-sparql-1-2';
import { ShaclParser } from '@landmaes/shacl-rule-1-2-parser';

const parser = new ShaclParser();
const context = completeParseContext({ astFactory: new AstFactory() });

const ast = parser.parse(`
  PREFIX : <http://example/>

  RULE { ?x :adult true . }
  WHERE { ?x :age ?a . FILTER (?a >= 18) }
`, context);
```

### Converting to SPARQL algebra

```typescript
import { toShaclAlgebra } from '@landmaes/shacl-rule-1-2-parser';

const algebra = toShaclAlgebra(ast);
```

### Rule syntax

Three rule syntaxes are supported:

**`RULE ... WHERE ...`** — standard SHACL rule:
```sparql
PREFIX : <http://example/>
RULE { ?x :adult true . }
WHERE { ?x :age ?a . FILTER (?a >= 18) }
```

**`IF ... THEN ...`** — alternative SHACL rule syntax:
```sparql
PREFIX : <http://example/>
IF   { ?x :age ?a . FILTER (?a >= 18) }
THEN { ?x :adult true . }
```

**`DATA { ... }`** — inline data block:
```sparql
PREFIX : <http://example/>
DATA { :x :p 1 . }
```

### IMPORTS declaration

```sparql
IMPORTS <http://example/ontology>
PREFIX : <http://example/>
RULE { ?x :adult true . }
WHERE { ?x :age ?a . FILTER (?a >= 18) }
```

### Low-level parser access

For direct access without rich error messages, a pre-built `rawParser` is also exported:

```typescript
import { rawParser } from '@landmaes/shacl-rule-1-2-parser';
```

## API

### `ShaclParser`

A stateful parser class that provides rich, source-aware error messages.

| Method                  | Description                                      |
|-------------------------|--------------------------------------------------|
| `parse(input, context)` | Parse a SHACL rule set string and return the AST |

### `rawParser`

A pre-built parser instance with simple error messages (no source context).

### `toShaclAlgebra(ast)`

Translate a parsed `RuleOrDataBlockType` AST to an array of SPARQL algebra objects.

### `shaclParserBuilder`

The underlying [Traqula `ParserBuilder`](https://github.com/comunica/traqula) instance, for users who want to extend or customise the parser further.

## License

[MIT](https://opensource.org/license/MIT) — written by Lander Maes.
