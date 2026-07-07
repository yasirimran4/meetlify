# WORKFLOW.md

# Meetlify Development Workflow

This project will be developed incrementally. Do not attempt to build the entire application at once.

## Development Process

For every feature, follow this workflow:

### 1. Understand the Feature

Before implementing:

* Read only the backend files related to the requested feature.
* Understand the API contract and business logic.
* If you find backend issues, explain them and suggest improvements without modifying the backend automatically.

### 2. Analyze the UI

I will provide:

* A Stitch UI reference image.
* A prompt describing the requested feature.

Treat the Stitch design as a **reference**, not an exact copy.

If the design can be improved for responsiveness, accessibility, consistency, or usability, explain the improvement and implement the better solution while preserving the original design intent.

### 3. Plan Before Coding

Before writing code:

* Identify reusable components.
* Describe the backend integration.
* Mention any assumptions or questions.

### 4. Implement the Feature

Once approved:

* Build only the requested feature.
* Connect it to the backend.
* Reuse existing components whenever possible.
* Avoid modifying unrelated files.

### 5. Validate Before Completion

Before considering the feature complete, verify:

* Design matches the reference.
* API integration works correctly.
* Responsive behavior is correct.
* Loading, success, empty, and error states are handled.
* No console, TypeScript, or lint errors remain.
* Components are reusable and maintainable.

### 6. Wait for the Next Feature

After completing a feature:

* Stop development.
* Wait for testing and feedback.
* Test yourself each feature as a user of this website
* Do not begin another page or feature until instructed.

---

## Important Notes

* Build one feature at a time.
* Never skip steps in this workflow.
* Never generate future pages without instruction.
* Focus on the current feature only.
* The backend response format is still being refined, so work with the current implementation and avoid assuming future API changes.
