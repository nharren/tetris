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

function createITetrimino() {
  return [
    createMino(1, 3, 'black'),
    createMino(1, 4, 'black'),
    createMino(1, 5, 'black'),
    createMino(1, 6, 'black')
  ]
}

function moveMino(mino, row, cell) {
  mino.style.top = cellSize * row + 'px';
  mino.style.left = cellSize * cell + 'px';
  mino.dataset.row = row;
  mino.dataset.cell = cell;
}


function getMinoRow(mino) {
  return parseInt(mino.dataset.row);
}

function getMinoCell(mino) {
  return parseInt(mino.dataset.cell);
}


function getMinoCells() {
  return currentTetrimino.map(getMinoCell);
}

function getMinoRows() {
  return currentTetrimino.map(getMinoRow);
}


function getMaxMinoCell() {
  return Math.max(...getMinoCells());
}

function getMinMinoCell() {
  return Math.min(...getMinoCells());
}

function getMaxMinoRow() {
  return Math.max(...getMinoRows());
}


function canMoveTetriminoDown() {
  return getMaxMinoRow() < rows - 1;
}

function canMoveTetriminoLeft() {
  return getMinMinoCell() > 0 && canMoveTetriminoDown();
}

function canMoveTetriminoRight() {
  return getMaxMinoCell() + 1 < cells && canMoveTetriminoDown();
}


function moveTetrimino(rowDelta, cellDelta) {
  for (let mino of currentTetrimino) {
    moveMino(mino, getMinoRow(mino) + rowDelta, getMinoCell(mino) + cellDelta);
  }
}


function moveTetriminoDown() {
  moveTetrimino(1, 0);
}

function moveTetriminoLeft() {
  moveTetrimino(0, -1);
}

function moveTetriminoRight() {
  moveTetrimino(0, 1);
}


function handleKeyDown(e) {
  if (!currentTetrimino) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      if (canMoveTetriminoLeft())
        moveTetriminoLeft();
      break;
    case 'ArrowRight':
    case 'd':
      if (canMoveTetriminoRight())
        moveTetriminoRight();
      break;
    case 'ArrowDown':
    case 's':
      if (canMoveTetriminoDown())
        moveTetriminoDown();
      break;
    default:
      break;
  }
  
}

function handleDropTimerTick() {
  if (!currentTetrimino) {
    return;
  }

  if (canMoveTetriminoDown()) {
    moveTetriminoDown();
  } else {
    currentTetrimino = null;
  }
}

let currentTetrimino = createITetrimino();
document.addEventListener('keydown', handleKeyDown);
let dropTimer = window.setInterval(handleDropTimerTick, 1000);
