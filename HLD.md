# High-Level Design — Mini Leads Dashboard

> Updated after implementation

---

## 1. Metadata

| Field | Value |
|---|---|
| Project name | Mini Leads Dashboard |
| Author | Shreya Aggarwal |
| Date | 2026-08-06 |
| Reviewers | Sameer Singh |
| Status | Completed |
| Related docs | PRD v1.0 · LLD v1.0 |

---

## 2. Purpose

The Mini Leads Dashboard is a lightweight CRM application designed for small sales teams to manage leads efficiently. It allows sales agents to view, search, filter, sort, create, update, and delete leads while also providing a detailed view of each lead. The application uses a mock REST backend with TanStack Query for server-state management and Material UI for the user interface. It is responsive and supports loading, error, and empty states along with light and dark themes. Authentication, multi-tenancy, and advanced CRM features are intentionally out of scope.

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
│ React Router · MUI · TanStack Query · Axios          │
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

- **Sales Agent** – Uses the application to manage leads.
- **Browser** – Runs the React application.
- **HTTP + JSON** – Communication between frontend and backend.
- **Leadboard SPA** – Main React application.
- **React Router** – Handles client-side routing.
- **Material UI** – UI components and theming.
- **TanStack Query** – Handles fetching, caching, and mutations.
- **Axios** – HTTP client.
- **json-server** – Mock REST backend storing lead data.

---

## 4. Top-Level Component Groups

| # | Group | What lives here |
|---|---|---|
| 1 | **App Shell** | Router, ThemeProvider, QueryClientProvider, global layout |
| 2 | **Leads List Page** | Lead table, search, status filter, sorting, pagination, theme toggle |
| 3 | **Lead Detail Page** | Lead details, edit navigation, activity section, delete confirmation dialog |
| 4 | **Reusable Lead Form** | Shared Create/Edit form, validation, submit handling |
| 5 | **Data Layer** | Axios configuration, REST API functions, TanStack Query hooks, cache invalidation |
| 6 | **Shared UI** | DataState, StatusChip, ConfirmDialog, reusable Material UI components |

---

## 5. External Interfaces

### 5.1 Mock Backend

| Field | Value |
|---|---|
| Chosen backend (OQ-01) | json-server |
| Base URL | `http://localhost:4000` |
| Data shape summary | `leads` collection containing lead information such as name, email, phone, status, owner, source, and created date |

---

### 5.2 Endpoints You'll Consume

| Endpoint | Method | Purpose | Query Params |
|---|---|---|---|
| `/leads` | GET | List leads | `_page`, `_per_page`, `_sort`, `status`, `first_name:contains` |
| `/leads/:id` | GET | Detail | |
| `/leads` | POST | Create | |
| `/leads/:id` | PUT | Update | |
| `/leads/:id` | DELETE | Delete | |

---

### 5.3 Anything Else

| Library | Purpose |
|---|---|
| Material UI | UI components, responsive layouts, theming |
| TanStack Query | Server-state management |
| Axios | HTTP client |
| React Router | Client-side routing |

---

## 6. Key Architectural Decisions

### KAD-01 — Backend Choice (OQ-01)

- **Decision:** Use json-server as the mock backend.
- **Why:** Provides a lightweight REST API suitable for frontend development.
- **Trade-off:** Frontend and backend must run separately.

---

### KAD-02 — Form State (OQ-02)

- **Decision:** Use React `useState` with a reusable `LeadForm` component.
- **Why:** Keeps validation centralized while allowing the same form to be reused for Create and Edit flows.
- **Trade-off:** Requires passing different props (`initialValues`, `buttonText`, `onSubmit`) based on the page.

---

### KAD-03 — Cache Policy (OQ-04)

- **Decision:** Use TanStack Query for server-state management.
- **Why:** Simplifies data fetching, caching, loading states, and mutations.
- **Trade-off:** Requires cache invalidation after data-changing operations.

---

### KAD-04 — Post-create Refresh (OQ-05)

- **Decision:** Invalidate relevant queries after Create, Update, and Delete mutations.
- **Why:** Ensures users always see the latest backend data.
- **Trade-off:** Triggers additional API requests after successful mutations.

---

### KAD-05 — Component Library Scope

- **Decision:** Use Material UI across the application.
- **Why:** Provides accessible, responsive components and built-in theming support.
- **Trade-off:** Less styling flexibility than building custom components.

---

## 7. Cross-cutting Concerns

| Concern | How you're handling it |
|---|---|
| Loading / Error / Empty states | Reusable `DataState` component handles all three states. |
| Debounced input | Search input debounced using `useEffect` (~300ms). |
| Global error handling | Display user-friendly error messages for failed API requests and form submissions. |
| Toast / Notification pattern | Not implemented. Errors are shown inline within the UI. |
| Confirm-before-delete pattern | Reusable confirmation dialog before deleting a lead. |
| Responsive layout strategy | Material UI responsive layouts and components. |
| Accessibility baseline | Semantic HTML, labelled form fields, keyboard-accessible controls. |
| Dark mode (if applicable) | Implemented using Material UI `ThemeProvider` with light/dark theme toggle. |
| URL-persisted state (if applicable) | Not implemented. |

---

## 8. Risks + Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | First time using TanStack Query. | Medium | High | Read documentation and build small features before integrating them. |
| 2 | Combining search, filtering, sorting, and pagination. | Medium | Medium | Build and test each feature independently before combining them. |
| 3 | Reusing the same form for both Create and Edit flows. | Medium | Medium | Use configurable props and keep validation logic centralized. |

---

## 9. Alternatives Considered

### Alternative to KAD-01

- **Considered:** mockapi.io
- **Why rejected:** Requires an online service; json-server works locally and is easier to reset.

---

### Alternative to KAD-02

- **Considered:** Separate CreateForm and EditForm components.
- **Why rejected:** A reusable `LeadForm` reduces duplicate code and centralizes validation.

---

### Alternative to KAD-05

- **Considered:** Tailwind CSS
- **Why rejected:** Material UI is part of the chosen stack and provides ready-made responsive components.

---

## 10. Out-of-Scope Confirmation

> I confirm I am **not** building:
>
> - Authentication
> - Multi-tenancy
> - Real-time updates
> - Outbound messaging
> - Reports / Charts
> - CSV Import / Export
> - Deals / Opportunities
> - Deployment
>
> If any of these creep into my design, I will stop and re-scope before continuing.

**Signed / Dated:** Shreya Aggarwal — 2026-08-06

---

## 11. Review Sign-off

| Reviewer | Date | Verdict | Comments |
|---|---|---|---|
| Sameer Singh | | Approved / Revise / Reject | |

---

**End of HLD Template**