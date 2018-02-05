const rows = 22;
const cells = 10;
const borderSize = 1;

let matrix = document.getElementById('tetris');
let cellSize = Math.min((matrix.clientHeight - borderSize * 2) / rows, (matrix.clientWidth - borderSize * 2) / cells);

matrix.style.position = 'relative';
matrix.style.height = cellSize * rows + 'px';
matrix.style.width = cellSize * cells + 'px';
matrix.style.borderWidth = borderSize + 'px';
matrix.style.borderStyle = 'solid';
matrix.style.borderColor = 'grey';

function createMino(row, cell, backgroundColor) {
  let mino = document.createElement('div');
  mino.style.height = cellSize + 'px';
  mino.style.width = cellSize + 'px';
  mino.style.position = 'absolute';
  mino.style.backgroundColor = backgroundColor;
  moveMino(mino, row, cell);
  matrix.appendChild(mino);
  return mino;
}

function moveMino(mino, row, cell) {
  mino.style.top = cellSize * row + 'px';
  mino.style.left = cellSize * cell + 'px';
  mino.dataset.row = row;
  mino.dataset.cell = cell;
}

function createITetrimino() {
  let tetrimino = [];
  tetrimino.push(createMino(1, 3, 'black'));
  tetrimino.push(createMino(1, 4, 'black'));
  tetrimino.push(createMino(1, 5, 'black'));
  tetrimino.push(createMino(1, 6, 'black'));
  return tetrimino;
}

let currentTetrimino = createITetrimino();

let dropTimer = window.setInterval(drop, 1000);

function drop() {
  if (!currentTetrimino) {
    return;
  }

  if (parseInt(currentTetrimino[0].dataset.row) < rows - 1) {
    for (let mino of currentTetrimino) {
      moveMino(mino, parseInt(mino.dataset.row) + 1, parseInt(mino.dataset.cell));
    }
  } else {
    currentTetrimino = null;
  }
}