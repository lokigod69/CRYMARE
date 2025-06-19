/*
 * Phase 3: Advanced GSAP Animations for Crymare Gallery Pages
 * Premium effects: Magnetic cursor, image reveals, smooth transitions, zoom effects
 */

gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin);

class GalleryAnimations {
    constructor() {
        this.isDesktop = window.innerWidth > 1024;
        this.cursor = null;
        this.currentModal = null;
        this.init();
    }

    init() {
        this.createCustomCursor();
        this.setupPageLoadAnimations();
        this.setupScrollAnimations();
        this.setupModalAnimations();
        this.setupMagneticEffects();
        this.setupImageRevealAnimations();
        this.setupViewModeTransitions();
        
        console.log('🎨 Phase 3: Advanced gallery animations initialized!');
    }

    // =========================
    // CUSTOM MAGNETIC CURSOR
    // =========================
    createCustomCursor() {
        if (!this.isDesktop) return;

        // Create cursor elements
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-ring"></div>
        `;
        document.body.appendChild(cursor);
        this.cursor = cursor;

        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
            }
            .cursor-ring {
                width: 40px;
                height: 40px;
                border: 2px solid rgba(201, 169, 110, 0.5);
                border-radius: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
                transition: all 0.15s ease;
            }
            body { cursor: none; }
            .cursor-hover .cursor-ring {
                width: 80px;
                height: 80px;
                border-color: rgba(201, 169, 110, 0.8);
            }
        `;
        document.head.appendChild(style);

        // Cursor movement
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor following
        gsap.ticker.add(() => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            gsap.set(this.cursor, {
                x: cursorX,
                y: cursorY
            });
        });

