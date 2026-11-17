import React from 'react';
import { ChevronLeft, ChevronRight, Compass, PlugZap, Wifi, ChevronDown, ChevronUp } from 'lucide-react';
import { CAFE_VIEWS, CafeViewId } from '../data/cafeData';

interface WorkspaceTourHudProps {
  openCapacityPercent: number;
  activeViewId: CafeViewId;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectView: (viewId: CafeViewId) => void;
  onOpenSeating: () => void;
}

export const WorkspaceTourHud: React.FC<WorkspaceTourHudProps> = ({
  openCapacityPercent,
  activeViewId,
  collapsed,
  onToggleCollapse,
  onSelectView,
  onOpenSeating,
}) => {
  const activeIndex = Math.max(
    0,
    CAFE_VIEWS.findIndex((v) => v.id === activeViewId),
  );
  const currentView = CAFE_VIEWS[activeIndex] ?? CAFE_VIEWS[0];

  const handlePrev = () => {
    const prev = (activeIndex - 1 + CAFE_VIEWS.length) % CAFE_VIEWS.length;
    onSelectView(CAFE_VIEWS[prev].id);
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % CAFE_VIEWS.length;
    onSelectView(CAFE_VIEWS[next].id);
  };

  return (
    <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 z-20 max-w-[calc(100vw-24px)] sm:max-w-sm">
      {collapsed ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F6F3EC]/95 border border-[#2C3E2D]/20 text-[#1E241E] text-xs font-semibold shadow-md hover:bg-[#F6F3EC] cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-[#C88A4B]" />
          <span className="whitespace-nowrap">Workspace &amp; Tour</span>
          <span className="font-mono-tabular text-[#2C3E2D]">· {openCapacityPercent}% Open</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      ) : (
        <section
          aria-label="Workspace telemetry and tour controls"
          className="rounded-xl bg-[#F6F3EC]/95 border border-[#2C3E2D]/20 shadow-lg p-3.5 text-[#1E241E]"
        >
          {/* Compact Workspace Telemetry Row */}
          <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#2C3E2D]/12">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="font-semibold text-[#2C3E2D]" data-testid="live-capacity">
                Seating:{' '}
                <span className="font-mono-tabular text-[#1E241E]">
                  {openCapacityPercent}% Open
                </span>
              </span>
              <span aria-hidden="true" className="text-[#2C3E2D]/35">
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-[#2C3E2D]">
                <Wifi className="w-3.5 h-3.5 text-[#C88A4B]" />
                <span className="font-mono-tabular">320 Mbps</span>
              </span>
              <span aria-hidden="true" className="text-[#2C3E2D]/35">
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-[#2C3E2D]">
                <PlugZap className="w-3.5 h-3.5 text-[#C88A4B]" />
                <span>AC &amp; USB-C</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Minimize workspace card"
              className="p-1 rounded-md text-[#2C3E2D]/70 hover:text-[#1E241E] hover:bg-[#DCE3D6]/60 cursor-pointer shrink-0"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Viewpoint Cycler + Quick Seating Jump */}
          <div className="pt-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous cafe viewpoint"
                className="w-8 h-8 rounded-lg border border-[#2C3E2D]/20 bg-white/70 hover:bg-[#DCE3D6] flex items-center justify-center text-[#1E241E] cursor-pointer transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next cafe viewpoint"
                className="w-8 h-8 rounded-lg border border-[#2C3E2D]/20 bg-white/70 hover:bg-[#DCE3D6] flex items-center justify-center text-[#1E241E] cursor-pointer transition-colors shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="ml-1 min-w-0">
                <p className="text-xs font-semibold text-[#1E241E] truncate">
                  {currentView.label}
                </p>
                <p className="text-[11px] text-[#2C3E2D]/80 truncate">
                  {currentView.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSeating}
              className="px-3 py-1.5 rounded-lg bg-[#2C3E2D] hover:bg-[#1E241E] text-[#F6F3EC] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              Book Seat
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
