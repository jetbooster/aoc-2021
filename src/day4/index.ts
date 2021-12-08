import { readFileSync } from 'fs';
import { join } from 'path';

interface Board {
  index: number,
  items:{
    verticals: string[][]
    horizontals: string[][]
    diagonals: string[][]
  }
}

type BoardOptions = 'horizontals'|'verticals'|'diagonals'

const getDiagonals = (array: string[][]): string[][] => {
  const positiveDiagonal = [];
  const negativeDiagonal = [];
  const arrayLength = array.length;
  for (let i = 0; i < arrayLength; i += 1) {
    // assume boards square. bingo gets very hard otherwise
    positiveDiagonal.push(array[i][i]);
    negativeDiagonal.push(array[arrayLength - i - 1][i]);
  }
  return [negativeDiagonal, positiveDiagonal];
};

const generateBoard = (input:string, index: number): Board => {
  const horizontals = input.split('\n').map((row) => row.trim().split(/\s+/));
  // transpose horizontals
  const verticals = horizontals[0].map((_, colIndex) => horizontals.map((row) => row[colIndex]));
  const diagonals = getDiagonals(horizontals);
  return {
    index,
    items: {
      horizontals,
      verticals,
      diagonals,
    },
  };
};

// for each [horizontals,verticals,diagonals] check if one of them
// contains an entries where every item is marked with *
const checkWinner = (board:Board) => Object.values(board.items)
  .some((aofa:string[][]) => aofa
    .some((subarray: string[]) => subarray
      .filter((item) => !item.includes('*')).length === 0));

const markValueOnBoard = (board:Board, value:string) => {
  Object.entries(board.items).forEach(([type, aofa]:[string, string[][]]) => {
    aofa.forEach((subarray:string[], index1) => {
      subarray.forEach((item, index2) => {
        if (item === value) {
          // horrible horrible practice, horrible horrible mutable javascript
          // eslint-disable-next-line no-param-reassign
          board.items[type as BoardOptions][index1][index2] = `${item}*`;
        }
      });
    });
  });
};

const calculateScore = (board:Board, lastCalled: string) => {
  const boardTotal = board.items.horizontals.flat().filter((item) => !item.includes('*')).reduce((prev, curr) => prev + Number(curr), 0);
  return boardTotal * Number(lastCalled);
};

const markValueOnBoards = (boards:Board[], value:string) => {
  boards.forEach((board) => {
    markValueOnBoard(board, value);
  });
};

// question is probably set up to not generate two concurrent winners, but it could happen
const getWinners = (boards:Board[]) => boards.filter((board) => checkWinner(board));

// read in boards, in during read generate all the sets of numbers that board needs to win.
const fyl = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n\n');

const gameInput: string[] = [];
const bingoBoards: Board[] = [];
fyl.forEach((input, index) => {
  if (index === 0) {
    gameInput.push(...input.split(','));
  } else {
    const board = generateBoard(input, index);
    bingoBoards.push(board);
  }
});

// first to win

gameInput.find((input) => {
  markValueOnBoards(bingoBoards, input);
  const possibleWinners = getWinners(bingoBoards);
  if (possibleWinners.length > 1) {
    throw Error('multiple winners?');
  }
  if (possibleWinners.length === 1) {
    const score = calculateScore(possibleWinners[0], input);
    console.log(score);
    return true;
  }
  return false;
});

// last to win;

bingoBoards.splice(0, bingoBoards.length);

fyl.forEach((input, index) => {
  if (index === 0) {
    // gameInput already generated
  } else {
    const board = generateBoard(input, index);
    bingoBoards.push(board);
  }
});

gameInput.find((input) => {
  markValueOnBoards(bingoBoards, input);
  const possibleWinners = getWinners(bingoBoards);

  // this is the last winner, or the join last? shouldn't happen
  if (possibleWinners.length === bingoBoards.length) {
    const score = calculateScore(bingoBoards[0], input);
    console.log(score);
    return true;
  }

  possibleWinners.forEach((winner) => {
    const delIndex = bingoBoards
      .findIndex((remainingBoard) => winner.index === remainingBoard.index);
    bingoBoards.splice(delIndex, 1);
  });

  return false;
});
