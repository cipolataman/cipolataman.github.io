// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    function updateActiveLink() {
        let currentPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (currentPos >= sectionTop && currentPos <= sectionTop + sectionHeight) {
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // Team bio toggle functionality
    document.querySelectorAll('.toggle-bio').forEach(button => {
        button.addEventListener('click', function() {
            const bio = this.parentElement.querySelector('.bio');
            if (bio) {
                bio.classList.toggle('expanded');
                this.textContent = bio.classList.contains('expanded') ? 'Hide Bio' : 'Read Full Bio';
            }
        });
    });

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // Initialize counters if they exist on page
    if (document.querySelector('.counter')) {
        animateCounters();
    }

    // CRSSNT RSS Feed Loader
    const crssntFeed = document.getElementById('crssnt-content');
    if (crssntFeed) {
        const feedUrl = 'https://crssnt.com/preview?id=1ByB4f1cAXUZ-RnXUuJOwmEHexln7rqCsP7Z_bBrDB4Y';
        
        fetch(feedUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(str => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(str, "text/xml");
                const items = xmlDoc.getElementsByTagName("item");
                let html = '';
                
                for (let i = 0; i < Math.min(items.length, 5); i++) {
                    const item = items[i];
                    const title = item.getElementsByTagName("title")[0]?.textContent || 'No title';
                    const description = item.getElementsByTagName("description")[0]?.textContent || '';
                    
                    html += `
                        <div class="crssnt-item">
                            <div class="crssnt-title">${title}</div>
                            <div class="crssnt-description">${description}</div>
                        </div>
                    `;
                }
                
                crssntFeed.innerHTML = html || '<div class="crssnt-error">No updates available at this time</div>';
            })
            .catch(error => {
                console.error('Error fetching RSS feed:', error);
                crssntFeed.innerHTML = `
                    <div class="crssnt-error">
                        Updates are currently unavailable. Please check back later.
                    </div>
                `;
            });
    }
});