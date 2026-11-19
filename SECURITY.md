# Security Policy

This policy covers every Verticopolis repository that has no `SECURITY.md` of
its own.

## Supported versions

The game at [verticopolis.com](https://verticopolis.com) is deployed
continuously, and the live build is the only supported version. For the engine
and the components, the latest release is supported. Please confirm an issue
reproduces there before reporting.

## Reporting a vulnerability

**Please do not open a public issue for a security vulnerability.** Public
issues are visible to everyone and can put players at risk before a fix ships.

Report it privately through GitHub's Private Vulnerability Reporting on the
repository it affects:

- [The game (Verticopolis/web)](https://github.com/Verticopolis/web/security/advisories/new)
- [The engine (Verticopolis/engine)](https://github.com/Verticopolis/engine/security/advisories/new)
- [The components (Verticopolis/components)](https://github.com/Verticopolis/components/security/advisories/new)

Describe the issue, its impact and the steps to reproduce it, with the version
you used. Imported save data (`.vctower` and `.TDT` files) is the main way
untrusted input reaches the game and the engine, so reports there are
especially welcome.

## What to expect

- We aim to acknowledge a report within a few days.
- We'll keep you updated as we confirm, fix, and release the change.
- With your permission, we're happy to credit you once a fix has shipped.

Thank you for helping keep Verticopolis and its players safe.
