import {
  AttachedMealItem,
  AttachedOrderItem,
  BeverageConfig,
  CUP_SIZE_OPTIONS,
  CafeTable,
  ESPRESSO_OPTIONS,
  FLAVOR_OPTIONS,
  FoodMenuItem,
  KITCHEN_MOD_OPTIONS,
  KitchenModId,
  MILK_OPTIONS,
  MealPeriod,
  SWEETNESS_OPTIONS,
  TABLE_PERK_OPTIONS,
  TABLE_SETUP_OPTIONS,
  TOPPING_OPTIONS,
  TableCustomization,
} from '../data/cafeData';

export const BASE_DRINK_PRICE = 4.75;
export const ICED_UPCHARGE = 0.35;

export function calculateBeveragePrice(config: BeverageConfig): number {
  const milkOpt = MILK_OPTIONS.find((m) => m.id === config.milk);
  const espressoOpt = ESPRESSO_OPTIONS.find((e) => e.id === config.espresso);
  const sizeOpt = CUP_SIZE_OPTIONS.find((s) => s.id === config.size);

  const milkCost = milkOpt ? milkOpt.upcharge : 0;
  const espressoCost = espressoOpt ? espressoOpt.upcharge : 0;
  const sizeCost = sizeOpt ? sizeOpt.upcharge : 0;
  const flavorsCost = config.flavors.reduce((sum, flavorId) => {
    const f = FLAVOR_OPTIONS.find((opt) => opt.id === flavorId);
    return sum + (f ? f.upcharge : 0);
  }, 0);
  const toppingsCost = config.toppings.reduce((sum, toppingId) => {
    const t = TOPPING_OPTIONS.find((opt) => opt.id === toppingId);
    return sum + (t ? t.upcharge : 0);
  }, 0);
  const icedCost = config.style === 'iced' ? ICED_UPCHARGE : 0;

  return Number(
    (
      BASE_DRINK_PRICE +
      milkCost +
      espressoCost +
      sizeCost +
      flavorsCost +
      toppingsCost +
      icedCost
    ).toFixed(2),
  );
}

export function getBeverageDescription(config: BeverageConfig): string {
  const sizeLabel = CUP_SIZE_OPTIONS.find((s) => s.id === config.size)?.label ?? '12 oz';
  const milkLabel = MILK_OPTIONS.find((m) => m.id === config.milk)?.label ?? 'Oat';
  const espressoLabel = ESPRESSO_OPTIONS.find((e) => e.id === config.espresso)?.label ?? 'Double';
  const styleLabel = config.style === 'iced' ? 'Iced' : 'Hot';
  const flavorText =
    config.flavors.length > 0
      ? ` + ${config.flavors
          .map((f) => FLAVOR_OPTIONS.find((opt) => opt.id === f)?.label ?? f)
          .join(', ')}`
      : '';

  return `${sizeLabel} ${styleLabel} ${espressoLabel} ${milkLabel} Latte${flavorText}`;
}

export interface BeverageLayerVisuals {
  espressoPercent: number;
  milkPercent: number;
  foamPercent: number;
  milkColorHex: string;
  syrupColorHex: string | null;
  sweetnessLabel: string;
}

export function getBeverageLayerVisuals(config: BeverageConfig): BeverageLayerVisuals {
  const espressoPercent =
    config.espresso === 'double' ? 32 : config.espresso === 'single' ? 20 : 22;
  const foamPercent = config.style === 'iced' ? 12 : 20;
  const milkPercent = 100 - espressoPercent - foamPercent;

  const milkOpt = MILK_OPTIONS.find((m) => m.id === config.milk);
  const milkColorHex = milkOpt ? milkOpt.hex : '#EFE5D1';

  let syrupColorHex: string | null = null;
  if (config.flavors.includes('caramel')) {
    syrupColorHex = '#C88A4B';
  } else if (config.flavors.includes('hazelnut')) {
    syrupColorHex = '#A86B3B';
  } else if (config.flavors.includes('vanilla')) {
    syrupColorHex = '#EED7AE';
  }

  const sweetnessLabel =
    SWEETNESS_OPTIONS.find((s) => s.id === config.sweetness)?.label ?? 'Light';

  return {
    espressoPercent,
    milkPercent,
    foamPercent,
    milkColorHex,
    syrupColorHex,
    sweetnessLabel,
  };
}

