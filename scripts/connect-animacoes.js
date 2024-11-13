const cells = document.querySelectorAll('.cell');
const arrowIndicator = document.querySelector('.arrow-indicator');
const timerDisplay = document.querySelector('.timer');
let score1 = 0;
let score2 = 0;
let timer = 0;
let timerInterval;

// Recupera o nome do jogador a partir da URL ou usa um valor padrão
const playerName = new URLSearchParams(window.location.search).get('playerName') || 'Jogador 1';
const playerDisplay = document.querySelector("#player-name-display");
playerDisplay.textContent = playerName;

// Variável para controlar o turno. true para Jogador 1 e false para Dani IA.
let isPlayerOneTurn = true;

// Exibe o placar inicial
document.querySelector(".score").innerHTML = `${score1} x ${score2}`;

// Função para atualizar a exibição do turno
function updateTurnDisplay() {
    const currentPlayerName = isPlayerOneTurn ? playerName : "Dani IA";
    const currentPlayerColor = isPlayerOneTurn ? 'var(--vermelho)' : 'var(--verde)';
    
    document.getElementById('current-player').textContent = currentPlayerName;
    document.getElementById('turn-message').style.color = currentPlayerColor;
}

// Função para colorir a próxima célula vazia na coluna
function colorNextEmptyCell(event, chosenColumn = null) {
    const column = chosenColumn || event.target.id.split(',')[1];

    // Verifica se todas as células da coluna estão preenchidas
    let allFilled = true;
    for (let row = 0; row <= 6; row++) {
        const cell = document.getElementById(`${row},${column}`);
        if (cell && cell.style.backgroundColor === '') {
            allFilled = false;
            break;
        }
    }

    if (allFilled) {
        console.log("Todas as células desta coluna estão preenchidas!");
        if (!isPlayerOneTurn) makeIAMove(); // IA tenta outra jogada
        return;
    }

    // Define a cor da célula com base no turno atual
    const cellColor = isPlayerOneTurn ? 'var(--vermelho)' : 'var(--verde)';
    
    // Encontra e colore a próxima célula vazia de baixo para cima
    for (let row = 6; row >= 0; row--) {
        const cell = document.getElementById(`${row},${column}`);
        if (cell && cell.style.backgroundColor === '') {
            console.log(`O jogador ${isPlayerOneTurn ? playerName : "Dani IA"} jogou na posição ${row},${column}.`);
            cell.classList.add('falling');
            setTimeout(() => {
                cell.style.backgroundColor = cellColor;
                if (checkVictory(row, column, cellColor)) {
                    endGame(isPlayerOneTurn ? playerName : "Dani IA");
                } else if (checkDraw()) {
                    endGame("Empate");
                } else {
                    // Alterna o turno após a jogada
                    isPlayerOneTurn = !isPlayerOneTurn;
                    updateTurnDisplay();

                    // Verifica se é a vez da IA e realiza a jogada da IA
                    if (!isPlayerOneTurn) {
                        console.log("Dani IA está se preparando para jogar...");
                        setTimeout(makeIAMove, 1000); // Delay de 1 segundo para a jogada da IA
                    }
                }
            }, 500);
            break;
        }
    }
}

// Função para a IA escolher e realizar uma jogada
function makeIAMove() {
    const startTime = performance.now();
    
    // IA escolhe uma coluna aleatória que ainda tenha células vazias
    let chosenColumn;
    do {
        chosenColumn = Math.floor(Math.random() * 7); // Escolhe entre colunas 0 a 6
        const topCell = document.getElementById(`0,${chosenColumn}`);
        if (!topCell || topCell.style.backgroundColor === '') break;
    } while (true);

    // Calcula o tempo da jogada da IA
    const endTime = performance.now();
    console.log(`Dani IA encontrou uma jogada em ${(endTime - startTime) / 1000} segundos.`);

    // Realiza a jogada da IA
    const cell = document.querySelector(`.cell[id$=",${chosenColumn}"]`);
    colorNextEmptyCell({ target: cell }, chosenColumn);
}

