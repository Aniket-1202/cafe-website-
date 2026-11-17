export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  bookedBy?: string;
}

export type TableSetupStyle = 'standard' | 'laptop-focus' | 'reading-nook' | 'group-table';
export type TablePerkId = 'power-hub' | 'sun-filter' | 'water-carafe' | 'nameplate';

export interface TableCustomization {
  setupStyle: TableSetupStyle;
  perks: TablePerkId[];
  note: string;
}

export interface CafeTable {
  id: string;
  number: number;
  name: string;
  zone: 'Sunlit Window Banquette' | 'Central Social Area' | 'Espresso Lounge';
  shape: 'square' | 'round';
  capacity: number;
  lightLevel: string;
  noiseDb: number;
  noiseLabel: string;
  powerAccess: string;
  hasPower: boolean;
  /** Hotspot position (%) on the main walkthrough cafe photograph */
  photoPos: { x: number; y: number };
  /** Camera view id to show when inspecting this table */
  preferredViewId: CafeViewId;
  slots: TimeSlot[];
  customization: TableCustomization;
}

export interface CuratedCombo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  defaultDrink: BeverageConfig;
}

export type MilkBase = 'oat' | 'almond' | 'whole';
export type EspressoStrength = 'single' | 'double' | 'decaf';
export type FlavorNote = 'vanilla' | 'hazelnut' | 'caramel';
export type ServingStyle = 'hot' | 'iced';
export type CupSize = '8oz' | '12oz' | '16oz';
export type SweetnessLevel = 'unsweetened' | 'light' | 'classic';
export type ToppingOption = 'cinnamon' | 'oat-whip' | 'hazelnut-crumb';

export interface BeverageConfig {
  milk: MilkBase;
  espresso: EspressoStrength;
  flavors: FlavorNote[];
  style: ServingStyle;
  size: CupSize;
  sweetness: SweetnessLevel;
  toppings: ToppingOption[];
}

export interface AttachedOrderItem {
  kind: 'bespoke' | 'combo';
  label: string;
  details: string;
  price: number;
}

export type MealPeriod = 'breakfast' | 'lunch' | 'dinner';

export type KitchenModId =
  | 'extra-crispy'
  | 'gf-sourdough'
  | 'add-egg'
  | 'hot-honey'
  | 'parmesan-snow';

export interface FoodMenuItem {
  id: string;
  mealPeriod: MealPeriod;
  funnyName: string;
  tagline: string;
  description: string;
  dietaryNote: string;
  price: number;
  availableMods: KitchenModId[];
}

export interface AttachedMealItem {
  itemId: string;
  funnyName: string;
  mealPeriod: MealPeriod;
  modLabels: string[];
  unitPrice: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  schedule: string;
  spot: string;
  description: string;
  attendees: number;
  capacity: number;
  rsvped: boolean;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  mood: string;
  bpm: number;
  chords: number[][];
}

export type CafeViewId = 'overview' | 'window' | 'counter';

export interface CafePhotoView {
  id: CafeViewId;
  label: string;
  subtitle: string;
  image: string;
  alt: string;
  initialFocus: { x: number; y: number; zoom: number };
}

export interface SpatialPinAnchor {
  id: 'window' | 'workspace' | 'table7' | 'speaker' | 'board' | 'counter';
  title: string;
  subtitle: string;
  photoPos: { x: number; y: number };
  visibleInViews: CafeViewId[];
  actionType: 'view' | 'table' | 'playlist' | 'events' | 'beverage';
  targetId?: string;
}

export const CAFE_IMAGES = {
  mainWalkthrough: '/src/assets/images/cafe_main_walkthrough_1794895279535.jpg',
  windowSeating: '/src/assets/images/cafe_window_seating_1794895279305.jpg',
  espressoCounter: '/src/assets/images/cafe_espresso_counter_1794895280612.jpg',
  hotLatte: '/src/assets/images/drink_hot_latte_glass_1794895280657.jpg',
  icedLatte: '/src/assets/images/drink_iced_latte_glass_1794895280886.jpg',
  breakfastPlate: '/src/assets/images/menu_breakfast_plate_1794896905744.jpg',
  lunchPlate: '/src/assets/images/menu_lunch_plate_1794896906364.jpg',
  dinnerPlate: '/src/assets/images/menu_dinner_plate_1794896906601.jpg',
};

