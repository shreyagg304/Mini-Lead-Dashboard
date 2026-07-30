Low-Level Design — Mini Leads Dashboard 

1. Metadata 

Field 

Value 

Project 

Mini Leads Dashboard 

Author 

Shreya Aggarwal 

Date 

2026-07-29 

HLD reference 

v1.0 

Reviewers 

Sameer Singh 

Status 

Draft 

 

2. Data model 

Field 

Type 

Required 

Notes 

id 

number 

Y (BE-assigned) 

primary key 

first_name 

string 

Y 

1 – 64 chars 

last_name 

string 

Y 

1 – 64 chars 

email 

string 

Y 

valid email 

phone 

string 

Y 

normalised — digits + optional leading + 

status 

enum 

Y 

New | Contacted | Qualified | Won | Lost 

owner 

string 

Y 

 

source 

enum? 

N 

Website | Referral | Ad campaign | Cold call | Other 

created_on 

string (ISO date) 

Y (BE-assigned) 

YYYY-MM-DD 

 

3. Route table 

# 

Path 

Element / Page 

Notes 

1 

/ 

<Navigate to="/leads" /> 

root redirect 

2 

/leads 

<LeadsListPage /> 

F-01 – F-08 

3 

/leads/new 

<CreateLeadPage /> 

F-12 – F-17; must be above /leads/:id 

4 

/leads/:id 

<LeadDetailPage /> 

F-09 – F-11 

5 

* 

<NotFoundPage /> 

catch-all 

 

4. Component tree 

<App>                                   # Root component 

│ 

├── <AppProviders>                      # Wraps the app with global providers 

│   ├── ThemeProvider                   # MUI Theme 

│   ├── QueryClientProvider             # TanStack Query 

│   └── BrowserRouter                   # React Router 

│ 

├── <AppLayout>                         # Common layout for all pages 

│   ├── <TopBar />                      # App title / navigation 

│   └── <Outlet />                      # Renders the current route 

│ 

├── <LeadsListPage />                   # Main dashboard 

│   ├── <PageHeader />                  # "Leads" + New Lead button 

│   ├── <FiltersBar />                  # Search + Status filter 

│   │   ├── <SearchInput />             # Debounced search input 

│   │   └── <StatusFilterSelect />      # Filter by status 

│   │ 

│   ├── <LeadsTable />                  # MUI DataGrid 

│   │   ├── <DataGrid />                # Displays all leads 

│   │   └── <StatusChip />              # Status → coloured chip 

│   │ 

│   ├── <PaginationBar />               # Previous / Next + page size 

│   │ 

│   └── <DataState />                   # Decides what to render 

│       ├── <LoadingSkeleton />         # While fetching data 

│       ├── <Alert severity="error" /> # API error 

│       ├── <EmptyPanel />              # No leads / No search results 

│       └── <LeadsTable />              # Success state 

│ 

├── <LeadDetailPage />                  # View a single lead 

│   ├── <PageHeader />                  # Lead name + Delete button 

│   ├── <LeadFields />                  # Lead information 

│   ├── <ActivityFeed />                # Mock activity history 

│   └── <ConfirmDeleteDialog />         # Delete confirmation 

│ 

└── <CreateLeadPage />                  # Create a new lead 

    ├── <PageHeader />                  # "New Lead" 

    ├── <LeadForm />                    # Controlled form 

    │   ├── <TextField /> × 5           # Name, Email, Phone, Owner... 

    │   ├── <SelectField /> × 2         # Status, Source 

    │   └── <FormActions />             # Submit + Cancel buttons 

    │ 

    └── <Alert severity="error" />      # Show submit error (only if creation fails) 

 

Shared Components (src/components/) 

│ 

├── <PageHeader />                      # Reused on multiple pages 

├── <StatusChip />                      # Displays lead status 

├── <ConfirmDialog />                   # Generic confirmation dialog 

├── <DataState />                       # Loading / Error / Empty wrapper 

├── <LoadingSkeleton />                 # Skeleton loader 

├── <EmptyPanel />                      # Empty state UI 

└── <NotFoundPage />                    # 404 page 

5. Per-component contract 

5.1 <LeadsListPage /> 

