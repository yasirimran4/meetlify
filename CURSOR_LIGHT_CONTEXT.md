# Meetlify Cursor Rules (LIGHT)

## Backend Rule

Backend is source of truth.

* Never invent APIs
* Always read router + service + schema
* Match exact request/response format

---

## Build Rule

* Build ONE feature at a time
* Wait for next instruction after completion
* Use Stitch UI as reference only

---

## App Split

Public:

* Mobile-first
* Card/grid UI
* No admin actions

Admin:

* Desktop-first
* Table/dashboard UI
* Full CRUD system

Never mix these UIs.

---

## Required States

Every API feature must include:

* loading
* success
* error
* empty

---

## Code Rules

* Reusable components only
* No duplicate UI logic
* Feature-based structure
* Clean API service layer

---

## Design Rule

* Clean SaaS UI (Linear / Stripe style)
* Light theme default
* Lucide icons only
* No cartoon/AI-style UI

---

## Forbidden

* No guessing APIs
* No skipping steps
* No building multiple pages
* No direct backend modification

---

## Completion Rule

Feature is complete only when:

* UI matches design
* API works
* responsive
* no errors
* all states handled