export const MEAL_PERIODS: {
  id: MealPeriod;
  label: string;
  hours: string;
  tagline: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    id: 'breakfast',
    label: 'Breakfast',
    hours: '7:00 AM – 11:30 AM',
    tagline: 'Morning puns, sourdough toasts & flaky pastries',
    image: CAFE_IMAGES.breakfastPlate,
    imageAlt: 'Sunlit breakfast sourdough avocado toast with poached eggs, crispy bacon, and croissant',
  },
  {
    id: 'lunch',
    label: 'Lunch',
    hours: '11:30 AM – 4:00 PM',
    tagline: 'Melted paninis, hearty bowls & midday comfort',
    image: CAFE_IMAGES.lunchPlate,
    imageAlt: 'Toasted three-cheese panini with roasted heirloom tomato soup and beet kale bowl',
  },
  {
    id: 'dinner',
    label: 'Dinner',
    hours: '4:00 PM – 9:00 PM',
    tagline: 'Evening plates, creamy pasta & fireside comfort',
    image: CAFE_IMAGES.dinnerPlate,
    imageAlt: 'Seared Atlantic salmon over farro alongside creamy rigatoni pasta and charred sourdough',
  },
];

export const KITCHEN_MOD_OPTIONS: {
  id: KitchenModId;
  label: string;
  upcharge: number;
}[] = [
  { id: 'extra-crispy', label: 'Extra Crispy', upcharge: 0 },
  { id: 'gf-sourdough', label: 'Gluten-Free Bread', upcharge: 1.5 },
  { id: 'add-egg', label: 'Add Poached Egg', upcharge: 2.25 },
  { id: 'hot-honey', label: 'Hot Honey Drizzle', upcharge: 0.75 },
  { id: 'parmesan-snow', label: 'Parmigiano Snow', upcharge: 1.0 },
];

