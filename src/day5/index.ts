import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cloneDeep } from 'lodash';

interface Line{
  start:{
    x:number,
    y:number,
  },
  end:{
    x:number,
    y:number,
  }
}

let highestX = 0;
let highestY = 0;

const parse = (item:string): Line => {
  const [start, end] = item.split(' -> ');
  const [x1, y1] = start.split(',');
  const [x2, y2] = end.split(',');
  if (Number(x1) > highestX) {
    highestX = Number(x1);
  }
  if (Number(x2) > highestX) {
    highestX = Number(x2);
  }
  if (Number(y1) > highestY) {
    highestY = Number(y1);
  }
  if (Number(y2) > highestY) {
    highestY = Number(y2);
  }
  return {
    start: {
      x: Number(x1),
      y: Number(y1),
    },
    end: {
      x: Number(x2),
      y: Number(y2),
    },
  };
};
const buildGrid = (x:number, y:number): number[][] => {
  const aofa: number[][] = [];
  for (let i = 0; i <= y; i += 1) {
    aofa[i] = [];
    for (let j = 0; j <= x; j += 1) {
      aofa[i][j] = 0;
    }
  }
  return aofa;
};

const addLineToGrid = (grid:number[][], line:Line) => {
  const newGrid = cloneDeep(grid);
  // line is vertical, through Y
  if (line.start.x === line.end.x) {
    if (line.start.y < line.end.y) {
      for (let i = line.start.y; i <= line.end.y; i += 1) {
        newGrid[i][line.start.x] = grid[i][line.start.x] + 1;
      }
      return newGrid;
    }
    for (let i = line.end.y; i <= line.start.y; i += 1) {
      newGrid[i][line.start.x] = grid[i][line.start.x] + 1;
    }
    return newGrid;
  }
  // line is horizontal through X
  if (line.start.y === line.end.y) {
    if (line.start.x < line.end.x) {
      for (let i = line.start.x; i <= line.end.x; i += 1) {
        newGrid[line.start.y][i] = grid[line.start.y][i] + 1;
      }
      return newGrid;
    }
    for (let i = line.end.x; i <= line.start.x; i += 1) {
      newGrid[line.start.y][i] = grid[line.start.y][i] + 1;
    }
    return newGrid;
  }
  // line is diagonal
  // there will be an equal number of x steps as y steps as it is 45 degrees
  if (line.start.x < line.end.x && line.start.y < line.end.y) {
    // positive diagonal
    const lineLength = line.end.x - line.start.x;
    for (let i = 0; i <= lineLength; i += 1) {
      newGrid[line.start.y + i][line.start.x + i] = grid[line.start.y + i][line.start.x + i] + 1;
    }
    return newGrid;
  }
  if (line.start.x > line.end.x && line.start.y > line.end.y) {
    // negative diagonal
    const lineLength = line.start.x - line.end.x;
    for (let i = 0; i <= lineLength; i += 1) {
      newGrid[line.start.y - i][line.start.x - i] = grid[line.start.y - i][line.start.x - i] + 1;
    }
    return newGrid;
  }
  if (line.start.x > line.end.x && line.start.y < line.end.y) {
    // x decending, y ascending
    const lineLength = line.start.x - line.end.x;
    console.log(lineLength);
    for (let i = 0; i <= lineLength; i += 1) {
      newGrid[i + line.start.y][line.start.x - i] = grid[i + line.start.y][line.start.x - i] + 1;
    }
  }
  if (line.start.x < line.end.x && line.start.y > line.end.y) {
    // x ascending, y descending
    const lineLength = line.end.x - line.start.x;
    console.log(lineLength);
    for (let i = 0; i <= lineLength; i += 1) {
      newGrid[line.start.y - i][i + line.start.x] = grid[line.start.y - i][i + line.start.x] + 1;
    }
  }
  return newGrid;
};

const flattenGrid = (grid:number[][]) => grid.map((col) => col.join('')).join('\n');

const addLinesToGrid = (grid:number[][], lines:Line[]) => {
  let newGrid = cloneDeep(grid);
  lines.forEach((line) => {
    newGrid = addLineToGrid(newGrid, line);
  });
  return newGrid;
};
const lines = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n').map(parse);

const grid = buildGrid(highestX, highestY);

// Part 1

const filteredLines = lines.filter((line) => (
  line.start.x === line.end.x
  || line.start.y === line.end.y));

const newGrid = addLinesToGrid(grid, filteredLines);
writeFileSync('output.txt', flattenGrid(newGrid), 'utf-8');

const result = newGrid.reduce((outerCount, outerCurr) => {
  const c = outerCurr
    .reduce((innerCount, innerCurr) => {
      if (innerCurr > 1) {
        return innerCount + 1;
      }
      return innerCount;
    }, 0);
  return outerCount + c;
}, 0);

console.log(result);

// part 2

const grid2 = buildGrid(highestX, highestY);

const newGrid2 = addLinesToGrid(grid2, lines);
writeFileSync('output.txt', flattenGrid(newGrid2), 'utf-8');

const result2 = newGrid2.reduce((outerCount, outerCurr) => {
  const c = outerCurr
    .reduce((innerCount, innerCurr) => {
      if (innerCurr > 1) {
        return innerCount + 1;
      }
      return innerCount;
    }, 0);
  return outerCount + c;
}, 0);

console.log(result2);
