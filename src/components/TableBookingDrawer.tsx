import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Coffee,
  PlugZap,
  SlidersHorizontal,
  Sun,
  Users,
  Utensils,
  Volume2,
  X,
} from 'lucide-react';
import {
  AttachedMealItem,
  AttachedOrderItem,
  CafeTable,
  TABLE_PERK_OPTIONS,
  TABLE_SETUP_OPTIONS,
  TableCustomization,
  TablePerkId,
  TableSetupStyle,
} from '../data/cafeData';
import {
  calculateCombinedPreOrderTotal,
  calculateTableCustomizationCost,
  getTableCustomizationSummary,
  isTableAvailableForSlot,
  validateBookingInput,
} from '../utils/cafeLogic';

interface TableBookingDrawerProps {
  isOpen: boolean;
  tables: CafeTable[];
  selectedTableId: string | null;
  attachedOrder: AttachedOrderItem | null;
  attachedMeals: AttachedMealItem[];
  onClose: () => void;
  onSelectTable: (tableId: string) => void;
  onUpdateTableCustomization: (tableId: string, customization: TableCustomization) => void;
  onOpenBeverageBuilder: () => void;
  onOpenFoodMenu: () => void;
  onClearAttachedOrder: () => void;
  onRemoveMeal: (index: number) => void;
  onConfirmBooking: (params: {
    tableId: string;
    slotId: string;
    guestName: string;
    guestEmail: string;
    partySize: number;
  }) => void;
}

