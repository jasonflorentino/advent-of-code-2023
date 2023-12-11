// https://adventofcode.com/2023/day/6
// (cd 06; bun index.ts)

import * as Util from "../util";

const lines = Util.loadInput();

// What do you get if you multiply these numbers together?
console.log(collectWinWays(lines)); // 2612736

// How many ways can you beat the record in this one much longer race?
console.log(oneRaceWinWays(lines)); // 29891250

function oneRaceWinWays(lines) {
  return computeWinWaysTotal(toOneRaceStat(lines));
}

function toNumbers(str) {
  return str
    .trim()
    .split(" ")
    .filter((v) => !!v)
    .map(Number);
}

interface RaceRecord {
  time: number;
  dist: number;
}

function collectWinWays(lines) {
  let total = 1;
  for (const race of toRaceStats(lines)) {
    total *= countWinWays(race);
  }
  return total;
}

function toRaceStats(lines) {
  const times = toNumbers(lines[0].split(":")[1]);
  const dists = toNumbers(lines[1].split(":")[1]);
  const races: RaceRecord[] = [];
  for (let i = 0; i < times.length; i++) {
    races.push({ time: times[i], dist: dists[i] });
  }
  return races;
}

// for pt 2
function toOneRaceStat(lines): RaceRecord {
  const asStrings = toRaceStats(lines).reduce(
    (oneRace, race) => ({
      time: oneRace.time + race.time,
      dist: oneRace.dist + race.dist,
    }),
    { time: "", dist: "" }
  );
  return { time: Number(asStrings.time), dist: Number(asStrings.dist) };
}

function countWinWays(race: RaceRecord): number {
  let ways = 0;
  const { time, dist } = race;
  let holdTime = 1;
  let travelDist;
  while (holdTime < time) {
    travelDist = toTravelDist(holdTime, time);
    if (travelDist > dist) {
      ways++;
    }
    holdTime++;
  }
  return ways;
}

function toTravelDist(holdTime: number, maxTime: number) {
  return holdTime * (maxTime - holdTime);
}

/**
 * yeah, it'll take way too long to count up  all those
 * wins let's find the first and last wins then report the
 * total 'win range'
 */
function computeWinWaysTotal(race: RaceRecord): number {
  let firstWin;
  let lastWin;

  let holdTime = 1;
  let travelDist = 0;
  while (holdTime < race.time) {
    travelDist = toTravelDist(holdTime, race.time);
    if (travelDist > race.dist) {
      firstWin = holdTime;
      break;
    }
    holdTime++;
  }

  holdTime = race.time;
  travelDist = 0;
  while (holdTime > race.time / 2 /* we should have a win by half time */) {
    travelDist = toTravelDist(holdTime, race.time);
    if (travelDist > race.dist) {
      lastWin = holdTime;
      break;
    }
    holdTime--;
  }

  // plus 1 bc we need otherwise dont count one end of the range
  return lastWin - firstWin + 1;
}
