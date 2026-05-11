# SHACL 1.2 Rules Grammar (Section 6)

Source: https://www.w3.org/TR/shacl12-rules/#shapes-rules-grammar

## Grammar Productions

| ID | Rule | Definition |
| --- | --- | --- |
| [1] | RuleSet | RuleOrDataBlock |
| [2] | RuleOrDataBlock | Prologue ( RuleOrData+ ( Prologue1 RuleOrData? )* )? |
| [3] | RuleOrData | Rule \| Data |
| [4] | Prologue | Prologue1* |
| [5] | Prologue1 | BaseDecl \| PrefixDecl \| VersionDecl \| ImportsDecl |
| [6] | BaseDecl | 'BASE' IRIREF |
| [7] | PrefixDecl | 'PREFIX' PNAME_NS IRIREF |
| [8] | VersionDecl | 'VERSION' VersionSpecifier |
| [9] | VersionSpecifier | STRING_LITERAL1 \| STRING_LITERAL2 |
| [10] | ImportsDecl | 'IMPORTS' iri |
| [11] | Rule | Rule1 \| Rule2 \| Declaration |
| [12] | Rule1 | 'RULE' HeadTemplate 'WHERE' BodyPattern |
| [13] | Rule2 | 'IF' BodyPattern 'THEN' HeadTemplate |
| [14] | Declaration | ( 'TRANSITIVE' '(' iri ')' \| 'SYMMETRIC' '(' iri ')' \| 'INVERSE' '(' iri ',' iri ')' ) |
| [15] | Data | 'DATA' '{' TriplesDataBlock? '}' |
| [16] | TriplesDataBlock | TriplesSameSubject ( '.' TriplesDataBlock? )? |
| [17] | HeadTemplate | '{' HeadTemplateBlock? '}' |
| [18] | BodyPattern | '{' BodyTriplesBlock? ( BodyNotTriples BodyTriplesBlock? )* '}' |
| [19] | BodyNotTriples | Filter \| Negation \| Assignment |
| [20] | BodyTriplesBlock | TriplesBlock |
| [21] | Negation | 'NOT' '{' BodyBasic '}' |
| [22] | BodyBasic | BodyTriplesBlock? ( Filter BodyTriplesBlock? )* |
| [23] | HeadTemplateBlock | TriplesBlock |
| [24] | TriplesBlock | TriplesSameSubjectPath ( '.' TriplesBlock? )? |
| [25] | ReifiedTripleBlock | ReifiedTriple PropertyList |
| [26] | ReifiedTripleBlockPath | ReifiedTriple PropertyListPath |
| [27] | Assignment | 'SET' '(' Var ':=' Expression ')' |
| [28] | Reifier | '~' VarOrReifierId? |
| [29] | VarOrReifierId | Var \| iri \| BlankNode |
| [30] | Filter | 'FILTER' Constraint |
| [31] | Constraint | BrackettedExpression \| BuiltInCall \| FunctionCall |
| [32] | FunctionCall | iri ArgList |
| [33] | ArgList | NIL \| '(' Expression ( ',' Expression )* ')' |
| [34] | ExpressionList | NIL \| '(' Expression ( ',' Expression )* ')' |
| [35] | TriplesSameSubject | VarOrTerm PropertyListNotEmpty \| TriplesNode PropertyList \| ReifiedTripleBlock |
| [36] | PropertyList | PropertyListNotEmpty? |
| [37] | PropertyListNotEmpty | Verb ObjectList ( ';' ( Verb ObjectList )? )* |
| [38] | Verb | VarOrIri \| 'a' |
| [39] | ObjectList | Object ( ',' Object )* |
| [40] | Object | GraphNode Annotation |
| [41] | TriplesSameSubjectPath | VarOrTerm PropertyListPathNotEmpty \| TriplesNodePath PropertyListPath \| ReifiedTripleBlockPath |
| [42] | PropertyListPath | PropertyListPathNotEmpty? |
| [43] | PropertyListPathNotEmpty | ( VerbPath \| VerbSimple ) ObjectListPath ( ';' ( ( VerbPath \| VerbSimple ) ObjectListPath )? )* |
| [44] | VerbPath | Path |
| [45] | VerbSimple | Var |
| [46] | ObjectListPath | ObjectPath ( ',' ObjectPath )* |
| [47] | ObjectPath | GraphNodePath AnnotationPath |
| [48] | Path | PathSequence |
| [49] | PathSequence | PathEltOrInverse ( '/' PathEltOrInverse )* |
| [50] | PathEltOrInverse | PathElt \| '^' PathElt |
| [51] | PathElt | PathPrimary |
| [52] | PathPrimary | iri \| 'a' \| '(' Path ')' |
| [53] | TriplesNode | Collection \| BlankNodePropertyList |
| [54] | BlankNodePropertyList | '[' PropertyListNotEmpty ']' |
| [55] | TriplesNodePath | CollectionPath \| BlankNodePropertyListPath |
| [56] | BlankNodePropertyListPath | '[' PropertyListPathNotEmpty ']' |
| [57] | Collection | '(' GraphNode+ ')' |
| [58] | CollectionPath | '(' GraphNodePath+ ')' |
| [59] | AnnotationPath | ( Reifier \| AnnotationBlockPath )* |
| [60] | AnnotationBlockPath | '{|' PropertyListPathNotEmpty '|}' |
| [61] | Annotation | ( Reifier \| AnnotationBlock )* |
| [62] | AnnotationBlock | '{|' PropertyListNotEmpty '|}' |
| [63] | GraphNode | VarOrTerm \| TriplesNode \| ReifiedTriple |
| [64] | GraphNodePath | VarOrTerm \| TriplesNodePath \| ReifiedTriple |
| [65] | VarOrTerm | Var \| RDFTerm |
| [66] | RDFTerm | iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode \| NIL \| TripleTerm |
| [67] | ReifiedTriple | '<<' ReifiedTripleSubject Verb ReifiedTripleObject Reifier? '>>' |
| [68] | ReifiedTripleSubject | Var \| iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode \| ReifiedTriple |
| [69] | ReifiedTripleObject | Var \| iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode \| ReifiedTriple \| TripleTerm |
| [70] | TripleTerm | '<<(' TripleTermSubject Verb TripleTermObject ')>>' |
| [71] | TripleTermSubject | Var \| iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode |
| [72] | TripleTermObject | Var \| iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| BlankNode \| TripleTerm |
| [73] | TripleTermData | '<<(' TripleTermDataSubject ( iri \| 'a' ) TripleTermDataObject ')>>' |
| [74] | TripleTermDataSubject | iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral |
| [75] | TripleTermDataObject | iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| TripleTermData |
| [76] | VarOrIri | Var \| iri |
| [77] | Var | VAR1 \| VAR2 |
| [78] | Expression | ConditionalOrExpression |
| [79] | ConditionalOrExpression | ConditionalAndExpression ( '||' ConditionalAndExpression )* |
| [80] | ConditionalAndExpression | ValueLogical ( '&&' ValueLogical )* |
| [81] | ValueLogical | RelationalExpression |
| [82] | RelationalExpression | NumericExpression ( '=' NumericExpression \| '!=' NumericExpression \| '<' NumericExpression \| '>' NumericExpression \| '<=' NumericExpression \| '>=' NumericExpression \| 'IN' ExpressionList \| 'NOT' 'IN' ExpressionList )? |
| [83] | NumericExpression | AdditiveExpression |
| [84] | AdditiveExpression | MultiplicativeExpression ( '+' MultiplicativeExpression \| '-' MultiplicativeExpression \| ( NumericLiteralPositive \| NumericLiteralNegative ) ( ( '*' UnaryExpression ) \| ( '/' UnaryExpression ) )* )* |
| [85] | MultiplicativeExpression | UnaryExpression ( '*' UnaryExpression \| '/' UnaryExpression )* |
| [86] | UnaryExpression | '!' PrimaryExpression \| '+' PrimaryExpression \| '-' PrimaryExpression \| PrimaryExpression |
| [87] | PrimaryExpression | BrackettedExpression \| BuiltInCall \| iriOrFunction \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| Var \| ExprTripleTerm |
| [88] | ExprTripleTerm | '<<(' ExprTripleTermSubject Verb ExprTripleTermObject ')>>' |
| [89] | ExprTripleTermSubject | iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| Var |
| [90] | ExprTripleTermObject | iri \| RDFLiteral \| NumericLiteral \| BooleanLiteral \| Var \| ExprTripleTerm |
| [91] | BrackettedExpression | '(' Expression ')' |
| [92] | BuiltInCall | 'STR' '(' Expression ')' \| 'LANG' '(' Expression ')' \| 'LANGMATCHES' '(' Expression ',' Expression ')' \| 'LANGDIR' '(' Expression ')' \| 'DATATYPE' '(' Expression ')' \| 'IRI' '(' Expression ')' \| 'URI' '(' Expression ')' \| 'BNODE' ( '(' Expression ')' \| NIL ) \| 'ABS' '(' Expression ')' |
| [93] | iriOrFunction | iri ArgList? |
| [94] | RDFLiteral | String ( LANG_DIR \| '^^' iri )? |
| [95] | NumericLiteral | NumericLiteralUnsigned \| NumericLiteralPositive \| NumericLiteralNegative |
| [96] | NumericLiteralUnsigned | INTEGER \| DECIMAL \| DOUBLE |
| [97] | NumericLiteralPositive | INTEGER_POSITIVE \| DECIMAL_POSITIVE \| DOUBLE_POSITIVE |
| [98] | NumericLiteralNegative | INTEGER_NEGATIVE \| DECIMAL_NEGATIVE \| DOUBLE_NEGATIVE |
| [99] | BooleanLiteral | 'true' \| 'false' |
| [100] | String | STRING_LITERAL1 \| STRING_LITERAL2 \| STRING_LITERAL_LONG1 \| STRING_LITERAL_LONG2 |
| [101] | iri | IRIREF \| PrefixedName |
| [102] | PrefixedName | PNAME_LN \| PNAME_NS |
| [103] | BlankNode | BLANK_NODE_LABEL \| ANON |