export function calculateTableCustomizationCost(custom: TableCustomization): number {
  return custom.perks.reduce((sum, perkId) => {
    const perk = TABLE_PERK_OPTIONS.find((p) => p.id === perkId);
    return sum + (perk ? perk.price : 0);
  }, 0);
}

export function getTableCustomizationSummary(custom: TableCustomization): string {
  const setup =
    TABLE_SETUP_OPTIONS.find((s) => s.id === custom.setupStyle)?.label ?? 'Standard Cafe';
  if (custom.perks.length === 0) return setup;
  const perkLabels = custom.perks
    .map((id) => TABLE_PERK_OPTIONS.find((p) => p.id === id)?.label ?? id)
    .join(', ');
  return `${setup} · ${perkLabels}`;
}

export function filterMenuByMealPeriod(
  items: FoodMenuItem[],
  period: MealPeriod,
): FoodMenuItem[] {
  return items.filter((item) => item.mealPeriod === period);
}

export function calculateFoodItemPrice(basePrice: number, mods: KitchenModId[]): number {
  const modCost = mods.reduce((sum, modId) => {
    const mod = KITCHEN_MOD_OPTIONS.find((m) => m.id === modId);
    return sum + (mod ? mod.upcharge : 0);
  }, 0);
  return Number((basePrice + modCost).toFixed(2));
}

export function calculateMealsSubtotal(meals: AttachedMealItem[]): number {
  return Number(meals.reduce((sum, meal) => sum + meal.unitPrice, 0).toFixed(2));
}

export function calculateCombinedPreOrderTotal(params: {
  tableCustomization: TableCustomization;
  attachedOrder: AttachedOrderItem | null;
  attachedMeals: AttachedMealItem[];
}): number {
  const tableCost = calculateTableCustomizationCost(params.tableCustomization);
  const drinkCost = params.attachedOrder?.price ?? 0;
  const mealsCost = calculateMealsSubtotal(params.attachedMeals);
  return Number((tableCost + drinkCost + mealsCost).toFixed(2));
}

export function computeLiveCapacityPercent(tables: CafeTable[]): number {
  let totalSlots = 0;
  let openSlots = 0;
  for (const table of tables) {
    for (const slot of table.slots) {
      totalSlots += 1;
      if (slot.available) openSlots += 1;
    }
  }
  if (totalSlots === 0) return 0;
  return Math.round((openSlots / totalSlots) * 100);
}

export function isTableAvailableForSlot(table: CafeTable, slotTime?: string): boolean {
  if (slotTime) {
    const match = table.slots.find((s) => s.time === slotTime);
    return match ? match.available : false;
  }
  return table.slots.some((s) => s.available);
}

export interface BookingValidationInput {
  table: CafeTable;
  slotId: string;
  guestName: string;
  guestEmail: string;
  partySize: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateNewsletterEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter your email address.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true };
}

export function validateBookingInput(input: BookingValidationInput): ValidationResult {
  if (!input.slotId) {
    return { valid: false, error: 'Please choose a time slot.' };
  }
  const slot = input.table.slots.find((s) => s.id === input.slotId);
  if (!slot || !slot.available) {
    return { valid: false, error: 'That time slot is already reserved. Pick another slot.' };
  }
  if (input.partySize < 1 || input.partySize > input.table.capacity) {
    return {
      valid: false,
      error: `Party size must be between 1 and ${input.table.capacity} guests for ${input.table.name}.`,
    };
  }
  if (input.guestName.trim().length < 2) {
    return { valid: false, error: 'Please enter your name (at least 2 characters).' };
  }
  const emailCheck = validateNewsletterEmail(input.guestEmail);
  if (!emailCheck.valid) {
    return { valid: false, error: 'Please enter a valid confirmation email.' };
  }
  return { valid: true };
}