export const FOOD_MENU_ITEMS: FoodMenuItem[] = [
  // Breakfast
  {
    id: 'eggsistential-benedict',
    mealPeriod: 'breakfast',
    funnyName: 'Egg-sistential Crisis Benedict',
    tagline: 'Two poached eggs questioning reality',
    description:
      'Pasture-raised poached eggs wobbling over toasted brioche, smoked ham, and lemon-chive hollandaise.',
    dietaryNote: 'Contains eggs & dairy · Brioche base',
    price: 14.5,
    availableMods: ['extra-crispy', 'gf-sourdough', 'hot-honey'],
  },
  {
    id: 'avo-control-toast',
    mealPeriod: 'breakfast',
    funnyName: 'Avo-Control Issues Toast',
    tagline: 'Millennial mortgage deferral on sourdough',
    description:
      'Thick-cut country sourdough loaded with smashed Hass avocado, pickled chili threads, radish, and flaky sea salt.',
    dietaryNote: 'Plant-forward · Nut-free',
    price: 13.25,
    availableMods: ['extra-crispy', 'gf-sourdough', 'add-egg', 'hot-honey'],
  },
  {
    id: 'resting-brunch-waffle',
    mealPeriod: 'breakfast',
    funnyName: 'Resting Brunch Face Waffle',
    tagline: 'Does not smile before its first espresso',
    description:
      'Crisp Belgian buttermilk waffle topped with whipped mascarpone, roasted figs, and barrel-aged maple syrup.',
    dietaryNote: 'Vegetarian · Sweet morning favorite',
    price: 12.75,
    availableMods: ['extra-crispy', 'hot-honey'],
  },
  {
    id: 'bacon-me-crazy',
    mealPeriod: 'breakfast',
    funnyName: 'Bacon Me Crazy Croissant',
    tagline: 'Flaky pastry with zero chill',
    description:
      'Warm laminated French butter croissant stuffed with thick-cut applewood bacon, aged white cheddar, and soft scramble.',
    dietaryNote: 'Baked fresh at 6:30 AM',
    price: 11.5,
    availableMods: ['extra-crispy', 'hot-honey', 'add-egg'],
  },

  // Lunch
  {
    id: 'grillty-pleasure',
    mealPeriod: 'lunch',
    funnyName: 'Grill-ty Pleasure Panini',
    tagline: 'Your cardiologist looks away',
    description:
      'Three-cheese sourdough melt (gruyere, sharp cheddar, fontina) pressed golden with caramelized onions & tomato soup.',
    dietaryNote: 'Vegetarian · Served with dunker soup',
    price: 15.5,
    availableMods: ['extra-crispy', 'gf-sourdough', 'add-egg'],
  },
  {
    id: 'lettuce-turnip-beet',
    mealPeriod: 'lunch',
    funnyName: 'Lettuce Turnip the Beet Bowl',
    tagline: 'Salad that drops harder than lo-fi bass',
    description:
      'Roasted golden & ruby beets, baby kale, crispy chickpeas, whipped goat cheese, toasted pepitas, and lemon-tahini.',
    dietaryNote: 'Gluten-free · High protein',
    price: 14.25,
    availableMods: ['add-egg', 'parmesan-snow'],
  },
  {
    id: 'pesto-manifesto',
    mealPeriod: 'lunch',
    funnyName: 'Pesto Manifesto Flatbread',
    tagline: 'Herbaceous political commentary',
    description:
      'Stone-baked sourdough flatbread layered with basil-walnut pesto, charred cherry tomatoes, creamy burrata, and balsamic.',
    dietaryNote: 'Contains walnuts · Shareable',
    price: 14.75,
    availableMods: ['extra-crispy', 'hot-honey', 'parmesan-snow'],
  },
  {
    id: 'bean-there-chili',
    mealPeriod: 'lunch',
    funnyName: 'Bean There, Done That Chili',
    tagline: 'Espresso-kissed midday rescue',
    description:
      'Smoky roasted poblano, black bean & espresso-stewed chili served inside a toasted sourdough boule with sharp cheddar.',
    dietaryNote: 'Hearty · Mild smoky kick',
    price: 13.5,
    availableMods: ['extra-crispy', 'gf-sourdough', 'add-egg'],
  },

  // Dinner
  {
    id: 'penne-for-thoughts',
    mealPeriod: 'dinner',
    funnyName: 'Pen-ne for Your Thoughts',
    tagline: 'Carbs that validate your feelings',
    description:
      'Artisanal rigatoni & penne simmered in slow-roasted garlic vodka tomato cream, sweet basil oil, and charred bread.',
    dietaryNote: 'Vegetarian · Cozy evening bowl',
    price: 17.5,
    availableMods: ['parmesan-snow', 'hot-honey', 'gf-sourdough'],
  },
  {
    id: 'salmon-enchanted-evening',
    mealPeriod: 'dinner',
    funnyName: 'Salmon Enchanted Evening',
    tagline: 'Worth changing out of sweatpants for',
    description:
      'Pan-seared Atlantic salmon over lemon-herb farro, blistered broccolini, roasted baby carrots, and crispy caper butter.',
    dietaryNote: 'Omega-rich · Chef signature',
    price: 21.0,
    availableMods: ['extra-crispy', 'parmesan-snow'],
  },
  {
    id: 'mushroom-to-improve',
    mealPeriod: 'dinner',
    funnyName: 'Mushroom to Improve Risotto',
    tagline: 'Surprisingly supportive fungi',
    description:
      'Creamy arborio rice folded with seared wild chanterelles, black truffle butter, fresh thyme, and crispy shallots.',
    dietaryNote: 'Gluten-free · Vegetarian',
    price: 18.25,
    availableMods: ['parmesan-snow', 'add-egg'],
  },
  {
    id: 'steak-wifi-claim',
    mealPeriod: 'dinner',
    funnyName: 'Steak Your Wi-Fi Claim',
    tagline: 'Power outlet optional, steak knife included',
    description:
      'Herb-crusted flat iron steak sliced over roasted garlic mash with bright chimichurri and blistered vine tomatoes.',
    dietaryNote: 'Gluten-free · Cooked medium-rare',
    price: 22.5,
    availableMods: ['add-egg', 'parmesan-snow'],
  },
];

