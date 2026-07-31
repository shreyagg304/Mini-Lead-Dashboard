# Low-Level Design — Mini Leads Dashboard

---

## 1. Metadata

| Field | Value |
|---|---|
| Project | Mini Leads Dashboard |
| Author | Shreya Aggarwal |
| Date | 2026-07-29 |
| HLD Reference | v1.0 |
| Reviewers | Sameer Singh |
| Status | Draft |

---

## 2. Data Model

The **Lead** object represents the data stored in the mock backend (`json-server`) and used throughout the application.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | number | Yes (Backend assigned) | Primary key |
| `first_name` | string | Yes | 1–64 characters |
| `last_name` | string | Yes | 1–64 characters |
| `email` | string | Yes | Valid email address |
| `phone` | string | Yes | Normalized digits with optional leading `+` |
| `status` | enum | Yes | `New` \| `Contacted` \| `Qualified` \| `Won` \| `Lost` |
| `owner` | string | Yes | Lead owner |
| `source` | enum | No | `Website` \| `Referral` \| `Ad campaign` \| `Cold call` \| `Other` |
| `created_on` | string (ISO Date) | Yes (Backend assigned) | `YYYY-MM-DD` |

### Lead Status

```ts
export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Won",
  "Lost",
];
```

No additional derived fields are planned for this project.

---

## 3. Route Table

Routes are ordered with **static routes before dynamic routes** so that `/leads/new` is matched correctly.

| # | Path | Element / Page | Loader / Guard | Notes |
|---|---|---|---|---|
| 1 | `/` | `<Navigate to="/leads" />` | — | Root redirect |
| 2 | `/leads` | `<LeadsListPage />` | — | F-01 – F-08 |
| 3 | `/leads/new` | `<CreateLeadPage />` | — | F-12 – F-17 |
| 4 | `/leads/:id` | `<LeadDetailPage />` | — | F-09 – F-11 |
| 5 | `*` | `<NotFoundPage />` | — | Catch-all route |

---

## 4. Component Tree

```text
<App>                                   # Root component
│
├── <AppProviders>                      # Wraps the application with global providers
│   ├── ThemeProvider                   # Material UI Theme
│   ├── QueryClientProvider             # TanStack Query
│   └── BrowserRouter                   # React Router
│
├── <AppLayout>                         # Shared layout
│   ├── <TopBar />                      # Application title / navigation
│   └── <Outlet />                      # Renders current route
│
├── <LeadsListPage />                   # Main dashboard
│   ├── <PageHeader />                  # "Leads" + New Lead button
│   ├── <FiltersBar />                  # Search + Status filter
│   │   ├── <SearchInput />             # Debounced search
│   │   └── <StatusFilterSelect />      # Status dropdown
│   │
│   ├── <LeadsTable />                  # MUI DataGrid
│   │   ├── <DataGrid />                # Displays leads
│   │   └── <StatusChip />              # Status → colored chip
│   │
│   ├── <PaginationBar />               # Page controls
│   │
│   └── <DataState />                   # Chooses what to display
│       ├── <LoadingSkeleton />         # Loading state
│       ├── <Alert severity="error" />  # Error state
│       ├── <EmptyPanel />              # Empty state
│       └── <LeadsTable />              # Success state
│
├── <LeadDetailPage />                  # Lead details
│   ├── <PageHeader />                  # Lead name + Delete button
│   ├── <LeadFields />                  # Displays lead information
│   ├── <ActivityFeed />                # Mock activity history
│   └── <ConfirmDeleteDialog />         # Delete confirmation
│
└── <CreateLeadPage />                  # Create new lead
    ├── <PageHeader />                  # "New Lead"
    ├── <LeadForm />                    # Controlled form
    │   ├── <TextField /> × 5           # Name, Email, Phone, Owner...
    │   ├── <SelectField /> × 2         # Status, Source
    │   └── <FormActions />             # Submit + Cancel
    │
    └── <Alert severity="error" />      # Submission error
```

### Shared Components (`src/components/`)

| Component | Purpose |
|---|---|
| `PageHeader` | Reusable page header with title and actions |
| `StatusChip` | Displays lead status using MUI Chip |
| `ConfirmDialog` | Generic confirmation dialog |
| `DataState` | Decides whether to render Loading, Error, Empty, or Success UI |
| `LoadingSkeleton` | Skeleton loader while data is loading |
| `EmptyPanel` | Empty state message |
| `ErrorPanel` | Displays API errors with retry option |
| `NotFoundPage` | 404 page |

---

# 5. Per-Component Contract

## 5.1 `<LeadsListPage />`

### Props

None (Route component rendered by React Router).

### Local State

```ts
{
  page: number,                    // Current page number
  pageSize: 10 | 25 | 50,          // Rows per page
  searchInput: string,             // User input
  search: string,                  // Debounced search value
  statusFilter: LeadStatus | "ALL",
  pendingDelete: Lead | null       // Lead selected for deletion
}
```

### Data Hooks

- `useLeadsList()`
- `useDeleteLead()`

