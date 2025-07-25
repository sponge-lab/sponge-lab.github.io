// Sponge Computing Lab - Main JavaScript

// Function to toggle mobile menu
function toggleMenu() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('show');
}

// Function to load HTML includes
async function loadInclude(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (response.ok) {
      const html = await response.text();
      document.getElementById(elementId).innerHTML = html;
    } else {
      console.error(`Failed to load ${filePath}`);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

// Function to highlight current page in navigation
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('#navbar a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('active');
    
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Function to format a single news item
function formatNewsItem(newsItem) {
  return `
    <div class="news-item">
      <div class="news-date">${newsItem.date}</div>
      <div class="news-title">${newsItem.title}</div>
      <div class="news-content">${newsItem.content}</div>
      <a href="${newsItem.link}" class="news-link">${newsItem.linkText} →</a>
    </div>
  `;
}

// Function to load and display news from JSON
async function loadNews(maxItems = 4) {
  const newsGrid = document.getElementById('news-grid');
  const newsGridFull = document.getElementById('news-grid-full');
  const targetGrid = newsGrid || newsGridFull;
  
  if (!targetGrid) return;

  try {
    // Show loading state
    targetGrid.innerHTML = `
      <div class="news-item">
        <div class="news-title">Loading news...</div>
        <div class="news-content">Please wait while we load the latest updates.</div>
      </div>
    `;

    // Load news data from JSON file
    const response = await fetch('data/news.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const newsData = await response.json();
    
    if (newsData && Array.isArray(newsData)) {
      // Take only the specified number of most recent items
      const itemsToShow = maxItems === 999 ? newsData : newsData.slice(0, maxItems);
      targetGrid.innerHTML = itemsToShow.map(formatNewsItem).join('');
    } else {
      throw new Error('Invalid news data format');
    }
    
  } catch (error) {
    console.error('Error loading news:', error);
    
    // Fallback: show sample news or error message
    targetGrid.innerHTML = `
      <div class="news-item">
        <div class="news-date">July 2025</div>
        <div class="news-title">Welcome to Our Lab!</div>
        <div class="news-content">Stay tuned for the latest updates from the Sponge Computing Lab. We'll be sharing news about our research, publications, and opportunities soon!</div>
        <a href="research.html" class="news-link">Learn More →</a>
      </div>
      <div class="news-item">
        <div class="news-date">July 2025</div>
        <div class="news-title">We're Hiring!</div>
        <div class="news-content">We are looking for passionate PhD and MPhil students to join our research team. Check out our open positions and application process.</div>
        <a href="join.html" class="news-link">Join Us →</a>
      </div>
    `;
  }
}

// Utility function to format publication data
function formatPublication(publication) {
  const titleElement = publication.link 
    ? `<a href="${publication.link}" class="publication-title-link" target="_blank">${publication.title}</a>`
    : `<span class="publication-title">${publication.title}</span>`;
    
  return `
    <li>
      <div class="publication-title">${titleElement}</div>
      <div class="publication-authors">${publication.authors}</div>
      <div class="publication-venue">${publication.venue}</div>
    </li>
  `;
}

// Function to group publications by year
function groupPublicationsByYear(publications) {
  const grouped = {};
  publications.forEach(pub => {
    if (!grouped[pub.year]) {
      grouped[pub.year] = [];
    }
    grouped[pub.year].push(pub);
  });
  return grouped;
}

// Function to load and display publications dynamically
async function loadPublications() {
  const publicationContainer = document.getElementById('publications-container');
  
  if (!publicationContainer) return;

  try {
    // Show loading state
    publicationContainer.innerHTML = `
      <div class="content-section">
        <h3>Loading publications...</h3>
        <p>Please wait while we load the latest publications.</p>
      </div>
    `;

    // Load publications data from JSON file
    const response = await fetch('data/publications.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const publicationsData = await response.json();
    
    if (publicationsData && Array.isArray(publicationsData)) {
      // Group publications by year
      const groupedPubs = groupPublicationsByYear(publicationsData);
      
      // Sort years in descending order (most recent first)
      const sortedYears = Object.keys(groupedPubs).sort((a, b) => {
        // Handle special cases like "Patent"
        if (a === "Patent") return 1;
        if (b === "Patent") return 1;
        return parseInt(b) - parseInt(a);
      });
      
      // Generate HTML for each year group
      let html = '';
      sortedYears.forEach(year => {
        const yearLabel = year === "Patent" ? "Patents & Preprints" : year;
        html += `
          <div class="content-section">
            <h3>${yearLabel}</h3>
            <ul class="publication-list">
              ${groupedPubs[year].map(formatPublication).join('')}
            </ul>
          </div>
        `;
      });
      
      publicationContainer.innerHTML = html;
    } else {
      throw new Error('Invalid publications data format');
    }
    
  } catch (error) {
    console.error('Error loading publications:', error);
    
    // Fallback: show sample publications
    publicationContainer.innerHTML = `
      <div class="content-section">
        <h3>2025</h3>
        <ul class="publication-list">
          <li>
            <div class="publication-title">Publications will be loaded automatically</div>
            <div class="publication-authors">Please check back soon for updates</div>
            <div class="publication-venue">Sponge Computing Lab @ HKUST</div>
          </li>
        </ul>
      </div>
    `;
  }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load header and footer includes if they exist
  const headerElement = document.getElementById('header-include');
  const footerElement = document.getElementById('footer-include');
  
  if (headerElement) {
    loadInclude('header-include', 'includes/header.html');
  }
  
  if (footerElement) {
    loadInclude('footer-include', 'includes/footer.html').then(() => {
      // Highlight current page after header is loaded
      setTimeout(highlightCurrentPage, 100);
    });
  } else {
    // If no includes, highlight current page immediately
    highlightCurrentPage();
  }

  // Load publications immediately when DOM is ready (for publications page)
  const publicationsContainer = document.getElementById('publications-container');
  if (publicationsContainer) {
    loadPublications();
  }

  // Load news immediately when DOM is ready
  const newsGrid = document.getElementById('news-grid');
  const newsGridFull = document.getElementById('news-grid-full');
  
  if (newsGrid) {
    // Homepage: Show 4 most recent news items
    loadNews(3);
  } else if (newsGridFull) {
    // News page: Show all news items
    loadNews(9999);
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navbar && menuToggle && !navbar.contains(event.target) && !menuToggle.contains(event.target)) {
      navbar.classList.remove('show');
    }
  });
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});