
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.mobile-menu-btn'); // Fixed selector
    const navCenter = document.querySelector('.nav-center');

    if (menuToggle && navCenter) {
        menuToggle.addEventListener('click', () => {
            navCenter.classList.toggle('active'); // CSS expects .nav-center.active
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navCenter.contains(e.target)) {
                navCenter.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        const navLinks = navCenter.querySelector('.nav-links');
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navCenter.classList.remove('active');
                    menuToggle.classList.remove('active');
                });
            });
        }
    }

    // --- Navbar Scroll Effect (Restored) ---
    // --- Navbar Scroll Effect (Optimized) ---
    const header = document.querySelector('header');
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                scrollTicking = false;
            });
            scrollTicking = true;
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
    // --- Draggable Autoplay Slider (Infinite Bi-directional) ---
    const slider = document.querySelector('.services-scroller');
    const servicesTrack = document.querySelector('.services-track');

    if (slider && servicesTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragging = false;
        let autoplayId;
        let isPaused = false;
        const autoplaySpeed = 1; // Speed

        // 1. Triple Buffering Setup
        // Clone children to create: [Clone Set 1] [Original] [Clone Set 2]
        const originalCards = Array.from(servicesTrack.children);

        // Clone for start (Prepend)
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone-start');
            servicesTrack.insertBefore(clone, servicesTrack.firstChild);
        });

        // Clone for end (Append)
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone-end');
            servicesTrack.appendChild(clone);
        });

        // 2. Set Initial Position (Center Set)
        // Wait for layout
        setTimeout(() => {
            // Calculate width of one set of cards
            // Use the original cards count to measure distance
            // Assuming simplified uniform width or measuring actual element positions
            // Reliable way: Measure the width of the added 'clone-start' set
            // The Original set starts exactly after the first clone set.

            // This assumes all sets are identical width.
            // Calculate width of one set of cards
            updateMetrics();

            // Jump to middle set
            slider.scrollLeft = singleSetWidth;

            startAutoplay();
        }, 100);

        // Cache layout metrics to avoid thrashing
        let totalWidth = 0;
        let singleSetWidth = 0;

        const updateMetrics = () => {
            totalWidth = servicesTrack.scrollWidth;
            singleSetWidth = totalWidth / 3;
        };

        // Update on resize
        window.addEventListener('resize', updateMetrics);

        // --- Infinite Loop Logic ---
        const checkBoundary = () => {
            // Use cached values
            const threshold = 5;

            // If we scrolled past the end of the middle set (into Clone Set 2)
            if (slider.scrollLeft >= (singleSetWidth * 2) - threshold) {
                // Jump back to start of middle set
                slider.scrollLeft = (slider.scrollLeft - singleSetWidth);
            }
            // If we scrolled past the start of the middle set (into Clone Set 1)
            else if (slider.scrollLeft <= threshold) {
                // Jump forward to end of middle set
                slider.scrollLeft = (singleSetWidth * 2) - threshold;
            }
        };

        // --- Autoplay ---
        const animate = () => {
            if (isPaused) return;
            slider.scrollLeft += autoplaySpeed;
            checkBoundary();
            autoplayId = requestAnimationFrame(animate);
        };

        function startAutoplay() {
            cancelAnimationFrame(autoplayId);
            isPaused = false;
            animate();
        }

        function stopAutoplay() {
            isPaused = true;
            cancelAnimationFrame(autoplayId);
        }

        // --- Drag Events ---
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            stopAutoplay();
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
            startAutoplay();
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            startAutoplay();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();

            if (!isDragging) {
                requestAnimationFrame(() => {
                    const x = e.pageX - slider.offsetLeft;
                    const walk = (x - startX) * 2;
                    slider.scrollLeft = scrollLeft - walk;

                    // Critical: Check boundary DURING drag to allow infinite feel
                    checkBoundary();

                    isDragging = false;
                });
                isDragging = true;
            }
        });

        // Touch
        slider.addEventListener('touchstart', () => stopAutoplay());
        slider.addEventListener('touchend', () => startAutoplay());
    }

    // Added .btn-navbar to selector, excluded btn-submit to prevent conflict
    const bookBtns = document.querySelectorAll('.btn-book, .btn-peach, .btn-gold:not([type="submit"]), .btn-navbar, .btn-pill');
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
            console.log("Booking Form found in DOM");
            bookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log("Form submit event triggered");

                const btn = bookingForm.querySelector('button[type="submit"]');
                console.log("Submit button found:", btn);

                if (!btn) {
                    console.error("Submit button not found");
                    return;
                }

                const statusDiv = bookingForm.querySelector('.form-status');
                if (statusDiv) {
                    statusDiv.style.display = 'none';
                    statusDiv.className = 'form-status';
                }

                const originalText = btn.textContent;
                btn.textContent = 'Sending...';
                btn.disabled = true;

                // Add Access Key if not present (Fallback/Safety)
                if (!bookingForm.querySelector('input[name="access_key"]')) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'access_key';
                    input.value = '250f1b30-b153-4b09-a19c-5ad15f23dc48'; // Using the key user provided
                    bookingForm.appendChild(input);
                }

                const formData = new FormData(bookingForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);
                console.log("Sending data:", json);

                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: json
                    });
                    const result = await response.json();
                    console.log("Response:", result);
                    if (response.status == 200) {
                        if (statusDiv) {
                            statusDiv.textContent = "Thank you! Your booking request has been sent successfully.";
                            statusDiv.className = 'form-status success';
                        } else {
                            alert("Thank you! Your booking request has been sent successfully.");
                        }

                        bookingForm.reset();
                        setTimeout(() => {
                            modal.style.display = "none";
                            if (statusDiv) {
                                statusDiv.style.display = 'none';
                                statusDiv.className = 'form-status';
                            }
                        }, 3000);

                    } else {
                        if (statusDiv) {
                            statusDiv.textContent = result.message || "Something went wrong. Please try again.";
                            statusDiv.className = 'form-status error';
                        } else {
                            alert(result.message || "Something went wrong. Please try again.");
                        }
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                    if (statusDiv) {
                        statusDiv.textContent = "Something went wrong. Please try again.";
                        statusDiv.className = 'form-status error';
                    } else {
                        alert("Something went wrong. Please try again.");
                    }
                } finally {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            });
        } else {
            console.error("Booking Form NOT found in DOM");
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

    // --- Custom Cursor Interaction ---
    const cursor = document.querySelector('.cursor-dot');
    const heroTextContainer = document.querySelector('.hero-text');
    const heroSpotlight = document.querySelector('.hero-spotlight');
    const hoverTextSpan = document.querySelector('.hover-text');

    // Other targets for simple scale effect
    const simpleHoverTargets = document.querySelectorAll('a, button, .video-frame, .service-card-modern, .hero-subtitle');

    if (cursor) {
        // Global Mouse Tracking for Dot (Optimized)
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            // Linear interpolation for smooth trailing effect
            const speed = 0.2; // Adjust for lag/smoothness (0.1 = slow, 1 = instant)

            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;

            // Use translate3d for hardware acceleration
            // Center the 15px cursor (subtract 7.5px)
            cursor.style.transform = `translate3d(${cursorX - 7.5}px, ${cursorY - 7.5}px, 0)`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        // Generalized Spotlight Tracking
        const spotlightGroups = document.querySelectorAll('.spotlight-group');

        spotlightGroups.forEach(group => {
            const overlay = group.querySelector('.spotlight-overlay');
            const targetTexts = group.querySelectorAll('.spotlight-text'); // Find ALL targets

            if (overlay) {
                // Track mouse relative to this specific group
                group.addEventListener('mousemove', (e) => {
                    const rect = group.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    overlay.style.setProperty('--spotlight-x', `${x}px`);
                    overlay.style.setProperty('--spotlight-y', `${y}px`);
                });

                // Toggle logic for each target text
                targetTexts.forEach(targetText => {
                    targetText.addEventListener('mouseenter', () => {
                        overlay.style.setProperty('--spotlight-radius', '75px');
                        cursor.classList.add('hidden');
                    });

                    targetText.addEventListener('mouseleave', () => {
                        overlay.style.setProperty('--spotlight-radius', '0px');
                        cursor.classList.remove('hidden');
                    });
                });
            }
        });

        // Simple Hover Effects for other elements
        simpleHoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }

    // --- Gallery View More Logic (Limit to 3) ---
    const galleryGrids = document.querySelectorAll('.branch-gallery-grid');
    galleryGrids.forEach(grid => {
        const items = grid.querySelectorAll('.gallery-item');
        const limit = 3;

        if (items.length > limit) {
            // Hide items beyond limit
            for (let i = limit; i < items.length; i++) {
                items[i].classList.add('hidden');
            }

            // Create View More Button Container
            const btnContainer = document.createElement('div');
            btnContainer.className = 'view-more-container';

            const btn = document.createElement('button');
            btn.className = 'btn-view-more';
            btn.textContent = 'View More Photos';

            btnContainer.appendChild(btn);
            grid.parentNode.appendChild(btnContainer); // Append after grid

            // Toggle Logic
            btn.addEventListener('click', () => {
                const isExpanded = btn.classList.contains('expanded');

                if (isExpanded) {
                    // Collapse
                    for (let i = limit; i < items.length; i++) {
                        items[i].classList.add('hidden');
                    }
                    btn.textContent = 'View More Photos';
                    btn.classList.remove('expanded');
                    // Scroll back to grid top smoothly
                    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Expand
                    for (let i = limit; i < items.length; i++) {
                        items[i].classList.remove('hidden');
                    }
                    btn.textContent = 'View Less';
                    btn.classList.add('expanded');
                }
            });
        }
    });

});
