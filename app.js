document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingo-card');
    const resetButton = document.getElementById('reset-button');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsMenu = document.getElementById('settings-menu');
    const gridSize = 5;

    // Settings Menu Toggle
    settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsMenu.contains(e.target) && !settingsToggle.contains(e.target)) {
            settingsMenu.classList.add('hidden');
        }
    });

    const freeSpaceIndex = Math.floor(gridSize * gridSize / 2);

    const bingoItems = [
        '"Make it happen"',
        'Slaps someone',
        'Dancing to Rumpshaker',
        'Went to the buffet for a single item',
        'Drunkenly eating carbs like a raccoon',
        'Read a book by the pool',
        'Visited the gym',
        'Dance sliding across the floor on her knees',
        'Stopping to look at her back in a mirror',
        'Drinking Whiskey',
        'Calling someone a "beautiful dummy"',
        'Finding/trying to pet a cat',
        'Flexing',
        'Danced at the club',
        'Throwing food',
        'Got a sunburn',
        'Befriending a stranger',
        'Icing her feet',
        'Saying "I run hot" while fanning herself',
        'Giving the middle finger',
        'Says "Spider Craig"',
        'Gets a second serving of a Thanksgiving side',
        '"I am who I am"',
        'Ordered a drink with an umbrella',
        'Participated in a cheesy cruise game'
    ];

    let markedSquares = [];

    function generateCard() {
        bingoCard.innerHTML = '';
        markedSquares = JSON.parse(localStorage.getItem('markedSquares')) || [];
        let shuffledItems = JSON.parse(localStorage.getItem('bingoItems'));

        if (!shuffledItems) {
            console.log('Generating new shuffled items');
            shuffledItems = [...bingoItems].sort(() => 0.5 - Math.random());
            localStorage.setItem('bingoItems', JSON.stringify(shuffledItems));
        } else {
            console.log('Loaded shuffled items from localStorage');
        }

        for (let i = 0; i < gridSize * gridSize; i++) {
            const square = document.createElement('div');
            square.classList.add('bingo-square');
            square.dataset.index = i;

            if (i === freeSpaceIndex) {
                square.textContent = 'FREE';
                square.classList.add('free', 'marked');
            } else {
                const itemIndex = i < freeSpaceIndex ? i : i - 1;
                square.textContent = shuffledItems[itemIndex];
            }

            if (markedSquares.includes(i)) {
                square.classList.add('marked');
            }

            square.addEventListener('click', (e) => toggleMark(square, i, e));
            bingoCard.appendChild(square);
        }
    }

    function toggleMark(square, index, event) {
        if (index === freeSpaceIndex) return; // Cannot unmark the free space

        square.classList.toggle('marked');

        if (square.classList.contains('marked')) {
            if (!markedSquares.includes(index)) {
                markedSquares.push(index);
                
                // Small confetti burst on click
                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { 
                        x: event.clientX / window.innerWidth, 
                        y: event.clientY / window.innerHeight 
                    },
                    disableForReducedMotion: true
                });

                if (checkWin()) {
                    triggerWin();
                }
            }
        } else {
            markedSquares = markedSquares.filter(item => item !== index);
        }

        localStorage.setItem('markedSquares', JSON.stringify(markedSquares));
    }

    function checkWin() {
        const wins = [
            [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], // Rows
            [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], // Cols
            [0, 6, 12, 18, 24], [4, 8, 12, 16, 20] // Diagonals
        ];

        const isMarked = (i) => markedSquares.includes(i) || i === freeSpaceIndex;

        return wins.some(combo => combo.every(index => isMarked(index)));
    }

    function triggerWin() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    resetButton.addEventListener('click', () => {
        settingsMenu.classList.add('hidden'); // Close menu
        if (confirm('Start a new game? This will clear your current card.')) {
            localStorage.removeItem('markedSquares');
            localStorage.removeItem('bingoItems');
            generateCard();
        }
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('Service Worker registered with scope: ', registration.scope))
                .catch(error => console.log('Service Worker registration failed: ', error));
        });

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange',
            () => {
                if (refreshing) return;
                refreshing = true;
                const updateNotification = document.getElementById('update-notification');
                updateNotification.style.display = 'block';
                const reloadButton = document.getElementById('reload-button');
                reloadButton.onclick = () => {
                    window.location.reload();
                };
            }
        );
    }

    generateCard();
});
