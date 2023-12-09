// https://adventofcode.com/2023/day/3
// (cd 03; bun index.ts)

import * as Util from "../util";

const lines = Util.loadInput();

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const moves = [
  [1, 0], // e
  [1, 1], // se
  [0, 1], // s
  [-1, 1], // sw
  [-1, 0], // w
  [-1, -1], // nw
  [0, -1], // n
  [1, -1], // ne
];

//  What is the sum of all of the part numbers in the engine schematic?
console.log(one(lines)); // 540212

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

// What is the sum of all of the gear ratios in your engine schematic?
console.log(two(lines)); // 87605697

function two(lines) {
  let total = 0;
  const gearMarkerNumbers: { [k: string]: string[] } = {};
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const c = lines[y][x];
      if (isNumber(c)) {
        const [fullNum, _isPart, gearMarkerXY] = isPartNumber(
          lines,
          x,
          y,
          true
        );
        // instead of totalling up all numbers
        // keep track of which numbers are next
        // to which asterisks...
        const isEligibleForGear = gearMarkerXY[0] > -1;
        if (isEligibleForGear) {
          const key = gearMarkerXY.join(",");
          if (Array.isArray(gearMarkerNumbers[key])) {
            gearMarkerNumbers[key].push(fullNum);
          } else {
            gearMarkerNumbers[key] = [fullNum];
          }
        }
        x += fullNum.length - 1;
      }
    }
  }

  for (const k in gearMarkerNumbers) {
    const nums = gearMarkerNumbers[k];
    if (nums.length > 2) {
      console.log(`hmmm more than 2 numbers for ${k}`);
    }
    if (nums.length === 2) {
      total += Number(nums[0]) * Number(nums[1]);
    }
  }

  return total;
}

function isPartNumber(
  lines: string[],
  x: number,
  y: number,
  // param added for part 2
  checkForGearEligibility?: boolean
): [string, boolean, [number, number]] {
  let fullNum = "";
  let numLen = 0;
  let isPartNumber = false;
  let gearMarkerXY = new Array(2).fill(-1) as [number, number];
  while (isNumber(lines[y]?.[x + numLen])) {
    fullNum += lines[y][x + numLen];
    for (const [mvX, mvY] of moves) {
      const char = lines[y + mvY]?.[x + numLen + mvX];
      if (isSymbol(char)) {
        isPartNumber = true;
        // added for pt 2
        if (checkForGearEligibility && char === "*") {
          gearMarkerXY[0] = x + numLen + mvX;
          gearMarkerXY[1] = y + mvY;
        }
      }
    }
    numLen++;
  }
  return [fullNum, isPartNumber, gearMarkerXY];
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
