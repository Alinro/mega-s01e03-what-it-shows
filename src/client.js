import { hydrate } from 'svelte';
const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
const target = document.getElementById('app');
const page = pages[target.dataset.page];
hydrate(page.default, { target });
