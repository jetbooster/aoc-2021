import { readFileSync } from 'fs';
import { join } from 'path';

const lanternfish = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split(',').map((val) => Number(val));

const init : Record<string, number> = {};
const groupedLanternfish = lanternfish.reduce((prev, curr) => {
  if (prev[curr.toString()]) {
    // eslint-disable-next-line no-param-reassign
    prev[curr.toString()] += 1;
    return prev;
  }
  // eslint-disable-next-line no-param-reassign
  prev[curr.toString()] = 1;
  return prev;
}, init);

const ages = ['0', '1', '2', '3', '4', '5', '6', '7', '8'].reverse();

const processTick = (fsh: Record<string, number>) => {
  const result: Record<string, number> = {};
  ages.forEach((age) => {
    if (fsh[age]) {
      result[(Number(age) - 1).toString()] = fsh[age];
      console.log(result);
    }
  });
  if (result['-1']) {
    if (result['6']) {
      result['6'] += result['-1'];
    } else {
      result['6'] = result['-1'];
    }
    result['8'] = result['-1'];
    delete result['-1'];
  }
  console.log(result);
  return result;
};

let result = groupedLanternfish;
console.log(groupedLanternfish);
for (let i = 0; i < 256; i += 1) {
  result = processTick(result);
}

const total = Object.values(result).reduce((prev, curr) => prev + curr, 0);

console.log(total);
