import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import { Universe } from "wasm-game-of-life";

const CELL_SIZE = 1; // px
const DEAD_COLOR = "#315b99";
const ALIVE_COLOR = "#9aeeee";

// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const renderLoop = () => {
  universe.tick();
  drawCells();
  setTimeout(() => requestAnimationFrame(renderLoop), 10);
};


const getIndex = (row, column) => {
  return row * width + column;
};

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << (n % 8);
  return (arr[byte] & mask) === mask;
};

const drawCells = () => {
  const cellsPtr = universe.cells();

  // This is updated!
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height / 8);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      // This is updated!
      ctx.fillStyle = bitIsSet(idx, cells)
        ? ALIVE_COLOR
        : DEAD_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) ,
        row * (CELL_SIZE + 1) ,
        CELL_SIZE + 1,
        CELL_SIZE + 1
      );
    }
  }

  ctx.stroke();
};


drawCells();
requestAnimationFrame(renderLoop);

