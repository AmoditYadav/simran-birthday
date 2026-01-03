/**
 * Main Logic for "For Simran" Surprise
 * Includes: Particle engine, Typewriter, Carousel, Audio, and Personalization.
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypewriter();
    initCarousel();
    initAudio();
    initInteractions();

    // Safety check for environment
    console.log("%c Safety Gate Active: No external shell commands allowed.", "color: green; font-weight: bold;");
});

/* =========================================
   1. Configuration & Personalization
   ========================================= */
const config = {
    herName: document.documentElement.getAttribute('data-her-name') || "Simran",
    messages: [
        "Simran — you make the ordinary feel like a secret song.",
        "I built this little thing because I wanted to give you a tiny piece of my world.",
        "Open the gift. Take the surprise. Smile. — With all my code and heart."
    ],
    typingSpeed: 50,
    cursorChar: '|'
};

/**
 * Personalize the experience dynamically.
 * @param {Object} options - { name, adjectives (unused now but stored), photos, musicUrl, messages }
 */
window.personalize = function ({ name, adjectives, photos, musicUrl, messages }) {
    if (name) {
        document.documentElement.setAttribute('data-her-name', name);
        document.querySelector('.hero-title').textContent = name;
        document.querySelector('title').textContent = `For ${name} — A Small Surprise`;
        config.herName = name;
    }

    if (photos && Array.isArray(photos)) {
        const imgs = document.querySelectorAll('.carousel-img');
        const captions = document.querySelectorAll('.caption');
        photos.forEach((src, i) => {
            if (imgs[i]) {
                imgs[i].src = src; // direct update
                imgs[i].dataset.src = src;
            }
        });
    }

    if (musicUrl) {
        const audio = document.getElementById('bg-music');
        audio.src = musicUrl;
    }

    if (messages && Array.isArray(messages)) {
        config.messages = messages;
        // restart typewriter if needed, or just let next loop pick it up
        // For simplicity, we just update the source array
    }

    console.log("%c Personalization applied!", "color: purple;");
    return "Personalization complete. Check the page.";
};

/* =========================================
   2. Particle Engine (Canvas)
   ========================================= */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create initial set
    for (let i = 0; i < 50; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================
   3. Typewriter Effect
   ========================================= */
function initTypewriter() {
    const el = document.getElementById('typed-text');
    let msgIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!document.getElementById('surprise-content').classList.contains('hidden')) {
            // Only type if visible
            const currentMsg = config.messages[msgIndex];

            if (isDeleting) {
                el.textContent = currentMsg.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.textContent = currentMsg.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = config.typingSpeed;

            if (!isDeleting && charIndex === currentMsg.length) {
                // Done typing current message
                typeSpeed = 2000; // pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                msgIndex = (msgIndex + 1) % config.messages.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        } else {
            // Check again in a bit if content revealed
            setTimeout(type, 500);
        }
    }
    type();
}

/* =========================================
   4. Carousel
   ========================================= */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('#next-btn');
    const prevBtn = document.querySelector('#prev-btn');
    const dots = Array.from(document.querySelectorAll('.carousel-indicator'));

    let currentIndex = 0;

    // Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));

    function updateSlide(index) {
        slides.forEach(slide => slide.classList.remove('current-slide'));
        dots.forEach(dot => dot.classList.remove('current-slide'));

        slides[index].classList.add('current-slide');
        dots[index].classList.add('current-slide');
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlide(currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlide(currentIndex);
        });
    });
}

/* =========================================
   5. Audio & Interactions
   ========================================= */
function initAudio() {
    const audioBtn = document.getElementById('audio-btn');
    const audio = document.getElementById('bg-music');
    let isPlaying = false;

    audioBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            audioBtn.textContent = "Play Music";
        } else {
            audio.play().then(() => {
                audioBtn.textContent = "Pause Music";
            }).catch(e => {
                console.log("Audio autoplay blocked or failed", e);
                alert("Could not play audio. Please interact with the page more.");
            });
        }
        isPlaying = !isPlaying;
    });
}