### Side Effects

- Debounce the search input using `useEffect()` with a 300 ms delay.
- Refresh the lead list after successfully deleting a lead.

### Rendering States

| State | Component |
|---|---|
| Loading | `LoadingSkeleton` |
| Error | `DataState` with error message |
| Empty | `EmptyPanel` |
| Success | `LeadsTable` |

---

## 5.2 `<LeadDetailPage />`

### Props

None (Reads the lead id using `useParams()`).

### Local State

```ts
{
  confirmDelete: boolean
}
```

### Data Hooks

- `useLead(id)`
- `useDeleteLead()`

### Side Effects

- Fetch lead details when the page loads.
- Navigate back to the Leads List after successful deletion.

### Rendering States

| State | Component |
|---|---|
| Loading | `LoadingSkeleton` |
| Error | `ErrorPanel` |
| Lead Not Found | `NotFoundPage` |
| Success | `LeadFields` + `ActivityFeed` |

---

## 5.3 `<CreateLeadPage />`

### Props

None.

### Local State

```ts
{
  values: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    status: "New",
    owner: "",
    source: ""
  },

  errors: {},

  submitError: null
}
```

### Data Hooks

- `useCreateLead()`

### Side Effects

- Focus the first input field when the page loads.
- Navigate back to the Leads List after successful creation.
- Display a success notification after creating a lead.

### Validation

Validation checks:

- Required fields
- Valid email
- Valid phone number
- Valid status selection
- Required owner

Validation runs before submitting the form.

---

## 5.4 `<LeadForm />`

### Decision

Create a separate `LeadForm` component.

### Why?

- Keeps `CreateLeadPage` clean.
- Makes the form reusable for the future Edit Lead page.
- Avoids duplicating form fields.

---

## 5.5 `<ConfirmDialog />`

### Props

```ts
{
  open: boolean,
  title: string,
  description?: string,
  confirmLabel?: string,
  cancelLabel?: string,
  destructive?: boolean,
  loading?: boolean,
  onConfirm: () => void,
  onClose: () => void
}
```

### Behaviour

- Opens before deleting a lead.
- Clicking **Cancel** closes the dialog.
- Clicking **Confirm** deletes the lead.
- Buttons remain disabled while the delete request is in progress.
- Clicking outside the dialog or pressing **Esc** closes it unless `loading` is `true`.

---

# 6. Data Fetching Plan

## 6.1 Query — `useLeadsList(params)`

**File**

```text
src/features/leads/useLeads.ts
```

### Query Key

```ts
leadsKeys.list(params)
// ['leads', 'list', params]
```

### Fetcher

```text
fetchLeadsList(params)
```

- Sends `GET /leads`
- Builds the required query parameters
- Returns:

```ts
{
  rows,
  total
}
```

### Query Options

| Option | Value |
|---|---|
| staleTime | 30 seconds |
| keepPreviousData | true |
| refetchOnWindowFocus | false |

### Used By

- `LeadsListPage`

## 6.2 Query — `useLead(id)`

**Query Key**

```ts
leadsKeys.detail(id)
// ['leads', 'detail', String(id)]
```

### Fetcher

```text
fetchLead(id)
```

- Sends `GET /leads/:id`
- Returns a single Lead object
- Throws an error if the lead is not found

### Query Options

| Option | Value |
|---|---|
| enabled | !!id |
| staleTime | 60 seconds |

### Used By

- `LeadDetailPage`

## 6.3 Mutation — `useCreateLead()`

### Mutation

```text
POST /leads
```

### On Success

- Invalidate the Leads List query
- Navigate back to the Leads List page
- Display a success notification

### On Error

- Return the error to the page
- Display the submission error without clearing the form

### Used By

- `CreateLeadPage`

## 6.4 Mutation — `useDeleteLead()`

### Mutation

```text
DELETE /leads/:id
```

### On Success

- Refresh the Leads List query
- Remove the deleted Lead Detail query from cache
- Navigate back to the Leads List page (when deleting from the Detail page)

### Used By

- `LeadsListPage`
- `LeadDetailPage`

## 6.5 Query Key Factory

```ts
export const leadsKeys = {
  all: ['leads'],
  lists: () => ['leads', 'list'],
  list: (params) => ['leads', 'list', params'],

  details: () => ['leads', 'detail'],
  detail: (id) => ['leads', 'detail', String(id)],
}
```

### Cache Invalidation

| Mutation | Invalidates |
|---|---|
| Create Lead | `leadsKeys.lists()` |
| Delete Lead | `leadsKeys.lists()` + `leadsKeys.detail(id)` |
| Edit Lead (Stretch) | `leadsKeys.lists()` + `leadsKeys.detail(id)` |

---

# 7. Global State

The application keeps global state minimal.

## URL / Router State

- Route parameter (`:id`) for the Lead Detail page.
- Page number and filters may be stored in the URL (Stretch Goal).

## TanStack Query Cache

Stores server state.

- Leads List
- Individual Lead Details

## Local Component State

Managed using `useState()`.

Examples:

