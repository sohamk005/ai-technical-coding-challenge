AI Prompt History

This file records the actual AI prompts used during the AI Technical Coding Challenge.

The prompts document the AI-assisted development process, including:

Requirements contextualization

Architecture and technology decisions

Incremental implementation

Testing and edge-case handling

QA and refinement

Final verification

The human developer remained responsible for requirements, architecture approval, business-rule decisions, verification, Git commits, and final submission.

Prompt 1 — Repository Understanding and Project Initialization

You are the implementation agent for an AI Technical Coding Challenge.

This is a strict 120-minute coding challenge. The goal is to ship a functional, tested, clean and documented solution rather than over-engineering the application.

Challenge

We are building a web application with two features:

Split Bill Calculator

Parking Fee Calculator

The complete requirements are documented in:

README.md

CHALLENGE_REQUIREMENTS.md

ARCHITECTURE.md

IMPLEMENTATION_PLAN.md

Read ALL of these files before making any changes.

CHALLENGE_REQUIREMENTS.md is the authoritative functional requirement document.

IMPLEMENTATION_PLAN.md defines the milestone process and acceptance criteria.

Do not invent requirements that are not documented.

Development Method

This project is being developed using controlled milestones.

You are currently working ONLY on:

Milestone 0 — Repository Initialization

You MUST NOT implement:

Split Bill Calculator

Split Bill History

Parking Fee Calculator

Parking pricing logic

Calculator UI

Those belong to later milestones.

Do not move to the next milestone automatically.

Milestone 0 Objectives

Prepare a clean React + TypeScript + Vite development foundation.

Tasks:

Inspect the existing repository and documentation.

Initialize/configure the React + TypeScript + Vite application if it is not already initialized.

Configure a sensible project structure suitable for the architecture described in ARCHITECTURE.md.

Install only the dependencies actually required for the project.

Configure Vitest for future unit testing if appropriate for the chosen setup.

Ensure .gitignore is correct.

Ensure no secrets or .env files containing credentials are introduced.

Ensure the application can run locally.

Ensure the production build succeeds.

Do not add unnecessary libraries, backend infrastructure, APIs, authentication, database systems, or deployment infrastructure.

Architecture Expectations

Follow the architecture described in ARCHITECTURE.md.

The project should be structured so that:

UI components remain separate from business logic.

Split Bill calculation logic can later be tested independently.

Parking calculation logic can later be tested independently.

LocalStorage handling can later be isolated into a small service/utility.

Business rules are not buried inside large React components.

Do not over-engineer this.

The challenge has a strict time limit.

Prefer a simple, understandable structure that can be implemented quickly and defended during a technical evaluation.

Technology

Use:

React

TypeScript

Vite

CSS

Vitest for testing

Do not introduce a UI framework, state-management library, backend framework, database, API service, authentication system, or other major dependency unless there is a documented requirement for it.

Git Rules

You MUST NOT create a Git commit.

Git commits are controlled manually by the human reviewer.

Do not run commands that create commits.

Do not push to GitHub.

After completing this milestone, stop and provide a report.

Verification

Before stopping, verify:

Dependencies install successfully.

Development server can start.

Production build succeeds.

Testing configuration is valid if configured.

There are no obvious TypeScript/build errors.

No secrets were introduced.

Do not spend time on visual polish.

Do not implement application features.

Required Final Report

When finished, provide a concise but complete report containing:

1. Summary

What was implemented during Milestone 0.

2. Files Added

List every important file added.

3. Files Modified

List every important file modified.

4. Dependencies

List dependencies added and explain briefly why each is required.

5. Commands Executed

List important commands used for setup and verification.

6. Verification Results

Explicitly report:

Development server result

Production build result

Test configuration/result

TypeScript result if separately checked

7. Requirements Check

Compare the implementation against the Milestone 0 acceptance criteria from IMPLEMENTATION_PLAN.md.

Use:

PASS / FAIL / NOT APPLICABLE

for each criterion.

8. Issues / Risks

List anything that still needs attention.

9. STOP

After providing this report, STOP.

Do NOT:

implement the calculators

