import * as Util from "../util";

interface CubeCount {
  red: number;
  green: number;
  blue: number;
}

type Line = [number, CubeCount[]];

const lines: Line[] = Util.loadInput().map(toData);

function toData(line): Line {
  const [game, pullsRaw] = line.split(": ");
  const pulls = pullsRaw.split(";");
  return [Number(game.split(" ")[1]), pulls.map(toPullStat)];
}

function toPullStat(pullStr): CubeCount {
  const cubeMap = {
    red: 0,
    green: 0,
    blue: 0,
  };
  const cubeStrs = pullStr.split(",");
  for (const cube of cubeStrs) {
    const [n, color] = cube.trim().split(" ");
    cubeMap[color] = Number(n);
  }
  return cubeMap;
}

function isPossible(line: Line, maxCubes) {
  for (const pull of line[1]) {
    for (const color in pull) {
      if (pull[color] > maxCubes[color]) {
        return false;
      }
    }
  }
  return true;
}

function one(lines: Line[]) {
  const MAX_CUBES: CubeCount = {
    red: 12,
    green: 13,
    blue: 14,
  };
  let total = 0;
  for (const line of lines) {
    if (isPossible(line, MAX_CUBES)) {
      total += line[0];
    }
  }
  return total;
}

function two(lines: Line[]): number {
  let total = 0;
  for (const game of lines) {
    const [minRed, minGreen, minBlue] = findMins(game);
    total += minRed * minGreen * minBlue;
  }
  return total;
}

function findMins(game: Line) {
  const mins: CubeCount = {
    red: 0,
    green: 0,
    blue: 0,
  };
  for (const pull of game[1]) {
    for (const color in pull) {
      mins[color] = Math.max(mins[color], pull[color]);
    }
  }
  return [mins.red, mins.green, mins.blue];
}

console.log(one(lines));
console.log(two(lines));
