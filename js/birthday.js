// ========================================================
// SORIYA'S memories PAGE
// Gallery timeline, lightbox, letter, confetti, scroll UI,
// and the background memories music.
// ========================================================

/* ========================================================
   1. PHOTO DATA (English titles and captions)
   ======================================================== */

const galleryItems = [
    { src: 'images/memories/photo-01.png', width: 600, height: 800, title: 'កុមារី យ៉ា', caption: '...' },
    { src: 'images/memories/photo-02.png', width: 800, height: 600, title: '', caption: '' },
    { src: 'images/memories/video-02.mov', width: 800, height: 600, title: 'No Caption...', caption: '...' },
    { src: 'images/memories/photo-03.jpg', width: 700, height: 700, title: 'ផ្កាឈូក!!!', caption: 'រាល់ងៃញាំតែផ្កាឈូកហ្នឹង ហីអោយទៅកាចមិច???' },
    { src: 'images/memories/photo-04.png', width: 600, height: 800, title: '', caption: '' },
    { src: 'images/memories/photo-05.png', width: 700, height: 700, title: '', caption: '' },
    { src: 'images/memories/video-01.mp4', width: 480, height: 640, title: '', caption: '' },
    { src: 'images/memories/photo-06.png', width: 600, height: 800, title: '', caption: '' },
    { src: 'images/memories/photo-07.png', width: 800, height: 600, title: '', caption: '' },
    { src: 'images/memories/video-03.mov', width: 600, height: 800, title: '', caption: '' },
    { src: 'images/memories/photo-08.jpg', width: 700, height: 700, title: '', caption: '' },
    { src: 'images/memories/photo-09.jpg', width: 600, height: 800, title: '', caption: '' },
    { src: 'images/memories/photo-10.png', width: 700, height: 700, title: '', caption: '' },
    { src: 'images/memories/photo-11.jpg', width: 840, height: 540, title: '', caption: '' },
    // { src: 'images/memories/photo-13.jpg', width: 600, height: 800, title: 'Flower Market Sunday', caption: 'Fresh peonies, blush roses, and sweet scents.' },
    // { src: 'images/memories/photo-14.jpg', width: 800, height: 600, title: 'Candid Little Moments', caption: 'The most genuine expression captured naturally.' },
    // { src: 'images/memories/photo-15.jpg', width: 700, height: 700, title: 'Chasing Soft Sunsets', caption: 'Pastel clouds drifting slowly into dusk.' },
    // { src: 'images/memories/photo-16.jpg', width: 600, height: 800, title: 'Stories Shared Together', caption: 'Hours that flew by while talking about everything.' },
    // { src: 'images/memories/photo-17.jpg', width: 800, height: 600, title: 'A Gentle Breeze', caption: 'Cool wind, peaceful skies, and clear thoughts.' },
    // { src: 'images/memories/photo-18.jpg', width: 700, height: 700, title: 'Your Kindness & Light', caption: 'Always bringing warmth wherever you go.' },
    // { src: 'images/memories/photo-19.jpg', width: 600, height: 800, title: 'Daydreaming by the Window', caption: 'Thinking of dream destinations and future steps.' },
    // { src: 'images/memories/photo-20.jpg', width: 840, height: 540, title: 'The Best Days Ahead', caption: 'Looking forward with excited, shining eyes.' },
    // { src: 'images/memories/photo-21.jpg', width: 700, height: 700, title: 'Cozy Sweaters & Tea', caption: 'Wrapped up warm against chilly mornings.' },
    // { src: 'images/memories/video-02.mov', width: 700, height: 700, title: 'Happy 2026 Chapter', caption: "November 25, 2026 — Soriya's Special Day!" }
];

/* ========================================================
   2. BUILD THE CENTER-LINE TIMELINE
   ======================================================== */

const timeline = document.getElementById('timeline');

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isVideoItem(item) {
    return (
        item.type === 'video' ||
        /\.(mp4|webm|ogv|mov|m4v)$/i.test(item.src)
    );
}

