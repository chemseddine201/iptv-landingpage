// ========================
// i18next INITIALIZATION
// ========================
let currentLang = localStorage.getItem('language') || 'en';

// Set Direction IMMEDIATELY to prevent FOUC and ensure Swiper inits correctly
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

// Initialize i18next
i18next.init({
    lng: currentLang,
    fallbackLng: 'en',
    resources: translationResources,
    interpolation: {
        escapeValue: false
    }
}, function(err, t) {
    // Update page after initialization
    updatePage();
});

// Update all elements with data-i18n attributes
function updatePage() {
    const lang = i18next.language;
    
    // Update HTML attributes (Redundant but safe)
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18next.t(key);
    });
}

// Language switcher
document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.getElementById('langDropdownBtn');
    const dropdownMenu = document.getElementById('langDropdownMenu');
    const currentLangSpan = document.querySelector('.current-lang');
    
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('active');
        });
        
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = btn.dataset.lang;
                
                // Save to localStorage
                localStorage.setItem('language', lang);

                // Reload the page to ensure Swiper and Layout calculate correctly
                // This is a robust fix for RTL/LTR direction changes
                window.location.reload();
            });
        });
        
        // Set initial active state
        const initialOption = document.querySelector(`.lang-option[data-lang="${currentLang}"]`);
        if (initialOption) {
            initialOption.classList.add('active');
        }
    }
});

// ========================
// SCROLL ANIMATIONS
// ========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        // Exclude pricing section from fade-in as requested
        if (section.id !== 'pricing') {
            section.classList.add('fade-in');
            observer.observe(section);
        }
    });
});

// ========================
// NAVBAR SCROLL EFFECT
// ========================
// ========================
// NAVBAR SCROLL EFFECT
// ========================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

function updateNavbar() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

window.addEventListener('scroll', updateNavbar);
// Initial check
updateNavbar();

// ========================
// SMOOTH SCROLL
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================
// PARALLAX EFFECT
// ========================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ========================
// COUNTER ANIMATION
// ========================
function formatNumber(num) {
    return num.toLocaleString();
}

// Continuous animation for hero stats with random fluctuation
const heroStatsConfig = {
    channelsCount: { min: 15000, range: 500 },
    showsCount: { min: 17200, range: 300 },
    moviesCount: { min: 68000, range: 2000 }
};

function animateHeroStats() {
    Object.keys(heroStatsConfig).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const config = heroStatsConfig[id];
            let currentValue = config.min;
            
            element.textContent = formatNumber(currentValue);
            
            setInterval(() => {
                const change = Math.floor(Math.random() * 30) - 10;
                currentValue += change;
                
                if (currentValue < config.min) {
                    currentValue = config.min;
                } else if (currentValue > config.min + config.range) {
                    currentValue = config.min + config.range;
                }
                
                element.textContent = formatNumber(currentValue);
            }, 2000);
        }
    });
}

window.addEventListener('load', () => {
    animateHeroStats();
    document.body.classList.add('loaded');
});

// ========================
// CARD HOVER EFFECTS
// ========================
const cards = document.querySelectorAll('.feature-card, .platform-card, .pricing-card, .sport-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ========================
// RESPONSIVE MENU
// ========================
// ========================
// RESPONSIVE MENU
// ========================
const initMobileMenu = () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-links a, .cta-btn');
    
    if (mobileToggle && navMenu) {
        // Toggle Menu
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navbar.classList.toggle('menu-open'); // Toggle class on navbar to hide logo
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navbar.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navbar.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    }
};



window.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();

    // --- Slider Selection Logic ---
    const handleSliderSelection = () => {
        // Select all cards inside swiper slides
        const sliders = document.querySelectorAll('.swiper');
        let selectionTimeout;

        const clearSelection = () => {
             document.querySelectorAll('.platform-content-card.active-selection, .movie-card.active-selection, .sport-event-card-fixed.active-selection')
                .forEach(c => c.classList.remove('active-selection'));
        };
        
        sliders.forEach(slider => {
            const cards = slider.querySelectorAll('.platform-content-card, .movie-card, .sport-event-card-fixed');
            
            cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    // Stop propagation to prevent immediate outside click trigger
                    e.stopPropagation();

                    // Clear any existing active states and timeouts
                    clearSelection();
                    if (selectionTimeout) clearTimeout(selectionTimeout);
                    
                    // Add active class to clicked card
                    card.classList.add('active-selection');

                    // Auto-remove after 3 seconds
                    selectionTimeout = setTimeout(() => {
                        card.classList.remove('active-selection');
                    }, 3000);
                });
            });
        });

        // Remove selection when clicking outside
        document.addEventListener('click', (e) => {
           clearSelection();
           if (selectionTimeout) clearTimeout(selectionTimeout);
        });
    };

    handleSliderSelection();

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Swiper.js Initialization ---
    const initSwiper = (selector, speed) => {
        new Swiper(selector, {
            loop: true,
            slidesPerView: "auto",
            spaceBetween: 20, // Matches CSS gap
            speed: speed, // Smooth linear speed
            autoplay: {
                delay: 0, // Continuous flow
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            freeMode: true,
            freeModeMomentum: false,
            grabCursor: true,
            // Allow touch move
            allowTouchMove: true,
        });
    };

    // Initialize Sliders
    // Speed: Time in ms to cover the distance? No, in Swiper with continuous autoplay, 
    // speed is transition duration. For linear continuous effect we usually set a high speed
    // but with delay 0. Let's try standard smooth settings.
    // Actually for 'linear' easing we need to override CSS transition timing.
    // But Swiper 'autoplay' with delay 0 is the key.
    
    // We will use a standard speed variable for the linear loop effect
    // 5000ms per transition is a good base for smooth slow scroll
    
    initSwiper('.platforms-swiper', 3000);
    initSwiper('.movies-swiper', 4000);
    initSwiper('.sports-swiper', 3500);

});
