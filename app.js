// Initialize EmailJS - REPLACE WITH YOUR PUBLIC KEY
(function () {
    // TODO: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('1bE5XeslePZUIEumH');
})();

// Initialize Swiper for Workers Section
const swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
});

// After swiper init: adjust worker image heights responsively (fallback for older browsers)
function adjustWorkerImageHeights() {
    const imgs = document.querySelectorAll('.worker-img');
    imgs.forEach(img => {
        // calculate height based on container width to preserve aspect and avoid cutting hair
        const parent = img.closest('.worker-card') || img.parentElement;
        if (parent) {
            const width = parent.clientWidth || img.clientWidth;
            // Use 0.65 ratio for image height (approx)
            const targetHeight = Math.max(140, Math.round(width * 0.65));
            img.style.height = targetHeight + 'px';
        }
    });
}

// Run on load and resize, debounced
let resizeTimer;
window.addEventListener('load', adjustWorkerImageHeights);
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(adjustWorkerImageHeights, 120);
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
        }, 300);
    }, 1000);
});

// Mobile Menu
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking links
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Handle window resize to reset menu on desktop view
window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) {
        navLinks.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.back-to-top');

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }

    // Update active nav link
    updateActiveNavLink();
});

// Form submission with EmailJS
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const originalBtnText = submitBtn.innerHTML;

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;

    // Validate form
    if (!name || !email || !service || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        // TODO: Replace with your actual EmailJS service ID and template ID
        const templateParams = {
            from_name: name,
            from_email: email,
            phone: phone || 'Not provided',
            service: service,
            message: message,
            to_email: 'siryorkcompanyltd@gmail.com', // Your receiving email
            company_name: 'SIRYORK COMPANY LIMITED'
        };

        // Send email using EmailJS
        // TODO: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual values
        const response = await emailjs.send(
            'service_8j287kk', // Service ID
            'template_jd3c54u', // Template ID
            templateParams
        );

        if (response.status === 200) {
            showMessage(`Thank you, ${name}! Your message has been sent successfully. We will contact you shortly.`, 'success');
            document.getElementById('contactForm').reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('EmailJS Error:', error);
        showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    } finally {
        // Re-enable button and restore text
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Show message function
function showMessage(text, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';

    // Auto hide after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Initialize
updateActiveNavLink();

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// FAQ Toggle Function
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const answer = button.nextElementSibling;
    const icon = button.querySelector('.faq-icon');

    // Close other open FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.querySelector('.faq-question').classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('active');
            item.querySelector('.faq-icon').textContent = '+';
        }
    });

    // Toggle current FAQ
    button.classList.toggle('active');
    answer.classList.toggle('active');
    icon.textContent = button.classList.contains('active') ? '−' : '+';
}