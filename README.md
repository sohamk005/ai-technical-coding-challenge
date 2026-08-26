# AI Technical Coding Challenge Submission

**Candidate:** Soham Gajanan Kulkarni

A production-oriented React + TypeScript web application implementing two interactive calculation tools:

- **Split Bill Calculator** — calculates tip, tax, total, per-person share, and maintains browser-local calculation history.
- **Parking Fee Calculator** — calculates parking fees using datetime-safe duration handling, tiered pricing, continuous 24-hour caps, vehicle adjustments, and weekend surcharges.

The implementation prioritizes functional completeness, separation of concerns, validation, automated testing, responsive UI, and clear documentation within the challenge's 120-minute constraint.

---

## Features

### Split Bill Calculator

* Bill amount
* Tip percentage
* Optional tax percentage
* Number of people
* Optional notes
* Immediate calculation
* Transparent calculation breakdown
* Per-person amount
* Currency rounding
* Persistent calculation history using localStorage

### Parking Fee Calculator

* Entry datetime
* Exit datetime
* Vehicle type
* Weekend option
* Correct duration calculation across midnight
* Hourly pricing tiers
* Daily cap
* Vehicle adjustments
* Weekend surcharge
* Itemized fee breakdown
* Invalid range handling

---

## Challenge Requirements Coverage

### Task 1 — Split Bill Calculator

| Requirement | Status |
|---|---|
| Bill amount input | ✅ |
| Tip percentage | ✅ |
| Optional tax | ✅ |
| Number of people | ✅ |
| Optional notes | ✅ |
| Immediate calculation | ✅ |
| Subtotal | ✅ |
| Tip amount | ✅ |
| Tax amount | ✅ |
| Grand total | ✅ |
| Per-person amount | ✅ |
| Transparent breakdown | ✅ |
| Rounding explanation | ✅ |
| localStorage history | ✅ |
| History persistence | ✅ |
| History clearing | ✅ |
| Input validation | ✅ |

### Task 2 — Parking Fee Calculator

| Requirement | Status |
|---|---|
| Entry datetime | ✅ |
| Exit datetime | ✅ |
| Vehicle type | ✅ |
| Weekend option | ✅ |
| Midnight-safe duration | ✅ |
| Multi-day duration | ✅ |
| Partial-hour billing | ✅ |
| Tiered pricing | ✅ |
| Daily cap | ✅ |
| Vehicle adjustment | ✅ |
| Weekend surcharge | ✅ |
| INVALID state | ✅ |
| Itemized output | ✅ |

---

## Technology Stack

* React
* TypeScript
* Vite
* CSS
* Vitest
* Browser localStorage

No backend or external API is required.

---

## Architecture

The application separates UI concerns from business logic.

```text
React UI
   |
   +--------------------+
   |                    |
Split Bill          Parking Fee
   |                    |
   v                    v
Business Logic      Business Logic
   |                    |
   v                    v
localStorage         Pure Results
```

Calculation logic is kept independently testable.

See `ARCHITECTURE.md` for more detail.

---

## Project Structure