export const CAFE_VIEWS: CafePhotoView[] = [
  {
    id: 'overview',
    label: 'Full Walkthrough',
    subtitle: 'Sunlit Main Cafe & Seating',
    image: CAFE_IMAGES.mainWalkthrough,
    alt: 'Sunlit interior of The Daily Bean featuring caramel leather banquette, oak tables, olive green espresso bar, and pastry case',
    initialFocus: { x: 50, y: 50, zoom: 1 },
  },
  {
    id: 'window',
    label: 'Window Banquette',
    subtitle: 'Morning Sun & Brass Outlets',
    image: CAFE_IMAGES.windowSeating,
    alt: 'Close-up of sunlit caramel leather banquette, oak pedestal table with ceramic coffee cups, indoor olive tree, and wall power outlets',
    initialFocus: { x: 50, y: 50, zoom: 1 },
  },
  {
    id: 'counter',
    label: 'Espresso Counter',
    subtitle: 'Olivewood Bar & Pastry Case',
    image: CAFE_IMAGES.espressoCounter,
    alt: 'Artisanal espresso counter with deep olive green fluted paneling, cream marble top, brass espresso machine, and croissants',
    initialFocus: { x: 50, y: 50, zoom: 1 },
  },
];

export const TABLE_SETUP_OPTIONS: {
  id: TableSetupStyle;
  label: string;
  summary: string;
}[] = [
  { id: 'standard', label: 'Standard Cafe', summary: 'Classic sunlit oak setting' },
  { id: 'laptop-focus', label: 'Laptop Focus', summary: 'Desk lamp + extra outlet strip' },
  { id: 'reading-nook', label: 'Quiet Nook', summary: 'Cozy cushion + book stand' },
  { id: 'group-table', label: 'Group Setup', summary: 'Extra chair + shared tray' },
];

export const TABLE_PERK_OPTIONS: {
  id: TablePerkId;
  label: string;
  price: number;
}[] = [
  { id: 'power-hub', label: 'USB-C & AC Power Strip', price: 0 },
  { id: 'sun-filter', label: 'Window Glare Shade', price: 0 },
  { id: 'water-carafe', label: 'Chilled Citrus Carafe', price: 1.5 },
  { id: 'nameplate', label: 'Brass Reserved Card', price: 0 },
];

export const MILK_OPTIONS: {
  id: MilkBase;
  label: string;
  hex: string;
  upcharge: number;
}[] = [
  { id: 'oat', label: 'Oat', hex: '#EFE5D1', upcharge: 0.65 },
  { id: 'almond', label: 'Almond', hex: '#E6D3B3', upcharge: 0.65 },
  { id: 'whole', label: 'Whole', hex: '#FAF6EE', upcharge: 0 },
];

export const ESPRESSO_OPTIONS: {
  id: EspressoStrength;
  label: string;
  shotsLabel: string;
  upcharge: number;
}[] = [
  { id: 'single', label: 'Single', shotsLabel: '18g Espresso', upcharge: 0 },
  { id: 'double', label: 'Double', shotsLabel: '36g Ristretto', upcharge: 1.1 },
  { id: 'decaf', label: 'Decaf', shotsLabel: 'Swiss Water', upcharge: 0 },
];

export const FLAVOR_OPTIONS: {
  id: FlavorNote;
  label: string;
  hex: string;
  upcharge: number;
}[] = [
  { id: 'vanilla', label: 'Vanilla', hex: '#F3DFB8', upcharge: 0.55 },
  { id: 'hazelnut', label: 'Hazelnut', hex: '#B97C4B', upcharge: 0.55 },
  { id: 'caramel', label: 'Caramel', hex: '#C88A4B', upcharge: 0.6 },
];

export const CUP_SIZE_OPTIONS: {
  id: CupSize;
  label: string;
  upcharge: number;
}[] = [
  { id: '8oz', label: '8 oz', upcharge: 0 },
  { id: '12oz', label: '12 oz', upcharge: 0.65 },
  { id: '16oz', label: '16 oz', upcharge: 1.2 },
];

export const SWEETNESS_OPTIONS: {
  id: SweetnessLevel;
  label: string;
}[] = [
  { id: 'unsweetened', label: 'Unsweetened' },
  { id: 'light', label: 'Light' },
  { id: 'classic', label: 'Classic' },
];

export const TOPPING_OPTIONS: {
  id: ToppingOption;
  label: string;
  upcharge: number;
}[] = [
  { id: 'cinnamon', label: 'Cinnamon Dust', upcharge: 0 },
  { id: 'oat-whip', label: 'Oat Cream Cap', upcharge: 0.75 },
  { id: 'hazelnut-crumb', label: 'Hazelnut Crumb', upcharge: 0.65 },
];

