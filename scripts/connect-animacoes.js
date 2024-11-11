const cells = document.querySelectorAll('.cell');
const arrowIndicator = document.querySelector('.arrow-indicator');

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
                cell.style.backgroundColor = 'var(--vermelho)';
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
