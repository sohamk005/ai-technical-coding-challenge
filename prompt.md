# AI Prompt History

This file documents the AI prompts used during the AI Technical Coding Challenge.

The purpose is to demonstrate the AI-assisted development process, including:

* Requirements contextualization
* Architecture decisions
* Incremental implementation
* Testing
* Debugging
* Refinement
* Final verification

Prompts will be added as they are actually used during the challenge.

---

# Prompt 1 — Repository Understanding and Project Initialization

# Prompt 1 — Repository Understanding and Project Initialization

You are the implementation agent for an AI Technical Coding Challenge.

This is a strict 120-minute coding challenge. The goal is to ship a functional, tested, clean and documented solution rather than over-engineering the application.

## Challenge

We are building a web application with two features:

1. Split Bill Calculator
2. Parking Fee Calculator

The complete requirements are documented in:

- README.md
- CHALLENGE_REQUIREMENTS.md
- ARCHITECTURE.md
- IMPLEMENTATION_PLAN.md

Read ALL of these files before making any changes.

`CHALLENGE_REQUIREMENTS.md` is the authoritative functional requirement document.

`IMPLEMENTATION_PLAN.md` defines the milestone process and acceptance criteria.

Do not invent requirements that are not documented.

---

# Development Method

This project is being developed using controlled milestones.

You are currently working ONLY on:

## Milestone 0 — Repository Initialization

You MUST NOT implement:

- Split Bill Calculator
- Split Bill History
- Parking Fee Calculator
- Parking pricing logic
- Calculator UI

Those belong to later milestones.

Do not move to the next milestone automatically.

---

# Milestone 0 Objectives

Prepare a clean React + TypeScript + Vite development foundation.

Tasks:

1. Inspect the existing repository and documentation.
2. Initialize/configure the React + TypeScript + Vite application if it is not already initialized.
3. Configure a sensible project structure suitable for the architecture described in ARCHITECTURE.md.
4. Install only the dependencies actually required for the project.
5. Configure Vitest for future unit testing if appropriate for the chosen setup.
6. Ensure `.gitignore` is correct.
7. Ensure no secrets or `.env` files containing credentials are introduced.
8. Ensure the application can run locally.
9. Ensure the production build succeeds.
10. Do not add unnecessary libraries, backend infrastructure, APIs, authentication, database systems, or deployment infrastructure.

---

# Architecture Expectations

Follow the architecture described in `ARCHITECTURE.md`.

The project should be structured so that:

- UI components remain separate from business logic.
- Split Bill calculation logic can later be tested independently.
- Parking calculation logic can later be tested independently.
- LocalStorage handling can later be isolated into a small service/utility.
- Business rules are not buried inside large React components.

Do not over-engineer this.

The challenge has a strict time limit.

Prefer a simple, understandable structure that can be implemented quickly and defended during a technical evaluation.

---

# Technology

Use:

- React
- TypeScript
- Vite
- CSS
- Vitest for testing

Do not introduce a UI framework, state-management library, backend framework, database, API service, authentication system, or other major dependency unless there is a documented requirement for it.

---

# Git Rules

You MUST NOT create a Git commit.

Git commits are controlled manually by the human reviewer.

Do not run commands that create commits.

Do not push to GitHub.

After completing this milestone, stop and provide a report.

---

# Verification

Before stopping, verify:

1. Dependencies install successfully.
2. Development server can start.
3. Production build succeeds.
4. Testing configuration is valid if configured.
5. There are no obvious TypeScript/build errors.
6. No secrets were introduced.

Do not spend time on visual polish.

Do not implement application features.

---

# Required Final Report

When finished, provide a concise but complete report containing:

## 1. Summary

What was implemented during Milestone 0.

## 2. Files Added

List every important file added.

## 3. Files Modified

List every important file modified.

## 4. Dependencies

List dependencies added and explain briefly why each is required.

## 5. Commands Executed

List important commands used for setup and verification.

## 6. Verification Results

Explicitly report:

- Development server result
- Production build result
- Test configuration/result
- TypeScript result if separately checked

## 7. Requirements Check

Compare the implementation against the Milestone 0 acceptance criteria from `IMPLEMENTATION_PLAN.md`.

Use:

PASS / FAIL / NOT APPLICABLE

for each criterion.

## 8. Issues / Risks

List anything that still needs attention.

## 9. STOP

After providing this report, STOP.

Do NOT:

- implement the calculators
- move to Milestone 1
- modify unrelated documentation
- perform UI polish
- create a Git commit
- push changes

Wait for human review.

---

# Prompt 2 — Split Bill MVP

# Milestone 1 — Split Bill Complete MVP

