// global-scripts.js - FIXED VERSION

// --- Wait for DOM to be ready ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mobile Menu Toggle - FIXED ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        console.log('Mobile menu elements found, setting up event listeners');
        
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Mobile menu button clicked');
            
            // Toggle the hidden class and show class
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenu.classList.add('show');
                }, 10); // Small delay for smooth animation
            } else {
                mobileMenu.classList.remove('show');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300); // Wait for animation to complete
            }
            
            // Update button icon
            const svg = mobileMenuButton.querySelector('svg path');
            if (svg) {
                if (isHidden) {
                    // Change to X icon
                    svg.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                } else {
                    // Change back to hamburger
                    svg.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                }
            }
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('show');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                
                // Reset button icon
                const svg = mobileMenuButton.querySelector('svg path');
                if (svg) {
                    svg.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.remove('show');
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 300);
                    
                    // Reset button icon
                    const svg = mobileMenuButton.querySelector('svg path');
                    if (svg) {
                        svg.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                    }
                }
            }
        });
    } else {
        console.log('Mobile menu elements not found');
    }

    // --- Smooth Scrolling for Anchor Links ---
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

    // --- Scroll-in Animations ---
    const animatedElements = document.querySelectorAll('.fade-in-up');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

}); // End DOMContentLoaded

// --- Particle Cursor Effect ---
// This runs after DOM is loaded to ensure canvas exists
window.addEventListener('load', function() {
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        console.log('Initializing particle effect');
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Set canvas styles explicitly
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';

        let particles = [];
        const mouse = { x: null, y: null };
        
        // Purple color palette to match site theme
        const colors = ['#d946ef', '#a855f7', '#e879f9'];

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
            // Reduced particle spawn rate for minimalist feel
            if (particles.length < 30 && Math.random() > 0.7) {
                particles.push(new Particle());
            }
        });
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = mouse.x;
                this.y = mouse.y;
                this.size = Math.random() * 4 + 2; // Slightly larger base size
                this.speedX = (Math.random() * 0.4 - 0.2); // Slower movement
                this.speedY = (Math.random() * 0.4 - 0.2);
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.life = 0;
                this.maxLife = Math.random() * 100 + 150; // Longer lifespan
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.sides = Math.floor(Math.random() * 3) + 3; // 3-5 sides
                this.angleVariation = Math.random() * 0.3 + 0.7; // For irregular polygons
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                this.life++;
                // Gentle drift effect
                this.speedY += 0.002;
            }
            
            draw() {
                const opacity = Math.max(0, 1 - (this.life / this.maxLife));
                ctx.globalAlpha = opacity * 0.3; // Slightly more visible for vibrant purple
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;
                
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                ctx.beginPath();
                for (let i = 0; i < this.sides; i++) {
                    const angle = (i / this.sides) * Math.PI * 2;
                    const radius = this.size * (this.angleVariation + Math.random() * 0.3);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.stroke();
                
                // Add glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.stroke();
                ctx.shadowBlur = 0;
                
                // Optional: add a subtle fill
                ctx.globalAlpha = opacity * 0.1;
                ctx.fillStyle = this.color;
                ctx.fill();
                
                ctx.restore();
                ctx.globalAlpha = 1;
            }
        }

        function handleParticles() {
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life >= particles[i].maxLife) {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleParticles();
            requestAnimationFrame(animate);
        }

        animate();
        
        // Debug log to confirm particle effect is running
        console.log('Particle effect initialized on:', window.location.pathname);
    } else {
        console.log('Particle canvas not found');
    }
});