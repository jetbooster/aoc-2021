import { readFileSync } from 'fs';
import { join } from 'path';

const fyl = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n').map((item) => Number(item));

// part one

let timesIncreased = 0;
fyl.reduce((previous, item) => {
  if (item > previous) {
    timesIncreased += 1;
    return item;
  }
  return item;
});

console.log(timesIncreased);

// part two

timesIncreased = 0;
fyl.reduce<number[]>((window, item) => {
  if (window.length < 3) {
    return [...window, item];
  }
  const prevValue = window.reduce((prev, i) => prev + i);
  const newWindow = window.slice(1);
  newWindow.push(item);
  const newValue = newWindow.reduce((prev, i) => prev + i);
  if (newValue > prevValue) {
    timesIncreased += 1;
  }
  return newWindow;
}, []);

console.log(timesIncreased);
