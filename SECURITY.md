# Security Policy

## Supported Versions

Security fixes are provided for the latest published version of
`@lpm.dev/neo.colors`. Please reproduce a suspected issue on the latest version
when practical, but do not delay a private report if that is not possible.

## Reporting a Vulnerability

Report vulnerabilities privately through
[GitHub's security advisory form](https://github.com/ne-ooo/neo.colors/security/advisories/new).
Do not open a public issue for an undisclosed vulnerability.

Include the affected version, impact, reproduction steps or a proof of
concept, and any suggested remediation. Reports will be acknowledged after
triage, and disclosure should be coordinated until a fixed version is
available.

Terminal escape injection is in scope. When displaying user-controlled text,
use the exported `sanitizeText()` helper as documented in the README.
