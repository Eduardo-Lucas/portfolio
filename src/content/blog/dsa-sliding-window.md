---
title: "DSA Interview Patterns, Part 4: Sliding Window"
excerpt: "Sliding window extends two pointers from tracking two positions to managing an entire contiguous range. Fourth in a series on the core patterns behind LeetCode-style interviews, covering the fixed-size and dynamic-size variants."
date: "2026-08-12"
readTime: "3 min read"
tags: ["DSA", "Algorithms", "Interview Prep", "Python"]
---

Sliding window is a natural extension of two pointers, but instead of tracking two isolated positions, you're managing an entire contiguous range — the "window" — as it moves across an array or string. Any problem asking about contiguous segments (substrings, subarrays, runs of consecutive elements) is a strong signal for this pattern.

There are two variants: **fixed-size** and **dynamic-size**.

## Fixed-size window

Used when the problem hands you an explicit window length, e.g. "find the maximum sum of any subarray of length K." The window never grows or shrinks — you add one new element on the right and drop one old element on the left as you slide.

```python
def max_subarray_sum(nums, k):
    window_sum = sum(nums[:k])
    largest = window_sum

    for right in range(k, len(nums)):
        left = right - k
        window_sum -= nums[left]
        window_sum += nums[right]
        largest = max(largest, window_sum)

    return largest
```

The key efficiency win: you're not re-summing each `k`-length window from scratch (which would be `O(n·k)`). You're adjusting a running total by removing one value and adding another, keeping the whole thing `O(n)`.

## Dynamic-size window

Used when the window's size isn't given up front — you're looking for the longest, shortest, or otherwise "optimal" window that satisfies some condition. The window expands from the right while a condition holds, and shrinks from the left the moment it's violated.

**Worked example: longest substring without repeating characters.**

```python
from collections import defaultdict

def longest_unique_substring(s):
    longest = 0
    left = 0
    counts = defaultdict(int)

    for right in range(len(s)):
        counts[s[right]] += 1

        while counts[s[right]] > 1:
            counts[s[left]] -= 1
            left += 1

        longest = max(longest, right - left + 1)

    return longest
```

Step by step:

1. Extend the window by moving `right` forward and recording the new character.
2. If that character now appears more than once in the window, it's invalid — shrink from the left until the duplicate is resolved.
3. Once valid, update the answer using the current window size (`right - left + 1`).

Each character is added once and removed at most once, so even though there's a nested `while` loop, the total work is `O(n)` — every index only moves forward, never backward.

## Recognizing when to use it

The signal is almost always in the problem's phrasing:

- "Longest substring with at most K unique characters"
- "Smallest subarray with a sum greater than X"
- "Maximum average of any subarray of length K"

If you see "contiguous," "substring," "subarray," or a window length mentioned, sliding window is very likely the answer — and it turns what looks like an `O(n²)` brute-force scan into a single `O(n)` pass, because you're never revisiting the same element more than a constant number of times.

## What's next

Sliding window and two pointers both rely on scanning linear structures once. The next post covers a completely different way to cut work down — **binary search** — including a version that works even when your data isn't sorted in the traditional sense.
</content>
