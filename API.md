# API Specification

> Status: draft — based on database schema diagram. Voucher and voucher stub
> sections are included but marked for further review.

## Base URL

```
https://api.example.com/v1
```

## OpenAPI Docs

Interactive docs at `/docs` (Swagger UI).  
Raw spec at `/openapi.json` (JSON).

## Authentication

```
Authorization: Bearer <token>
```

---

## Standard Response Shapes

### Single resource
```json
{ "data": { ... } }
```

### Collection
```json
{
  "data": [ ... ],
  "nextCursor": "eyJpZCI6IDQyfQ=="
}
```

### Error
```json
{
  "error": "NOT_FOUND",
  "message": "Partner with id 42 does not exist."
}
```

## Status Codes

| Code | Meaning                                      |
|------|----------------------------------------------|
| 200  | OK                                           |
| 201  | Created                                      |
| 204  | No content (successful delete)               |
| 400  | Validation error                             |
| 401  | Missing or invalid auth token                |
| 404  | Resource not found                           |
| 409  | Conflict — FK violation or duplicate         |
| 500  | Internal server error                        |

## Pagination

All list endpoints accept `limit` (default `50`, max `200`) and `cursor`.

---

## Languages

Source of truth for which translations are required across all entities.

### Endpoints

```
GET    /languages
POST   /languages
GET    /languages/{languageTag}
PUT    /languages/{languageTag}
DELETE /languages/{languageTag}       fails if any translations reference this tag
```

### Schema

| Field             | Type   | Notes             |
|-------------------|--------|-------------------|
| languageTag       | string | PK — BCP 47 tag   |
| languageNameEn    | string | Name in English   |
| languageNameNative | string | Name in native language |
| createdAt         | datetime |                 |
| updatedAt         | datetime |                 |

**POST / PUT body**
```json
{
  "languageTag": "en",
  "languageNameEn": "English",
  "languageNameNative": "English"
}
```

---

## Categories

Taxonomy labels assigned to rewards. No fields beyond their translations.

### Endpoints

```
GET    /categories                                  query: ?languageTag=en
POST   /categories
GET    /categories/{id}
DELETE /categories/{id}                             fails if assigned to any reward

PUT    /categories/{id}/translations/{languageTag}
GET    /categories/{id}/translations/{languageTag}
DELETE /categories/{id}/translations/{languageTag}
```

### Schema

**category**

| Field     | Type    | Notes                |
|-----------|---------|----------------------|
| id        | integer | PK — auto-generated  |
| createdAt | datetime |                     |
| updatedAt | datetime |                     |

**category_translation**

| Field        | Type   | Notes                        |
|--------------|--------|------------------------------|
| categoryId   | integer | FK → category.id            |
| languageTag  | string  | FK → language.languageTag   |
| categoryName | string  | Required                     |

**POST /categories body**
```json
{
  "translations": [
    { "languageTag": "en", "name": "Food & Drink" },
    { "languageTag": "fr", "name": "Nourriture et boissons" }
  ]
}
```

**PUT /categories/{id}/translations/{languageTag} body**
```json
{ "name": "Food & Drink" }
```

---

## Partners

A partner has a base record plus a translation record per supported language.
A partner only becomes complete (and visible downstream) once translations exist
for **all** supported languages.

### Endpoints

```
GET    /partners                                      query: ?isActive=true
POST   /partners
GET    /partners/{id}
PATCH  /partners/{id}
DELETE /partners/{id}                                 fails if rewards exist

GET    /partners/{id}/translations
PUT    /partners/{id}/translations/{languageTag}
GET    /partners/{id}/translations/{languageTag}
DELETE /partners/{id}/translations/{languageTag}
```

### Schema

**partner**

| Field     | Type    | Notes                          |
|-----------|---------|--------------------------------|
| id        | integer | PK — auto-generated            |
| isActive  | boolean | Defaults to `false`            |
| createdAt | datetime |                               |
| updatedAt | datetime |                               |

**partner_details_translation**

| Field                  | Type   | Required | Notes                          |
|------------------------|--------|----------|--------------------------------|
| partnerId              | integer | —       | FK → partner.id                |
| languageTag            | string  | —       | FK → language.languageTag      |
| name                   | string  | Yes      |                                |
| logoUrl                | string  | Yes      |                                |
| description            | string  | Yes      |                                |
| webAddressUrl          | string  | No       |                                |
| webAddressText         | string  | No       |                                |
| reasonForSupporting    | string  | No       | `reason_for_supporting_8by8` in DB |

**POST /partners body**
```json
{
  "isActive": false,
  "translations": [
    {
      "languageTag": "en",
      "name": "Acme Corp",
      "logoUrl": "https://cdn.example.com/logo.png",
      "description": "A short description.",
      "webAddressUrl": "https://acme.example.com",
      "webAddressText": "Visit Acme",
      "reasonForSupporting": "We support 8by8 because..."
    }
  ]
}
```

