# Calendar App — Todo

A simple month-view calendar (vanilla HTML/CSS/JS) with localStorage-backed events.

## Tasks

- [x] **1. Project scaffold (`index.html`)**
  - Acceptance: Page loads with a header (‹ › Today buttons + month title), a weekday
    row, an empty 7-column grid container, and hidden modal markup. Links `styles.css`
    and `app.js`. No console errors.

- [x] **2. Styling & responsive layout (`styles.css`)**
  - Acceptance: Month renders as a 7-column CSS grid; header uses flexbox; today and
    other-month cells are visually distinct; modal overlays centered. At ≤600px the
    layout stays usable (smaller cells/fonts, controls wrap, modal full-width).

- [x] **3. State & localStorage (`app.js`)**
  - Acceptance: Events load from `localStorage` key `calendar.events` on start and save
    after every change. Corrupt/missing data falls back to an empty list without crashing.
    Each event has `{ id, date, title, time?, description? }`.

- [x] **4. Render month grid**
  - Acceptance: For the viewed month, a 6-row (42-cell) grid shows correct day numbers,
    leading/trailing days from adjacent months dimmed, today highlighted, and each day's
    events listed as clickable chips. Header shows "Month YYYY".

- [x] **5. Month navigation (Prev / Next / Today)**
  - Acceptance: ‹ and › move one month back/forward and re-render with updated title;
    Today returns to the current month. Year rolls over correctly (Dec→Jan, Jan→Dec).

- [x] **6. Add-event modal**
  - Acceptance: Clicking a day cell opens the modal in Add mode with that date prefilled.
    Fields: date, title, time (optional), description (optional). Cancel / Esc / backdrop
    click close it without saving.

- [x] **7. Edit & delete events**
  - Acceptance: Clicking an event chip opens the modal in Edit mode (fields prefilled,
    Delete button shown). Saving updates the event; Delete (after confirm) removes it.
    Grid re-renders and changes persist after reload.

- [x] **8. Validation**
  - Acceptance: Title is required (trimmed, non-empty, ≤80 chars); date required and valid;
    time optional but must match `HH:MM` (00:00–23:59) if provided. Invalid input shows an
    inline error and blocks saving.

## Acceptance — end to end
- [x] Add, edit, and delete events; all persist across page reloads.
- [x] Invalid input (empty title, bad time) is rejected with a visible message.
- [x] Works offline with no dependencies; usable on mobile widths.

## Review

### Summary
Built a self-contained month-view calendar with no dependencies or build step. Four files:

- **`index.html`** — header (‹ › / Today + month title), weekday row, an empty `#grid`
  container the script fills, and the add/edit event modal (date, title, time, description,
  inline error, Save / Cancel / Delete).
- **`styles.css`** — 7-column CSS-grid month, flexbox header, event chips, distinct
  today / other-month cells, centered modal overlay, and a ≤600px responsive breakpoint.
- **`app.js`** — IIFE holding all logic:
  - **Storage:** `loadEvents()` / `saveEvents()` against `localStorage` key
    `calendar.events`, wrapped in try/catch so missing or corrupt JSON falls back to `[]`.
  - **State:** `viewDate` (first of displayed month) and `events` array; events are
    `{ id, date: "YYYY-MM-DD", title, time, description }` with `id` from `crypto.randomUUID()`.
  - **Render:** `renderCalendar()` draws a fixed 42-cell (6-week) grid starting on the
    Sunday on/before the 1st, dims adjacent-month days, highlights today, and renders each
    day's events as time-sorted clickable chips.
  - **Navigation:** Prev/Next shift the month (year rolls over via `setMonth`); Today resets.
  - **Modal & CRUD:** clicking a cell opens Add (date prefilled); clicking a chip opens
    Edit (prefilled + Delete). `saveEvent()` inserts or updates by id; `deleteEvent()`
    confirms first. Closes on Cancel / Esc / backdrop click.
  - **Validation:** `validateForm()` requires a trimmed title (≤80 chars), a valid date,
    and—if present—an `HH:MM` time; errors show inline and block saving.

### How to run
Open `index.html` in any modern browser — no server or install needed. Events persist in
that browser's localStorage across reloads.

### Notes / possible follow-ups
- No automated tests (vanilla app); `node --check app.js` passes. Verified by manual review
  per the verification checklist in the plan.
- Possible enhancements: week/day views, drag-to-move events, multi-day events, color/category
  labels, and import/export of the JSON.
