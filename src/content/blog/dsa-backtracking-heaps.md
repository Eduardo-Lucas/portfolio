---
title: "DSA Interview Patterns, Part 7: Backtracking and Heaps"
excerpt: "The series closes with two more patterns: backtracking, for exhaustively exploring and pruning solution spaces, and heaps, for efficiently tracking the smallest or largest elements in a changing collection. Seventh and final part in a series on the core patterns behind LeetCode-style interviews."
date: "2026-08-19"
readTime: "4 min read"
tags: ["DSA", "Algorithms", "Interview Prep", "Python"]
---

This closes out the series with two more patterns: **backtracking**, for problems that require exploring — and pruning — every possible configuration; and **heaps**, for efficiently tracking the smallest or largest elements in a changing collection.

## Backtracking: DFS with an undo button

Backtracking is recursive exploration where you build a partial solution step by step, and the moment a path proves invalid, you undo the last decision and try something else. It's the technique behind permutations, combinations, subsets, and constraint puzzles like Sudoku or N-Queens.

The reusable shape looks like this:

```python
def backtrack(path, choices, results):
    if is_complete(path):
        results.append(path[:])  # copy — path will keep mutating
        return

    for choice in choices:
        if not is_valid(choice, path):   # prune early
            continue
        path.append(choice)              # commit
        backtrack(path, remaining_choices(choices, choice), results)
        path.pop()                       # undo — the "back" in backtracking
```

The two details that matter most:

- **Copy the path when you record a result.** `path` is a single mutable object being built and torn down throughout the recursion — if you append a reference to it instead of a copy, every recorded "result" ends up pointing at the same (eventually empty) list.
- **Prune as early as possible.** The moment a partial choice breaks a constraint, skip it. The solution space for these problems is exponential; pruning early is what keeps runtime manageable.

**Worked example: Word Search.** Given a grid of letters, determine whether a word can be traced through adjacent cells (up/down/left/right, no reuse).

```python
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:
            return False

        temp, board[r][c] = board[r][c], "#"  # mark used
        found = (
            dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
            dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1)
        )
        board[r][c] = temp  # undo — restore the cell for other paths

        return found

    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))
```

The pattern: check the current cell against the current letter (prune immediately on mismatch), mark it used, recursively try all four directions, and — critically — **restore the cell afterward** regardless of outcome, so the next path attempt starts clean.

**Signs a problem wants backtracking:** it asks for *all* valid arrangements, combinations, or permutations; you're making a sequence of choices where each one narrows the remaining options; and you can discard invalid partial solutions before fully building them out.

## Heaps: efficient min/max tracking

A heap (priority queue) pops elements in priority order rather than insertion order. Under the hood it's a binary tree stored in an array, with insertion and removal both running in `O(log n)`. Python's `heapq` module implements a **min-heap** by default — the smallest element always comes out first.

**Simulating a max-heap:** negate the values going in and out.

```python
import heapq

def kth_largest(nums, k):
    max_heap = [-n for n in nums]
    heapq.heapify(max_heap)          # O(n)

    for _ in range(k - 1):
        heapq.heappop(max_heap)

    return -max_heap[0]
```

`heapify` rearranges the list into valid heap order in linear time. Popping `k - 1` times discards the `k-1` largest values, leaving the `k`th largest at the top — no need to sort the entire array.

**Worked example: K closest points to the origin.**

```python
import heapq

def k_closest(points, k):
    heap = []
    for x, y in points:
        dist_sq = x * x + y * y
        heapq.heappush(heap, (dist_sq, (x, y)))

    return [heapq.heappop(heap)[1] for _ in range(k)]
```

Pushing `(distance, point)` tuples works because Python heaps compare tuples element-by-element — the distance always determines priority. Squared distance is used instead of true Euclidean distance since only relative ordering matters, which avoids an unnecessary square root per point.

**Reach for a heap when:** you need to repeatedly pull the current smallest/largest item from a changing collection, you're maintaining a top-K or bottom-K set, or you want ordering without paying the full `O(n log n)` cost of sorting everything up front.

## Wrapping up the series

That's the core interview toolkit: arrays and strings as the foundation, hash maps and sets for fast lookups, two pointers and sliding window for linear scans, binary search for anything with a monotonic boundary, BFS/DFS for branching structures, and backtracking/heaps for exhaustive search and priority-based selection.

The patterns repeat far more than the problems do. Once you can recognize "this is a monotonic condition" or "this needs a running window" on sight, most of what's left is just plugging the specifics of the problem into a template you already know.
