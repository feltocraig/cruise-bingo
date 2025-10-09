document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingo-card');
    const resetButton = document.getElementById('reset-button');
    const gridSize = 5;
    const freeSpaceIndex = Math.floor(gridSize * gridSize / 2);

    const bingoItems = [
        'Spotted a dolphin',
        'Attended a show',
        'Used the hot tub',
        'Ate at the buffet',
        'Took a nap',
        'Read a book by the pool',
        'Visited the gym',
        'Won a trivia game',
        'Met the captain',
        'Drank a cocktail',
        'Watched the sunset',
        'Woke up early for sunrise',
        'Took a photo with a crew member',
        'Danced at the club',
        'Played shuffleboard',
        'Got a sunburn',
        'Visited the art gallery',
        'Sent a postcard',
        'Learned a new towel animal',
        'Tried a new food',
        'Went to the casino',
        'People watching',
        'Listened to live music',
        'Took a formal night photo',
        'Saw a flying fish'
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

            square.addEventListener('click', () => toggleMark(square, i));
            bingoCard.appendChild(square);
        }
    }

    function toggleMark(square, index) {
        if (index === freeSpaceIndex) return; // Cannot unmark the free space

        square.classList.toggle('marked');

        if (square.classList.contains('marked')) {
            if (!markedSquares.includes(index)) {
                markedSquares.push(index);
            }
        } else {
            markedSquares = markedSquares.filter(item => item !== index);
        }

        localStorage.setItem('markedSquares', JSON.stringify(markedSquares));
    }

    resetButton.addEventListener('click', () => {
        localStorage.removeItem('markedSquares');
        localStorage.removeItem('bingoItems');
        generateCard();
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('Service Worker registered with scope: ', registration.scope))
                .catch(error => console.log('Service Worker registration failed: ', error));
        });
    }

    generateCard();
});
