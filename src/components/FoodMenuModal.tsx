import React, { useState } from 'react';
import { Check, Coffee, Plus, Utensils, X } from 'lucide-react';
import {
  AttachedMealItem,
  FOOD_MENU_ITEMS,
  KITCHEN_MOD_OPTIONS,
  KitchenModId,
  MEAL_PERIODS,
  MealPeriod,
} from '../data/cafeData';
import {
  calculateFoodItemPrice,
  calculateMealsSubtotal,
  filterMenuByMealPeriod,
} from '../utils/cafeLogic';

interface FoodMenuModalProps {
  isOpen: boolean;
  activePeriod: MealPeriod;
  attachedMeals: AttachedMealItem[];
  onChangePeriod: (period: MealPeriod) => void;
  onAddMeal: (meal: AttachedMealItem) => void;
  onRemoveMeal: (index: number) => void;
  onOpenBookingDrawer: () => void;
  onClose: () => void;
}

export const FoodMenuModal: React.FC<FoodMenuModalProps> = ({
  isOpen,
  activePeriod,
  attachedMeals,
  onChangePeriod,
  onAddMeal,
  onRemoveMeal,
  onOpenBookingDrawer,
  onClose,
}) => {
  const [selectedModsByDish, setSelectedModsByDish] = useState<
    Record<string, KitchenModId[]>
  >({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPeriodMeta =
    MEAL_PERIODS.find((p) => p.id === activePeriod) ?? MEAL_PERIODS[0];
  const dishes = filterMenuByMealPeriod(FOOD_MENU_ITEMS, activePeriod);
  const mealsSubtotal = calculateMealsSubtotal(attachedMeals);

  const toggleDishMod = (dishId: string, modId: KitchenModId) => {
    setSelectedModsByDish((prev) => {
      const current = prev[dishId] ?? [];
      const exists = current.includes(modId);
      const next = exists ? current.filter((m) => m !== modId) : [...current, modId];
      return { ...prev, [dishId]: next };
    });
  };

  const handleAddDish = (dishId: string) => {
    const dish = FOOD_MENU_ITEMS.find((d) => d.id === dishId);
    if (!dish) return;
    const mods = selectedModsByDish[dish.id] ?? [];
    const unitPrice = calculateFoodItemPrice(dish.price, mods);
    const modLabels = mods.map(
      (id) => KITCHEN_MOD_OPTIONS.find((opt) => opt.id === id)?.label ?? id,
    );

    onAddMeal({
      itemId: dish.id,
      funnyName: dish.funnyName,
      mealPeriod: dish.mealPeriod,
      modLabels,
      unitPrice,
    });
    setRecentlyAddedId(dish.id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="All-Day Kitchen Menu: Breakfast, Lunch, and Dinner"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 md:p-5 bg-[#1E241E]/65"
    >
      <div className="w-full max-w-5xl max-h-[92vh] rounded-2xl bg-[#F6F3EC] border border-[#2C3E2D]/25 shadow-2xl flex flex-col overflow-hidden">
        {/* Header + Meal Period Switcher */}
        <div className="px-5 py-3.5 border-b border-[#2C3E2D]/12 flex flex-wrap items-center justify-between gap-3 bg-[#EFECE3]">
          <div>
            <p className="text-xs font-medium text-[#2C3E2D]">
              All-Day Kitchen · Seriously Good Food, Questionable Puns
            </p>
            <h2 className="font-serif-display text-xl md:text-2xl font-semibold text-[#1E241E]">
              Breakfast, Lunch &amp; Dinner Menu
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div
              role="tablist"
              aria-label="Meal periods"
              className="flex items-center gap-1 p-1 rounded-lg bg-[#DCE3D6]/75 border border-[#2C3E2D]/15"
            >
              {MEAL_PERIODS.map((period) => {
                const active = period.id === activePeriod;
                return (
                  <button
                    key={period.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onChangePeriod(period.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#2C3E2D] text-[#F6F3EC]'
                        : 'text-[#2C3E2D] hover:bg-white/60'
                    }`}
                  >
                    {period.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close food menu"
              className="p-2 rounded-lg text-[#2C3E2D] hover:bg-[#DCE3D6] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto cafe-scroll p-4 md:p-5 space-y-4">
          {/* Featured Meal Spread Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch rounded-xl bg-[#2C3E2D] text-[#F6F3EC] overflow-hidden border border-[#2C3E2D]/20">
            <div className="md:col-span-5 h-44 md:h-48 relative bg-[#263627]">
              {failedImages[currentPeriodMeta.id] ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#DCE3D6]">
                  <Utensils className="w-8 h-8 mb-2" />
                  <span className="font-serif-display text-base">
                    {currentPeriodMeta.label} Service
                  </span>
                </div>
              ) : (
                <img
                  src={currentPeriodMeta.image}
                  alt={currentPeriodMeta.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [currentPeriodMeta.id]: true,
                    }))
                  }
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="md:col-span-7 p-4 md:p-5 flex flex-col justify-center space-y-1.5">
              <p className="text-xs font-mono-tabular text-[#C88A4B] font-semibold">
                {currentPeriodMeta.label} Hours · {currentPeriodMeta.hours}
              </p>
              <h3 className="font-serif-display text-xl md:text-2xl font-semibold text-[#F6F3EC]">
                {currentPeriodMeta.tagline}
              </h3>
              <p className="text-xs md:text-sm text-[#DCE3D6] leading-relaxed">
                Customize any plate online and pre-attach it to your seat reservation so
                the kitchen fires it right before you sit down.
              </p>
            </div>
          </div>

          {/* 2-Column Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {dishes.map((dish) => {
              const chosenMods = selectedModsByDish[dish.id] ?? [];
              const livePrice = calculateFoodItemPrice(dish.price, chosenMods);
              const isJustAdded = recentlyAddedId === dish.id;

              return (
                <article
                  key={dish.id}
                  className="p-4 rounded-xl bg-white border border-[#2C3E2D]/15 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-serif-display text-lg font-semibold text-[#1E241E] leading-snug">
                        {dish.funnyName}
                      </h4>
                      <span className="font-mono-tabular text-sm font-semibold text-[#2C3E2D] shrink-0">
                        ${livePrice.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#C88A4B]">
                      {dish.tagline}
                    </p>
                    <p className="text-xs text-[#1E241E]/80 leading-relaxed">
                      {dish.description}
                    </p>
                    <p className="text-[11px] text-[#2C3E2D]/70 pt-0.5">
                      {dish.dietaryNote}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-[#2C3E2D]/10">
                    <div className="flex flex-wrap gap-1.5">
                      {dish.availableMods.map((modId) => {
                        const mod = KITCHEN_MOD_OPTIONS.find((m) => m.id === modId);
                        if (!mod) return null;
                        const active = chosenMods.includes(mod.id);
                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => toggleDishMod(dish.id, mod.id)}
                            className={`px-2 py-1 rounded-md border text-[11px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                              active
                                ? 'bg-[#C88A4B]/20 border-[#C88A4B] text-[#1E241E] font-semibold'
                                : 'bg-[#F6F3EC]/70 border-[#2C3E2D]/15 text-[#2C3E2D] hover:border-[#C88A4B]'
                            }`}
                          >
                            {mod.label}
                            {mod.upcharge > 0 ? ` +$${mod.upcharge.toFixed(2)}` : ''}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddDish(dish.id)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        isJustAdded
                          ? 'bg-[#2C3E2D] text-[#F6F3EC]'
                          : 'bg-[#C88A4B] hover:bg-[#b5793c] text-[#1E241E]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Table Order · ${livePrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add {dish.funnyName} · ${livePrice.toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Sticky Bottom Table Food Order Tray */}
        <div className="px-5 py-3 border-t border-[#2C3E2D]/15 bg-[#EFECE3] flex flex-wrap items-center justify-between gap-3">
          {attachedMeals.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-[#2C3E2D]">
              <Coffee className="w-4 h-4 text-[#C88A4B]" />
              <span>No dishes in your table order yet — pick any Breakfast, Lunch, or Dinner plate.</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-xs font-semibold text-[#1E241E] whitespace-nowrap">
                Table Food Order ({attachedMeals.length}{' '}
                {attachedMeals.length === 1 ? 'dish' : 'dishes'} ·{' '}
                <span className="font-mono-tabular">${mealsSubtotal.toFixed(2)}</span>):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {attachedMeals.map((meal, idx) => (
                  <span
                    key={`${meal.itemId}-${idx}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2C3E2D] bg-white px-2 py-0.5 rounded-md border border-[#2C3E2D]/15"
                  >
                    <span>{meal.funnyName}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveMeal(idx)}
                      aria-label={`Remove ${meal.funnyName}`}
                      className="text-[#2C3E2D]/60 hover:text-[#1E241E] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBookingDrawer();
            }}
            className="px-4 py-2 rounded-lg bg-[#2C3E2D] hover:bg-[#1E241E] text-[#F6F3EC] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            Attach to Table Reservation
          </button>
        </div>
      </div>
    </div>
  );
};
