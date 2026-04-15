# Federal Funds Rate vs. 30-Year Mortgage Rates

## Query

> "Show me the federal funds rate alongside 30-year mortgage rates for the last 10 years. How closely do they track?"

## FRED Data Series Used

*Based on the query, Claude selected the following FRED data series to pull and analyze:*

| Series | Description |
|--------|-------------|
| `FEDFUNDS` | Federal Funds effective rate — the overnight rate set by the Fed |
| `MORTGAGE30US` | 30-year fixed mortgage rate (Freddie Mac) — the rate consumers actually pay |

## Output

### Chart (2016–2026)

```
Date      FFR    30yr  Spread  (FFR=█  Mortgage=◆)
--------  -----  -----  -------  -----------------------------------------------
2016-01   0.34   3.87   +3.53   █··················◆
2016-12   0.54   4.20   +3.66   ██···················◆
2017-06   1.04   3.90   +2.86   █████··············◆
2018-05   1.70   4.59   +2.89   ████████··············◆
2018-10   2.19   4.83   +2.64   ██████████··············◆
2019-07   2.40   3.77   +1.37   ████████████······◆        ← market priced in cuts early
2020-04   0.05   3.31   +3.26   ················◆          ← COVID crash, FFR to zero
2021-12   0.08   3.10   +3.02   ···············◆
2022-04   0.33   4.98   +4.65   █·······················◆  ← mortgage blew past FFR
2022-10   3.08   6.90   +3.82   ███████████████···················◆
2023-05   5.06   6.43   +1.37   █████████████████████████·······◆
2023-10   5.33   7.62   +2.29   ██████████████████████████············◆  ← peak both
2024-08   5.33   6.50   +1.17   ██████████████████████████······◆      ← cuts expected, mortgage dips first
2024-11   4.64   6.81   +2.17   ███████████████████████···········◆    ← mortgage rose as FFR fell
2025-01   4.33   6.96   +2.63   █████████████████████·············◆
2026-03   3.64   6.18   +2.54   ██████████████████············◆
```

---

### Answer: They track each other — but loosely, with important divergences

**Correlation: 0.932** — strong directional relationship, but the spread is far from constant.

**Long-run average spread (mortgage − FFR): 2.57%**

---

### Key Patterns

**1. Normal spread ~2.5%**
Mortgages typically run 2.5% above the FFR. The long-run average in this dataset is 2.57%.

**2. 2019 compression to +1.37%**
The spread compressed sharply as the long-end bond market priced in Fed cuts *before* they happened. Mortgages are priced off the 10-year Treasury, not the FFR directly — so when the market expects cuts, long rates fall ahead of the overnight rate.

**3. 2022 overshoot to +4.65%**
Mortgages spiked to 4.98% in April 2022 while the FFR was still only at 0.33%. The bond market was panicking about inflation and pricing in a dramatic tightening cycle all at once. Mortgages led the FFR up by months.

**4. 2024 "stuck" mortgages**
The Fed cut rates from 5.33% → 4.33% through late 2024, but mortgage rates barely moved and actually *rose* in late 2024 (6.50% → 6.99%). Why? Long-term inflation expectations and Treasury yields stayed elevated. The Fed controls the overnight rate; mortgages follow the 10-year yield.

**5. Today (March 2026)**
FFR at 3.64%, mortgage at 6.18%, spread of +2.54% — back to roughly historical norms. Mortgage rates have come down slowly as the Fed has cut, but they remain elevated because 10-year yields haven't fully followed.

---

### The Core Insight

The Fed funds rate and mortgage rates share a strong long-run relationship (r = 0.932), but the *spread* between them reflects how the bond market sees inflation and future Fed policy. When the market is spooked (2022) or slow to believe cuts will stick (2024–2025), mortgages diverge significantly from what the overnight rate alone would predict. **Watching the FFR alone is an incomplete guide to mortgage affordability.**

---

*Data sourced from FRED (Federal Reserve Bank of St. Louis). Report generated April 14, 2026.*
