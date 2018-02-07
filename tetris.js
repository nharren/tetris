const rows = 22;
const cells = 10;
const borderSize = 1;

let tetrimino;
let orientation;
let type;
let template;
let origin;

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

function createI() {
  orientation = 0;
  type = 'I';
  template = [
    [1,0],
    [1,1],
    [1,2],
    [1,3]
  ];
  origin = [0,3];
  tetrimino = [];
  for (let point of template) {
    tetrimino.push(createMino(origin[0] + point[0], origin[1] + point[1], 'black'));
  }
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
  return tetrimino.map(getMinoCell);
}

function getMinoRows() {
  return tetrimino.map(getMinoRow);
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


function canMoveDown() {
  return getMaxMinoRow() < rows - 1;
}

function canMoveLeft() {
  return getMinMinoCell() > 0 && canMoveDown();
}

function canMoveRight() {
  return getMaxMinoCell() + 1 < cells && canMoveDown();
}


function move(rowDelta, cellDelta) {
  for (let mino of tetrimino) {
    moveMino(mino, getMinoRow(mino) + rowDelta, getMinoCell(mino) + cellDelta);
  }
}


function moveDown() {
  move(1, 0);
}

function moveLeft() {
  move(0, -1);
}

function moveRight() {
  move(0, 1);
}





function canRotateClockwise() {
  switch (type) {
    case 'I':
      return canRotateIClockwise();
    default:
      break;
  }
}

function canRotateIClockwise() {
  for (let rotationPoint of rotationPointsI) {

  }
}

function canRotateCounterclockwise() {

}


const rotationPointsI = [
  [
    [1,1],
    [1,0],
    [1,3],
    [1,0],
    [1,3]
  ],
  [
    [1,1],
    [1,2],
    [1,2],
    [0,2],
    [3,2]
  ],
  [
    [1,1],
    [1,3],
    [0,1],
    [2,3],
    [3,0]
  ],
  [
    [1,1],
    [1,1],
    [1,1],
    [3,1],
    [0,1]
  ]
];


function rotateClockwise() {
  orientation = (orientation + 1) % 4;
}

function rotateCounterclockwise() {
  orientation = (orientation - 1) % 4;
}


function handleKeyDown(e) {
  if (!tetrimino) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      if (canMoveLeft())
        moveLeft();
      break;
    case 'ArrowRight':
      if (canMoveRight())
        moveRight();
      break;
    case 'ArrowDown':
      if (canMoveDown())
        moveDown();
      break;
    case 'ArrowUp':
    case 'x':
      if (canRotateClockwise())
        rotateClockwise();
      break;
    case 'Control':
      if (canRotateCounterclockwise())
        rotateCounterclockwise();
    default:
      break;
  }
  
}

function handleDropTimerTick() {
  if (!tetrimino) {
    return;
  }

  if (canMoveDown()) {
    moveDown();
  } else {
    tetrimino = null;
  }
}

createI();
document.addEventListener('keydown', handleKeyDown);
let dropTimer = window.setInterval(handleDropTimerTick, 1000);
