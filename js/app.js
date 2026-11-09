
let currentIndex = 0;
let currentDialogueIndex = 0;
let audioFade = null;

// Background music settings
const MUSIC_VOLUME = 0.55;
const MUSIC_FADE_STEP = 0.05;
const MUSIC_FADE_INTERVAL = 60;

// DOM Element References
const dialogueBubble = document.getElementById('dialogueBubble');
const sceneTime = document.getElementById('sceneTime');
const speakerName = document.getElementById('speakerName');
const dialogueText = document.getElementById('dialogueText');

const splashScreen = document.getElementById('splashScreen');
const storyScreen = document.getElementById('storyScreen');
const currentStoryImg = document.getElementById('currentStoryImg');

const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const openBoxBtn = document.getElementById('openBoxBtn');

const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

// Event Listeners
startBtn.addEventListener('click', startStory);
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
openBoxBtn.addEventListener('click', openBirthdayPage);
musicBtn.addEventListener('click', toggleMusic);

// Music playback state
bgMusic.addEventListener('playing', () => {
    setMusicState(true);
    stopAutoplayRetries();
});

bgMusic.addEventListener('pause', () => {
    setMusicState(false);
});

// ========================================
// START STORY
// ========================================

function startStory() {
    currentIndex = 0;
    currentDialogueIndex = 0;

    splashScreen.classList.add('hidden');
    storyScreen.classList.add('active');

    updateSlide();

    if (bgMusic.paused) {
        playMusic();
    }
}

// ========================================
// GET CURRENT STORY DATA
// ========================================

function getCurrentScript() {
    const script = storyScripts[currentIndex];

    if (!script) {
        return {
            time: "",
            speaker: "Soriya",
            dialogues: ["Let's see what happens next... ✨"],
            position: "left"
        };
    }

    // Support both "dialogues" and "dialogue"
    // so existing story data can still work.
    const rawDialogues = script.dialogues ?? script.dialogue;

    let dialogues = Array.isArray(rawDialogues)
        ? rawDialogues
        : typeof rawDialogues === 'string'
            ? [rawDialogues]
            : [];

    // Secret scenes intentionally have no dialogue; only show the
    // fallback line for ordinary scenes that are missing text.
    if (dialogues.length === 0 && !script.cta) {
        dialogues = ["Let's see what happens next... ✨"];
    }

    return {
        ...script,
        dialogues
    };
}

// ========================================
// UPDATE STORY SCENE AND DIALOGUE
// ========================================

function updateSlide() {

    // Get current scene
    const script = getCurrentScript();

    // Update illustration only when the scene changes
    if (
        currentStoryImg.getAttribute('src') !==
        storyImages[currentIndex]
    ) {
        currentStoryImg.src = storyImages[currentIndex];
    }

    // Get current dialogue
    const dialogue = script.dialogues[currentDialogueIndex] ?? "";

    // Update dialogue information
    sceneTime.textContent = script.time || "";
    speakerName.textContent = script.speaker || "Soriya";
    dialogueText.textContent = dialogue;

    // Reset dialogue bubble position
    dialogueBubble.classList.remove(
        'position-left',
        'position-right',
        'position-top',
        'show'
    );

    // Apply selected position
    if (script.position === 'right') {
        dialogueBubble.classList.add('position-right');
    }

    if (script.position === 'top') {
        dialogueBubble.classList.add('position-top');
    }

    // Secret scenes show a call-to-action button instead of a bubble
    if (script.cta) {

        openBoxBtn.textContent = script.cta.label || 'Open the box';
        openBoxBtn.dataset.href = script.cta.href || 'birthday.html';
        openBoxBtn.disabled = false;
        openBoxBtn.classList.add('show');

    } else {

        openBoxBtn.classList.remove('show');

        // Replay bubble animation
        void dialogueBubble.offsetWidth;
        dialogueBubble.classList.add('show');
    }

    // Update navigation buttons
    updateNavigationButtons();
}

// ========================================
// UPDATE NAVIGATION BUTTONS
// ========================================

function updateNavigationButtons() {

    const script = getCurrentScript();

    const isFirstScene = currentIndex === 0;
    const isLastScene = currentIndex === storyImages.length - 1;

    const isFirstDialogue = currentDialogueIndex === 0;

    const isLastDialogue =
        currentDialogueIndex === script.dialogues.length - 1;

    // Previous is disabled only at the very beginning
    prevBtn.disabled = isFirstScene && isFirstDialogue;

    // Secret scenes have no "next" — only the call-to-action button
    nextBtn.hidden = Boolean(script.cta);
    nextBtn.disabled =
        Boolean(script.cta) ||
        (isLastScene && isLastDialogue);
}

// ========================================
// NEXT DIALOGUE / NEXT SCENE
// ========================================

function nextSlide() {

    const script = getCurrentScript();

    // Check if more dialogue exists in this scene
    if (currentDialogueIndex < script.dialogues.length - 1) {

        currentDialogueIndex++;

        updateSlide();

        return;
    }

    // All dialogue finished: move to next scene
    if (currentIndex < storyImages.length - 1) {

        currentIndex++;
        currentDialogueIndex = 0;

        updateSlide();
    }
}

// ========================================
// PREVIOUS DIALOGUE / PREVIOUS SCENE
// ========================================

function prevSlide() {

    // Go to previous dialogue in the same scene
    if (currentDialogueIndex > 0) {

        currentDialogueIndex--;

        updateSlide();

        return;
    }

    // Move to previous scene
    if (currentIndex > 0) {

        currentIndex--;

        // Open the last dialogue of previous scene
        const previousScript = getCurrentScript();

        currentDialogueIndex = previousScript.dialogues.length - 1;

        updateSlide();
    }
}

// ========================================
// OPEN BIRTHDAY PAGE
// ========================================

function openBirthdayPage() {

    if (openBoxBtn.disabled) {
        return;
    }

    openBoxBtn.disabled = true;

    const href = openBoxBtn.dataset.href || 'birthday.html';
    const gameContainer = document.querySelector('.game-container');

    if (gameContainer) {
        gameContainer.classList.add('leaving');
    }

    window.setTimeout(() => {
        window.location.href = href;
    }, 600);
}

// ========================================
// BACKGROUND MUSIC
// ========================================

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

    musicBtn.setAttribute(
        'aria-pressed',
        String(isPlaying)
    );

    musicBtn.setAttribute(
        'aria-label',
        isPlaying ? 'បិទចម្រៀង' : 'បើកចម្រៀង'
    );

    musicBtn.title = isPlaying
        ? 'បិទចម្រៀង'
        : 'បើកចម្រៀង';
}

// ========================================
// SPLASH SCREEN AUTOPLAY
// ========================================

const autoplayEvents = [
    'pointerdown',
    'click',
    'touchstart',
    'touchend',
    'keydown',
    'scroll'
];

function stopAutoplayRetries() {

    autoplayEvents.forEach(event => {
        window.removeEventListener(event, tryAutoplay);
    });
}

async function tryAutoplay(event) {

    // Do not interfere with music button clicks
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

autoplayEvents.forEach(event => {

    window.addEventListener(
        event,
        tryAutoplay,
        { passive: true }
    );
});

// Initialize music state
setMusicState(!bgMusic.paused);

// Initial autoplay attempt
tryAutoplay();