export const INITIAL_TABLES: CafeTable[] = [
  {
    id: 'table-1',
    number: 1,
    name: 'Table 1 · Corner Banquette',
    zone: 'Sunlit Window Banquette',
    shape: 'square',
    capacity: 2,
    lightLevel: 'Soft Morning Daylight',
    noiseDb: 48,
    noiseLabel: 'Quiet Zone (48 dB)',
    powerAccess: 'Dual AC + USB-C Outlets',
    hasPower: true,
    photoPos: { x: 42, y: 55 },
    preferredViewId: 'window',
    slots: [
      { id: 't1-900', time: '9:00 AM', available: false, bookedBy: 'Clara M.' },
      { id: 't1-1130', time: '11:30 AM', available: true },
      { id: 't1-1400', time: '2:00 PM', available: true },
      { id: 't1-1630', time: '7:00 PM', available: true },
    ],
    customization: { setupStyle: 'standard', perks: ['power-hub'], note: '' },
  },
  {
    id: 'table-2',
    number: 2,
    name: 'Table 2 · Window Sunbeam',
    zone: 'Sunlit Window Banquette',
    shape: 'round',
    capacity: 2,
    lightLevel: 'Abundant Natural Light',
    noiseDb: 50,
    noiseLabel: 'Quiet Zone (50 dB)',
    powerAccess: 'Dual AC + USB-C Outlets',
    hasPower: true,
    photoPos: { x: 38, y: 63 },
    preferredViewId: 'window',
    slots: [
      { id: 't2-900', time: '9:00 AM', available: true },
      { id: 't2-1130', time: '11:30 AM', available: false, bookedBy: 'Julian R.' },
      { id: 't2-1400', time: '2:00 PM', available: true },
      { id: 't2-1630', time: '7:00 PM', available: true },
    ],
    customization: { setupStyle: 'laptop-focus', perks: ['power-hub'], note: '' },
  },
  {
    id: 'table-3',
    number: 3,
    name: 'Table 3 · Bay Window Booth',
    zone: 'Sunlit Window Banquette',
    shape: 'round',
    capacity: 4,
    lightLevel: 'Abundant Natural Light',
    noiseDb: 54,
    noiseLabel: 'Calm Focus (54 dB)',
    powerAccess: 'Under-Bench Power Strip',
    hasPower: true,
    photoPos: { x: 33, y: 69 },
    preferredViewId: 'window',
    slots: [
      { id: 't3-900', time: '9:00 AM', available: true },
      { id: 't3-1130', time: '11:30 AM', available: true },
      { id: 't3-1400', time: '2:00 PM', available: false, bookedBy: 'Nora K.' },
      { id: 't3-1630', time: '7:00 PM', available: true },
    ],
    customization: { setupStyle: 'standard', perks: ['power-hub'], note: '' },
  },
  {
    id: 'table-4',
    number: 4,
    name: 'Table 4 · Olive Wall Duo',
    zone: 'Central Social Area',
    shape: 'square',
    capacity: 2,
    lightLevel: 'Warm Ambient Light',
    noiseDb: 58,
    noiseLabel: 'Conversation (58 dB)',
    powerAccess: 'Wall Outlet Adjacent',
    hasPower: true,
    photoPos: { x: 59, y: 56 },
    preferredViewId: 'overview',
    slots: [
      { id: 't4-900', time: '9:00 AM', available: false, bookedBy: 'Marcus T.' },
      { id: 't4-1130', time: '11:30 AM', available: false, bookedBy: 'Sora L.' },
      { id: 't4-1400', time: '2:00 PM', available: true },
      { id: 't4-1630', time: '7:00 PM', available: false, bookedBy: 'Devon P.' },
    ],
    customization: { setupStyle: 'standard', perks: [], note: '' },
  },
  {
    id: 'table-5',
    number: 5,
    name: 'Table 5 · Central Bistro Round',
    zone: 'Central Social Area',
    shape: 'round',
    capacity: 2,
    lightLevel: 'Filtered Daylight',
    noiseDb: 59,
    noiseLabel: 'Social Buzz (59 dB)',
    powerAccess: 'Floor Brass Outlet',
    hasPower: true,
    photoPos: { x: 46, y: 63 },
    preferredViewId: 'overview',
    slots: [
      { id: 't5-900', time: '9:00 AM', available: true },
      { id: 't5-1130', time: '11:30 AM', available: true },
      { id: 't5-1400', time: '2:00 PM', available: true },
      { id: 't5-1630', time: '7:00 PM', available: false, bookedBy: 'Elena W.' },
    ],
    customization: { setupStyle: 'standard', perks: [], note: '' },
  },
  {
    id: 'table-6',
    number: 6,
    name: 'Table 6 · Espresso Bar View',
    zone: 'Espresso Lounge',
    shape: 'round',
    capacity: 2,
    lightLevel: 'Warm Counter Ambient',
    noiseDb: 64,
    noiseLabel: 'Lively Bar (64 dB)',
    powerAccess: 'No Outlet (Conversation Seat)',
    hasPower: false,
    photoPos: { x: 66, y: 58 },
    preferredViewId: 'counter',
    slots: [
      { id: 't6-900', time: '9:00 AM', available: false, bookedBy: 'Priya S.' },
      { id: 't6-1130', time: '11:30 AM', available: false, bookedBy: 'Liam D.' },
      { id: 't6-1400', time: '2:00 PM', available: true },
      { id: 't6-1630', time: '7:00 PM', available: true },
    ],
    customization: { setupStyle: 'standard', perks: [], note: '' },
  },
  {
    id: 'table-7',
    number: 7,
    name: 'Table 7 · Sunlit Foreground Oak',
    zone: 'Central Social Area',
    shape: 'round',
    capacity: 4,
    lightLevel: 'Abundant Natural Light',
    noiseDb: 52,
    noiseLabel: 'Quiet Zone (52 dB)',
    powerAccess: 'Dual Power Outlets',
    hasPower: true,
    photoPos: { x: 35, y: 81 },
    preferredViewId: 'overview',
    slots: [
      { id: 't7-900', time: '9:00 AM', available: true },
      { id: 't7-1130', time: '11:30 AM', available: true },
      { id: 't7-1400', time: '2:00 PM', available: true },
      { id: 't7-1630', time: '7:00 PM', available: true },
    ],
    customization: { setupStyle: 'standard', perks: ['power-hub', 'nameplate'], note: '' },
  },
];

