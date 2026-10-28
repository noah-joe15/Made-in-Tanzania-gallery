// ==========================================
// CONFIGURATION: Vercel API routes (relative path)
// ==========================================
const API_BASE_URL = '';

let currentLanguage = 'en';
let currentCategory = 'all';
let visibleCount = 6;
let galleryProducts = [];

// ===== Fetch Products =====
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch');
        galleryProducts = await response.json();
        renderGallery();
    } catch (error) {
        console.error('Failed to load gallery:', error);
        const grid = document.getElementById('galleryGrid');
        if (grid) {
            grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-light);">Failed to load products. Please try again later.</p>';
        }
    }
}

// ===== Language Switching =====
function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.dataset[lang];
    });
    renderGallery();
}

// ===== Gallery Rendering =====
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const filtered = currentCategory === 'all'
        ? galleryProducts
        : galleryProducts.filter(p => p.category === currentCategory);

    const toShow = filtered.slice(0, visibleCount);

    if (toShow.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-light);">No products found in this category.</p>';
        return;
    }

    grid.innerHTML = toShow.map(product => {
        const isYoutube = product.media_type === 'youtube';
        const isVideo = product.media_type === 'video';
        
        let mediaContent = '';
        
        if (isYoutube) {
            // YouTube thumbnail or placeholder
            const videoId = product.media_url.split('v=')[1]?.split('&')[0] || product.media_url.split('/').pop();
            mediaContent = `
                <div style="position:relative;width:100%;height:100%;background:#000;">
                    <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${product.title_en}" style="width:100%;height:100%;object-fit:cover;opacity:0.8;">
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);border-radius:50%;padding:12px;">
                        <svg viewBox="0 0 24 24" fill="white" stroke="none" style="width:24px;height:24px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                </div>
            `;
        } else if (isVideo) {
            // Uploaded video with hover-to-play
            mediaContent = `<video src="${product.media_url}" muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()" style="width:100%;height:100%;object-fit:cover;background:#000;"></video>`;
        } else if (product.media_url) {
            // Uploaded image
            mediaContent = `<img src="${product.media_url}" alt="${product.title_en}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<div class=\\'gallery-item-placeholder\\' style=\\'background:linear-gradient(135deg,#E8F5EE,#E8EFF8);display:flex;align-items:center;justify-content:center;\\'><svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'var(--green-primary)\\' stroke-width=\\'1.5\\' style=\\'width:48px;height:48px;\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg></div>'">`;
        } else {
            // Fallback placeholder
            mediaContent = `<div class="gallery-item-placeholder" style="background:linear-gradient(135deg,#E8F5EE,#E8EFF8);display:flex;align-items:center;justify-content:center;height:100%;">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" stroke-width="1.5" style="width:48px;height:48px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>`;
        }

        return `
        <div class="gallery-item" onclick="openLightbox(${product.id})" data-category="${product.category}" style="cursor:pointer;transition:transform 0.3s ease,box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-lg)';" onmouseout="this.style.transform='';this.style.boxShadow='';">
            <div class="gallery-item-image" style="width:100%;height:220px;overflow:hidden;border-radius:12px 12px 0 0;">
                ${mediaContent}
            </div>
            <div class="gallery-item-info" style="padding:16px;">
                <div class="gallery-item-title" style="font-size:15px;font-weight:700;color:var(--text-dark);margin-bottom:4px;">${currentLanguage === 'sw' ? product.title_sw : product.title_en}</div>
                <div class="gallery-item-category" style="font-size:12px;font-weight:600;color:var(--green-primary);text-transform:uppercase;letter-spacing:0.5px;background:var(--green-light);display:inline-block;padding:3px 10px;border-radius:20px;">${currentLanguage === 'sw' ? getCategorySw(product.category) : product.category}</div>
            </div>
        </div>
        `;
    }).join('');

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = toShow.length < filtered.length ? 'inline-flex' : 'none';
    }
}

function getCategorySw(category) {
    const map = {
        'textiles': 'Nguo',
        'food': 'Chakula',
        'crafts': 'Vikonyo',
        'agriculture': 'Kilimo',
        'manufacturing': 'Uzalishaji'
    };
    return map[category] || category;
}

// ===== Category Filter =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        visibleCount = 6;
        renderGallery();
    });
});

// ===== Load More =====
document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    visibleCount += 6;
    renderGallery();
});

