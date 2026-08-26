# AI Technical Coding Challenge — Requirements

## 1. Challenge Overview

This project is a two-feature web application developed as part of an AI Technical Coding Challenge.

The application contains:

1. Split Bill Calculator
2. Parking Fee Calculator

The implementation must prioritize:

* Functional completeness
* Correct business logic
* Clean and modular code
* Input validation
* Edge-case handling
* Unit tests
* Usable UI/UX
* Clear documentation
* Effective AI-assisted development

The challenge has a strict 120-minute implementation window.

---

# 2. Engineering Priorities

Implementation priority:

1. Core functionality
2. Correct calculations
3. Validation and error handling
4. Unit tests and edge cases
5. LocalStorage history
6. UI/UX refinement
7. Documentation
8. Final verification

Do not introduce complexity that does not directly improve the requirements.

---

# 3. Task 1 — Split Bill Calculator

## 3.1 Purpose

Allow users to calculate how a bill should be divided between multiple people while clearly showing the calculation breakdown.

## 3.2 Inputs

Required:

* Bill amount
* Tip percentage
* Number of people

Optional:

* Tax percentage
* Item notes

## 3.3 Outputs

The application must display:

* Subtotal
* Tip amount
* Tax amount
* Grand total
* Per-person amount
* Calculation breakdown

## 3.4 Calculation Rules

Given:

* `subtotal`
* `tipPercentage`
* `taxPercentage`
* `people`

Calculate:

```text
tipAmount = subtotal × tipPercentage / 100

taxAmount = subtotal × taxPercentage / 100

grandTotal = subtotal + tipAmount + taxAmount

perPerson = grandTotal / people
```

Tax and tip are calculated from the subtotal.

## 3.5 Example

Input:

```text
Bill = $100
Tip = 18%
Tax = 8%
People = 4
```

Expected:

```text
Subtotal = $100.00
Tip = $18.00
Tax = $8.00
Grand Total = $126.00
Per Person = $31.50
```

## 3.6 Rounding

Currency values are displayed to two decimal places.

The primary split model is an equal split:

```text
perPerson = grandTotal / numberOfPeople
```

The UI must explain that the displayed per-person amount is rounded to two decimal places.

Individual remainder allocation is outside the MVP because the task requests a per-person value rather than individual payment assignments.

## 3.7 Input Validation

Reject:

* Negative bill amounts
* Empty bill amounts
* Negative tip percentage
* Negative tax percentage
* Zero people
* Negative people
* Non-numeric values

Recommended practical limits:

```text
Bill amount > 0
Tip percentage >= 0
Tax percentage >= 0
People >= 1
```

Validation must produce a clear user-facing message.

The application must never display `NaN`, `Infinity`, or undefined calculation results.

---

# 4. Split Bill History

## 4.1 Storage

History must be stored using browser `localStorage`.

Storage key:

```text
split-bill-history
```

## 4.2 History Record

A history entry should contain enough information to reproduce the calculation, including:

* Unique ID
* Timestamp
* Bill amount
* Tip percentage
* Tax percentage
* Number of people
* Optional notes
* Grand total
* Per-person amount

## 4.3 History Features

The user can:

* Save a calculation
* View previous calculations
* Clear history

The history should have a useful empty state.

A reasonable history limit may be applied to prevent unlimited localStorage growth.

---

# 5. Task 2 — Parking Fee Calculator

## 5.1 Purpose

Calculate parking fees correctly for sessions that may:

* Stay within one day
* Cross midnight
* Span multiple days
* Reach a daily pricing cap

The calculation must never incorrectly produce negative duration when a parking session crosses midnight.

## 5.2 Inputs

* Entry datetime
* Exit datetime
* Vehicle type
* Weekend indicator where applicable

## 5.3 Outputs

Display:

* Total parking duration
* Itemized pricing/tier information
* Applicable surcharges
* Final parking fee

Invalid chronological ranges must result in an `INVALID` calculation state.

---

# 6. Parking Pricing Rules

The supplied task description references pricing rules in a README but does not provide the exact pricing table in the challenge material available to us.

Therefore, this project explicitly defines the following implementation rules and treats them as the project's authoritative business rules.

These rules must be centralized in the parking calculation logic so that they can be changed without modifying the UI.

## 6.1 Base Pricing

For a standard vehicle:

```text
First hour: ₹40
Hours 2–4: ₹30/hour
Hours 5–8: ₹20/hour
Hours beyond 8: ₹15/hour
```

