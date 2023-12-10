// https://adventofcode.com/2023/day/05
// (cd 05; bun index.ts)

import * as Util from "../util";

const lines = Util.loadInput();

type Range = [destStart: number, srcStart: number, len: number];

class Almanac {
  seeds: number[];
  maps: { [k: string]: Range[] } = {};
  mappingOrder = [
    "seed-to-soil",
    "soil-to-fertilizer",
    "fertilizer-to-water",
    "water-to-light",
    "light-to-temperature",
    "temperature-to-humidity",
    "humidity-to-location",
  ];

  seedLocations: { [seed: string]: number } = {};

  constructor(lines: string[]) {
    let currMap;
    for (const line of lines) {
      if (line.startsWith("seeds:")) {
        // seeds is the first line but we using for..of lol
        this.seeds = line.split(":")[1].trim().split(" ").map(Number);
      } else if (/^[a-z]/.test(line)) {
        // it's a map label
        currMap = line.split("map")[0].trim();
        this.maps[currMap] = new Array();
      } else {
        const range = line
          .split(" ")
          .filter((x) => !!x)
          .map(Number);
        if (currMap && range.length) {
          this.maps[currMap].push(range as Range);
        }
      }
    }

    // sort seeds
    this.seeds.sort((a, b) => a - b);

    // sort the maps
    for (const k in this.maps) {
      this.maps[k].sort((a, b) => a[0] - b[0]);
    }

    // console.log("seeds", this.seeds);
    // console.log("maps", this.maps);
  }

  resolveSeedLocations() {
    for (const seed of this.seeds) {
      let currVal = seed;
      for (const mapKey of this.mappingOrder) {
        const range = this.findRange(this.maps[mapKey], currVal);
        if (range) {
          const srcOffset = currVal - range[1];
          currVal = range[0] + srcOffset;
        } else {
          // no need to update currVal since src == dest
        }
      }
      this.seedLocations[seed] = currVal;
    }
    return this;
  }

  findRange(ranges: Range[], srcVal: number) {
    const range = ranges.find((r) => {
      return r[1] <= srcVal && srcVal <= r[1] + r[2];
    });
    return range;
  }

  closestSeed() {
    let closest = Infinity;
    for (const seed of this.seeds) {
      closest = Math.min(closest, this.seedLocations[seed]);
    }
    return closest;
  }
}

// What is the lowest location number that corresponds to any of the initial seed numbers?
console.log(new Almanac(lines).resolveSeedLocations().closestSeed()); // 662197086