move to Milestone 1

modify unrelated documentation

perform UI polish

create a Git commit

push changes

Wait for human review.

Prompt 2 — Split Bill Complete MVP

You are continuing the AI Technical Coding Challenge implementation.

TIME CONSTRAINT

This is a strict 120-minute coding challenge.

A significant portion of the challenge time has already been used, so prioritize shipping a complete, correct MVP quickly.

Do not spend time on unnecessary abstractions, infrastructure, animations, or features outside the requirements.

The goal of this milestone is to make Task 1 functionally complete, not merely partially implemented.

1. READ THE PROJECT CONTEXT FIRST

Before changing code, inspect:

README.md

CHALLENGE_REQUIREMENTS.md

ARCHITECTURE.md

IMPLEMENTATION_PLAN.md

prompt.md

Treat these as the project's current source of truth.

The original challenge requirements are also reflected in these core requirements:

Task 1 — Split Bill Calculator

The user must be able to enter:

Bill total

Tip percentage

Tax percentage (optional)

Number of people

Optional item notes

The application must show:

Subtotal

Tip amount

Tax amount

Grand total

Per-person amount

Transparent calculation breakdown

Simple calculation history stored in browser localStorage

The application should allow numbers to be easily adjusted through inputs and should update totals immediately.

The rounding approach must be clearly explained, including equal splitting versus remainder handling.

2. CURRENT MILESTONE

Implement:

TASK 1 — COMPLETE MVP

This milestone includes BOTH:

Split Bill calculation

Split Bill localStorage history

Do NOT postpone history to another milestone.

Do NOT implement Task 2 yet.

3. IMPLEMENT THE CALCULATION ENGINE FIRST

Create a pure, independently testable calculation function.

Input:

billAmount
tipPercentage
taxPercentage
people

Output should contain:

subtotal
tipAmount
taxAmount
grandTotal
perPerson

Use:

tipAmount = subtotal × tipPercentage / 100

taxAmount = subtotal × taxPercentage / 100

grandTotal = subtotal + tipAmount + taxAmount

perPerson = grandTotal / people

Tax and tip are calculated from the subtotal.

For:

Bill = 100
Tip = 18%
Tax = 8%
People = 4

the result must be:

Subtotal = 100
Tip = 18
Tax = 8
Grand Total = 126
Per Person = 31.50

Use consistent currency rounding to two decimal places.

Do not put calculation logic directly inside the React JSX.

4. INPUTS

Implement these inputs:

Required

Bill amount

Tip percentage

Number of people

Optional

Tax percentage

Item notes

Use normal inputs or sliders where useful.

Do NOT waste time implementing complicated slider components.

Simple accessible number inputs are completely acceptable because the requirement says "sliders or inputs."

5. IMMEDIATE CALCULATION

Totals must update immediately when valid inputs change.

Do not require a separate Calculate button for the primary workflow.

The user should be able to adjust:

Bill
Tip
Tax
People

and immediately see the updated result.

6. VALIDATION

Handle invalid input gracefully.

Reject:

Empty bill

Bill <= 0

Negative tip

Negative tax

People < 1

Non-numeric values

Do not allow:

NaN
Infinity
undefined
negative calculated totals

Use clear user-facing validation messages.

Examples:

Please enter a valid bill amount.

Number of people must be at least 1.

Tax may be omitted and should behave as 0%.

7. CALCULATION BREAKDOWN

The result must be transparent.

Show something similar to:

Subtotal                 $100.00
Tip (18%)                 $18.00
Tax (8%)                   $8.00
--------------------------------
Grand Total              $126.00

$126.00 ÷ 4 people
= $31.50 per person

The user must be able to understand how the final number was produced.

8. ROUNDING / REMAINDER HANDLING

The challenge specifically requires the rounding rules to be explained.

Implement the MVP using an equal split:

perPerson = grandTotal / people

Round the displayed currency amount to two decimal places.

Clearly explain in the UI that:

Equal split divides the grand total evenly.

Displayed values are rounded to two decimal places.

If exact individual payment allocation is required, a remainder-cent strategy can distribute leftover cents so individual payments sum exactly to the grand total.

