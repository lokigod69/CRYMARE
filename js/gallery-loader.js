/*
 * Dynamic Gallery Loader for Crymare Gallery
 * Automatically detects and loads images based on alphabetical naming system:
 * A1-A6: Lines of Life Series 2
 * B1-Bx: Tokyo Nights
 * C1-Cx: Carnival Spirit  
 * D1-Dx: Winter Chapel
 * And so on...
 */

// Gallery series configuration with unique fonts
const GALLERY_SERIES = {
    'A': {
        title: 'Lines of Life Series 2',
        artist: 'Anastasia Dutova',
        description: 'A conceptual exploration of life\'s interconnected patterns through experimental photography and digital manipulation.',
        expectedImages: 6,
        font: 'Orbitron' // Futuristic, experimental
    },
    'B': {
        title: 'Tokyo Nights',
        artist: 'Kenji Tanaka',
        description: 'Neon-lit streets and urban landscapes capture the electric energy of Tokyo after dark.',
        expectedImages: 8,
        font: 'Audiowide' // Cyberpunk, neon aesthetic
    },
    'C': {
        title: 'Carnival Spirit',
        artist: 'Isabella Rossi',
        description: 'Vibrant celebrations and masked revelry explore themes of identity and transformation.',
        expectedImages: 7,
        font: 'Creepster' // Festive, theatrical
    },
    'D': {
        title: 'Winter Chapel',
        artist: 'Erik Larsen',
        description: 'Serene architectural photography capturing the spiritual essence of sacred spaces in winter.',
        expectedImages: 5,
        font: 'Cinzel' // Classical, architectural
    },
    'E': {
        title: 'Metamorphosis',
        artist: 'Clara Montes',
        description: 'Abstract compositions exploring transformation and change through mixed media techniques.',
        expectedImages: 9,
        font: 'Amatic SC' // Artistic, hand-drawn
    },
    'F': {
        title: 'Ocean\'s Grace',
        artist: 'David Chen',
        description: 'Underwater photography revealing the hidden beauty and grace of marine life.',
        expectedImages: 9,
        font: 'Comfortaa' // Flowing, organic
    },
    'G': {
        title: 'Crystal Bloom',
        artist: 'Julia Casesnoves',
        description: 'Macro photography of crystalline structures and botanical forms in stunning detail.',
        expectedImages: 9,
        font: 'Righteous' // Sharp, crystalline
    },
    'H': {
        title: 'Floral Explosion',
        artist: 'Ava Sinclair',
        description: 'Dynamic floral arrangements and botanical abstractions in vivid color.',
        expectedImages: 12,
        font: 'Dancing Script' // Elegant, floral
    },
    'I': {
        title: 'Deep Sea Dreamer',
        artist: 'Nixie Fisher',
        description: 'Surreal underwater landscapes exploring the mysterious depths of the ocean.',
        expectedImages: 7,
        font: 'Fredoka One' // Dreamy, bubbly
    }
};

class GalleryLoader {
    constructor() {
        this.currentSeries = null;
        this.images = [];
        this.currentImageIndex = 0;
        this.init();
    }

    init() {
        // Get series from URL parameter or default to 'A'
        const urlParams = new URLSearchParams(window.location.search);
        this.currentSeries = urlParams.get('series') || 'A';
        
        // Load gallery content
        this.loadGalleryInfo();
        this.loadImages();
        this.setupEventListeners();
    }

    loadGalleryInfo() {
        const series = GALLERY_SERIES[this.currentSeries];
        if (!series) {
            console.error(`Gallery series '${this.currentSeries}' not found`);
            return;
        }

        // Update page title and meta information
        document.title = `${series.title} – Crymare`;
        document.getElementById('gallery-title').textContent = `${series.title} – Crymare`;
        
        // Apply series-specific font to title
        const titleElement = document.getElementById('main-gallery-title');
        if (titleElement) {
            titleElement.textContent = series.title;
            titleElement.style.fontFamily = `'${series.font}', sans-serif`;
        }
        
        // Update series description with same custom font
        const descriptionElement = document.getElementById('series-description-text');
        if (descriptionElement) {
            descriptionElement.textContent = series.description;
            descriptionElement.style.fontFamily = `'${series.font}', sans-serif`;
        }
        
        // Load the Google Font dynamically
        this.loadGoogleFont(series.font);
    }