// Função para verificar se houve vitória
function checkVictory(row, col, color) {
    // Verifica horizontalmente
    for (let c = Math.max(0, col - 3); c <= Math.min(6, col + 3); c++) {
        if (checkLine(row, c, 0, 1, color)) {
            return true;
        }
    }

    // Verifica verticalmente
    for (let r = Math.max(0, row - 3); r <= Math.min(6, row + 3); r++) {
        if (checkLine(r, col, 1, 0, color)) {
            return true;
        }
    }

    // Verifica diagonal (principal)
    for (let d = -3; d <= 3; d++) {
        if (checkLine(row + d, col + d, 1, 1, color)) {
            return true;
        }
    }

    // Verifica diagonal (secundária)
    for (let d = -3; d <= 3; d++) {
        if (checkLine(row + d, col - d, 1, -1, color)) {
            return true;
        }
    }

    return false;
}

// Função auxiliar para verificar uma linha
function checkLine(row, col, rowDir, colDir, color) {
    let count = 0;
    for (let i = 0; i < 4; i++) {
        const cell = document.getElementById(`${row + i * rowDir},${col + i * colDir}`);
        if (cell && cell.style.backgroundColor === color) {
            count++;
        } else {
            break;
        }
    }
    return count === 4;
}

// Função para verificar se houve empate
function checkDraw() {
    return Array.from(cells).every(cell => cell.style.backgroundColor !== '');
}

// Função para finalizar o jogo
function endGame(winner) {
    stopTimer();
    if (winner === "Empate") {
        console.log("Empate! O jogo terminou sem vencedor.");
    } else {
        console.log(`${winner} venceu!`);
        if (winner === playerName) {
            score1++;
        } else {
            score2++;
        }
        document.querySelector(".score").innerHTML = `${score1} x ${score2}`;
    }
    resetBoard();
}

// Função para resetar o tabuleiro
function resetBoard() {
    setTimeout(() => {
        console.log("Tabuleiro resetado.");
        cells.forEach(cell => cell.style.backgroundColor = '');
        startTimer(); // Reinicia o cronômetro
        isPlayerOneTurn = true; // Reinicia o turno
        updateTurnDisplay();
    }, 3000); // Atraso de 1 segundo antes de resetar o tabuleiro
}

// Funções para manipular o destaque de coluna e indicador de seta
function highlightColumn(event) {
    const column = event.target.id.split(',')[1];
    document.querySelectorAll(`.cell[id$=",${column}"]`).forEach(cell => {
        cell.classList.add('highlight');
    });
}

function removeHighlight(event) {
    const column = event.target.id.split(',')[1];
    document.querySelectorAll(`.cell[id$=",${column}"]`).forEach(cell => {
        cell.classList.remove('highlight');
    });
}

function showArrow(event) {
    const cellRect = event.target.getBoundingClientRect();
    const indicatorRect = document.querySelector('.indicator').getBoundingClientRect();
    arrowIndicator.style.left = `${cellRect.left + cellRect.width / 2 - indicatorRect.left}px`;
    arrowIndicator.style.display = 'block';
}

function hideArrow() {
    arrowIndicator.style.display = 'none';
}

// Funções do cronômetro
function startTimer() {
    clearInterval(timerInterval);
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Eventos das células
cells.forEach(cell => {
    cell.addEventListener('click', colorNextEmptyCell);
    cell.addEventListener('mouseover', highlightColumn);
    cell.addEventListener('mouseout', removeHighlight);
    cell.addEventListener('mouseover', showArrow);
    cell.addEventListener('mouseout', hideArrow);
});

// Eventos de carregamento da página
window.addEventListener('load', () => {
    updateTurnDisplay(); // Inicializa a exibição do turno
    startTimer();
});
