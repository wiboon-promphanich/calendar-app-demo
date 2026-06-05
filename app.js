// Simple month-view calendar with localStorage-backed events.
(function () {
  'use strict';

  var STORAGE_KEY = 'calendar.events';

  // --- State -----------------------------------------------------------------
  var viewDate = startOfMonth(new Date()); // first day of the displayed month
  var events = loadEvents();

  // --- DOM refs ---------------------------------------------------------------
  var grid = document.getElementById('grid');
  var monthTitle = document.getElementById('monthTitle');
  var overlay = document.getElementById('modalOverlay');
  var modalTitle = document.getElementById('modalTitle');
  var form = document.getElementById('eventForm');
  var fId = document.getElementById('eventId');
  var fDate = document.getElementById('eventDate');
  var fTitle = document.getElementById('eventTitle');
  var fTime = document.getElementById('eventTime');
  var fDesc = document.getElementById('eventDesc');
  var formError = document.getElementById('formError');
  var deleteBtn = document.getElementById('deleteBtn');

  // --- Storage ----------------------------------------------------------------
  function loadEvents() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Could not read events; starting empty.', e);
      return [];
    }
  }

  function saveEvents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Could not save events.', e);
    }
  }

  // --- Date helpers -----------------------------------------------------------
  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }

  function toISODate(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  // --- Rendering --------------------------------------------------------------
  function renderCalendar() {
    var year = viewDate.getFullYear();
    var month = viewDate.getMonth();
    monthTitle.textContent = year + ' ' + viewDate.toLocaleString('en-US', { month: 'long' });

    // Start on the Sunday on/before the 1st; render 42 cells (6 weeks).
    var start = new Date(year, month, 1);
    start.setDate(start.getDate() - start.getDay());
    var today = new Date();

    grid.innerHTML = '';
    for (var i = 0; i < 42; i++) {
      var cellDate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      grid.appendChild(buildCell(cellDate, month, today, i));
    }
  }

  function buildCell(cellDate, viewMonth, today, index) {
    var iso = toISODate(cellDate);
    var cell = document.createElement('div');
    cell.className = 'cell';
    if (cellDate.getMonth() !== viewMonth) cell.classList.add('other-month');
    if (isSameDate(cellDate, today)) cell.classList.add('today');
    cell.dataset.date = iso;

    var num = document.createElement('div');
    num.className = 'day-number';
    // Label the first cell and the 1st of each month with its month, e.g. "Jun 1".
    if (cellDate.getDate() === 1 || index === 0) {
      num.textContent = cellDate.toLocaleString('en-US', { month: 'short' }) + ' ' + cellDate.getDate();
    } else {
      num.textContent = cellDate.getDate();
    }
    cell.appendChild(num);

    var list = document.createElement('div');
    list.className = 'events';
    eventsForDate(iso).forEach(function (ev) {
      list.appendChild(buildChip(ev));
    });
    cell.appendChild(list);
    return cell;
  }

  function buildChip(ev) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'event-chip';
    chip.dataset.id = ev.id;
    chip.title = (ev.time ? ev.time + ' ' : '') + ev.title;
    if (ev.time) {
      var t = document.createElement('span');
      t.className = 'chip-time';
      t.textContent = ev.time;
      chip.appendChild(t);
    }
    chip.appendChild(document.createTextNode(ev.title));
    return chip;
  }

  function eventsForDate(iso) {
    return events
      .filter(function (e) { return e.date === iso; })
      .sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); });
  }

  // --- Modal ------------------------------------------------------------------
  function openModal(dateStr, ev) {
    formError.textContent = '';
    if (ev) {
      modalTitle.textContent = 'Edit Event';
      fId.value = ev.id;
      fDate.value = ev.date;
      fTitle.value = ev.title;
      fTime.value = ev.time || '';
      fDesc.value = ev.description || '';
      deleteBtn.classList.remove('hidden');
    } else {
      modalTitle.textContent = 'Add Event';
      form.reset();
      fId.value = '';
      fDate.value = dateStr || toISODate(new Date());
      deleteBtn.classList.add('hidden');
    }
    overlay.classList.remove('hidden');
    fTitle.focus();
  }

  function closeModal() {
    overlay.classList.add('hidden');
  }

  // --- Validation -------------------------------------------------------------
  function validateForm() {
    var title = fTitle.value.trim();
    if (!title) return 'Please enter a title.';
    if (title.length > 80) return 'Title must be 80 characters or fewer.';
    if (!fDate.value || isNaN(new Date(fDate.value).getTime())) return 'Please choose a valid date.';
    if (fTime.value && !/^([01]\d|2[0-3]):[0-5]\d$/.test(fTime.value)) {
      return 'Time must be in HH:MM format (00:00–23:59).';
    }
    return null;
  }

  // --- CRUD -------------------------------------------------------------------
  function saveEvent(e) {
    e.preventDefault();
    var error = validateForm();
    if (error) { formError.textContent = error; return; }

    var data = {
      date: fDate.value,
      title: fTitle.value.trim(),
      time: fTime.value || '',
      description: fDesc.value.trim()
    };

    if (fId.value) {
      events = events.map(function (ev) {
        return ev.id === fId.value ? Object.assign({}, ev, data) : ev;
      });
    } else {
      data.id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
      events.push(data);
    }

    saveEvents();
    renderCalendar();
    closeModal();
  }

  function deleteEvent() {
    if (!fId.value) return;
    if (!confirm('Delete this event?')) return;
    events = events.filter(function (ev) { return ev.id !== fId.value; });
    saveEvents();
    renderCalendar();
    closeModal();
  }

  // --- Event wiring -----------------------------------------------------------
  document.getElementById('prevBtn').addEventListener('click', function () {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
  });
  document.getElementById('nextBtn').addEventListener('click', function () {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
  });
  document.getElementById('todayBtn').addEventListener('click', function () {
    viewDate = startOfMonth(new Date());
    renderCalendar();
  });

  grid.addEventListener('click', function (e) {
    var chip = e.target.closest('.event-chip');
    if (chip) {
      var ev = events.find(function (x) { return x.id === chip.dataset.id; });
      if (ev) openModal(ev.date, ev);
      return;
    }
    var cell = e.target.closest('.cell');
    if (cell) openModal(cell.dataset.date, null);
  });

  form.addEventListener('submit', saveEvent);
  deleteBtn.addEventListener('click', deleteEvent);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
  });

  // --- Init -------------------------------------------------------------------
  renderCalendar();
})();
