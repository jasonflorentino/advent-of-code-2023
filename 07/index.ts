// https://adventofcode.com/2023/day/07
// (cd 07; bun index.ts)

import * as Util from "../util";

const cards = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

const lines = Util.loadInput().map((l) => l.split(" "));

console.log(
  addHandScores(lines)
    .sort(compareScores)
    .sort(breakTies)
    .reduce(computeWinnings, 0)
); // 249726565

function addHandScores(lines) {
  return lines.map(toScore);
}

function compareScores(a, b) {
  return a[2] - b[2];
}

function breakTies(a, b) {
  if (a[2] === b[2]) {
    for (let i = 0; i < a[0].length; i++) {
      if (a[0][i] !== b[0][i]) {
        return cards[a[0][i]] - cards[b[0][i]];
      }
    }
  } else {
    return compareScores(a, b);
  }
}

function computeWinnings(total, h, rank) {
  return total + Number(h[1]) * (rank + 1);
}

function toScore(h) {
  const cards = {};
  for (const c of h[0]) {
    if (cards[c] === undefined) {
      cards[c] = 1;
    } else {
      cards[c]++;
    }
  }
  let score;
  const groupCounts = Object.values(cards);
  switch (groupCounts.length) {
    case 1: {
      score = 6;
      break;
    }
    case 2: {
      if (groupCounts.some((c) => c === 4)) {
        score = 5;
      } else {
        score = 4;
      }
      break;
    }
    case 3:
    case 4: {
      let twoCount = 0;
      groupCounts.forEach((c) => (twoCount += c === 2 ? 1 : 0));
      if (twoCount === 2) {
        score = 2;
      } else if (twoCount === 1) {
        score = 1;
      } else {
        score = 3;
      }
      break;
    }
    default:
      score = 0;
  }
  h.push(score);
  return h;
}
