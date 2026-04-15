---
name: fred
description: Query the St. Louis Fed (FRED) economic data API. Use this skill to search for economic data series, fetch observations (GDP, unemployment, inflation, etc.), or browse FRED's catalog of categories/releases/sources. Trigger when the user asks about economic data, Fed data, FRED series, or wants to fetch/chart economic indicators.
---

# FRED Economic Data Skill

This skill gives you direct access to the Federal Reserve Bank of St. Louis (FRED) API via a local Node.js CLI — no MCP server required.

The CLI lives at `<SKILL_DIR>/scripts/cli.js`. Replace `<SKILL_DIR>` with the absolute path to this skill's base directory (sometimes shown in the **Base directory** header when the skill loads). It requires Node 18+ (for built-in `fetch`). No npm install needed.

## About FRED

FRED hosts over 800,000 economic time series from ~100 sources — BLS, BEA, Census, Federal Reserve, IMF, World Bank, and others. It covers US macroeconomic indicators (GDP, inflation, unemployment, interest rates, money supply), regional and state-level data, international comparisons, and financial market series. Most series are free and publicly available.

**Discovery pattern:** If you don't have a series ID, `search` first to find candidates, then `get-series` to pull the data. If you're exploring a topic area, `browse` lets you navigate the category tree or find everything within a release (e.g., all CPI series from the BLS CPI release).

**Key concepts:**
- A **series ID** is the stable identifier for a data series (e.g., `UNRATE`, `GDP`, `CPIAUCSL`). These are the primary thing to find and use.
- A **release** groups related series published together (e.g., the BLS publishes UNRATE, labor force participation, and dozens of other series in a single monthly release).
- A **category** is FRED's own topical organization of series (e.g., "Prices > CPI").
- **Seasonal adjustment** matters — `UNRATE` (seasonally adjusted) and `UNRATENSA` (not) have different behavior; check the `seasonal_adjustment` field to know what you have.
- **Missing values** appear as `null` in observations — common at the start of transformed series (e.g., year-over-year change has no value for the first year).

## Commands

### 1. Search for series

Use this when you have a topic or concept but don't know the series ID. Sort by `popularity` to surface the most-used series first — for common indicators, the top result is usually what you want.

```bash
node <SKILL_DIR>/scripts/cli.js search --text "unemployment rate" --limit 10
node <SKILL_DIR>/scripts/cli.js search --text "CPI" --order-by popularity --sort desc --limit 5
node <SKILL_DIR>/scripts/cli.js search --text "GDP" --type series_id
node <SKILL_DIR>/scripts/cli.js search --tags "monthly,nsa" --limit 20
```

**Options:**
- `--text <str>` — search query (required unless `--tags` is used)
- `--type <str>` — `full_text` (default) or `series_id` (matches against the ID string itself)
- `--tags <str>` — comma-separated FRED tag names to filter by (e.g. `monthly`, `nsa`, `usa`, `bls`)
- `--exclude-tags <str>` — comma-separated tag names to exclude
- `--limit <n>` — max results (default: 25, max: 1000)
- `--offset <n>` — pagination offset
- `--order-by <field>` — `search_rank`, `series_id`, `title`, `units`, `frequency`, `popularity`, `group_popularity`, `last_updated`, `observation_start`, `observation_end`, `seasonal_adjustment`, `realtime_start`, `realtime_end`
- `--sort <asc|desc>` — sort order
- `--filter-var <str>` — `frequency`, `units`, or `seasonal_adjustment`
- `--filter-val <str>` — value for the filter variable (e.g. `Monthly`, `Percent`)

> `--type`, `--filter-var`, `--filter-val` only apply when `--text` is given. Tags-only searches use a different endpoint that does not support these options. `search_rank` and `group_popularity` are also invalid `--order-by` values for tags-only searches.