export const TableBookingDrawer: React.FC<TableBookingDrawerProps> = ({
  isOpen,
  tables,
  selectedTableId,
  attachedOrder,
  attachedMeals,
  onClose,
  onSelectTable,
  onUpdateTableCustomization,
  onOpenBeverageBuilder,
  onOpenFoodMenu,
  onClearAttachedOrder,
  onRemoveMeal,
  onConfirmBooking,
}) => {
  const table =
    tables.find((t) => t.id === selectedTableId) ??
    tables.find((t) => t.id === 'table-7') ??
    tables[0];

  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [partySize, setPartySize] = useState<number>(2);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    tableName: string;
    time: string;
    guestName: string;
    partySize: number;
    tableSetupSummary: string;
    totalExtraCost: number;
    attached?: AttachedOrderItem | null;
    meals?: AttachedMealItem[];
  } | null>(null);

  useEffect(() => {
    if (!table) return;
    const firstOpen = table.slots.find((s) => s.available);
    setSelectedSlotId(firstOpen ? firstOpen.id : table.slots[0]?.id ?? '');
    setPartySize(Math.min(2, table.capacity));
    setErrorMsg(null);
    setConfirmation(null);
  }, [table?.id]);

  if (!isOpen || !table) return null;

  const hasAnyOpenSlot = isTableAvailableForSlot(table);
  const customizationCost = calculateTableCustomizationCost(table.customization);
  const orderTotal = calculateCombinedPreOrderTotal({
    tableCustomization: table.customization,
    attachedOrder,
    attachedMeals,
  });

  const togglePerk = (perkId: TablePerkId) => {
    const exists = table.customization.perks.includes(perkId);
    const nextPerks = exists
      ? table.customization.perks.filter((p) => p !== perkId)
      : [...table.customization.perks, perkId];
    onUpdateTableCustomization(table.id, {
      ...table.customization,
      perks: nextPerks,
    });
  };

  const setSetupStyle = (setupStyle: TableSetupStyle) => {
    onUpdateTableCustomization(table.id, {
      ...table.customization,
      setupStyle,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateBookingInput({
      table,
      slotId: selectedSlotId,
      guestName,
      guestEmail,
      partySize,
    });
    if (!check.valid) {
      setErrorMsg(check.error ?? 'Please complete all booking fields.');
      return;
    }

    const slot = table.slots.find((s) => s.id === selectedSlotId);
    onConfirmBooking({
      tableId: table.id,
      slotId: selectedSlotId,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      partySize,
    });
    setErrorMsg(null);
    setConfirmation({
      tableName: table.name,
      time: slot?.time ?? '',
      guestName: guestName.trim(),
      partySize,
      tableSetupSummary: getTableCustomizationSummary(table.customization),
      totalExtraCost: orderTotal,
      attached: attachedOrder,
      meals: attachedMeals,
    });
  };

  return (
    <aside
      aria-label="Table inspection, customization, and reservation"
      className="fixed md:absolute top-14 md:top-4 right-0 md:right-4 bottom-0 md:bottom-4 z-30 w-full sm:w-[410px] bg-[#F6F3EC] border-l md:border border-[#2C3E2D]/20 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-[#2C3E2D]/12 flex items-start justify-between gap-3 bg-[#EFECE3]">
        <div>
          <p className="text-xs font-medium text-[#2C3E2D]">
            {table.zone} · {hasAnyOpenSlot ? 'Open Slots' : 'Fully Booked'}
          </p>
          <h2 className="font-serif-display text-xl font-semibold text-[#1E241E] mt-0.5">
            {table.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close table booking drawer"
          className="p-2 rounded-lg text-[#2C3E2D] hover:bg-[#DCE3D6] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Table Selector Strip */}
      <div className="px-5 py-2.5 border-b border-[#2C3E2D]/10 flex items-center gap-1.5 overflow-x-auto bg-[#F6F3EC]">
        {tables.map((t) => {
          const active = t.id === table.id;
          const open = isTableAvailableForSlot(t);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTable(t.id)}
              aria-label={`Inspect ${t.name}`}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                active
                  ? 'bg-[#2C3E2D] text-[#F6F3EC]'
                  : open
                    ? 'bg-[#DCE3D6]/70 text-[#1E241E] hover:bg-[#DCE3D6]'
                    : 'bg-black/5 text-[#1E241E]/50 hover:bg-black/10'
              }`}
            >
              T{t.number}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto cafe-scroll p-5 space-y-5">
        {/* Environment & Comfort Specs */}
        <section aria-label="Table environment details" className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-[#DCE3D6]/45 border border-[#2C3E2D]/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2C3E2D]">
              <Sun className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>Daylight</span>
            </div>
            <p className="text-xs text-[#1E241E] mt-1 font-medium">{table.lightLevel}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#DCE3D6]/45 border border-[#2C3E2D]/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2C3E2D]">
              <Volume2 className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>Acoustics</span>
            </div>
            <p className="text-xs text-[#1E241E] mt-1 font-medium font-mono-tabular">
              {table.noiseLabel}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#DCE3D6]/45 border border-[#2C3E2D]/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2C3E2D]">
              <PlugZap className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>Power</span>
            </div>
            <p className="text-xs text-[#1E241E] mt-1 font-medium">{table.powerAccess}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#DCE3D6]/45 border border-[#2C3E2D]/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2C3E2D]">
              <Users className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>Capacity</span>
            </div>
            <p className="text-xs text-[#1E241E] mt-1 font-medium font-mono-tabular">
              Up to {table.capacity} Guests
            </p>
          </div>
        </section>

        {confirmation ? (
          <div
            role="status"
            className="p-4 rounded-xl bg-[#2C3E2D] text-[#F6F3EC] space-y-2.5"
            data-testid="booking-confirmation"
          >
            <div className="flex items-center gap-2 text-[#C88A4B]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Seat &amp; Setup Reserved</span>
            </div>
            <p className="font-serif-display text-lg font-semibold">
              {confirmation.tableName}
            </p>
            <p className="text-xs text-[#DCE3D6]">
              {confirmation.time} · {confirmation.partySize}{' '}
              {confirmation.partySize === 1 ? 'Guest' : 'Guests'} · Reserved for{' '}
              {confirmation.guestName}
            </p>
            <p className="text-xs text-[#F6F3EC]/90 pt-2 border-t border-white/15">
              Table Setup: {confirmation.tableSetupSummary}
            </p>
            {confirmation.attached && (
              <p className="text-xs text-[#F6F3EC]">
                Drink: {confirmation.attached.label} ($
                {confirmation.attached.price.toFixed(2)})
              </p>
            )}
            {confirmation.meals && confirmation.meals.length > 0 && (
              <p className="text-xs text-[#F6F3EC]">
                Kitchen: {confirmation.meals.map((m) => m.funnyName).join(', ')}
              </p>
            )}
            {confirmation.totalExtraCost > 0 && (
              <p className="text-xs font-mono-tabular font-semibold text-[#C88A4B]">
                Pre-Order Total: ${confirmation.totalExtraCost.toFixed(2)}
              </p>
            )}
            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="mt-2 px-3 py-1.5 rounded-lg bg-[#C88A4B] hover:bg-[#b5793c] text-[#1E241E] text-xs font-semibold cursor-pointer"
            >
              Modify or Book Another Slot
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Online Table Customization */}
            <section
              aria-label="Customize your table online"
              className="p-3.5 rounded-xl border border-[#2C3E2D]/15 bg-white/75 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C3E2D]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C88A4B]" />
                  <span>Customize Table Setup</span>
                </span>
                <span className="text-[11px] font-mono-tabular text-[#2C3E2D]">
                  {customizationCost > 0 ? `+$${customizationCost.toFixed(2)}` : 'Included'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {TABLE_SETUP_OPTIONS.map((opt) => {
                  const active = table.customization.setupStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSetupStyle(opt.id)}
                      className={`px-2.5 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#2C3E2D] border-[#2C3E2D] text-[#F6F3EC]'
                          : 'bg-[#F6F3EC]/70 border-[#2C3E2D]/15 text-[#1E241E] hover:border-[#C88A4B]'
                      }`}
                    >
                      <span className="block text-xs font-semibold">{opt.label}</span>
                      <span
                        className={`block text-[10px] mt-0.5 ${
                          active ? 'text-[#DCE3D6]' : 'text-[#2C3E2D]/75'
                        }`}
                      >
                        {opt.summary}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-[#2C3E2D]">
                  Table Perks &amp; Comfort Add-Ons
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {TABLE_PERK_OPTIONS.map((perk) => {
                    const active = table.customization.perks.includes(perk.id);
                    return (
                      <button
                        key={perk.id}
                        type="button"
                        onClick={() => togglePerk(perk.id)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold text-left cursor-pointer transition-colors flex items-center justify-between gap-1 ${
                          active
                            ? 'bg-[#C88A4B]/20 border-[#C88A4B] text-[#1E241E]'
                            : 'bg-white border-[#2C3E2D]/15 text-[#2C3E2D] hover:border-[#C88A4B]'
                        }`}
                      >
                        <span className="truncate">{perk.label}</span>
                        {perk.price > 0 && (
                          <span className="font-mono-tabular shrink-0">
                            +${perk.price.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Time Slot Picker */}
            <div>
              <span className="block text-xs font-semibold text-[#2C3E2D] mb-2">
                Select Time Slot
              </span>
              <div className="grid grid-cols-2 gap-2">
                {table.slots.map((slot) => {
                  const selected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => {
                        setSelectedSlotId(slot.id);
                        setErrorMsg(null);
                      }}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold font-mono-tabular transition-colors ${
                        !slot.available
                          ? 'bg-[#DCE3D6]/35 border-[#2C3E2D]/10 text-[#1E241E]/40 cursor-not-allowed line-through'
                          : selected
                            ? 'bg-[#C88A4B] border-[#C88A4B] text-[#1E241E] cursor-pointer'
                            : 'bg-white/75 border-[#2C3E2D]/20 text-[#1E241E] hover:border-[#C88A4B] cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Attached Beverage / Combo Card */}
            <div className="p-3 rounded-xl border border-[#2C3E2D]/15 bg-white/60 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C3E2D]">
                  <Coffee className="w-3.5 h-3.5 text-[#C88A4B]" />
                  <span>Zero-Wait Drink Pre-Order</span>
                </span>
                <button
                  type="button"
                  onClick={onOpenBeverageBuilder}
                  className="text-xs font-semibold text-[#C88A4B] hover:text-[#a66e35] cursor-pointer"
                >
                  {attachedOrder ? 'Customize' : '+ Customize Drink'}
                </button>
              </div>
              {attachedOrder ? (
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1E241E] truncate">{attachedOrder.label}</p>
                    <p className="text-[#2C3E2D]/80 truncate">{attachedOrder.details}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono-tabular font-semibold text-[#1E241E]">
                      ${attachedOrder.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={onClearAttachedOrder}
                      aria-label="Remove attached pre-order"
                      className="text-[#2C3E2D]/60 hover:text-[#1E241E] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#2C3E2D]/75">
                  Optional: craft a bespoke latte or pastry combo for arrival.
                </p>
              )}
            </div>

            {/* Attached Breakfast / Lunch / Dinner Card */}
            <div className="p-3 rounded-xl border border-[#2C3E2D]/15 bg-white/60 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C3E2D]">
                  <Utensils className="w-3.5 h-3.5 text-[#C88A4B]" />
                  <span>Breakfast, Lunch &amp; Dinner</span>
                </span>
                <button
                  type="button"
                  onClick={onOpenFoodMenu}
                  className="text-xs font-semibold text-[#C88A4B] hover:text-[#a66e35] cursor-pointer"
                >
                  {attachedMeals.length > 0 ? '+ Add Dish' : '+ Browse Food Menu'}
                </button>
              </div>
              {attachedMeals.length > 0 ? (
                <div className="space-y-1.5">
                  {attachedMeals.map((meal, idx) => (
                    <div
                      key={`${meal.itemId}-${idx}`}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1E241E] truncate">
                          {meal.funnyName}
                        </p>
                        <p className="text-[11px] text-[#2C3E2D]/75 truncate capitalize">
                          {meal.mealPeriod}
                          {meal.modLabels.length > 0 ? ` · ${meal.modLabels.join(', ')}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono-tabular font-semibold text-[#1E241E]">
                          ${meal.unitPrice.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveMeal(idx)}
                          aria-label={`Remove ${meal.funnyName} from table`}
                          className="text-[#2C3E2D]/60 hover:text-[#1E241E] cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#2C3E2D]/75">
                  Optional: add funny-named breakfast, lunch, or dinner plates to your table.
                </p>
              )}
            </div>

            {/* Party Size + Guest Info */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1">
                <label
                  htmlFor="booking-party-size"
                  className="block text-xs font-semibold text-[#2C3E2D] mb-1"
                >
                  Guests
                </label>
                <select
                  id="booking-party-size"
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border border-[#2C3E2D]/20 bg-white text-sm text-[#1E241E] font-mono-tabular"
                >
                  {Array.from({ length: table.capacity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="booking-guest-name"
                  className="block text-xs font-semibold text-[#2C3E2D] mb-1"
                >
                  Your Name
                </label>
                <input
                  id="booking-guest-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Elena Vance"
                  className="w-full px-3 py-2 rounded-lg border border-[#2C3E2D]/20 bg-white text-sm text-[#1E241E] placeholder:text-[#2C3E2D]/40"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="booking-guest-email"
                className="block text-xs font-semibold text-[#2C3E2D] mb-1"
              >
                Confirmation Email
              </label>
              <input
                id="booking-guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => {
                  setGuestEmail(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="elena@example.com"
                className="w-full px-3 py-2 rounded-lg border border-[#2C3E2D]/20 bg-white text-sm text-[#1E241E] placeholder:text-[#2C3E2D]/40"
              />
            </div>

            {errorMsg && (
              <p role="alert" className="text-xs font-medium text-[#9e3f23]">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#2C3E2D] hover:bg-[#1E241E] text-[#F6F3EC] text-sm font-semibold transition-colors cursor-pointer"
            >
              Confirm Seat{orderTotal > 0 ? ` · $${orderTotal.toFixed(2)}` : ''}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};