export const CURATED_COMBOS: CuratedCombo[] = [
  {
    id: 'morning-sunshine',
    name: 'Morning Sunshine Combo',
    subtitle: 'Artisanal Latte + Butter Croissant + Fresh OJ',
    description:
      'Double oat latte paired with our laminated French butter croissant and cold-pressed Valencia orange juice.',
    price: 11.5,
    image: '/src/assets/images/combo_morning_sunshine_1794892485286.jpg',
    defaultDrink: {
      milk: 'oat',
      espresso: 'double',
      flavors: ['vanilla'],
      style: 'hot',
      size: '12oz',
      sweetness: 'light',
      toppings: ['cinnamon'],
    },
  },
  {
    id: 'cozy-commute',
    name: 'The Cozy Commute',
    subtitle: 'Oat Cortado + Pain au Chocolat',
    description:
      'Velvety ristretto cortado with toasted hazelnut notes and a warm dark-chocolate filled croissant.',
    price: 9.25,
    image: '/src/assets/images/combo_cozy_commute_1794892485182.jpg',
    defaultDrink: {
      milk: 'oat',
      espresso: 'double',
      flavors: ['hazelnut'],
      style: 'hot',
      size: '8oz',
      sweetness: 'light',
      toppings: [],
    },
  },
  {
    id: 'study-fuel',
    name: 'Study Fuel Bundle',
    subtitle: 'Iced Caramel Latte + Cinnamon Brioche',
    description:
      'Chilled almond milk espresso over crystal ice with house-made salted caramel and warm cinnamon brioche.',
    price: 10.5,
    image: '/src/assets/images/combo_study_fuel_1794892486056.jpg',
    defaultDrink: {
      milk: 'almond',
      espresso: 'double',
      flavors: ['caramel'],
      style: 'iced',
      size: '16oz',
      sweetness: 'classic',
      toppings: ['oat-whip'],
    },
  },
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'open-mic',
    title: 'Open Mic Friday',
    schedule: 'Friday · 7:00 PM – 9:30 PM',
    spot: 'Main Sunlit Lounge',
    description:
      'Acoustic sets, spoken word, and late-evening decaf pour-overs under warm brass pendants.',
    attendees: 28,
    capacity: 40,
    rsvped: false,
  },
  {
    id: 'latte-art',
    title: 'Latte Art Workshop',
    schedule: 'Saturday · 11:00 AM – 12:30 PM',
    spot: 'Espresso Counter Bar',
    description:
      'Hands-on microfoam texturing and tulip pouring session led by head roaster Matteo Vance.',
    attendees: 9,
    capacity: 12,
    rsvped: false,
  },
  {
    id: 'vinyl-night',
    title: 'Acoustic Vinyl & Tasting',
    schedule: 'Sunday · 6:00 PM – 8:00 PM',
    spot: 'Window Banquette',
    description:
      'Single-origin Ethiopian and Colombian flight tasting accompanied by curated 70s folk vinyl.',
    attendees: 19,
    capacity: 30,
    rsvped: false,
  },
];

