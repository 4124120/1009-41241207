const images = [
    'image/ant1.png', 'image/ant2.png', 'image/ant3.png', 'image/ant4.png',
    'image/ant5.png', 'image/ant6.png', 'image/ant7.png', 'image/ant8.png'
];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer, startTime;
let gameStarted = false; // 新增變數來控制遊戲是否開始

document.getElementById('start-game').addEventListener('click', startGame);

function startGame() {
    const gridSize = parseInt(document.getElementById('grid-select').value);
    const countdownTime = parseInt(document.getElementById('timer-select').value);
    const duplicatedImages = [...images, ...images].slice(0, (gridSize * gridSize) / 2);
    const shuffledImages = [...duplicatedImages, ...duplicatedImages].sort(() => 0.5 - Math.random());

    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // 清空遊戲版面
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    gameStarted = false; // 遊戲開始前先設為 false

    gameBoard.className = `game-board grid-${gridSize}x${gridSize}`;

    // 生成卡片
    shuffledImages.forEach(imgSrc => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="background-image: url('${imgSrc}');"></div>
                <div class="card-back" style="background-image: url('image/back.jpg');"></div>
            </div>
        `;
        card.addEventListener('click', () => {
            if (gameStarted) flipCard(card); // 僅在遊戲開始後才允許翻牌
        });
        gameBoard.appendChild(card);
        cards.push(card);
    });

    // 設置開始時間
    startTime = Date.now();

    // 倒數計時翻回背面
    let countdown = countdownTime;
    document.getElementById('timer').textContent = `倒數計時：${countdown}秒`;
    timer = setInterval(() => {
        countdown--;
        document.getElementById('timer').textContent = `倒數計時：${countdown}秒`;
        if (countdown === 0) {
            clearInterval(timer);
            flipAllCardsBack(); // 倒數完畢後翻回背面
            gameStarted = true; // 計時結束後允許遊戲進行
        }
    }, 1000);
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flip')) {
        card.classList.add('flip');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstImg = firstCard.querySelector('.card-front').style.backgroundImage;
    const secondImg = secondCard.querySelector('.card-front').style.backgroundImage;

    if (firstImg === secondImg) {
        matchedPairs++;
        flippedCards = [];
        
        // 檢查是否配對完成
        if (matchedPairs === cards.length / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            flippedCards = [];
        }, 1000);
    }
}

// 結束遊戲並顯示結果
function endGame() {
    clearInterval(timer); // 停止倒數計時
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000); // 計算花費的秒數
    alert(`恭喜！你完成了記憶遊戲！總花費時間：${totalTime}秒`);
}

// 將所有卡片翻到背面
function flipAllCardsBack() {
    cards.forEach(card => card.classList.remove('flip'));
}
