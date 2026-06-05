# Calendar

A simple month-view calendar you can run right in your web browser. You can add, edit, and delete events on any day. Your events are saved on your own computer (in the browser), so they're still there the next time you open the page.

There is nothing to install and no internet connection required — it's just three files: one HTML page, one stylesheet, and one JavaScript file.

## Features

- **Month grid view** — see a full month, six weeks at a time.
- **Move between months** — go to the previous or next month, or jump back to the current month with the **Today** button.
- **Add events** — click any day to open a pop-up form and create an event.
- **Edit events** — click an existing event to change its details.
- **Delete events** — remove an event from the edit form (with a confirmation prompt).
- **Event details** — each event has a date, a title, and an optional time and description.
- **Automatic sorting** — events on the same day are listed in time order.
- **Saved automatically** — events are stored in your browser's `localStorage`, so they survive a page refresh.
- **Basic validation** — the form checks that a title and a valid date are filled in, and that the time looks like `HH:MM`.
- **Responsive layout** — the design adjusts for smaller screens like phones.

## Requirements

- Any modern web browser (Chrome, Edge, Firefox, or Safari).

That's it. There is no build step, no package to install, and no server required.

> **Note:** Events are saved per browser, on the device you're using. Opening the app in a different browser or on a different computer will show a separate set of events. Clearing your browser data will erase saved events.

## Setup

1. Download or clone this project so you have the folder on your computer:

   ```bash
   git clone <repository-url>
   cd calendar-app-demo
   ```

   (If you already have the folder, just open it — you can skip the clone.)

2. Open the app. The easiest way is to double-click `index.html`, or open it from your browser:

   ```
   File  ->  Open File...  ->  select index.html
   ```

That's all you need to start using the calendar.

### Optional: run it with a local web server

You don't need a server, but if you prefer to open it at an address like `http://localhost:8000`, you can start a simple one. Pick whichever you already have installed.

Using Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Using Node.js:

```bash
npx serve
```

Then open the address it prints in your browser.

## Example Usage

Here's a quick walkthrough to try it out:

1. **Open the app** by double-clicking `index.html`. You'll see the current month, with today's date highlighted in blue.
2. **Add an event.** Click on a day — for example, June 10th. A pop-up titled *Add Event* appears.
   - In **Title**, type `Team meeting`.
   - In **Time** (optional), type `14:30`.
   - In **Description** (optional), type `Project sync in Room 2`.
   - Click **Save**.
3. **See it on the calendar.** A small blue chip reading `14:30 Team meeting` now shows on June 10th.
4. **Edit the event.** Click that chip to reopen the form (now titled *Edit Event*). Change the time to `15:00` and click **Save**. The chip updates.
5. **Move around.** Use the `<` and `>` buttons to look at other months, then click **Today** to jump back to the current month.
6. **Delete the event.** Click the chip again, click **Delete**, and confirm. The event is removed.
7. **Check that it's saved.** Add an event, then refresh the page. Your event is still there, because it was saved in your browser.

To close the pop-up without saving, click **Cancel**, press the `Esc` key, or click the dark area outside the form.

## Project Structure

```
calendar-app-demo/
├── index.html   # The page layout: header, month grid, and the add/edit pop-up form
├── styles.css   # All the styling (colors, grid, pop-up, responsive layout)
└── app.js       # The logic: drawing the month, handling clicks, and saving events
```
