// https://adventofcode.com/2023/day/4
// (cd 04; bun index.ts)

import * as Util from "../util";

type CardNums = {
  winningNums: number[];
  playerNums: number[];
  cardId: number;
};

const lines: CardNums[] = Util.loadInput().map((line) => {
  const [winnerPart, playerPart] = line.split("|");
  const [cardTitle, winningNums] = winnerPart.split(":");
  return {
    cardId: Number(cardTitle.replace(/\D/g, "")),
    winningNums: toNumbers(winningNums),
    playerNums: toNumbers(playerPart),
  };
});

// How many points are they worth in total?
console.log(one(lines)); // 23941

function one(cards: CardNums[]) {
  return cards.reduce((total, { winningNums, playerNums }) => {
    const matchedNums = collectWinners(winningNums, playerNums);
    if (matchedNums.length) {
      return total + 2 ** (matchedNums.length - 1);
    } else {
      return total;
    }
  }, 0);
}

// how many total scratchcards do you end up with?
console.log(two(lines)); // 5571760

function two(cards: CardNums[]) {
  const cardsWithCopies: { [cardId: string]: [number, number] } = {};

  // init a table where cardId: [win points, card copies]
  for (const { cardId, winningNums, playerNums } of cards) {
    const points = collectWinners(winningNums, playerNums).length;
    cardsWithCopies[cardId] = [points, 1];
  }

  // increment the copies... for each copy
  for (const cardId in cardsWithCopies) {
    let copies = cardsWithCopies[cardId][1];
    while (copies-- > 0) {
      let points = cardsWithCopies[cardId][0];
      while (points > 0) {
        cardsWithCopies[Number(cardId) + points][1] += 1;
        points--;
      }
    }
  }

  return Object.values(cardsWithCopies).reduce(
    (total, cards) => total + cards[1],
    0
  );
}

function toNumbers(str) {
  return str
    .split(/\s/)
    .filter((v) => !!v)
    .map(Number);
}

function collectWinners(c: number[], p: number[]) {
  return p.filter((n) => c.includes(n));
}
