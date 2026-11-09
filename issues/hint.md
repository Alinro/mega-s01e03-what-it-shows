Booking-v3 displays `MM/DD/YYYY` below its date field, but parses the submitted date using the tenant's day-first locale. A person following the hint can therefore book the wrong date even if the shared parser is fixed.

**Reports covered: 33 unique reports** from #4471 in the 2026-10-04 export, across 3 tenants (alder.physio, copper.studio, pale.harbour), received 2026-04-17 through 2026-09-22. Count stable IDs once. The complete allocation is in `analysis/report-counts.json` under `hint`.

## Evidence and scope

- `src/lib/kb/causes.ts` declares booking-v3's hint as MM/DD/YYYY and classifies form submissions for day-first booking-v3 tenants as hint.
- Tenant files establish de-DE / es-ES / pt-PT and booking-v3. Browser locale does not establish the tenant's convention.
- R-41241: alder.physio / form; the browser reports en-US, but the tenant is de-DE. The report says people arrived on 8 June for a booking on 6 August.
- R-41230: copper.studio / form; intake tagged it parser, but tenant/form/channel classify it as hint.
- 18 reports are tagged hint and 15 parser at intake. These tags do not determine the 33-report count.
- App/email reports for these tenants remain in the shared-parser issue; booking-v3 alone is insufficient to identify this bug. The parser issue covers 379 reports; the allocations are disjoint and sum to 412.

## Expected change and acceptance

Make the format hint agree with input validation and parsing for the tenant's locale. Verify all three affected booking-v3 tenants, including browsers set to another locale, an ambiguous date such as 06/08/2026, an unambiguous day above 12 and invalid input. Following the displayed hint must preserve the intended date through booking confirmation and calendar invite. Check booking-v2 for regressions.

Do not mark this as a duplicate of the shared-parser issue. A parser-only fix does not correct contradictory instructions on the form. Keep open until verified; the export contains no successful fix evidence.

See `src/routes/kb/incidents/4471-review/+page.svx` and `rendered/kb/incidents/4471-review/index.html`. This is a snapshot count; refresh reports and tenants before using it for the current queue.
