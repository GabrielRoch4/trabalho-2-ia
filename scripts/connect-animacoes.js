const cells = document.querySelectorAll('.cell');
const arrowIndicator = document.querySelector('.arrow-indicator');
const playerName = document.querySelector('#username')
const algorithm = document.querySelector('#algorithm')
const difficulty = document.querySelector('#difficulty')
let score1 = 0 
let score2 = 0
let score = score1+" x "+score2

document.querySelector("#player-name-display").innerHTML = playerName
document.querySelector(".score").innerHTML = score
document.querySelector(".score").innerHTML = score
document.querySelector("#algorithm-display").innerHTML = algorithm
document.querySelector("#difficulty-display").innerHTML = difficulty

// Função para identificar a coluna e colorir a próxima célula vazia com animação
function colorNextEmptyCell(event) {
    const cellId = event.target.id;
    const column = cellId.split(',')[1]; // Obtém o número da coluna do id

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

    // Itera de baixo para cima para encontrar a próxima célula vazia
    for (let row = 6; row >= 0; row--) {
        const cell = document.getElementById(`${row},${column}`);
        if (cell && cell.style.backgroundColor === '') {
            // Adiciona a classe de animação de queda
            cell.classList.add('falling');

            // Define a cor após a animação
            setTimeout(() => {
                cell.style.backgroundColor = 'var(--vermelho)';  // Ou a cor desejada
            }, 500); // O tempo de animação (500ms) para que a cor seja aplicada após a queda
            break; // Interrompe o loop após encontrar e colorir a célula vazia
        }
    }
}

// Adiciona o evento de clique para cada célula
cells.forEach(cell => {
    cell.addEventListener('click', colorNextEmptyCell);
});

// Funções existentes para o indicador de seta e destaque de coluna
function highlightColumn(event) {
    const cellId = event.target.id;
    const column = cellId.split(',')[1]; // Obtém o número da coluna do id
    document.querySelectorAll(`.cell[id$=",${column}"]`).forEach(cell => {
        cell.classList.add('highlight');
    });
}

function removeHighlight(event) {
    const cellId = event.target.id;
    const column = cellId.split(',')[1];
    document.querySelectorAll(`.cell[id$=",${column}"]`).forEach(cell => {
        cell.classList.remove('highlight');
    });
}

function showArrow(event) {
    const cellId = event.target.id;
    const column = cellId.split(',')[1];
    const cellRect = event.target.getBoundingClientRect();
    const indicatorRect = document.querySelector('.indicator').getBoundingClientRect();
    arrowIndicator.style.left = `${cellRect.left + cellRect.width / 2 - indicatorRect.left}px`;
    arrowIndicator.style.display = 'block';
}

function hideArrow() {
    arrowIndicator.style.display = 'none';
}

// Adiciona os eventos para o indicador de seta e destaque de coluna
cells.forEach(cell => {
    cell.addEventListener('mouseover', highlightColumn);
    cell.addEventListener('mouseout', removeHighlight);
    cell.addEventListener('mouseover', showArrow);
    cell.addEventListener('mouseout', hideArrow);
});

// Carregar os dados do LocalStorage assim que a página for carregada
window.addEventListener('load', function() {
    // Recuperando os dados do LocalStorage
    const playerName = localStorage.getItem('playerName');
    const algorithm = localStorage.getItem('algorithm');
    const difficulty = localStorage.getItem('difficulty');

    // Atualizando a interface com os dados
    if (playerName) {
        document.getElementById('player-name-display').textContent = playerName;
    }
    if (algorithm) {
        document.getElementById('algorithm-display').textContent = algorithm === 'minimax' ? 'Mini-Max' : 'Alfa-Beta';
    }
    if (difficulty) {
        const difficultyNames = ['Fácil', 'Médio', 'Difícil', 'Experiente'];
        document.getElementById('difficulty-display').textContent = difficultyNames[difficulty - 1];
    }
});

// Inicialização do cronômetro
let timer = 0;
let timerInterval;
const timerDisplay = document.querySelector('.timer');

// Função para iniciar o cronômetro
function startTimer() {
    // Limpa qualquer intervalo anterior
    clearInterval(timerInterval);

    // Inicia o cronômetro
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        // Atualiza a exibição do cronômetro no formato mm:ss
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000); // Atualiza a cada 1 segundo
}

// Função para parar o cronômetro (caso precise mais tarde)
function stopTimer() {
    clearInterval(timerInterval);
}

// Para exemplo, vamos iniciar o cronômetro ao carregar a página
window.addEventListener('load', function() {
    startTimer(); // Inicia o cronômetro assim que a página for carregada
});

