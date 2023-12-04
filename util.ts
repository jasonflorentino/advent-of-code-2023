import fs from "fs";

export function loadInput() {
  return fs.readFileSync("input").toString().split("\n");
}