**Returns:** JSON with `count` (total matching), `limit`, `offset`, `showing` (results in this page), and `seriess` array. Each series has: `id`, `title`, `units`, `frequency`, `seasonal_adjustment`, `observation_start`, `observation_end`, `last_updated`, `popularity`, `notes`.

---

### 2. Fetch series data (observations)

Use this once you have a series ID. By default returns the full history in ascending date order. Use `--start`/`--end` to narrow the window, `--sort desc --limit N` to get the most recent N observations, and `--units`/`--frequency` to apply transformations server-side.

```bash
node <SKILL_DIR>/scripts/cli.js get-series --id GDP
node <SKILL_DIR>/scripts/cli.js get-series --id UNRATE --start 2020-01-01 --end 2024-12-31
node <SKILL_DIR>/scripts/cli.js get-series --id CPIAUCSL --units pc1 --frequency a
node <SKILL_DIR>/scripts/cli.js get-series --id DFF --limit 30 --sort desc
```

**Options:**
- `--id <series_id>` — REQUIRED. Series ID (e.g. `GDP`, `UNRATE`, `CPIAUCSL`, `DFF`, `T10Y2Y`)
- `--start <YYYY-MM-DD>` — observation start date
- `--end <YYYY-MM-DD>` — observation end date
- `--limit <n>` — max observations to return (max: 100000)
- `--offset <n>` — pagination offset
- `--sort <asc|desc>` — sort by date (default: `asc`)
- `--units <str>` — data transformation applied by FRED before returning:
  - `lin` — levels (no transformation, default)
  - `chg` — change from prior period
  - `ch1` — change from one year ago
  - `pch` — percent change from prior period
  - `pc1` — percent change from one year ago
  - `pca` — compounded annual rate of change
  - `cch` — continuously compounded rate of change
  - `cca` — continuously compounded annual rate of change
  - `log` — natural log
- `--frequency <str>` — aggregate to lower frequency: `d` (daily), `w` (weekly), `bw` (biweekly), `m` (monthly), `q` (quarterly), `sa` (semiannual), `a` (annual)
- `--aggregation <str>` — how to aggregate when downsampling: `avg` (default), `sum`, or `eop` (end of period)
- `--vintage <str>` — comma-separated vintage dates (`YYYY-MM-DD`) for real-time/as-published data (ALFRED feature — may return an error if the series has no vintage history available with your API key)

**Returns:** JSON with `series_id`, `title`, `units`, `frequency`, `seasonal_adjustment`, `observation_start`, `observation_end` (full series range, not the filtered window), `count`, `source`, `notes`, and `observations` array. Each observation has `date` (`YYYY-MM-DD`) and `value` (number, or `null` for missing).

---

### 3. Describe a series

Use this to understand a series you've found — which category it lives in, which release publishes it, and what tags it carries. Useful for finding related series (search by the same tags, or browse the same release).

```bash
node <SKILL_DIR>/scripts/cli.js describe --id UNRATE
node <SKILL_DIR>/scripts/cli.js describe --id CPIAUCSL
```

**Options:**
- `--id <series_id>` — REQUIRED. Series ID

**Returns:** JSON with `series_id`, `categories` (array of `{id, name, parent_id}`), `release` (`{id, name, link}` or `null`), and `tags` (array of tag name strings, ordered by popularity).

---

### 4. Browse catalog

Use this to explore FRED's structure when you don't have a starting point, enumerate series within a release or category, or check the upcoming release calendar.

```bash
# Navigate the category tree
node <SKILL_DIR>/scripts/cli.js browse --type categories
node <SKILL_DIR>/scripts/cli.js browse --type categories --category-id 32455

# Find series in a category or release
node <SKILL_DIR>/scripts/cli.js browse --type category_series --category-id 32455 --limit 20
node <SKILL_DIR>/scripts/cli.js browse --type release_series --release-id 10

# Enumerate releases and sources
node <SKILL_DIR>/scripts/cli.js browse --type releases --limit 30
node <SKILL_DIR>/scripts/cli.js browse --type sources

# Upcoming release calendar (defaults to today onward)
node <SKILL_DIR>/scripts/cli.js browse --type release_dates --limit 20
node <SKILL_DIR>/scripts/cli.js browse --type release_dates --start 2026-04-14 --end 2026-04-30
```

