# Site 1 UI prototype

The React/Vite interface is an early visual prototype, prepared at the user's
request before the Site 2 allocation setup. It is not the production frontend
integration phase.

It includes navigation for Dashboard, Students, Simple Predicates, COM_MIN,
Minterms, Fragments, Local Query, Distributed Query, and Database Status. The
student-management page uses the QLSV schema fields MA, HT, QQ, NS, GT, DT, TB,
with 60 deterministic sample records mirroring the Site 1 seed data.
The dashboard represents the known project state: Site 1 is online; Site 2 is
being prepared; Linked Server is not configured.

## Frontend structure

```text
app-site1/frontend/src/
├── components/      Shared UI controls and focused student components
├── data/            Prototype student rows and navigation metadata
├── layouts/         Sidebar and top navigation bar
├── lib/             Shared class-name utilities
├── pages/           Dashboard, student management, and prototype pages
├── styles/          Tailwind entry point and responsive page styles
├── App.jsx          Page state and top-level composition
├── main.jsx         React entry point and stylesheet imports
└── styles.css       Shared visual theme
```

The responsive student-management styles live in styles/students.css, with
shared responsive rules in styles/responsive.css. On small screens the sidebar
becomes an off-canvas menu, the student table scrolls horizontally, and the
filters and summary cards rearrange for narrow viewports. Tailwind CSS 4 is
configured through the Vite plugin; Lucide supplies icons and Sonner supplies
action feedback.

Student search, filters, sorting, paging, detail view, CSV export, and
add/edit/delete interactions run against in-browser prototype data. Changes
made through add/edit/delete are not persisted and reset when the page reloads.
The interface does not connect to Express, SQL Server, or a Linked Server.
The query pages describe the intended SQL Server behavior but do not execute
SQL. Connect the UI to the backend after database allocation and distributed
query phases are in place.

## Run locally

From app-site1/frontend:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. The page adapts for desktop and narrow
screens; sidebar navigation and student search are interactive.