**PATCH /partners/{id} body**
```json
{ "isActive": true }
```

**PUT /partners/{id}/translations/{languageTag} body**
```json
{
  "name": "Acme Corp",
  "logoUrl": "https://cdn.example.com/logo.png",
  "description": "A short description.",
  "webAddressUrl": "https://acme.example.com",
  "webAddressText": "Visit Acme",
  "reasonForSupporting": "We support 8by8 because..."
}
```

---

## Locations

Belong to a partner. Stored as a PostGIS `GEOGRAPHY(POINT, 4326)` — latitude
and longitude in the API.

### Endpoints

```
GET    /partners/{partnerId}/locations
POST   /partners/{partnerId}/locations
GET    /partners/{partnerId}/locations/{id}
PATCH  /partners/{partnerId}/locations/{id}
DELETE /partners/{partnerId}/locations/{id}
```

### Schema

**location**

| Field     | Type    | Notes                              |
|-----------|---------|------------------------------------|
| id        | bigint  | PK — auto-generated                |
| partnerId | integer | FK → partner.id                    |
| latitude  | float   | Stored as geography point in DB    |
| longitude | float   | Stored as geography point in DB    |
| createdAt | datetime |                                   |
| updatedAt | datetime |                                   |

**POST / PATCH body**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

---

## Rewards

Belongs to a partner. `voucherType` is set at creation and is **immutable**.
Availability can be expressed as exact UTC timestamps, local timestamps (no
timezone), or both — all optional.

### Endpoints

```
GET    /partners/{partnerId}/rewards
POST   /partners/{partnerId}/rewards
GET    /rewards/{id}
PATCH  /rewards/{id}                              voucherType not patchable
DELETE /rewards/{id}                              cascades to translations + categories

GET    /rewards/{id}/translations
PUT    /rewards/{id}/translations/{languageTag}
GET    /rewards/{id}/translations/{languageTag}
DELETE /rewards/{id}/translations/{languageTag}

POST   /rewards/{id}/categories
DELETE /rewards/{id}/categories/{categoryId}
```

### Schema

**reward**

| Field               | Type      | Required | Notes                                              |
|---------------------|-----------|----------|----------------------------------------------------|
| id                  | UUID      | —        | PK — auto-generated                                |
| partnerId           | integer   | Yes      | FK → partner.id                                    |
| voucherType         | string    | Yes      | `SINGLE_USE`, `MULTIPLE_USE`, `ON_DEMAND`, `MANUAL` |
| redemptionForums    | string[]  | Yes      | At least one of `ONLINE`, `IN_STORE`               |
| availableFromExact  | datetime  | No       | UTC ISO 8601                                       |
| availableUntilExact | datetime  | No       | UTC ISO 8601                                       |
| availableFromLocal  | datetime  | No       | No timezone — local clock time                     |
| availableUntilLocal | datetime  | No       | No timezone — local clock time                     |
| createdAt           | datetime  | —        |                                                    |
| updatedAt           | datetime  | —        |                                                    |

**reward_details_translation**

| Field            | Type   | Required | Notes                        |
|------------------|--------|----------|------------------------------|
| rewardId         | UUID   | —        | FK → reward.id               |
| languageTag      | string | —        | FK → language.languageTag    |
| shortDescription | string | Yes      |                              |
| longDescription  | string | No       |                              |

**reward_category**

| Field      | Type    | Notes               |
|------------|---------|---------------------|
| rewardId   | UUID    | FK → reward.id      |
| categoryId | integer | FK → category.id    |

**POST /partners/{partnerId}/rewards body**
```json
{
  "voucherType": "SINGLE_USE",
  "redemptionForums": ["ONLINE"],
  "availableFromExact": "2026-06-01T00:00:00Z",
  "availableUntilExact": "2026-12-31T23:59:59Z",
  "availableFromLocal": null,
  "availableUntilLocal": null,
  "translations": [
    {
      "languageTag": "en",
      "shortDescription": "10% off your next order",
      "longDescription": "Valid on orders over $20."
    }
  ],
  "categoryIds": [1, 4]
}
```

**PATCH /rewards/{id} body** (all fields optional)
```json
{
  "redemptionForums": ["ONLINE", "IN_STORE"],
  "availableFromExact": "2026-07-01T00:00:00Z",
  "availableUntilExact": null
}
```

**PUT /rewards/{id}/translations/{languageTag} body**
```json
{
  "shortDescription": "10% off your next order",
  "longDescription": "Valid on orders over $20."
}
```

**POST /rewards/{id}/categories body**
```json
{ "categoryId": 3 }
```

---

## Vouchers

> Needs further study — endpoints and bodies below are provisional.

