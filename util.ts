import * as fs from "fs";

export function loadInput(): string[] {
  return fs.readFileSync("input").toString().split("\n");
}
