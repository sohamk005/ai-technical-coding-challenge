# AI Technical Coding Challenge — Implementation Plan

## Operating Rule

This project is being developed under a strict 120-minute challenge deadline.

Implementation must be milestone-based.

**Antigravity MUST stop at the end of every milestone.**

It must:

1. Implement only the current milestone.
2. Run the required verification.
3. Report what changed.
4. Report files changed.
5. Report tests/build results.
6. Report known limitations.
7. State whether the milestone acceptance criteria are satisfied.
8. STOP.

Antigravity must NOT automatically continue to the next milestone.

Git commits will be performed manually after human review.

---

# Milestone 0 — Repository Initialization

## Objective

Prepare the repository for development.

## Tasks

* Initialize React + TypeScript + Vite project.
* Configure Git.
* Configure `.gitignore`.
* Install required dependencies.
* Ensure project starts.
* Ensure production build works.
* Create required documentation files.

## Required Files

```text
README.md
CHALLENGE_REQUIREMENTS.md
ARCHITECTURE.md
IMPLEMENTATION_PLAN.md
prompt.md
```

## Acceptance Criteria

* Project starts successfully.
* Production build succeeds.
* No unnecessary dependencies.
* Required documentation exists.
* No secrets are present.

## STOP

Do not implement calculators.

Suggested commit:

```text
chore: initialize challenge project
```

---

# Milestone 1 — Split Bill MVP

## Objective

Implement the core Split Bill calculator.

## Tasks

* Create calculator UI.
* Add bill input.
* Add tip input.
* Add tax input.
* Add party-size input.
* Implement calculation logic.
* Display subtotal.
* Display tip.
* Display tax.
* Display grand total.
* Display per-person amount.
* Display calculation breakdown.
* Add validation.

## Acceptance Criteria

For:

```text
100
18%
8%
4
```

the application displays:

```text
Subtotal: 100
Tip: 18
Tax: 8
Grand Total: 126
Per Person: 31.50
```

Calculations update immediately.

Invalid inputs produce useful validation messages.

## STOP

Do not implement history.

Suggested commit:

```text
feat: implement split bill calculator
```

---

# Milestone 2 — Split Bill History

## Objective

Add persistent local history.

## Tasks

* Save calculations to localStorage.
* Display history.
* Store useful calculation details.
* Add timestamps.
* Add clear-history functionality.
* Handle empty history.
* Handle malformed localStorage data safely.

## Acceptance Criteria

* Saved calculations survive page refresh.
* History is readable.
* Clear history works.
* Invalid/corrupted localStorage does not crash the application.

## STOP

Suggested commit:

```text
feat: add split bill history
```

---

# Milestone 3 — Parking Fee MVP

## Objective

Implement the parking calculator and pricing engine.

## Tasks

* Create parking UI.
* Entry datetime.
* Exit datetime.
* Vehicle type.
* Weekend input.
* Duration calculation.
* Partial-hour rounding.
* Pricing tiers.
* Daily cap.
* Vehicle adjustment.
* Weekend surcharge.
* Itemized result.

## Critical Requirement

Duration MUST use datetime arithmetic.

Crossing midnight must work correctly.

Example:

```text
22:00 → 02:00 next day
= 4 hours
```

## Acceptance Criteria

* Same-day sessions work.
* Midnight sessions work.
* Multi-day sessions work.
* Invalid ranges return INVALID state.
* Pricing follows CHALLENGE_REQUIREMENTS.md.
* Daily cap works correctly.
* Itemized output is visible.

## STOP

Suggested commit:

```text
feat: implement parking fee calculator
```

---

# Milestone 4 — Tests and Edge Cases

## Objective

Add focused automated tests.

## Split Bill

Test:

* Normal calculation
* Zero tip
* Zero tax
* Multiple people
* Invalid amount
* Invalid party size
* Rounding

## Parking

Test:

* Same day
* Midnight crossing
* Multi-day
* Exit before entry
* Exact hourly boundary
* Partial-hour rounding
* Daily cap
* Vehicle adjustment
* Weekend surcharge

## Acceptance Criteria

* Tests pass.
* Important business rules have automated coverage.
* No test depends on manual UI interaction unless necessary.

## STOP

Suggested commit:

```text
test: add calculator edge case coverage
```

---

# Milestone 5 — UI/UX Polish

## Objective

Make the application presentation-ready.

## Tasks

* Improve layout.
* Improve spacing.
* Improve typography.
* Improve input styling.
* Improve result cards.
* Improve error messages.
* Add empty states.
* Ensure responsive behavior.
* Ensure clear navigation between calculators.
* Check keyboard usability.
* Check visual hierarchy.

## Constraint

Do not redesign working business logic unless a bug is discovered.

## Acceptance Criteria

* Application is easy to understand.
* Inputs are clear.
* Results are prominent.
* Errors are understandable.
* Layout works on common screen sizes.

## STOP

Suggested commit:

```text
style: polish calculator interface
```

---

# Milestone 6 — Documentation

## Objective

Finalize documentation.

## README must include

* Overview
* Features
* Technology stack
* Setup
* Running locally
* Testing
* Architecture
* Design decisions
* Calculation rules
* Rounding behavior
* Parking pricing rules
* Error handling
* Trade-offs
* Known limitations
* Future improvements

## prompt.md

Record:

* AI prompts used
* Important iterations
* Significant corrections
* Testing prompts
* Final audit prompt

## Acceptance Criteria

Documentation accurately describes the actual implementation.

No undocumented features are claimed.

## STOP

Suggested commit:

```text
docs: finalize project documentation
```

---

# Milestone 7 — Final QA

## Objective

Perform the final submission audit.

## Verify

### Build

* Production build succeeds.

### Tests

* All tests pass.

### Split Bill

* Normal calculation.
* Tax.
* Tip.
* Multiple people.
* Rounding.
* History.
* Refresh persistence.
* Invalid inputs.

### Parking

* Same day.
* Midnight.
* Multi-day.
* Invalid range.
* Partial hour.
* Daily cap.
* Vehicle type.
* Weekend.

### UI

* No obvious layout issues.
* No console errors.
* Responsive layout.
* Clear validation.

### Repository

* README exists.
* prompt.md exists.
* No secrets.
* `.env` not committed.
* No unnecessary generated files.
* Git status reviewed.

## STOP

Do not make new features.

Report all findings to the human reviewer.

Suggested commit:

```text
chore: finalize challenge submission
```

---

# Human Review Gate

After every milestone:

```text
Antigravity
    ↓
Implementation
    ↓
Tests
    ↓
STOP
    ↓
Human review
    ↓
Approved?
   / \
 No   Yes
 |     |
Fix   Commit
       |
       v
Next milestone
```

Antigravity must not perform the commit itself unless explicitly instructed.

---

# Priority Rule

If time becomes limited:

```text
Working functionality
        >
Correctness
        >
Tests
        >
Validation
        >
Required documentation
        >
UI polish
        >
Optional improvements
```

Optional improvements must never jeopardize the completion of core functionality.