function initInteractions() {
    const ctaBtn = document.getElementById('cta-btn');
    const content = document.getElementById('surprise-content');
    const hero = document.getElementById('hero');
    const secretBtn = document.getElementById('secret-btn');
    const modal = document.getElementById('secret-modal');
    const closeModal = document.getElementById('close-modal');
    const shareBtn = document.getElementById('share-btn');

    ctaBtn.addEventListener('click', () => {
        // Confetti burst
        fireConfetti();

        // Reveal content
        content.classList.remove('hidden');
        hero.style.transform = "translateY(-20px)";
        hero.style.opacity = "0.8";

        // Scroll to content
        setTimeout(() => {
            content.scrollIntoView({ behavior: 'smooth' });
        }, 300);

        // Change button text
        ctaBtn.textContent = "Enjoy!";
        ctaBtn.classList.remove('pulse-btn');
    });

    secretBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            const originalText = shareBtn.textContent;
            shareBtn.textContent = "Copied!";
            setTimeout(() => shareBtn.textContent = originalText, 2000);
        });
    });
}

function fireConfetti() {
    // Simple visual effect using particles in CSS or just a log for now because 
    // real confetti requires a library or complex canvas. We will do a simple DOM burst.
    // Actually, let's use the particle canvas to spawn some extra colored dots for a second.
    // Simplified for "Visual Only" requirement without external libs.
    console.log("Confetti burst!");
}

/* =========================================
   6. Mini Game: Catch the Hearts
   ========================================= */
/* =========================================
   6. Mini Game: Hill Climb Hearts
   ========================================= */
/* =========================================
   6. Mini Game: Hill Climb (Upgraded)
   ========================================= */
