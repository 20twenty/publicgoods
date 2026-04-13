#!/usr/bin/env node
// FRED API CLI — no external dependencies, requires Node 18+ (built-in fetch)
// Usage: node cli.js <command> [options]
// Commands: search, get-series, browse

const FRED_BASE = 'https://api.stlouisfed.org/fred';
const API_KEY = process.env.FRED_API_KEY;
if (!API_KEY) {
  console.error('Error: FRED_API_KEY environment variable is not set.');
  process.exit(1);
}

function usage() {
  console.error(`
FRED API CLI

Commands:
  search       Search for FRED data series
  get-series   Fetch observations for a series
  describe     Show category, release, and tags for a series
  browse       Browse categories, releases, or sources

Options for search:
  --text <str>          Search text
  --type <str>          full_text | series_id (default: full_text)
  --tags <str>          Comma-separated tag names to include
  --exclude-tags <str>  Comma-separated tag names to exclude
  --limit <n>           Max results (default: 25, max: 1000)
  --offset <n>          Pagination offset (default: 0)
  --order-by <field>    search_rank|series_id|title|units|frequency|popularity|last_updated|...
  --sort <asc|desc>     Sort order
  --filter-var <str>    frequency|units|seasonal_adjustment
  --filter-val <str>    Value for filter variable

Options for get-series:
  --id <series_id>      REQUIRED. Series ID (e.g. GDP, UNRATE, CPIAUCSL)
  --start <YYYY-MM-DD>  Observation start date
  --end <YYYY-MM-DD>    Observation end date
  --limit <n>           Max observations (max: 100000)
  --offset <n>          Pagination offset
  --sort <asc|desc>     Sort by date
  --units <str>         lin|chg|ch1|pch|pc1|pca|cch|cca|log
  --frequency <str>     d|w|bw|m|q|sa|a|...
  --aggregation <str>   avg|sum|eop
  --vintage <str>       Comma-separated vintage dates (YYYY-MM-DD)

Options for describe:
  --id <series_id>      REQUIRED. Series ID

Options for browse:
  --type <str>          REQUIRED. categories|releases|sources|category_series|release_series|release_dates
  --category-id <n>     Category ID (for categories/category_series)
  --release-id <n>      Release ID (for release_series)
  --start <YYYY-MM-DD>  Start date (for release_dates; defaults to today)
  --end <YYYY-MM-DD>    End date (for release_dates)
  --limit <n>           Max results (default: 50)
  --offset <n>          Pagination offset
  --order-by <str>      Field to order by
  --sort <asc|desc>     Sort order
`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key.startsWith('--')) {
      const name = key.slice(2);
      const val = argv[i + 1];
      if (val !== undefined && !val.startsWith('--')) {
        args[name] = val;
        i++;
      } else {
        args[name] = true;
      }
    }
  }
  return args;
}

// FRED uses semicolons as the tag_names delimiter; the CLI accepts commas for convenience.
function toTagNames(v) {
  return v ? v.split(',').map(t => t.trim()).join(';') : v;
}

