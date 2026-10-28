// ==========================================
// CONFIGURATION: Vercel API routes (relative path)
// ==========================================
const API_BASE_URL = '';

// ===== Image Optimization Utility =====
// Automatically optimizes images using Vercel's built-in service
function optimizeImage(imageUrl, width = 800, quality = 75) {
  if (!imageUrl || imageUrl.includes('youtube') || imageUrl.includes('ytimg')) {
    return imageUrl;
  }
  const encodedUrl = encodeURIComponent(imageUrl);
  return `/_vercel/image?url=${encodedUrl}&w=${width}&q=${quality}`;
}

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
        renderCategoryFilter();
        renderGallery();
    } catch (error) {
        console.error('Failed to load gallery:', error);
        const grid = document.getElementById('galleryGrid');
        if (grid) {
            grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-light);">Failed to load products. Please try again later.</p>';
        }
    }
}

// ===== Generate Dynamic Category Filter =====
function renderCategoryFilter() {
    const filterContainer = document.getElementById('categoryFilter');
    if (!filterContainer) return;

    const categories = [...new Set(galleryProducts.map(p => p.category).filter(Boolean))];
    categories.sort();

    let html = `<button class="filter-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all" data-en="All Products" data-sw="Bidhaa Zote">All Products</button>`;
    
    categories.forEach(cat => {
        const catKey = cat.toLowerCase().replace(/\s+/g, '-');
        const catDisplay = cat.charAt(0).toUpperCase() + cat.slice(1);
        html += `<button class="filter-btn ${currentCategory === catKey ? 'active' : ''}" data-category="${catKey}">${catDisplay}</button>`;
    });

    filterContainer.innerHTML = html;

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            visibleCount = 6;
            renderGallery();
        });
    });
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
    renderCategoryFilter();
    renderGallery();
}

// ===== Gallery Rendering =====
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const filtered = currentCategory === 'all'
        ? galleryProducts
        : galleryProducts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === currentCategory);

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
            mediaContent = `<video src="${product.media_url}" muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()" style="width:100%;height:100%;object-fit:cover;background:#000;"></video>`;
        } else if (product.media_url) {
            // OPTIMIZED: Serves a 600px wide, 75% quality WebP/AVIF image
            const optimizedUrl = optimizeImage(product.media_url, 600, 75);
            mediaContent = `<img src="${optimizedUrl}" alt="${product.title_en}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" decoding="async" onerror="this.parentElement.innerHTML='<div class=\\'gallery-item-placeholder\\' style=\\'background:linear-gradient(135deg,#E8F5EE,#E8EFF8);display:flex;align-items:center;justify-content:center;\\'><svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'var(--green-primary)\\' stroke-width=\\'1.5\\' style=\\'width:48px;height:48px;\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg></div>'">`;
        } else {
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
    return map[category.toLowerCase()] || category;
}

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
    
    let mediaContainer = content.querySelector('.lightbox-media-container');
    if (mediaContainer) mediaContainer.remove();
    
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
        // OPTIMIZED: Serves a 1200px wide, 80% quality image for lightbox
        const optimizedUrl = optimizeImage(product.media_url, 1200, 80);
        mediaContainer.innerHTML = `<img src="${optimizedUrl}" alt="${product.title_en}" style="width:100%;height:450px;object-fit:cover;border-radius:12px 12px 0 0;" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'padding:40px;text-align:center;color:var(--text-light);\\'>Failed to load image</div>'">`;
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