        // Hover effects
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('.gallery-grid-item, .view-mode-btn, .related-card')) {
                document.body.classList.add('cursor-hover');
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('.gallery-grid-item, .view-mode-btn, .related-card')) {
                document.body.classList.remove('cursor-hover');
            }
        }, true);
    }

    // =========================
    // PAGE LOAD ANIMATIONS
    // =========================
    setupPageLoadAnimations() {
        const tl = gsap.timeline();

        // Header entrance
        tl.from('.gallery-header', {
            duration: 1.5,
            y: -100,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('.breadcrumb', {
            duration: 1,
            x: -50,
            opacity: 0,
            ease: 'power2.out'
        }, 0.3)
        .from('.gallery-title', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        }, 0.5)
        .from('.gallery-description', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, 0.7)
        .from('.gallery-meta > *', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        }, 0.9);

        // Controls entrance
        gsap.from('.gallery-controls', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 1.2
        });
    }

    // =========================
    // SCROLL TRIGGERED ANIMATIONS
    // =========================
    setupScrollAnimations() {
        // Removed problematic scroll animations
        // Grid items now have consistent visibility with just hover effects
        
        // Keep only related artworks reveal (if they exist)
        gsap.utils.toArray('.related-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power2.out',
                delay: index * 0.1
            });
        });
    }

    // =========================
    // IMAGE REVEAL ANIMATIONS
    // =========================
    setupImageRevealAnimations() {
        // Removed all scroll-triggered animations for grid items
        // Grid items are now always visible with clean hover effects only
        console.log('Grid items will be immediately visible with hover effects only');
    }

    // =========================
    // MODAL ANIMATIONS
    // =========================
    setupModalAnimations() {
        const modal = document.getElementById('image-modal');
        if (!modal) return;

        // Enhanced modal open animation
        const originalOpenModal = window.galleryLoader?.openModal;
        if (originalOpenModal && window.galleryLoader) {
            window.galleryLoader.openModal = (index) => {
                originalOpenModal.call(window.galleryLoader, index);
                
                // Animate modal entrance
                gsap.fromTo(modal, 
                    { 
                        opacity: 0,
                        scale: 0.8,
                        filter: 'blur(10px)'
                    },
                    {
                        duration: 0.6,
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        ease: 'power3.out'
                    }
                );

                // Animate image entrance
                const modalImage = modal.querySelector('.modal-image');
                gsap.fromTo(modalImage,
                    {
                        y: 50,
                        opacity: 0,
                        scale: 0.9
                    },
                    {
                        duration: 0.8,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        ease: 'power3.out',
                        delay: 0.2
                    }
                );

                // Animate controls
                gsap.from(modal.querySelectorAll('.modal-prev, .modal-next, .modal-close'), {
                    duration: 0.6,
                    opacity: 0,
                    scale: 0.8,
                    stagger: 0.1,
                    ease: 'back.out(1.7)',
                    delay: 0.4
                });

                // Animate info panel
                gsap.from(modal.querySelector('.modal-info'), {
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    ease: 'power2.out',
                    delay: 0.6
                });
            };
        }

        // Enhanced modal close animation
        const originalCloseModal = window.galleryLoader?.closeModal;
        if (originalCloseModal && window.galleryLoader) {
            window.galleryLoader.closeModal = () => {
                gsap.to(modal, {
                    duration: 0.4,
                    opacity: 0,
                    scale: 0.9,
                    filter: 'blur(5px)',
                    ease: 'power2.in',
                    onComplete: () => {
                        originalCloseModal.call(window.galleryLoader);
                    }
                });
            };
        }

        // Image transition animations
        const originalUpdateModalImage = window.galleryLoader?.updateModalImage;
        if (originalUpdateModalImage && window.galleryLoader) {
            window.galleryLoader.updateModalImage = function() {
                const modalImage = modal.querySelector('.modal-image');

                // Animate out current image
                gsap.to(modalImage, {
                    duration: 0.3,
                    opacity: 0,
                    x: -30,
                    ease: 'power2.in',
                    onComplete: () => {
                        // Update image source
                        originalUpdateModalImage.call(this);
                        
                        // Animate in new image
                        gsap.fromTo(modalImage,
                            { opacity: 0, x: 30 },
                            {
                                duration: 0.5,
                                opacity: 1,
                                x: 0,
                                ease: 'power2.out'
                            }
                        );
                    }
                });
            };
        }
    }

    // =========================
    // MAGNETIC EFFECTS
    // =========================
    setupMagneticEffects() {
        if (!this.isDesktop) return;

        const magneticElements = document.querySelectorAll('.gallery-grid-item, .view-mode-btn');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(element, {
                    duration: 0.6,
                    x: x * 0.1,
                    y: y * 0.1,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    duration: 0.6,
                    x: 0,
                    y: 0,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }

    // =========================
    // VIEW MODE TRANSITIONS
    // =========================
    setupViewModeTransitions() {
        const originalSwitchViewMode = window.galleryLoader?.switchViewMode;
        if (originalSwitchViewMode && window.galleryLoader) {
            window.galleryLoader.switchViewMode = function(mode) {
                const gridView = document.getElementById('gallery-grid');
                const slideshowView = document.getElementById('gallery-slideshow');
                const buttons = document.querySelectorAll('.view-mode-btn');

                // Animate button states
                buttons.forEach(btn => {
                    gsap.to(btn, {
                        duration: 0.3,
                        scale: btn.dataset.mode === mode ? 1.05 : 1,
                        ease: 'power2.out'
                    });
                });

                if (mode === 'grid') {
                    // Animate to grid
                    gsap.to(slideshowView, {
                        duration: 0.5,
                        opacity: 0,
                        y: 30,
                        ease: 'power2.in',
                        onComplete: () => {
                            slideshowView.classList.add('hidden');
                            gridView.style.display = 'grid';
                            
                            gsap.fromTo(gridView,
                                { opacity: 0, y: 30 },
                                {
                                    duration: 0.6,
                                    opacity: 1,
                                    y: 0,
                                    ease: 'power3.out'
                                }
                            );
                        }
                    });
                } else {
                    // Animate to slideshow
                    gsap.to(gridView, {
                        duration: 0.5,
                        opacity: 0,
                        y: -30,
                        ease: 'power2.in',
                        onComplete: () => {
                            gridView.style.display = 'none';
                            slideshowView.classList.remove('hidden');
                            
                            gsap.fromTo(slideshowView,
                                { opacity: 0, y: 30 },
                                {
                                    duration: 0.6,
                                    opacity: 1,
                                    y: 0,
                                    ease: 'power3.out'
                                }
                            );
                        }
                    });
                }

                // Update button states
                originalSwitchViewMode.call(this, mode);
            };
        }
    }

    // =========================
    // SCROLL SMOOTH PARALLAX
    // =========================
    setupParallaxEffects() {
        gsap.utils.toArray('.gallery-grid-item img').forEach(img => {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50,
                ease: 'none'
            });
        });
    }
}

// Initialize when DOM and gallery loader are ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for gallery loader to initialize
    setTimeout(() => {
        if (window.galleryLoader) {
            window.galleryAnimations = new GalleryAnimations();
        }
    }, 100);
}); 