async function fredFetch(endpoint, params = {}) {
  const url = new URL(`${FRED_BASE}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  }
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('file_type', 'json');

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`FRED API error ${res.status}: ${body}`);
  }
  return res.json();
}

function mapSeries(seriess = []) {
  return seriess.map(s => ({
    id: s.id,
    title: s.title,
    units: s.units,
    frequency: s.frequency,
    seasonal_adjustment: s.seasonal_adjustment,
    observation_start: s.observation_start,
    observation_end: s.observation_end,
    last_updated: s.last_updated,
    popularity: s.popularity,
    notes: s.notes,
  }));
}

async function cmdSearch(args) {
  if (!args.text && !args.tags) {
    console.error('Error: --text or --tags required for search');
    process.exit(1);
  }
  // When only --tags is given (no --text), series/search requires search_text and will 500.
  // Use the tags/series endpoint instead, which accepts tag_names directly.
  let data;
  if (args.tags && !args.text) {
    data = await fredFetch('tags/series', {
      tag_names: toTagNames(args.tags),
      exclude_tag_names: toTagNames(args['exclude-tags']),
      limit: args.limit || 25,
      offset: args.offset || 0,
      order_by: args['order-by'],
      sort_order: args.sort,
    });
  } else {
    data = await fredFetch('series/search', {
      search_text: args.text,
      search_type: args.type,
      tag_names: toTagNames(args.tags),
      exclude_tag_names: toTagNames(args['exclude-tags']),
      limit: args.limit || 25,
      offset: args.offset || 0,
      order_by: args['order-by'],
      sort_order: args.sort,
      filter_variable: args['filter-var'],
      filter_value: args['filter-val'],
    });
  }

  const results = mapSeries(data.seriess);

  console.log(JSON.stringify({
    count: data.count,
    offset: data.offset,
    limit: data.limit,
    showing: results.length,
    seriess: results,
  }, null, 2));
}

async function cmdGetSeries(args) {
  if (!args.id) {
    console.error('Error: --id <series_id> is required');
    process.exit(1);
  }
  const seriesId = args.id.toUpperCase();

  const [obsData, infoData] = await Promise.allSettled([
    fredFetch('series/observations', {
      series_id: seriesId,
      observation_start: args.start,
      observation_end: args.end,
      limit: args.limit,
      offset: args.offset,
      sort_order: args.sort,
      units: args.units,
      frequency: args.frequency,
      aggregation_method: args.aggregation,
      vintage_dates: args.vintage,
    }),
    fredFetch('series', { series_id: seriesId }),
  ]);

  if (obsData.status === 'rejected') {
    throw obsData.reason;
  }
  const obs = obsData.value;
  const info = infoData.status === 'fulfilled' ? infoData.value?.seriess?.[0] : null;

  const observations = (obs?.observations || []).map(o => ({
    date: o.date,
    value: o.value === '.' ? null : parseFloat(o.value),
  }));

  console.log(JSON.stringify({
    series_id: seriesId,
    title: info?.title,
    units: info?.units,
    frequency: info?.frequency,
    seasonal_adjustment: info?.seasonal_adjustment,
    observation_start: info?.observation_start,
    observation_end: info?.observation_end,
    count: observations.length,
    observations,
    source: 'Federal Reserve Bank of St. Louis (FRED)',
    notes: info?.notes,
  }, null, 2));
}

async function cmdDescribe(args) {
  if (!args.id) {
    console.error('Error: --id <series_id> is required');
    process.exit(1);
  }
  const seriesId = args.id.toUpperCase();

  const [catsData, relData, tagsData] = await Promise.allSettled([
    fredFetch('series/categories', { series_id: seriesId }),
    fredFetch('series/release', { series_id: seriesId }),
    fredFetch('series/tags', { series_id: seriesId, order_by: 'popularity', sort_order: 'desc' }),
  ]);

  const categories = catsData.status === 'fulfilled'
    ? (catsData.value.categories || []).map(c => ({ id: c.id, name: c.name, parent_id: c.parent_id }))
    : null;

  const release = relData.status === 'fulfilled'
    ? (relData.value.releases || []).map(r => ({ id: r.id, name: r.name, link: r.link }))[0] ?? null
    : null;

  const tags = tagsData.status === 'fulfilled'
    ? (tagsData.value.tags || []).map(t => t.name)
    : null;

  console.log(JSON.stringify({ series_id: seriesId, categories, release, tags }, null, 2));
}

async function cmdBrowse(args) {
  const browseType = args.type;
  if (!browseType) {
    console.error('Error: --type is required for browse (categories|releases|sources|category_series|release_series)');
    process.exit(1);
  }

  const common = {
    limit: args.limit || 50,
    offset: args.offset || 0,
    order_by: args['order-by'],
    sort_order: args.sort,
  };

  let data;
  switch (browseType) {
    case 'categories': {
      const catId = args['category-id'] ?? 0;
      // category/children does not accept limit/order_by — it always returns all direct children
      data = await fredFetch('category/children', { category_id: catId });
      data = { type: 'categories', parent_id: Number(catId), categories: data.categories };
      break;
    }
    case 'category_series': {
      if (!args['category-id']) {
        console.error('Error: --category-id required for category_series browse');
        process.exit(1);
      }
      data = await fredFetch('category/series', { category_id: args['category-id'], ...common });
      data = { type: 'category_series', category_id: args['category-id'], count: data.count, seriess: mapSeries(data.seriess) };
      break;
    }
    case 'releases': {
      data = await fredFetch('releases', common);
      data = { type: 'releases', count: data.count, releases: data.releases };
      break;
    }
    case 'release_series': {
      if (!args['release-id']) {
        console.error('Error: --release-id required for release_series browse');
        process.exit(1);
      }
      data = await fredFetch('release/series', { release_id: args['release-id'], ...common });
      data = { type: 'release_series', release_id: args['release-id'], count: data.count, seriess: mapSeries(data.seriess) };
      break;
    }
    case 'sources': {
      data = await fredFetch('sources', common);
      data = { type: 'sources', count: data.count, sources: data.sources };
      break;
    }
    case 'release_dates': {
      const today = new Date().toISOString().slice(0, 10);
      data = await fredFetch('releases/dates', {
        realtime_start: args.start || today,
        realtime_end: args.end,
        include_release_dates_with_no_data: 'false',
        ...common,
      });
      data = { type: 'release_dates', count: data.count, release_dates: data.release_dates };
      break;
    }
    default:
      console.error(`Unknown browse type: ${browseType}`);
      process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command) usage();

  const args = parseArgs(rest);

  try {
    switch (command) {
      case 'search':     await cmdSearch(args); break;
      case 'get-series': await cmdGetSeries(args); break;
      case 'describe':   await cmdDescribe(args); break;
      case 'browse':     await cmdBrowse(args); break;
      default:
        console.error(`Unknown command: ${command}`);
        usage();
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