export const PLAYLIST_TRACKS: PlaylistTrack[] = [
  {
    id: 'sunlit-lofi',
    title: 'Sunlit Acoustic & Lo-Fi',
    artist: 'The Daily Bean Sessions',
    mood: 'Warm Rhodes & Nylon Guitar',
    bpm: 76,
    chords: [
      [261.63, 329.63, 392.0, 493.88],
      [220.0, 261.63, 329.63, 392.0],
      [174.61, 220.0, 261.63, 329.63],
      [196.0, 246.94, 293.66, 349.23],
    ],
  },
  {
    id: 'morning-jazz',
    title: 'Morning Pour-Over Jazz',
    artist: 'Olivewood Quartet',
    mood: 'Soft Brush & Upright Warmth',
    bpm: 84,
    chords: [
      [293.66, 349.23, 440.0, 523.25],
      [196.0, 246.94, 293.66, 349.23],
      [261.63, 329.63, 392.0, 493.88],
      [220.0, 277.18, 329.63, 392.0],
    ],
  },
  {
    id: 'courtyard-study',
    title: 'Courtyard Study Mist',
    artist: 'Berkeley Ambient Collective',
    mood: 'Gentle Tape Echo Pads',
    bpm: 68,
    chords: [
      [174.61, 220.0, 261.63, 329.63],
      [164.81, 196.0, 246.94, 293.66],
      [146.83, 174.61, 220.0, 261.63],
      [261.63, 329.63, 392.0, 440.0],
    ],
  },
];

export const SPATIAL_PINS: SpatialPinAnchor[] = [
  {
    id: 'window',
    title: 'Sunlit Window Banquette',
    subtitle: 'View Close-Up · Quiet · Sunlit',
    photoPos: { x: 20, y: 42 },
    visibleInViews: ['overview'],
    actionType: 'view',
    targetId: 'window',
  },
  {
    id: 'workspace',
    title: 'Workspace Indicators',
    subtitle: 'Wi-Fi: 320 Mbps · Power: Available',
    photoPos: { x: 24, y: 65 },
    visibleInViews: ['overview', 'window'],
    actionType: 'table',
    targetId: 'table-3',
  },
  {
    id: 'table7',
    title: 'Table 7: Customize & Book',
    subtitle: '4 Seats · Quiet 52 dB · Outlets',
    photoPos: { x: 48, y: 86 },
    visibleInViews: ['overview'],
    actionType: 'table',
    targetId: 'table-7',
  },
  {
    id: 'speaker',
    title: 'Live Cafe Playlist',
    subtitle: 'Sunlit Acoustic & Lo-Fi',
    photoPos: { x: 43, y: 26 },
    visibleInViews: ['overview'],
    actionType: 'playlist',
  },
  {
    id: 'board',
    title: 'Community Events & RSVP',
    subtitle: 'Open Mic Friday @ 7 PM',
    photoPos: { x: 52, y: 41 },
    visibleInViews: ['overview'],
    actionType: 'events',
  },
  {
    id: 'counter',
    title: 'Bespoke Beverage Builder',
    subtitle: 'Customize Drinks & Combos',
    photoPos: { x: 78, y: 51 },
    visibleInViews: ['overview', 'counter'],
    actionType: 'beverage',
  },
];
