---
title: "DSA Interview Patterns, Part 6: BFS and DFS"
excerpt: "Once you move from linear structures to branching ones, two traversal strategies cover most problems. Sixth in a series on the core patterns behind LeetCode-style interviews, covering breadth-first and depth-first search on trees, graphs, and grids."
date: "2026-08-17"
readTime: "3 min read"
tags: ["DSA", "Algorithms", "Interview Prep", "Python"]
---

Once you move from linear structures (arrays, strings) to branching ones (trees, graphs, grids), two traversal strategies cover the vast majority of problems: **breadth-first search** (explore level by level) and **depth-first search** (explore one path all the way down before backing up).

## BFS: explore layer by layer

BFS uses a queue (FIFO) and explores every neighbor at the current distance before moving further out. That property makes it the go-to choice whenever you need the *shortest* number of steps to reach something.

**On trees** — no cycles possible, so no visited tracking is needed:

```python
from collections import deque

def level_order(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)

    return result
```

The trick that makes this a clean *level-by-level* traversal (rather than just a flat BFS) is snapshotting `len(queue)` at the start of each iteration — that's exactly how many nodes belong to the current level, so the inner loop processes only those before moving on.

**On graphs** — cycles are possible, so you must track visited nodes, and you mark a node visited the moment you *enqueue* it (not when you process it), to avoid adding duplicates:

```python
def bfs_graph(start, neighbors_of):
    visited = {start}
    queue = deque([start])

    while queue:
        node = queue.popleft()
        for neighbor in neighbors_of(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

**Reach for BFS when:** you need the shortest path or minimum number of moves, you're doing level-order processing, or all edges have equal "cost" (unweighted shortest path).

## DFS: go deep, then backtrack

DFS fully commits to one path before trying alternatives. It's usually implemented recursively, letting the call stack manage the backtracking for you.

**On trees:**

```python
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
```

Each call asks its left and right subtrees for their depth, takes the larger of the two, and adds one for the current node. No visited set needed — trees can't loop back on themselves.

**On graphs**, cycles mean you need a visited set, same as BFS:

```python
def dfs_graph(node, neighbors_of, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for neighbor in neighbors_of(node):
        if neighbor not in visited:
            dfs_graph(neighbor, neighbors_of, visited)
    return visited
```

**Reach for DFS when:** you need to explore every possibility, you care about structure or existence rather than distance, or you're solving a problem that's fundamentally recursive (tree construction, path existence, connected components).

## Worked example: Number of Islands (DFS on a grid)

Given a grid of `1`s (land) and `0`s (water), count the number of connected land regions (4-directionally connected, not diagonal).

```python
def num_islands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"  # mark visited by "sinking" the land
        sink(r + 1, c)
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)

    return count
```

The trick: instead of maintaining a separate visited set, the grid values themselves are mutated ("sunk" from `1` to `0`) as they're explored. Each DFS call fully consumes one island, so by the time you loop to the next unvisited `1`, you know it belongs to a brand-new island. Every cell is visited exactly once, giving `O(rows × cols)` time.

## Trees vs. graphs: the one thing that changes

The entire difference between tree and graph versions of BFS/DFS comes down to cycles. Trees are acyclic by definition, so you get traversal "for free" with no bookkeeping. The moment cycles become possible — which is any general graph or grid — you must track visited state, or risk infinite loops and repeated work.

## What's next

DFS on its own explores everything. Add the ability to *undo* a choice when it leads to a dead end, and you get **backtracking** — the pattern behind permutations, combinations, and puzzle solvers like Sudoku and N-Queens. That's next, along with **heaps**, the structure for efficiently tracking the smallest or largest items in a changing collection.
