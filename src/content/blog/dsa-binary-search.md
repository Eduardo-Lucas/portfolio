---
title: "DSA Interview Patterns, Part 5: Binary Search"
excerpt: "Binary search isn't just 'search a sorted array' — it generalizes to any monotonic condition. Fifth in a series on the core patterns behind LeetCode-style interviews, covering the standard algorithm and the boundary-search template it unlocks."
date: "2026-08-14"
readTime: "3 min read"
tags: ["DSA", "Algorithms", "Interview Prep", "Python"]
---

Binary search's core idea is simple: cut the search space in half on every step, turning an `O(n)` scan into `O(log n)`. Most people know the "search a sorted array" version. Fewer realize it generalizes to a much larger class of problems — anything with a **monotonic condition**, sorted or not.

## The standard version

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

Each iteration checks the midpoint and discards half the remaining space based on the comparison. Because you eliminate half the candidates every step, you can search a million-element array in about 20 comparisons instead of a million.

## The generalization: monotonic conditions

Here's the part that unlocks a lot of "trickier" interview problems: a sorted array is really just one example of a **monotonic condition** — something that only changes in one direction once. Think of a boolean function `f(i)` that's `false` for a while and then flips to `true` and stays `true`. You can binary search for that flip point in `O(log n)`, even though there's no traditional "sorted" array involved.

The template for "find the first index where a condition becomes true":

```python
def find_boundary(n, condition):
    left, right = 0, n - 1
    best = -1

    while left <= right:
        mid = (left + right) // 2
        if condition(mid):
            best = mid
            right = mid - 1   # keep looking for an earlier true
        else:
            left = mid + 1

    return best
```

The difference from vanilla binary search: instead of comparing `arr[mid]` to a target, you ask a yes/no question — *"does index `mid` satisfy the condition?"* If yes, it's a candidate answer, but you keep searching left in case an earlier index also qualifies. If no, that half is entirely invalid and you move right.

## Worked example: minimum in a rotated sorted array

Given a sorted array that's been rotated at an unknown pivot (e.g. `[10, 20, 30, 40, 50]` becomes `[30, 40, 50, 10, 20]`), find the index of the smallest element.

The array isn't sorted anymore in the traditional sense, but there's still a monotonic structure hiding in it: every element before the minimum is *greater* than the array's last element, and every element from the minimum onward is *less than or equal to* it. That's a one-way flip — exactly the shape binary search wants.

```python
def find_min_index(nums):
    left, right = 0, len(nums) - 1
    best = 0

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] <= nums[-1]:
            best = mid
            right = mid - 1
        else:
            left = mid + 1

    return best
```

The condition being tested is `nums[mid] <= nums[-1]`. That produces a run of `False` followed by a run of `True`, and we're finding the first `True` — the same boundary-search shape as before, just with a different condition function plugged in.

## When to reach for this pattern

- The array is sorted (or the problem says it's a "rotated sorted array").
- You're minimizing or maximizing something, and you can write a function that answers "is this value/index feasible?"
- The brute-force approach would be scanning linearly for a threshold or boundary.

The mental shift: stop asking "is `arr[mid]` equal to my target?" and start asking "does `condition(mid)` hold?" Once you can write that condition function, the search loop is almost always the same shape.

## What's next

Binary search cuts through linear and monotonic structures. For structures that branch — trees and graphs — the tools of choice are **BFS and DFS**, covered next.
