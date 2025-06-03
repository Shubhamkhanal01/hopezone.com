document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Prevent body scrolling when menu is open
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Restore body scrolling when menu is closed
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Restore body scrolling
                document.body.style.overflow = '';
            }
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Restore body scrolling
                document.body.style.overflow = '';
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Skip empty anchors
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Adjust scroll position for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    // Restore body scrolling
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Set current year in footer
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Add active class to current navigation item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-menu a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Handle window resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        // Debounce resize events
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on window resize (especially when switching from mobile to desktop)
            if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Restore body scrolling
                document.body.style.overflow = '';
            }
            
            // Adjust any height-dependent elements
            adjustResponsiveElements();
        }, 250);
    });
    
    // Function to adjust responsive elements
    function adjustResponsiveElements() {
        // Adjust game cards to have equal height in the same row
        const gameCards = document.querySelectorAll('.game-card');
        if (gameCards.length > 0 && window.innerWidth > 576) {
            // Reset heights first
            gameCards.forEach(card => {
                card.querySelector('.game-details').style.height = 'auto';
            });
            
            // Group cards by rows
            const cardRows = {};
            gameCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const row = Math.floor(rect.top);
                if (!cardRows[row]) cardRows[row] = [];
                cardRows[row].push(card);
            });
            
            // Set equal heights for cards in the same row
            Object.values(cardRows).forEach(rowCards => {
                let maxHeight = 0;
                rowCards.forEach(card => {
                    const detailsHeight = card.querySelector('.game-details').offsetHeight;
                    maxHeight = Math.max(maxHeight, detailsHeight);
                });
                rowCards.forEach(card => {
                    card.querySelector('.game-details').style.height = maxHeight + 'px';
                });
            });
        }
    }
    
    // Initial adjustment
    adjustResponsiveElements();
});