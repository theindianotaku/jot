# Jot

A simple daily journal app for tracking standup updates.

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- Radix UI (Dialog, DropdownMenu, Select)
- cmdk (command palette)
- lucide-react (icons)
- localStorage for persistence

## Project Structure

```
src/
├── components/     # React components
├── context/        # StorageContext for shared state
├── hooks/          # useStorage hook
├── utils/          # dates.ts, export.ts
├── types.ts        # TypeScript types
├── App.tsx         # Routes
└── App.css         # All styles
```

## Key Features

- Two sections: "Previously" and "Today"
- Nested todos with Tab/Shift+Tab
- Export to Slack (plain text, mrkdwn) or Markdown
- Spotlight-style date picker
- Local storage persistence

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```
