// ==========================================
// CONFIGURATION: Vercel API routes (relative path)
// ==========================================
const API_BASE_URL = '';

// DOM Elements
const productForm = document.getElementById('productForm');
const mediaTypeSelect = document.getElementById('mediaType');
const fileInputGroup = document.getElementById('fileInputGroup');
const youtubeInputGroup = document.getElementById('youtubeInputGroup');
const mediaFileInput = document.getElementById('mediaFile');
const fileNameDisplay = document.getElementById('fileName');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const productsTableBody = document.getElementById('productsTableBody');

// ===== Sidebar Navigation =====
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav links active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionName}`) {
            link.classList.add('active');
        }
    });

    // Close sidebar on mobile after selection
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
    }
}

// Mobile Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (window.innerWidth <= 1024 && 
        sidebar && 
        !sidebar.contains(e.target) && 
        menuToggle && 
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// ===== Dynamic Category Suggestions =====
async function loadCategorySuggestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        
        // Extract unique categories
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        
        // Populate datalist in the form
        const datalist = document.getElementById('categorySuggestions');
        if (datalist) {
            datalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
        }
    } catch (error) {
        console.error('Error loading category suggestions:', error);
    }
}

// Toggle Media Input based on selection
function toggleMediaInput() {
    const type = mediaTypeSelect.value;
    if (type === 'youtube') {
        fileInputGroup.style.display = 'none';
        youtubeInputGroup.style.display = 'block';
        document.getElementById('youtubeUrl').required = true;
        mediaFileInput.required = false;
    } else {
        fileInputGroup.style.display = 'block';
        youtubeInputGroup.style.display = 'none';
        document.getElementById('youtubeUrl').required = false;
        mediaFileInput.required = true;
    }
}

// Update file name display on selection
mediaFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        fileNameDisplay.textContent = e.target.files[0].name;
        fileNameDisplay.style.color = 'var(--primary)';
        fileNameDisplay.style.fontWeight = '600';
    } else {
        fileNameDisplay.textContent = 'Click to select or drag file here';
        fileNameDisplay.style.color = 'var(--text-muted)';
        fileNameDisplay.style.fontWeight = '400';
    }
});

// Handle Form Submission
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg> Saving...`;
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';

    const mediaType = mediaTypeSelect.value;

    try {
        if (mediaType === 'youtube') {
            const payload = {
                title_en: document.getElementById('titleEn').value,
                title_sw: document.getElementById('titleSw').value,
                category: document.getElementById('category').value,
                description_en: document.getElementById('descEn').value,
                description_sw: document.getElementById('descSw').value,
                media_type: mediaType,
                media_url: document.getElementById('youtubeUrl').value
            };

            const response = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save product');
        } else {
            const formData = new FormData();
            formData.append('title_en', document.getElementById('titleEn').value);
            formData.append('title_sw', document.getElementById('titleSw').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('description_en', document.getElementById('descEn').value);
            formData.append('description_sw', document.getElementById('descSw').value);
            formData.append('media_type', mediaType);
            formData.append('media_file', mediaFileInput.files[0]);

            const response = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to save product');
        }

        statusMessage.textContent = 'Product saved successfully!';
        statusMessage.className = 'status-message success';
        productForm.reset();
        fileNameDisplay.textContent = 'Click to select or drag file here';
        fileNameDisplay.style.color = 'var(--text-muted)';
        fileNameDisplay.style.fontWeight = '400';
        toggleMediaInput();
        
        loadProducts();
        loadCategorySuggestions(); // Refresh category suggestions immediately

    } catch (error) {
        console.error('Error saving product:', error);
        statusMessage.textContent = 'Error: ' + error.message;
        statusMessage.className = 'status-message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Product`;
    }
});

// Load Products into Table
async function loadProducts() {
    productsTableBody.innerHTML = `
        <tr>
            <td colspan="4" class="loading-state">
                <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
                Loading products...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();

        if (data.length === 0) {
            productsTableBody.innerHTML = `<tr><td colspan="4" class="loading-state">No products found. Add one above.</td></tr>`;
            return;
        }

        productsTableBody.innerHTML = data.map(product => `
            <tr>
                <td data-label="Media">
                    ${product.media_type === 'youtube' 
                        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>' 
                        : `<img src="${product.media_url}" class="media-preview" alt="Preview" onerror="this.style.display='none'">`
                    }
                </td>
                <td data-label="Title"><strong>${product.title_en}</strong><br><small style="color: var(--text-muted);">${product.title_sw}</small></td>
                <td data-label="Category"><span style="background: var(--surface); padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; border: 1px solid var(--border);">${product.category}</span></td>
                <td data-label="Actions">
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id}, '${product.media_type}', '${product.media_url}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        productsTableBody.innerHTML = `<tr><td colspan="4" class="loading-state" style="color: var(--danger);">Error loading data.</td></tr>`;
    }
}

// Delete Product
async function deleteProduct(id, mediaType, mediaUrl) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/products`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, media_type: mediaType, media_url: mediaUrl })
        });
        
        if (!response.ok) throw new Error('Failed to delete');

        loadProducts();
        loadCategorySuggestions(); // Refresh categories in case it was the last of its kind
    } catch (error) {
        console.error('Error deleting:', error);
        alert('Failed to delete product.');
    }
}

// Load Registrations into Table
async function loadRegistrations() {
    const tbody = document.getElementById('registrationsTableBody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="loading-state">
                <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
                Loading registrations...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE_URL}/api/registrations`);
        if (!response.ok) throw new Error('Failed to fetch registrations');
        
        const data = await response.json();

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="loading-state">No registration applications yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(reg => `
            <tr>
                <td data-label="Full Name"><strong>${reg.full_name}</strong></td>
                <td data-label="Phone">${reg.phone}</td>
                <td data-label="Business">${reg.business_name}</td>
                <td data-label="Region">${reg.region}</td>
                <td data-label="Date"><small>${new Date(reg.created_at).toLocaleDateString()}</small></td>
                <td data-label="Actions">
                    <button class="btn btn-danger" onclick="deleteRegistration(${reg.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading registrations:', error);
        tbody.innerHTML = `<tr><td colspan="6" class="loading-state" style="color: var(--danger);">Error loading data.</td></tr>`;
    }
}

// Delete Registration
async function deleteRegistration(id) {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/registrations`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        if (!response.ok) throw new Error('Failed to delete');

        loadRegistrations();
    } catch (error) {
        console.error('Error deleting:', error);
        alert('Failed to delete registration.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Attach menu toggle listener
    document.getElementById('menuToggle')?.addEventListener('click', toggleSidebar);
    
    toggleMediaInput();
    loadProducts();
    loadCategorySuggestions(); // Load initial category suggestions for the datalist
    setTimeout(() => {
        loadRegistrations();
    }, 500);
});