**Options:**
- `--type <str>` — REQUIRED. One of: `categories`, `category_series`, `releases`, `release_series`, `sources`, `release_dates`
- `--category-id <n>` — category ID (required for `category_series`; optional for `categories`, defaults to root)
- `--release-id <n>` — release ID (required for `release_series`)
- `--start <YYYY-MM-DD>` — start date for `release_dates` (defaults to today)
- `--end <YYYY-MM-DD>` — end date for `release_dates`
- `--limit <n>` — max results (default: 50; not applicable to `categories`)
- `--offset <n>` — pagination offset
- `--order-by <str>` — field to sort by
- `--sort <asc|desc>` — sort order

**Returns by type:**
- `categories` → `{type, parent_id, categories: [{id, name, parent_id}]}`
- `category_series` → `{type, category_id, count, seriess: [series objects]}`
- `releases` → `{type, count, releases: [{id, name, press_release, link, notes}]}`
- `release_series` → `{type, release_id, count, seriess: [series objects]}`
- `sources` → `{type, count, sources: [{id, name, realtime_start, realtime_end, link}]}`
- `release_dates` → `{type, count, release_dates: [{release_id, release_name, date}]}`

Series objects in `seriess` arrays contain: `id`, `title`, `units`, `frequency`, `seasonal_adjustment`, `observation_start`, `observation_end`, `last_updated`, `popularity`, `notes`.

---

## Working with Large or Complex Data

For small fetches (a dozen observations, a quick lookup), reading JSON output directly is fine. For anything larger or requiring further processing, redirect output to a temp file:

```bash
node <SKILL_DIR>/scripts/cli.js get-series --id GDP --start 2000-01-01 > /tmp/fred_GDP.json
```

**When to use a file:**
- **Large datasets** — hundreds of observations will bloat context and make analysis harder. Write to a file and process with `jq`, Python, or similar.
- **Charting** — generating a chart requires a script to consume the data. Write to a file first, then pass the path to your charting script.
- **Cross-series joins** — combining multiple series is cleaner when each is a file you can join programmatically.

Naming convention:
```bash
/tmp/fred_<SERIES_ID>.json        # single series
/tmp/fred_<SERIES_ID>_pc1.json    # transformed variant
```

## Workflow Tips

- **Finding a series ID:** sort search results by `popularity` desc — the canonical series for any common indicator is nearly always in the top 3 results.
- **Getting the latest value:** `--sort desc --limit 1`
- **Year-over-year changes:** `--units pc1` — FRED applies the transformation server-side, no post-processing needed.
- **Annual average of a monthly series:** `--frequency a --aggregation avg`
- **Comparing seasonally adjusted vs. unadjusted:** search returns both; check the `seasonal_adjustment` field. The SA version usually has `SL` or no suffix; NSA versions often have `NS` or `NSA` in the ID.
- **Understanding a series:** the `notes` field in search and get-series output contains the official methodology description — it's worth reading for anything non-obvious.
- **Release-based discovery:** if you want all series from a specific data release (e.g., the Employment Situation from BLS), `browse --type releases` to find the release ID, then `browse --type release_series` to enumerate its series.
- **Finding related series:** `describe --id <series>` returns the release and tags for a series — you can then search those same tags or browse that release to find closely related series.
- **Release calendar:** `browse --type release_dates` shows what economic data is being published soon, useful for knowing when GDP, CPI, jobs numbers, etc. are next due.
- **Rate limit:** FRED strictly enforces a limit of 120 requests/minute and does NOT allow parallel requests. If you trigger rate limits you may get banned so be careful with loops or multiple calls. For large data needs, it's best to fetch once to a file and then work with the file rather than making multiple API calls.
