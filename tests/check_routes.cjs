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
  for (const layout of ['A', 'A1', 'A2', 'A3', 'B', 'C']) {
    const routes = [`#${layout}`];
    for (const area of data.areas) {
      routes.push(`#${layout}.area.${area.id}`);
      for (const topic of area.topics) routes.push(`#${layout}.topic.${area.id}~${topic.id}`);
    }
    for (const cid of Object.keys(data.cases)) routes.push(`#${layout}.case.${cid}`);
    for (const route of routes) {
      ctx.location.hash = route;
      vm.runInContext('render()', ctx);
      if (nodes.get('root').innerHTML.length < 100) throw new Error(`Empty output: ${route}`);
    }
    checks.push({ layout, viewport_branch: narrow ? 'narrow' : 'wide', routes: routes.length });
  }
}
console.log(JSON.stringify({ passed: true, total: checks.reduce((n, c) => n+c.routes, 0), checks }, null, 2));
