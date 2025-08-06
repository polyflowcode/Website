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
    const colors = ['#a78bfa', '#60a5fa', '#f472b6'];

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
        if (particles.length < 100) { // Limit total particles
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
            // UPDATED: Particles are slightly smaller
            this.size = Math.random() * 1 + 1;
            this.speedX = (Math.random() * 1 - 0.5) * 0.8;
            this.speedY = (Math.random() * 1 - 0.5) * 0.8;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = 0;
            this.maxLife = Math.random() * 60 + 40;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;
        }
        draw() {
            // UPDATED: Reduced the opacity multiplier from 0.6 to 0.4 for a dimmer trail
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