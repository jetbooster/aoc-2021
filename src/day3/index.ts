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

// part 1 (rev 2)
const compressedCount = counts.reduce((prev, count) => {
  if (count.ones > count.zeros) {
    return `${prev}1`;
  }
  return `${prev}0`;
}, '');

console.log(compressedCount);

const g = Number.parseInt(compressedCount, 2);
// eslint-disable-next-line no-bitwise
const e = Number.parseInt(compressedCount, 2) ^ 0b111111111111;
const result = g * e;

console.log({
  compressedCount, g, e, result,
});

// part 2 attempt 3

const shouldKeep = (item:string, index:number, mostCommon: string, invert: boolean): boolean => {
  if (!invert) {
    if (item[index] === mostCommon) {
      // this record is a valid item to continue for calculating oxygenGeneratorRating
      return true;
    }
    return false;
  } if (item[index] !== mostCommon) {
    // this record is a valid item to continue for calculating co2ScrubberRating
    return true;
  }
  return false;
};

const calcMostCommonDigit = (array:string[], index:number, invert: boolean) => {
  const subcounts = array.reduce((prev, item) => {
    if (item[index] === '1') {
      return { ones: prev.ones + 1, zeros: prev.zeros };
    }
    return { ones: prev.ones, zeros: prev.zeros + 1 };
  }, { ones: 0, zeros: 0 });
  console.log({ subcounts, index, invert });
  if (subcounts.ones > subcounts.zeros) {
    return '1';
  }
  if (subcounts.ones === subcounts.zeros) {
    return '1';
  }
  return '0';
};

let o2Copy = [...fyl];
let co2Copy = [...fyl];
const binaryStringLength = o2Copy[0].length;

for (let i = 0; i < binaryStringLength; i += 1) {
  const mostCommonDigit = calcMostCommonDigit(o2Copy, i, false);
  o2Copy = o2Copy.filter((item) => shouldKeep(item, i, mostCommonDigit, false));
  if (o2Copy.length === 1) {
    break;
  }
}

for (let i = 0; i < binaryStringLength; i += 1) {
  const mostCommonDigit = calcMostCommonDigit(co2Copy, i, true);
  co2Copy = co2Copy.filter((item) => shouldKeep(item, i, mostCommonDigit, true));
  if (co2Copy.length === 1) {
    break;
  }
}

const o2Rating = Number.parseInt(o2Copy[0], 2);
const co2Rating = Number.parseInt(co2Copy[0], 2);
const result2 = o2Rating * co2Rating;

console.log({
  o2Copy, co2Copy, o2Rating, co2Rating, result2,
});
