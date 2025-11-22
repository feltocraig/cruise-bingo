document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingo-card');
    const resetButton = document.getElementById('reset-button');
    const gridSize = 5;
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
        'Drinking Champagne',
        'Calling someone a "beautiful dummy',
        'Finding/trying to pet a cat',
        'Flexing',
        'Danced at the club',
        'Throwing food',
        'Got a sunburn',
        'Befriending a stanger',
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
