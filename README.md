# FRED Skill for Claude Code

A Claude Code skill that gives Claude direct access to the [Federal Reserve Bank of St. Louis FRED API](https://fred.stlouisfed.org/) — 800,000+ economic time series from the BLS, BEA, Federal Reserve, Census Bureau, IMF, World Bank, and dozens of other sources.

## What this is

Claude Code skills extend what Claude can do in a project by giving it tools, instructions, and context it wouldn't otherwise have. This skill equips Claude with a lightweight CLI it can run to search for, fetch, and explore FRED economic data. You interact through natural conversation — no knowledge of the FRED API required.

Once installed and configured, you interact with FRED entirely through natural conversation with Claude. Claude handles series discovery, fetching, transformation, and interpretation. You just ask questions.

## Why this exists

FRED is one of the most comprehensive public economic datasets in the world, but it requires knowing what you're looking for — specific series IDs, API parameters, transformation options. This skill removes that barrier: Claude knows how to navigate FRED's catalog, apply transformations server-side, and interpret the results in context.

It's useful any time you want data to inform a decision, understand an economic trend, research a topic, or produce analysis — without needing to be an economist or data engineer yourself.

## When to use it

Use this skill when you want to bring real economic data into a conversation. Some situations where it naturally applies:

- You're researching an industry, job market, geographic area, or sector and want current or historical data to inform your thinking
- You want to understand an economic trend (inflation, interest rates, housing, labor market) in plain terms
- You're preparing for a decision — career, financial, business — and want data-backed context
- You want a chart, comparison, or analysis of multiple economic indicators over time
- You're a practitioner who needs specific series, transformations, or time windows pulled quickly

## Setup

**1. Get a free FRED API key**

Register at [https://fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html). It's free and instant.

**2. Install the skill**

```bash
npx skills add 20twenty/publicgoods
```

This uses the [skills.sh](https://skills.sh) ecosystem to install all the skills in this repo. Follow the prompts to choose which skills to enable and whether to install at a project or global level.

Alternatively, you can install a single skill from this repo by adding the desired skill like this:

```bash
npx skills add 20twenty/publicgoods@fred
```

**3. Launch Claude with your API key**

Some skills require API keys for the underlying data services. Set them in your environment or pass them inline when launching Claude:

```bash
FRED_API_KEY=your_key_here claude
```

## How to use it

Just talk to Claude. You don't need to know FRED series IDs, API parameters, or CLI commands — Claude handles all of that. Describe what you want in natural language.

## Examples

### With example output

> I am considering a career change — use FRED data to help me get perspective as I consider my options.

[→ See example output](examples/example-career-change-labor-market.md)

> Show me the federal funds rate alongside 30-year mortgage rates for the last 10 years. How closely do they track?

[→ See example output](examples/example-fed-funds-vs-mortgage-rates.md)

> I'm trying to understand why my grocery bills feel so different from the official inflation numbers. Can you pull the relevant FRED data and explain what's happening?

[→ See example output](examples/example-grocery-bills-vs-cpi.md)

### More prompts to try

**Broad, exploratory:**

> Give me a macroeconomic snapshot of where the US economy stands right now — growth, inflation, employment, rates. Use the latest FRED data.

> We're thinking about buying a home in the next two years. What does FRED data tell us about the housing market, mortgage rates, and affordability trends?

> I run a small manufacturing business and I'm worried about a recession. What economic indicators should I be watching, and what do they currently show?

**Analytical and comparative:**

> Compare US unemployment and inflation over the last 20 years. Where are the major turning points and what caused them?

> How has real wage growth compared to productivity growth since 1980? Pull the data and help me understand the gap.

> What sectors have seen the strongest employment growth in the last 5 years? Are there any surprises?

**Specific and technical:**

> Get UNRATE for 2020–2024 and overlay it with the U-6 underemployment rate for the same period.

> Pull CPI year-over-year percent change and PCE year-over-year for the last 3 years. Which has been running hotter and by how much?

> Fetch quarterly GDP growth (SAAR) since 2015. Annualize it and flag any quarters that contracted.

> Get the 10-year minus 2-year Treasury spread (T10Y2Y) for the last 5 years and mark the periods where it went negative.

> Search for all FRED series related to small business and give me a summary of what data is available.

