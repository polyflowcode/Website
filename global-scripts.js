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
    
    // UPDATED: Forcing all particles to be a single, darker color.
    const colors = ['#a78bfa']; // Only violet particles

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
        if (particles.length < 100) {
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
            this.size = Math.random() * 1.5 + 1; 
            this.speedX = (Math.random() * 1 - 0.5) * 0.6;
            this.speedY = (Math.random() * 1 - 0.5) * 0.6;
            this.color = colors[0]; // Always use the first (and only) color
            this.life = 0;
            this.maxLife = Math.random() * 60 + 40;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;
        }
        draw() {
            ctx.globalAlpha = (1 - (this.life / this.maxLife)) * 0.4;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
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
}