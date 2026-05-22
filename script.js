/* ==========================================================================
   NewsHub Multi-Application Logic (News & Calculator)
   ========================================================================== */

// Routing / Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize News App if elements exist
    if (document.getElementById('newsGrid')) {
        initNewsApp();
    }
    
    // Initialize Calculator if elements exist
    if (document.querySelector('.calculator')) {
        initCalculator();
    }
});

/* ==========================================================================
   1. NEWS APPLICATION ENGINE
   ========================================================================== */
function initNewsApp() {
    // --- Application State ---
    let state = {
        apiProvider: localStorage.getItem('apiProvider') || 'demo',
        gnewsKey: localStorage.getItem('gnewsKey') || '',
        newsapiKey: localStorage.getItem('newsapiKey') || '',
        currentCategory: 'general',
        currentCountry: localStorage.getItem('currentCountry') || 'us',
        currentPage: 1,
        currentSortBy: 'publishedAt',
        searchQuery: '',
        layout: localStorage.getItem('layout') || 'grid',
        bookmarks: JSON.parse(localStorage.getItem('bookmarks')) || [],
        articles: [], // Cached articles on the current page
        totalResults: 0
    };

    const articlesPerPage = 12;

    // --- DOM Elements ---
    const newsGrid = document.getElementById('newsGrid');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorDesc = document.getElementById('errorDesc');
    const retryBtn = document.getElementById('retryBtn');
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    const countrySelect = document.getElementById('countrySelect');
    const sortSelect = document.getElementById('sortSelect');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const paginationBar = document.getElementById('paginationBar');
    
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    
    const layoutToggleBtn = document.getElementById('layoutToggleBtn');
    const gridIcon = layoutToggleBtn.querySelector('.grid-icon');
    const listIcon = layoutToggleBtn.querySelector('.list-icon');
    
    const bookmarksToggleBtn = document.getElementById('bookmarksToggleBtn');
    const bookmarkBadge = document.getElementById('bookmarkBadge');
    const bookmarksDrawer = document.getElementById('bookmarksDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const bookmarksContainer = document.getElementById('bookmarksContainer');
    
    const settingsToggleBtn = document.getElementById('settingsToggleBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const settingsForm = document.getElementById('settingsForm');
    const apiProviderSelect = document.getElementById('apiProvider');
    const gnewsKeyContainer = document.getElementById('gnewsKeyContainer');
    const newsapiKeyContainer = document.getElementById('newsapiKeyContainer');
    const gnewsKeyInput = document.getElementById('gnewsKey');
    const newsapiKeyInput = document.getElementById('newsapiKey');
    
    const footerConfigBtn = document.getElementById('footerConfigBtn');
    const backdrop = document.getElementById('backdrop');
    
    // Reader Modal
    const readerModal = document.getElementById('readerModal');
    const closeReaderBtn = document.getElementById('closeReaderBtn');
    const readerSource = document.getElementById('readerSource');
    const readerDate = document.getElementById('readerDate');
    const readerTitle = document.getElementById('readerTitle');
    const readerAuthor = document.getElementById('readerAuthor');
    const readerAuthorRow = document.getElementById('readerAuthorRow');
    const readerImg = document.getElementById('readerImg');
    const readerImgWrapper = document.getElementById('readerImgWrapper');
    const readerContent = document.getElementById('readerContent');
    const readerSourceLink = document.getElementById('readerSourceLink');
    const readerBookmarkBtn = document.getElementById('readerBookmarkBtn');
    const readerShareBtn = document.getElementById('readerShareBtn');
    let activeReaderArticle = null;

    // Toast Notification
    const toast = document.getElementById('toast');

    // --- High-Quality Mock Data (Offline/Demo Mode fallback) ---
    const mockNews = {
        general: [
            {
                title: "Global Summit Outlines Green Energy Commitments for 2030",
                description: "World leaders have agreed on a comprehensive plan to accelerate renewable energy deployment, targeting a 45% reduction in carbon emissions over the next decade.",
                content: "Representatives from over 120 nations gathered today at the Global Climate Accord to formalize new commitments for environmental recovery. The summit ended with a joint resolution to phase out thermal coal operations and triple investment in utility-scale solar and wind projects by 2030.<br><br>Negotiators worked through the night to finalize the details, resolving disputes over climate finance for developing nations. The agreement outlines a structured carbon tariff mechanism alongside incentives for green technology transfers.",
                url: "https://example.com/green-energy-summit",
                urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
                source: { name: "EcoGlobal" },
                author: "Sarah Sterling"
            },
            {
                title: "Cities Redesign Infrastructure to Combat Rising Summer Temperatures",
                description: "Urban planning agencies are incorporating reflective materials, pocket forests, and water corridors to cool city centers experiencing heat-island effects.",
                content: "As meteorological offices predict another record-breaking summer, metropolitan councils are rushing to implement cooling infrastructures. Urban heat islands, caused by dense concrete and asphalt surfaces, can increase local temperatures by up to 8 degrees Celsius compared to surrounding rural regions.<br><br>The intervention program focuses on retrofitting rooftops with vegetative layers and spraying streets with highly reflective polymer-based coatings. The initiative also aims to establish community micro-forests within a ten-minute walk of every resident.",
                url: "https://example.com/urban-cooling-infrastructure",
                urlToImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
                source: { name: "Urbanist Daily" },
                author: "Marcus Vance"
            },
            {
                title: "Deep Sea Expedition Uncovers Dozens of Previously Unknown Marine Species",
                description: "An oceanographic crew studying the Mariana Trench returned with high-definition footage and biological samples of unique deep-water life forms.",
                content: "Researchers aboard the research vessel 'Nautilus VII' have concluded an eight-week mapping and sampling mission in the western Pacific Ocean. Utilizing advanced robotic submersibles capable of withstanding intense hydrostatic pressures, the crew documented marine ecosystems located five miles below the surface.<br><br>Among the discoveries are translucent organisms that rely on chemosynthesis rather than photosynthesis. The specimens collected will assist scientists in understanding the origins of metabolic pathways in extreme planetary environments.",
                url: "https://example.com/deep-sea-discoveries",
                urlToImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
                source: { name: "Oceanic Science" },
                author: "Dr. Elena Rostova"
            }
        ],
        business: [
            {
                title: "Market Readjustments: Technology Equities Experience Inflow Shift",
                description: "Investors rebalance portfolios as stabilization in interest rates boosts corporate growth projections and tech stock valuations.",
                content: "Major financial indices climbed to historic levels this morning as capital inflows returned to growth-oriented tech assets. Financial analysts attribute the movement to indicators that federal banking systems are pausing their restrictive monetary cycles.<br><br>Semiconductor manufacturers and software service platforms led the rally, with major firms reporting earnings exceeding consensus estimates. Asset management firms expect this trend to persist through the upcoming fiscal quarters, driving renewed venture interest.",
                url: "https://example.com/market-readjustment",
                urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
                source: { name: "Financial Ledger" },
                author: "Arthur Pendelton"
            },
            {
                title: "E-Commerce Logistics Platforms Invest in Automated Fulfillment Centers",
                description: "Retail logistics networks deploy AI-driven sorting robotics and autonomous freight carts to reduce supply chain delays.",
                content: "Global logistics enterprises are allocating billions of dollars to build automated hubs to streamline product deliveries. The automation drive seeks to address persistent labor constraints and rising distribution operational costs.<br><br>The integration of optical sorting systems and autonomous ground vehicles is expected to reduce order processing latency from hours to minutes. Industry surveys indicate that early adopters of these robotic configurations have seen a 30% increase in regional distribution capacity.",
                url: "https://example.com/automated-fulfillment-logistics",
                urlToImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
                source: { name: "SupplyChain News" },
                author: "Clara Reynolds"
            }
        ],
        technology: [
            {
                title: "Next-Gen Quantum Microchips Achieve Coherence Milestones",
                description: "Physics labs demonstrate stable superconducting qubits operating at standard cryogenic temperatures with lower gate error rates.",
                content: "Quantum computer designers have made a significant leap toward fault-tolerant processing platforms. A joint research team successfully engineered quantum microchips that maintain state coherence for over ten milliseconds, a threshold critical for active error-correction routines.<br><br>The achievement is attributed to new material synthesis techniques that minimize environmental noise on the superconducting circuits. Practical applications in materials science and complex molecular modeling are projected to emerge within the next three to five years.",
                url: "https://example.com/quantum-coherence-chips",
                urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
                source: { name: "Silicon Review" },
                author: "Linus Patterson"
            },
            {
                title: "Open-Source AI Models Challenge Proprietary Developer Tools",
                description: "Community-driven code synthesis models demonstrate competitive execution benchmarks, shifting developer project dynamics.",
                content: "A wave of decentralized artificial intelligence projects is reshaping the developer toolchain. Independent researchers have released new neural models optimized for code completion and testing that rival commercial platforms.<br><br>By utilizing public datasets and training models under open licensing terms, these projects allow organizations to run private code completion tools on local workstations. This addresses corporate compliance and intellectual property exposure concerns that have limited public cloud API adoptions.",
                url: "https://example.com/open-source-ai-code",
                urlToImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
                source: { name: "DevTech Wire" },
                author: "Nadia Kasimov"
            }
        ],
        sports: [
            {
                title: "Championship Underdogs Secure Dramatic Double-Overtime Victory",
                description: "A series of late defensive plays and a buzzer-beating field goal secure a place in the national finals for the eighth-seeded team.",
                content: "In one of the most unpredictable contests in tournament history, the underdog squad overcame a fifteen-point fourth-quarter deficit to win in double overtime. The stadium erupted as the game-winning shot cleared the rim with fractions of a second remaining.<br><br>Coaches credited their conditioning and transition defense during the extra periods for securing the win. The team will now advance to the finals next week, facing the undefeated top seed in a highly anticipated matchup.",
                url: "https://example.com/underdog-overtime-victory",
                urlToImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
                source: { name: "SportsSphere" },
                author: "Reggie Miller"
            }
        ],
        health: [
            {
                title: "Immunology Research Yields Targeted Multi-Virus Vaccination Candidate",
                description: "Clinical trials indicate strong antibody responses against multiple influenza strains and respiratory viruses in initial phase studies.",
                content: "Medical researchers have published encouraging data from Phase I trials of a synthetic vaccine platform. The formulation targets preserved molecular regions shared across several viral families, presenting a path toward comprehensive viral prevention.<br><br>Participants showed high levels of neutralizing antibodies and memory T-cell responses with minimal systemic side effects. Expanding Phase II trials are scheduled to begin next month to evaluate protective efficacy in broader age groups.",
                url: "https://example.com/multi-virus-vaccination",
                urlToImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
                source: { name: "Biomedical Journal" },
                author: "Dr. Chloe Vance"
            }
        ],
        science: [
            {
                title: "Space Observatory Maps Thermal Signatures of Exo-Atmospheres",
                description: "Deep space sensors detect carbon compound signatures and heat distribution maps on a rocky planet orbiting a nearby dwarf star.",
                content: "Astronomers utilizing the orbital observatory have collected detailed atmospheric data from an exoplanet 40 light-years away. By analyzing light filtration patterns as the planet transited its host star, researchers detected signatures of carbon dioxide and water vapor.<br><br>The data suggests active thermal convection cycles and potential cloud structures in the planet's mid-atmosphere. While surface temperatures remain too high for liquid water, the findings validate methods that will soon analyze cooler, earth-sized orbital targets.",
                url: "https://example.com/exoplanet-atmospheres",
                urlToImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
                source: { name: "Cosmos Quarterly" },
                author: "Dr. Julian Vance"
            }
        ],
        entertainment: [
            {
                title: "Independent Cinema Scores Major Nominations at Annual Film Festival",
                description: "Character-driven dramas and low-budget productions sweep the jury categories, overshadowing major studio blockbusters.",
                content: "This year's international film festival has concluded with independent films capturing the top honors. The grand jury prize went to a minimalist family drama produced on a micro-budget, receiving praise for its emotional realism and cinematography.<br><br>Film critics view the awards as a shift in audience interest toward intimate, script-centric stories. Distribution rights for the winning films were acquired by major streaming platforms, ensuring wide distribution later this year.",
                url: "https://example.com/indie-cinema-wins",
                urlToImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60",
                publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
                source: { name: "Cinephile Daily" },
                author: "Brooke Sterling"
            }
        ]
    };

    // --- Initialization ---
    function init() {
        setupTheme();
        setupLayout();
        setupLocalStorageKeys();
        setupEventListeners();
        fetchNews();
        updateBookmarkBadge();
    }

    // --- Theme & Layout Management ---
    function setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeUI(savedTheme);
    }

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);
    }

    function setupLayout() {
        updateLayoutUI();
    }

    function updateLayoutUI() {
        if (state.layout === 'grid') {
            newsGrid.classList.remove('list-layout');
            newsGrid.classList.add('grid-layout');
            gridIcon.style.display = 'none';
            listIcon.style.display = 'block';
        } else {
            newsGrid.classList.remove('grid-layout');
            newsGrid.classList.add('list-layout');
            gridIcon.style.display = 'block';
            listIcon.style.display = 'none';
        }
    }

    function toggleLayout() {
        state.layout = state.layout === 'grid' ? 'list' : 'grid';
        localStorage.setItem('layout', state.layout);
        updateLayoutUI();
    }

    // --- Settings Modal & API Config ---
    function setupLocalStorageKeys() {
        gnewsKeyInput.value = state.gnewsKey;
        newsapiKeyInput.value = state.newsapiKey;
        apiProviderSelect.value = state.apiProvider;
        toggleKeyInputsVisibility(state.apiProvider);
        updateStatusIndicator();
    }

    function toggleKeyInputsVisibility(provider) {
        gnewsKeyContainer.style.display = provider === 'gnews' ? 'block' : 'none';
        newsapiKeyContainer.style.display = provider === 'newsapi' ? 'block' : 'none';
    }

    function updateStatusIndicator() {
        const dot = apiStatusIndicator.querySelector('.status-dot');
        const text = apiStatusIndicator.querySelector('.status-text');

        dot.className = 'status-dot';
        if (state.apiProvider === 'demo') {
            dot.classList.add('yellow');
            text.textContent = 'Demo Mode (Interactive)';
        } else if (state.apiProvider === 'gnews') {
            if (state.gnewsKey) {
                dot.classList.add('green');
                text.textContent = 'GNews Live';
            } else {
                dot.classList.add('red');
                text.textContent = 'GNews (Missing Key)';
            }
        } else if (state.apiProvider === 'newsapi') {
            if (state.newsapiKey) {
                dot.classList.add('green');
                text.textContent = 'NewsAPI Live (Localhost)';
            } else {
                dot.classList.add('red');
                text.textContent = 'NewsAPI (Missing Key)';
            }
        }
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Theme
        themeToggleBtn.addEventListener('click', toggleTheme);

        // Layout
        layoutToggleBtn.addEventListener('click', toggleLayout);

        // Bookmarks drawer toggles
        bookmarksToggleBtn.addEventListener('click', openBookmarksDrawer);
        closeDrawerBtn.addEventListener('click', closeBookmarksDrawer);
        backdrop.addEventListener('click', () => {
            closeBookmarksDrawer();
            closeModal(settingsModal);
            closeModal(readerModal);
        });

        // Settings Modal toggles
        settingsToggleBtn.addEventListener('click', () => openModal(settingsModal));
        closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));
        footerConfigBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(settingsModal);
        });

        // Settings Save
        apiProviderSelect.addEventListener('change', (e) => {
            toggleKeyInputsVisibility(e.target.value);
        });

        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            state.apiProvider = apiProviderSelect.value;
            state.gnewsKey = gnewsKeyInput.value.trim();
            state.newsapiKey = newsapiKeyInput.value.trim();

            localStorage.setItem('apiProvider', state.apiProvider);
            localStorage.setItem('gnewsKey', state.gnewsKey);
            localStorage.setItem('newsapiKey', state.newsapiKey);

            updateStatusIndicator();
            closeModal(settingsModal);
            showToast('⚡ Settings saved successfully!');
            
            // Reload news
            state.currentPage = 1;
            fetchNews();
        });

        // Category Buttons
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentCategory = btn.dataset.category;
                state.searchQuery = ''; // Reset search query when clicking category
                searchInput.value = '';
                state.currentPage = 1;
                fetchNews();
            });
        });

        // Search Actions
        searchBtn.addEventListener('click', triggerSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') triggerSearch();
        });

        // Region and Sort Selectors
        countrySelect.value = state.currentCountry;
        countrySelect.addEventListener('change', (e) => {
            state.currentCountry = e.target.value;
            localStorage.setItem('currentCountry', state.currentCountry);
            state.currentPage = 1;
            fetchNews();
        });

        sortSelect.value = state.currentSortBy;
        sortSelect.addEventListener('change', (e) => {
            state.currentSortBy = e.target.value;
            state.currentPage = 1;
            fetchNews();
        });

        // Pagination
        prevBtn.addEventListener('click', () => {
            if (state.currentPage > 1) {
                state.currentPage--;
                fetchNews();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        nextBtn.addEventListener('click', () => {
            const maxPages = Math.ceil(state.totalResults / articlesPerPage);
            if (state.currentPage < maxPages) {
                state.currentPage++;
                fetchNews();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        retryBtn.addEventListener('click', () => {
            fetchNews();
        });

        // Reader Modal actions
        closeReaderBtn.addEventListener('click', () => closeModal(readerModal));
        readerBookmarkBtn.addEventListener('click', () => {
            if (activeReaderArticle) {
                toggleBookmark(activeReaderArticle);
                updateReaderBookmarkBtnUI(activeReaderArticle);
            }
        });
        readerShareBtn.addEventListener('click', () => {
            if (activeReaderArticle) {
                shareArticle(activeReaderArticle);
            }
        });
    }

    // --- Drawer / Modal Animations ---
    function openBookmarksDrawer() {
        renderBookmarksList();
        bookmarksDrawer.classList.add('open');
        backdrop.classList.add('show');
    }

    function closeBookmarksDrawer() {
        bookmarksDrawer.classList.remove('open');
        if (!settingsModal.classList.contains('open') && !readerModal.classList.contains('open')) {
            backdrop.classList.remove('show');
        }
    }

    function openModal(modalEl) {
        modalEl.style.display = 'flex';
        backdrop.classList.add('show');
        setTimeout(() => {
            modalEl.classList.add('open');
        }, 10);
    }

    function closeModal(modalEl) {
        modalEl.classList.remove('open');
        if (!bookmarksDrawer.classList.contains('open')) {
            backdrop.classList.remove('show');
        }
        setTimeout(() => {
            modalEl.style.display = 'none';
        }, 300);
    }

    // --- Search Triggers ---
    function triggerSearch() {
        const val = searchInput.value.trim();
        if (val) {
            state.searchQuery = val;
            // Remove active category class
            categoryBtns.forEach(b => b.classList.remove('active'));
            state.currentPage = 1;
            fetchNews();
        } else {
            showToast('🔍 Enter a search term first.');
        }
    }

    // --- News Data Fetching Hub ---
    async function fetchNews() {
        showLoading(true);
        showErrorState(false);

        try {
            if (state.apiProvider === 'demo') {
                loadMockData();
            } else if (state.apiProvider === 'gnews') {
                await fetchGNews();
            } else if (state.apiProvider === 'newsapi') {
                await fetchNewsAPI();
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showErrorState(true, err.message || 'Network connectivity error.');
        } finally {
            showLoading(false);
        }
    }

    function showLoading(show) {
        if (show) {
            loadingState.classList.add('show');
            newsGrid.style.opacity = '0.3';
            newsGrid.style.pointerEvents = 'none';
            paginationBar.style.display = 'none';
        } else {
            loadingState.classList.remove('show');
            newsGrid.style.opacity = '1';
            newsGrid.style.pointerEvents = 'auto';
        }
    }

    function showErrorState(show, message = '') {
        if (show) {
            errorDesc.textContent = message;
            errorState.classList.add('show');
            newsGrid.style.display = 'none';
            paginationBar.style.display = 'none';
        } else {
            errorState.classList.remove('show');
            newsGrid.style.display = 'grid';
        }
    }

    // --- 1. Mock Data Engine ---
    function loadMockData() {
        let baseArticles = [];

        if (state.searchQuery) {
            // Merge all categories and filter by search query
            const query = state.searchQuery.toLowerCase();
            const all = Object.values(mockNews).flat();
            baseArticles = all.filter(art => 
                art.title.toLowerCase().includes(query) || 
                art.description.toLowerCase().includes(query)
            );
        } else {
            // Get category list
            baseArticles = mockNews[state.currentCategory] || [];
        }

        // Apply Sorting simulation
        if (state.currentSortBy === 'popularity') {
            // Mock sort: randomize or reverse
            baseArticles = [...baseArticles].reverse();
        }

        // Slice pagination
        state.totalResults = baseArticles.length;
        const start = (state.currentPage - 1) * articlesPerPage;
        state.articles = baseArticles.slice(start, start + articlesPerPage);

        renderArticles();
        updatePaginationUI();
    }

    // --- 2. GNews API Fetch ---
    async function fetchGNews() {
        if (!state.gnewsKey) {
            throw new Error('GNews API key is missing. Please configure it in Settings.');
        }

        let url = 'https://gnews.io/api/v4/top-headlines?';
        
        if (state.searchQuery) {
            url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(state.searchQuery)}&`;
        } else {
            // gnews categories map directly except minor spelling adjustments
            let cat = state.currentCategory;
            if (cat === 'health') cat = 'health';
            url += `category=${cat}&`;
        }

        url += `lang=en&country=${state.currentCountry}&max=${articlesPerPage}&page=${state.currentPage}&apikey=${state.gnewsKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (res.status !== 200) {
            throw new Error(data.errors ? data.errors.join(', ') : 'GNews request failed.');
        }

        state.totalResults = data.totalArticles || 0;
        state.articles = (data.articles || []).map(art => ({
            title: art.title,
            description: art.description,
            content: art.content || art.description || 'Full article content not available.',
            url: art.url,
            urlToImage: art.image || '',
            publishedAt: art.publishedAt,
            source: { name: art.source.name },
            author: art.source.name
        }));

        renderArticles();
        updatePaginationUI();
    }

    // --- 3. NewsAPI.org Fetch ---
    async function fetchNewsAPI() {
        if (!state.newsapiKey) {
            throw new Error('NewsAPI.org API key is missing. Please configure it in Settings.');
        }

        let url = 'https://newsapi.org/v2/top-headlines?';
        
        if (state.searchQuery) {
            url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(state.searchQuery)}&sortBy=${state.currentSortBy}&`;
        } else {
            url += `category=${state.currentCategory}&country=${state.currentCountry}&`;
        }

        url += `pageSize=${articlesPerPage}&page=${state.currentPage}&apiKey=${state.newsapiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'error') {
            if (data.code === 'corsNotAllowed') {
                throw new Error('NewsAPI CORS restriction: Browsers can only call NewsAPI from localhost on free keys.');
            }
            throw new Error(data.message || 'NewsAPI request failed.');
        }

        state.totalResults = data.totalResults || 0;
        state.articles = (data.articles || []).map(art => ({
            title: art.title,
            description: art.description || 'No description available.',
            content: art.content || art.description || 'No details available.',
            url: art.url,
            urlToImage: art.urlToImage || '',
            publishedAt: art.publishedAt,
            source: { name: art.source.name || 'News Source' },
            author: art.author || ''
        }));

        renderArticles();
        updatePaginationUI();
    }

    // --- Rendering Cards ---
    function renderArticles() {
        newsGrid.innerHTML = '';
        if (state.articles.length === 0) {
            newsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-icon">📂</div>
                    <p>No articles found. Try another category, region, or search keyword.</p>
                </div>
            `;
            return;
        }

        state.articles.forEach((art, idx) => {
            const isSaved = isArticleBookmarked(art);
            const date = new Date(art.publishedAt);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            // Standardize placeholder image
            const img = art.urlToImage || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%231b1b26%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23797993%22 font-family=%22system-ui%22 font-size=%2216%22%3ENewsHub Media%3C/text%3E%3C/svg%3E';

            const card = document.createElement('article');
            card.className = 'news-card';
            card.setAttribute('style', `animation-delay: ${idx * 0.05}s`);
            card.innerHTML = `
                <div class="news-image-wrapper">
                    <img src="${img}" alt="${art.title}" class="news-card-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%231b1b26%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23797993%22 font-family=%22system-ui%22 font-size=%2216%22%3ENewsHub Media%3C/text%3E%3C/svg%3E'">
                    <span class="source-tag">${art.source.name}</span>
                    <div class="news-image-overlay"></div>
                </div>
                <div class="news-card-body">
                    <h3 class="news-card-title">${art.title}</h3>
                    <p class="news-card-description">${art.description}</p>
                    <div class="news-card-footer">
                        <div class="news-date-meta">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span>${dateStr}</span>
                        </div>
                        <div class="card-actions">
                            <button class="card-action-btn share-btn" title="Share Article" data-index="${idx}">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            </button>
                            <button class="card-action-btn bookmark-btn ${isSaved ? 'active' : ''}" title="Bookmark Article" data-index="${idx}">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Card Body Click triggers Full Reader
            card.querySelector('.news-card-title').addEventListener('click', (e) => {
                e.stopPropagation();
                openArticleReader(art);
            });
            card.querySelector('.news-image-wrapper').addEventListener('click', () => {
                openArticleReader(art);
            });
            card.querySelector('.news-card-description').addEventListener('click', (e) => {
                e.stopPropagation();
                openArticleReader(art);
            });

            // Action triggers
            card.querySelector('.bookmark-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleBookmark(art);
                e.currentTarget.classList.toggle('active', isArticleBookmarked(art));
            });

            card.querySelector('.share-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                shareArticle(art);
            });

            newsGrid.appendChild(card);
        });
    }

    // --- Full Article Reader Modal ---
    function openArticleReader(art) {
        activeReaderArticle = art;
        const date = new Date(art.publishedAt);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

        readerSource.textContent = art.source.name;
        readerDate.textContent = dateStr;
        readerTitle.textContent = art.title;

        if (art.author) {
            readerAuthorRow.style.display = 'block';
            readerAuthor.textContent = art.author;
        } else {
            readerAuthorRow.style.display = 'none';
        }

        if (art.urlToImage) {
            readerImgWrapper.style.display = 'block';
            readerImg.src = art.urlToImage;
            readerImg.alt = art.title;
        } else {
            readerImgWrapper.style.display = 'none';
        }

        readerContent.innerHTML = art.content.includes('<br>') ? art.content : `<p>${art.content}</p>`;
        readerSourceLink.href = art.url;

        updateReaderBookmarkBtnUI(art);
        openModal(readerModal);
    }

    function updateReaderBookmarkBtnUI(art) {
        if (isArticleBookmarked(art)) {
            readerBookmarkBtn.classList.add('active');
        } else {
            readerBookmarkBtn.classList.remove('active');
        }
    }

    // --- Bookmarks Drawer Logic ---
    function isArticleBookmarked(art) {
        return state.bookmarks.some(b => b.url === art.url);
    }

    function toggleBookmark(art) {
        if (isArticleBookmarked(art)) {
            state.bookmarks = state.bookmarks.filter(b => b.url !== art.url);
            showToast('🔖 Article removed from bookmarks.');
        } else {
            state.bookmarks.push(art);
            showToast('🔖 Article saved to bookmarks.');
        }
        localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
        updateBookmarkBadge();
        
        // Refresh grids if drawer is active
        if (bookmarksDrawer.classList.contains('open')) {
            renderBookmarksList();
        }
        // Sync cards on feed
        renderArticles();
    }

    function updateBookmarkBadge() {
        const count = state.bookmarks.length;
        bookmarkBadge.textContent = count;
        bookmarkBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    function renderBookmarksList() {
        bookmarksContainer.innerHTML = '';
        if (state.bookmarks.length === 0) {
            bookmarksContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔖</div>
                    <p>No saved articles yet. Bookmark news cards to access them later.</p>
                </div>
            `;
            return;
        }

        state.bookmarks.forEach((art, idx) => {
            const item = document.createElement('div');
            item.className = 'bookmark-item';
            
            const img = art.urlToImage || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%231b1b26%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';

            item.innerHTML = `
                <img src="${img}" alt="${art.title}" class="bookmark-item-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%231b1b26%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
                <div class="bookmark-item-content">
                    <h4 class="bookmark-item-title">${art.title}</h4>
                    <div class="bookmark-item-meta">
                        <span>${art.source.name}</span>
                        <button class="bookmark-remove-btn" title="Remove Bookmark">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            `;

            // Click body to read
            item.addEventListener('click', () => {
                closeBookmarksDrawer();
                openArticleReader(art);
            });

            // Remove button handler
            item.querySelector('.bookmark-remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleBookmark(art);
            });

            bookmarksContainer.appendChild(item);
        });
    }

    // --- Share API Functionality ---
    async function shareArticle(art) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: art.title,
                    text: art.description,
                    url: art.url
                });
                showToast('🚀 Article shared successfully!');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    fallbackCopyUrl(art.url);
                }
            }
        } else {
            fallbackCopyUrl(art.url);
        }
    }

    function fallbackCopyUrl(url) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('🔗 Link copied to clipboard!');
        }).catch(() => {
            showToast('❌ Copy failed. URL: ' + url);
        });
    }

    // --- Pagination Actions ---
    function updatePaginationUI() {
        const totalPages = Math.ceil(state.totalResults / articlesPerPage) || 1;
        pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
        prevBtn.disabled = state.currentPage === 1;
        nextBtn.disabled = state.currentPage >= totalPages;

        if (state.totalResults > 0) {
            paginationBar.style.display = 'flex';
        } else {
            paginationBar.style.display = 'none';
        }
    }

    // --- Global Custom Toast Notification ---
    let toastTimeout;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    // Run Initializer
    init();
}

/* ==========================================================================
   2. CALCULATOR APPLICATION ENGINE
   ========================================================================== */
function initCalculator() {
    // DOM selectors inside Calculator App context
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const clearButton = document.getElementById('clear');
    const deleteButton = document.getElementById('delete');
    const equalsButton = document.getElementById('equals');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-action]');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    function deleteDigit() {
        if (currentOperand === '0') return;
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    function appendNumber(number) {
        if (number === '.' && currentOperand.includes('.')) return;
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number.toString();
        } else {
            currentOperand = currentOperand.toString() + number.toString();
        }
    }

    function chooseOperation(op) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    currentOperand = 'Error';
                    previousOperand = '';
                    operation = undefined;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        currentOperand = parseFloat(computation.toFixed(8)).toString(); // Avoid floating point inaccuracies
        operation = undefined;
        previousOperand = '';
    }

    function getDisplayNumber(number) {
        if (number === 'Error') return 'Error';
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    function updateDisplay() {
        currentOperandElement.textContent = getDisplayNumber(currentOperand);
        if (operation != null) {
            let opSign = operation;
            if (operation === '*') opSign = '×';
            if (operation === '/') opSign = '÷';
            if (operation === '-') opSign = '−';
            previousOperandElement.textContent = `${getDisplayNumber(previousOperand)} ${opSign}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }

    // Button event listeners
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.dataset.number);
            updateDisplay();
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.dataset.action);
            updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        compute();
        updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        clear();
        updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        deleteDigit();
        updateDisplay();
    });

    // Keyboard bindings
    window.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9') {
            appendNumber(event.key);
            updateDisplay();
        }
        if (event.key === '.') {
            appendNumber('.');
            updateDisplay();
        }
        if (['+', '-'].includes(event.key)) {
            chooseOperation(event.key);
            updateDisplay();
        }
        if (event.key === '*') {
            chooseOperation('*');
            updateDisplay();
        }
        if (event.key === '/') {
            chooseOperation('/');
            updateDisplay();
        }
        if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            compute();
            updateDisplay();
        }
        if (event.key === 'Backspace') {
            deleteDigit();
            updateDisplay();
        }
        if (event.key.toLowerCase() === 'c') {
            clear();
            updateDisplay();
        }
    });

    // Initial load sync
    clear();
    updateDisplay();
}
