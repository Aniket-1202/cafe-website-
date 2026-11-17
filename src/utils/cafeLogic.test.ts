import test from 'node:test';
import assert from 'node:assert/strict';
import { FOOD_MENU_ITEMS, INITIAL_TABLES } from '../data/cafeData';
import {
  calculateBeveragePrice,
  calculateCombinedPreOrderTotal,
  calculateFoodItemPrice,
  calculateMealsSubtotal,
  calculateTableCustomizationCost,
  computeLiveCapacityPercent,
  filterMenuByMealPeriod,
  getBeverageDescription,
  getBeverageLayerVisuals,
  getTableCustomizationSummary,
  isTableAvailableForSlot,
  validateBookingInput,
  validateNewsletterEmail,
} from './cafeLogic';

test('calculateBeveragePrice sums milk, espresso, size, flavors, toppings, and iced correctly', () => {
  assert.equal(
    calculateBeveragePrice({
      milk: 'whole',
      espresso: 'single',
      flavors: [],
      style: 'hot',
      size: '8oz',
      sweetness: 'unsweetened',
      toppings: [],
    }),
    4.75,
  );

  assert.equal(
    calculateBeveragePrice({
      milk: 'oat',
      espresso: 'double',
      flavors: ['vanilla', 'caramel'],
      style: 'iced',
      size: '16oz',
      sweetness: 'classic',
      toppings: ['oat-whip'],
    }),
    Number((4.75 + 0.65 + 1.1 + 1.2 + 0.55 + 0.6 + 0.75 + 0.35).toFixed(2)),
  );
});

test('getBeverageDescription formats readable summary with size', () => {
  const desc = getBeverageDescription({
    milk: 'almond',
    espresso: 'double',
    flavors: ['caramel'],
    style: 'iced',
    size: '16oz',
    sweetness: 'light',
    toppings: [],
  });
  assert.equal(desc, '16 oz Iced Double Almond Latte + Caramel');
});

test('getBeverageLayerVisuals returns espresso ratio and syrup tint', () => {
  const single = getBeverageLayerVisuals({
    milk: 'whole',
    espresso: 'single',
    flavors: [],
    style: 'hot',
    size: '8oz',
    sweetness: 'unsweetened',
    toppings: [],
  });
  const dbl = getBeverageLayerVisuals({
    milk: 'oat',
    espresso: 'double',
    flavors: ['caramel'],
    style: 'iced',
    size: '12oz',
    sweetness: 'classic',
    toppings: [],
  });

  assert.ok(dbl.espressoPercent > single.espressoPercent);
  assert.equal(dbl.milkColorHex, '#EFE5D1');
  assert.equal(dbl.syrupColorHex, '#C88A4B');
  assert.equal(single.syrupColorHex, null);
});

test('table customization pricing and summary calculate properly', () => {
  const custom = {
    setupStyle: 'laptop-focus' as const,
    perks: ['power-hub' as const, 'water-carafe' as const],
    note: 'Window side',
  };
  assert.equal(calculateTableCustomizationCost(custom), 1.5);
  assert.ok(getTableCustomizationSummary(custom).includes('Laptop Focus'));
  assert.ok(getTableCustomizationSummary(custom).includes('Chilled Citrus Carafe'));
});

test('computeLiveCapacityPercent starts at 68% open and updates when slots change', () => {
  assert.equal(computeLiveCapacityPercent(INITIAL_TABLES), 68);

  const updated = INITIAL_TABLES.map((t) =>
    t.id === 'table-7'
      ? {
          ...t,
          slots: t.slots.map((s) => ({ ...s, available: false })),
        }
      : t,
  );
  assert.equal(computeLiveCapacityPercent(updated), 54);
});

test('isTableAvailableForSlot checks specific slot and overall availability', () => {
  const t1 = INITIAL_TABLES[0];
  assert.equal(isTableAvailableForSlot(t1), true);
  assert.equal(isTableAvailableForSlot(t1, '9:00 AM'), false);
  assert.equal(isTableAvailableForSlot(t1, '11:30 AM'), true);
});

test('validateBookingInput enforces valid slot, party capacity, name, and email', () => {
  const t7 = INITIAL_TABLES.find((t) => t.id === 'table-7')!;

  assert.equal(
    validateBookingInput({
      table: t7,
      slotId: 't7-1130',
      guestName: 'Elena Vance',
      guestEmail: 'elena@example.com',
      partySize: 2,
    }).valid,
    true,
  );

  assert.equal(
    validateBookingInput({
      table: t7,
      slotId: 't7-1130',
      guestName: 'A',
      guestEmail: 'elena@example.com',
      partySize: 2,
    }).valid,
    false,
  );

  assert.equal(
    validateBookingInput({
      table: t7,
      slotId: 't7-1130',
      guestName: 'Elena Vance',
      guestEmail: 'not-an-email',
      partySize: 2,
    }).valid,
    false,
  );

  assert.equal(
    validateBookingInput({
      table: t7,
      slotId: 't7-1130',
      guestName: 'Elena Vance',
      guestEmail: 'elena@example.com',
      partySize: 6,
    }).valid,
    false,
  );
});

test('validateNewsletterEmail rejects blank and malformed emails', () => {
  assert.equal(validateNewsletterEmail('').valid, false);
  assert.equal(validateNewsletterEmail('hello@').valid, false);
  assert.equal(validateNewsletterEmail('guest@thedailybean.cafe').valid, true);
});

test('filterMenuByMealPeriod separates Breakfast, Lunch, and Dinner funny-named dishes', () => {
  const breakfast = filterMenuByMealPeriod(FOOD_MENU_ITEMS, 'breakfast');
  const lunch = filterMenuByMealPeriod(FOOD_MENU_ITEMS, 'lunch');
  const dinner = filterMenuByMealPeriod(FOOD_MENU_ITEMS, 'dinner');

  assert.equal(breakfast.length, 4);
  assert.equal(lunch.length, 4);
  assert.equal(dinner.length, 4);
  assert.ok(breakfast.some((d) => d.funnyName.includes('Egg-sistential')));
  assert.ok(lunch.some((d) => d.funnyName.includes('Grill-ty Pleasure')));
  assert.ok(dinner.some((d) => d.funnyName.includes('Salmon Enchanted Evening')));
});

test('calculateFoodItemPrice and combined pre-order total sum table perks, drinks, and meals', () => {
  const unitPrice = calculateFoodItemPrice(13.25, ['add-egg', 'hot-honey']);
  assert.equal(unitPrice, 16.25);

  const subtotal = calculateMealsSubtotal([
    {
      itemId: 'avo-control-toast',
      funnyName: 'Avo-Control Issues Toast',
      mealPeriod: 'breakfast',
      modLabels: ['Add Poached Egg', 'Hot Honey Drizzle'],
      unitPrice,
    },
  ]);
  assert.equal(subtotal, 16.25);

  const combined = calculateCombinedPreOrderTotal({
    tableCustomization: {
      setupStyle: 'laptop-focus',
      perks: ['water-carafe'],
      note: '',
    },
    attachedOrder: {
      kind: 'bespoke',
      label: 'Bespoke Craft Latte',
      details: '12 oz Hot Double Oat Latte',
      price: 6.5,
    },
    attachedMeals: [
      {
        itemId: 'avo-control-toast',
        funnyName: 'Avo-Control Issues Toast',
        mealPeriod: 'breakfast',
        modLabels: ['Add Poached Egg', 'Hot Honey Drizzle'],
        unitPrice: 16.25,
      },
    ],
  });
  assert.equal(combined, Number((1.5 + 6.5 + 16.25).toFixed(2)));
});
