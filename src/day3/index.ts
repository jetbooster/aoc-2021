import { readFileSync } from 'fs';
import { join } from 'path';

const fyl = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n');

type CountList = {
  ones: number,
  zeros: number
}[]

const output: CountList = [];

const counts = fyl.reduce((prev, number) => {
  if (prev.length === 0) {
    return number.split('').map((digit) => {
      if (digit === '1') {
        return { ones: 1, zeros: 0 };
      }
      return { ones: 0, zeros: 1 };
    });
  }
  return number.split('').map((digit, index) => {
    if (digit === '1') {
      return { ones: prev[index].ones + 1, zeros: prev[index].zeros };
    }
    return { ones: prev[index].ones, zeros: prev[index].zeros + 1 };
  });
}, output);

// part 1

const { gamma, epsilon } = counts.reduce((prev, item) => {
  if (item.ones > item.zeros) {
    return { gamma: `${prev.gamma}1`, epsilon: `${prev.epsilon}0` };
  }
  return { gamma: `${prev.gamma}0`, epsilon: `${prev.epsilon}1` };
}, { gamma: '', epsilon: '' });

const g = Number.parseInt(gamma, 2);
const e = Number.parseInt(epsilon, 2);
const result = g * e;

console.log({
  gamma, epsilon, g, e, result,
});

// part 2 attempt 1

const shouldKeep = (item:string, index:number, invert: boolean): boolean => {
  console.log(counts);
  const mostCommonIsOne = counts[index].ones > counts[index].zeros;
  if (!invert) {
    if (item[index] === (mostCommonIsOne ? '1' : '0')) {
      // this record is a valid item to continue for calculating oxygenGeneratorRating
      // continue down the stack
      if (index === item.length - 1) {
        return true;
      }
      return shouldKeep(item, index + 1, invert);
    }
    return false;
  } if (item[index] === (mostCommonIsOne ? '0' : '1')) {
    // this record is a valid item to continue for calculating co2ScrubberRating
    // continue down the stack
    if (index === item.length - 1) {
      return true;
    }
    return shouldKeep(item, index + 1, invert);
  }
  return false;
};

const oxRating = fyl.filter((item) => shouldKeep(item, 0, false));
const co2rating = fyl.filter((item) => shouldKeep(item, 0, true));

console.log({ oxRating, co2rating });

// attempt 1: FAILED. does not work if the number of options
// is filtered down to 1 before reaching the final digit

// attempt 2
const oxRating2 = fyl.filter((item) => shouldKeep(item, 0, false));
const co2rating2 = fyl.filter((item) => shouldKeep(item, 0, true));

console.log({ oxRating, co2rating });
