const rows = 22;
const cells = 10;
const borderWidth = 1;
const doubleBorderWidth = borderWidth * 2;

const orientations = {
  north: 0,
  east: 1,
  south: 2,
  west: 3
}

const iTemplates = [
  [[0,1], [1,1], [2,1], [3,1]],
  [[2,0], [2,1], [2,2], [2,3]],
  [[0,2], [1,2], [2,2], [3,2]],
  [[1,0], [1,1], [1,2], [1,3]]
];

// iKicks[orientation][ccw/cw][attempt]
const iKicks = [
  [
    [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
    [[0,0], [-2,0], [1,0], [-2,-1], [1,2]]
  ],
  [
    [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
    [[0,0], [-1,0], [2,0], [-1,2], [2,-1]]
  ],
  [
    [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
    [[0,0], [2,0], [-1,0], [2,1], [-1,-2]]
  ],
  [
    [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
    [[0,0], [1,0], [-2,0], [1,-2], [-2,1]]
  ]
]

const kicks = [];

let tetromino;
let orientation;
let type;
let template;
let templates;
let origin;
let kick = [0,0];
let color;

let matrix = document.getElementById('tetris');
let cellSize = getCellSize();
matrix.style.position = 'relative';
matrix.style.height = cellSize * rows + 'px';
matrix.style.width = cellSize * cells + 'px';
matrix.style.borderWidth = borderWidth + 'px';
matrix.style.borderStyle = 'solid';
matrix.style.borderColor = 'grey';

function getCellSize() {
  return Math.min(getDesiredCellWidth(), getDesiredCellHeight());
}

function getDesiredCellWidth() {
  return getMatrixDesiredWidth() / rows;
}

function getDesiredCellHeight() {
  return getMatrixDesiredHeight() / cells;
}

function getMatrixDesiredWidth() {
  return matrix.clientHeight - doubleBorderWidth;
}

function getMatrixDesiredHeight() {
  return matrix.clientWidth - doubleBorderWidth;
}

function createMino(cell, row, backgroundColor) {
  let mino = document.createElement('div');
  mino.classList.add('mino', 'active');
  mino.style.height = cellSize + 'px';
  mino.style.width = cellSize + 'px';
  mino.style.position = 'absolute';
  mino.style.backgroundColor = backgroundColor;
  moveMino(mino, cell, row);
  matrix.appendChild(mino);
  return mino;
}

function generate() {
  generateI();
}

function generateI() {
  orientation = orientations.north;
  type = 'I';
  templates = iTemplates;
  origin = [3,0];
  color = 'lightblue';
  template = templates[orientation];
  tetromino = create();
}

function create() {
  return peek(template).map(point => createMino(...point, color));
}

function calculateMinoPoint(point) {
  return addPoints(addPoints(point, origin), kick);
}

function moveMino(mino, cell, row) {
  mino.style.top = getRowOffset(row) + 'px';
  mino.style.left = getCellOffset(cell) + 'px';
  mino.dataset.row = row;
  mino.dataset.cell = cell;
}


function getOffset(rowOrCell) {
  return cellSize * rowOrCell;
}

function getRowOffset(row) {
  return getOffset(row);
}

function getCellOffset(cell)  {
  return getOffset(cell);
}


function getMinoRow(mino) {
  return parseInt(mino.dataset.row);
}

function getMinoCell(mino) {
  return parseInt(mino.dataset.cell);
}

function getMinoPoint(mino) {
  return [getMinoCell(mino), getMinoRow(mino)];
}


function getMinoCells() {
  return tetromino.map(getMinoCell);
}

function getMinoRows() {
  return tetromino.map(getMinoRow);
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


function peekMoveDown() {
  return tetromino.map(getMinoPoint).map(p => [p[0], p[1] + 1]);
}

function peekMoveLeft() {
  return tetromino.map(getMinoPoint).map(p => [p[0] - 1, p[1]]);
}

function peekMoveRight() {
  return tetromino.map(getMinoPoint).map(p => [p[0] + 1, p[1]]);
}


function canMoveDown() {
  return !hasConflict(peekMoveDown());
}

function canMoveLeft() {
  return !hasConflict(peekMoveLeft());
}

function canMoveRight() {
  return !hasConflict(peekMoveRight());
}


function move(rowDelta, cellDelta) {
  for (let mino of tetromino) {
    moveMino(mino, getMinoCell(mino) + cellDelta, getMinoRow(mino) + rowDelta);
  }
  origin = [origin[0] + cellDelta, origin[1] + rowDelta];
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


function peekRotateClockwiseOrientation() {
  return (orientation + 1) % 4;
}

function peekRotateCounterclockwiseOrientation() {
  return (orientation + 3) % 4;
}


function canRotateClockwise() {
  return canKick(peekRotateClockwiseOrientation(), true, 0);
}

function canRotateCounterclockwise() {
  return canKick(peekRotateCounterclockwiseOrientation(), false, 0);
}


function rotateClockwise() {
  removeMinos(tetromino);
  orientation = peekRotateClockwiseOrientation();
  template = templates[orientation];
  tetromino = create();
}

function rotateCounterclockwise() {
  removeMinos(tetromino);
  orientation = peekRotateCounterclockwiseOrientation();
  template = templates[orientation];
  tetromino = create();
}


function removeMinos(minos) {
  minos.forEach(m => matrix.removeChild(m));
}


function hasConflict(points) {
  return hitsWall(points) || hitsStack(points);
}

function hitsWall(points, inactiveMinos) {
  return points.some(pointOutOfBounds);
}

function hitsStack(points) {
  return intersects(getInactiveMinoPoints(), points);
}


function pointOutOfBounds(point) {
  return cellOutOfBounds(point[0]) || rowOutOfBounds(point[1]);
}

function cellOutOfBounds(cell) {
  return cell < 0 || cell >= cells;
}

function rowOutOfBounds(row) {
  return row >= rows;
}


function intersects(pointArrayA, pointArrayB) {
  return pointArrayA.some(aPoint => pointArrayB.some(bPoint => arePointsEqual(aPoint, bPoint)));
}


function getActiveMinos() {
  return matrix.getElementsByClassName('mino active');
}

function getInactiveMinos() {
  return matrix.querySelectorAll('.mino:not(.active)');
}

function getInactiveMinoPoints() {
  return [...getInactiveMinos()].map(getMinoPoint);
}


function canKick(newOrientation, isClockwise, kickAttempt) {
  if (kickAttempt > 4) {
    return false;
  }

  kick = getKick(newOrientation, isClockwise, kickAttempt);
  let peekTetromino = peek(templates[newOrientation]);

  if (hasConflict(peekTetromino)) {
    return canKick(newOrientation, isClockwise, kickAttempt + 1);
  }

  return true;
}

function getKick(newOrientation, isClockwise, kickAttempt) {
  switch (type) {
    case 'I':
      return iKicks[newOrientation][+isClockwise][kickAttempt];
      break;
    case 'O':
      return [0,0];
    default:
      return kicks[newOrientation][+isClockwise][kickAttempt];
      break;
  }
}


function getMino(point) {
  return matrix.querySelector(`.mino[data-row="${point[0]}"][data-cell="${point[1]}"]`);
}

function pointsHaveMino(points) {
  return points.any(hasMino);
}

function pointHasMino(point) {
  return Boolean(getMino(point));
}

function peek(template) {
  return template.map(calculateMinoPoint);
}

function addPoints(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function arePointsEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}


function handleKeyDown(e) {
  if (!tetromino) {
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
  if (!tetromino) {
    return;
  }

  if (canMoveDown()) {
    moveDown();
  } else {
    inactivate();
    generate();
  }
}

function inactivate() {
  tetromino.forEach(setMinoInactive);
  tetromino = null;
}

function setMinoInactive(mino) {
  mino.classList.remove('active');
}


generateI();
document.addEventListener('keydown', handleKeyDown);
let dropTimer = window.setInterval(handleDropTimerTick, 1000);
