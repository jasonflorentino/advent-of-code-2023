// https://adventofcode.com/2023/day/3
// (cd 03; bun index.ts)

import * as Util from "../util";

const lines = Util.loadInput();

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const moves = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [1, -1],
];

console.log(one(lines));

// run over the chars
// stop when you see a number
// start checking
// 1. is this connected to a symbol?
// 2. where does the number end? (what's the full number)
// if so add it to a total

// 525568 is too low

function one(lines) {
  let total = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const c = lines[y][x];
      if (isNumber(c)) {
        const [fullNum, isPart] = isPartNumber(lines, x, y);
        if (isPart) {
          total += Number(fullNum);
        }
        x += fullNum.length - 1;
      }
    }
  }
  return total;
}

function isPartNumber(
  lines: string[],
  x: number,
  y: number
): [string, boolean] {
  let fullNum = "";
  let numLen = 0;
  let isPartNumber = false;
  while (isNumber(lines[y]?.[x + numLen])) {
    fullNum += lines[y][x + numLen];
    for (const [mvX, mvY] of moves) {
      if (isSymbol(lines[y + mvY]?.[x + numLen + mvX])) {
        isPartNumber = true;
      }
    }
    numLen++;
  }
  return [fullNum, isPartNumber];
}

function isString(c: string | undefined): boolean {
  return typeof c === "string";
}

function isNumber(c: string | undefined): boolean {
  return isString(c) && numbers.includes(c as string);
}

function isSymbol(c: string | undefined): boolean {
  return isString(c) && c !== "." && !isNumber(c);
}
