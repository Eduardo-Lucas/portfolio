---
title: "Database Indexing: The Difference Between a 2ms Query and a 20-Second One"
excerpt: "A single CREATE INDEX statement can turn a full table scan into a lookup that touches a handful of rows — but every index also slows down writes and costs storage. Here's how indexes actually work under the hood, and when to skip them."
date: "2026-11-01"
readTime: "5 min read"
tags: ["System Design", "Practitioner", "Databases", "Performance"]
---

If you've ever watched a query go from instant to unbearably slow as a table grew from 10,000 rows to 10 million, you've felt the absence of an index. Indexing is one of the highest-leverage skills a developer can have — a five-minute change can turn a full table scan into a lookup that touches a handful of rows. This post walks through what indexes actually are, how they work under the hood, the main types you'll encounter, and the tradeoffs that trip people up.

## What an Index Actually Is

A database index is a separate data structure that stores a sorted (or otherwise organized) copy of one or more columns, along with a pointer back to the full row. Without an index, the database has no choice but to perform a **sequential scan** — reading every single row to check if it matches your query.

Think of it like the index at the back of a textbook. You could find every mention of "concurrency" by reading all 400 pages, or you could flip to the index, find the term, and jump directly to pages 12, 87, and 203. The book itself didn't change — you just added a lookup structure on top of it.

```sql
-- Without an index: full table scan across every row
SELECT * FROM orders WHERE customer_id = 4821;

-- With an index on customer_id: direct lookup
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```

That single `CREATE INDEX` statement can turn an O(n) scan into an O(log n) lookup.

## How It Works Under the Hood: The B-Tree

Most relational databases (PostgreSQL, MySQL, SQL Server) use a **B-tree** (balanced tree) as the default index structure. A B-tree keeps data sorted and organized so that searches, insertions, and deletions all take logarithmic time.

Here's the key property: at each level of the tree, the database eliminates a large fraction of the remaining rows. A table with 10 million rows might only need 3–4 tree traversals to find a match, compared to scanning up to 10 million rows sequentially.

B-trees are also why **range queries** (`WHERE created_at > '2026-01-01'`) and **sorting** (`ORDER BY`) benefit from indexes — the data is already stored in sorted order, so the database doesn't need a separate sort step.

## Common Index Types

Not every index is a B-tree. The right structure depends on the query pattern:

- **B-Tree** — the default and most common. Great for equality (`=`), range (`<`, `>`, `BETWEEN`), and sorting operations.
- **Hash Index** — optimized purely for equality lookups (`=`). Faster than a B-tree for exact matches but useless for ranges or sorting.
- **GIN (Generalized Inverted Index)** — used in PostgreSQL for indexing composite values like arrays, JSONB documents, and full-text search vectors.
- **GiST (Generalized Search Tree)** — supports geometric data types and full-text search; the backbone of PostGIS spatial queries.
- **Bitmap Index** — efficient for columns with low cardinality (few distinct values, like `status` or `is_active`), common in data warehouses.

Choosing the wrong type won't break your query — it'll just quietly cost you performance.

## Composite Indexes and Column Order

When a query filters on multiple columns, a **composite (multi-column) index** can help — but column order matters enormously.

```sql
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
```

This index efficiently serves:
- `WHERE customer_id = 4821` — yes
- `WHERE customer_id = 4821 AND status = 'shipped'` — yes

But it does **not** efficiently serve:
- `WHERE status = 'shipped'` — no, because you can't skip to the middle of a sorted structure without the leading column

The rule of thumb: put the column with the highest selectivity (most distinct values) or the one always present in your `WHERE` clause first, and match the order of your most common query patterns.

## The Cost Nobody Talks About: Writes Get Slower

Indexes aren't free. Every `INSERT`, `UPDATE`, or `DELETE` has to update every index on that table, not just the underlying data. A table with eight indexes means eight extra data structures to maintain on every write.

This creates a real tradeoff:

| | Read-heavy table | Write-heavy table |
|---|---|---|
| More indexes | Big win | Real cost |
| Fewer indexes | Slower reads | Faster writes |

Indexing every column "just in case" is a common mistake. It bloats storage, slows down writes, and often confuses the query planner into picking a worse execution plan.

## When *Not* to Index

Skip indexing when:

- The table is small (a few hundred rows) — a sequential scan is already fast enough that an index adds overhead for no benefit.
- The column has low cardinality and isn't combined with other filters (e.g., a boolean flag on its own).
- The table is write-heavy and the column is rarely used in `WHERE`, `JOIN`, or `ORDER BY` clauses.
- You're indexing a column that's frequently updated — every update means re-sorting the index entry too.

## How to Know If an Index Is Actually Helping

Don't guess — measure. Use `EXPLAIN ANALYZE` (PostgreSQL/MySQL) to see the actual execution plan:

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 4821;
```

Look for `Seq Scan` (bad, on a large table) versus `Index Scan` or `Index Only Scan` (good). If you add an index and the planner still chooses a sequential scan, it usually means the table is too small, the column has low selectivity, or statistics are stale (`ANALYZE` the table to refresh them).

## Takeaways

- Indexes trade write speed and storage for dramatically faster reads.
- B-trees handle the majority of real-world cases: equality, ranges, and sorting.
- Column order in composite indexes should mirror your actual query patterns.
- Always verify with `EXPLAIN ANALYZE` — intuition about what "should" be fast is often wrong.
- Index what you query often; don't index everything.

Get the fundamentals right here, and most query performance problems solve themselves before they ever become a production incident.