function buildTimeline() {
    const fragment = document.createDocumentFragment();

    galleryItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'timeline-item fade-in-element';

        const video = isVideoItem(item);

        const card = document.createElement('article');
        card.className = 'timeline-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('data-index', String(index));
        card.setAttribute(
            'aria-label',
            `View ${video ? 'video' : 'photo'}: ${item.title}`
        );

        const wrap = document.createElement('div');
        wrap.className = 'timeline-photo-wrap';

        let media;

        if (video) {
            wrap.classList.add('is-video');

            media = document.createElement('video');
            media.className = 'timeline-photo';
            media.src = item.src;
            media.width = item.width;
            media.height = item.height;
            media.muted = true;
            media.loop = true;
            media.autoplay = true;
            media.playsInline = true;
            media.preload = index < 2 ? 'auto' : 'metadata';
            media.setAttribute('muted', '');
            media.setAttribute('playsinline', '');
            media.setAttribute('aria-label', item.title);

            // Some browsers ignore the autoplay attribute until the media
            // is ready; retry once the first frame is available.
            const tryPlay = () => {
                const attempt = media.play();
                if (attempt && typeof attempt.catch === 'function') {
                    attempt.catch(() => {});
                }
            };
            media.addEventListener('loadeddata', tryPlay, { once: true });
            media.addEventListener('canplay', tryPlay, { once: true });
        } else {
            media = document.createElement('img');
            media.className = 'timeline-photo';
            media.src = item.src;
            media.alt = item.title;
            media.width = item.width;
            media.height = item.height;
            media.loading = index < 2 ? 'eager' : 'lazy';
            media.decoding = 'async';
        }

        const caption = document.createElement('div');
        caption.className = 'timeline-caption';
        caption.innerHTML =
            `<h3 class="timeline-title">${escapeHtml(item.title)}</h3>` +
            `<p class="timeline-desc">${escapeHtml(item.caption)}</p>`;

        wrap.appendChild(media);
        card.appendChild(wrap);
        card.appendChild(caption);

        const dot = document.createElement('span');
        dot.className = 'timeline-dot';
        dot.setAttribute('aria-hidden', 'true');

        row.appendChild(card);
        row.appendChild(dot);
        fragment.appendChild(row);
    });

    timeline.appendChild(fragment);
}

buildTimeline();

/* ========================================================
   2b. STAGGER THE RIGHT COLUMN
   Each right-side card is pulled up by 30% of the
   previous (left-side) card's height, so the two columns
   overlap vertically in a zigzag.
   ======================================================== */

// Change 0.3 to 0.25 / 0.35 etc. if you want more or less overlap.
const RIGHT_CARD_OFFSET_RATIO = 0.5;
const stackedTimelineQuery = window.matchMedia('(max-width: 900px)');

let timelineOffsetFrame = null;

function applyTimelineOffsets() {
    const items = [...timeline.querySelectorAll('.timeline-item')];

    items.forEach((item, index) => {
        // Left-side rows keep their normal position.
        if (index % 2 === 0) {
            item.style.marginTop = '';
            return;
        }

        // On the stacked mobile layout all cards share one side,
        // so the zigzag offset is turned off.
        if (stackedTimelineQuery.matches) {
            item.style.marginTop = '';
            return;
        }

        const previousItem = items[index - 1];
        const previousCard = previousItem?.querySelector('.timeline-card');

        if (previousCard) {
            // Include the normal gap between rows so the measured
            // overlap is 30% of the left card, not 30% minus the gap.
            const previousGap = previousItem
                ? parseFloat(getComputedStyle(previousItem).marginBottom) || 0
                : 0;

            item.style.marginTop =
                `${-((previousCard.offsetHeight * RIGHT_CARD_OFFSET_RATIO) + previousGap)}px`;
        }
    });
}

function scheduleTimelineOffsets() {
    if (timelineOffsetFrame !== null) {
        window.cancelAnimationFrame(timelineOffsetFrame);
    }

    timelineOffsetFrame = window.requestAnimationFrame(() => {
        timelineOffsetFrame = null;
        applyTimelineOffsets();
    });
}

scheduleTimelineOffsets();

window.addEventListener('load', scheduleTimelineOffsets);
window.addEventListener('resize', scheduleTimelineOffsets);

if (stackedTimelineQuery.addEventListener) {
    stackedTimelineQuery.addEventListener('change', scheduleTimelineOffsets);
}

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleTimelineOffsets);
}

/* ========================================================
   3. LIGHTBOX
   ======================================================== */

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let activePhotoIndex = 0;
let lastFocusedElement = null;