Do NOT over-engineer individual payment allocation unless it can be implemented quickly without risking the core MVP.

The explanation itself is required.

9. LOCAL STORAGE HISTORY

This is REQUIRED as part of Task 1.

Implement a simple history list using browser localStorage.

Use a single clear storage key such as:

split-bill-history

Each history item should contain enough information to understand the calculation, including:

Unique ID

Timestamp

Bill amount

Tip percentage

Tax percentage

Number of people

Optional notes

Grand total

Per-person amount

Implement:

Save

Allow the user to save the current calculation.

View

Display recent saved calculations in a simple readable history list.

Clear

Allow the user to clear history.

Empty state

If there are no saved calculations, show a useful empty state.

Persistence

History must survive a browser refresh.

Error handling

If localStorage contains malformed/unexpected data, the application should fail gracefully rather than crash.

Do not create a backend or database.

10. UI

Create a clean, professional calculator interface suitable for technical evaluation.

Required:

Clear labels

Accessible inputs

Responsive layout

Immediate calculation

Clear result hierarchy

Breakdown section

History section

Validation messages

Empty history state

Do not spend significant time on:

Complex animations

Advanced design systems

External UI frameworks

Dark mode

Authentication

Backend infrastructure

Functionality and correctness have priority.

11. TESTS

Add focused automated tests for the business logic.

At minimum test:

Normal calculation

100 / 18% / 8% / 4
→ 126 total
→ 31.50 per person

Zero tip

Zero tax

Multiple people

Invalid bill

Invalid party size

Negative percentage

Rounding scenario

Optional tax omitted

If practical, test the history/localStorage utility as well.

Do not create dozens of low-value tests.

Prioritize business behavior and edge cases.

12. ARCHITECTURE

Keep responsibilities separated.

Prefer a structure similar to:

React Component
      ↓
Validation
      ↓
Split Bill Calculation Function
      ↓
Result

and:

History Component
      ↓
History Utility
      ↓
localStorage

Do not duplicate calculation logic across components.

Do not put all functionality into App.tsx.

Do not introduce state-management libraries.

13. SECURITY

No external API is required.

Do not introduce API keys.

Do not create or commit secrets.

Do not store anything sensitive.

User calculation history should remain local to the browser.

14. VERIFICATION

Before stopping, actually execute:

npm test
npm run typecheck
npm run build

Also manually verify the main workflow if possible.

At minimum verify:

Enter 100

Enter 18% tip

Enter 8% tax

Enter 4 people

Confirm $126 total

Confirm $31.50 per person

Change an input and confirm immediate update

Save calculation

Refresh page

Confirm history remains

Clear history

Try invalid input

Fix failures before reporting completion.

15. DO NOT IMPLEMENT TASK 2

Do NOT implement:

Parking calculator

Parking pricing

Parking duration

Midnight handling

Vehicle pricing

Those belong to the next milestone.

16. GIT

DO NOT commit.

DO NOT push.

The human reviewer controls Git checkpoints.

17. STOP CONDITION

Stop when Task 1 satisfies all of these:

Inputs work

Tip works

Optional tax works

Party size works

Optional notes work

Immediate calculation works

Subtotal displayed

Tip displayed

Tax displayed

Grand total displayed

Per-person amount displayed

Transparent breakdown displayed

Rounding explanation displayed

History saved to localStorage

History displayed

History survives refresh

History can be cleared

Invalid input handled

Tests pass

TypeScript passes

Production build passes

Do NOT continue to Task 2 after this.

18. FINAL REPORT

When the milestone is complete, STOP and report:

Summary

What was implemented.

Files Added

List files.

Files Modified

List files.

Calculation Logic

Where the calculation logic lives.

History

How localStorage history works.

Validation

What validation was implemented.

Tests

Tests added and results.

Verification

Report:

npm test

npm run typecheck

npm run build

manual verification

Acceptance Criteria

Mark every item above PASS or FAIL.

Issues

List anything remaining.

STOP

Do not:

start Task 2

perform additional polish

create a Git commit

push to GitHub

