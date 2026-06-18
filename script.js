/* ─────────────────────────────────────────────
   AL MAQAM AL MAHMOUD — Main Script
   Handles: navigation, scroll-reveal, calendar,
   booking form, contact form
───────────────────────────────────────────── */

'use strict';

/* ─── NAV ───────────────────────────────────── */
(function initNav() {
  const nav        = document.querySelector('.nav');
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (!nav) return;

  // Shrink + blur on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active page link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ─── SCROLL REVEAL ─────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ─── BOOKING CALENDAR ──────────────────────── */
(function initCalendar() {
  const calEl = document.querySelector('.calendar-days');
  if (!calEl) return;

  /* ── EDIT UNAVAILABLE DATES HERE ──────────────
     Format: 'YYYY-MM-DD'
     Add or remove dates from this Set to mark
     them as unavailable (shown in red).
  ─────────────────────────────────────────────── */
  const UNAVAILABLE_DATES = new Set([
    '2026-07-04',
    '2026-07-11',
    '2026-07-18',
    '2026-07-19',
    '2026-08-01',
    '2026-08-15',
    '2026-08-22',
    '2026-09-05',
    '2026-09-12',
    '2026-09-19',
    '2026-09-20',
    '2026-10-03',
  ]);

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const today       = new Date();
  today.setHours(0, 0, 0, 0);
  let viewYear  = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate  = null;

  const monthLabel  = document.querySelector('.calendar-month-label');
  const prevBtn     = document.querySelector('.calendar-prev');
  const nextBtn     = document.querySelector('.calendar-next');
  const formWrapper = document.querySelector('.booking-form');
  const prompt      = document.querySelector('.booking-prompt');
  const selectedDateLabel = document.querySelector('.booking-selected-date');

  function pad(n) { return String(n).padStart(2, '0'); }

  function toKey(y, m, d) {
    return `${y}-${pad(m + 1)}-${pad(d)}`;
  }

  function renderCalendar() {
    monthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;

    prevBtn.disabled = (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    calEl.innerHTML = '';

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      calEl.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.textContent = d;

      const key       = toKey(viewYear, viewMonth, d);
      const cellDate  = new Date(viewYear, viewMonth, d);
      const isPast    = cellDate < today;
      const isToday   = cellDate.getTime() === today.getTime();
      const isUnavail = UNAVAILABLE_DATES.has(key);
      const isSelected= key === selectedDate;

      cell.className = 'cal-day';
      if (isPast)      { cell.classList.add('past');        cell.disabled = true; }
      else if (isUnavail){ cell.classList.add('unavailable'); cell.disabled = true; }
      else             { cell.classList.add('available'); }
      if (isToday)     cell.classList.add('today');
      if (isSelected)  cell.classList.add('selected');

      if (!isPast && !isUnavail) {
        cell.setAttribute('aria-label', `Select ${monthNames[viewMonth]} ${d}, ${viewYear}`);
        cell.addEventListener('click', () => handleDateSelect(key, d));
      } else {
        cell.setAttribute('aria-disabled', 'true');
      }

      calEl.appendChild(cell);
    }
  }

  function handleDateSelect(key, day) {
    selectedDate = key;
    renderCalendar();
    showBookingForm(key, day);
  }

  function showBookingForm(key, day) {
    if (!formWrapper) return;
    if (prompt) prompt.style.display = 'none';

    if (selectedDateLabel) {
      const [y, m, d] = key.split('-');
      selectedDateLabel.textContent =
        `Selected Date: ${monthNames[parseInt(m,10)-1]} ${parseInt(d,10)}, ${y}`;
    }

    formWrapper.classList.add('visible');

    // Smooth scroll to form on mobile
    if (window.innerWidth < 960) {
      setTimeout(() => {
        formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (viewMonth === 0) { viewMonth = 11; viewYear--; }
      else viewMonth--;
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (viewMonth === 11) { viewMonth = 0; viewYear++; }
      else viewMonth++;
      renderCalendar();
    });
  }

  renderCalendar();
})();

/* ─── BOOKING FORM SUBMIT ───────────────────── */
(function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  /* ── EMAIL SERVICE CONNECTION ──────────────────
     Option 1 — Formspree:
       Replace the form action with your Formspree endpoint:
       <form action="https://formspree.io/f/YOUR_ID" method="POST">

     Option 2 — EmailJS:
       Uncomment and configure the emailjs.send() call below,
       replace YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_USER_ID.

     Option 3 — Google Forms:
       Get your prefilled URL from Google Forms and POST to it.
  ─────────────────────────────────────────────── */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form data
    const data = Object.fromEntries(new FormData(form));

    /* ── EmailJS (uncomment to use) ──────────────
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data, 'YOUR_USER_ID')
      .then(() => showBookingConfirmation())
      .catch(err => console.error('EmailJS error:', err));
    return;
    ─────────────────────────────────────────────── */

    /* ── Formspree (uncomment + set action on <form> to use) ──
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(r => r.ok ? showBookingConfirmation() : alert('Submission failed, please try again.'));
    return;
    ─────────────────────────────────────────────── */

    // Default: show confirmation immediately (remove this once you connect an email service)
    showBookingConfirmation();
  });

  function showBookingConfirmation() {
    const formWrapper   = document.querySelector('.booking-form');
    const confirmation  = document.querySelector('.booking-confirmation');
    if (formWrapper)  formWrapper.style.display = 'none';
    if (confirmation) confirmation.classList.add('visible');
  }
})();

/* ─── CONTACT FORM SUBMIT ───────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  /* ── EMAIL SERVICE CONNECTION ──────────────────
     Same options as the booking form above.
     Replace the submit handler with your preferred service.
  ─────────────────────────────────────────────── */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* ── Formspree (uncomment + add action attribute to <form>) ──
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(r => r.ok ? showContactConfirmation() : alert('Submission failed, please try again.'));
    return;
    ─────────────────────────────────────────────── */

    // Default: show confirmation immediately
    showContactConfirmation();
  });

  function showContactConfirmation() {
    const formWrapper  = document.querySelector('.contact-form-wrapper');
    const confirmation = document.querySelector('.contact-confirmation');
    if (formWrapper)  formWrapper.style.display = 'none';
    if (confirmation) confirmation.classList.add('visible');
  }
})();
