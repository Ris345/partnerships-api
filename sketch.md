# REST API Microservice — Architecture Sketch

## How the service fits together

```
         Client (browser, mobile, other service)
                          |
                    HTTP Request
                          |
                    ┌─────────────┐
                    │   Fastify   │  ← handles routing, auth middleware
                    └─────────────┘
                          |
               ┌──────────────────────┐
               │   Zod Schema         │  ← validates request body / params
               │   (per route)        │     rejects bad input with 400
               └──────────────────────┘
                          |
               ┌──────────────────────┐
               │   Route Handler      │  ← business logic lives here
               └──────────────────────┘
                          |
               ┌──────────────────────┐
               │   Kysely             │  ← builds type-safe SQL queries
               └──────────────────────┘
                          |
               ┌──────────────────────┐
               │   PostgreSQL         │  ← partners, rewards, vouchers etc.
               └──────────────────────┘
```

## Where OpenAPI fits in

```
   Zod schemas (attached to each route)
               |
               │  @fastify/swagger reads these at startup
               ▼
       /openapi.json                ← machine-readable spec (JSON)
               |
       ┌───────┴────────┐
       ▼                ▼
  Swagger UI          openapi-typescript (or any generator)
  at /docs            generates typed client SDK
  (interactive        for any consumer (frontend, mobile etc.)
   browser docs)
```

## Request lifecycle

```
POST /partners

1. Fastify receives request
2. Zod validates body shape  →  invalid? return 400
3. Route handler runs
4. Kysely builds INSERT query
5. PostgreSQL executes
6. Handler returns 201 + created resource
```

## Resource hierarchy

```
/languages
/categories
  └── /categories/{id}/translations/{languageTag}

/partners
  ├── /partners/{id}/translations/{languageTag}
  ├── /partners/{id}/locations
  └── /partners/{id}/rewards
        └── /rewards/{id}/translations/{languageTag}
        └── /rewards/{id}/categories
        └── /rewards/{id}/voucher(s)
              └── /voucher(s)/{id}/values
                    └── /values/{id}/translations/{languageTag}
        └── /rewards/{id}/voucher-stub
              └── /voucher-stub/translations/{languageTag}
```

## Voucher type determines shape

```
voucherType = SINGLE_USE   →  /rewards/{id}/vouchers      (collection, many per reward)
voucherType = MULTIPLE_USE →  /rewards/{id}/voucher       (singleton, one per reward)
voucherType = ON_DEMAND    →  /rewards/{id}/voucher-stub  (no translations needed)
voucherType = MANUAL       →  /rewards/{id}/voucher-stub  (+ translations)
```

## i18n rule

```
An entity is only "complete" when it has translations in ALL supported languages.

  partner
    ├── translation (en)  ✓
    ├── translation (fr)  ✓
    └── translation (es)  ✗  ← incomplete until this exists
```
