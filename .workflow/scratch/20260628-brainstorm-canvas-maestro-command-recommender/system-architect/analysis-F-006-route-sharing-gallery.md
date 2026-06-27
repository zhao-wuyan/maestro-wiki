# F-006 Route Sharing and Gallery — Architecture

Private share links and public gallery entries SHOULD be modeled with one `SharedRoute` record and separate visibility fields.

Minimum fields: `shareId`, `routeSnapshot`, `visibility: private|gallery|revoked`, `createdAt`, `updatedAt`, `galleryPublishedAt`, `revokedAt`.

This feature SHOULD NOT be implemented as localStorage-only because standalone URLs and public gallery browsing require online storage or a hosted API.
