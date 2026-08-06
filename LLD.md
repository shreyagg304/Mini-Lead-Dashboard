# Low-Level Design — Mini Leads Dashboard

---

## 1. Metadata

| Field | Value |
|---|---|
| Project | Mini Leads Dashboard |
| Author | Shreya Aggarwal |
| Date | 2026-08-06 |
| HLD reference | v2.0 |
| Reviewers | Sameer Singh |
| Status | Completed |

---

# 2. Data Model

The application revolves around a single **Lead** entity shared across API calls, React Query hooks, and form components.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | Y | Backend generated unique id |
| `first_name` | string | Y | Maximum 64 characters |
| `last_name` | string | Y | Maximum 64 characters |
| `email` | string | Y | Valid email |
| `phone` | string | Y | Normalized before submit |
| `status` | string | Y | New, Contacted, Qualified, Won, Lost |
| `owner` | string | Y | Required |
| `source` | string | N | Optional |
| `created_on` | string | Y | ISO Date |

### LeadValues

```ts
export type LeadValues = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    owner: string;
    source: string;
    created_on: string;
}
```

### LeadErrors

```ts
export type LeadErrors = {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    status?: string;
    owner?: string;
}
```

---

# 3. Route Table

| # | Path | Page | Notes |
|---|---|---|---|
| 1 | `/` | Navigate to `/leads` | Root redirect |
| 2 | `/leads` | LeadsListPage | Main dashboard |
| 3 | `/leads/new` | CreateLeadPage | Create new lead |
| 4 | `/leads/:id` | LeadDetailPage | View lead |
| 5 | `/leads/:id/edit` | EditLeadPage | Edit existing lead |

Static routes are placed before parameterized routes.

---

# 4. Component Tree

```text
<App>

├── ThemeProvider
│
├── QueryClientProvider
│
├── BrowserRouter
│
└── Routes
    │
    ├── LeadsListPage
    │     │
    │     ├── Search TextField
    │     ├── Status Select
    │     ├── ThemeToggle
    │     ├── Add Lead Button
    │     ├── DataState
    │     ├── Table
    │     ├── StatusChip
    │     ├── ConfirmDialog
    │     └── Pagination
    │
    ├── LeadDetailPage
    │     │
    │     ├── DataState
    │     ├── StatusChip
    │     ├── ConfirmDialog
    │     └── Activity Section
    │
    ├── CreateLeadPage
    │     │
    │     └── LeadForm
    │
    └── EditLeadPage
          │
          └── LeadForm
```

Shared Components

- LeadForm
- DataState
- StatusChip
- ConfirmDialog
- ThemeToggle

---

# 5. Per Component Contract

## 5.1 LeadsListPage

### Props

None

### Local State

```ts
page
rowPerPage

text
debouncedText

status

sortBy
sortDirection
```

### React Query Hooks

```ts
useLeads(...)
```

### Responsibilities

- Fetch paginated data
- Search leads
- Filter by status
- Sort columns
- Pagination
- Navigate to detail page
- Navigate to create page
- Delete lead
- Toggle theme

### Side Effects

Debounce search using

```ts
useEffect(() => {

}, [text])
```

---

## 5.2 LeadDetailPage

### Props

None

### Hooks

```ts
useParams()

useNavigate()

useLead(id)
```

### Responsibilities

- Display lead information
- Edit button
- Delete button
- Activity Feed
- Loading/Error/Empty states

---

## 5.3 CreateLeadPage

### Props

None

### Hooks

```ts
useCreateLead()

useNavigate()

useQueryClient()
```

### Responsibilities

- Render LeadForm
- Create lead
- Invalidate cache
- Navigate back to Leads List

LeadForm receives

```ts
initialValues

buttonText

onSubmit
```

---

## 5.4 EditLeadPage

### Props

None

### Hooks

```ts
useLead(id)

useUpdateLead()

useNavigate()

useQueryClient()
```

### Responsibilities

- Fetch selected lead
- Pass existing values into LeadForm
- Save updated lead
- Invalidate list cache
- Invalidate detail cache
- Navigate back to Lead Detail

LeadForm receives

```ts
initialValues={response}

buttonText="Save Changes"

onSubmit(...)
```

---

## 5.5 LeadForm

### Decision

LeadForm is shared between CreateLeadPage and EditLeadPage to avoid duplicate code.

### Props

```ts
type LeadFormProps = {

    initialValues: LeadValues;

    buttonText: string;

    onSubmit: (values: LeadValues) => void;
}
```

### Local State

```ts
formData

values

errors

submitError
```

### Responsibilities

- Controlled inputs
- Validation
- Phone normalization
- Error display
- Call parent onSubmit
- Update values when initialValues change

### Side Effects

```ts
useEffect(() => {

    setFormData(...)

}, [initialValues])
```

This ensures Edit Lead loads values after the API request completes.

---

## 5.6 DataState

Responsibilities

- Loading state
- Error state
- Empty state
- Render children on success

Used by

- LeadsListPage
- LeadDetailPage

---

## 5.7 ConfirmDialog

Responsibilities

- Confirm delete action
- Prevent accidental deletion

Used by

- Leads List
- Lead Detail

---

## 5.8 ThemeToggle

Responsibilities

- Switch between Light Theme and Dark Theme
- Update Theme Context
- Trigger ThemeProvider re-render

