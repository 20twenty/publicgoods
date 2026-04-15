# Why Your Grocery Bills Feel Worse Than CPI Says

## Query

> "I'm trying to understand why my grocery bills feel so different from the official inflation numbers. Can you pull the relevant FRED data and explain what's happening?"

## FRED Data Series Used

*Based on the query, Claude selected the following FRED data series to pull and analyze:*

| Series | Description |
|--------|-------------|
| `CPIAUCSL` | Headline CPI (all urban consumers) — the "official" inflation number |
| `CPIFABSL` | Food at home (groceries) CPI — tracks what you pay at the grocery store |
| `CPIUFDSL` | All food CPI — groceries plus restaurants |
| `CUSR0000SAF112` | Meats, poultry, fish, and eggs CPI — a high-visibility subcategory |
| `CUSR0000SAF111` | Cereals and bakery products CPI — another high-visibility subcategory |
| `APU0000708111` | Average price of eggs, grade A large ($/dozen) — absolute price, not index |
| `APU0000709112` | Average price of whole milk ($/gallon) — absolute price, not index |

## Output

### 1. Groceries really did inflate faster than everything else

The 2021–2023 surge hit food harder than the overall economy:

| Category | Peak YoY Inflation | Cumulative Rise (Jan 2021 → Mar 2026) |
|---|---|---|
| Overall CPI (headline) | +9.0% (Jun 2022) | +25.7% |
| Groceries (food at home) | +10.9% (Aug 2022) | +27.0% |
| Meats / Poultry / Fish / Eggs | +14.4% (Apr 2022) | +29.3% |
| Cereals & Bakery | +16.4% (Aug 2022) | +28.7% |

Grocery prices led the inflation wave up, and they don't come back down when the rate cools — prices stay elevated at the new plateau. A YoY rate of +2.7% today means you're paying +2.7% on top of already-elevated 2025 prices.

---

### 2. Your mental price anchors are from before 2021

Your brain benchmarks prices against what things used to cost. The CPI only measures the *rate of change* — it dropped from +10.9% to +2.7%, but that doesn't mean prices fell. The cumulative hit since 2021 is ~27% on groceries. The YoY number cooling down just means the pace of new pain slowed; the old pain is permanent.

---

### 3. Specific items got crushed and haven't fully recovered

Eggs are the starkest example from the FRED data:

| Item | Jan 2021 | Mar 2026 | Change |
|---|---|---|---|
| Eggs (dozen) | $1.47 | $2.35 | +60% |
| Milk (gallon) | $3.47 | $4.07 | +17% |

Egg prices were driven by the 2022–2023 avian flu outbreak wiping out laying-hen flocks. That's a supply shock layered on top of general food inflation — the CPI aggregate smooths it out, but your egg aisle doesn't.

---

### 4. The CPI basket doesn't match your shopping cart

The headline CPI is a weighted average across hundreds of goods and services — housing, medical care, airline tickets, used cars. Shelter alone is ~35% of CPI. If you own your home, you don't feel that. If you mostly notice food, energy, and insurance, you're tracking a very different basket — one that inflated harder. Food is only about 14% of the CPI weight, so even a 10% food spike only moves the headline by ~1.4 points.

---

### The short version

The official number isn't lying, but it's measuring something broader than your grocery run. Food prices spiked harder than headline CPI during 2021–2023, and while the rate has cooled to ~2.7% YoY, you're still paying ~27% more than you did in early 2021 — and that doesn't go away.

---

*Data sourced from FRED (Federal Reserve Bank of St. Louis). Report generated April 15, 2026.*
