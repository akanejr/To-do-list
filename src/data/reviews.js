/**
 * A few realistic customer reviews per partner.
 * Intentionally small — this is a trust signal, not a review platform.
 */

export const REVIEWS = {
  david: [
    {
      id: 'r1',
      author: 'Chidi M.',
      rating: 5,
      date: '2026-09-14',
      text: 'Very punctual and handled my package carefully. Collected from Rumuola and dropped at GRA in less than 30 minutes.',
    },
    {
      id: 'r2',
      author: 'Funke A.',
      rating: 5,
      date: '2026-08-30',
      text: 'Called me before pickup and before delivery. Simple and polite. I will use him again.',
    },
    {
      id: 'r3',
      author: 'Obinna K.',
      rating: 4,
      date: '2026-08-11',
      text: 'Good service. Slight delay because of rain but he kept me posted the whole way.',
    },
  ],
  mike: [
    {
      id: 'r1',
      author: 'Amaka O.',
      rating: 5,
      date: '2026-09-20',
      text: 'Fastest rider I have used on this app. My laptop reached Woji without a scratch.',
    },
    {
      id: 'r2',
      author: 'Ibrahim S.',
      rating: 5,
      date: '2026-09-02',
      text: 'He knows every shortcut in PH. Quoted 40 minutes, delivered in 32.',
    },
    {
      id: 'r3',
      author: 'Ngozi E.',
      rating: 4,
      date: '2026-08-19',
      text: 'Reliable. Box on the bike is clean and padded, my parcel arrived dry in heavy rain.',
    },
  ],
  samuel: [
    {
      id: 'r1',
      author: 'Titi B.',
      rating: 5,
      date: '2026-09-17',
      text: 'Carried a cake box for me and it arrived perfect. He even drove slowly through the bumps.',
    },
    {
      id: 'r2',
      author: 'Emmanuel D.',
      rating: 4,
      date: '2026-08-27',
      text: 'Professional and neat car. Price is slightly higher but worth it for fragile things.',
    },
  ],
  emeka: [
    {
      id: 'r1',
      author: 'Uche P.',
      rating: 5,
      date: '2026-09-08',
      text: 'Collected my documents from Mile 1 quickly. No stories, straight to the point.',
    },
    {
      id: 'r2',
      author: 'Blessing T.',
      rating: 4,
      date: '2026-07-25',
      text: 'Good rider. Was busy when I first requested but the app showed me others immediately.',
    },
  ],
  chinedu: [
    {
      id: 'r1',
      author: 'Mama Nkechi',
      rating: 5,
      date: '2026-09-11',
      text: 'Moved three cartons of provisions for my shop. Strong man, careful driver.',
    },
    {
      id: 'r2',
      author: 'Segun L.',
      rating: 4,
      date: '2026-08-21',
      text: 'Keke was clean and the load was well tied. Took a little longer than estimated.',
    },
  ],
  aisha: [
    {
      id: 'r1',
      author: 'Kelechi J.',
      rating: 5,
      date: '2026-09-22',
      text: 'My food arrived still steaming. The insulated box really works. Highly recommended.',
    },
    {
      id: 'r2',
      author: 'Hauwa M.',
      rating: 5,
      date: '2026-09-05',
      text: 'Very respectful and careful. She sent me a message when she arrived at the gate.',
    },
    {
      id: 'r3',
      author: 'Derin A.',
      rating: 5,
      date: '2026-08-14',
      text: 'Third time using Aisha. Always on time, always smiling.',
    },
  ],
  blessing: [
    {
      id: 'r1',
      author: 'Pastor Eme',
      rating: 5,
      date: '2026-09-16',
      text: 'Delivered my church files same morning. Very honest young lady.',
    },
    {
      id: 'r2',
      author: 'Kunle O.',
      rating: 4,
      date: '2026-08-29',
      text: 'New on the app but very serious and careful with my envelope. Will use again.',
    },
  ],
  tunde: [
    {
      id: 'r1',
      author: 'Shoprite Vendor',
      rating: 5,
      date: '2026-09-19',
      text: 'We restock four outlets with his van every week. Never lost a single item.',
    },
    {
      id: 'r2',
      author: 'Adaora N.',
      rating: 4,
      date: '2026-08-08',
      text: 'Moved my fridge safely. Price is on the high side but the job was clean.',
    },
  ],
  kelechi: [
    {
      id: 'r1',
      author: 'Uni Port Student',
      rating: 4,
      date: '2026-07-30',
      text: 'Cheap and okay for small things around Choba.',
    },
  ],
  grace: [
    {
      id: 'r1',
      author: 'Femi R.',
      rating: 5,
      date: '2026-08-23',
      text: 'Collected my generator parts at night without any wahala. Safe driver.',
    },
  ],
};

export const reviewsFor = (partnerId) => REVIEWS[partnerId] || [];
