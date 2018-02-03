const rows = 20;
const columns = 10;

let tetris = document.getElementById('tetris');

let blockSize = Math.min(tetris.clientHeight / rows, tetris.clientWidth / columns);

tetris.style.position = 'relative';
tetris.style.height = blockSize * rows + 'px';
tetris.style.width = blockSize * columns + 'px';
tetris.style.border = '1px solid grey';
tetris.style.boxSizing = 'border-box';

let colorValue = 0;
let step = Math.floor(255 / (rows * columns));

for (let row = 0; row < rows; row++) {
  let top = blockSize * row + 'px';
  for (let column = 0; column < columns; column++) {
    let block = document.createElement('div');
    block.style.height = blockSize + 'px';
    block.style.width = blockSize + 'px';
    block.style.position = 'absolute';
    block.style.top = top;
    block.style.left = blockSize * column + 'px';
    block.style.backgroundColor = `rgb(${colorValue},${colorValue},${colorValue})`;
    tetris.appendChild(block);
    colorValue += step;
  }
}
