
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // --- Navbar Scroll Effect (Restored) ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Walking Text Animation (Robust Implementation) ---
    // Ensure spans exist or create them
    // --- Walking Text Animation (Robust Implementation) ---
    // Ensure spans exist or create them
    const walkingTexts = document.querySelectorAll('.walking-text');
    walkingTexts.forEach(textElem => {
        if (!textElem.querySelector('span')) {
            const originalHTML = textElem.innerHTML;
            // Split by <br> tags to handle lines separately
            const lines = originalHTML.split(/<br\s*\/?>/i);

            let newHTML = '';
            let globalIndex = 0; // Track index across lines for continuous flow

            lines.forEach((line, index) => {
                // Strip existing tags from line content if any just to be safe for char splitting
                const cleanLine = line.replace(/<[^>]*>/g, '');
                const chars = cleanLine.split('');

                chars.forEach(char => {
                    if (char === ' ') {
                        newHTML += '&nbsp;';
                    } else {
                        // Add delay for wave effect
                        const delay = globalIndex * 0.03;
                        newHTML += `<span class="char-span" style="animation-delay: ${delay}s">${char}</span>`;
                        globalIndex++;
                    }
                });

                // Add <br> back if it's not the last line
                if (index < lines.length - 1) {
                    newHTML += '<br>';
                }
            });

            textElem.innerHTML = newHTML;
        }
    });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger walking text if inside this section
                const walkingText = entry.target.querySelector('.walking-text');
                if (walkingText) {
                    walkingText.classList.add('animate');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .hero-content, .about-text, .section-header').forEach(el => {
        observer.observe(el);
    });

    // --- Booking Modal Logic ---
    const modal = document.getElementById('bookingModal');
    // Added .btn-navbar to selector
    const bookBtns = document.querySelectorAll('.btn-book, .btn-peach, .btn-gold, .btn-navbar');
    const closeBtn = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('bookingForm');

    if (modal) {
        bookBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex'; // Use flex to ensure centering
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert("Thank you! Your request has been received. We will contact you shortly.");
                modal.style.display = "none";
            });
        }
    }

    // --- Testimonial Carousel Logic (3-Card Center Focus) ---
    const track = document.querySelector('.testimonials-track');
    if (track && track.children.length > 0) {
        let slides = Array.from(track.children);
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        let currentSlide = 0;

        const updateSlide = () => {
            // Recalculate width dynamically for responsiveness
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            updateActiveClasses();
        };

        const updateActiveClasses = () => {
            slides.forEach(s => s.classList.remove('active'));

            const isDesktop = window.innerWidth >= 992;
            let centerIndex = currentSlide;

            // On Desktop (3 cards), the logical center is +1 from the left-most visible card
            if (isDesktop) {
                centerIndex = currentSlide + 1;
            }

            // Boundary check and apply class
            if (slides[centerIndex]) {
                slides[centerIndex].classList.add('active');
            }
        };

        // Handle Window Resize properly
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Reset to 0 or adjust? adjusting is complex, safe reset
                updateSlide();
            }, 100);
        });

        // Navigation Logic
        const nextSlide = () => {
            const isDesktop = window.innerWidth >= 992;
            // Stop scrolling 2 slots before end so we don't show empty space
            const maxIndex = isDesktop ? slides.length - 3 : slides.length - 1;

            if (currentSlide < maxIndex) {
                currentSlide++;
            } else {
                currentSlide = 0; // Infinite Loop effect: jump to start
            }
            updateSlide();
        };

        const prevSlide = () => {
            const isDesktop = window.innerWidth >= 992;
            const maxIndex = isDesktop ? slides.length - 3 : slides.length - 1;

            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = maxIndex; // Jump to end
            }
            updateSlide();
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });
        }

        // Auto Play
        let slideTimer = setInterval(nextSlide, 4000);

        function resetAutoplay() {
            clearInterval(slideTimer);
            slideTimer = setInterval(nextSlide, 4000);
        }

        // Initialize immediately
        updateSlide();
    }

    // --- Fullscreen Video Modal Logic ---
    const videoFrame = document.querySelector('.video-frame');
    const videoModal = document.getElementById('videoContainer');
    const fullScreenVideo = document.getElementById('fullScreenVideo');
    const closeVideoBtn = document.querySelector('.close-video');

    if (videoFrame && videoModal && fullScreenVideo) {
        // Open Modal
        videoFrame.addEventListener('click', () => {
            videoModal.style.display = 'flex';
            // Slight delay to allow display:flex to apply before transition
            setTimeout(() => {
                videoModal.classList.add('active');
                fullScreenVideo.play().catch(e => console.log('Autoplay blocked', e));
            }, 10);
        });

        // Close Modal Function
        const closeModal = () => {
            videoModal.classList.remove('active');
            setTimeout(() => {
                videoModal.style.display = 'none';
                fullScreenVideo.pause();
                fullScreenVideo.currentTime = 0; // Reset video
            }, 300); // Match transition duration
        };

        if (closeVideoBtn) {
            closeVideoBtn.addEventListener('click', closeModal);
        }

        // Close on background click
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