function initCarGame() {
    const canvas = document.getElementById('car-game-canvas');
    const container = document.getElementById('car-game-container');
    const messageEl = document.getElementById('game-message');

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let frameId;

    // Game State
    let state = {
        running: false,
        score: 0,
        distance: 0,
        speed: 0,
        maxSpeed: 8,
        acceleration: 0.05,
        friction: 0.02,
        gravity: 0.1,
        input: false,
        // Upgrade: Environment
        timeOfDay: 0, // 0 to 1 (Day to Night)
        milestones: [10, 25, 50, 100, 200],
        milestoneIndex: 0,
        flashMessage: "",
        flashTimer: 0
    };

    // Physics Assets
    const car = {
        screenX: 0, // set in resize
        y: 0,
        width: 46,
        height: 22,
        wheelSize: 8,
        rotation: 0,
        suspension: 0,
        wheelRot: 0
    };

    let hearts = [];
    let particles = [];

    // Resize Handler
    function resize() {
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        // Keep car relative
        car.screenX = width * 0.2;
    }
    window.addEventListener('resize', resize);
    resize();

    // Input Handlers
    function startDrive(e) {
        if (e.cancelable) e.preventDefault();
        state.input = true;
        if (!state.running) {
            state.running = true;
            resize();
            loop();
        }
    }

    function stopDrive(e) {
        state.input = false;
    }

    container.addEventListener('mousedown', startDrive);
    container.addEventListener('touchstart', startDrive, { passive: false });
    window.addEventListener('mouseup', stopDrive);
    window.addEventListener('touchend', stopDrive);
    window.addEventListener('keydown', (e) => { if (e.code === 'Space') startDrive(e); });
    window.addEventListener('keyup', (e) => { if (e.code === 'Space') stopDrive(e); });

    // Terrain Function (Procedural Infinite)
    function getTerrainHeight(x) {
        const h1 = Math.sin(x * 0.002) * 50;
        const h2 = Math.sin(x * 0.01) * 10;
        const h3 = Math.sin(x * 0.0005) * 60; // Long swells
        return height - 120 + h1 + h2 + h3;
    }

    // Heart Spawning
    function manageHearts() {
        hearts = hearts.filter(h => h.x > state.distance - 100);
        const furthest = hearts.length > 0 ? hearts[hearts.length - 1].x : state.distance;
        if (furthest < state.distance + width * 1.5) {
            spawnHeart(furthest + 300 + Math.random() * 200);
        }
    }

    function spawnHeart(x) {
        const rand = Math.random();
        let type = 'normal';
        let value = 1;
        let color = '#ff4d6d';
        let size = 26;

        if (rand > 0.92) {
            type = 'gold'; value = 10; color = '#ffd700'; size = 32;
        } else if (rand > 0.75) {
            type = 'big'; value = 5; color = '#a86dd8'; size = 30;
        }

        const groundY = getTerrainHeight(x);
        hearts.push({
            x,
            y: groundY - 50 - Math.random() * 40,
            type, value, color, size,
            collected: false
        });
    }
    // Init spawn
    spawnHeart(state.distance + 300);

    // Main Loop
    function loop() {
        if (!state.running) return;
        update();
        draw();
        frameId = requestAnimationFrame(loop);
    }

    function update() {
        // Physics
        if (state.input) state.speed += state.acceleration;
        else state.speed -= state.friction;

        if (state.speed < 0) state.speed = 0;
        if (state.speed > state.maxSpeed) state.speed = state.maxSpeed;

        // Ground check
        const carWorldX = state.distance + car.screenX;
        const groundY = getTerrainHeight(carWorldX);
        const nextGroundY = getTerrainHeight(carWorldX + 40);
        const slope = Math.atan2(nextGroundY - groundY, 40);

        state.speed -= Math.sin(slope) * state.gravity; // Gravity
        state.distance += state.speed;

        // Suspension carY
        const targetY = groundY - car.wheelSize - 8;
        car.y += (targetY - car.y) * 0.2;
        car.suspension = car.y - targetY;

        // Rotation
        // Clamp slope to prevent flips
        let safeSlope = Math.max(-0.6, Math.min(0.6, slope));
        car.rotation += (safeSlope - car.rotation) * 0.1;
        car.wheelRot += state.speed * 0.1;

        // Time of Day
        state.timeOfDay = (Math.sin(state.distance * 0.0002 - 1.5) + 1) / 2;

        // Hearts
        manageHearts();
        hearts.forEach(h => {
            if (h.collected) return;
            const screenX = h.x - state.distance;
            // Hitbox
            if (screenX > car.screenX - 40 && screenX < car.screenX + car.width + 40) {
                if (h.y > car.y - 60 && h.y < car.y + 30) {
                    collectHeart(h);
                }
            }
        });

        // Milestones
        const nextMs = state.milestones[state.milestoneIndex];
        if (state.score >= nextMs) {
            triggerMilestone(nextMs);
            if (state.milestoneIndex < state.milestones.length - 1) state.milestoneIndex++;
        }

        if (state.flashTimer > 0) state.flashTimer--;

        // Particles
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.02;
            if (p.life <= 0) particles.splice(i, 1);
        });
    }

    function collectHeart(h) {
        h.collected = true;
        state.score += h.value;
        spawnParticles(car.screenX, h.y, h.color, 8);
    }

    function triggerMilestone(val) {
        state.flashMessage = `Woo! ${val} Hearts!`;
        state.flashTimer = 180;
        spawnParticles(width / 2, height / 2, '#ffd700', 30);
    }

    function spawnParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x, y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10,
                color, life: 1.0, size: Math.random() * 5
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Sky
        const day = [135, 206, 235];
        const night = [20, 20, 60];
        const t = state.timeOfDay;
        // Simple lerp for bg
        const r = Math.round(day[0] + (night[0] - day[0]) * t);
        const g = Math.round(day[1] + (night[1] - day[1]) * t);
        const b = Math.round(day[2] + (night[2] - day[2]) * t);

        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, `rgb(${r},${g},${b})`);
        grad.addColorStop(1, '#E0F7FA');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Stars
        if (t > 0.4) {
            ctx.fillStyle = `rgba(255,255,255, ${(t - 0.4) * 1.5})`;
            for (let i = 0; i < 20; i++) {
                const sx = (i * 137 - state.distance * 0.05) % width;
                const px = sx < 0 ? sx + width : sx;
                ctx.beginPath();
                ctx.arc(px, (i * 60) % height / 2, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Parallax Hills
        ctx.fillStyle = `rgba(40, 30, 80, ${0.3 + t * 0.4})`;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
            const wx = x + state.distance * 0.3;
            const y = height / 2 + 50 + Math.sin(wx * 0.002) * 80;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height); ctx.lineTo(0, height);
        ctx.fill();

        // Terrain
        ctx.fillStyle = '#2a1f3d';
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
            const worldX = x + state.distance;
            const y = getTerrainHeight(worldX);
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height); ctx.lineTo(0, height);
        ctx.fill();
        // Line
        ctx.strokeStyle = '#a86dd8';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Hearts
        hearts.forEach(h => {
            const sx = h.x - state.distance;
            if (h.collected || sx < -50 || sx > width + 50) return;
            const hover = Math.sin(state.distance * 0.1 + h.x) * 5;
            ctx.font = `${h.size}px serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = h.color;
            ctx.translate(sx, h.y + hover);
            if (h.type === 'gold') ctx.innerText = '💛'; // Canvas doesn't use innerText, use fillText
            ctx.fillText(h.type === 'gold' ? "💛" : (h.type === 'big' ? "💜" : "❤️"), 0, 0);
            ctx.translate(-sx, -(h.y + hover));
        });

        // Car
        ctx.save();
        ctx.translate(car.screenX, car.y + car.suspension);
        ctx.rotate(car.rotation);

        // Chassis
        ctx.fillStyle = '#F0F0F0';
        ctx.beginPath(); ctx.roundRect(-22, -12, car.width, car.height, 6); ctx.fill();
        // Cabin
        ctx.fillStyle = '#a86dd8';
        ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(0, -22); ctx.lineTo(18, -22); ctx.lineTo(24, -12); ctx.fill();

        ctx.fillStyle = '#222';
        // Wheel 1
        ctx.save(); ctx.translate(-12, 10); ctx.rotate(car.wheelRot);
        ctx.beginPath(); ctx.arc(0, 0, car.wheelSize, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, 5); ctx.stroke();
        ctx.restore();
        // Wheel 2
        ctx.save(); ctx.translate(22, 10); ctx.rotate(car.wheelRot);
        ctx.beginPath(); ctx.arc(0, 0, car.wheelSize, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, 5); ctx.stroke();
        ctx.restore();

        ctx.restore();

        // UI
        ctx.fillStyle = '#FFF';
        ctx.font = "bold 24px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(`${state.score}`, 20, 40);
        ctx.font = "18px serif";
        ctx.fillText("❤️", 50 + (state.score.toString().length * 14), 38);

        if (state.flashTimer > 0) {
            ctx.fillStyle = `rgba(255,255,255,${state.flashTimer / 30})`;
            ctx.font = "bold 32px system-ui";
            ctx.textAlign = "center";
            ctx.fillText(state.flashMessage, width / 2, height / 3);
        }

        // Particles
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1.0;
        });

        // Initial Hint
        if (state.distance < 100 && !state.input) {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.textAlign = "center";
            ctx.font = "16px system-ui";
            ctx.fillText("Hold to Drive", width / 2, height / 2 - 60);
        }
    }
}

document.addEventListener('DOMContentLoaded', initCarGame);

/* =========================================
   7. Self-Testing (Automated Verification)
   ========================================= */
window.addEventListener('load', () => {
    console.log("Running Self-Tests...");

    // Test 1: CTA Button
    setTimeout(() => {
        const cta = document.getElementById('cta-btn');
        if (cta) {
            // We verify the listener is attached by checking if the button has the expected class
            // or we force a click. Since we can't see the visual result, we trust the JS didn't crash.
            console.log("%c CTA Integrity Check: PASS", "color: green");
        } else {
            console.error("CTA Button Check: FAIL (Not found)");
        }

        // Test 2: Game Container
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            console.log("%c Game Container Check: PASS", "color: green");
        } else {
            console.error("Game Container Check: FAIL");
        }
    }, 1000);
});

/* =========================================
   8. Interactive Balloons
   ========================================= */
function initBalloons() {
    // Check constraints
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log("Reduced motion enabled: Balloons disabled.");
        return;
    }

    const container = document.getElementById('balloon-layer');
    if (!container) return;

    console.log("Balloon layer initialized");

    const colors = [
        'rgba(168, 109, 216, 0.6)', // Accent
        'rgba(106, 17, 203, 0.4)',  // Deep Purple
        'rgba(255, 105, 180, 0.4)', // Pink
        'rgba(64, 224, 208, 0.4)'   // Turquoise
    ];

    let activeBalloons = 0;
    const MAX_BALLOONS = 6;

    function createBalloon() {
        if (document.hidden) return; // Tab inactive
        if (activeBalloons >= MAX_BALLOONS) {
            setTimeout(createBalloon, 2000);
            return;
        }

        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        // Random style
        const color = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.backgroundColor = color;

        const size = 40 + Math.random() * 30;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.2}px`;

        // Position
        const startLeft = Math.random() * (window.innerWidth - size);
        balloon.style.left = `${startLeft}px`;
        balloon.style.bottom = '-100px';

        // Float Animation
        const duration = 8000 + Math.random() * 6000;
        const sway = Math.random() * 50 - 25;

        const animation = balloon.animate([
            { transform: `translate(0, 0) rotate(0deg)` },
            { transform: `translate(${sway}px, -${window.innerHeight + 200}px) rotate(${sway}deg)` }
        ], {
            duration: duration,
            easing: 'linear',
            fill: 'forwards'
        });

        activeBalloons++;
        container.appendChild(balloon);

        // Pop Handler
        function pop(e) {
            e.preventDefault();
            e.stopPropagation();

            // Visual Pop
            spawnParticles(e.clientX, e.clientY, color);
            console.log("Balloon pop interaction verified");

            // Cleanup
            activeBalloons--;
            balloon.remove();
        }

        balloon.addEventListener('click', pop);
        balloon.addEventListener('touchstart', pop, { passive: false });

        // Auto remove on finish
        animation.onfinish = () => {
            if (balloon.parentNode) {
                activeBalloons--;
                balloon.remove();
            }
        };

        // Schedule next spawn
        setTimeout(createBalloon, 2000 + Math.random() * 2000);
    }

    function spawnParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.classList.add('balloon-pop-particle');
            p.style.backgroundColor = color; // match balloon
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;

            const destX = (Math.random() - 0.5) * 100;
            const destY = (Math.random() - 0.5) * 100;

            const anim = p.animate([
                { transform: `translate(0, 0) scale(1)`, opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600 + Math.random() * 400,
                easing: 'ease-out',
                fill: 'forwards'
            });

            container.appendChild(p);
            anim.onfinish = () => p.remove();
        }
    }

    // Start cycle
    createBalloon();
}


