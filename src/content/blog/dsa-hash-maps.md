---
title: "DSA Interview Patterns, Part 2: Hash Maps"
excerpt: "If there's one data structure that unlocks the most interview problems, it's the hash map. Second in a series on the core patterns behind LeetCode-style interviews, covering Two Sum and the one-pass mindset."
date: "2026-08-07"
readTime: "3 min read"
tags: ["DSA", "Algorithms", "Interview Prep", "Python"]
---

This is the second post in a series breaking down the core data structures and patterns you need for LeetCode-style interviews. If there's one data structure that unlocks the most interview problems, it's the hash map. A huge share of "how do I avoid brute force here?" questions have the same answer: store something in a hash map as you go, so you never have to re-scan what you've already seen.

## What a hash map actually gives you

A hash map is a key-value store where both lookup and insertion run in average `O(1)` time, regardless of how many entries it holds. The mechanism: a hash function converts a key into a number that points directly to a storage slot, so you never scan every entry to find the one you want — you compute exactly where it lives.

Two different keys can occasionally hash to the same slot (a collision). Every mainstream language's built-in hash map implementation handles this internally, so in practice you don't need to think about it — just know it's why hash maps have *average* rather than guaranteed `O(1)` performance.

One hard rule: keys must be **hashable**, meaning immutable. Numbers, strings, and tuples work fine as keys. Lists and dictionaries do not, because their contents can change after insertion, which would break the hash. If you need to use something list-like as a key (e.g., grouping by a sorted set of characters), convert it to a tuple or string first.

## The core shape you'll write over and over

Almost every hash map solution reduces to this pattern:

```python
counts = {}
for item in data:
    if item not in counts:
        counts[item] = 1
    else:
        counts[item] += 1
```

Python gives you shortcuts — `collections.defaultdict(int)` or `dict.get(key, default)` — but the underlying logic never changes: store something under a key, then look it up or update it later. Critically, you usually build and query the map **in the same pass**, which is what turns a two-pass brute-force solution into a one-pass `O(n)` one.

The mental trigger to reach for a hash map: *"What could I store right now to avoid redoing work later?"* If you can answer that question, you're most of the way to a solution.

## Worked example: Two Sum

Given an array of integers and a target, return the indices of two numbers that add up to the target.

Brute force checks every pair — `O(n²)`. The hash map insight: for each number, you already know what its "partner" needs to be (`target - num`). So instead of searching for that partner, just check whether you've already seen it.

```python
def two_sum(nums, target):
    num_to_index = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_to_index:
            return [num_to_index[complement], i]
        num_to_index[num] = i
    return []
```

Walking through the logic:

1. For each number, compute the complement needed to hit the target.
2. Check the map — have we already seen that complement? If yes, we're done.
3. If not, store the current number and its index for future lookups.

**Complexity:** `O(n)` time — one pass, constant-time lookups and inserts at each step. `O(n)` space in the worst case, since the map could end up holding every element.

## Where hash maps show up

Hash maps aren't limited to "find a pair" problems. You'll reach for them in:

- Frequency counting (anagrams, majority elements, character frequency in sliding windows)
- Grouping (group anagrams by sorted characters, group items by a computed key)
- Caching intermediate results in recursion or dynamic programming
- Adjacency lists for graph traversal (which we'll get to when we cover BFS/DFS)

If you're ever stuck between an `O(n²)` brute-force solution and something faster, ask what information you're recomputing repeatedly — that's almost always the thing to cache in a hash map.

## What's next

Next up: **two pointers**, the pattern that takes over when hash maps aren't the right fit — particularly for sorted arrays, palindrome checks, and linked list problems.
</content>
