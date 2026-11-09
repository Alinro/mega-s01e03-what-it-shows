import fs from 'node:fs';
import assert from 'node:assert/strict';
import { uniqueById, groupByCause, readAs } from '../src/lib/kb/causes.ts';
const root = 'src/lib/data/';
const raw = JSON.parse(fs.readFileSync(root + 'reports-4471.json'));
const notes = JSON.parse(fs.readFileSync(root + 'desk-notes.json'));
const tenants = new Map(fs.readdirSync(root + 'tenants').map(file => {
  const tenant = JSON.parse(fs.readFileSync(root + 'tenants/' + file));
  return [tenant.handle, tenant];
}));
const unique = uniqueById(raw);
const reports = unique.filter(report => report.mergedInto === 4471);
const groups = groupByCause(reports, report => tenants.get(report.tenant));
assert.equal(groups.reduce((n, g) => n + g.reports.length, 0), reports.length);
assert.ok(groups.every(g => g.cause !== 'unplaced'), 'Investigate reports without a cause');
const summary = {
  source: 'Course kb export dated 2026-10-04; counts are for this snapshot, not a live queue.',
  rawRows: raw.length, uniqueReports: unique.length,
  duplicateRows: raw.length - unique.length, mergedInto4471: reports.length,
  groups: groups.map(({ reports, ...g }) => ({ ...g, count: reports.length,
    intakeDisagreements: reports.filter(r => r.meta.intakeTag !== g.cause).length,
    notedAnomalies: readAs({ reports }, notes.oneDayMove),
    reportIds: reports.map(r => r.id),
  })),
  receivedByMonth: Object.fromEntries([...new Set(reports.map(r => r.receivedAt.slice(0, 7)))].sort().map(month => [month, reports.filter(r => r.receivedAt.startsWith(month)).length])),
  mergedOnJuly2: reports.filter(r => r.mergedAt?.startsWith('2026-07-02')).length,
  july2ReceivedRange: (() => {
    const dates = reports.filter(r => r.mergedAt?.startsWith('2026-07-02')).map(r => r.receivedAt.slice(0, 10)).sort();
    return [dates[0], dates.at(-1)];
  })(),
};
fs.mkdirSync('analysis', { recursive: true });
fs.writeFileSync('analysis/report-counts.json', JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ ...summary, groups: summary.groups.map(({reportIds, ...g}) => g) }, null, 2));
