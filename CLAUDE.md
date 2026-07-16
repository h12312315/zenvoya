# DSM Style Guide — Zenvoya Design System

## Project Overview
A comprehensive design system style guide website with live interactive prototypes for the Zenvoya travel app. Single-page application built with vanilla HTML, CSS, and JavaScript.

## Tech Stack
- **HTML/CSS/JS** — no frameworks, no build tools
- **Python dev server** — `python3 serve.py` on port 3456
- All code lives in `index.html`, `styles.css`, `script.js`
- Design tokens in `system.css` and `theme.css`

## Architecture
- Prototypes are organized under V4 in the sidebar navigation
- Each prototype is a `<section>` with `id` and `data-page` attributes
- Prototype init functions follow the pattern: `initProtoX()` with an `pXInitialized` guard flag
- Views within prototypes toggle via CSS class (e.g., `.p7-view-active`, `.pn-view-active`)
- Navigation handled by `navigateTo(pageId)` in `script.js`
- Phone mockups use `.proto-phone > .proto-screen` container pattern

## Skills
- Always use the `frontend-design` skill when available for UI/design tasks
