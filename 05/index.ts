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
    // d'oh used to just sorting bc it usually helps
    // but not for pt 2!
    // this.seeds.sort((a, b) => a - b);

    // sort the maps
    for (const k in this.maps) {
      this.maps[k].sort((a, b) => a[0] - b[0]);
    }
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

  /**
   * given the number of seeds we have to check now
   * this will take a long time to brute force...
   * try and cut down on the ranges you have to check
   * by honing in on the ranges that produce good locations
   */
  findMinLocationFromSeedRanges() {
    // sort the maps by src floor instead
    for (const k in this.maps) {
      this.maps[k].sort((a, b) => a[1] - b[1]);
    }

    // dont fully check every seed in every range!
    // (that would take FOREVER)
    // start by checking every x seed and save
    // the ranges that gave good locations for
    // for more detailed checking on the next level.
    let levels = 5;
    let seedRanges = this.seeds;
    let minSrc;
    let minLoc = Infinity;
    let bestRange: number[] = [];
    while (levels > 0) {
      console.log("\nlevel", levels);
      bestRange = [];
      for (let i = 0; i < seedRanges.length; i += 2) {
        const minSeed = seedRanges[i];
        const rangeLen = seedRanges[i + 1];
        const maxSeed = minSeed + rangeLen - 1;

        const start = Date.now();
        console.log(`range ${i / 2 + 1} of ${seedRanges.length / 2}`);
        console.log(
          `min: ${minSeed}, max: ${maxSeed}, len: ${rangeLen.toLocaleString()}`
        );

        let currSeed = minSeed;
        while (currSeed < minSeed + rangeLen) {
          if (currSeed > maxSeed) {
            // just in case large steps go outside seed range
            console.log("seed out of range!");
            break;
          }
          let currVal = currSeed;
          for (const mapKey of this.mappingOrder) {
            const ranges = this.maps[mapKey];
            currVal = this.toDestValue(ranges, currVal);
          }
          if (currVal < minLoc) {
            minLoc = currVal;
            minSrc = currSeed;
            console.log(`New min location! ${minLoc} from seed ${minSrc}`);
            bestRange.push(minSeed, rangeLen);
          }
          // increment by powers of 10 and eventually step
          // 1 at a time checking every seed in the best range.
          currSeed += 10 ** (levels - 1);
        }
        console.log("range time sec", (Date.now() - start) / 1000);
      }
      levels--;
      seedRanges = bestRange;
    }

    console.log(`\nmin location: ${minLoc} from seed ${minSrc}`);
    return minLoc;
  }

  toDestValue(ranges: Range[], src: number) {
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      if (range[1] <= src && range[1] + range[2] > src) {
        return src - range[1] + range[0];
      }
    }
    return src;
  }
}

// What is the lowest location number that corresponds to any of the initial seed numbers?
console.log(new Almanac(lines).resolveSeedLocations().closestSeed()); // 662197086

// What is the lowest location number that corresponds to any of the initial seed numbers?
console.log(new Almanac(lines).findMinLocationFromSeedRanges()); // 52510809
// still took 90s to completely check the winning range!
