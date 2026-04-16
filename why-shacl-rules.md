This "coupling" is one of the strongest arguments for using SHACL Rules over pure N3 in a large-scale project. It ensures that your **data models** (Shapes) and your **business logic** (Rules) are always in sync.

Here is a concrete example comparing the two.

### 1. The SHACL Approach (Automatic Coupling)

In SHACL, the rule lives **inside** the Shape. The shape defines what the node is, and the rule automatically inherits that context.

```turtle
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://example.org/> .

# THE SHAPE
ex:PersonShape a sh:NodeShape ;
    sh:targetClass ex:Person ; # 1. COUPLING: This shape targets all Persons.
    
    # 2. VALIDATION: Every person MUST have a birthDate
    sh:property [
        sh:path ex:birthDate ;
        sh:minCount 1 ;
    ] ;

    # 3. RULE: Because they are a Person, they get a taxID
    sh:rule [
        a sh:SPARQLRule ;
        sh:construct """
            CONSTRUCT { $this ex:taxID "GENERIC-ID" }
            WHERE {
                # Notice: I do NOT need to check if $this is a Person here.
                # It is guaranteed by the 'sh:targetClass' above.
                FILTER NOT EXISTS { $this ex:taxID ?any }
            }
        """
    ] .
```

**Why this is "Automatic":**
*   **The `$this` variable:** In SHACL Rules, the variable `$this` is pre-bound to the node being validated.
*   **Scope:** The rule only "fires" for nodes that match the shape's target. You don't waste CPU cycles checking every triple in the database to see if it's a person; the SHACL engine handles that filtering for you.

---

### 2. The N3 Approach (Manual Coupling)

N3 is a global logic engine. It doesn't have the concept of a "target" outside of the rule itself. You have to define the context manually inside every single rule.

```n3
@prefix ex: <http://example.org/> .

{
  # 1. MANUAL CHECK: I have to explicitly find the person.
  ?person a ex:Person . 
  
  # 2. ADDITIONAL LOGIC
  NOT { ?person ex:taxID ?any }
} 
=> 
{
  # 3. CONCLUSION
  ?person ex:taxID "GENERIC-ID" .
} .
```

---

### The 3 Key Differences in Practice:

#### 1. Maintenance (The "Refactoring" Problem)
*   **SHACL:** If your boss says: "Actually, these rules should now apply to `ex:Employee` instead of `ex:Person`", you change **one line** in the Shape (`sh:targetClass ex:Employee`). The rule remains exactly the same.
*   **N3:** You have to find every rule that starts with `?person a ex:Person` and manually rewrite it to `?employee a ex:Employee`.

#### 2. Validation + Inference = Data Integrity
*   **SHACL:** You can configure the engine so that the rule **only runs if the node passes validation**.
    *   *Example:* If Alice is a person but is missing a `birthDate` (fails validation), SHACL can block the rule from giving her a `taxID`.
*   **N3:** N3 doesn't naturally "know" about your validation shapes. It will execute the logic regardless of whether the data is "valid" or not, unless you manually add the validation logic into the rule body.

#### 3. Efficiency
*   **SHACL:** The engine builds an index of nodes matching `ex:PersonShape`. When a rule needs to run, it only iterates over that specific list.
*   **N3:** The reasoner has to look at the entire "Fact Base" to find things that fit the `{ IF }` pattern. On a database with 10 million triples, the SHACL "Shape Coupling" provides a massive speed advantage.

### Summary
In your student job, when you parse a SHACL rule, you are capturing that **Shape context**. When you translate it to algebra, the "WHERE" clause you create will be automatically focused on the nodes selected by the shape.

**This makes SHACL Rules a "Model-Driven" way of writing logic, whereas N3 is "Global" logic.**

# The Case for SHACL Rules: Advantages over N3

While N3 (Notation3) is an incredibly powerful and Turing-complete reasoning language, SHACL Rules provide several distinct architectural and enterprise advantages. The true power of SHACL Rules lies not just in its syntax, but in its deep integration with the existing SHACL Validation ecosystem.

Here is a comparison of why SHACL Rules are a necessary evolution alongside engines like Eyeling (N3).

## 1. Shape-Coupling (Targeted Execution)
In traditional N3, rules evaluate globally. The reasoner looks at the entire database to find matches for the `{ IF }` block.

In SHACL, **Rules can be attached to Shapes** (as discussed in W3C Draft Issue 765). This provides a massive performance and structural advantage:
* **The `$this` Focus Node:** A rule attached to a `sh:NodeShape` automatically inherits the shape's target (e.g., `sh:targetClass ex:Customer`).
* **Advantage:** The engine does not need to search the entire graph; it only evaluates the rule for nodes that match the shape's target. This makes the logic highly contextual and object-oriented.

## 2. Validation-Driven Inference (Data Integrity)
N3 blindly applies logic to any data it finds. If the data is malformed, the inferred conclusions will be garbage.

Because SHACL Rules live inside the SHACL ecosystem, they allow for **Validation-Driven Inference**:
* You can define a shape that strictly validates a node (e.g., "A valid order must have a price and a date").
* You attach the rule to *that specific shape*.
* **Advantage:** The rule only fires if the data is proven to be clean and valid. You combine "Data Quality" and "Business Logic" in one single standard.

## 3. The SPARQL Synergy
N3 uses its own ecosystem of built-ins (e.g., `math:greaterThan`, `string:concat`). These are highly specific to N3 reasoners.

SHACL Rules explicitly reuse the **SPARQL 1.1 / 1.2 function library**.
* **Advantage:** Any developer who knows how to write a SPARQL query instantly knows how to write a SHACL Rule. Furthermore, standard query engines (like Comunica) can be directly reused to evaluate the logic (which is exactly what this project implements), eliminating the need to write custom math/string evaluators from scratch.

## 4. W3C Standardization
* **N3** is a W3C Member Submission (a highly respected experimental track).
* **SHACL** is a formalized W3C Recommendation.
* **Advantage:** For enterprise adoption, standard compliance is critical. SHACL Rules provide a standardized, predictable way to share inference logic across different companies and tools, ensuring interoperability.

## Conclusion
SHACL Rules are not a replacement for the raw reasoning power of N3. Instead, they provide a **structured, shape-bound, and standardized layer** of logic. By translating SHACL Rules into N3 (and using Comunica for SPARQL algebra), we combine the strict, shape-based targeting of SHACL with the blazing-fast execution of the Eyeling reasoner.