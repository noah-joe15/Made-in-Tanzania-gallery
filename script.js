// ===== Gallery Data =====
const galleryProducts = [
    {
        id: 1,
        title: "Kitenge Fashion Dress",
        titleSw: "Gauni la Kitenge",
        category: "textiles",
        categorySw: "Nguo",
        description: "Beautiful handmade Kitenge dress featuring traditional Tanzanian patterns and vibrant colors.",
        descriptionSw: "Gauni la Kitenge lililotengenezwa kwa mikono lenye michoro ya jadi ya Tanzania na rangi za kuvutia.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`
    },
    {
        id: 2,
        title: "Tanzanian Coffee Beans",
        titleSw: "Mbegu za Kahawa ya Tanzania",
        category: "agriculture",
        categorySw: "Kilimo",
        description: "Premium Arabica coffee beans grown in the highlands of Kilimanjaro region.",
        descriptionSw: "Mbegu za kahawa za Arabica bora zilizokuzwa katika milima ya mkoa wa Kilimanjaro.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8c0 4-3 7-7 7s-7-3-7-7 3-7 7-7 7 3 7 7z"/><path d="M11 1v14"/><path d="M11 15c-2 2-2 5 0 7"/><path d="M11 15c2 2 2 5 0 7"/></svg>`
    },
    {
        id: 3,
        title: "Makonde Wood Carving",
        titleSw: "Sanamu ya Mbao ya Makonde",
        category: "crafts",
        categorySw: "Vikonyo",
        description: "Intricate wood carving by Makonde artisans, a UNESCO recognized art form from southern Tanzania.",
        descriptionSw: "Uchoraji wa mbao wa Makonde, sanaa inayotambuliwa na UNESCO kutoka kusini mwa Tanzania.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
    },
    {
        id: 4,
        title: "Tanzanian Cashew Nuts",
        titleSw: "Korosho za Tanzania",
        category: "food",
        categorySw: "Chakula",
        description: "High-quality roasted cashew nuts from the coastal regions of Tanzania.",
        descriptionSw: "Korosho zilizokaangwa za ubora wa juu kutoka maeneo ya pwani ya Tanzania.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C7 2 3 7 3 12s4 10 9 10 9-5 9-10S17 2 12 2z"/><path d="M12 2v20"/><path d="M12 12h8"/></svg>`
    },
    {
        id: 5,
        title: "Maasai Beaded Jewelry",
        titleSw: "Mapambo ya Shanga za Maasai",
        category: "crafts",
        categorySw: "Vikonyo",
        description: "Handcrafted beaded necklaces and bracelets made by Maasai women artisans.",
        descriptionSw: "Mapambo ya shanga yaliyotengenezwa kwa mikono na wanawake wa Maasai.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/></svg>`
    },
    {
        id: 6,
        title: "Tanzanian Tea",
        titleSw: "Chai ya Tanzania",
        category: "agriculture",
        categorySw: "Kilimo",
        description: "Premium black tea from the lush tea plantations of Mufindi, Iringa.",
        descriptionSw: "Chai bora ya nyeusi kutoka mashamba ya chai ya Mufindi, Iringa.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`
    },
    {
        id: 7,
        title: "Kanga Fabric",
        titleSw: "Kanga",
        category: "textiles",
        categorySw: "Nguo",
        description: "Traditional Kanga fabric with Swahili proverbs, worn across East Africa.",
        descriptionSw: "Kanga ya jadi na methali za Kiswahili, inayovaliwa Afrika Mashariki.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
    },
    {
        id: 8,
        title: "Tanzanian Honey",
        titleSw: "Asali ya Tanzania",
        category: "food",
        categorySw: "Chakula",
        description: "Pure organic honey harvested from the miombo woodlands of western Tanzania.",
        descriptionSw: "Asali safi ya asili iliyovunwa kutoka misitu ya miombo ya magharibi mwa Tanzania.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`
    },
    {
        id: 9,
        title: "Tingatinga Painting",
        titleSw: "Uchoraji wa Tingatinga",
        category: "crafts",
        categorySw: "Vikonyo",
        description: "Colorful Tingatinga style painting depicting African wildlife and daily life.",
        descriptionSw: "Uchoraji wa mtindo wa Tingatinga unaonyesha wanyama wa Afrika na maisha ya kila siku.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`
    },
    {
        id: 10,
        title: "Tanzanian Sisal Products",
        titleSw: "Bidhaa za Mkonge",
        category: "manufacturing",
        categorySw: "Uzalishaji",
        description: "Eco-friendly sisal bags and baskets handwoven by local artisans.",
        descriptionSw: "Mifuko na kikapu vya mkonge vya mazingira vilivyotengenezwa kwa mikono na mafundi wa ndani.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
    },
    {
        id: 11,
        title: "Spices of Zanzibar",
        titleSw: "Viungo vya Zanzibar",
        category: "food",
        categorySw: "Chakula",
        description: "Aromatic spice blend from the Spice Island of Zanzibar including cloves, cinnamon, and cardamom.",
        descriptionSw: "Mchanganyiko wa viungo kutoka Kisiwa cha Viungo cha Zanzibar ikiwa ni pamoja na karafuu, mdalasini, na hilali.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
    },
    {
        id: 12,
        title: "Tanzanian Leather Goods",
        titleSw: "Bidhaa za Ngozi za Tanzania",
        category: "manufacturing",
        categorySw: "Uzalishaji",
        description: "Handcrafted leather bags, belts, and shoes made from premium Tanzanian leather.",
        descriptionSw: "Mifuko, mikanda, na viatu vya ngozi vilivyotengenezwa kwa mikono kutoka ngozi bora ya Tanzania.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`
    }
];

