import fs from 'node:fs/promises';
import path from 'node:path';
import { renderPages } from '../.build/server/render-entry.js';
const manifest = JSON.parse(await fs.readFile('rendered/.vite/manifest.json', 'utf8'));
const client = manifest['src/client.js'].file;
const pages = renderPages();
for (const page of pages) {
  const out = path.join('rendered', page.route, 'index.html');
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${page.head}</head><body><div id="app" data-page="${page.source}">${page.body}</div><script type="module" src="/${client}"></script></body></html>\n`);
  console.log(out);
}
await fs.writeFile('rendered/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/kb/"><title>Support knowledge base</title></head><body><a href="/kb/">Open support knowledge base</a></body></html>\n');
