// Seleciona todas as células
const cells = document.querySelectorAll('.cell');

// Função para identificar a coluna
function highlightColumn(event) {
    const cellId = event.target.id;
    const column = cellId.split(',')[1]; // Obtém o número da coluna do id
    console.log(`Coluna: ${column}`); // Exibe a coluna no console ou realiza outra ação desejada

    // Adiciona a classe de destaque a todas as células dessa coluna
    document.querySelectorAll(`.cell[id$=",${column}"]`).forEach(cell => {
        cell.classList.add('highlight');
    });
}

// Remove o destaque da coluna quando o cursor sai
function removeHighlight(event) {
    const cellId = event.target.id;
    const column = cellId.split(',')[1];
    document.querySelectorAll(`.cell[id$=",${column}"]`).forEach(cell => {
        cell.classList.remove('highlight');
    });
}

// Adiciona os eventos a cada célula
cells.forEach(cell => {
    cell.addEventListener('mouseover', highlightColumn);
    cell.addEventListener('mouseout', removeHighlight);
});

const arrowIndicator = document.querySelector('.arrow-indicator');

// Função para mostrar e posicionar a seta acima da coluna
function showArrow(event) {
    const cellId = event.target.id;
    const column = cellId.split(',')[1];

    // Calcula a posição da seta com base na célula
    const cellRect = event.target.getBoundingClientRect();
    const indicatorRect = document.querySelector('.indicator').getBoundingClientRect();

    // Centraliza a seta acima da coluna na div indicator
    arrowIndicator.style.left = `${cellRect.left + cellRect.width / 2 - indicatorRect.left}px`;
    arrowIndicator.style.display = 'block';
}

// Função para esconder a seta quando o cursor sai da coluna
function hideArrow() {
    arrowIndicator.style.display = 'none';
}

// Adiciona os eventos de mouseover e mouseout para cada célula
cells.forEach(cell => {
    cell.addEventListener('mouseover', showArrow);
    cell.addEventListener('mouseout', hideArrow);
});
