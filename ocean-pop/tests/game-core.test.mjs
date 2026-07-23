import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SAVE,
  LEOPARD_TURNS,
  advanceLeopards,
  cellKey,
  findCluster,
  findFloating,
  neighborCoords,
  reflectHorizontal,
  safeSave,
  scoreForRemoval,
  starsForScore,
} from "../app/game-core.ts";

const cell = (id, row, col, kind) => ({ id, row, col, kind });

test("hex neighbors stay valid at the board edge", () => {
  const neighbors = neighborCoords(0, 0);
  assert.ok(neighbors.every(({ row, col }) => row >= 0 && col >= 0));
  assert.equal(neighbors.length, 2);
});

test("wall impact reflects horizontal velocity", () => {
  assert.deepEqual(reflectHorizontal(18, -120, 19, 371), {
    x: 19,
    velocityX: 120,
  });
  assert.deepEqual(reflectHorizontal(200, 120, 19, 371), {
    x: 200,
    velocityX: 120,
  });
});

test("three matching bubbles form a removable cluster", () => {
  const bubbles = [
    cell(1, 0, 0, "fish"),
    cell(2, 0, 1, "fish"),
    cell(3, 1, 0, "fish"),
    cell(4, 1, 1, "crab"),
  ];
  const grid = new Map(bubbles.map((bubble) => [cellKey(bubble.row, bubble.col), bubble]));
  assert.equal(findCluster(grid, bubbles[0]).length, 3);
});

test("unanchored bubbles are detected after a match", () => {
  const bubbles = [
    cell(1, 0, 0, "fish"),
    cell(2, 1, 0, "fish"),
    cell(3, 4, 4, "shell"),
  ];
  const grid = new Map(bubbles.map((bubble) => [cellKey(bubble.row, bubble.col), bubble]));
  assert.deepEqual(findFloating(grid).map(({ id }) => id), [3]);
});

test("score rewards detached bubbles and combo", () => {
  assert.ok(scoreForRemoval(3, 2, 2) > scoreForRemoval(3, 0, 0));
});

test("leopard countdown infects a deterministic neighbor", () => {
  const leopard = { ...cell(1, 1, 1, "leopard"), leopardTimer: 1 };
  const fish = cell(2, 2, 1, "fish");
  const crab = cell(3, 1, 0, "crab");
  const grid = new Map(
    [leopard, fish, crab].map((bubble) => [cellKey(bubble.row, bubble.col), bubble]),
  );
  const infected = advanceLeopards(grid);
  assert.equal(infected.length, 1);
  assert.equal(infected[0].kind, "leopard");
  assert.equal(leopard.leopardTimer, LEOPARD_TURNS);
});

test("leopard growth now takes six missed shots", () => {
  const leopard = { ...cell(1, 1, 1, "leopard"), leopardTimer: LEOPARD_TURNS };
  const fish = cell(2, 2, 1, "fish");
  const grid = new Map(
    [leopard, fish].map((bubble) => [cellKey(bubble.row, bubble.col), bubble]),
  );
  for (let turn = 1; turn < LEOPARD_TURNS; turn += 1) {
    assert.equal(advanceLeopards(grid).length, 0);
  }
  assert.equal(advanceLeopards(grid).length, 1);
});

test("star thresholds and damaged saves fall back safely", () => {
  const config = { score2: 500, score3: 900 };
  assert.equal(starsForScore(499, config), 1);
  assert.equal(starsForScore(500, config), 2);
  assert.equal(starsForScore(900, config), 3);
  assert.deepEqual(safeSave({ version: 0 }), DEFAULT_SAVE);
});