Wait for human review.

Prompt 3 — Parking Fee Calculator

You are continuing the AI Technical Coding Challenge.

TIME CONSTRAINT

This is a strict 120-minute challenge and significant time has already elapsed.

Prioritize correctness and shipping the complete Task 2 MVP.

Do not spend time on unnecessary abstractions, visual polish, infrastructure, or features outside the requirements.

1. READ THE PROJECT CONTEXT

Before implementation, inspect:

README.md

CHALLENGE_REQUIREMENTS.md

ARCHITECTURE.md

IMPLEMENTATION_PLAN.md

Existing Split Bill implementation

Do not break or rewrite the existing Split Bill functionality.

The existing Task 1 implementation is already complete and tested.

2. CURRENT MILESTONE

Implement ONLY:

Task 2 — Parking Fee Calculator

Do not modify the completed Split Bill functionality except where necessary to integrate navigation.

Do not implement:

Backend

Database

Authentication

External APIs

Parking reservations

User accounts

Advanced features

3. PARKING INPUTS

Create a small, clean form with:

Entry datetime

Exit datetime

Vehicle type

Weekend flag

Vehicle types:

Car

Motorcycle

SUV

The user must be able to easily enter local date/time values.

Use a native datetime-local input unless there is a strong reason not to.

4. DURATION CALCULATION — CRITICAL

This is the primary bug scenario described by the challenge.

DO NOT calculate duration by subtracting clock-hour components.

For example, this MUST work:

Entry: 2026-08-26 22:00
Exit:  2026-08-27 02:30

Elapsed duration = 4 hours 30 minutes
Billable hours = 5

Another example:

Entry: 2026-08-26 23:30
Exit: 2026-08-27 01:30

Elapsed duration = 2 hours
Billable hours = 2

Another:

Entry: 2026-08-26 10:00
Exit: 2026-08-26 13:10

Elapsed duration = 3 hours 10 minutes
Billable hours = 4

Use actual datetime arithmetic.

Do not manually subtract hours/minutes.

5. INVALID RANGES

The calculation must reject:

Missing entry

Missing exit

Invalid/malformed datetime

Exit equal to entry

Exit before entry

Invalid ranges must result in an INVALID state.

Never produce:

Negative duration

Negative hours

NaN

Infinity

Undefined fee

The UI should explain the invalid input.

Example:

Exit time must be later than entry time.

6. BILLABLE HOURS

Parking is billed in hourly increments.

Round partial hours UP.

Examples:

2 hours 00 minutes → 2 billable hours

2 hours 01 minute → 3 billable hours

2 hours 59 minutes → 3 billable hours

4 hours 30 minutes → 5 billable hours

Do not round to nearest hour.

Do not truncate partial hours.

7. PRICING RULES

Use the parking business rules documented in:

CHALLENGE_REQUIREMENTS.md

Do NOT invent a different pricing system.

Current rules:

Standard hourly pricing

First hour: ₹40
Hours 2–4: ₹30/hour
Hours 5–8: ₹20/hour
Hours beyond 8: ₹15/hour

Therefore, for 1 billable hour:

₹40

For 2 hours:

₹40 + ₹30 = ₹70

For 4 hours:

₹40 + ₹30 + ₹30 + ₹30 = ₹130

For 5 hours:

₹40 + ₹30 + ₹30 + ₹30 + ₹20 = ₹150

For 8 hours:

₹40 + ₹30 + ₹30 + ₹30 + ₹20 + ₹20 + ₹20 + ₹20
= ₹210

For hours beyond 8, use ₹15/hour.

8. DAILY CAP — CRITICAL

Daily maximum base parking charge:

₹250

The challenge specifically mentions that the daily maximum can currently be applied incorrectly to partial hours.

Do NOT simply calculate:

min(hourlyTotal, 250)

for every arbitrary session without considering the duration/billing period.

Implement the documented continuous 24-hour billing-period approach.

For each continuous 24-hour parking period:

Calculate the applicable billable hours.

Calculate the tiered base charge.

Apply the ₹250 base cap to that period.

Continue into the next 24-hour period if necessary.

