import { readFileSync } from 'fs';
import { join } from 'path';

const fyl = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n');

// part 1
const result = fyl.reduce((prev, command) => {
  const [dir, amount] = command.split(' ');
  switch (dir) {
    case 'up': {
      return { x: prev.x, y: prev.y - Number(amount) };
    }
    case 'down': {
      return { x: prev.x, y: prev.y + Number(amount) };
    }
    case 'forward': {
      return { x: prev.x + Number(amount), y: prev.y };
    }
    default: {
      throw Error(`unrecognised command ${dir}`);
    }
  }
}, { x: 0, y: 0 });

console.log(result.x * result.y);

// part 2
const result2 = fyl.reduce((prev, command) => {
  const [dir, amount] = command.split(' ');
  switch (dir) {
    case 'up': {
      return { x: prev.x, y: prev.y, aim: prev.aim - Number(amount) };
    }
    case 'down': {
      return { x: prev.x, y: prev.y, aim: prev.aim + Number(amount) };
    }
    case 'forward': {
      return { x: prev.x + Number(amount), y: prev.y + Number(amount) * prev.aim, aim: prev.aim };
    }
    default: {
      throw Error(`unrecognised command ${dir}`);
    }
  }
}, { x: 0, y: 0, aim: 0 });

console.log(result2.x * result2.y);
