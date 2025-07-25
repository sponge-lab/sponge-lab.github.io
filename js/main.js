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

// Utility function to format publication data
function formatPublication(publication) {
  return `
    <li>
      <div class="publication-title">${publication.title}</div>
      <div class="publication-authors">${publication.authors}</div>
      <div class="publication-venue">${publication.venue}</div>
      ${publication.link ? `<a href="${publication.link}" class="link" target="_blank">View Paper</a>` : ''}
    </li>
  `;
}

// Function to load and display publications dynamically
function loadPublications(publications) {
  const publicationList = document.getElementById('publication-list');
  if (publicationList && publications) {
    publicationList.innerHTML = publications.map(formatPublication).join('');
  }
}