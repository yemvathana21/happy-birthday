// Ambient star field for the story screen.
// The canvas lives inside #storyScreen, so it fades in with the scene and
// stays behind the illustration and controls.

(() => {
    const storyScreen = document.getElementById('storyScreen');
    if (!storyScreen) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'star-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    storyScreen.prepend(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        canvas.remove();
        return;
    }

    const STAR_COLORS = [
        '255, 255, 255',
        '199, 210, 254',
        '249, 168, 212'
    ];

    const SPRITE_SIZE = 32;
    const MAX_DPR = 2;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let stars = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastFrame = 0;

    // Pre-render a soft glow for each color so drawing stays cheap.
    const sprites = STAR_COLORS.map((rgb) => {
        const sprite = document.createElement('canvas');
        sprite.width = sprite.height = SPRITE_SIZE;

        const spriteCtx = sprite.getContext('2d');
        const half = SPRITE_SIZE / 2;
        const gradient = spriteCtx.createRadialGradient(half, half, 0, half, half, half);

        gradient.addColorStop(0, `rgba(${rgb}, 1)`);
        gradient.addColorStop(0.22, `rgba(${rgb}, 0.9)`);
        gradient.addColorStop(0.5, `rgba(${rgb}, 0.25)`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);

        spriteCtx.fillStyle = gradient;
        spriteCtx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

        return sprite;
    });

    function makeStar(randomY) {
        return {
            x: Math.random() * width,
            y: randomY ? Math.random() * height : height + Math.random() * 40,
            size: 0.6 + Math.random() * 1.6,
            speed: 3 + Math.random() * 9,
            sway: 4 + Math.random() * 10,
            swaySpeed: 0.15 + Math.random() * 0.5,
            twinkleSpeed: 0.6 + Math.random() * 1.6,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.35 + Math.random() * 0.55,
            sprite: sprites[Math.floor(Math.random() * sprites.length)]
        };
    }

    function buildStars() {
        const count = Math.max(
            35,
            Math.min(110, Math.round((width * height) / 16000))
        );

        stars = Array.from({ length: count }, () => makeStar(true));
    }

    function draw(time) {
        ctx.clearRect(0, 0, width, height);

        for (const star of stars) {
            const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.phase);
            const x = star.x + Math.sin(time * star.swaySpeed + star.phase) * star.sway;
            const size = star.size * 6;

            ctx.globalAlpha = star.alpha * twinkle;
            ctx.drawImage(star.sprite, x - size / 2, star.y - size / 2, size, size);
        }

        ctx.globalAlpha = 1;
    }

    function resize() {
        const rect = storyScreen.getBoundingClientRect();

        width = Math.max(1, Math.round(rect.width));
        height = Math.max(1, Math.round(rect.height));
        dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        buildStars();
        draw(0);
    }

    function animate(now) {
        requestAnimationFrame(animate);

        // Nothing to draw while the splash screen is showing.
        if (!storyScreen.classList.contains('active')) {
            lastFrame = now;
            return;
        }

        if (!lastFrame) lastFrame = now;

        const delta = Math.min(0.05, (now - lastFrame) / 1000);
        lastFrame = now;

        for (const star of stars) {
            star.y -= star.speed * delta;

            if (star.y < -12) {
                star.y = height + 12;
                star.x = Math.random() * width;
            }
        }

        draw(now / 1000);
    }

    window.addEventListener('resize', resize);

    resize();

    // Keep the stars still for visitors who prefer reduced motion.
    if (!prefersReducedMotion.matches) {
        requestAnimationFrame(animate);
    }
})();
