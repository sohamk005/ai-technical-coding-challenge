# AI Technical Coding Challenge — Architecture

## 1. Overview

The application is a lightweight React + TypeScript web application containing two independent calculation features:

```text
                    Application
                         |
              +----------+----------+
              |                     |
        Split Bill             Parking Fee
              |                     |
       React Components       React Components
              |                     |
       Business Logic         Business Logic
              |                     |
         localStorage          Pure Functions
```

The architecture intentionally avoids unnecessary backend infrastructure because the challenge requirements do not require server-side persistence or external services.

---

# 2. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* CSS

## Testing

* Vitest

## Persistence

* Browser localStorage

---

# 3. Architectural Principles

The implementation follows these principles:

1. Keep business logic separate from UI.
2. Prefer pure calculation functions.
3. Keep state close to the feature that owns it.
4. Validate user input at the UI boundary.
5. Keep business rules centralized.
6. Avoid unnecessary dependencies.
7. Make important logic independently testable.
8. Prefer simple solutions appropriate for a timed MVP.

---

# 4. Component Architecture

A reasonable structure is:

```text
App
 |
 +-- Navigation
 |
 +-- SplitBillCalculator
 |      |
 |      +-- Input controls
 |      +-- Breakdown
 |      +-- History
 |
 +-- ParkingFeeCalculator
        |
        +-- Input controls
        +-- Fee breakdown
```

Components are responsible primarily for:

* Rendering
* User interaction
* Local UI state
* Displaying validation errors
* Connecting UI to business logic

Components should not contain large pricing algorithms.

---

# 5. Business Logic

Business logic is implemented independently from React.

## Split Bill

Conceptually:

```text
calculateSplitBill(input)
        |
        +-- validate input
        |
        +-- calculate tip
        |
        +-- calculate tax
        |
        +-- calculate total
        |
        +-- calculate per-person value
        |
        +-- return result
```

## Parking

Conceptually:

```text
calculateParkingFee(input)
        |
        +-- validate datetime
        |
        +-- calculate elapsed duration
        |
        +-- calculate billable hours
        |
        +-- apply pricing tiers
        |
        +-- apply daily cap
        |
        +-- apply vehicle adjustment
        |
        +-- apply weekend surcharge
        |
        +-- return itemized result
```

---

# 6. LocalStorage Architecture

Split bill history is persisted locally.

```text
React Component
      |
      v
History Service
      |
      v
localStorage
      |
      v
split-bill-history
```

The UI should not contain raw localStorage manipulation throughout multiple components.

A small history utility/service should encapsulate:

* Reading history
* Writing history
* Adding entries
* Clearing entries

---

# 7. Validation

Validation occurs before business logic executes.

```text
User Input
    |
    v
Validation
    |
   / \
valid invalid
 |      |
 v      v
Business  Error
Logic     Message
```

Examples:

```text
Bill <= 0
→ invalid
```

```text
People < 1
→ invalid
```

```text
Exit <= Entry
→ invalid
```

---

# 8. Parking Pricing Architecture

Parking pricing must be centralized.

The pricing configuration should not be duplicated across components.

Conceptually:

```text
Parking Rules
     |
     +-- Hourly tiers
     +-- Daily cap
     +-- Vehicle adjustments
     +-- Weekend surcharge
```

The calculation engine consumes these rules.

This makes it possible to change pricing without rewriting the UI.

---

# 9. Data Flow

## Split Bill

```text
User Input
    ↓
React State
    ↓
Validation
    ↓
calculateSplitBill()
    ↓
Calculation Result
    ↓
Breakdown UI
```

When the user saves the result:

```text
Calculation Result
    ↓
History Service
    ↓
localStorage
```

## Parking

```text
Entry / Exit / Vehicle
          ↓
       Validation
          ↓
 calculateParkingFee()
          ↓
   Parking Result
          ↓
    Result UI
```

---

# 10. Error Handling

Errors should be represented as application-level validation states rather than raw runtime failures.

For example:

```text
InvalidInput
```

or a structured result containing:

```text
success
error
data
```

The exact implementation may use a simpler approach if appropriate, but the UI must always receive predictable states.

---

# 11. Testing Architecture

Pure business logic should be tested independently.

```text
                 Business Logic
                  /          \
                 /            \
             Split Bill     Parking
                 |             |
                 v             v
             Unit Tests     Unit Tests
```

React component testing may be added where useful, but calculation correctness is the highest testing priority.

---

# 12. Why No Backend?

The challenge does not require:

* Authentication
* Server-side data
* Shared user accounts
* External APIs
* Cloud persistence

Task 1 specifically asks for local history.

Therefore a backend would increase implementation time and failure risk without improving the required solution.

A backend could be introduced later if requirements change.

---

# 13. Scalability Considerations

The current architecture is intentionally optimized for a small MVP.

If the product were expanded, possible improvements would include:

* Backend persistence
* User accounts
* Database-backed history
* Configurable parking rules
* International currency support
* End-to-end testing
* Analytics
* Deployment infrastructure

These are intentionally excluded from the timed challenge implementation.

---

# 14. Architectural Trade-off

The primary trade-off is simplicity versus extensibility.

The application avoids excessive abstraction because the challenge has a strict 120-minute limit.

At the same time, business logic is kept separate from UI so that:

* It remains testable.
* It remains understandable.
* Pricing rules can be changed.
* The code can be defended during technical evaluation.