Props - None (Route component rendered by React Router). 

Local State 

{ 
  page: number,                    // Current page number 
  pageSize: 10 | 25 | 50,           // Number of rows per page 
  searchInput: string,              // User input in search field 
  search: string,                   // Debounced search value 
  statusFilter: LeadStatus | "ALL", // Selected status filter 
  pendingDelete: Lead | null        // Stores lead selected for deletion 
} 

Data Hooks 

useLeadsList()  

useDeleteLead()  

Side Effects 

Debounce the search input using useEffect() (300 ms delay).  

Refresh the lead list after deleting a lead.  

Renders 

Loading → LoadingSkeleton  

Error → DataState with error message  

Empty → EmptyPanel  

Success → LeadsTable 

5.2 <LeadDetailPage /> 

Props - None (Reads id using useParams()). 

Local State 

{ 
  confirmDelete: boolean 
} 

Data Hooks 

useLead(id)  

useDeleteLead()  

Side Effects 

Fetch lead details when the page loads.  

Navigate back to the Leads page after successful deletion.  

Renders 

Loading  

Error  

Lead Not Found  

Lead Details  

 

5.3 <CreateLeadPage /> 

Props - None. 

Local State 

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

Data Hooks 

useCreateLead()  

Side Effects 

Focus the first input field when the page opens.  

Navigate back to the Leads List after successful submission.  

Display a success notification after creating a lead.  

Validation 

Validation will check: 

Required fields  

Valid email  

Valid phone number  

Valid status selection  

Validation runs before submitting the form. 

5.4 <LeadForm /> 

Decision 

A separate LeadForm component will be created. 

Why 

Keeps CreateLeadPage cleaner.  

Can be reused later for the Edit Lead page (Stretch Goal).  

Avoids duplicating form fields.  

 

5.5 <ConfirmDialog /> 

Props 

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

Behaviour 

Opens before deleting a lead.  

Clicking Cancel closes the dialog.  

Clicking Confirm deletes the lead.  

Buttons remain disabled while the delete request is in progress.  

Clicking outside the dialog or pressing Esc closes it (unless loading). 

6. Data-fetching plan 

6.1 Query — useLeadsList(params) 

File: src/features/leads/useLeads.js 

Key factory: leadsKeys.list(params) → ['leads', 'list', params] 

Fetcher: fetchLeadsList(params) — builds query string, calls GET /leads?..., returns { rows, total } (reads X-Total-Count). 

Options: 

staleTime: 30_000 (30 s) 

keepPreviousData: true ← required by NFR-01 

refetchOnWindowFocus: false 

Consumed by: <LeadsListPage /> 

6.2 Query — useLead(id) 

Key: leadsKeys.detail(id) → ['leads', 'detail', String(id)] 

Fetcher: fetchLead(id) — GET /leads/:id; returns Lead or throws LeadNotFoundError on 404. 

Options: enabled: !!id, staleTime: 60_000 

Consumed by: <LeadDetailPage /> 

6.3 Mutation — useCreateLead() 

Mutation fn: POST /leads, body = a validated Lead. 

On success: queryClient.invalidateQueries({ queryKey: leadsKeys.lists()}) 

On error: surface the error to the caller (page shows it). 

Consumed by: <CreateLeadPage /> (and edit stretch if reused). 

6.4 Mutation — useDeleteLead() 

Mutation fn: DELETE /leads/:id 

On success: invalidate leadsKeys.lists() and — for extra polish — remove the detail cache entry via queryClient.removeQueries({ queryKey: leadsKeys.detail(id)}). 

Consumed by: <LeadsListPage /> (row-level) + <LeadDetailPage />. 

6.5 Query-key factory 

export const leadsKeys = { 
  all: ['leads'], 
  lists: () => ['leads', 'list'],          // matches every list variant 
  list: (params) => ['leads', 'list', params], 
  details: () => ['leads', 'detail'], 
  detail: (id) => ['leads', 'detail', String(id)], 
}; 
 

Invalidation map — which mutation invalidates which query: 

Mutation 

Invalidates 

Create 

leadsKeys.lists() 

Delete 

leadsKeys.lists() + removes leadsKeys.detail(deletedId) 

 

