# CoffeeHub Agent — Quality Checklist

## Bootstrap

- [ ] Existing files preserved
- [ ] Framework initialized if absent
- [ ] TypeScript strict configured
- [ ] Tailwind/lint configured
- [ ] `.gitignore` and `.env.example` present
- [ ] Dependencies installed
- [ ] Dev/build/lint/typecheck verified when available
- [ ] Project logs updated

## Feature

- [ ] Requirement and dependencies verified
- [ ] Data ownership considered
- [ ] Runtime validation implemented
- [ ] Loading, empty and error states implemented
- [ ] Responsive and accessibility basics checked
- [ ] Relevant tests/checks run
- [ ] Task and project logs updated

## Migration

- [ ] Existing data impact reviewed
- [ ] Migration additive where possible
- [ ] Constraints/indexes reviewed
- [ ] Rollback documented
- [ ] SQL inspected
- [ ] No production migration executed automatically

## Release

- [ ] Explicit deploy permission received
- [ ] Build/type/lint/tests reviewed
- [ ] Environment variables documented
- [ ] Auth/main flows smoke-tested
- [ ] Migration and rollback plans reviewed
- [ ] Known limitations documented
