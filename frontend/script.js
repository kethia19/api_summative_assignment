// Traditional medicine database (sample data)
const traditionalMedicineDB = {
    turmeric: {
        name: "Turmeric",
        scientific: "Curcuma longa",
        uses: ["Anti-inflammatory", "Digestive aid", "Wound healing", "Joint pain relief", "Immune support"],
        preparations: ["Golden milk tea: 1 tsp turmeric + warm milk + honey", "Turmeric paste for wounds", "Curry powder in cooking"],
        warnings: "May interact with blood thinners. Consult healthcare provider if pregnant.",
        region: "Ayurveda (India)",
        emoji: "🟨"
    },
    ginger: {
        name: "Ginger",
        scientific: "Zingiber officinale",
        uses: ["Nausea relief", "Motion sickness", "Digestive aid", "Cold symptoms", "Anti-inflammatory"],
        preparations: ["Fresh ginger tea: slice 1 inch fresh ginger, steep 10 min", "Crystallized ginger for nausea", "Fresh juice with honey"],
        warnings: "May interact with blood thinners. Limit intake if you have gallstones.",
        region: "Traditional Chinese Medicine",
        emoji: "🫚"
    },
    echinacea: {
        name: "Echinacea",
        scientific: "Echinacea purpurea",
        uses: ["Immune system support", "Cold prevention", "Upper respiratory infections", "Wound healing"],
        preparations: ["Tea: 1-2 tsp dried herb, steep 10-15 min", "Tincture: 1-3 ml, 3 times daily", "Capsules as directed"],
        warnings: "Avoid if allergic to plants in daisy family. Not recommended for autoimmune conditions.",
        region: "Native American Traditional Medicine",
        emoji: "🌸"
    },
    chamomile: {
        name: "Chamomile",
        scientific: "Matricaria chamomilla",
        uses: ["Sleep aid", "Anxiety relief", "Digestive problems", "Skin irritation", "Menstrual cramps"],
        preparations: ["Bedtime tea: 1 tbsp dried flowers, steep 5-10 min", "Compress for skin conditions", "Bath soak for relaxation"],
        warnings: "May cause allergic reaction in people sensitive to ragweed family.",
        region: "European Traditional Medicine",
        emoji: "🌼"
    },
    garlic: {
        name: "Garlic",
        scientific: "Allium sativum",
        uses: ["Cardiovascular health", "Immune support", "Antibacterial", "Blood pressure regulation", "Cholesterol management"],
        preparations: ["Fresh cloves: 1-2 daily with food", "Aged garlic extract", "Roasted garlic in cooking"],
        warnings: "May interact with blood thinners. Can cause digestive upset on empty stomach.",
        region: "Mediterranean Traditional Medicine",
        emoji: "🧄"
    },
    aloe: {
        name: "Aloe Vera",
        scientific: "Aloe barbadensis",
        uses: ["Burn treatment", "Skin healing", "Sunburn relief", "Minor wound care", "Skin moisturizing"],
        preparations: ["Fresh gel directly on skin", "Aloe vera juice (internally, with caution)", "Topical creams and lotions"],
        warnings: "Do not apply to deep wounds. Internal use may cause digestive upset.",
        region: "Traditional Middle Eastern Medicine",
        emoji: "🌱"
    }
};

const conditionDB = {
    "cold": ["ginger", "echinacea", "garlic"],
    "inflammation": ["turmeric", "ginger"],
    "anxiety": ["chamomile"],
    "sleep": ["chamomile"],
    "nausea": ["ginger"],
    "burns": ["aloe"],
    "immune": ["echinacea", "garlic", "turmeric"],
    "digestive": ["ginger", "turmeric", "chamomile"]
};

let currentSearchType = 'plant';

// Tab functionality
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        currentSearchType = button.dataset.tab;
        
        const searchInput = document.getElementById('searchInput');
        switch(currentSearchType) {
            case 'plant':
                searchInput.placeholder = "Enter plant name (e.g., Turmeric, Ginger, Echinacea)";
                break;
            case 'condition':
                searchInput.placeholder = "Enter condition (e.g., cold, inflammation, anxiety)";
                break;
            case 'region':
                searchInput.placeholder = "Enter region (e.g., Ayurveda, Chinese, Native American)";
                break;
        }
    });
});

// Search functionality
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!query) return;

    showLoading();
    
    // Simulate API delay
    setTimeout(() => {
        performSearch(query);
    }, 1000);
});

function showLoading() {
    document.getElementById('loadingDiv').style.display = 'block';
    document.getElementById('errorDiv').style.display = 'none';
    document.getElementById('resultsContainer').innerHTML = '';
}

function hideLoading() {
    document.getElementById('loadingDiv').style.display = 'none';
}

function showError(message) {
    hideLoading();
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function performSearch(query) {
    hideLoading();
    let results = [];

    try {
        switch(currentSearchType) {
            case 'plant':
                if (traditionalMedicineDB[query]) {
                    results = [traditionalMedicineDB[query]];
                } else {
                    results = Object.values(traditionalMedicineDB).filter(plant => 
                        plant.name.toLowerCase().includes(query) || 
                        plant.scientific.toLowerCase().includes(query)
                    );
                }
                break;
            
            case 'condition':
                if (conditionDB[query]) {
                    results = conditionDB[query].map(plantKey => traditionalMedicineDB[plantKey]);
                } else {
                    results = Object.values(traditionalMedicineDB).filter(plant =>
                        plant.uses.some(use => use.toLowerCase().includes(query))
                    );
                }
                break;
            
            case 'region':
                results = Object.values(traditionalMedicineDB).filter(plant =>
                    plant.region.toLowerCase().includes(query)
                );
                break;
        }

        displayResults(results, query);
    } catch (error) {
        showError('An error occurred while searching. Please try again.');
    }
}

function displayResults(results, query) {
    const container = document.getElementById('resultsContainer');
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No remedies found</h3>
                <p>Try searching for: turmeric, ginger, chamomile, echinacea, garlic, or aloe</p>
                <p>Or search by condition: cold, inflammation, anxiety, sleep, nausea</p>
            </div>
        `;
        return;
    }

    container.innerHTML = results.map((plant, index) => `
        <div class="medicine-card" style="animation-delay: ${index * 0.1}s">
            <div class="card-image">
                <span style="font-size: 3rem; z-index: 1;">${plant.emoji}</span>
            </div>
            <div class="card-content">
                <h3 class="plant-name">${plant.name}</h3>
                <p class="scientific-name">${plant.scientific}</p>
                
                <div class="uses-section">
                    <div class="section-label">Traditional Uses</div>
                    <div class="uses-list">
                        ${plant.uses.map(use => `• ${use}`).join('<br>')}
                    </div>
                </div>

                <div class="section-label">Origin</div>
                <div style="color: #555; margin-bottom: 15px;">${plant.region}</div>

                <div class="preparation">
                    <div class="section-label">Preparation Methods</div>
                    ${plant.preparations.map(prep => `• ${prep}`).join('<br>')}
                </div>

                <div class="warning">
                    <strong>Safety:</strong> ${plant.warnings}
                </div>
            </div>
        </div>
    `).join('');
}

// Example of a search
window.addEventListener('load', () => {
    document.getElementById('searchInput').value = 'turmeric';
    performSearch('turmeric');
});
