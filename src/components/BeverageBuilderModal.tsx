import React, { useState } from 'react';
import { Check, Coffee, X } from 'lucide-react';
import {
  AttachedOrderItem,
  BeverageConfig,
  CAFE_IMAGES,
  CURATED_COMBOS,
  CUP_SIZE_OPTIONS,
  CupSize,
  ESPRESSO_OPTIONS,
  EspressoStrength,
  FLAVOR_OPTIONS,
  FlavorNote,
  MILK_OPTIONS,
  MilkBase,
  SWEETNESS_OPTIONS,
  ServingStyle,
  SweetnessLevel,
  TOPPING_OPTIONS,
  ToppingOption,
} from '../data/cafeData';
import {
  calculateBeveragePrice,
  getBeverageDescription,
  getBeverageLayerVisuals,
} from '../utils/cafeLogic';

interface BeverageBuilderModalProps {
  isOpen: boolean;
  beverage: BeverageConfig;
  attachedOrder: AttachedOrderItem | null;
  onChangeBeverage: (next: BeverageConfig) => void;
  onAttachOrder: (item: AttachedOrderItem) => void;
  onOpenFoodMenu?: () => void;
  onClose: () => void;
}

export const BeverageBuilderModal: React.FC<BeverageBuilderModalProps> = ({
  isOpen,
  beverage,
  attachedOrder,
  onChangeBeverage,
  onAttachOrder,
  onOpenFoodMenu,
  onClose,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [justAttachedLabel, setJustAttachedLabel] = useState<string | null>(null);

  if (!isOpen) return null;

  const customPrice = calculateBeveragePrice(beverage);
  const customDescription = getBeverageDescription(beverage);
  const layerVisuals = getBeverageLayerVisuals(beverage);
  const drinkImage =
    beverage.style === 'iced' ? CAFE_IMAGES.icedLatte : CAFE_IMAGES.hotLatte;

  const toggleFlavor = (flavor: FlavorNote) => {
    const exists = beverage.flavors.includes(flavor);
    const nextFlavors = exists
      ? beverage.flavors.filter((f) => f !== flavor)
      : [...beverage.flavors, flavor];
    onChangeBeverage({ ...beverage, flavors: nextFlavors });
  };

  const toggleTopping = (topping: ToppingOption) => {
    const exists = beverage.toppings.includes(topping);
    const nextToppings = exists
      ? beverage.toppings.filter((t) => t !== topping)
      : [...beverage.toppings, topping];
    onChangeBeverage({ ...beverage, toppings: nextToppings });
  };

  const handleAttachCustom = () => {
    const toppingsSummary =
      beverage.toppings.length > 0
        ? ` · ${beverage.toppings
            .map((t) => TOPPING_OPTIONS.find((opt) => opt.id === t)?.label ?? t)
            .join(', ')}`
        : '';
    const item: AttachedOrderItem = {
      kind: 'bespoke',
      label: 'Bespoke Craft Latte',
      details: `${customDescription} (${layerVisuals.sweetnessLabel}${toppingsSummary})`,
      price: customPrice,
    };
    onAttachOrder(item);
    setJustAttachedLabel(item.label);
  };

  const handleSelectCombo = (comboId: string) => {
    const combo = CURATED_COMBOS.find((c) => c.id === comboId);
    if (!combo) return;
    onChangeBeverage(combo.defaultDrink);
    const item: AttachedOrderItem = {
      kind: 'combo',
      label: combo.name,
      details: combo.subtitle,
      price: combo.price,
    };
    onAttachOrder(item);
    setJustAttachedLabel(combo.name);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Online Bespoke Beverage Builder and Curated Combos"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 md:p-6 bg-[#1E241E]/65"
    >
      <div className="w-full max-w-5xl max-h-[92vh] rounded-2xl bg-[#F6F3EC] border border-[#2C3E2D]/25 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#2C3E2D]/12 flex items-center justify-between gap-4 bg-[#EFECE3]">
          <div>
            <p className="text-xs font-medium text-[#2C3E2D]">
              Online Drink Customizer · Real-Time Preview
            </p>
            <h2 className="font-serif-display text-xl md:text-2xl font-semibold text-[#1E241E]">
              Bespoke Beverage Builder &amp; Combos
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {onOpenFoodMenu && (
              <button
                type="button"
                onClick={onOpenFoodMenu}
                className="px-3 py-1.5 rounded-lg bg-[#DCE3D6] hover:bg-[#c8d3be] text-[#1E241E] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
              >
                Browse Food Menu
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close beverage builder"
              className="p-2 rounded-lg text-[#2C3E2D] hover:bg-[#DCE3D6] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Split-Screen Content */}
        <div className="flex-1 overflow-y-auto cafe-scroll grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Real Photorealistic Drink Preview + Live Layer Meter */}
          <div className="lg:col-span-5 bg-[#2C3E2D] text-[#F6F3EC] p-4 md:p-5 flex flex-col justify-between relative">
            <div className="flex items-center justify-between text-xs text-[#DCE3D6]">
              <span>
                {beverage.size} · {layerVisuals.sweetnessLabel}
              </span>
              <span
                className="font-mono-tabular font-semibold text-[#F6F3EC] text-base"
                data-testid="beverage-price"
              >
                ${customPrice.toFixed(2)}
              </span>
            </div>

            {/* Real-Time Customized Drink Image */}
            <div className="relative w-full h-[230px] lg:h-[265px] my-2.5 rounded-xl overflow-hidden border border-white/15 bg-[#263627]">
              {failedImages[beverage.style] ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#DCE3D6]">
                  <Coffee className="w-10 h-10 mb-2" />
                  <span className="text-xs">{customDescription}</span>
                </div>
              ) : (
                <img
                  src={drinkImage}
                  alt={customDescription}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({ ...prev, [beverage.style]: true }))
                  }
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{
                    transform:
                      beverage.size === '16oz'
                        ? 'scale(1.06)'
                        : beverage.size === '8oz'
                          ? 'scale(0.95)'
                          : 'scale(1)',
                  }}
                />
              )}

              {/* Subtle Milk Tone Glaze Overlay reflecting milk base choice */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-colors duration-200 mix-blend-soft-light opacity-35"
                style={{ backgroundColor: layerVisuals.milkColorHex }}
              />

              {/* Live Ratio Stack Indicator on Right Edge */}
              <div
                aria-label="Drink layer proportions"
                className="absolute right-3 top-3 bottom-3 w-3 rounded-full overflow-hidden border border-white/35 bg-[#1E241E]/40 flex flex-col-reverse"
              >
                <div
                  style={{ height: `${layerVisuals.espressoPercent}%` }}
                  className="w-full bg-[#4A2816] transition-all duration-200"
                  title="Espresso"
                />
                <div
                  style={{
                    height: `${layerVisuals.milkPercent}%`,
                    backgroundColor: layerVisuals.milkColorHex,
                  }}
                  className="w-full transition-all duration-200"
                  title="Milk Base"
                />
                <div
                  style={{ height: `${layerVisuals.foamPercent}%` }}
                  className="w-full bg-[#FAF6EE] transition-all duration-200"
                  title={beverage.style === 'iced' ? 'Crystal Ice' : 'Microfoam'}
                />
              </div>

              {/* Layer Callout Labels */}
              <div className="pointer-events-none absolute left-3 top-3 space-y-1.5 bg-[#1E241E]/75 px-2.5 py-2 rounded-lg text-[11px] font-medium text-[#F6F3EC]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FAF6EE]" aria-hidden="true" />
                  <span>{beverage.style === 'iced' ? 'Crystal Ice' : 'Rosetta Foam'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full border border-white/40"
                    style={{ backgroundColor: layerVisuals.milkColorHex }}
                    aria-hidden="true"
                  />
                  <span>{MILK_OPTIONS.find((m) => m.id === beverage.milk)?.label} Milk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6B3B22] border border-white/40" aria-hidden="true" />
                  <span>
                    {ESPRESSO_OPTIONS.find((e) => e.id === beverage.espresso)?.label} Shot
                  </span>
                </div>
                {layerVisuals.syrupColorHex && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: layerVisuals.syrupColorHex }}
                      aria-hidden="true"
                    />
                    <span>
                      {beverage.flavors
                        .map((f) => FLAVOR_OPTIONS.find((opt) => opt.id === f)?.label ?? f)
                        .join(' + ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Layer Summary */}
            <div className="pt-3 border-t border-white/15 space-y-1">
              <p className="font-serif-display text-lg font-semibold text-[#F6F3EC]">
                {customDescription}
              </p>
              <p className="text-xs text-[#DCE3D6]">
                {ESPRESSO_OPTIONS.find((e) => e.id === beverage.espresso)?.shotsLabel} ·{' '}
                {layerVisuals.sweetnessLabel} Sweetness
                {beverage.toppings.length > 0 &&
                  ` · ${beverage.toppings
                    .map((t) => TOPPING_OPTIONS.find((opt) => opt.id === t)?.label ?? t)
                    .join(', ')}`}
              </p>
            </div>
          </div>

          {/* Right: Customization Controls + Curated Cafe Combos */}
          <div className="lg:col-span-7 p-4 md:p-5 space-y-3.5">
            {/* Milk Base */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2C3E2D]">
                <span>Milk Base</span>
                <span className="text-[#2C3E2D]/70">Adjusts milk color &amp; creaminess</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MILK_OPTIONS.map((opt) => {
                  const active = beverage.milk === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangeBeverage({ ...beverage, milk: opt.id as MilkBase })}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#2C3E2D] border-[#2C3E2D] text-[#F6F3EC]'
                          : 'bg-white border-[#2C3E2D]/20 text-[#1E241E] hover:border-[#C88A4B]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: opt.hex }}
                        aria-hidden="true"
                      />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Espresso Strength & Serving Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#2C3E2D]">
                  Espresso Strength
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {ESPRESSO_OPTIONS.map((opt) => {
                    const active = beverage.espresso === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          onChangeBeverage({ ...beverage, espresso: opt.id as EspressoStrength })
                        }
                        className={`px-2 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#C88A4B] border-[#C88A4B] text-[#1E241E]'
                            : 'bg-white border-[#2C3E2D]/20 text-[#1E241E] hover:border-[#C88A4B]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#2C3E2D]">
                  Serving Style
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['hot', 'iced'] as ServingStyle[]).map((style) => {
                    const active = beverage.style === style;
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => onChangeBeverage({ ...beverage, style })}
                        className={`px-3 py-2 rounded-lg border text-xs font-semibold capitalize cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#2C3E2D] border-[#2C3E2D] text-[#F6F3EC]'
                            : 'bg-white border-[#2C3E2D]/20 text-[#1E241E] hover:border-[#C88A4B]'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cup Size & Sweetness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#2C3E2D]">Cup Size</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {CUP_SIZE_OPTIONS.map((sz) => {
                    const active = beverage.size === sz.id;
                    return (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => onChangeBeverage({ ...beverage, size: sz.id as CupSize })}
                        className={`px-2 py-2 rounded-lg border text-xs font-semibold font-mono-tabular cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#2C3E2D] border-[#2C3E2D] text-[#F6F3EC]'
                            : 'bg-white border-[#2C3E2D]/20 text-[#1E241E] hover:border-[#C88A4B]'
                        }`}
                      >
                        {sz.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#2C3E2D]">Sweetness</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {SWEETNESS_OPTIONS.map((sw) => {
                    const active = beverage.sweetness === sw.id;
                    return (
                      <button
                        key={sw.id}
                        type="button"
                        onClick={() =>
                          onChangeBeverage({ ...beverage, sweetness: sw.id as SweetnessLevel })
                        }
                        className={`px-2 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#C88A4B] border-[#C88A4B] text-[#1E241E]'
                            : 'bg-white border-[#2C3E2D]/20 text-[#1E241E] hover:border-[#C88A4B]'
                        }`}
                      >
                        {sw.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Flavor Notes & Toppings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#2C3E2D]">
                  House Flavor Notes
                </span>
                <div className="space-y-1.5">
                  {FLAVOR_OPTIONS.map((fl) => {
                    const active = beverage.flavors.includes(fl.id);
                    return (
                      <button
                        key={fl.id}
                        type="button"
                        onClick={() => toggleFlavor(fl.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#C88A4B]/20 border-[#C88A4B] text-[#1E241E]'
                            : 'bg-white border-[#2C3E2D]/20 text-[#1E241E] hover:border-[#C88A4B]'
                        }`}
                      >
                        <span>{fl.label}</span>
                        <span className="font-mono-tabular text-[11px] text-[#2C3E2D]">
                          +${fl.upcharge.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#2C3E2D]">
                  Artisanal Toppings
                </span>
                <div className="space-y-1.5">
                  {TOPPING_OPTIONS.map((tp) => {
                    const active = beverage.toppings.includes(tp.id);
                    return (
                      <button
                        key={tp.id}
                        type="button"
                        onClick={() => toggleTopping(tp.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#2C3E2D] border-[#2C3E2D] text-[#F6F3EC]'
                            : 'bg-white border-[#2C3E2D]/20 text-[#1E241E] hover:border-[#C88A4B]'
                        }`}
                      >
                        <span>{tp.label}</span>
                        <span className="font-mono-tabular text-[11px]">
                          {tp.upcharge === 0 ? 'Free' : `+$${tp.upcharge.toFixed(2)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Attach Custom Drink CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleAttachCustom}
                className="px-4 py-2.5 rounded-xl bg-[#2C3E2D] hover:bg-[#1E241E] text-[#F6F3EC] text-xs md:text-sm font-semibold cursor-pointer transition-colors"
              >
                Attach Drink to Reservation · ${customPrice.toFixed(2)}
              </button>
              {justAttachedLabel && (
                <span
                  role="status"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C3E2D]"
                >
                  <Check className="w-4 h-4 text-[#C88A4B]" />
                  <span>Attached: {justAttachedLabel}</span>
                </span>
              )}
            </div>

            {/* Curated Cafe Combos */}
            <div className="pt-4 border-t border-[#2C3E2D]/15 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-display text-lg font-semibold text-[#1E241E]">
                  Curated Cafe Combos
                </h3>
                <span className="text-xs text-[#2C3E2D]">Zero-wait arrival pairings</span>
              </div>

              <div className="space-y-2">
                {CURATED_COMBOS.map((combo) => {
                  const isAttached = attachedOrder?.label === combo.name;
                  return (
                    <div
                      key={combo.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                        isAttached
                          ? 'bg-[#DCE3D6]/60 border-[#2C3E2D]'
                          : 'bg-white border-[#2C3E2D]/15'
                      }`}
                    >
                      {failedImages[combo.id] ? (
                        <div className="w-14 h-14 rounded-lg bg-[#DCE3D6] flex items-center justify-center shrink-0">
                          <Coffee className="w-6 h-6 text-[#2C3E2D]" />
                        </div>
                      ) : (
                        <img
                          src={combo.image}
                          alt={combo.name}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [combo.id]: true }))
                          }
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-[#1E241E] truncate">
                            {combo.name}
                          </h4>
                          <span className="font-mono-tabular text-xs font-semibold text-[#2C3E2D] shrink-0">
                            ${combo.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-[#2C3E2D]/80 truncate">{combo.subtitle}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectCombo(combo.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                          isAttached
                            ? 'bg-[#2C3E2D] text-[#F6F3EC]'
                            : 'bg-[#C88A4B] hover:bg-[#b5793c] text-[#1E241E]'
                        }`}
                      >
                        {isAttached ? 'Selected' : 'Add Combo'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
