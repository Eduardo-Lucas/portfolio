---
title: "DSA Interview Patterns, Part 1: Arrays, Strings, Sets, and Big O"
excerpt: "Before sliding window or backtracking, you need to be brutally solid on the fundamentals — because almost every 'clever' interview problem is really just arrays, strings, or sets used well. First in a series on the core patterns behind LeetCode-style interviews."
date: "2026-08-05"
readTime: "4 min read"
tags: ["DSA", "Algorithms", "Interview Prep", "Python"]
---

This is the first post in a series breaking down the core data structures and patterns you need for LeetCode-style interviews. Before diving into flashy patterns like sliding window or backtracking, it's worth being brutally solid on the fundamentals — because almost every "clever" interview problem is really just arrays, strings, or sets used well.

## Arrays: the default structure for everything

If your data is linear and ordered — numbers, characters, coordinates, objects — it's probably going to live in an array.

The property that makes arrays useful is **contiguous memory**. Every element sits right next to the previous one, so the computer can calculate the exact memory address of `arr[4]` without looking at anything else. That's why indexing is `O(1)`.

Where arrays get expensive is insertion and deletion in the middle:

```python
arr = [1, 2, 3, 4, 5]
arr.insert(0, 0)  # everything shifts right — O(n)
```

To make room for a new element (or close a gap after removing one), every element after that position has to move. So the rule of thumb is:

| Operation | Complexity | Why |
|---|---|---|
| Access by index | O(1) | Direct memory address |
| Append at the end | O(1) amortized | No shifting needed |
| Insert/delete at front or middle | O(n) | Everything shifts |

In interviews, arrays show up constantly for traversal, index comparisons, prefix sums, and as the raw material for two pointers and sliding window (which we'll cover in later posts). Don't treat them as "too basic to think about" — most efficient solutions come from exploiting array structure instead of brute-forcing over it.

## Strings: arrays of characters, with a catch

Strings behave like arrays of characters, but in most languages (Python included) they're **immutable**. Every "modification" actually creates a brand-new string.

This bites people in loops. It's tempting to write something like:

```python
result = ""
for char in some_list:
    result += char  # creates a new string every iteration
```

Each `+=` allocates a new string and copies everything that came before it, so this loop is `O(n²)` overall — not `O(n)` like it looks. The fix is to accumulate into a list and join once at the end:

```python
parts = []
for char in some_list:
    parts.append(char)
result = "".join(parts)  # O(n)
```

Aside from immutability, treat strings like arrays. Classic string problems — longest substring without repeating characters, anagram checks, pattern matching — are almost never about brute-force character-by-character comparison. They're sliding window or two pointer problems in disguise.

## Sets: fast existence checks, nothing more

A set is a collection of unique values with no defined order. Its superpower is membership checking in average `O(1)` time, versus `O(n)` for scanning a list:

```python
seen = set()
for num in nums:
    if num in seen:      # O(1) average
        return True
    seen.add(num)
return False
```

Use a set whenever the question you're really asking is "have I seen this before?" or "is this value currently in play?" — duplicate detection, sliding-window uniqueness tracking, quick lookups against a fixed collection.

One common mistake: sets don't store key-value pairs. If you need to associate a value *with* something, you want a hash map — which is the subject of the next post.

## Big O: the few classes that actually matter

You don't need to memorize twenty complexity classes. You need pattern recognition for a handful of them:

- **O(1)** — constant time. Index access, set/dict lookup.
- **O(log n)** — logarithmic. You're halving the problem each step (binary search).
- **O(n)** — linear. A single pass through the data. The most common class you'll write.
- **O(n log n)** — almost always sorting.
- **O(n²)** — nested loops, usually a sign of brute-force comparisons.

A practical rule of thumb for interviews based on input size:

- Input size up to **10⁵** → you generally need `O(n log n)` or better.
- Input size up to **10⁴** → `O(n²)` might squeak by.
- Beyond that → you have to optimize; nested loops won't pass.

Being able to glance at a nested loop and immediately think "that's probably too slow" — or see a halving pattern and think "that's logarithmic" — is worth more than memorizing complexity tables.

## What's next

With arrays, strings, sets, and Big O intuition in place, the next post covers **hash maps** — arguably the single most useful pattern in the entire interview toolkit, and the structure behind the classic Two Sum problem.