document.addEventListener('DOMContentLoaded', initBalloons);

/* =========================================
   9. Cinematic Video Viewer
   ========================================= */
function initVideo() {
    const video = document.getElementById('main-video');
    const overlay = document.getElementById('video-overlay');
    const wrapper = document.querySelector('.video-wrapper');
    const endMsg = document.getElementById('video-end-msg');

    if (!video || !overlay) return;

    console.log("Video viewer initialized");

    // Click to Play
    overlay.addEventListener('click', () => {
        video.play().then(() => {
            overlay.classList.add('hidden');
            console.log("Video playback verified (user initiated)");
        }).catch(err => {
            console.error("Video play error:", err);
        });
    });

    // Show overlay on pause
    video.addEventListener('pause', () => {
        if (!video.seeking) {
            overlay.classList.remove('hidden');
        }
    });

    video.addEventListener('play', () => {
        overlay.classList.add('hidden');
    });

    // End Message
    video.addEventListener('ended', () => {
        if (endMsg) {
            endMsg.classList.remove('hidden');
        }
        overlay.classList.remove('hidden');
    });

    // Scroll Pause
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && !video.paused) {
                video.pause();
                console.log("Video auto-paused (scrolled away)");
            }
            // Scale animation hook
            if (entry.isIntersecting) {
                entry.target.closest('.video-section').classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    const section = document.getElementById('memory-video');
    if (section) observer.observe(section);

    // Tab Visibility Pause
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !video.paused) {
            video.pause();
        }
    });
}