```
# 6. Data Fetching Plan

---

## 6.1 Query — useLeads()

**File**

```text
src/features/leads/useLeads.ts
```

### Query Key

```ts
[
    "leads",
    page,
    rowPerPage,
    debouncedText,
    status,
    sortBy,
    sortDirection
]
```

### Fetcher

```ts
getLeads(
    page,
    rowPerPage,
    debouncedText,
    status,
    sortBy,
    sortDirection
)
```

### Responsibilities

- Fetch paginated leads
- Search
- Filter
- Sort
- Cache server data

Consumed by

- LeadsListPage

---

## 6.2 Query — useLead()

### Query Key

```ts
["lead", id]
```

### Fetcher

```ts
getLead(id)
```

### Responsibilities

- Fetch a single lead
- Cache lead detail

Consumed by

- LeadDetailPage
- EditLeadPage

---

## 6.3 Mutation — useCreateLead()

### Mutation Function

```ts
createLead()
```

### On Success

- Invalidate

```ts
["leads"]
```

- Navigate back to Leads List

Consumed by

- CreateLeadPage

---

## 6.4 Mutation — useUpdateLead()

### Mutation Function

```ts
updateLead()
```

### On Success

Invalidate

```ts
["leads"]
```

Invalidate

```ts
["lead"]
```

Navigate back to Lead Detail

Consumed by

- EditLeadPage

---

## 6.5 Mutation — useDeleteLead()

### Mutation Function

```ts
deleteLead()
```

### On Success

Invalidate

```ts
["leads"]
```

Remove deleted detail query

Navigate back to Leads List (when deleting from Detail page)

Consumed by

- LeadsListPage
- LeadDetailPage

---

# 7. Global State

Most application state is local.

### React Query

Stores

- Leads List
- Lead Detail

### Local Component State

Stores

- Form values
- Errors
- Pagination
- Search
- Filters
- Sorting
- Dialog state

### Theme Context

Stores

```ts
mode

toggleTheme()
```

Used by

- ThemeProvider
- ThemeToggle

No Redux or Zustand is required.

---

# 8. Form Validation Rules

Validation lives inside

```text
src/features/leads/validateLead.ts
```

Rules

| Field | Validation |
|---|---|
| First Name | Required, max 64 chars |
| Last Name | Required, max 64 chars |
| Email | Required, valid email |
| Phone | Required, 7–15 digits |
| Status | Must be one of predefined statuses |
| Owner | Required |

Returns

```ts
LeadErrors
```

Phone numbers are normalized before submission.

```ts
normalisePhone()
```

Examples

```
9876-543210

↓

9876543210
```

```
+91 98765 43210

↓

+919876543210
```

---

# 9. Error State Matrix

| Screen | Loading | Error | Empty |
|---|---|---|---|
| Leads List | Loading spinner | Retry button | No leads available |
| Lead Detail | Loading spinner | Retry button | Lead not found |
| Create Lead | Disabled submit button | Submit error shown below form | N/A |
| Edit Lead | Disabled submit button | Submit error shown below form | N/A |

---

# 10. Styling + Theming

Component Library

- Material UI

Styling

- `sx`
- Material UI components
- Minimal custom CSS

Theme

Two themes

```ts
lightTheme

darkTheme
```

Managed using

```ts
ThemeContext
```

Toggle

```ts
ThemeToggle
```

The toggle updates ThemeProvider, causing the application to re-render with the selected theme.

Responsive layouts use

- Box
- Stack
- Paper
- Flexbox

---

# 11. File Layout

```text
src/

├── api/
│   └── axios.ts
│
├── components/
│   ├── ConfirmDialog.tsx
│   ├── DataState.tsx
│   ├── LeadForm.tsx
│   ├── StatusChip.tsx
│   └── ThemeToggle.tsx
│
├── context/
│   └── ThemeContext.tsx
│
├── features/
│   └── leads/
│       ├── leadsApi.ts
│       ├── useLead.ts
│       ├── useLeads.ts
│       ├── useCreateLead.ts
│       ├── useUpdateLead.ts
│       ├── useDeleteLead.ts
│       └── validateLead.ts
│
├── pages/
│   ├── LeadsListPage.tsx
│   ├── LeadDetailPage.tsx
│   ├── CreateLeadPage.tsx
│   └── EditLeadPage.tsx
│
├── theme/
│   └── theme.ts
│
├── App.tsx
└── main.tsx
```

---

# 12. Testing Plan

Manual Testing

- Create Lead
- Edit Lead
- Delete Lead
- View Lead
- Search
- Filter
- Sorting
- Pagination
- Theme Toggle
- Responsive Layout

Future Unit Tests

- validateLead()
- normalisePhone()

Future Integration Tests

- Create Flow
- Edit Flow
- Delete Flow

---

# 13. Open Questions

No major open questions remain.

Items resolved during implementation

- Reusable LeadForm instead of separate Create/Edit forms.
- String IDs instead of numeric IDs.
- PUT used for updating leads.
- React Query cache invalidation after mutations.
- Theme switching implemented using Theme Context.

---

# 14. Review Sign-off

| Reviewer | Date | Verdict | Comments |
|---|---|---|---|
| Sameer Singh | | Approved / Revise / Reject | |

---

**End of LLD**