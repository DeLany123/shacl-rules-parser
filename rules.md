# SHACL Rules Grammar Tracker

| Done | Reused | ID | Rule Name | EBNF Definition | Location |
|:----:|:------:| :-- | :--- | :--- | :--- |
| [x]  |  [ ]   | [1] | `RuleSet` | `RuleOrDataBlock` | `prologue.ts` |
| [x]  |  [ ]   | [2] | `RuleOrDataBlock` | `Prologue ( ( Rule \| Data )+ ( Prologue1 ( Rule \| Data )? )* )?` | `prologue.ts` |
| [x]  |  [ ]   | [3] | `Prologue` | `Prologue1*` |
| [x]  |  [ ]   | [4] | `Prologue1` | `BaseDecl \| PrefixDecl \| VersionDecl \| ImportsDecl` |
| [x]  |  [x]   | [5] | `BaseDecl` | `'BASE' IRIREF` |
| [x]  |  [x]   | [6] | `PrefixDecl` | `'PREFIX' PNAME_NS IRIREF` |
| [x]  |  [x]   | [7] | `VersionDecl` | `'VERSION' VersionSpecifier` |
| [x]  |  [x]   | [8] | `VersionSpecifier` | `STRING_LITERAL1 \| STRING_LITERAL2` |
| [x]  |  [ ]   | [9] | `ImportsDecl` | `'IMPORTS' iri` |
| [x]  |  [ ]   | [10] | `Rule` | `Rule1 \| Rule2 \| Declaration` |
| [x]  |  [ ]   | [11] | `Rule1` | `'RULE' HeadTemplate 'WHERE' BodyPattern` |
| [ ]  |  [ ]   | [12] | `Rule2` | `'IF' BodyPattern 'THEN' HeadTemplate` |
| [x]  |  [ ]   | [13] | `Declaration` | `( 'TRANSITIVE' '(' iri ')' \| 'SYMMETRIC' '(' iri ')' \| 'INVERSE' '(' iri ',' iri ')' )` |
| [x]  |  [ ]   | [14] | `Data` | `'DATA' TriplesTemplateBlock` |
| [x]  |  [ ]   | [15] | `HeadTemplate` | `TriplesTemplateBlock` |
| [x]  |  [ ]   | [16] | `BodyPattern` | `'{' BodyPattern1 '}'` |
| [x]  |  [ ]   | [17] | `BodyPattern1` | `BodyTriplesBlock? ( BodyNotTriples BodyTriplesBlock? )*` |
| [x]  |  [ ]   | [18] | `BodyNotTriples` | `Filter \| Negation \| Assignment` |
| [x]  |  [x]   | [19] | `BodyTriplesBlock` | `TriplesBlock` |
| [x]  |  [ ]   | [20] | `Negation` | `'NOT' '{' BodyBasic '}'` |
| [x]  |  [ ]   | [21] | `BodyBasic` | `BodyTriplesBlock? ( Filter BodyTriplesBlock? )*` |
| [x]  |  [ ]   | [22] | `TriplesTemplateBlock` | `'{' TriplesTemplate? '}'` |
| [x]  |  [x]   | [23] | `TriplesTemplate` | `TriplesSameSubject ( '.' TriplesTemplate? )?` |
| [x]  |  [x]   | [24] | `TriplesBlock` | `TriplesSameSubjectPath ( '.' TriplesBlock? )?` |
| [x]  |  [x]   | [25] | `ReifiedTripleBlock` | `ReifiedTriple PropertyList` |
| [x]  |  [x]   | [26] | `ReifiedTripleBlockPath` | `ReifiedTriple PropertyListPath` |
| [x]  |  [x]   | [27] | `Assignment` | `'BIND' '(' Expression 'AS' Var ')'` |
| [x]  |  [x]   | [28] | `Reifier` | `'~' VarOrReifierId?` |
| [x]  |  [x]   | [29] | `VarOrReifierId` | `Var \| iri \| BlankNode` |
| [x]  |  [x]   | [30] | `Filter` | `'FILTER' Constraint` |
| [x]  |  [x]   | [31] | `Constraint` | `BrackettedExpression \| BuiltInCall \| FunctionCall` |
| [x]  |  [x]   | [32] | `FunctionCall` | `iri ArgList` |
| [x]  |  [x]   | [33] | `ArgList` | `NIL \| '(' Expression ( ',' Expression )* ')'` |
| [x]  |  [x]   | [34] | `ExpressionList` | `NIL \| '(' Expression ( ',' Expression )* ')'` |
| [x]  |  [x]   | [35] | `TriplesSameSubject` | `VarOrTerm PropertyListNotEmpty \| TriplesNode PropertyList \| ReifiedTripleBlock` |
| [x]  |  [x]   | [36] | `PropertyList` | `PropertyListNotEmpty?` |
| [x]  |  [x]   | [37] | `PropertyListNotEmpty` | `Verb ObjectList ( ';' ( Verb ObjectList )? )*` |
| [x]  |  [x]   | [38] | `Verb` | `VarOrIri \| 'a'` |
| [x]  |  [x]   | [39] | `ObjectList` | `Object ( ',' Object )*` |
| [x]  |  [x]   | [40] | `Object` | `GraphNode Annotation` |
| [x]  |  [x]   | [41] | `TriplesSameSubjectPath` | `VarOrTerm PropertyListPathNotEmpty \| TriplesNodePath PropertyListPath \| ReifiedTripleBlockPath` |
| [x]  |  [x]   | [42] | `PropertyListPath` | `PropertyListPathNotEmpty?` |
| [x]  |  [x]   | [43] | `PropertyListPathNotEmpty` | `( VerbPath \| VerbSimple ) ObjectListPath ( ';' ( ( VerbPath \| VerbSimple ) ObjectListPath )? )*` |
| [x]  |  [x]   | [44] | `VerbPath` | `Path` |
| [x]  |  [x]   | [45] | `VerbSimple` | `Var` |
| [x]  |  [x]   | [46] | `ObjectListPath` | `ObjectPath ( ',' ObjectPath )*` |
| [x]  |  [x]   | [47] | `ObjectPath` | `GraphNodePath AnnotationPath` |
| [x]  |  [x]   | [48] | `Path` | `PathSequence` |
| [x]  |  [x]   | [49] | `PathSequence` | `PathEltOrInverse ( '/' PathEltOrInverse )*` |
| [x]  |  [x]   | [50] | `PathEltOrInverse` | `PathElt \| '^' PathElt` |
| [x]  |  [x]   | [51] | `PathElt` | `PathPrimary` |
| [x]  |  [x]   | [52] | `PathPrimary` | `iri \| 'a' \| '(' Path ')'` |
| [x]  |  [x]   | [53] | `TriplesNode` | `Collection \| BlankNodePropertyList` |
| [x]  |  [x]   | [54] | `BlankNodePropertyList` | `'[' PropertyListNotEmpty ']'` |
| [x]  |  [x]   | [55] | `TriplesNodePath` | `CollectionPath \| BlankNodePropertyListPath` |
| [x]  |  [x]   | [56] | `BlankNodePropertyListPath` | `'[' PropertyListPathNotEmpty ']'` |
| [x]  |  [x]   | [57] | `Collection` | `'(' GraphNode+ ')'` |
| [x]  |  [x]   | [58] | `CollectionPath` | `'(' GraphNodePath+ ')'` |
| [x]  |  [x]   | [59] | `AnnotationPath` | `( Reifier \| AnnotationBlockPath )*` |
| [x]  |  [x]   | [60] | `AnnotationBlockPath` | `'{|' PropertyListPathNotEmpty '\|}'` |
| [x]  |  [x]   | [61] | `Annotation` | `( Reifier \| AnnotationBlock )*` |
| [x]  |  [x]   | [62] | `AnnotationBlock` | `'{|' PropertyListNotEmpty '\|}'` |
| [x]  |  [x]   | [63] | `GraphNode` | `VarOrTerm \| TriplesNode \| ReifiedTriple` |
| [x]  |  [x]   | [64] | `GraphNodePath` | `VarOrTerm \| TriplesNodePath \| ReifiedTriple` |
| [x]  |  [x]   | [65] | `VarOrTerm` | `Var \| iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode \| NIL \| TripleTerm` |
| [x]  |  [x]   | [66] | `ReifiedTriple` | `'<<' ReifiedTripleSubject Verb ReifiedTripleObject Reifier? '>>'` |
| [x]  |  [x]   | [67] | `ReifiedTripleSubject` | `Var \| iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode \| ReifiedTriple` |
| [x]  |  [x]   | [68] | `ReifiedTripleObject` | `Var \| iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode \| ReifiedTriple \| TripleTerm` |
| [x]  |  [x]   | [69] | `TripleTerm` | `'<<(' TripleTermSubject Verb TripleTermObject ')>>'` |
| [x]  |  [x]   | [70] | `TripleTermSubject` | `Var \| iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode` |
