<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const rows = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(rows, tenantOf);
  const disagreements = groups.reduce((n, g) => n + g.reports.filter(r => r.meta.intakeTag !== g.cause).length, 0);
  const bulk = rows.filter(r => r.mergedAt?.startsWith('2026-07-02'));
  const days = bulk.map(r => r.receivedAt.slice(0, 10)).sort();
  const months = [...new Set(rows.map(r => r.receivedAt.slice(0, 7)))].sort();
  const anomalies = rows.filter(r => notes.oneDayMove.includes(r.id));
</script>

<p><strong>{reports.length}</strong> export rows contain <strong>{rows.length}</strong> unique reports merged into #4471; <strong>{reports.length - rows.length}</strong> repeated rows are counted once. Tenant locale and form/channel identify <strong>{groups.length}</strong> causes. Intake tags disagree with that classification on <strong>{disagreements}</strong> reports.</p>

<h3>Received is different from merged</h3>
<p><strong>{bulk.length}</strong> reports were merged on 2026-07-02, but their received dates run from {days[0]} to {days.at(-1)}. That merge spike is a queue-processing event; it does not show when the problem began. Reports continue after it.</p>
<table>
  <thead><tr><th>received month</th><th>unique reports</th></tr></thead>
  <tbody>{#each months as month}<tr><td>{month}</td><td>{rows.filter(r => r.receivedAt.startsWith(month)).length}</td></tr>{/each}</tbody>
</table>

<h3>Unresolved evidence inside the parser group</h3>
<p>The desk flagged <strong>{anomalies.length}</strong> reports as one-day moves. The supplied classifier files them under parser by tenant/channel, but their bodies do not establish a month/day swap. Keep their existing allocation visible and investigate independently; a timezone or scheduling cause is unconfirmed.</p>
<table>
  <thead><tr><th>report</th><th>tenant / channel</th><th>reporter's description</th></tr></thead>
  <tbody>{#each anomalies as report}<tr><td>{report.id}</td><td>{report.tenant} / {report.channel}</td><td>{report.body}</td></tr>{/each}</tbody>
</table>