function updateLightbox() {
    const item = galleryItems[activePhotoIndex];
    const video = isVideoItem(item);

    // Reset any video that was playing before switching media.
    lightboxVideo.pause();
    lightboxVideo.hidden = true;
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();

    lightboxImg.hidden = video;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.caption;

    if (video) {
        lightboxImg.removeAttribute('src');
        lightboxImg.alt = '';

        lightboxVideo.hidden = false;
        lightboxVideo.src = item.src;
        lightboxVideo.setAttribute('aria-label', item.title);
        lightboxVideo.play().catch(() => {});

        lightboxCounter.textContent =
            `Video ${activePhotoIndex + 1} of ${galleryItems.length}`;
    } else {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;

        lightboxCounter.textContent =
            `Photo ${activePhotoIndex + 1} of ${galleryItems.length}`;
    }
}

function openLightbox(index) {
    activePhotoIndex = index;
    updateLightbox();

    lastFocusedElement = document.activeElement;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');

    lightboxClose.focus();
}

function closeLightbox() {
    lightboxVideo.pause();
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');

    if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
    }
}

function stepLightbox(direction) {
    activePhotoIndex =
        (activePhotoIndex + direction + galleryItems.length) % galleryItems.length;
    updateLightbox();
}

timeline.addEventListener('click', (event) => {
    const card = event.target.closest('.timeline-card');
    if (!card) return;

    openLightbox(Number(card.dataset.index));
});

timeline.addEventListener('keydown', (event) => {
    const card = event.target.closest('.timeline-card');
    if (!card) return;

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(Number(card.dataset.index));
    }
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => stepLightbox(-1));
lightboxNext.addEventListener('click', () => stepLightbox(1));

lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;

    if (event.key === 'Escape') {
        closeLightbox();
        return;
    }

    if (event.key === 'ArrowLeft') {
        // Let the native video controls seek when the video is focused.
        if (event.target === lightboxVideo) return;
        event.preventDefault();
        stepLightbox(-1);
        return;
    }

    if (event.key === 'ArrowRight') {
        if (event.target === lightboxVideo) return;
        event.preventDefault();
        stepLightbox(1);
        return;
    }

    // Keep keyboard focus inside the lightbox while it is open.
    if (event.key === 'Tab') {
        const focusable = [lightboxClose, lightboxPrev, lightboxNext];

        if (!lightboxVideo.hidden) {
            focusable.unshift(lightboxVideo);
        }

        const currentIndex = focusable.indexOf(document.activeElement);
        const nextIndex = event.shiftKey
            ? (currentIndex - 1 + focusable.length) % focusable.length
            : (currentIndex + 1) % focusable.length;

        event.preventDefault();
        focusable[nextIndex].focus();
    }
});

/* ========================================================
   4. LETTER REVEAL
   ======================================================== */

const envelopeBtn = document.getElementById('openEnvelopeBtn');
const revealedLetter = document.getElementById('revealedLetter');

envelopeBtn.addEventListener('click', () => {
    const isOpen = !revealedLetter.classList.contains('open');

    revealedLetter.classList.toggle('open', isOpen);
    revealedLetter.setAttribute('aria-hidden', String(!isOpen));
    envelopeBtn.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
        window.setTimeout(() => {
            revealedLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 380);
    }
});

/* ========================================================
   5. CELEBRATION — CONFETTI + TOAST
   ======================================================== */

const celebrateBtn = document.getElementById('celebrateBtn');
const celebrationToast = document.getElementById('celebrationToast');
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const confettiColors = [
    '#E56B6F',
    '#F4ACB7',
    '#FAD2E1',
    '#C97A7E',
    '#DDA15E',
    '#FFF1E6',
    '#FCE7F3'
];

let confettiParticles = [];
let confettiFrame = null;
let toastTimer = null;

function sizeConfettiCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    confettiCanvas.width = Math.round(window.innerWidth * dpr);
    confettiCanvas.height = Math.round(window.innerHeight * dpr);
    confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawConfetti() {
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confettiParticles = confettiParticles.filter((particle) => {
        return particle.life > 0 && particle.y < window.innerHeight + 60;
    });

    confettiParticles.forEach((particle) => {
        particle.vy += 0.18;
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.spin;
        particle.life -= 1;

        confettiCtx.save();
        confettiCtx.globalAlpha = Math.min(1, particle.life / 40);
        confettiCtx.translate(particle.x, particle.y);
        confettiCtx.rotate(particle.rotation);
        confettiCtx.fillStyle = particle.color;

        if (particle.circle) {
            confettiCtx.beginPath();
            confettiCtx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            confettiCtx.fill();
        } else {
            confettiCtx.fillRect(
                -particle.size / 2,
                -particle.size / 4,
                particle.size,
                particle.size / 2
            );
        }

        confettiCtx.restore();
    });

    if (confettiParticles.length > 0) {
        confettiFrame = window.requestAnimationFrame(drawConfetti);
    } else {
        confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        confettiFrame = null;
    }
}

