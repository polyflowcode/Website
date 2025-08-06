// global-scripts.js

// --- Mobile Menu Toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}


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


// --- Particle Cursor Effect ---
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
}