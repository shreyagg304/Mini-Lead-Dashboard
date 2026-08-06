# Mini Leads Dashboard

A lightweight CRM dashboard built with **React**, **TypeScript**, **Material UI**, **TanStack Query**, and **json-server**. The application allows users to manage leads through a responsive interface with searching, filtering, sorting, pagination, and CRUD operations.

---

## Features

- 📋 View all leads
- 🔍 Search leads by first name
- 🎯 Filter leads by status
- ↕️ Sort leads by Name, Status, and Created Date
- 📄 View lead details
- ➕ Create new leads
- ✏️ Edit existing leads
- 🗑️ Delete leads with confirmation dialog
- 📑 Pagination
- 🌗 Light / Dark theme toggle
- 📱 Responsive layout
- ⚠️ Loading, Error, and Empty states
- ✅ Client-side form validation

---

## Tech Stack

### Frontend

- React
- TypeScript
- React Router
- Material UI (MUI)

### Data Fetching

- TanStack Query
- Axios

### Backend

- json-server

---

## Folder Structure

```text
src/
│
├── api/
├── components/
├── context/
├── features/
│   └── leads/
├── pages/
├── theme/
├── App.tsx
└── main.tsx
```

---

## Project Structure

### Pages

- Leads List
- Lead Details
- Create Lead
- Edit Lead

### Shared Components

- LeadForm
- DataState
- ConfirmDialog
- StatusChip
- ThemeToggle

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Leadboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

### 4. Start json-server

```bash
json-server --watch db.json --port 4000
```

The frontend will be available at:

```
http://localhost:5173
```

The backend will run at:

```
http://localhost:4000
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/leads` | Fetch all leads |
| GET | `/leads/:id` | Fetch lead details |
| POST | `/leads` | Create a lead |
| PUT | `/leads/:id` | Update a lead |
| DELETE | `/leads/:id` | Delete a lead |

---

## Architecture

- React Router for navigation
- TanStack Query for server-state management
- Axios for API communication
- Material UI for UI components
- React Context for theme management
- Reusable `LeadForm` component shared between Create and Edit pages

---

## Validation

The Lead form validates:

- First Name
- Last Name
- Email
- Phone Number
- Owner
- Status

Phone numbers are normalized before submission.

---

## Future Improvements

- Authentication
- Toast notifications
- Activity history from backend
- Unit and integration tests
- Persistent theme preference
- Advanced filtering
- Dashboard analytics

---

## Screenshots

<img width="1863" height="886" alt="image" src="https://github.com/user-attachments/assets/6a98c9b9-5f34-4bf4-93fa-71256e7737a7" />
<img width="1872" height="881" alt="image" src="https://github.com/user-attachments/assets/beb7babb-7dde-4e1d-aab7-5cab34f6bf34" />
<img width="1901" height="876" alt="image" src="https://github.com/user-attachments/assets/a8d274eb-9df7-4d9e-abf9-9515bd72c364" />
<img width="1902" height="891" alt="image" src="https://github.com/user-attachments/assets/4361c559-e8b8-4743-9bc8-1cfe04e7e642" />

---

## Author

**Shreya Aggarwal**

Software Developer Intern

---