    loadGoogleFont(fontName) {
        // Check if font is already loaded
        const existingLink = document.querySelector(`link[href*="${fontName}"]`);
        if (existingLink) return;

        // Create and append font link
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    async loadImages() {
        const series = GALLERY_SERIES[this.currentSeries];
        if (!series) return;

        this.images = [];
        const assetsPath = 'assets/';
        
        // Try to load images from A1, A2, A3... up to expected count
        for (let i = 1; i <= series.expectedImages + 5; i++) { // +5 buffer for extra images
            const imagePath = `${assetsPath}${this.currentSeries}${i}.png`;
            
            try {
                const exists = await this.imageExists(imagePath);
                if (exists) {
                    this.images.push({
                        src: imagePath,
                        title: series.title,
                        description: `${series.title}`,
                        index: i
                    });
                }
            } catch (error) {
                // Image doesn't exist, stop trying
                break;
            }
        }

        // Update total slides for slideshow
        document.getElementById('total-slides').textContent = this.images.length;

        // Populate gallery grid
        this.populateGalleryGrid();
        this.populateSlideshow();

        console.log(`✅ Loaded ${this.images.length} images for ${series.title}`);
    }

    imageExists(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    populateGalleryGrid() {
        const gridContainer = document.getElementById('gallery-grid');
        gridContainer.innerHTML = '';

        this.images.forEach((image, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'gallery-grid-item';
            gridItem.setAttribute('data-index', index);
            
            gridItem.innerHTML = `
                <div class="grid-image-container">
                    <img src="${image.src}" alt="${image.title}" loading="lazy">
                </div>
            `;

            // Add click event for modal
            gridItem.addEventListener('click', () => this.openModal(index));
            
            gridContainer.appendChild(gridItem);
        });
    }

    populateSlideshow() {
        const slideTrack = document.getElementById('slide-track');
        slideTrack.innerHTML = '';

        this.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide-item';
            slide.innerHTML = `<img src="${image.src}" alt="${image.title}">`;
            slideTrack.appendChild(slide);
        });
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('image-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });

        document.querySelector('.modal-prev').addEventListener('click', () => this.prevImage());
        document.querySelector('.modal-next').addEventListener('click', () => this.nextImage());

        // Slideshow controls
        document.querySelector('.prev-slide').addEventListener('click', () => this.prevSlide());
        document.querySelector('.next-slide').addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('image-modal').classList.contains('active')) {
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'ArrowRight') this.nextImage();
                if (e.key === 'Escape') this.closeModal();
            }
        });
    }

    switchViewMode(mode) {
        const gridView = document.getElementById('gallery-grid');
        const slideshowView = document.getElementById('gallery-slideshow');
        const buttons = document.querySelectorAll('.view-mode-btn');

        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        if (mode === 'grid') {
            gridView.style.display = 'grid';
            slideshowView.classList.add('hidden');
        } else {
            gridView.style.display = 'none';
            slideshowView.classList.remove('hidden');
        }
    }

    openModal(index) {
        this.currentImageIndex = index;
        const image = this.images[index];
        
        document.getElementById('modal-image').src = image.src;
        
        document.getElementById('image-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('image-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateModalImage();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateModalImage();
    }

    updateModalImage() {
        const image = this.images[this.currentImageIndex];
        document.getElementById('modal-image').src = image.src;
    }

    prevSlide() {
        // Slideshow navigation logic
        const track = document.getElementById('slide-track');
        // Implementation for slideshow navigation
    }

    nextSlide() {
        // Slideshow navigation logic
        const track = document.getElementById('slide-track');
        // Implementation for slideshow navigation
    }
}

// Initialize gallery loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.galleryLoader = new GalleryLoader();
}); 