High-Level Design — Mini Leads Dashboard 

1. Metadata 

Field 

Value 

Project name 

Mini Leads Dashboard 

Author 

Shreya Aggarwal 

Date 

2026-07-29 

Reviewers 

Sameer Singh 

Status 

Draft 

Related docs 

PRD 

 

2. Purpose 

The Mini Leads Dashboard is a lightweight CRM application designed for small sales teams to manage their leads efficiently. It allows sales agents to view all leads in a searchable and filterable table, access detailed information about individual leads, create new leads, and delete duplicate or invalid entries with confirmation. The application focuses on providing a simple, responsive, and user-friendly interface. 

3. Context diagram 

Sales Agent 
(Chrome Browser) 

↓ 
HTTP + JSON 
↓ 

Leadboard SPA (React) 
React Router │ MUI │ TanStack Query │ axios 

↓ 
REST API Request 
↓ 

json-server 
(db.json) 

↓ 

Lead Data 
(JSON) 

Sales Agent – Person who uses the application to manage leads. 

Browser – Where the user interacts with the React application. 

HTTP + JSON – Used by the frontend to communicate with the backend and exchange data in JSON format. 

Leadboard SPA (React) – The main frontend application where users can view, search, create, and manage leads. 

React Router – Handles navigation between pages (Leads List, Lead Detail, Create Lead).  

MUI – Provides the user interface components.  

TanStack Query – Fetches, caches, and manages server data.  

axios – Sends API requests to the backend.  

json-server – A mock backend that stores lead data in a local db.json file and exposes REST APIs. 

4. Top-level component groups 

# 

Group 

What lives here 

1 

App shell 

Router, Theme Provider, QueryClient Provider, global layout 

2 

Leads list page 

Lead table, search, status filter, sorting, pagination, page-level state 

3 

Lead detail page 

Lead information, activity history, delete confirmation dialog 

4 

Create-lead form 

Input fields, validation, submit handler 

5 

Data layer 

axios configuration, TanStack Query hooks, API calls, query keys 

6 

Shared UI 

LoadingState, ErrorState, EmptyState, ConfirmDialog, reusable MUI components  

 

5. External interfaces 

5.1 Mock backend 

Field 

Value 

Chosen backend 

json-server  

Base URL 

http://localhost:4000 

Data shape summary 

Leads stored as a JSON array containing the fields defined in the PRD. 

5.2 Endpoints 

Endpoint 

Method 

Purpose 

/leads 

GET 

list 

/leads/:id 

GET 

detail 

/leads 

POST 

create 

/leads/:id 

DELETE 

delete 

 

6. Key architectural decisions  

KAD-01 Backend 

Decision - I will use json-server as the backend. 

Why - It is easy to set up, works locally, and behaves like a real backend. 

Trade-off - I have to run both the React app and the json-server separately. 

KAD-02 Form State 

Decision - I will use React's useState to manage the form. 

Why - The form is small, so useState is simple and enough for this project. 

Trade-off - If the form becomes much larger, managing it with only useState could become difficult. 

KAD-03 Cache 

Decision - I will use the default caching provided by TanStack Query. 

Why - It reduces unnecessary API requests and is the recommended approach. 

Trade-off - I still need to learn how the cache works. 

KAD-04 Refresh 

Decision - After creating a lead, I will refresh the leads list. 

Why - So, the newly created lead is visible immediately. 

Trade-off - Refreshing the list means making another API request. 

KAD-05 UI Library 

Decision - I will use Material UI for the interface. 

Why - It provides ready-made components and helps me build the UI faster. 

Trade-off - It gives me less freedom to customize compared to writing every component from scratch. 

7. Cross-cutting concerns 

Concern 

How you're handling it 

Loading / error / empty states 

Show separate loading, error, and empty state UI to keep users informed. 

Debounced input 

Delay the search request by around 300 ms to avoid sending a request on every keystroke. 

Global error handling 

Display a user-friendly error message when an API request fails. 

Toast / notification pattern 

Show a success message after creating or deleting a lead and an error message if an action fails. 

Confirm-before-delete pattern 

Show a confirmation dialog before permanently deleting a lead. 

Responsive layout strategy 

Use Material UI's responsive components so the application works on desktop and mobile screens. 

Accessibility baseline 

Use semantic HTML, proper labels for inputs, and ensure keyboard accessibility. 

 

8. Risks + mitigations 

 

# 

Risk 

Likelihood 

Impact 

Mitigation 

1 

First time using TanStack Query for data fetching and caching. 

High 

Med 

Read the documentation, practice with small examples, and ask for help if blocked. 

2 

Implementing search, pagination, and filtering together may be confusing. 

Med 

Med 

Build one feature at a time and test each before moving to the next. 

3 

Integrating multiple technologies (React, MUI, axios, React Router, TanStack Query) for the first time. 

High 

High 

Follow the project structure, understand each technology's role, and ask questions when needed. 

 

9. Alternatives considered 

Alternative to KAD-01 

Considered: mockapi.io  

Why rejected: Requires an online service, while json-server runs locally and is easier to manage during development.  

Alternative to KAD-05 

Considered: Tailwind CSS  

Why rejected: Material UI provides ready-made components and is already part of the project requirements, so it helps build the interface faster. 

 

10. Out of scope confirmation 

 

I confirm I am not building : authentication, multi-tenancy, real-time updates, outbound messaging, reports / charts, CSV import / export, deals / opportunities, or deployment. If any of these creep into my design, I will stop and re-scope before continuing. 

11. Review sign-off 

 

Reviewer 

Date 

Verdict 

Comments 

Sameer Singh 

 

Approved / Revise / Reject 

 