Do not let the daily cap incorrectly reset at calendar midnight.

This is important:

Parking:
22:00 Aug 26
→ 02:00 Aug 27

This is 4 elapsed hours, NOT a new "day" at midnight.

The cap must be based on the defined billing period, not simply the calendar date.

9. VEHICLE ADJUSTMENTS

Apply the documented vehicle rules:

Car

No adjustment

Motorcycle

20% discount on base parking fee

SUV

20% surcharge on base parking fee

Keep vehicle adjustment logic centralized and testable.

10. WEEKEND SURCHARGE

If the weekend flag is enabled:

10% surcharge

Apply the surcharge after the applicable base/vehicle calculation according to the documented calculation order.

Do not apply the surcharge twice.

11. CALCULATION ORDER

Use this order:

1. Validate input
        ↓
2. Calculate exact elapsed duration
        ↓
3. Round partial hour upward
        ↓
4. Calculate tiered base parking fee
        ↓
5. Apply daily cap
        ↓
6. Apply vehicle adjustment
        ↓
7. Apply weekend surcharge
        ↓
8. Round final monetary value to 2 decimals

Keep this logic in a pure calculation module.

Do NOT put the pricing algorithm inside the React component.

12. ITEMIZED OUTPUT

The UI must clearly show:

Parking Duration
Billable Hours

Base Parking
Daily Cap / Tier Information
Vehicle Adjustment
Weekend Surcharge
-------------------------
Final Fee

For example:

Duration             4h 30m
Billable Hours       5

Base Parking         ₹150.00
Vehicle Adjustment     ₹0.00
Weekend Surcharge      ₹0.00
-----------------------------
Final Fee            ₹150.00

The exact displayed breakdown should reflect the actual calculation.

Do not display misleading line items if they were not applied.

13. ARCHITECTURE

Create a pure parking calculation module separate from React.

Prefer a structure similar to:

src/
  logic/
    parkingFee.ts
    parkingFee.test.ts

  types/
    parkingFee.ts

  components/
    parking/
      ParkingFeeCalculator.tsx

Adapt to the existing project structure rather than creating unnecessary files.

The parking logic should be independently testable.

The UI should primarily handle:

Input

State

Validation display

Calling the calculation function

Rendering results

14. TESTS — HIGH PRIORITY

Write focused tests for the business logic.

At minimum test:

Duration

Same-day session

10:00 → 13:00
= 3 hours

Crossing midnight

22:00 → 02:00
= 4 hours

Crossing midnight with partial hour

22:00 → 02:30
= 4.5 hours
= 5 billable hours

Multi-day session

Verify the duration is positive and correct.

Exit before entry

Expected:

INVALID

Equal entry and exit

Expected:

INVALID

Tier pricing

Test at least:

1 hour
2 hours
4 hours
5 hours
8 hours
9 hours

Daily cap

Test:

Below cap

Exactly at/within cap

Above cap

A session crossing midnight

A session crossing a 24-hour boundary

Vehicle

Test:

Car

Motorcycle

SUV

Weekend

Test:

Weekday/no surcharge

Weekend surcharge

Final fee

Verify the final fee calculation and rounding.

Do not create dozens of redundant tests.

Focus on the exact business bugs described by the challenge.

15. DO NOT BREAK TASK 1

After implementation:

Run the complete test suite.

The existing Split Bill tests must continue to pass.

Do not remove or weaken existing tests.

Do not rewrite the Split Bill calculation merely to make the new feature fit.

16. UI INTEGRATION

Add Parking Fee to the existing navigation.

The application should now have:

[ Split Bill ]    [ Parking Fee ]

Clicking Parking Fee should display the new calculator.

Keep the existing Split Bill workflow working.

17. TIME MANAGEMENT

Do NOT spend significant time on visual redesign.

Use the existing application styling and extend it consistently.

Prioritize:

Correct duration

Correct pricing

Daily cap

Validation

Tests

Working UI

Basic visual consistency

18. VERIFICATION

Run:

npm test
npm run typecheck
npm run build

Then manually verify at least:

Case 1