function launchConfetti() {
    if (prefersReducedMotion.matches) {
        return;
    }

    if (confettiFrame !== null) {
        window.cancelAnimationFrame(confettiFrame);
        confettiFrame = null;
    }

    sizeConfettiCanvas();

    const count = 180;
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.76;

    confettiParticles = Array.from({ length: count }, () => {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
        const speed = 8 + Math.random() * 12;

        return {
            x: originX + (Math.random() - 0.5) * window.innerWidth * 0.5,
            y: originY + (Math.random() - 0.5) * 80,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 7 + Math.random() * 8,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.35,
            life: 110 + Math.floor(Math.random() * 70),
            circle: Math.random() < 0.3
        };
    });

    drawConfetti();
}

function showCelebrationToast() {
    celebrationToast.classList.add('show');
    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
        celebrationToast.classList.remove('show');
    }, 5200);
}

celebrateBtn.addEventListener('click', () => {
    launchConfetti();
    showCelebrationToast();
});

window.addEventListener('resize', () => {
    if (confettiParticles.length > 0) {
        sizeConfettiCanvas();
    }
});

/* ========================================================
   5b. FALLING FLOWER PETALS + HEARTS
   Ported from the old memories template's canvas effect.
   ======================================================== */

const petalsCanvas = document.getElementById('petalsCanvas');
const petalsCtx = petalsCanvas.getContext('2d');

const PETAL_COLORS = [
    'rgba(250, 210, 225, 0.75)',
    'rgba(253, 226, 228, 0.70)',
    'rgba(244, 172, 183, 0.65)',
    'rgba(255, 230, 238, 0.80)',
    'rgba(229, 107, 111, 0.55)'
];

const petalState = {
    width: 0,
    height: 0,
    items: [],
    frame: null
};

function petalCountForWidth(width) {
    if (width < 640) return 12;
    if (width < 900) return 18;
    return 28;
}

function sizePetalsCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    petalState.width = window.innerWidth;
    petalState.height = window.innerHeight;
    petalsCanvas.width = Math.round(petalState.width * dpr);
    petalsCanvas.height = Math.round(petalState.height * dpr);
    petalsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createPetal(initial) {
    return {
        x: Math.random() * petalState.width,
        y: initial ? Math.random() * petalState.height : -20,
        size: Math.random() * 10 + 8,
        speedY: Math.random() * 0.9 + 0.6,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        isHeart: Math.random() < 0.22,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.01
    };
}

function resetPetal(petal) {
    Object.assign(petal, createPetal(false));
}

function drawPetal(petal) {
    petalsCtx.save();
    petalsCtx.translate(petal.x, petal.y);
    petalsCtx.rotate((petal.rotation * Math.PI) / 180);
    petalsCtx.fillStyle = petal.color;

    if (petal.isHeart) {
        const s = petal.size * 0.6;
        petalsCtx.beginPath();
        petalsCtx.moveTo(0, s * 0.3);
        petalsCtx.bezierCurveTo(-s, -s * 0.6, -s * 1.2, s * 0.5, 0, s * 1.2);
        petalsCtx.bezierCurveTo(s * 1.2, s * 0.5, s, -s * 0.6, 0, s * 0.3);
        petalsCtx.fill();
    } else {
        petalsCtx.beginPath();
        petalsCtx.ellipse(0, 0, petal.size * 0.6, petal.size, 0, 0, Math.PI * 2);
        petalsCtx.fill();
    }

    petalsCtx.restore();
}

function animatePetals() {
    petalsCtx.clearRect(0, 0, petalState.width, petalState.height);

    petalState.items.forEach((petal) => {
        petal.sway += petal.swaySpeed;
        petal.x += petal.speedX + Math.sin(petal.sway) * 0.8;
        petal.y += petal.speedY;
        petal.rotation += petal.rotationSpeed;

        if (
            petal.y > petalState.height + 25 ||
            petal.x < -30 ||
            petal.x > petalState.width + 30
        ) {
            resetPetal(petal);
        }

        drawPetal(petal);
    });

    petalState.frame = window.requestAnimationFrame(animatePetals);
}

