const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const data = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const checks = [];
for (const narrow of [false, true]) {
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', scrollTop: 0, offsetTop: 0, dataset: {},
      addEventListener() {}, scrollIntoView() {}, focus() {},
      getBoundingClientRect() { return { top: 0, bottom: 900 }; }
    });
    return nodes.get(id);
  };
  const ctx = vm.createContext({
    location: { hash: '' },
    localStorage: { getItem() { return null; }, setItem() {} },
    matchMedia(query) { return { matches: query.includes('max-width') && narrow, addEventListener() {} }; },
    document: {
      documentElement: { dataset: {}, classList: { toggle() {} } }, body: { style: {} },
      getElementById: node, querySelector() { return null; }, querySelectorAll() { return []; },
      addEventListener() {}
    },
    window: { addEventListener() {}, scrollTo() {} }, scrollY: 0, scrollTo() {}, console
  });
  scripts.forEach(script => vm.runInContext(script, ctx));
  const citySweep = (data.systemic || [])[0];
  if (citySweep) {
    const inspected = citySweep.cities.filter(c => c[6].length || c[4] === 's' || c[4] === 'd').length;
    if (vm.runInContext('SYS.inspected', ctx) !== inspected) throw new Error('City count omits inspected directories or includes access failures');
    for (const c of citySweep.cities.filter(c => c[4] === 'd' && !c[6].length)) {
      ctx.location.hash = `#A1.city.${c[0]}`;
      vm.runInContext('render()', ctx);
      const page = node('root').innerHTML;
      if (!page.includes('This result includes a check of service listings and links.') || page.includes('<b>Not yet inspected</b>')) throw new Error(`Directory scope or result missing: ${c[0]}`);
    }
  }
  for (const layout of ['A', 'A1', 'A2', 'A3', 'B', 'C']) {
    const routes = [`#${layout}`];
    for (const area of data.areas) {
      routes.push(`#${layout}.area.${area.id}`);
      for (const topic of area.topics) routes.push(`#${layout}.topic.${area.id}~${topic.id}`);
    }
    for (const cid of Object.keys(data.cases)) routes.push(`#${layout}.case.${cid}`);
    // Institution pages exist only in A1 and only when the data carries groups; without groups they fall back to the front page.
    const groups = data.groups || [], must = {}, sourceOnArrival = {}, sys = (data.systemic || [])[0], cityFindings = {}, cityData = {};
    if (layout === 'A1') {
      must['#A1'] = groups.length ? 'class="lens"' : 'class="home-cols"';
      routes.push('#A1.inst');
      must['#A1.inst'] = groups.length ? 'class="home-cols"' : 'class="hero"';
      for (const g of groups) {
        routes.push(`#A1.group.${g.id}`);
        must[`#A1.group.${g.id}`] = 'res-q';
        for (const e of g.ents) {
          routes.push(`#A1.entity.${g.id}~${e.id}`);
          must[`#A1.entity.${g.id}~${e.id}`] = 'res-card';
          const seenCases = new Set();
          for (const row of e.rows) {
            const c = data.cases[row[1]];
            if (row[0] !== 'bad' || !c || seenCases.has(row[1])) continue;
            seenCases.add(row[1]);
            const route = `#A1.case.${row[1]}.from-${g.id}~${e.id}`;
            routes.push(route);
            const v = c.versions.find(v => v.url.split('#')[0] === row[2].split('#')[0]) || c.versions[0];
            sourceOnArrival[route] = v.url;
          }
        }
      }
      routes.push('#A1.group.no-such-group', '#A1.entity.no-such~entity');
      // Systemic sweeps are optional like the groups: without data the overview falls back to the front page.
      routes.push('#A1.sys');
      must['#A1.sys'] = sys ? 'id="sy-bands"' : 'class="hero"';
      for (const c of sys ? sys.cities : []) {
        routes.push(`#A1.city.${c[0]}`);
        must[`#A1.city.${c[0]}`] = 'class="area-head"';
        cityFindings[`#A1.city.${c[0]}`] = c[6].length;
        cityData[`#A1.city.${c[0]}`] = c[6];
      }
      routes.push('#A1.city.no-such-city');
      // Districts join the same pages; a district id is never a city route and the other way round.
      for (const d of sys ? sys.districts || [] : []) {
        routes.push(`#A1.district.${d[0]}`);
        must[`#A1.district.${d[0]}`] = 'class="area-head"';
        cityFindings[`#A1.district.${d[0]}`] = d[5].length;
        cityData[`#A1.district.${d[0]}`] = d[5];
      }
      routes.push('#A1.district.no-such-district');
      if (sys && (sys.districts || []).length) routes.push(`#A1.city.${sys.districts[0][0]}`, `#A1.district.${sys.cities[0][0]}`);
    }
    for (const route of routes) {
      ctx.location.hash = route;
      vm.runInContext('render()', ctx);
      const html = nodes.get('root').innerHTML;
      if (html.length < 100) throw new Error(`Empty output: ${route}`);
      if (must[route] && !html.includes(must[route])) throw new Error(`Missing ${must[route]}: ${route}`);
      if (sourceOnArrival[route]) {
        const escaped = sourceOnArrival[route].replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        if (!html.includes(`href="${escaped}" target="_blank"`)) throw new Error(`Wrong publication on arrival: ${route}`);
      }
      if (!groups.length && !sys && html.includes('class="lens"')) throw new Error(`Institution switch without data: ${route}`);
      // The sweep switch is part of the header, and the systemic overview says how many were inspected and the share of them.
      if (data.groups && data.groups.length && ['#A1', '#A1.inst', '#A1.sys'].includes(route) && !/<header class="site">[\s\S]*class="lens"[\s\S]*<\/header>/.test(html)) throw new Error(`Sweep switch is not in the header: ${route}`);
      if (route === '#A1.sys' && sys && !/class="sy-sum-line"[\s\S]*cities<\/span>|cities inspected · <b>[\d,.]+<\/b> \(\d+%\)/.test(html)) throw new Error(`Overview lacks the inspected summary with its share: ${route}`);
      if (route.startsWith('#A1.city.') || route.startsWith('#A1.district.') || route === '#A1.sys') {
        if (sys && /undefined|NaN/.test(html)) throw new Error(`Broken value on a systemic page: ${route}`);
        // One row per finding, and a city nobody has read says so.
        if (route in cityFindings && html.split('class="cp-row"').length - 1 !== cityFindings[route]) throw new Error(`Finding rows do not match the data: ${route}`);
        // Each finding is one closed disclosure, and a page with findings opens with the count of what was found.
        // The note under the count header is folded in, not repeated at the end, and the header sits in its own column.
        if (route.startsWith('#A1.city.') || route.startsWith('#A1.district.')) {
          if (route in cityFindings && (!html.includes('class="cp-two"') || !html.includes('class="cp-rail"'))) throw new Error(`Two-column wrapper missing: ${route}`);
          if (html.includes('class="cp-nt"') && html.includes('class="res-note"')) throw new Error(`Note shown twice: ${route}`);
        }
        if (cityFindings[route] > 0 && (!html.includes('class="cp-sum"') || html.split('<details class="cp-more">').length - 1 !== cityFindings[route])) throw new Error(`Finding disclosures or summary missing: ${route}`);
        // A passage keeps every word of the research text, the translation and the German original alike; only its layout is structured.
        // The "Claim in German" tag shows only on a headline that really is German, not on one that names BAföG or Führungszeugnis.
        if (route in cityData) {
          const words = s => (s.match(/[\p{L}\p{N}]+/gu) || []).join(' ');
          const plain = s => s.replace(/<[^>]+>/g, ' ').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&');
          html.split('<article class="cp-row">').slice(1).forEach((row, i) => {
            const f = cityData[route][i], quotes = [...row.matchAll(/<blockquote class="cp-q"[^>]*>([\s\S]*?)<\/blockquote>/g)].map(m => words(plain(m[1])));
            const want = f.lang === 'German' && f.tr ? [f.tr, f.q] : [f.q];
            if (quotes.length !== want.length || want.some((w, k) => quotes[k] !== words(w))) throw new Error(`A passage differs from the research text in finding ${i}: ${route}`);
            const german = (f.claim.match(/\b(der|die|das|und|nicht|wird|werden|für|mit|eine|ein|den|dem|von|bei|Die|Der|Das|Sie|ist|sind)\b/g) || []).length >= 2;
            if (row.includes('class="cp-tag"') !== german) throw new Error(`"Claim in German" tag does not match the headline in finding ${i}: ${route}`);
            if (row.includes('white-space') || row.includes('style="font-size')) throw new Error(`Inline type or whitespace style in finding ${i}: ${route}`);
          });
        }
      }
      if ((route === '#A1.city.no-such-city' || route === '#A1.district.no-such-district' || (sys && (sys.districts || []).length && (route === `#A1.city.${sys.districts[0][0]}` || route === `#A1.district.${sys.cities[0][0]}`)))
          && (html.includes('cp-') || html.includes('id="sy-bands"'))) throw new Error(`Unknown place rendered: ${route}`);
      if (route.startsWith('#A1.group.no-such') || route.startsWith('#A1.entity.no-such')) {
        if (html.includes('res-card') || html.includes('res-q')) throw new Error(`Unknown institution page rendered: ${route}`);
      }
    }
    checks.push({ layout, viewport_branch: narrow ? 'narrow' : 'wide', routes: routes.length });
  }
}
console.log(JSON.stringify({ passed: true, total: checks.reduce((n, c) => n+c.routes, 0), checks }, null, 2));
