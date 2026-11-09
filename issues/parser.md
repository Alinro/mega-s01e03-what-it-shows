The shared date parser reads day-first dates as month-first, so bookings and calendar invites can land in the wrong month/day.

**Reports covered: 379 unique reports** from #4471 in the 2026-10-04 export, across 11 tenants, received 2026-04-01 through 2026-10-04. Count each stable ID once; overlapping export rows are not new reports. The complete allocation is in `analysis/report-counts.json` under `parser`.

## Evidence and scope

- `src/lib/kb/causes.ts` classifies day-first tenants' app/email paths and booking-v2 form paths as parser. Tenant locale and form version come from `src/lib/data/tenants/`, not browser locale or intake tags.
- R-41200: harbour.dental / app / en-GB / booking-v2; 7 April became 4 July.
- 356 reports are intake-tagged parser and 23 hint, but all 379 are classified parser by tenant/channel. Intake tags do not determine these counts.
- Booking-v3 form submissions are allocated to the separate hint issue (33 reports). The two issue allocations are disjoint and sum to 412.

## Unresolved evidence

Five IDs are included in this classifier-based count but describe one-day or timing anomalies rather than a demonstrated month/day swap: R-41202, R-41209, R-41236, R-41344 and R-41620. Their bodies and the desk's flags are retained in the rendered review. Investigate timezone, date-boundary and scheduling behavior without claiming any of these as a confirmed root cause. If a separate cause is established, move those IDs and update both counts rather than double-counting them.

## Expected change and acceptance

Preserve the intended day/month semantics for each tenant at input boundaries. Verify app, email and booking-v2 form paths with day-first locales, ambiguous dates such as 07/04/2026, dates whose day exceeds 12, invalid dates and round trips to calendar invites. Inspect booking-v3 app/email paths separately from its form hint. Reconcile the five anomalous reports before claiming this issue covers every symptom.

## Engineering outcome

After the course accepted this allocation, its challenge page reported #4471 closed on 5 October: parser FIXED, `fix(dates): parse dd/mm for eu locales`. Close this issue as completed on that desk-reported outcome. This review did not implement or independently test the product fix. The five anomalous reports remain unresolved evidence for follow-up if the symptoms recur. Source: https://hq.mega.dev/challenges/what-it-shows; transcription in `docs/engineering-update.md`.

See `src/routes/kb/incidents/4471-review/+page.svx` and `rendered/kb/incidents/4471-review/index.html`. Counts describe the exported snapshot, not today's live queue. Refresh reports and tenants before quoting a current total.