Implemented the complete Split Bill feature MVP:
- Pure calculation engine (`src/logic/splitBill.ts`) computing subtotal, tip amount, tax amount, grand total, and per-person split with 2-decimal currency rounding.
- Real-time reactive input validation rejecting empty/negative bills, negative tip/tax, party size < 1, and non-numeric values.
- Immediate dynamic recalculations as inputs change.
- Transparent calculation breakdown with itemized table and per-person division formula.
- Clear in-UI explanation of the equal split rounding model and remainder-cent allocation strategy.
- Resilient localStorage history service (`src/services/historyStorage.ts`) supporting save, view, individual delete, and clear all with corrupted data fallback.
- Unit tests (`src/logic/splitBill.test.ts` and `src/services/historyStorage.test.ts`) covering all core requirements and edge cases.

---

# Prompt 3 — Split Bill History

*Implemented together in Milestone 1 per prompt instructions.*

---

# Prompt 4 — Parking Fee Calculator

# Milestone 2 — Parking Fee Calculator

Implemented the complete Parking Fee Calculator MVP:
- Pure parking calculation module (`src/logic/parkingFee.ts`) with robust datetime arithmetic (`calculateDuration`) properly handling same-day, midnight-crossing, multi-day, and invalid time ranges.
- Partial-hour upward billing rounding (`Math.ceil(diffMs / 3600000)`).
- Authoritative tiered hourly base pricing (1st hr: ₹40, hrs 2–4: ₹30/hr, hrs 5–8: ₹20/hr, hrs 9+: ₹15/hr).
- Continuous 24-hour cycle daily cap (₹250 max per 24h continuous period).
- Vehicle adjustments: Car (0%), Motorcycle (-20% discount), SUV (+20% surcharge).
- Weekend surcharge: +10% applied after vehicle adjustment.
- Transparent itemized breakdown component (`src/components/parking/ParkingBreakdown.tsx`) displaying base rate, cap savings, vehicle adjustment, weekend surcharge, and final fee in ₹ INR.
- Comprehensive unit tests (`src/logic/parkingFee.test.ts`) covering midnight crossing, multi-day durations, exact and partial hour boundaries, daily cap application, vehicle adjustments, weekend surcharges, and invalid ranges (31 tests, total 57 suite tests passing).

---

# Prompt 5 — Testing and Edge Cases

*Automated test suites were designed and expanded in Milestones 1 and 2, and augmented in Milestone 3 with edge cases for large parties, 1-minute and 59-minute partial-hour parking boundaries, dual-cycle daily caps, and 24-hour exact boundary sessions (62 passing tests).*

---

# Prompt 6 — UI/UX Refinement

*Implemented clean, accessible, and responsive styles across navigation tabs, Split Bill breakdowns, rounding policy cards, vehicle toggle pills, and parking breakdowns, with keyboard focus-visible outlines and error alerts.*

---

# Prompt 7 — Documentation

*All documentation files (`README.md`, `CHALLENGE_REQUIREMENTS.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, and `prompt.md`) reviewed and verified for strict consistency with the actual codebase.*

---

# Prompt 8 — Final QA

# Milestone 3 — Final QA, Bug Fixes and Presentation Polish

Performed exhaustive final verification and QA:
- Zero regressions in Task 1 (Split Bill Calculator & History) and Task 2 (Parking Fee Calculator).
- Expanded automated test coverage across edge boundaries (62 total unit tests passing).
- Verified TypeScript compilation (`tsc --noEmit`) with 0 errors.
- Verified production build (`tsc && vite build`) succeeding cleanly with no bundle errors or warnings.
- Verified absence of hardcoded credentials, secrets, or `.env` files.
- Refined focus-visible keyboard navigation and accessibility attributes.

---

# Iteration Notes

- **Milestone 0**: Initialized Vite + React + TypeScript + Vitest foundation, verified build and test runners.
- **Milestone 1**: Implemented Split Bill calculator pure logic, reactive validation, transparent breakdown, rounding policy text, and persistent localStorage history with full test coverage (26 passing tests).
- **Milestone 2**: Implemented Parking Fee calculator pure logic with datetime duration (midnight-safe), tiered pricing, ₹250 continuous 24h daily cap, vehicle adjustments, weekend surcharge, and itemized breakdown with full test coverage (57 passing tests total).
- **Milestone 3**: Performed final QA audit, augmented test suite to 62 tests covering minute boundaries and multi-day dual cap scenarios, added focus-visible accessibility styling, verified documentation consistency, and validated production build.



---

# AI Development Principles

The AI agent is treated as an implementation partner rather than an uncontrolled autonomous developer.

The human reviewer remains responsible for:

* Requirements
* Architecture approval
* Business-rule decisions
* Verification
* Git commits
* Final submission

The AI agent is responsible for:

* Implementation
* Refactoring
* Tests
* Debugging
* Documentation updates

The implementation is milestone-based. The AI agent must stop after each milestone and wait for human review before proceeding.
