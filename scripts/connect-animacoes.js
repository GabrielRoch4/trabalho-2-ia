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

// Variável para controlar o turno. true para Jogador 1 e false para Jogador 2.
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
function colorNextEmptyCell(event) {
    const cellId = event.target.id;
    const column = cellId.split(',')[1];

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
        alert("Todas as células desta coluna estão preenchidas!");
        return;
    }

    // Define a cor da célula com base no turno atual
    const cellColor = isPlayerOneTurn ? 'var(--vermelho)' : 'var(--verde)';
    
    // Encontra e colore a próxima célula vazia de baixo para cima
    for (let row = 6; row >= 0; row--) {
        const cell = document.getElementById(`${row},${column}`);
        if (cell && cell.style.backgroundColor === '') {
            cell.classList.add('falling');
            setTimeout(() => {
                cell.style.backgroundColor = cellColor;
            }, 500);
            break;
        }
    }

    // Alterna o turno após a jogada
    isPlayerOneTurn = !isPlayerOneTurn;
    updateTurnDisplay();
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
