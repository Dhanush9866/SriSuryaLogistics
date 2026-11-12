// All business content lives here — edit this file to update the website.

// Hero colour theme: 'light' or 'dark'
export const HERO_THEME = 'light';

export const company = {
  name: 'Sri Surya Logistics',
  tagline: 'Moving Your World… With Trust…',
  promise: ['Safe', 'Fast', 'Reliable'],
  founders: [{ name: 'Y. Surya Teja', initials: 'ST', role: 'Founder' }],
  phones: ['9985048865', '8185929494', '9550479977'],
  email: 'sslogistics.tnk@gmail.com',
  callPhone: '8185929494', // main number for every "Call Now" button
  whatsapp: '918185929494', // WhatsApp number (with 91 country code)
  address: {
    line1: 'D.No: 1-203/1, Near Playboy Factory',
    line2: 'NH-216 Road, Opp. Devi Sea Foods',
    city: 'Peravali – 534328',
    full: 'D.No:1-203/1, Near Playboy Factory, NH-216 Road, Opp. Devi Sea Foods, Peravali-534328',
  },
};

export const formatPhone = (p) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;

export const services = [
  {
    icon: 'truck',
    title: 'Full Truck Load',
    text: 'Dedicated trucks for your entire consignment — direct, sealed and moving on your schedule.',
  },
  {
    icon: 'container',
    title: 'Container Transport',
    text: 'Trailers and containers for heavy, bulk and export-bound cargo, handled with care end to end.',
  },
  {
    icon: 'route',
    title: 'Interstate Cargo',
    text: 'Long-haul movement across states along the national highway network, tracked at every stage.',
  },
  {
    icon: 'box',
    title: 'Part Load (PTL)',
    text: 'Share the truck, save the cost. Smart consolidation for smaller shipments without the delay.',
  },
  {
    icon: 'factory',
    title: 'Industrial & Factory Supply',
    text: 'Reliable inbound and outbound runs for factories, processing units and warehouses.',
  },
  {
    icon: 'clock',
    title: 'Time-Critical Delivery',
    text: 'Urgent loads, priority dispatch. When it has to arrive on time, we make it happen.',
  },
];

export const pillars = [
  {
    icon: 'shield',
    title: 'Safe',
    text: 'Experienced drivers, well-maintained vehicles and secure loading — your goods arrive exactly as they left.',
  },
  {
    icon: 'bolt',
    title: 'Fast',
    text: 'Quick vehicle placement and direct routes on NH-216 mean less waiting and faster turnaround.',
  },
  {
    icon: 'handshake',
    title: 'Reliable',
    text: 'Clear pricing, honest timelines and three direct phone lines — you always reach a real person.',
  },
];

export const steps = [
  { title: 'Call or WhatsApp', text: 'Share your pickup, drop and load details with us.' },
  { title: 'Vehicle Placement', text: 'We assign the right truck and confirm pickup time with you.' },
  { title: 'Safe Transit', text: 'Your cargo moves on the best route with regular updates.' },
  { title: 'On-Time Delivery', text: 'Delivered safely at destination. Trust, delivered.' },
];
