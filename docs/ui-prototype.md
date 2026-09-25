# Site 1 UI prototype

The React/Vite interface is an early visual prototype, prepared at the user's
request before the Site 2 allocation setup. It is not the production frontend
integration phase.

It includes navigation for Dashboard, Students, Simple Predicates, COM_MIN,
Minterms, Fragments, Local Query, Distributed Query, and Database Status.
The dashboard represents the known project state: Site 1 is online; Site 2 is
being prepared; Linked Server is not configured.

## Frontend structure

```text
app-site1/frontend/src/
├── components/      Reusable cards, headings, and student table
├── data/            Prototype student rows and navigation metadata
├── layouts/         Sidebar and top navigation bar
├── pages/           Dashboard, students, and other prototype pages
├── styles/          Responsive breakpoint overrides
├── App.jsx          Page state and top-level composition
├── main.jsx         React entry point and stylesheet imports
└── styles.css       Shared visual theme
```

The responsive rules live in styles/responsive.css so viewport adjustments
can be changed without editing the shared theme. The sidebar becomes a
scrollable icon rail on small screens; table contents remain horizontally
scrollable, and dashboard cards stack on narrow viewports.

All displayed student rows and query interactions are static prototype data.
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
