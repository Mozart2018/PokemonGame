let score1 = 0;
let score2 = 0;
let currentPlayer = 1;
let gameInterval;
let countdownInterval;
let timer = 30; // 設定為 30 秒
const holes = document.querySelectorAll('.hole');
const scoreDisplay1 = document.getElementById('score1');
const scoreDisplay2 = document.getElementById('score2');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart');
const victoryMessage = document.getElementById('victory');
const restartVictoryButton = document.getElementById('restart-victory');
const pokeball = document.getElementById('pokeball');
const pokeballImg = document.getElementById('pokeball-img');
const pokemonImage = 'pokemon.png'; // 替換為實際寶可夢圖片 URL
const penaltyPokemonImage = 'gastly.png'; // 瓦斯彈圖片 URL
const penaltyPokemonRedImage = 'gastly_red.png'; // 紅色瓦斯彈圖片 URL
const happinessEggImage = 'happiness_egg.png'; // 幸福蛋圖片 URL

// 新增音效
const bgMusic = new Audio('background_music.mp3'); // 背景音樂 URL
const scoreSound = new Audio('score_sound.mp3'); // 得分音效 URL
const penaltySound = new Audio('penalty_sound.mp3'); // 扣分音效 URL

let isDragging = false;
let isGameActive = false; // 遊戲是否處於活動狀態

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function showPokemon() {
    if (!isGameActive) return; // 若遊戲已停止則不顯示寶可夢

    // 確保每次最多出現 3 隻寶可夢
    const activePokemons = document.querySelectorAll('.hole .pokemon');
    if (activePokemons.length >= 3) return;

    // 隨機選擇最多 3 個洞來顯示寶可夢
    const holesToShow = [];
    while (holesToShow.length < 3) {
        const hole = randomHole();
        if (!holesToShow.includes(hole) && !hole.querySelector('.pokemon')) {
            holesToShow.push(hole);
        }
    }

    holesToShow.forEach(hole => {
        // 隨機決定寶可夢的類型
        const rand = Math.random();
        let pokemonType;

        if (rand < 0.1) {
            pokemonType = penaltyPokemonImage; // 10% 機率顯示扣分寶可夢（瓦斯彈）
        } else if (rand < 0.2) {
            pokemonType = happinessEggImage; // 10% 機率顯示幸福蛋
        } else {
            pokemonType = pokemonImage; // 80% 機率顯示得分寶可夢
        }

        const pokemon = document.createElement('div');
        pokemon.classList.add('pokemon');
        pokemon.style.backgroundImage = `url('${pokemonType}')`;
        pokemon.style.transition = 'opacity 0.5s'; // 添加過渡效果
        hole.appendChild(pokemon);

        // 隨機設定寶可夢顯示的時間
        const displayTime = Math.floor(Math.random() * 1000) + 500; // 寶可夢顯示 500 到 1500 毫秒
        setTimeout(() => {
            if (hole.contains(pokemon)) {
                pokemon.style.opacity = '0'; // 添加漸變效果
                setTimeout(() => {
                    hole.removeChild(pokemon);
                }, 500); // 500 毫秒後移除寶可夢
            }
        }, displayTime);
    });
}

function increaseScore(amount) {
    if (currentPlayer === 1) {
        score1 += amount;
        scoreDisplay1.textContent = score1;
    } else {
        score2 += amount;
        scoreDisplay2.textContent = score2;
    }

    // 顯示得分特效
    const effect = document.createElement('div');
    effect.classList.add('score-effect');
    effect.textContent = `+${amount}`;
    effect.style.left = `${Math.random() * window.innerWidth}px`;
    effect.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(effect);

    // 播放音效
    scoreSound.play();

    setTimeout(() => {
        document.body.removeChild(effect);
    }, 500); // 特效顯示 500 毫秒後移除
}

function decreaseScore() {
    if (currentPlayer === 1) {
        score1 = Math.max(score1 - 1, 0); // 防止分數為負數
        scoreDisplay1.textContent = score1;
    } else {
        score2 = Math.max(score2 - 1, 0); // 防止分數為負數
        scoreDisplay2.textContent = score2;
    }

    // 播放扣分音效
    penaltySound.play();
}

function startGame() {
    // 播放背景音樂
    bgMusic.loop = true;
    bgMusic.play();

    // 重置分數和計時器
    timer = 30;
    timerDisplay.textContent = timer;
    victoryMessage.classList.add('hidden');
    restartButton.classList.add('hidden');
    restartVictoryButton.classList.add('hidden');

    isGameActive = true;
    gameInterval = setInterval(showPokemon, Math.floor(Math.random() * 500) + 500); // 隨機間隔 500 到 1000 毫秒
    countdownInterval = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    stopGame();
    bgMusic.pause(); // 停止背景音樂
    const winner = score1 > score2 ? '玩家 1 勝利！' : (score2 > score1 ? '玩家 2 勝利！' : '平手！');
    document.getElementById('winner').textContent = winner;
    victoryMessage.classList.remove('hidden');

    // 顯示重新開始按鈕
    restartButton.classList.remove('hidden');
}

function stopGame() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    isGameActive = false;
}

function switchPlayer() {
    // 自動切換到下一個玩家
    if (currentPlayer === 1) {
        currentPlayer = 2;
        document.getElementById('start-player1').disabled = true;
        document.getElementById('start-player2').disabled = false;
        alert('玩家 1 完成，現在是玩家 2 的時間！');
    } else {
        currentPlayer = 1;
        document.getElementById('start-player1').disabled = false;
        document.getElementById('start-player2').disabled = true;
        alert('玩家 2 完成，現在是玩家 1 的時間！');
    }

    // 顯示重新開始按鈕
    restartButton.classList.add('hidden');
    restartVictoryButton.classList.add('hidden');
}

function onPokeballMouseDown(e) {
    isDragging = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e) {
    if (isDragging) {
        pokeball.style.left = `${e.clientX - pokeball.offsetWidth / 2}px`;
        pokeball.style.top = `${e.clientY - pokeball.offsetHeight / 2}px`;
    }
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

holes.forEach(hole => {
    hole.addEventListener('click', () => {
        const pokemonElement = hole.querySelector('.pokemon');
        if (pokemonElement) {
            const pokemonType = pokemonElement.style.backgroundImage;
            if (pokemonType.includes(penaltyPokemonImage)) {
                pokemonElement.style.backgroundImage = `url('${penaltyPokemonRedImage}')`; // 改為紅色瓦斯彈
                setTimeout(() => {
                    hole.removeChild(pokemonElement);
                    decreaseScore();
                }, 200); // 顯示紅色效果 200 毫秒後才扣分
            } else if (pokemonType.includes(happinessEggImage)) {
                pokemonElement.remove();
                increaseScore(3); // 幸福蛋加 3 分
            } else {
                increaseScore(1); // 普通寶可夢加 1 分
                hole.removeChild(pokemonElement);
            }
        }
    });
});

pokeball.addEventListener('mousedown', onPokeballMouseDown);

restartButton.addEventListener('click', () => {
    window.location.reload(); // 重新加載頁面以重啟遊戲
});

restartVictoryButton.addEventListener('click', () => {
    window.location.reload(); // 重新加載頁面以重啟遊戲
});

document.getElementById('start-player1').addEventListener('click', () => {
    switchPlayer();
    startGame();
});

document.getElementById('start-player2').addEventListener('click', () => {
    switchPlayer();
    startGame();
});
