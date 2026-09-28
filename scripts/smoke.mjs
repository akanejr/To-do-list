/**
 * Dev-only render smoke test: server-renders every route (with a realistic
 * saved draft + selected partner) and asserts key content is present. Catches
 * runtime crashes and broken screens without needing a browser.
 *
 * Run: npm run check:smoke
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
global.localStorage = dom.window.localStorage;
global.HTMLElement = dom.window.HTMLElement;
global.SVGElement = dom.window.SVGElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.getComputedStyle = dom.window.getComputedStyle;
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = clearTimeout;

const React = (await import('react')).default;
const { renderToString } = await import('react-dom/server');
const { MemoryRouter } = await import('react-router-dom');
const { default: App } = await import('../src/App.jsx');

// Seed a realistic in-progress flow so downstream screens render fully.
const draft = {
  itemType: 'parcel',
  pickup: {
    zoneId: 'rumuola',
    line1: '14 Rumuola Road, by the junction',
    contactName: 'Chiamaka Obi',
    contactPhone: '0803 442 1198',
  },
  dropoff: {
    zoneId: 'waterlines',
    line1: '7 Marine Base road, Waterlines',
    recipientName: 'Emeka Eze',
    recipientPhone: '0805 221 8890',
  },
  package: { size: 'small', weightKg: '3', description: 'Sealed carton of shoes', fragile: false },
  schedule: { mode: 'asap', date: '', time: '' },
};
const seed = (over = {}) =>
  localStorage.setItem(
    'swiftline.phase1.v1',
    JSON.stringify({ bookings: [], draft, selectedPartnerId: 'mike', step: 0, ...over }),
  );
seed();

const CASES = [
  // [path, expected substrings, optional persisted-state override]
  ['/', ['SwiftLine']],
  ['/home', ['How can we help you today?', 'Send a package', 'Saved addresses', 'Recent deliveries', 'Track delivery', 'Documents']],
  ['/send', ['Where should we pick up from?', 'Pickup area', 'Contact phone', 'Continue', 'Step 1 of 4']],
  ['/send', ['Where is it going?', 'Recipient name', 'Delivery area', 'Step 2 of 4'], { step: 1 }],
  ['/send', ['Tell us about the package', 'Small parcel', 'Package size', 'Fragile', 'Step 3 of 4'], { step: 2 }],
  ['/send', ['When should we collect it?', 'As soon as possible', 'Schedule pickup', 'See delivery estimate'], { step: 3 }],
  ['/estimate', ['Estimated price', 'Find delivery partners', 'Rumuola', 'Waterlines', 'Distance']],
  ['/partners', ['Available partners', 'View profile', 'Select', 'match', 'deliveries']],
  ['/partners/mike', ['Mike Okonkwo', 'Customer reviews', 'Select this partner', 'Service area', 'Package capacity']],
  ['/confirm', ['Confirm delivery', 'Total amount', 'Delivery fee', 'Mike O.', 'No payment now']],
  ['/created/DL-2481', ['Delivery request created', 'Track delivery', 'Back to home', 'DL-2481', 'Estimated pickup']],
  ['/track/DL-2481', ['Delivery progress', 'Request confirmed', 'In transit', 'Waterlines']],
  ['/track/DL-2351', ['Cancelled', 'Delivery progress']],
  ['/history', ['Delivery history', 'Delivered', 'Cancelled', 'In progress', 'DL-2481']],
  ['/nonsense', ['SwiftLine']],
];

let failed = 0;
for (const [path, expects, over] of CASES) {
  seed(over);
  try {
    const html = renderToString(
      React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(App)),
    );
    const missing = expects.filter((e) => !html.includes(e));
    if (missing.length > 0) {
      failed += 1;
      console.error(`FAIL ${path.padEnd(18)} missing: ${missing.join(', ')}`);
    } else {
      console.log(`OK   ${path.padEnd(18)} ${Math.round(html.length / 1024)} kB · checked ${expects.length}`);
    }
  } catch (err) {
    failed += 1;
    const firstLines = (err && err.stack ? err.stack.split('\n').slice(0, 4) : [String(err)]).join('\n     ');
    console.error(`FAIL ${path}\n     ${firstLines}`);
  }
}

seed();
console.log(failed === 0 ? '\nAll routes rendered with expected content.' : `\n${failed} route(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
