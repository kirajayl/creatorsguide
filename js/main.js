/**
 * Regine Z. — Social Media, Automated
 * FAQ disclosure, scroll reveal, and the hero approval queue. No dependencies.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- FAQ disclosure ---------- */
  function initFaq() {
    var items = document.querySelectorAll('.qa');

    items.forEach(function (item) {
      var button = item.querySelector('.qa__q');
      var panel = item.querySelector('.qa__a');
      if (!button || !panel) return;

      var id = 'qa-panel-' + Math.random().toString(36).slice(2, 9);
      panel.id = id;
      panel.setAttribute('role', 'region');
      button.setAttribute('aria-controls', id);

      button.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          var b = other.querySelector('.qa__q');
          if (b) b.setAttribute('aria-expanded', 'false');
        });

        item.classList.toggle('is-open', !isOpen);
        button.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- hero approval queue ----------
   * Weeks 1-2 ship already approved. Weeks 3-4 are pending: the visitor
   * approves them from the card, and each one flies into its date cell.
   * If nobody touches it within IDLE_MS the queue approves itself, so a
   * passive visitor still sees the month fill. Any click cancels that.
   */
  var IDLE_MS = 5000;   // before the queue starts approving on its own
  var AUTO_MS = 850;    // gap between self-approvals
  var SHOW_ALL_AFTER = 3;   // reveal "approve the remaining N" after this many

  function initQueue() {
    var cal = document.querySelector('[data-cal]');
    var queue = cal && cal.querySelector('[data-queue]');
    if (!cal || !queue) return;

    var grid = cal.querySelector('.cal__grid');
    var pending = Array.prototype.slice.call(grid.querySelectorAll('.day--pending'));
    if (!pending.length) return;

    var total = grid.querySelectorAll('.day--post').length + pending.length;
    var el = {
      thumb: queue.querySelector('[data-qthumb]'),
      caption: queue.querySelector('[data-qcaption]'),
      where: queue.querySelector('[data-qwhere]'),
      count: queue.querySelector('[data-count]'),
      approve: queue.querySelector('[data-approve]'),
      changes: queue.querySelector('[data-changes]'),
      all: queue.querySelector('[data-all]'),
      remaining: queue.querySelector('[data-remaining]'),
      done: queue.querySelector('[data-done]'),
      total: queue.querySelector('[data-total]'),
      reset: queue.querySelector('[data-reset]'),
      actions: queue.querySelector('.queue__actions'),
      status: queue.querySelector('[data-status]')
    };

    // remember the original order so "run it again" can restore it
    var original = pending.slice();
    var waiting = pending.slice();
    var approvedByUser = 0;
    var idleTimer = null;
    var autoTimer = null;
    var userTookOver = false; // once they click, autopilot never comes back
    var inFlight = [];        // end() callbacks for ghosts currently animating

    function thumbUrl(n) { return 'url("images/thumbs/t' + n + '.jpg")'; }

    function render() {
      if (!waiting.length) {
        el.actions.hidden = true;
        el.done.hidden = false;
        el.count.textContent = '0';
        queue.classList.add('is-done');
        if (el.total) el.total.textContent = String(total);
        say('All ' + total + ' posts approved.');
        return;
      }
      var cell = waiting[0];
      el.thumb.style.backgroundImage = thumbUrl(cell.dataset.thumb);
      el.caption.innerHTML = cell.dataset.caption;
      el.where.textContent = cell.dataset.platform + ' · ' + cell.dataset.kind + ' · ' + cell.dataset.day;
      el.count.textContent = String(waiting.length);
      el.actions.hidden = false;
      el.done.hidden = true;
      queue.classList.remove('is-done');

      var showAll = approvedByUser >= SHOW_ALL_AFTER && waiting.length > 1;
      el.all.hidden = !showAll;
      if (showAll) el.remaining.textContent = String(waiting.length);
    }

    function say(msg) { if (el.status) el.status.textContent = msg; }

    function fill(cell) {
      cell.classList.remove('day--pending');
      cell.classList.add('day--post');
      cell.dataset.t = cell.dataset.thumb;

      // The load-in stagger declares `opacity: 0` as the base state and relies on
      // animation-fill-mode to hold the cell visible. Replacing that animation would
      // drop the cell back to invisible, so pin the resting state inline first.
      cell.style.opacity = '1';
      cell.style.transform = 'none';
      if (reduceMotion) return;
      cell.style.animation = 'none';
      void cell.offsetWidth;
      cell.style.animation = 'pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both';
    }

    function onScreen(r) {
      return r.bottom > 0 && r.top < window.innerHeight &&
             r.right > 0 && r.left < window.innerWidth;
    }

    /* Is the calendar genuinely looking back at the visitor?
     *
     * Geometry cannot answer this. The hero is `position: sticky`, so it never
     * leaves the viewport — it is hidden by being *covered* by later sections.
     * An IntersectionObserver has the same blind spot: a covered sticky element
     * still reports as intersecting. So hit-test the middle of the visible part
     * of the calendar and see whether the topmost painted element there still
     * belongs to it. (.ghost is pointer-events:none, so it never wins this test.)
     */
    function calOnScreen() {
      var r = cal.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) return false;
      var x = Math.round(r.left + r.width / 2);
      var y = Math.round((Math.max(r.top, 0) + Math.min(r.bottom, window.innerHeight)) / 2);
      if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) return false;
      var hit = document.elementFromPoint(x, y);
      return !!hit && (hit === cal || cal.contains(hit));
    }

    function fly(cell, done) {
      if (reduceMotion) return done();
      var a = el.thumb.getBoundingClientRect();
      var b = cell.getBoundingClientRect();
      if (!a.width || !b.width) return done();
      // The hero is position:sticky, so it stays in the viewport underneath later
      // sections even after you scroll past it. A fixed-position ghost would then
      // fly across whatever section is on screen, so only animate when both ends
      // are genuinely visible; otherwise fill the cell silently.
      if (!onScreen(a) || !onScreen(b) || !calOnScreen()) return done();

      var ghost = document.createElement('span');
      ghost.className = 'ghost';
      ghost.style.backgroundImage = thumbUrl(cell.dataset.thumb);
      ghost.style.left = a.left + 'px';
      ghost.style.top = a.top + 'px';
      ghost.style.width = a.width + 'px';
      ghost.style.height = a.height + 'px';
      document.body.appendChild(ghost);

      requestAnimationFrame(function () {
        ghost.style.transform =
          'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px) scale(' + (b.width / a.width) + ')';
        ghost.style.opacity = '0.9';
      });

      var finished = false;
      function end() {
        if (finished) return;
        finished = true;
        var i = inFlight.indexOf(end);
        if (i > -1) inFlight.splice(i, 1);
        if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
        done();
      }
      inFlight.push(end);
      ghost.addEventListener('transitionend', end);
      setTimeout(end, 700);   // fallback if transitionend never fires
    }

    // Land any ghost still in the air immediately. Called when the calendar gets
    // covered mid-flight, so a thumbnail never keeps sailing over another section.
    function landAll() {
      inFlight.slice().forEach(function (end) { end(); });
    }

    function approveNext(byUser) {
      if (!waiting.length) return;
      var cell = waiting.shift();
      if (byUser) approvedByUser++;
      fly(cell, function () {
        fill(cell);
        say('Approved: ' + cell.dataset.caption + '. ' + waiting.length + ' remaining.');
        render();
      });
      // update the counter immediately; the cell catches up when the ghost lands
      el.count.textContent = String(waiting.length);
    }

    function pauseAuto() {
      clearTimeout(idleTimer);
      clearInterval(autoTimer);
      idleTimer = autoTimer = null;
      queue.classList.remove('is-auto');
    }

    function cancelAuto() {
      userTookOver = true;
      pauseAuto();
    }

    function startAuto() {
      if (userTookOver || autoTimer || idleTimer || !waiting.length) return;
      if (!calOnScreen()) return;
      idleTimer = setTimeout(function () {
        idleTimer = null;
        if (!waiting.length || !calOnScreen()) return;
        queue.classList.add('is-auto');
        autoTimer = setInterval(function () {
          if (!waiting.length || !calOnScreen()) return pauseAuto();
          approveNext(false);
        }, AUTO_MS);
        approveNext(false);
      }, IDLE_MS);
    }

    // Re-check on scroll and resize: pause the moment the calendar is covered,
    // and restart the idle countdown when it comes back (unless the visitor has
    // already taken over). rAF-gated so the hit test runs at most once a frame.
    var ticking = false;
    function recheck() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (calOnScreen()) {
          startAuto();
        } else {
          pauseAuto();
          landAll();
        }
      });
    }
    window.addEventListener('scroll', recheck, { passive: true });
    window.addEventListener('resize', recheck, { passive: true });

    el.approve.addEventListener('click', function () { cancelAuto(); approveNext(true); });

    el.changes.addEventListener('click', function () {
      cancelAuto();
      if (waiting.length < 2) {
        flash('Sent back for changes.');
        return;
      }
      waiting.push(waiting.shift());   // back of the queue, as it would be in reality
      flash('Sent back for changes.');
      render();
    });

    el.all.addEventListener('click', function () {
      cancelAuto();
      var n = waiting.length;
      for (var i = 0; i < n; i++) {
        (function (d) { setTimeout(function () { approveNext(false); }, d * 110); })(i);
      }
    });

    el.reset.addEventListener('click', function () {
      cancelAuto();
      waiting = original.slice();
      approvedByUser = 0;
      waiting.forEach(function (cell) {
        cell.classList.remove('day--post');
        cell.classList.add('day--pending');
        delete cell.dataset.t;
        // hold the resting state rather than clearing it, or the stylesheet's
        // `opacity: 0` base would hide the cell until the stagger re-ran
        cell.style.animation = 'none';
        cell.style.opacity = '1';
        cell.style.transform = 'none';
        cell.style.backgroundImage = '';
      });
      render();
      el.approve.focus();
    });

    function flash(msg) {
      say(msg);
      queue.classList.add('is-flash');
      setTimeout(function () { queue.classList.remove('is-flash'); }, 900);
    }

    render();
    if (!reduceMotion) startAuto();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFaq();
    initReveal();
    initQueue();
  });
})();