- Search input
- Status filter
- Pagination
- Form values
- Delete confirmation dialog
- Temporary UI state

## Redux / Zustand / Context

Not used.

### Justification

The application is small enough that:

- Server state is managed by TanStack Query.
- UI state is managed locally using React state.

No additional global state library is required.

---

# 8. Form Validation Rules

Validation is performed before submitting the form.

```ts
export function validateLead(values) {
  const errors = {};

  if (!values.first_name?.trim())
    errors.first_name = "First name is required";
  else if (values.first_name.length > 64)
    errors.first_name = "Max 64 characters";

  if (!values.last_name?.trim())
    errors.last_name = "Last name is required";
  else if (values.last_name.length > 64)
    errors.last_name = "Max 64 characters";

  if (!values.email?.trim())
    errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter a valid email";

  const digits = String(values.phone || "").replace(/[+\s-]/g, "");

  if (!digits)
    errors.phone = "Phone is required";
  else if (!/^\d{7,15}$/.test(digits))
    errors.phone = "Phone must be 7–15 digits";

  if (!LEAD_STATUSES.includes(values.status))
    errors.status = "Pick a status";

  if (!values.owner?.trim())
    errors.owner = "Owner is required";

  return errors;
}
```

---

### Phone Normalizer

```ts
export function normalisePhone(input) {
  if (!input) return "";

  const cleaned = input.replace(/[\s-]/g, "");

  return cleaned.startsWith("+")
    ? "+" + cleaned.slice(1).replace(/\D/g, "")
    : cleaned.replace(/\D/g, "");
}
```

---

# 9. Error State Matrix

| Screen | Loading | Error | Empty (No Data) | Empty (Filtered / Not Found) |
|---|---|---|---|---|
| **Leads List** | Loading skeleton rows | "Couldn't load leads." + Retry | "No leads yet. Create your first lead." + New Lead button | "No leads match your search or filter." + Clear Filters |
| **Lead Detail** | Loading skeleton | "Couldn't load this lead." + Retry | N/A | "Lead not found." + Back to Leads |
| **Create Lead** | Submit button spinner | "Couldn't create the lead." (Keep user input) | N/A | N/A |

---

# 10. Styling + Theming

## Component Library

- Material UI (MUI v5)

## Theme

- Default MUI Light Theme

## Dark Mode

- Not implemented (Stretch Goal)

## Styling Approach

- Custom CSS will be kept minimal.
- Most styling will be done using MUI's `sx` prop.
- Global styles will be managed through `ThemeProvider` when required.

---

# 11. File Layout

```text
src/
├── App.tsx
├── main.tsx
├── router.tsx
├── theme.ts
│
├── lib/
│   └── queryClient.ts
│
├── api/
│   └── axios.ts
│
├── features/
│   └── leads/
│       ├── leadsApi.ts
│       ├── useLeads.ts
│       ├── leadsKeys.ts
│       └── validate.ts
│
├── pages/
│   ├── LeadsListPage.tsx
│   ├── LeadDetailPage.tsx
│   ├── CreateLeadPage.tsx
│   └── NotFoundPage.tsx
│
└── components/
    ├── PageHeader.tsx
    ├── StatusChip.tsx
    ├── ConfirmDialog.tsx
    ├── LoadingSkeleton.tsx
    ├── ErrorPanel.tsx
    ├── EmptyPanel.tsx
    └── DataState.tsx
```

### Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `api` | Axios instance and API communication |
| `components` | Reusable UI components shared across pages |
| `features/leads` | Lead-specific API functions, hooks, validation, and query keys |
| `lib` | Shared library configuration (QueryClient) |
| `pages` | Route-level page components |
| Root (`App`, `main`, `router`, `theme`) | Application entry, routing, providers, and theme configuration |

---

# 12. Testing Plan (Stretch Goal)

## Framework

- Vitest

## Test File

```text
src/features/leads/validate.test.ts
```

## Unit Test Targets

### `normalisePhone()`

| Input | Expected Output |
|---|---|
| `+91 98-76 54 32 10` | `+919876543210` |
| `` | `` |
| `abc@123` | `` |

---

### `validateLead()`

Test each validation rule individually.

- First name required
- Last name required
- Email validation
- Phone validation
- Status validation
- Owner validation

---

# 13. Open Questions

## OQ-A

**Question**

Should search and status filtering be handled using backend query parameters or by filtering on the frontend?

**Default Decision**

Use backend query parameters as described in the PRD.

## OQ-B

**Question**

Should the proposed folder structure be followed exactly, or can it be adjusted during implementation?

**Default Decision**

Follow the proposed structure initially and make changes only if they improve maintainability.

## OQ-C

**Question**

Should the lead list refresh automatically after creating or deleting a lead?

**Default Decision**

Use TanStack Query to automatically refresh the Leads List after successful create and delete operations.

---

# 14. Review Sign-off

| Reviewer | Date | Verdict | Comments |
|---|---|---|---|
| Sameer Singh | | Approved / Revise / Reject | |

---

**End of Low-Level Design**