// https://adventofcode.com/2023/day/08
// (cd 08; bun index.ts)

import * as Util from "../util";

const lines = Util.loadInput();

// How many steps are required to reach ZZZ?
console.log(runDirections(lines)); // 17287

interface Node {
  L: string;
  R: string;
}

function connectNodes(nodeLines) {
  let nodes: { [name: string]: Node } = {};

  nodeLines.forEach((line) => {
    if (!line) {
      return;
    }

    const [name, conns] = line.split("=");

    if (!name || !conns) {
      return;
    }

    if (name.trim() in nodes) {
      throw `duplicate node? ${line}`;
    } else {
      const [left, right] = conns.replace(/[()]/g, "").split(",");
      nodes[name.trim()] = {
        L: left.trim(),
        R: right.trim(),
      };
    }
  });

  return nodes;
}

function runDirections(lines) {
  const [dirs, ...nodeLines] = lines;
  const nodes = connectNodes(nodeLines);

  let steps = 0;
  let isAtZ = false;
  let curr = "AAA";

  out: while (!isAtZ) {
    for (let i = 0; i < dirs.length; i++) {
      if (isAtZ) {
        break out;
      }
      curr = nodes[curr][dirs[i]];
      steps++;
      if (curr === "ZZZ") {
        isAtZ = true;
      }
    }
  }

  return steps;
}