// ===== Lightbox =====
function openLightbox(id) {
    const product = galleryProducts.find(p => p.id === id);
    if (!product) return;

    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    document.getElementById('lightboxTitle').textContent = currentLanguage === 'sw' ? product.title_sw : product.title_en;
    document.getElementById('lightboxCategory').textContent = currentLanguage === 'sw' ? getCategorySw(product.category) : product.category;
    document.getElementById('lightboxDescription').textContent = currentLanguage === 'sw' ? product.description_sw : product.description_en;

    const content = document.querySelector('.lightbox-content');
    if (!content) return;
    
    // Remove existing media container if any
    let mediaContainer = content.querySelector('.lightbox-media-container');
    if (mediaContainer) mediaContainer.remove();
    
    // Create new media container
    mediaContainer = document.createElement('div');
    mediaContainer.className = 'lightbox-media-container';
    mediaContainer.style.cssText = 'width:100%;min-height:350px;display:flex;align-items:center;justify-content:center;background:var(--bg-light);border-radius:12px 12px 0 0;overflow:hidden;';
    
    const isYoutube = product.media_type === 'youtube';
    const isVideo = product.media_type === 'video';
    
    if (isYoutube) {
        const videoId = product.media_url.split('v=')[1]?.split('&')[0] || product.media_url.split('/').pop();
        mediaContainer.innerHTML = `<iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:12px 12px 0 0;"></iframe>`;
    } else if (isVideo) {
        mediaContainer.innerHTML = `<video src="${product.media_url}" controls autoplay style="width:100%;height:450px;border-radius:12px 12px 0 0;background:#000;"></video>`;
    } else if (product.media_url) {
        mediaContainer.innerHTML = `<img src="${product.media_url}" alt="${product.title_en}" style="width:100%;height:450px;object-fit:cover;border-radius:12px 12px 0 0;" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'padding:40px;text-align:center;color:var(--text-light);\\'>Failed to load image</div>'">`;
    } else {
        mediaContainer.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-light);">No media available</div>';
    }
    
    content.insertBefore(mediaContainer, content.firstChild);

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    const mediaContainer = document.querySelector('.lightbox-media-container');
    if (mediaContainer) {
        // Stop any playing videos
        const video = mediaContainer.querySelector('video');
        if (video) {
            video.pause();
            video.src = '';
        }
        mediaContainer.remove();
    }
}

document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
});

// ===== Registration Modal =====
function openRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        const form = document.getElementById('registrationForm');
        if (form) form.reset();
        const status = document.getElementById('registrationStatus');
        if (status) {
            status.textContent = '';
            status.className = 'form-status';
        }
    }
}

document.getElementById('registrationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitRegistrationBtn');
    const statusMsg = document.getElementById('registrationStatus');
    
    if (!submitBtn || !statusMsg) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusMsg.textContent = '';
    statusMsg.className = 'form-status';

    const payload = {
        full_name: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        business_name: document.getElementById('businessName').value,
        region: document.getElementById('region').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/registrations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit registration');
        }

        statusMsg.textContent = currentLanguage === 'sw' 
            ? 'Maombi yametumwa kwa mafanikio! Tutawasiliana nawe hivi karibuni.' 
            : 'Application submitted successfully! We will contact you soon.';
        statusMsg.className = 'form-status success';
        
        document.getElementById('registrationForm').reset();
        
        setTimeout(() => {
            closeRegistrationModal();
        }, 2500);

    } catch (error) {
        console.error('Registration error:', error);
        statusMsg.textContent = currentLanguage === 'sw' 
            ? 'Hitilafu: ' + error.message 
            : 'Error: ' + error.message;
        statusMsg.className = 'form-status error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = currentLanguage === 'sw' ? 'Tuma Maombi' : 'Submit Application';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeRegistrationModal();
        closeLightbox();
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// ===== Mobile Pagination Logic =====
(function() {
    const grid = document.getElementById('galleryGrid');
    const dotsContainer = document.getElementById('galleryPagination');
    if (!grid || !dotsContainer) return;

    let dots = [];
    let items = [];
    let observer;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    function buildDots() {
        // Clear existing
        dotsContainer.innerHTML = '';
        dots = [];
        items = Array.from(grid.querySelectorAll('.gallery-item'));

        items.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className = 'pagination-dot';
            btn.setAttribute('aria-label', `Go to item ${index + 1}`);
            
            const inner = document.createElement('div');
            inner.className = 'pagination-dot-inner';
            btn.appendChild(inner);

            // Click to scroll
            btn.addEventListener('click', () => {
                item.scrollIntoView({ 
                    behavior: scrollBehavior, 
                    block: 'center' 
                });
            });

            dotsContainer.appendChild(btn);
            dots.push(btn);
        });

        // Re-attach observer to new items
        setupObserver();
    }

    function setupObserver() {
        if (observer) observer.disconnect();

        // Options to detect the item in the middle 40% of the viewport
        const options = {
            root: null,
            rootMargin: '-30% 0px -30% 0px', 
            threshold: 0
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Find index of this item
                    const index = items.indexOf(entry.target);
                    if (index !== -1) {
                        // Remove active from all
                        dots.forEach(d => d.classList.remove('active'));
                        // Add active to current
                        if (dots[index]) dots[index].classList.add('active');
                    }
                }
            });
        }, options);

        items.forEach(item => observer.observe(item));
    }

    // 1. Initial Build
    // Use a small timeout to ensure grid is rendered
    setTimeout(buildDots, 500);

    // 2. Watch for changes (Load More / Filter)
    const gridObserver = new MutationObserver((mutations) => {
        // Debounce slightly to prevent rapid firing
        clearTimeout(window.buildDotsTimeout);
        window.buildDotsTimeout = setTimeout(buildDots, 300);
    });

    gridObserver.observe(grid, { childList: true, subtree: true });
})();
