const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const start = source.indexOf('  (function initRsvp() {');
const end = source.indexOf('  /* ============ 12. Share ============ */', start);
const section = source.slice(start, end);

function setup({fetchImpl, name = 'Nusrat Ahmed'} = {}) {
  const elements = new Map();
  function element(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      value: '', textContent: '', checked: false, hidden: false, style: {},
      classList: { add() {}, remove() {} }, listeners: {},
      addEventListener(event, handler) { this.listeners[event] = handler; },
      focus() { this.focused = true; },
      querySelector() { return { value: 'yes' }; },
    });
    return elements.get(selector);
  }
  const opened = [];
  const blankWindow = { location: { href: '' }, close() { this.closed = true; } };
  const window = { open(...args) { opened.push(args); return blankWindow; } };
  const form = element('#rsvpForm');
  element('.rsvp');
  element('#rsvpDone');
  element('#rsvpName').value = name;
  element('#rsvpGuests').value = '3';
  const context = {
    $: element,
    $$: () => [],
    cfg: {
      couple: { name1: 'Ayan', name2: 'Mim' },
      events: [],
      rsvp: { enabled: true, endpoint: 'https://example.test/rsvp', whatsapp: '8801712345678', successNote: 'Thank you' },
    },
    window,
    fetch: fetchImpl,
  };
  vm.runInNewContext(section, context);
  return {
    elements, opened, blankWindow,
    submit() { form.listeners.submit({ preventDefault() {} }); },
  };
}

test('a successful empty endpoint response completes without triggering WhatsApp fallback', async () => {
  const page = setup({ fetchImpl: async () => ({ ok: true, status: 204 }) });
  page.submit();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(page.opened.length, 1);
  assert.equal(page.blankWindow.closed, true);
  assert.equal(page.elements.get('#rsvpDone').hidden, false);
  assert.equal(page.elements.get('#rsvpForm').hidden, true);
});

test('endpoint failure navigates the user-gesture WhatsApp window with the RSVP', async () => {
  const page = setup({ fetchImpl: async () => { throw new Error('offline'); } });
  page.submit();
  assert.equal(page.opened.length, 1);
  assert.equal(page.opened[0][0], '');
  await new Promise(resolve => setImmediate(resolve));
  const url = new URL(page.blankWindow.location.href);
  assert.equal(url.origin + url.pathname, 'https://wa.me/8801712345678');
  assert.match(url.searchParams.get('text'), /Name: Nusrat Ahmed/);
  assert.equal(page.blankWindow.closed, undefined);
});
