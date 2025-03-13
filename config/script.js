// Audio elements
const bgMusic = document.getElementById('backgroundMusic');
const fireworkSound = document.getElementById('fireworkSound');
const popSound = document.getElementById('popSound');
const dingSound = document.getElementById('dingSound');

// Function to play sound with error handling
function playSound(audioElement, volume) {
    audioElement.volume = volume;
    audioElement.currentTime = 0;
    audioElement.play().catch(error => {
        console.error(`Error playing ${audioElement.id}:`, error);
    });
}

// Background music on load (only after user interaction)
let isAudioUnlocked = false;
window.addEventListener('load', function() {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(error => {
        console.log("Background music autoplay prevented:", error);
        console.log("Click anywhere to start background music.");
    });
});

// Unlock audio on first interaction
document.addEventListener('click', function unlockAudio() {
    if (!isAudioUnlocked) {
        bgMusic.play().then(() => {
            console.log("Background music started after interaction.");
        }).catch(error => {
            console.error("Background music failed after interaction:", error);
        });
        isAudioUnlocked = true;
        document.removeEventListener('click', unlockAudio); // Remove listener after unlocking
    }
}, { once: true });

document.getElementById('surpriseBtn').addEventListener('click', function() {
    const surprise = document.getElementById('surpriseMessage');
    const button = document.getElementById('surpriseBtn');
    const fireworksContainer = document.getElementById('fireworks');

    // Toggle surprise message with ding sound
    if (surprise.classList.contains('hidden')) {
        surprise.classList.remove('hidden');
        button.textContent = "Hide Surprise";
        playSound(dingSound, 0.6);
    } else {
        surprise.classList.add('hidden');
        button.textContent = "Click for a Surprise!";
    }

    // Confetti with pop sound
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff3366', '#33cc99', '#ffcc00', '#3366ff'],
        angle: 90,
        drift: 1,
        scalar: 1.2
    });
    playSound(popSound, 0.5);

    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 120,
            origin: { x: 0, y: 0.5 },
            colors: ['#ff3366', '#ffcc00']
        });
        confetti({
            particleCount: 50,
            spread: 120,
            origin: { x: 1, y: 0.5 },
            colors: ['#33cc99', '#3366ff']
        });
        playSound(popSound, 0.5);
    }, 300);

    // Fireworks with synchronized sound
    fireworksContainer.innerHTML = ''; // Clear previous fireworks
    fireworksContainer.style.opacity = 1;

    for (let i = 0; i < 8; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 60 + 20;
        firework.style.left = `${x}%`;
        firework.style.top = `${y}%`;
        const launchDelay = Math.random() * 500;
        firework.style.animationDelay = `${launchDelay / 1000}s`;

        for (let j = 0; j < 12; j++) {
            const spark = document.createElement('div');
            spark.classList.add('firework-spark');
            const angle = (j * 360) / 12;
            const distance = Math.random() * 50 + 20;
            spark.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            spark.style.animationDelay = `${(0.8 + launchDelay / 1000) + Math.random() * 0.2}s`;
            firework.appendChild(spark);
        }

        fireworksContainer.appendChild(firework);

        // Synchronized firework sound
        setTimeout(() => {
            const soundClone = fireworkSound.cloneNode(true);
            playSound(soundClone, 0.7);
        }, launchDelay + 800); // Sync with burst
    }

    setTimeout(() => {
        fireworksContainer.style.opacity = 0;
    }, 2500);
});