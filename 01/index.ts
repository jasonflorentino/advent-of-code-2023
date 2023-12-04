import * as Util from "../util";

const lines = Util.loadInput();

const numstrs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const numstrs2 = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const numStrMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function toDigit(n) {
  if (n.length > 1) return numStrMap[n];
  else return n;
}

function getCalibrationValue(line) {
  let first;
  let last;
  for (const c of line) {
    const isNum = numstrs.includes(c);
    if (isNum && first === undefined) first = c;
    else if (isNum && first !== undefined) last = c;
  }
  return first + (last ?? first);
}

function getCalibrationValue2(line) {
  let first;
  let last;
  let i = 0;
  let j = 1;
  let n = "";
  let m: string | null = null;
  let possibleNums = [];
  while (i < line.length) {
    findStartMatches(line[i], possibleNums);
    while (possibleNums.length) {
      n = possibleNums.pop()!;
      if (n.length === 1) {
        m = n;
        break;
      } else {
        j = 1;
        while (j < n.length) {
          if (line[i + j] !== n[j]) {
            break;
          } else {
            j++;
          }
        }
        if (j === n.length) {
          m = n;
        }
      }
    }
    if (m !== null) {
      if (first === undefined) first = m;
      else last = m;
    }
    // whoops thought i was being clever by advancing the
    // current idx by exhaused j, but that missed cases
    // where the start of the next number could overlap
    // with the end of the previous like 'twoone'.
    // stop trying to be so smart and just advance one char
    // at a time to ensure we don't overlook these cases!
    // i = i + j;
    i = i + 1;
    j = 1;
    n = "";
    m = null;
  }
  return toDigit(first) + toDigit(last ?? first);
}

function findStartMatches(c, possibleNums) {
  for (const n of numstrs2) {
    if (n.startsWith(c)) {
      possibleNums.push(n);
    }
  }
}

function toLineValSummer(getCalVal) {
  return (total, str) => total + Number(getCalVal(str));
}

console.log(lines.reduce(toLineValSummer(getCalibrationValue), 0));
console.log(lines.reduce(toLineValSummer(getCalibrationValue2), 0));