7. Global state 

URL / Router State  

- Route parameter (:id) for Lead Detail page.  

- Page number and filters can be stored in the URL (Stretch Goal).  

TanStack Query Cache  

- Leads list  

- Individual lead details  

Local Component State  

- Search input  

- Status filter  

- Pagination  

- Form values 

- Delete confirmation dialog  

- Temporary UI states  

Redux / Zustand / Context  

- None.  

 

The application is small enough that react useState and TanStack Query are sufficient. 

 

Justification  

No additional global state library is required because server state is managed by TanStack Query and UI state is managed locally within each component. 

8. Form-validation rules 

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

 

Phone normaliser — before submit, strip +, spaces, hyphens: 

export function normalisePhone(input) { 
  if (!input) return ''; 
  const cleaned = input.replace(/[\s-]/g, ''); 
  return cleaned.startsWith('+') ? '+' + cleaned.slice(1).replace(/\D/g, '') 
                                 : cleaned.replace(/\D/g, ''); 
} 

9. Error-state matrix 

Screen 

Loading 

Error 

Empty (No Data) 

Empty (Filtered / Not Found) 

Leads List 

Loading skeleton rows 

"Couldn't load leads." + Retry button 

"No leads yet. Create your first lead." + New Lead button 

"No leads match your search or filter." + Clear Filters button 

Lead Detail 

Loading skeleton 

"Couldn't load this lead." + Retry button 

N/A 

"Lead not found." + Back to Leads button 

Create Lead 

Submit button shows loading spinner 

"Couldn't create the lead." (Keep user input) 

N/A 

N/A 

10. Styling + theming 

Component Library - Material UI (MUI v5) 

Palette - Default MUI light theme. 

Dark Mode - Not implemented (Stretch Goal). 

Custom CSS - Custom CSS will be kept minimal. Most styling will be done using MUI's sx prop, with Theme Provider used if global styling is required. 

11. File layout 

src/ 

├── App.jsx 

├── main.jsx 

├── router.jsx 

├── theme.js 

│ 

├── lib/ 

│   └── queryClient.js 

│ 

├── api/ 

│   └── axios.js 

│ 

├── features/ 

│   └── leads/ 

│       ├── leadsApi.js 

│       ├── useLeads.js 

│       ├── leadsKeys.js 

│       └── validate.js 

│ 

├── pages/ 

│   ├── LeadsListPage.jsx 

│   ├── LeadDetailPage.jsx 

│   ├── CreateLeadPage.jsx 

│   └── NotFoundPage.jsx 

│ 

└── components/ 

    ├── PageHeader.jsx 

    ├── StatusChip.jsx 

    ├── ConfirmDialog.jsx 

    ├── LoadingSkeleton.jsx 

    ├── ErrorPanel.jsx 

    ├── EmptyPanel.jsx 

    └── DataState.jsx 

12. Testing plan (F-27 stretch) 

Unit Test Target 

Test normalisePhone() with different phone number formats. 

Test valid, empty, and invalid inputs. 

Test Cases 

"+91 98-76 54 32 10" → "+919876543210" 

"" → "" 

"abc@123" → "" 

 

Test validateLead() for each validation rule: 

First name required 

Last name required 

Valid email 

Valid phone number 

Valid status 

Owner required 

Framework - Vitest 

Test File - Src/features/leads/validate.test.js 

13. Open questions 

OQ-A - Question: Should the search and status filter be handled by the backend (API query parameters) or by filtering the data on the frontend? 

  

Default if unresolved: I will use backend query parameters as described in the PRD. 

  

OQ-B - Question: Should the project follow the proposed folder structure exactly, or can the structure be adjusted if it improves maintainability during implementation? 

  

Default if unresolved: I will follow the proposed project structure and only make changes if necessary, during implementation. 

  

OQ-C - Question:  Should the lead list refresh automatically after creating or deleting a lead, or should the page be refreshed manually? 

  

Default if unresolved: I will use TanStack Query to refresh the lead list automatically after successful create and delete operations. 

14. Review sign-off 

Reviewer 

Date 

Verdict 

Comments 

Sameer Singh 

 

Approved / Revise / Reject 

 