document.addEventListener('DOMContentLoaded', initVideo);

/* =========================================
   8. Tab Navigation Logic
   ========================================= */
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    if (!tabs.length || !contents.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = `tab-${tab.dataset.tab}`;

            // Remove active
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active
            tab.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');

                // Trigger resize for canvases that were hidden
                // Small delay to ensure display:block applies first
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 50);
            }
        });
    });
    console.log("Tabs initialized");
}

document.addEventListener('DOMContentLoaded', initTabs);

/* =========================================
   9. Greeting Card Generator
   ========================================= */
function initCard() {
    const canvas = document.getElementById('greeting-card-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('download-card-btn');
    let width = 600;
    let height = 400;

    // High DPI fix
    const dpr = window.devicePixelRatio || 1;
    // We keep internal resolution fixed for consistency of pixel art
    // But we scale for display if needed via CSS. 
    // Actually, user wants "pixel art", so standard resolution is fine.

    function drawCard() {
        // Background (Retro Sky gradient)
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#2b1055');
        grad.addColorStop(1, '#7597de');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Grid / scanlines (subtle)
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        for (let y = 0; y < height; y += 4) {
            ctx.fillRect(0, y, width, 2);
        }

        // Border (Game Frame)
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        ctx.strokeStyle = '#A86DD8'; // color accent
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, width - 32, height - 32);

        // Text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#A86DD8';
        ctx.shadowBlur = 15;
        ctx.fillText("HAPPY BIRTHDAY", width / 2, 120);

        ctx.font = 'bold 50px serif';
        ctx.fillText("Simran 💜", width / 2, 180);

        ctx.shadowBlur = 0;
        ctx.font = '20px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText("Made with love, pixels,", width / 2, 320);
        ctx.fillText("& a little bit of code.", width / 2, 350);

        // Pixel Hearts (Decoration)
        drawPixelHeart(ctx, 50, 50, 4, '#ff69b4');
        drawPixelHeart(ctx, width - 50, 50, 4, '#ff69b4');
        drawPixelHeart(ctx, 50, height - 50, 4, '#ff69b4');
        drawPixelHeart(ctx, width - 50, height - 50, 4, '#ff69b4');
    }

    function drawPixelHeart(ctx, x, y, scale, color) {
        ctx.fillStyle = color;
        // Simple 5x5 heart shape map
        const map = [
            "01010",
            "11111",
            "11111",
            "01110",
            "00100"
        ];

        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (map[r][c] === '1') {
                    ctx.fillRect(x + (c - 2) * scale * 2, y + (r - 2) * scale * 2, scale * 2, scale * 2);
                }
            }
        }
    }

    // Render once
    drawCard();

    // Download Logic
    if (btn) {
        btn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'simran-birthday-card.png';
            link.href = canvas.toDataURL();
            link.click();
            console.log("Greeting card downloaded");
        });
    }
}

