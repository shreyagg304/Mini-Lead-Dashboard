# High-Level Design — Mini Leads Dashboard

---

## 1. Metadata

| Field | Value |
|---|---|
| Project name | Mini Leads Dashboard |
| Author | Shreya Aggarwal |
| Date | 2026-07-29 |
| Reviewers | Sameer Singh |
| Status | Draft |
| Related docs | PRD v1.0 · LLD v0.1 |

---

## 2. Purpose

The Mini Leads Dashboard is a lightweight CRM application designed for small sales teams to manage their leads efficiently. It allows sales agents to view all leads in a searchable and filterable table, access detailed information about individual leads, create new leads, and delete duplicate or invalid entries with confirmation. It is intended as a lightweight CRM dashboard and does not include authentication, multi-tenancy, or other advanced CRM features.

---

## 3. Context Diagram

```text
              ┌────────────────────────┐
              │      Sales Agent       │
              │    (Chrome Browser)    │
              └───────────┬────────────┘
                          │ HTTP + JSON
                          ▼
┌──────────────────────────────────────────────────────┐
│             Leadboard SPA (React)                    │
│ React Router · MUI · TanStack Query · axios          │
└───────────────────────┬──────────────────────────────┘
                        │ REST API
                        ▼
              ┌────────────────────────┐
              │      json-server        │
              │       (db.json)         │
              └───────────┬────────────┘
                          │
                          ▼
                    Lead Data (JSON)
```

### Boundary Notes

- **Sales Agent** – Person who uses the application to manage leads.
- **Browser** – Where the user interacts with the React application.
- **HTTP + JSON** – Used by the frontend to communicate with the backend.
- **Leadboard SPA** – Main React application.
- **React Router** – Handles navigation between pages.
- **MUI** – Provides UI components.
- **TanStack Query** – Fetches, caches, and manages server data.
- **axios** – Sends HTTP requests.
- **json-server** – Mock backend storing lead data in `db.json`.

---

## 4. Top-Level Component Groups

| # | Group | What lives here |
|---|---|---|
| 1 | App Shell | Router, ThemeProvider, QueryClientProvider, global layout |
| 2 | Leads List Page | Lead table, search, status filter, sorting, pagination, page-level state |
| 3 | Lead Detail Page | Lead details, activity history, delete confirmation dialog |
| 4 | Create Lead Form | Input fields, validation, submit handler |
| 5 | Data Layer | axios configuration, TanStack Query hooks, API calls, query keys |
| 6 | Shared UI | LoadingState, ErrorState, EmptyState, ConfirmDialog, reusable MUI components |

---

## 5. External Interfaces

### 5.1 Mock Backend

| Field | Value |
|---|---|
| Chosen backend | json-server |
| Base URL | `http://localhost:4000` |
| Data shape summary | `leads` array containing the fields defined in the PRD |

### 5.2 Endpoints

| Endpoint | Method | Purpose | Query Params |
|---|---|---|---|
| `/leads` | GET | List leads | `_page`, `_limit`, `_sort`, `_order`, `q`, `status` |
| `/leads/:id` | GET | Lead details | |
| `/leads` | POST | Create lead | |
| `/leads/:id` | DELETE | Delete lead | |
| `/leads/:id` | PATCH | Edit lead (Stretch) | |

### 5.3 Anything Else

N/A

---

## 6. Key Architectural Decisions

### KAD-01 — Backend Choice (OQ-01)

**Decision:** Use json-server locally.

**Why:** Easy to set up, works offline, and behaves like a REST backend.

**Trade-off:** React app and json-server must run separately.

---

### KAD-02 — Form State (OQ-02)

**Decision:** Use React `useState`.

**Why:** The form is small and simple.

**Trade-off:** Larger forms may become difficult to manage.

---

### KAD-03 — Cache Policy (OQ-04)

**Decision:** Use TanStack Query's default caching.

**Why:** Reduces unnecessary API requests.

**Trade-off:** Cached data may require invalidation or refetching to stay up to date.

---

### KAD-04 — Post-create Refresh (OQ-05)

**Decision:** Refresh the leads list after creating a lead.

**Why:** Newly created leads become visible immediately.

**Trade-off:** Requires an additional API request.

---

### KAD-05 — Component Library

**Decision:** Use Material UI.

**Why:** Provides ready-made, accessible components and speeds up development.

**Trade-off:** Less flexibility compared to building everything from scratch.

---

## 7. Cross-cutting Concerns

| Concern | How you're handling it |
|---|---|
| Loading / Error / Empty States | Show dedicated UI for each state. |
| Debounced Input | Delay search requests by ~300 ms. |
| Global Error Handling | Display user-friendly error messages for failed API requests. |
| Toast / Notification Pattern | Show success and error notifications after actions. |
| Confirm-before-delete Pattern | Display a confirmation dialog before deletion. |
| Responsive Layout Strategy | Use Material UI responsive components and layouts. |
| Accessibility Baseline | Use semantic HTML, labels, and keyboard-accessible controls. |
| Dark Mode | N/A |
| URL-persisted State | N/A |

---

## 8. Risks + Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | First time using TanStack Query. | High | Medium | Read documentation and practice with small examples. |
| 2 | Combining search, filtering, and pagination. | Medium | Medium | Build and test one feature at a time. |
| 3 | Using multiple new technologies together. | High | High | Follow the project structure and clarify doubts early. |

---

## 9. Alternatives Considered

### Alternative to KAD-01

**Considered:** mockapi.io

**Why rejected:** Requires an online service; json-server works locally and is easier to reset.

---

### Alternative to KAD-05

**Considered:** Tailwind CSS

**Why rejected:** Material UI is part of the project stack and provides ready-made components for faster development.

---

## 10. Out-of-Scope Confirmation

> I confirm I am **not** building authentication, multi-tenancy, real-time updates, outbound messaging, reports/charts, CSV import/export, deals/opportunities, or deployment. If any of these creep into my design, I will stop and re-scope before continuing.

**Signed / Date:** Shreya Aggarwal — 2026-07-29

---

## 11. Review Sign-off

| Reviewer | Date | Verdict | Comments |
|---|---|---|---|
| Sameer Singh | | Approved / Revise / Reject | |

---

**End of HLD**