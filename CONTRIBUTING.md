@'

# Contributing Guide

## Branch Strategy

The project uses:

- `main`
- `develop`
- `feature/site1`
- `feature/site2`

## Rules

Do not push directly to:

- `main`
- `develop`

Each developer must work on their own feature branch.

### Machine 1

- Work on: `feature/site1`
- Scope: Site 1 backend, frontend, and distributed database scripts

### Machine 2

- Work on: `feature/site2`
- Scope: Site 2 application
  '@ | Set-Content -Encoding UTF8 CONTRIBUTING.md
