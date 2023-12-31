// https://adventofcode.com/2023/day/07
// (cd 07; bun index.ts)

import * as Util from "../util";

const lines = Util.loadInput().map((l) => l.split(" "));

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

const cards2 = {
  ...cards,
  J: 1,
};

const SCORES = {
  five: 6,
  four: 5,
  full: 4,
  tree: 3,
  twop: 2,
  onep: 1,
  high: 0,
};

// What are the total winnings? 249726565
// What are the new total winnings? 251135960
const IS_PT2 = true;
console.log(
  addHandScores(lines)
    .sort(compareScores)
    .sort(breakTies)
    .reduce(computeWinnings, 0)
);

function addHandScores(lines) {
  return lines.map(toScore);
}

function compareScores(a, b) {
  return a[2] - b[2];
}

function breakTies(a, b) {
  /**
   * if scores are the same,
   * compare the first 2 cards that
   * differ to determine sort order
   */
  // [hand, value, handScore]
  if (a[2] === b[2]) {
    for (let i = 0; i < a[0].length; i++) {
      if (a[0][i] !== b[0][i]) {
        return (
          (IS_PT2 ? cards2 : cards)[a[0][i]] -
          (IS_PT2 ? cards2 : cards)[b[0][i]]
        );
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
  const hasJokers = IS_PT2 ? typeof cards.J === "number" : false;
  const cardCounts = Object.values(cards);

  switch (cardCounts.length) {
    // all cards are the same
    case 1: {
      score = SCORES.five;
      break;
    }
    // only 2 different cards
    case 2: {
      if (hasJokers) {
        score = SCORES.five;
      } else {
        score = cardCounts.some((c) => c === 4) ? SCORES.four : SCORES.full;
      }
      break;
    }
    // 3 different cards
    case 3: {
      let pairCount = 0;
      cardCounts.forEach((c) => (pairCount += c === 2 ? 1 : 0));
      if (pairCount === 2) {
        if (hasJokers) {
          score = cards.J === 2 ? SCORES.four : SCORES.full;
        } else {
          score = SCORES.twop;
        }
      } else {
        score = hasJokers ? SCORES.four : SCORES.tree;
      }
      break;
    }
    // must be one pair
    case 4: {
      score = hasJokers ? SCORES.tree : SCORES.onep;
      break;
    }
    // all cards are different
    default:
      score = hasJokers ? SCORES.onep : SCORES.high;
  }

  h.push(score);
  return h;
}