Shape depends on the reward's `voucherType`.

### SINGLE_USE — one voucher per redemption, collection per reward

```
GET    /rewards/{rewardId}/vouchers
POST   /rewards/{rewardId}/vouchers
POST   /rewards/{rewardId}/vouchers/bulk
GET    /vouchers/{id}
PATCH  /vouchers/{id}
DELETE /vouchers/{id}

GET    /vouchers/{id}/values
POST   /vouchers/{id}/values
DELETE /voucher-values/{valueId}

PUT    /voucher-values/{valueId}/translations/{languageTag}
DELETE /voucher-values/{valueId}/translations/{languageTag}
```

**single_use_voucher schema**

| Field          | Type     | Notes                       |
|----------------|----------|-----------------------------|
| id             | bigint   | PK — auto-generated         |
| rewardId       | UUID     | FK → reward.id              |
| redeemableUntil | datetime | Optional expiry            |
| createdAt      | datetime |                             |
| updatedAt      | datetime |                             |

### MULTIPLE_USE — one shared voucher per reward

```
GET    /rewards/{rewardId}/voucher
POST   /rewards/{rewardId}/voucher
PATCH  /rewards/{rewardId}/voucher
DELETE /rewards/{rewardId}/voucher

GET    /rewards/{rewardId}/voucher/values
POST   /rewards/{rewardId}/voucher/values
DELETE /rewards/{rewardId}/voucher/values/{valueId}

PUT    /rewards/{rewardId}/voucher/values/{valueId}/translations/{languageTag}
DELETE /rewards/{rewardId}/voucher/values/{valueId}/translations/{languageTag}
```

**multiple_use_voucher schema**

| Field          | Type     | Notes                       |
|----------------|----------|-----------------------------|
| id             | integer  | PK — auto-generated         |
| rewardId       | UUID     | FK → reward.id (unique)     |
| hasUsageCap    | boolean  | Required                    |
| redeemableUntil | datetime | Optional expiry            |
| createdAt      | datetime |                             |
| updatedAt      | datetime |                             |

### Voucher Values (CODE / QR_CODE / LINK)

A voucher value belongs to either a single-use or multiple-use voucher —
never both.

**POST body — CODE**
```json
{
  "redemptionMethod": "CODE",
  "redemptionCode": "ACME-XYZ-123",
  "translations": [
    { "languageTag": "en", "instructions": "Enter this code at checkout." }
  ]
}
```

**POST body — QR_CODE**
```json
{
  "redemptionMethod": "QR_CODE",
  "redemptionQrCode": "<base64 or URL>",
  "translations": [
    { "languageTag": "en", "instructions": "Scan this QR code in store." }
  ]
}
```

**POST body — LINK**
```json
{
  "redemptionMethod": "LINK",
  "redemptionLinkUrl": "https://acme.example.com/redeem",
  "redemptionLinkText": "Claim offer",
  "translations": [
    { "languageTag": "en", "instructions": "Click the link to redeem." }
  ]
}
```

---

## Voucher Stubs

> Needs further study — endpoints and bodies below are provisional.

Applies to `ON_DEMAND` and `MANUAL` reward types. One stub per reward.

```
GET    /rewards/{rewardId}/voucher-stub
POST   /rewards/{rewardId}/voucher-stub
PATCH  /rewards/{rewardId}/voucher-stub
DELETE /rewards/{rewardId}/voucher-stub

# MANUAL only
PUT    /rewards/{rewardId}/voucher-stub/translations/{languageTag}
DELETE /rewards/{rewardId}/voucher-stub/translations/{languageTag}
```

**Shared stub schema** (on_demand_voucher_stub / manual_voucher_stub)

| Field                | Type     | Notes                                |
|----------------------|----------|--------------------------------------|
| id                   | integer  | PK — auto-generated                  |
| rewardId             | UUID     | FK → reward.id (unique)              |
| redeemableUntilExact | datetime | Optional — UTC                       |
| redeemableUntilLocal | datetime | Optional — no timezone               |
| redeemableFor        | string   | Optional — ISO 8601 duration e.g. `P30D` |
| vouchersRemaining    | integer  | Optional — null means unlimited      |
| createdAt            | datetime |                                      |
| updatedAt            | datetime |                                      |

**POST body (ON_DEMAND)**
```json
{
  "redeemableUntilExact": "2026-12-31T23:59:59Z",
  "redeemableFor": "P30D",
  "vouchersRemaining": 500
}
```

**POST body (MANUAL)** — same fields plus translations
```json
{
  "redeemableUntilExact": "2026-12-31T23:59:59Z",
  "redeemableFor": null,
  "vouchersRemaining": null,
  "translations": [
    { "languageTag": "en", "instructions": "Show this to the cashier." }
  ]
}
```