// ===== Mobile Pagination Logic =====
(function() {
    const grid = document.getElementById('galleryGrid');
    const dotsContainer = document.getElementById('galleryPagination');
    if (!grid || !dotsContainer) return;

    let dots = [];
    let items = [];
    let observer;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    function buildDots() {
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

            btn.addEventListener('click', () => {
                item.scrollIntoView({ 
                    behavior: scrollBehavior, 
                    block: 'center' 
                });
            });

            dotsContainer.appendChild(btn);
            dots.push(btn);
        });

        setupObserver();
    }

    function setupObserver() {
        if (observer) observer.disconnect();

        const options = {
            root: null,
            rootMargin: '-30% 0px -30% 0px', 
            threshold: 0
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = items.indexOf(entry.target);
                    if (index !== -1) {
                        dots.forEach(d => d.classList.remove('active'));
                        if (dots[index]) dots[index].classList.add('active');
                    }
                }
            });
        }, options);

        items.forEach(item => observer.observe(item));
    }

    setTimeout(buildDots, 500);

    const gridObserver = new MutationObserver((mutations) => {
        clearTimeout(window.buildDotsTimeout);
        window.buildDotsTimeout = setTimeout(buildDots, 300);
    });

    gridObserver.observe(grid, { childList: true, subtree: true });
})();

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ===== Instagram-Style Lightbox Navigation (Mobile) =====
(function() {
  if (window.innerWidth > 768) return;
  
  let currentIndex = 0;
  let filteredProducts = [];
  let touchStartY = 0;
  let touchStartX = 0;
  let lastTouchX = 0;
  
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;
  
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  function createTopBar() {
    if (!lightbox) return;
    if (lightbox.querySelector('.lightbox-top-bar')) return;
    
    const topBar = document.createElement('div');
    topBar.className = 'lightbox-top-bar';
    topBar.innerHTML = `
      <button class="lightbox-close" aria-label="Close viewer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="lightbox-category-title"></span>
      <span class="lightbox-position">1 / 1</span>
      <button class="lightbox-share" aria-label="Share" style="display: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    if (content) {
      lightbox.insertBefore(topBar, content);
    }
    
    const newCloseBtn = topBar.querySelector('.lightbox-close');
    newCloseBtn.addEventListener('click', closeLightbox);
    
    const shareBtn = topBar.querySelector('.lightbox-share');
    shareBtn.addEventListener('click', handleShare);
    
    if (navigator.share) {
      shareBtn.style.display = 'flex';
    }
  }
  
  async function handleShare() {
    const product = filteredProducts[currentIndex];
    if (!product) return;
    try {
      await navigator.share({
        title: product.title_en,
        text: `${product.title_en} - ${product.category}`,
        url: window.location.href
      });
    } catch (err) {
      console.log('Share cancelled or failed:', err);
    }
  }
  
  function updatePosition() {
    const positionEl = lightbox?.querySelector('.lightbox-position');
    const categoryEl = lightbox?.querySelector('.lightbox-category-title');
    if (positionEl) {
      positionEl.textContent = `${currentIndex + 1} / ${filteredProducts.length}`;
    }
    if (categoryEl && filteredProducts[currentIndex]) {
      categoryEl.textContent = filteredProducts[currentIndex].category;
    }
  }
  
  function navigate(direction) {
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= filteredProducts.length) return;
    
    const mediaContainer = lightbox?.querySelector('.lightbox-media-container');
    const caption = lightbox?.querySelector('.lightbox-caption');
    
    if (mediaContainer && caption) {
      mediaContainer.style.opacity = '0';
      caption.style.opacity = '0';
      
      setTimeout(() => {
        currentIndex = newIndex;
        updateLightboxContent();
        updatePosition();
        mediaContainer.style.opacity = '1';
        caption.style.opacity = '1';
      }, 200);
    }
  }
  
  function updateLightboxContent() {
    const product = filteredProducts[currentIndex];
    if (!product) return;
    
    const mediaContainer = lightbox?.querySelector('.lightbox-media-container');
    const caption = lightbox?.querySelector('.lightbox-caption');
    if (!mediaContainer || !caption) return;
    
    const titleEl = caption.querySelector('.lightbox-title');
    if (titleEl) titleEl.textContent = currentLanguage === 'sw' ? product.title_sw : product.title_en;
    
    const categoryEl = caption.querySelector('.lightbox-category');
    if (categoryEl) categoryEl.textContent = currentLanguage === 'sw' ? getCategorySw(product.category) : product.category;
    
    const descEl = caption.querySelector('.lightbox-description');
    if (descEl) descEl.textContent = currentLanguage === 'sw' ? product.description_sw : product.description_en;
    
    const isYoutube = product.media_type === 'youtube';
    const isVideo = product.media_type === 'video';
    
    if (isYoutube) {
      const videoId = product.media_url.split('v=')[1]?.split('&')[0] || product.media_url.split('/').pop();
      mediaContainer.innerHTML = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>`;
    } else if (isVideo) {
      mediaContainer.innerHTML = `<video src="${product.media_url}" controls autoplay style="border-radius: 8px; max-height: 70dvh;"></video>`;
    } else if (product.media_url) {
      // OPTIMIZED: Serves a 1200px wide, 80% quality image for mobile lightbox
      const optimizedUrl = optimizeImage(product.media_url, 1200, 80);
      mediaContainer.innerHTML = `<img src="${optimizedUrl}" alt="${product.title_en}" style="border-radius: 8px;" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'gallery-item-placeholder\\'><svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' style=\\'width:64px;height:64px;opacity:0.5;\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg></div>'">`;
    } else {
      mediaContainer.innerHTML = `<div class="gallery-item-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:64px;height:64px;opacity:0.5;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`;
    }
  }
  
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    lastTouchX = touchStartX;
  }
  
  function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const diffX = touchX - lastTouchX;
    const diffY = touchY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      e.preventDefault();
    }
    lastTouchX = touchX;
  }
  
  function handleTouchEnd(e) {
    if (!touchStartX || !touchStartY) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX)) {
      closeLightbox();
      return;
    }
    if (Math.abs(diffX) > 80 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < -50) navigate(1);
      else if (diffX > 50) navigate(-1);
    }
    touchStartX = 0;
    touchStartY = 0;
  }
  
  function handleKeydown(e) {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') navigate(-1);
    else if (e.key === 'ArrowRight') navigate(1);
    else if (e.key === 'Escape') closeLightbox();
  }
  
  const originalOpenLightbox = window.openLightbox;
  window.openLightbox = function(id) {
    if (window.innerWidth > 768) {
      originalOpenLightbox(id);
      return;
    }
    
    const product = galleryProducts.find(p => p.id === id);
    if (!product) return;
    
    const filtered = currentCategory === 'all'
      ? galleryProducts
      : galleryProducts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === currentCategory);
    
    filteredProducts = filtered;
    currentIndex = filteredProducts.findIndex(p => p.id === id);
    
    if (!lightbox) return;
    createTopBar();
    updateLightboxContent();
    updatePosition();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (isTouchDevice && lightboxContent) {
      lightboxContent.addEventListener('touchstart', handleTouchStart, { passive: true });
      lightboxContent.addEventListener('touchmove', handleTouchMove, { passive: false });
      lightboxContent.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    document.addEventListener('keydown', handleKeydown);
    lightbox.dataset.originalOpener = 'instagram';
  };
  
  const originalCloseLightbox = window.closeLightbox;
  window.closeLightbox = function() {
    if (!lightbox) return;
    
    if (lightbox.dataset.originalOpener === 'instagram') {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      
      if (lightboxContent) {
        lightboxContent.removeEventListener('touchstart', handleTouchStart);
        lightboxContent.removeEventListener('touchmove', handleTouchMove);
        lightboxContent.removeEventListener('touchend', handleTouchEnd);
      }
      document.removeEventListener('keydown', handleKeydown);
      
      const galleryGrid = document.getElementById('galleryGrid');
      if (galleryGrid && filteredProducts[currentIndex]) {
        const items = galleryGrid.querySelectorAll('.gallery-item');
        if (items[currentIndex]) items[currentIndex].focus();
      }
    } else {
      originalCloseLightbox();
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {});
  }
})();

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});