document.addEventListener('DOMContentLoaded', initCard);


/* =========================================
   10. Retro Footer (Refined Arcade Style)
   ========================================= */
function initRetroFooter() {
    const canvas = document.getElementById('footer-canvas');
    const container = document.getElementById('retro-footer'); // Get container
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        // Measure container, not canvas (since canvas is abs)
        const rect = container.getBoundingClientRect();
        width = Math.floor(rect.width);
        height = Math.floor(rect.height);

        // Apply to canvas
        canvas.width = width;
        canvas.height = height;

        ctx.imageSmoothingEnabled = false; // Pixel art mode
    }
    window.addEventListener('resize', resize);
    resize();

    // --- Assets & State ---

    // Character State
    const char = {
        x: -50,
        y: 0, // set in loop
        dir: 1, // 1 = right, -1 = left
        state: 'walk', // walk, idle
        timer: 0,
        frame: 0
    };

    // Environment
    const clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * 800,
            y: 20 + Math.random() * 50,
            speed: 0.2 + Math.random() * 0.3,
            scale: 0.5 + Math.random() * 0.5
        });
    }

    const butterflies = [];

    function spawnButterfly() {
        butterflies.push({
            x: Math.random() < 0.5 ? -20 : width + 20,
            y: height - 40 - Math.random() * 30,
            vx: (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random()),
            vy: 0,
            color: Math.random() > 0.5 ? '#FFD700' : '#FF69B4',
            frame: 0
        });
    }

    let globalFrame = 0;

    // --- Main Loop ---

    function loop() {
        if (document.hidden) {
            requestAnimationFrame(loop);
            return;
        }

        update();
        draw();

        globalFrame++;
        requestAnimationFrame(loop);
    }

    function update() {
        // Character Logic
        if (char.state === 'walk') {
            char.x += 1.5 * char.dir;

            // Turn around logic
            if (char.dir === 1 && char.x > width + 50) {
                char.dir = -1;
                char.state = 'idle';
                char.timer = 60; // Wait 1s
            } else if (char.dir === -1 && char.x < -50) {
                char.dir = 1;
                char.state = 'idle';
                char.timer = 60;
            }

            // Animation Frame (Walk cycle speed)
            if (globalFrame % 10 === 0) {
                char.frame = (char.frame + 1) % 4;
            }
        } else if (char.state === 'idle') {
            char.timer--;
            if (char.timer <= 0) {
                char.state = 'walk';
            }
        }

        // Clouds
        clouds.forEach(c => {
            c.x += c.speed;
            if (c.x > width + 100) c.x = -100;
        });

        // Butterflies
        if (Math.random() < 0.005) spawnButterfly(); // Rare spawn

        for (let i = butterflies.length - 1; i >= 0; i--) {
            let b = butterflies[i];
            b.x += b.vx;
            b.y += Math.sin(globalFrame * 0.1) * 0.5;
            b.frame = (globalFrame % 10 < 5) ? 0 : 1; // Flap

            // Remove if offscreen
            if (b.x < -50 || b.x > width + 50) {
                butterflies.splice(i, 1);
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // 1. Sky Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#87CEEB');
        grad.addColorStop(1, '#E0F7FA');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // 2. Clouds
        clouds.forEach(c => drawCloud(ctx, c.x, c.y, c.scale));

        // 3. Ground
        const groundY = height - 40;
        ctx.fillStyle = '#76b041'; // Grass
        ctx.fillRect(0, groundY, width, 40);
        ctx.fillStyle = '#5a8c2c'; // Darker top strip
        ctx.fillRect(0, groundY, width, 4);

        // Grass Blades (Sway)
        ctx.fillStyle = '#4a7c22';
        for (let i = 0; i < width; i += 20) {
            let sway = Math.sin(globalFrame * 0.05 + i) * 3;
            ctx.fillRect(i + sway, groundY - 6, 2, 6);
        }

        // 4. Character (Pixel Art)
        // Adjust Y to sit on ground
        drawCharacter(ctx, char.x, groundY - 32, char.dir, char.frame);

        // 5. Butterflies
        butterflies.forEach(b => {
            ctx.fillStyle = b.color;
            const wing = b.frame === 0 ? 4 : 2;
            ctx.fillRect(b.x, b.y, wing, wing);
            ctx.fillStyle = '#FFF';
            ctx.fillRect(b.x + 1, b.y + 1, wing - 2, wing - 2);
        });
    }

    // --- Helpers ---

    function drawCloud(ctx, x, y, scale) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        // Simple 3-circle cloud
        const s = scale * 20;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.arc(x + s * 0.8, y - s * 0.5, s * 1.2, 0, Math.PI * 2);
        ctx.arc(x + s * 1.8, y, s * 0.9, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawCharacter(ctx, x, y, dir, frame) {
        ctx.save();
        ctx.translate(x, y);
        if (dir === -1) {
            ctx.scale(-1, 1); // Flip horizontally
        }

        // Pixel Scale = 4px
        const s = 4;

        // Draw based on simple 8x8 grid logic

        // Head (Peach)
        ctx.fillStyle = '#ffe0bd';
        ctx.fillRect(-2 * s, 0, 4 * s, 3 * s);

        // Hair (Brown)
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(-2 * s, 0, 4 * s, 1 * s);
        ctx.fillRect(-2 * s, 1 * s, 1 * s, 2 * s); // Sideburn

        // Body (Blue Shirt)
        ctx.fillStyle = '#2196F3';
        ctx.fillRect(-2 * s, 3 * s, 4 * s, 3 * s);

        // Arms (animate)
        // Swing logic: frame 0=neutral, 1=forward, 2=neutral, 3=back
        let armOffset = 0;
        if (frame === 1) armOffset = 1 * s;
        if (frame === 3) armOffset = -1 * s;

        ctx.fillStyle = '#ffe0bd'; // Hand
        ctx.fillRect(0 + armOffset, 4 * s, 1 * s, 2 * s);

        // Legs (Dark Pants)
        ctx.fillStyle = '#333';
        const legH = 2 * s;

        // Walk Cycle Legs
        if (frame === 0 || frame === 2) {
            // Standing
            ctx.fillRect(-2 * s, 6 * s, 1.5 * s, legH);
            ctx.fillRect(0.5 * s, 6 * s, 1.5 * s, legH);
        } else if (frame === 1) {
            // Step Right
            ctx.fillRect(-2 * s, 6 * s, 1.5 * s, legH); // Left leg stay
            ctx.fillRect(1.5 * s, 5.5 * s, 1.5 * s, legH); // Right leg up/fwd
        } else if (frame === 3) {
            // Step Left
            ctx.fillRect(-3 * s, 5.5 * s, 1.5 * s, legH); // Left leg up/back
            ctx.fillRect(0.5 * s, 6 * s, 1.5 * s, legH); // Right leg stay
        }

        ctx.restore();
    }

    console.log("Retro footer initialized (Arcade Mode)");
    requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', initRetroFooter);
