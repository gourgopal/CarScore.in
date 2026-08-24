# Architecture Target

## Overview
CarScore.in is an India-focused automotive utility and decision-intelligence platform. The platform will be built prioritizing static generation and minimal client-side JavaScript.

## Core Technologies
- **Framework**: Astro (Static generation for indexable pages, client-side islands for calculators)
- **Language**: TypeScript
- **Hosting**: Cloudflare Pages (optimized for free-tier limits)
- **Data Storage**: Static versioned JSON for the initial approved car catalogue; Astro content collections for guides/methodology. Cloudflare D1 and Workers to be used *only* when searchable server-side data or persistence is strictly needed.
- **Validation**: Zod (or equivalent)
- **Testing**: Vitest (Unit) and Playwright (Browser/E2E)
- **CI/CD**: GitHub Actions
- **Analytics**: Privacy-conscious analytics (e.g., Cloudflare Web Analytics)

## Architecture Principles
- **No unnecessary services**: No Firebase or external DB-backed API for calculations that can execute in the browser.
- **Deterministic**: Calculations must be deterministic, testable, and separate from UI components.
- **Client-Side Operations**: TCO, EMI, energy calculations, N-car comparisons, and user overrides will run on the client.
- **Server-Side Operations**: Restricted to contact forms, feedback, feature flags, or administrative tasks (if implemented).

## Data Principles
- Strict tracking of data provenance (official, estimated, user-reported, etc.).
- Robust money and numeric handling (integer paise for currency where practical, safe decimal handling).
