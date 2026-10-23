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
        emoji: "👗"
    },
    {
        id: 2,
        title: "Tanzanian Coffee Beans",
        titleSw: "Mbegu za Kahawa ya Tanzania",
        category: "agriculture",
        categorySw: "Kilimo",
        description: "Premium Arabica coffee beans grown in the highlands of Kilimanjaro region.",
        descriptionSw: "Mbegu za kahawa za Arabica bora zilizokuzwa katika milima ya mkoa wa Kilimanjaro.",
        emoji: "☕"
    },
    {
        id: 3,
        title: "Makonde Wood Carving",
        titleSw: "Sanamu ya Mbao ya Makonde",
        category: "crafts",
        categorySw: "Vikonyo",
        description: "Intricate wood carving by Makonde artisans, a UNESCO recognized art form from southern Tanzania.",
        descriptionSw: "Uchoraji wa mbao wa Makonde, sanaa inayotambuliwa na UNESCO kutoka kusini mwa Tanzania.",
        emoji: "🎭"
    },
    {
        id: 4,
        title: "Tanzanian Cashew Nuts",
        titleSw: "Korosho za Tanzania",
        category: "food",
        categorySw: "Chakula",
        description: "High-quality roasted cashew nuts from the coastal regions of Tanzania.",
        descriptionSw: "Korosho zilizokaangwa za ubora wa juu kutoka maeneo ya pwani ya Tanzania.",
        emoji: "🥜"
    },
    {
        id: 5,
        title: "Maasai Beaded Jewelry",
        titleSw: "Mapambo ya Shanga za Maasai",
        category: "crafts",
        categorySw: "Vikonyo",
        description: "Handcrafted beaded necklaces and bracelets made by Maasai women artisans.",
        descriptionSw: "Mapambo ya shanga yaliyotengenezwa kwa mikono na wanawake wa Maasai.",
        emoji: "📿"
    },
    {
        id: 6,
        title: "Tanzanian Tea",
        titleSw: "Chai ya Tanzania",
        category: "agriculture",
        categorySw: "Kilimo",
        description: "Premium black tea from the lush tea plantations of Mufindi, Iringa.",
        descriptionSw: "Chai bora ya nyeusi kutoka mashamba ya chai ya Mufindi, Iringa.",
        emoji: "🍵"
    },
    {
        id: 7,
        title: "Kanga Fabric",
        titleSw: "Kanga",
        category: "textiles",
        categorySw: "Nguo",
        description: "Traditional Kanga fabric with Swahili proverbs, worn across East Africa.",
        descriptionSw: "Kanga ya jadi na methali za Kiswahili, inayovaliwa Afrika Mashariki.",
        emoji: "🧣"
    },
    {
        id: 8,
        title: "Tanzanian Honey",
        titleSw: "Asali ya Tanzania",
        category: "food",
        categorySw: "Chakula",
        description: "Pure organic honey harvested from the miombo woodlands of western Tanzania.",
        descriptionSw: "Asali safi ya asili iliyovunwa kutoka misitu ya miombo ya magharibi mwa Tanzania.",
        emoji: "🍯"
    },
    {
        id: 9,
        title: "Tingatinga Painting",
        titleSw: "Uchoraji wa Tingatinga",
        category: "crafts",
        categorySw: "Vikonyo",
        description: "Colorful Tingatinga style painting depicting African wildlife and daily life.",
        descriptionSw: "Uchoraji wa mtindo wa Tingatinga unaonyesha wanyama wa Afrika na maisha ya kila siku.",
        emoji: ""
    },
    {
        id: 10,
        title: "Tanzanian Sisal Products",
        titleSw: "Bidhaa za Mkonge",
        category: "manufacturing",
        categorySw: "Uzalishaji",
        description: "Eco-friendly sisal bags and baskets handwoven by local artisans.",
        descriptionSw: "Mifuko na kikapu vya mkonge vya mazingira vilivyotengenezwa kwa mikono na mafundi wa ndani.",
        emoji: "🧺"
    },
    {
        id: 11,
        title: "Spices of Zanzibar",
        titleSw: "Viungo vya Zanzibar",
        category: "food",
        categorySw: "Chakula",
        description: "Aromatic spice blend from the Spice Island of Zanzibar including cloves, cinnamon, and cardamom.",
        descriptionSw: "Mchanganyiko wa viungo kutoka Kisiwa cha Viungo cha Zanzibar ikiwa ni pamoja na karafuu, mdalasini, na hilali.",
        emoji: "🌿"
    },
    {
        id: 12,
        title: "Tanzanian Leather Goods",
        titleSw: "Bidhaa za Ngozi za Tanzania",
        category: "manufacturing",
        categorySw: "Uzalishaji",
        description: "Handcrafted leather bags, belts, and shoes made from premium Tanzanian leather.",
        descriptionSw: "Mifuko, mikanda, na viatu vya ngozi vilivyotengenezwa kwa mikono kutoka ngozi bora ya Tanzania.",
        emoji: "👜"
    }
];

// ===== State =====
let currentLanguage = 'en';
let currentCategory = 'all';
let visibleCount = 6;

// ===== Language Switching =====
function setLanguage(lang) {
    currentLanguage = lang;

    // Update toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.dataset[lang];
    });

    // Re-render gallery
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
                <div class="gallery-item-placeholder">${product.emoji}</div>
            </div>
            <div class="gallery-item-info">
                <div class="gallery-item-title">${currentLanguage === 'sw' ? product.titleSw : product.title}</div>
                <div class="gallery-item-category">${currentLanguage === 'sw' ? product.categorySw : product.category}</div>
            </div>
        </div>
    `).join('');

    // Show/hide load more button
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

    // Create a colored placeholder for the image
    const imgEl = document.getElementById('lightboxImage');
    imgEl.style.display = 'none';

    // Show emoji placeholder in lightbox
    const content = document.querySelector('.lightbox-content');
    let placeholder = content.querySelector('.lightbox-emoji-placeholder');
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'lightbox-emoji-placeholder';
        placeholder.style.cssText = 'width:100%;height:350px;display:flex;align-items:center;justify-content:center;font-size:120px;background:linear-gradient(135deg,#E8F5EE,#E8EFF8);';
        content.insertBefore(placeholder, content.firstChild);
    }
    placeholder.textContent = product.emoji;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox on background click
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});