## 6.2 Daily Cap

The maximum base parking charge for a continuous 24-hour parking period is:

```text
₹250
```

The daily cap must apply to the calculated charge for each applicable 24-hour parking period.

The implementation must not incorrectly apply the daily cap to every partial hour.

## 6.3 Vehicle Surcharges

Vehicle type:

### Car

```text
No surcharge
```

### Motorcycle

```text
20% discount on base parking fee
```

### SUV

```text
20% surcharge on base parking fee
```

## 6.4 Weekend Surcharge

For a weekend parking session:

```text
10% surcharge on the applicable base parking fee
```

The weekend surcharge must be applied after base pricing and before final rounding.

## 6.5 Pricing Calculation Order

Use:

```text
1. Calculate valid duration
2. Calculate base tier charge
3. Apply daily cap
4. Apply vehicle adjustment
5. Apply weekend surcharge
6. Round final monetary result to two decimals
```

The exact implementation should remain centralized and testable.

---

# 7. Parking Duration Rules

Duration must be calculated using datetime values rather than manually subtracting clock-hour components.

Examples:

```text
22:00 → 02:00 next day
= 4 hours
```

```text
23:30 → 01:30 next day
= 2 hours
```

```text
10:00 → 13:30
= 3.5 hours
```

## Invalid ranges

The following are invalid:

```text
Exit before entry
Missing entry
Missing exit
Malformed datetime
```

An invalid range must never result in a negative parking duration.

---

# 8. Parking Billing Granularity

Parking is billed in hourly increments.

For partial hours, round the billable duration upward to the next whole hour.

Example:

```text
2 hours 10 minutes
→ 3 billable hours
```

A duration of exactly:

```text
2 hours
```

remains:

```text
2 billable hours
```

This rule must be covered by unit tests.

---

# 9. User Interface Requirements

The application should provide a unified interface containing both calculators.

Recommended navigation:

```text
Split Bill
Parking Fee
```

The UI should be:

* Responsive
* Clear
* Simple
* Easy to understand
* Keyboard accessible
* Consistent in styling

Inputs should provide:

* Clear labels
* Sensible defaults where appropriate
* Immediate validation
* Useful error messages

Calculation results should be visually separated from input controls.

---

# 10. Error Handling

Errors must be handled gracefully.

The UI must not expose:

* Stack traces
* Raw JavaScript errors
* `NaN`
* `Infinity`
* Undefined values

Examples of user-facing messages:

```text
Please enter a valid bill amount.
```

```text
Number of people must be at least 1.
```

```text
Exit time must be later than entry time.
```

---

# 11. Testing Requirements

Important business logic must be independently testable.

## Split Bill Tests

At minimum:

* Standard calculation
* Zero tip
* Zero tax
* Multiple people
* Invalid bill
* Invalid party size
* Rounding

## Parking Tests

At minimum:

* Same-day session
* Crossing midnight
* Multi-day session
* Invalid date range
* Exact hourly boundary
* Partial-hour rounding
* Daily cap
* Vehicle adjustment
* Weekend surcharge

Tests must actually be executed before declaring the implementation complete.

---

# 12. Security Requirements

The application must not require API credentials.

Do not hardcode secrets.

Do not commit `.env` files containing secrets.

User-entered calculation data is local application data and must not be transmitted to external services.

---

# 13. Technology Constraints

Preferred stack:

* React
* TypeScript
* Vite
* CSS
* Vitest

No backend is required.

No database is required.

No external API is required.

No authentication is required.

Use `localStorage` for Task 1 history.

---

# 14. Out of Scope

The following are explicitly outside the MVP:

* Authentication
* User accounts
* Backend server
* Cloud database
* Payment processing
* Multi-user synchronization
* External APIs
* Advanced analytics
* Individual bill payment settlement
* Advanced parking reservation functionality
* Deployment infrastructure
* CI/CD pipeline

These may be mentioned as future improvements but should not be implemented unless all required functionality is complete and time remains.

---

# 15. Definition of Done

The challenge implementation is considered complete when:

* Both calculators work end-to-end.
* Split bill calculations are correct.
* Parking duration handles midnight correctly.
* Parking pricing follows the documented rules.
* Invalid input is handled gracefully.
* Split bill history persists using localStorage.
* Important business logic has unit tests.
* Tests pass.
* Production build succeeds.
* UI is usable and responsive.
* README.md is complete.
* prompt.md documents AI prompts used.
* No secrets are committed.
* Repository is clean and ready for submission.
