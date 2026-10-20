# Three property evidence exercises

By [Ahmadreza Samadi](https://a-samadi.com/about.html) · AI for property decisions · Start with the Decision.

**Every property, source, figure and date in these exercises is invented.** These are educational demonstrations of how to record a claim and its limits. They are not company case studies, real market evidence, a valuation method or proof that the tool can detect errors.

Before reading the notes, decide what you would allow into a property brief and what still needs checking:

| Exercise | Question to resolve | Open in Evidence Note | Read without the editor |
|---|---|---|---|
| Wrong property | Do a shared shortened name and unit label outweigh different building IDs? | [JSON](01-wrong-property.json) | [Readable HTML](01-wrong-property.html) |
| Old observation | Does a newly published page establish that its estimate uses current evidence? | [JSON](02-old-observation.json) | [Readable HTML](02-old-observation.html) |
| Different area definitions | Can two differently scoped area figures be treated as a contradiction? | [JSON](03-different-area-definitions.json) | [Readable HTML](03-different-area-definitions.html) |

[Download all three exercises and this guide](https://github.com/ahmadreza-smdi/evidence-note/raw/main/examples/property-review/property-review-exercises.zip). This small pack contains notes, readable exports and the guide; the editor is downloaded separately from the repository or its existing Releases.

## Try an exercise

1. Extract the exercise ZIP, or download an individual JSON file using GitHub's **Download raw file** control. Save the file itself, not the GitHub web page.
2. Open the downloaded Evidence Note editor's `index.html`. Choose **Open saved JSON** and select one exercise. Existing version 0.1.1 supports these version-1 note files; no tool upgrade is needed.
3. If you already have a note open, save it first. The editor asks before replacing a nonempty note.
4. Read the **claim**, **source**, **limits** and **next check** together. The relationship is an author-recorded judgment, not a conclusion made by the software.
5. Leave **Fictional teaching example** checked while experimenting with these invented records. Save a separate JSON copy to keep your changes. HTML exports open and print without the editor.

The `.invalid` addresses are placeholders, not source evidence. Nothing in the exercise is fetched or verified by the editor.

## What the worked notes demonstrate

**1. Wrong property:** the provided building IDs disagree. The note records that conflict and asks for evidence of any claimed equivalence. It does not infer a correct identity from a shared label or resolve the mismatch automatically.

**2. Old observation:** observation, publication and access are different dates. A newer page date does not, on its own, establish fresher underlying evidence. The example does not prescribe a universal expiry period or declare the estimate false.

**3. Different area definitions:** the labels describe different scopes and omit measurement details. Do not infer that the difference between the numbers is a measured balcony size. The missing observation date stays **Not recorded** rather than being replaced with the page date.

## The important result

The first two notes have no missing recording fields; their decisions are still unresolved. The third deliberately has one recording gap. **A complete form is not complete evidence.** The tool checks recording structure, not truth, property identity, comparability or decision readiness.

These examples were prepared with AI assistance and checked for compatibility with the existing editor. No company adoption, financial outcome or measured model performance is claimed.

Continue with [Where AI should stop](https://a-samadi.com/writing/ai-human-review-real-estate.html), [property evidence](https://a-samadi.com/writing/property-data-enrichment.html), or the [Evidence Note instructions](https://github.com/ahmadreza-smdi/evidence-note#use-it).
