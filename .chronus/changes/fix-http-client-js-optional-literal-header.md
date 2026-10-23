---
changeKind: fix
packages:
  - "@typespec/http-client-js"
---

Do not treat an optional single-literal header as having a default value, ensuring the header is omitted when not provided by the caller.