Entry: 22:00
Exit: 02:00 next day

Confirm duration is positive.

Case 2

Entry: 22:00
Exit: 02:30 next day

Confirm 5 billable hours.

Case 3

Exit before entry.

Confirm INVALID.

Case 4

A normal daytime parking session.

Confirm tier pricing.

Case 5

A session long enough to reach the daily cap.

Confirm cap behavior.

Case 6

Motorcycle.

Confirm discount.

Case 7

SUV.

Confirm surcharge.

Case 8

Weekend enabled.

Confirm weekend surcharge.

Also verify that Task 1 still works.

19. GIT

DO NOT commit.

DO NOT push.

The human reviewer will review the milestone first.

20. STOP CONDITION

STOP when:

Parking form works.

Datetimes work.

Midnight works.

Multi-day duration works.

Invalid ranges work.

Partial-hour billing works.

Tiered pricing works.

Daily cap works.

Vehicle adjustment works.

Weekend surcharge works.

Itemized output works.

Tests pass.

Existing Task 1 tests still pass.

TypeScript passes.

Production build passes.

Do NOT proceed to additional UI polish or unrelated features.

21. FINAL REPORT

Return a concise report containing:

Summary

What was implemented.

Files Added

Important files.

Files Modified

Important files.

Parking Logic

Where duration and pricing logic live.

Duration Handling

Explain how midnight and multi-day sessions are handled.

Pricing

Explain tier and cap implementation.

Tests

List important tests and total passing tests.

Verification

Report:

npm test

npm run typecheck

npm run build

manual scenarios

Acceptance Criteria

Mark each Task 2 criterion:

PASS / FAIL

Issues

Any remaining problems or assumptions.

STOP

Do not:

start additional features

rewrite Task 1

perform unnecessary polish

commit

push

Wait for human review.

Prompt 4 — Final QA, Bug Fixes and Presentation Polish

Milestone 3 — Final QA, Bug Fixes and Presentation Polish

We are now in the final QA and polish phase of the AI Technical Coding Challenge.

IMPORTANT:

Both required tasks are already implemented.

DO NOT rebuild the application.

DO NOT introduce new features.

DO NOT add backend infrastructure.

DO NOT add authentication.

DO NOT add a database.

DO NOT rewrite working business logic unnecessarily.

The priority is to find and fix real issues and make the existing application submission-ready.

We have limited time remaining.

READ FIRST

Read:

README.md

CHALLENGE_REQUIREMENTS.md

ARCHITECTURE.md

IMPLEMENTATION_PLAN.md

prompt.md

Also inspect the complete existing implementation.

1. RUN THE COMPLETE TEST SUITE FIRST

Run:

npm test

npm run typecheck

npm run build

Do not change code before knowing the current baseline.

2. REVIEW TASK 1

Verify the existing Split Bill implementation.

Check:

Bill amount

Tip %

Optional tax

People

Notes

Immediate calculation

Subtotal

Tip

Tax

Grand total

Per-person amount

Breakdown

Rounding explanation

Save history

History persistence

Load/restore

Delete

Clear history

Invalid inputs

localStorage corruption handling

Do not change working functionality merely for stylistic reasons.

3. REVIEW TASK 2

Verify:

Entry datetime

Exit datetime

Vehicle type

Weekend flag

Same-day duration

Midnight crossing

Multi-day duration

Partial-hour rounding

Tier pricing

Continuous 24-hour cap

Vehicle adjustments

Weekend surcharge

INVALID state

Itemized breakdown

Pay particular attention to:

Midnight

22:00 → 02:00 next day must be positive.

Partial hour

22:00 → 02:30 must produce 5 billable hours.

Daily cap

The cap must operate according to the documented continuous 24-hour rule, not reset incorrectly at midnight.

4. UI/UX REVIEW

Perform a quick visual review.

Fix only genuine usability/presentation problems.

Check:

Navigation

Responsive layout

Input labels

Button clarity

Result hierarchy

Error visibility

History readability

Empty states

Parking breakdown readability

Consistent typography

Consistent spacing

Mobile layout

Keyboard accessibility

Focus states