```text
src/
├── components/
│   ├── navigation/
│   ├── split-bill/
│   └── parking/
├── logic/
│   ├── splitBill.ts
│   └── parkingFee.ts
├── services/
│   └── historyStorage.ts
├── types/
│   ├── splitBill.ts
│   └── parkingFee.ts
├── App.tsx
└── main.tsx

## Split Bill Calculation

Given:

```text
Tip = Subtotal × Tip%
Tax = Subtotal × Tax%
Grand Total = Subtotal + Tip + Tax
Per Person = Grand Total / People
```

Example:

```text
Bill: $100
Tip: 18%
Tax: 8%
People: 4
```

Result:

```text
Subtotal: $100.00
Tip: $18.00
Tax: $8.00
Grand Total: $126.00
Per Person: $31.50
```

Currency values are displayed to two decimal places.

The application uses an equal-split model rather than assigning individual remainder cents.

---

## Parking Pricing Rules

The parking pricing rules implemented by this project are:

### Base hourly rates

```text
First hour: ₹40
Hours 2–4: ₹30/hour
Hours 5–8: ₹20/hour
Hours beyond 8: ₹15/hour
```

### Daily cap

```text
₹250 per continuous 24-hour billing period
```

### Vehicle adjustments

```text
Car: no adjustment
Motorcycle: 20% discount
SUV: 20% surcharge
```

### Weekend

```text
10% surcharge
```

### Partial hours

Partial hours are rounded upward for billing.

For example:

```text
2 hours 10 minutes → 3 billable hours
```

Exact hourly durations remain unchanged.

### Invalid ranges

If the exit datetime is not later than the entry datetime, the parking calculation is invalid.

---

## Important Challenge Assumption

The supplied task description refers to business rules in a README, but the exact pricing table was not included in the challenge material available during implementation.

Therefore the pricing rules above are explicitly defined as this project's implementation rules and are centralized in the parking calculation logic.

This allows the pricing configuration to be changed without rewriting the UI.

---

## Local Setup

### Requirements

* Node.js
* npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Tests

```bash
npm test
```

---

## Error Handling

Invalid inputs are rejected before calculation.

Examples:

```text
Please enter a valid bill amount.
```

```text
Number of people must be at least 1.
```

```text
Exit time must be later than entry time.
```

The application avoids displaying raw runtime errors, NaN, Infinity, or undefined calculation values.

---

## Testing

The calculation layer is independently testable.

Coverage includes important business scenarios such as:

* Split bill calculations
* Tax and tip
* Party size validation
* Rounding
* Midnight parking sessions
* Invalid parking ranges
* Partial-hour billing
* Daily caps
* Vehicle adjustments
* Weekend surcharges

Tests are executed using Vitest.

---

## Design Decisions

### Why React?

The challenge is primarily interactive and UI-driven. React provides a simple component model for building two related calculators while allowing the business logic to remain independent.

### Why TypeScript?

TypeScript provides stronger contracts for calculation inputs and outputs and reduces common runtime mistakes.

### Why localStorage?

The Split Bill task explicitly requires local history stored locally. localStorage satisfies that requirement without unnecessary backend infrastructure.

### Why no backend?

The challenge does not require authentication, shared data, external APIs, or server-side persistence. A backend would add complexity without improving the required MVP.

### Why separate calculation logic?

Calculation functions are easier to test, reason about, and defend during technical evaluation when they are independent of the UI.

---

## Trade-offs

Because the challenge has a strict 120-minute deadline, the implementation intentionally prioritizes:

* Correctness
* Testability
* Simplicity
* Maintainability
* Required functionality

The project does not introduce unnecessary infrastructure or advanced abstractions.

---

## Known Limitations

* Split bill history is device/browser-local.
* There are no user accounts.
* There is no cloud synchronization.
* Parking pricing rules are locally configured.
* Individual remainder-cent allocation is not implemented.
* No backend persistence is included.

---

## Future Improvements

If this were developed beyond the challenge, possible improvements include:

* Backend persistence
* User accounts
* Cloud-synchronized history
* Configurable parking rules
* International currency support
* End-to-end browser testing
* Accessibility audit
* Deployment and monitoring
* Analytics
* More sophisticated bill splitting

---

## AI-Assisted Development

This project was developed using an incremental AI-assisted engineering workflow.

The implementation process emphasized:

```text
Requirements
    ↓
Architecture
    ↓
Milestone implementation
    ↓
Testing
    ↓
Human review
    ↓
Git checkpoint
```

The AI prompt history is documented in `prompt.md`.

---

## Final Verification

The final implementation was verified with:

```bash
npm test
npm run typecheck
npm run build

Results:

62/62 automated tests passing
TypeScript typecheck passing with zero errors
Production build passing
No hardcoded credentials or secrets
No .env credentials committed
Task 1 regression tests passing
Task 2 edge-case tests passing

## Project Documentation

* `CHALLENGE_REQUIREMENTS.md` — authoritative functional requirements
* `ARCHITECTURE.md` — system architecture and design decisions
* `IMPLEMENTATION_PLAN.md` — milestone-based development process
* `prompt.md` — AI prompts and development iterations

---

## Project Usage

This project was created for the AI Technical Coding Challenge.
