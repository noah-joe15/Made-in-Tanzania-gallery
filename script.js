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
            mediaContent = `<div class="gallery-item-placeholder" style="background: linear-gradient(135deg, #FFF3EB, #F3EEF9);">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:48px;height:48px;"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>`;
        } else if (isVideo) {
            mediaContent = `<video src="${product.media_url}" muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()" style="width:100%;height:100%;object-fit:cover;"></video>`;
        } else {
            mediaContent = `<img src="${product.media_url}" alt="${product.title_en}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<div class=\\'gallery-item-placeholder\\'><svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg></div>'">`;
        }

        return `
        <div class="gallery-item" onclick="openLightbox(${product.id})" data-category="${product.category}">
            <div class="gallery-item-image">
                ${mediaContent}
            </div>
            <div class="gallery-item-info">
                <div class="gallery-item-title">${currentLanguage === 'sw' ? product.title_sw : product.title_en}</div>
                <div class="gallery-item-category">${currentLanguage === 'sw' ? getCategorySw(product.category) : product.category}</div>
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
    document.getElementById('lightboxTitle').textContent = currentLanguage === 'sw' ? product.title_sw : product.title_en;
    document.getElementById('lightboxCategory').textContent = currentLanguage === 'sw' ? getCategorySw(product.category) : product.category;
    document.getElementById('lightboxDescription').textContent = currentLanguage === 'sw' ? product.description_sw : product.description_en;

    const content = document.querySelector('.lightbox-content');
    let mediaContainer = content.querySelector('.lightbox-media-container');
    
    if (!mediaContainer) {
        mediaContainer = document.createElement('div');
        mediaContainer.className = 'lightbox-media-container';
        mediaContainer.style.cssText = 'width:100%;min-height:350px;display:flex;align-items:center;justify-content:center;background:var(--bg-light);';
        content.insertBefore(mediaContainer, content.firstChild);
    }

    if (product.media_type === 'youtube') {
        const videoId = product.media_url.split('v=')[1]?.split('&')[0] || product.media_url.split('/').pop();
        mediaContainer.innerHTML = `<iframe width="100%" height="350" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius: 12px 12px 0 0;"></iframe>`;
    } else if (product.media_type === 'video') {
        mediaContainer.innerHTML = `<video src="${product.media_url}" controls autoplay style="width:100%;height:350px;border-radius: 12px 12px 0 0;"></video>`;
    } else {
        mediaContainer.innerHTML = `<img src="${product.media_url}" style="width:100%;height:350px;object-fit:cover;border-radius: 12px 12px 0 0;" onerror="this.style.display='none'">`;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    const mediaContainer = document.querySelector('.lightbox-media-container');
    if (mediaContainer) mediaContainer.remove();
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