Do NOT spend time creating elaborate animations or unnecessary visual effects.

The UI should look polished enough for an evaluator to use immediately.

5. CONSOLE / RUNTIME REVIEW

Check for:

Console errors

React warnings

Unhandled exceptions

Broken navigation

Broken localStorage behavior

Broken calculations

Fix genuine problems.

6. TEST COVERAGE REVIEW

Do not write dozens of tests.

Check whether the tests cover the most important business risks.

Especially:

Split Bill

Standard calculation

Zero tip/tax

Invalid inputs

Uneven split rounding

History persistence

Parking

Midnight

Partial hour

Invalid range

Tier boundaries

Daily cap

Multi-day

Vehicle adjustment

Weekend surcharge

If a critical scenario is missing, add a focused test.

7. DOCUMENTATION CONSISTENCY

Check that README.md, CHALLENGE_REQUIREMENTS.md, and ARCHITECTURE.md accurately describe the ACTUAL implementation.

Do not claim features that do not exist.

Do not remove required challenge documentation.

Do not fabricate external requirements.

If documentation contains outdated statements, correct only those statements.

8. prompt.md

Ensure prompt.md records the actual prompts used during development.

Do not invent prompts that were never used.

Include:

Milestone 0 prompt

Milestone 1 prompt

Milestone 2 prompt

Final QA prompt

Include brief iteration notes where appropriate.

9. FINAL SECURITY CHECK

Verify:

No API keys

No passwords

No secrets

No .env files with credentials

No unnecessary generated files

.gitignore is correct

10. FINAL VERIFICATION

After all fixes:

npm test

npm run typecheck

npm run build

All must pass.

If you make a code change after testing, run the affected tests again and then perform the final complete verification.

11. IMPORTANT — NO NEW FEATURES

Do not implement:

Authentication

Backend

Database

Cloud sync

Accounts

Advanced analytics

Payment processing

New calculator types

Unrequested features

We are finishing the challenge, not expanding the project.

12. GIT

DO NOT commit.

DO NOT push.

Human reviewer controls the final commit.

13. FINAL REPORT

When finished, STOP.

Report:

Baseline

Test/typecheck/build status before changes.

Issues Found

List genuine issues discovered.

Fixes Made

List fixes.

Tests Added

List any new tests.

UI Changes

List meaningful UI/UX changes.

Documentation Changes

List documentation corrections.

Final Verification

Report:

npm test

npm run typecheck

npm run build

Final Acceptance

For each major Task 1 and Task 2 requirement:

PASS / FAIL

Remaining Risks

List anything that remains.

If there are no meaningful remaining issues, explicitly state that.

STOP after the report.

Do not commit or push.

Iteration Notes

Milestone 0

Initialized the React + TypeScript + Vite + Vitest foundation. Verified the development server, production build, test runner, TypeScript configuration, and repository hygiene.

Milestone 1

Implemented Task 1 as a complete MVP, including the pure Split Bill calculation engine, reactive validation, transparent breakdown, rounding/remainder explanation, and persistent localStorage history. The milestone finished with 26 passing tests.

Milestone 2

Implemented Task 2 as a complete MVP, including datetime-based duration calculation, midnight-safe handling, partial-hour billing, tiered pricing, continuous 24-hour cap handling, vehicle adjustments, weekend surcharge, itemized output, and 31 parking tests. The complete suite reached 57 passing tests.

Milestone 3

Performed final QA and presentation refinement. Added edge-case coverage for large split bills, one-minute and 59-minute parking sessions, multi-day cap behavior, and exact 24-hour boundaries. Added keyboard focus-visible styling and verified documentation/security/build status. Final suite reached 62 passing tests.

AI Development Principles

The AI agent was used as an implementation partner rather than an uncontrolled autonomous developer.

The human developer remained responsible for:

Requirements

Architecture approval

Business-rule decisions

Verification

Git commits

Final submission

The AI agent was responsible for:

Implementation

Refactoring where required

Tests

Debugging

Documentation updates

The implementation followed controlled milestones. The AI agent was instructed to stop after each milestone and wait for human review before proceeding.