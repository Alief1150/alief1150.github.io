// Discord API Integration
const DISCORD_USER_ID = '952571759851364373';

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! Your message has been sent. I will contact you soon.');
    this.reset();
});

// Add animation to cards when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.about-card, .project-card, .award-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect after page load
window.addEventListener('load', function() {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const originalText = heroTitle.innerHTML;
        
        // Extract text content while preserving HTML structure
        const textContent = originalText.replace(/<span class="highlight">/g, '').replace(/<\/span>/g, '');
        
        // Clear and start typing
        heroTitle.innerHTML = '';
        let currentIndex = 0;
        const fullText = 'Hello, my name is\nAlief Athallah P.';
        
        function typeText() {
            if (currentIndex < fullText.length) {
                if (fullText[currentIndex] === '\n') {
                    heroTitle.innerHTML += '<br>';
                } else if (currentIndex >= 22) { // Start highlighting from "Alief Athallah P."
                    if (currentIndex === 22) {
                        heroTitle.innerHTML += '<span class="highlight">';
                    }
                    heroTitle.innerHTML += fullText[currentIndex];
                    if (currentIndex === fullText.length - 1) {
                        heroTitle.innerHTML += '</span>';
                    }
                } else {
                    heroTitle.innerHTML += fullText[currentIndex];
                }
                currentIndex++;
                setTimeout(typeText, 80);
            }
        }
        typeText();
    }, 1000);
});

// Add parallax effect to decorative dots
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.decoration-dots');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.2);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Discord API Functions
async function fetchDiscordStatus() {
    try {
        // Using Lanyard API to get Discord status
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            updateDiscordUI(data.data);
        } else {
            showDiscordOffline();
        }
    } catch (error) {
        console.log('Discord API error:', error);
        showDiscordOffline();
    }
}

function updateDiscordUI(discordData) {
    const usernameElement = document.getElementById('discordUsername');
    const activityElement = document.getElementById('discordActivity');
    const avatarElement = document.getElementById('discordAvatar');
    const statusIndicator = document.getElementById('statusIndicator');
    
    // Update username
    if (discordData.discord_user) {
        usernameElement.textContent = discordData.discord_user.display_name || discordData.discord_user.username;
        
        // Update avatar
        if (discordData.discord_user.avatar) {
            const avatarUrl = `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png?size=128`;
            avatarElement.style.backgroundImage = `url(${avatarUrl})`;
        }
    }
    
    // Update status
    const status = discordData.discord_status || 'offline';
    statusIndicator.className = `discord-status-indicator ${status}`;
    
    // Update activity
    if (discordData.activities && discordData.activities.length > 0) {
        const activity = discordData.activities.find(a => a.type !== 4) || discordData.activities[0]; // Exclude custom status
        
        if (activity) {
            switch (activity.type) {
                case 0: // Playing
                    activityElement.textContent = `Playing ${activity.name}`;
                    break;
                case 1: // Streaming
                    activityElement.textContent = `Streaming ${activity.details || activity.name}`;
                    break;
                case 2: // Listening
                    if (activity.name === 'Spotify') {
                        activityElement.textContent = `Listening to ${activity.details} by ${activity.state}`;
                    } else {
                        activityElement.textContent = `Listening to ${activity.name}`;
                    }
                    break;
                case 3: // Watching
                    activityElement.textContent = `Watching ${activity.name}`;
                    break;
                case 5: // Competing
                    activityElement.textContent = `Competing in ${activity.name}`;
                    break;
                default:
                    activityElement.textContent = activity.details || activity.state || `Using ${activity.name}`;
            }
        } else {
            activityElement.textContent = getStatusText(status);
        }
    } else {
        activityElement.textContent = getStatusText(status);
    }
}

function getStatusText(status) {
    switch (status) {
        case 'online':
            return 'Online';
        case 'idle':
            return 'Away';
        case 'dnd':
            return 'Do Not Disturb';
        case 'offline':
        default:
            return 'Offline';
    }
}

function showDiscordOffline() {
    const usernameElement = document.getElementById('discordUsername');
    const activityElement = document.getElementById('discordActivity');
    const statusIndicator = document.getElementById('statusIndicator');
    
    usernameElement.textContent = 'Alief Athallah P.';
    activityElement.textContent = 'Discord status unavailable';
    statusIndicator.className = 'discord-status-indicator offline';
}

// Initialize Discord status on page load
document.addEventListener('DOMContentLoaded', function() {
    // Fetch Discord status
    fetchDiscordStatus();
    
    // Update Discord status every 30 seconds
    setInterval(fetchDiscordStatus, 30000);
});

// Smooth scroll behavior for internal links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Add click handlers for navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Add active nav link on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add loading animation for Discord card
function showDiscordLoading() {
    const usernameElement = document.getElementById('discordUsername');
    const activityElement = document.getElementById('discordActivity');
    
    usernameElement.textContent = 'Loading...';
    activityElement.textContent = 'Checking Discord status...';
}

// Initialize loading state
document.addEventListener('DOMContentLoaded', function() {
    showDiscordLoading();
});

// Add hover effects for project cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.project-card, .award-card, .about-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add button click animations
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn, .social-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Enhanced mobile menu (for future implementation)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--primary-yellow) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(rippleStyle);

// Discord Copy Button

// Fungsi untuk copy Discord username dengan pop-up khusus
function copyDiscordUsername() {
    const username = '_hankv2';
    
    navigator.clipboard.writeText(username).then(() => {
        showDiscordPopup();
    }).catch(() => {
        // Fallback untuk browser lama
        const textArea = document.createElement('textarea');
        textArea.value = username;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showDiscordPopup();
    });
}

// Fungsi untuk menampilkan pop-up Discord khusus
function showDiscordPopup() {
    // Hapus pop-up yang ada
    const existingPopup = document.querySelector('.discord-popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Buat overlay
    const overlay = document.createElement('div');
    overlay.className = 'discord-popup-overlay';
    
    // Buat pop-up
    const popup = document.createElement('div');
    popup.className = 'discord-popup';
    popup.innerHTML = `
        <div class="discord-popup-icon">💬</div>
        <h3 class="discord-popup-title">Discord Username Copied!</h3>
        <p class="discord-popup-text">Username has been copied to your clipboard</p>
        <div class="discord-popup-username">_hankv2</div>
        <button class="discord-popup-close" onclick="closeDiscordPopup()">Got it!</button>
    `;
    
    // Tambahkan ke DOM
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Animasi masuk
    setTimeout(() => {
        overlay.classList.add('show');
        popup.classList.add('show');
    }, 100);
    
    // Auto close setelah 5 detik
    setTimeout(() => {
        closeDiscordPopup();
    }, 5000);
    
    // Close saat klik overlay
    overlay.addEventListener('click', closeDiscordPopup);
    
    // Close dengan ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeDiscordPopup();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Fungsi untuk menutup pop-up Discord
function closeDiscordPopup() {
    const overlay = document.querySelector('.discord-popup-overlay');
    const popup = document.querySelector('.discord-popup');
    
    if (overlay && popup) {
        overlay.classList.remove('show');
        popup.classList.remove('show');
        
        setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
            if (popup.parentNode) popup.remove();
        }, 300);
    }
}

// Hubungkan fungsi lama dengan yang baru
document.addEventListener('DOMContentLoaded', function() {
    // Cari button yang ada
    const copyBtn = document.getElementById('copyUsernameBtn');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyDiscordUsername(); // Panggil fungsi pop-up yang sudah dibuat
        });
    }
});