// ===== State =====
let currentLanguage = 'en';
let currentCategory = 'all';
let visibleCount = 6;

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
    const filtered = currentCategory === 'all'
        ? galleryProducts
        : galleryProducts.filter(p => p.category === currentCategory);

    const toShow = filtered.slice(0, visibleCount);

    grid.innerHTML = toShow.map(product => `
        <div class="gallery-item" onclick="openLightbox(${product.id})" data-category="${product.category}">
            <div class="gallery-item-image">
                <div class="gallery-item-placeholder">
                    ${product.icon}
                </div>
            </div>
            <div class="gallery-item-info">
                <div class="gallery-item-title">${currentLanguage === 'sw' ? product.titleSw : product.title}</div>
                <div class="gallery-item-category">${currentLanguage === 'sw' ? product.categorySw : product.category}</div>
            </div>
        </div>
    `).join('');

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = toShow.length < filtered.length ? 'inline-flex' : 'none';
    }
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
document.getElementById('loadMoreBtn').addEventListener('click', () => {
    visibleCount += 6;
    renderGallery();
});

// ===== Lightbox =====
function openLightbox(id) {
    const product = galleryProducts.find(p => p.id === id);
    if (!product) return;

    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightboxTitle').textContent = currentLanguage === 'sw' ? product.titleSw : product.title;
    document.getElementById('lightboxCategory').textContent = currentLanguage === 'sw' ? product.categorySw : product.category;
    document.getElementById('lightboxDescription').textContent = currentLanguage === 'sw' ? product.descriptionSw : product.description;

    const imgEl = document.getElementById('lightboxImage');
    imgEl.style.display = 'none';

    const content = document.querySelector('.lightbox-content');
    let placeholder = content.querySelector('.lightbox-icon-placeholder');
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'lightbox-icon-placeholder';
        placeholder.style.cssText = 'width:100%;height:350px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#E8F5EE,#E8EFF8);';
        content.insertBefore(placeholder, content.firstChild);
    }
    
    // Scale up the SVG icon for the lightbox view
    placeholder.innerHTML = `<div style="transform: scale(2.5); color: var(--green-primary); opacity: 0.4;">${product.icon}</div>`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});