function stopPetals() {
    if (petalState.frame !== null) {
        window.cancelAnimationFrame(petalState.frame);
        petalState.frame = null;
    }

    petalsCtx.clearRect(0, 0, petalState.width, petalState.height);
}

function startPetals() {
    if (prefersReducedMotion.matches) {
        return;
    }

    sizePetalsCanvas();
    petalState.items = Array.from(
        { length: petalCountForWidth(petalState.width) },
        () => createPetal(true)
    );

    if (petalState.frame === null) {
        petalState.frame = window.requestAnimationFrame(animatePetals);
    }
}

window.addEventListener('resize', () => {
    if (prefersReducedMotion.matches) {
        return;
    }

    sizePetalsCanvas();

    const target = petalCountForWidth(petalState.width);

    while (petalState.items.length < target) {
        petalState.items.push(createPetal(false));
    }

    while (petalState.items.length > target) {
        petalState.items.pop();
    }
});

if (prefersReducedMotion.addEventListener) {
    prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) {
            stopPetals();
        } else {
            startPetals();
        }
    });
}

startPetals();

/* ========================================================
   6. SCROLL PROGRESS + BACK TO TOP
   ======================================================== */

const scrollProgressBar = document.getElementById('scrollProgressBar');
const backToTopBtn = document.getElementById('backToTop');

function updateScrollUi() {
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    scrollProgressBar.style.width = `${progress}%`;
    backToTopBtn.classList.toggle('show', window.scrollY > 600);
}

window.addEventListener('scroll', updateScrollUi, { passive: true });
window.addEventListener('resize', updateScrollUi);
updateScrollUi();

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
    });
});

/* ========================================================
   7. SCROLL REVEAL
   ======================================================== */

const revealElements = document.querySelectorAll('.fade-in-element');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
}

/* ========================================================
   8. BACKGROUND MUSIC
   ======================================================== */

const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

const MUSIC_VOLUME = 0.55;
const MUSIC_FADE_STEP = 0.05;
const MUSIC_FADE_INTERVAL = 60;

let audioFade = null;

musicBtn.addEventListener('click', toggleMusic);

bgMusic.addEventListener('playing', () => {
    setMusicState(true);
    stopAutoplayRetries();
});

bgMusic.addEventListener('pause', () => {
    setMusicState(false);
});

async function playMusic() {
    bgMusic.volume = 0;

    try {
        await bgMusic.play();
    } catch {
        if (bgMusic.paused) {
            setMusicState(false);
        }

        return false;
    }

    if (bgMusic.paused) {
        return false;
    }

    setMusicState(true);
    fadeInMusic();

    return true;
}

function fadeInMusic() {
    clearInterval(audioFade);

    audioFade = setInterval(() => {
        bgMusic.volume = Math.min(
            MUSIC_VOLUME,
            bgMusic.volume + MUSIC_FADE_STEP
        );

        if (bgMusic.volume >= MUSIC_VOLUME) {
            clearInterval(audioFade);
            audioFade = null;
        }
    }, MUSIC_FADE_INTERVAL);
}

function toggleMusic() {
    if (bgMusic.paused) {
        playMusic();
    } else {
        bgMusic.pause();

        clearInterval(audioFade);
        audioFade = null;

        setMusicState(false);
    }
}

function setMusicState(isPlaying) {
    musicBtn.classList.toggle('muted', !isPlaying);
    musicBtn.setAttribute('aria-pressed', String(isPlaying));
    musicBtn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
    musicBtn.title = isPlaying ? 'Pause music' : 'Play music';
}

const autoplayEvents = [
    'pointerdown',
    'click',
    'touchstart',
    'touchend',
    'keydown',
    'scroll'
];

function stopAutoplayRetries() {
    autoplayEvents.forEach((event) => {
        window.removeEventListener(event, tryAutoplay);
    });
}

async function tryAutoplay(event) {
    // Do not interfere with music button clicks.
    if (
        event &&
        event.target instanceof Element &&
        event.target.closest('#musicBtn')
    ) {
        return;
    }

    if (!bgMusic.paused) {
        stopAutoplayRetries();
        return;
    }

    const started = await playMusic();

    if (started) {
        stopAutoplayRetries();
    }
}

autoplayEvents.forEach((event) => {
    window.addEventListener(event, tryAutoplay, { passive: true });
});

setMusicState(!bgMusic.paused);
tryAutoplay();
