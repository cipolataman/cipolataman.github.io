/* ==========================================================================
   Batai Capital Partners — site scripts
   --------------------------------------------------------------------------
   1. Mobile navigation          4.  Expandable team bios
   2. Header scroll state        4b. Team photo fallback
   3. Scroll reveal              5.  RSS / CRSSNT updates feed
                                 6.  Footer year
   --------------------------------------------------------------------------
   The updates feed URL is NOT stored here — it lives on the feed container
   in team.html as  data-feed="..."  so it can be changed without touching JS.
   ========================================================================== */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* 1. MOBILE NAVIGATION ================================================= */
    function initNav() {
        var toggle = document.getElementById('menuToggle');
        var links = document.getElementById('navLinks');
        if (!toggle || !links) return;

        var backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);

        function setOpen(open) {
            links.classList.toggle('active', open);
            toggle.classList.toggle('active', open);
            backdrop.classList.toggle('active', open);
            document.body.classList.toggle('nav-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        }

        toggle.addEventListener('click', function () {
            setOpen(!links.classList.contains('active'));
        });

        backdrop.addEventListener('click', function () { setOpen(false); });

        links.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });

        // Reset when resizing back up to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 860) setOpen(false);
        });
    }

    /* 2. HEADER SCROLL STATE =============================================== */
    function initHeader() {
        var header = document.querySelector('.site-header');
        if (!header) return;

        var ticking = false;
        function update() {
            header.classList.toggle('scrolled', window.scrollY > 24);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
        }, { passive: true });

        update();
    }

    /* 3. SCROLL REVEAL ===================================================== */
    var revealObserver = null;

    function initReveal() {
        var targets = document.querySelectorAll('.fade-in');

        if (reduceMotion || !('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(targets, function (el) { el.classList.add('visible'); });
            return;
        }

        revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

        Array.prototype.forEach.call(targets, function (el) { revealObserver.observe(el); });
    }

    // Used for content injected after page load (e.g. feed items)
    function observeReveal(el) {
        if (!revealObserver) { el.classList.add('visible'); return; }
        revealObserver.observe(el);
    }

    /* 4. EXPANDABLE TEAM BIOS ============================================== */
    function initBios() {
        document.addEventListener('click', function (e) {
            var button = e.target.closest('.team-toggle');
            if (!button) return;

            var card = button.closest('.team-card');
            var details = card && card.querySelector('.bio-details');
            if (!details) return;

            var expanded = details.classList.toggle('expanded');
            button.setAttribute('aria-expanded', String(expanded));

            var label = button.querySelector('.toggle-text');
            if (label) label.textContent = expanded ? 'Show Less' : 'Show Full Profile';
        });
    }

    /* 4b. TEAM PHOTO FALLBACK ============================================== */
    // If a headshot is missing, hide the broken <img> so the initials
    // placeholder on .team-image shows through instead.
    function initPhotos() {
        Array.prototype.forEach.call(document.querySelectorAll('.team-photo'), function (img) {
            if (img.complete && img.naturalWidth === 0) {
                img.classList.add('is-missing');
            } else {
                img.addEventListener('error', function () { img.classList.add('is-missing'); });
            }
        });
    }

    /* 5. RSS / CRSSNT UPDATES FEED ========================================= */
    var FEED_ITEM_LIMIT = 5;

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function text(item, tag) {
        var node = item.getElementsByTagName(tag)[0];
        return node && node.textContent ? node.textContent.trim() : '';
    }

    function formatDate(value) {
        if (!value) return '';
        var date = new Date(value);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function initFeed() {
        var container = document.getElementById('crssnt-content');
        if (!container) return;

        var feedUrl = container.getAttribute('data-feed');
        if (!feedUrl) return;

        fetch(feedUrl)
            .then(function (response) {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(function (body) {
                var xml = new DOMParser().parseFromString(body, 'text/xml');
                var items = xml.getElementsByTagName('item');
                var html = '';

                for (var i = 0; i < Math.min(items.length, FEED_ITEM_LIMIT); i++) {
                    var item = items[i];
                    var title = escapeHtml(text(item, 'title') || 'No title');
                    var link = text(item, 'link');
                    var date = formatDate(text(item, 'pubDate'));
                    var description = text(item, 'description');

                    var heading = /^https?:\/\//i.test(link)
                        ? '<a href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">' + title + '</a>'
                        : title;

                    html += '<article class="update-item fade-in">' +
                                '<div class="update-header">' +
                                    '<h3 class="update-title">' + heading + '</h3>' +
                                    (date ? '<span class="update-date">' + escapeHtml(date) + '</span>' : '') +
                                '</div>' +
                                (description ? '<div class="update-content">' + description + '</div>' : '') +
                            '</article>';
                }

                container.innerHTML = html || '<div class="update-error">No updates available at this time</div>';
                Array.prototype.forEach.call(container.querySelectorAll('.fade-in'), observeReveal);
            })
            .catch(function (error) {
                console.error('Error fetching RSS feed:', error);
                container.innerHTML = '<div class="update-error">Updates are currently unavailable. Please check back later.</div>';
            });
    }

    /* 6. FOOTER YEAR ======================================================= */
    function initYear() {
        Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
            el.textContent = new Date().getFullYear();
        });
    }

    /* BOOT ================================================================= */
    document.addEventListener('DOMContentLoaded', function () {
        initNav();
        initHeader();
        initReveal();
        initBios();
        initPhotos();
        initFeed();
        initYear();
    });
})();
