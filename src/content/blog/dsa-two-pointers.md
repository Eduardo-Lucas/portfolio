---
title: "DSA Interview Patterns, Part 3: Two Pointers"
excerpt: "Two pointers is one of the few techniques that improves both time and space at once. Third in a series on the core patterns behind LeetCode-style interviews, covering the inward-moving and fast/slow variants."
date: "2026-08-10"
readTime: "3 min read"
tags: ["DSA", "Algorithms", "Interview Prep", "Python"]
---

This is the third post in a series breaking down the core data structures and patterns you need for LeetCode-style interviews. Two pointers is one of the most foundational patterns for linear structures — arrays, strings, and linked lists. The idea is simple: instead of one index crawling through your data, you use two, moving them in a way that lets you avoid nested loops or repeated scanning.

There are two flavors, and recognizing which one a problem calls for is most of the battle.

## Pattern 1: pointers moving toward each other

You anchor one pointer at the start, one at the end, and move them inward based on some condition. This works especially well on **sorted arrays** or when comparing symmetric parts of a structure (like checking a palindrome).

```python
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if not s[left].isalnum():
            left += 1
            continue
        if not s[right].isalnum():
            right -= 1
            continue
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```

Notice the loop skips non-alphanumeric characters on each side before comparing, then lowercases both characters before checking equality. Each character gets visited at most once, so this runs in `O(n)` time with `O(1)` extra space — no reversed copy of the string needed.

This "move inward" pattern is powerful on sorted arrays specifically because every comparison lets you eliminate an entire range of possibilities. A brute-force pair-check is `O(n²)`; opposite-direction two pointers on sorted data gets you to `O(n)`.

**Reach for this when:** the array is sorted and you're looking for a pair/combination, you're comparing a structure against its mirror, or the brute-force solution is "check all pairs."

## Pattern 2: pointers moving in the same direction

Here both pointers start together (usually at the head) but move at different speeds — the classic **fast and slow pointer** setup.

```python
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow.val
```

For every two steps `fast` takes, `slow` takes one. When `fast` reaches the end of the list, `slow` is sitting exactly at the midpoint — in a single pass, with no extra space, and it naturally handles both even and odd-length lists (landing on the second middle node for even-length lists).

The same fast/slow setup is also the standard technique for **cycle detection**: if `fast` ever catches up to and equals `slow`, there's a loop in the list.

**Reach for this when:** you need to find a midpoint, detect a cycle, or otherwise track a relationship between two positions in a single pass without extra memory.

## Why this pattern is worth learning well

Two pointers is one of the few techniques that improves *both* time and space complexity simultaneously — you eliminate the need for a hash set or extra array while also cutting an `O(n²)` scan down to `O(n)`. It's also mostly intuition rather than memorization: once you recognize the shape (sorted input, symmetric comparison, or "find something in a linear structure with no extra space"), the pointer movement logic tends to fall out naturally.

The question to ask yourself: *can I solve this by walking the structure once, from both ends or at two speeds, instead of checking every combination?* If yes, two pointers is probably your answer.

## What's next

Two pointers naturally extends into a more powerful variant when you need to track an entire *range* of elements instead of just two positions — that's **sliding window**, covered next.