## Productions for Terminals

| ID | Rule | Definition |
| --- | --- | --- |
| [104] | IRIREF | '<' ([^<>"{}|^`\\]-[#x00-#x20])* '>' |
| [105] | PNAME_NS | PN_PREFIX? ':' |
| [106] | PNAME_LN | PNAME_NS PN_LOCAL |
| [107] | BLANK_NODE_LABEL | '_:' ( PN_CHARS_U \| [0-9] ) ((PN_CHARS\|'.')* PN_CHARS)? |
| [108] | VAR1 | '?' VARNAME |
| [109] | VAR2 | '$' VARNAME |
| [110] | LANG_DIR | '@' [a-zA-Z]+ ('-' [a-zA-Z0-9]+)* ('--' [a-zA-Z]+)? |
| [111] | INTEGER | [0-9]+ |
| [112] | DECIMAL | [0-9]* '.' [0-9]+ |
| [113] | DOUBLE | ( ([0-9]+ ('.'[0-9]*)? ) \| ( '.' ([0-9])+ ) ) [eE][+-]?[0-9]+ |
| [114] | INTEGER_POSITIVE | '+' INTEGER |
| [115] | DECIMAL_POSITIVE | '+' DECIMAL |
| [116] | DOUBLE_POSITIVE | '+' DOUBLE |
| [117] | INTEGER_NEGATIVE | '-' INTEGER |
| [118] | DECIMAL_NEGATIVE | '-' DECIMAL |
| [119] | DOUBLE_NEGATIVE | '-' DOUBLE |
| [120] | STRING_LITERAL1 | "'" ( ([^#x27#x5C#xA#xD]) \| ECHAR )* "'" |
| [121] | STRING_LITERAL2 | '"' ( ([^#x22#x5C#xA#xD]) \| ECHAR )* '"' |
| [122] | STRING_LITERAL_LONG1 | "'''" ( ( "'" \| "''" )? ( [^'\\] \| ECHAR ) )* "'''" |
| [123] | STRING_LITERAL_LONG2 | '"""' ( ( '"' \| '""' )? ( [^"\\] \| ECHAR ) )* '"""' |
| [124] | ECHAR | '\\' [tbnrf\\"'] |
| [125] | NIL | '(' WS* ')' |
| [126] | WS | #x20 \| #x9 \| #xD \| #xA |
| [127] | ANON | '[' WS* ']' |
| [128] | PN_CHARS_BASE | [A-Z] \| [a-z] \| [#x00C0-#x00D6] \| [#x00D8-#x00F6] \| [#x00F8-#x02FF] \| [#x0370-#x037D] \| [#x037F-#x1FFF] \| [#x200C-#x200D] \| [#x2070-#x218F] \| [#x2C00-#x2FEF] \| [#x3001-#xD7FF] \| [#xF900-#xFDCF] \| [#xFDF0-#xFFFD] \| [#x10000-#xEFFFF] |
| [129] | PN_CHARS_U | PN_CHARS_BASE \| '_' |
| [130] | VARNAME | ( PN_CHARS_U \| [0-9] ) ( PN_CHARS_U \| [0-9] \| #x00B7 \| [#x0300-#x036F] \| [#x203F-#x2040] )* |
| [131] | PN_CHARS | PN_CHARS_U \| '-' \| [0-9] \| #x00B7 \| [#x0300-#x036F] \| [#x203F-#x2040] |
| [132] | PN_PREFIX | PN_CHARS_BASE ((PN_CHARS\|'.')* PN_CHARS)? |
| [133] | PN_LOCAL | (PN_CHARS_U \| ':' \| [0-9] \| PLX ) ((PN_CHARS \| '.' \| ':' \| PLX)* (PN_CHARS \| ':' \| PLX) )? |
| [134] | PLX | PERCENT \| PN_LOCAL_ESC |
| [135] | PERCENT | '%' HEX HEX |
| [136] | HEX | [0-9] \| [A-F] \| [a-f] |
| [137] | PN_LOCAL_ESC | '\\' ( '_' \| '~' \| '.' \| '-' \| '!' \| '$' \| '&' \| "'" \| '(' \| ')' \| '*' \| '+' \| ',' \| ';' \| '=' \| '/' \| '?' \| '#' \| '@' \| '%' ) |
