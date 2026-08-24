# Testing Strategy

Testing is a core requirement for CarScore.in to ensure the accuracy of financial calculations.

## Unit Testing
**Framework**: Vitest (planned)

**Scope**:
- Distance normalization
- On-road price estimates
- Loan EMI and finance costs
- Energy costs (ICE, CNG, EV)
- Insurance, service, and depreciation schedules
- Cash outflow and economic TCO calculations
- Break-even logic and N-car ranking algorithms
- Missing-data confidence reductions
- Currency formatting and decimal handling

## Integration Testing
**Scope**:
- Vehicle-data import and validation (duplicate slug detection, relationship resolution)
- Indexability eligibility checks
- Sitemap exclusions
- Metadata and structured data output

## Browser / E2E Testing
**Framework**: Playwright (planned)

**Scope**:
- Calculator interactions (change values, overrides, toggles)
- Print, export CSV, and share functionality
- Responsiveness (mobile, tablet, desktop)
- UI states (loading, error, empty)
- Accessibility basics (keyboard navigation, ad-placeholder layouts)
- Fallback behaviour without JavaScript (where applicable)
