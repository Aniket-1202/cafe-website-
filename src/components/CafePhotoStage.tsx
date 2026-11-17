import React, { useRef, useState } from 'react';
import {
  Calendar,
  Coffee,
  Eye,
  EyeOff,
  LayoutGrid,
  PlugZap,
  Volume2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import {
  CAFE_VIEWS,
  CafeTable,
  CafeViewId,
  SPATIAL_PINS,
  SpatialPinAnchor,
} from '../data/cafeData';
import { isTableAvailableForSlot } from '../utils/cafeLogic';

interface CafePhotoStageProps {
  activeViewId: CafeViewId;
  tables: CafeTable[];
  selectedTableId: string | null;
  pinsVisible: boolean;
  onTogglePins: () => void;
  onSelectTable: (tableId: string) => void;
  onPinAction: (pin: SpatialPinAnchor) => void;
  onSelectView: (viewId: CafeViewId) => void;
  drawerOpen?: boolean;
}

const PIN_ICONS: Record<SpatialPinAnchor['id'], React.ReactNode> = {
  window: <LayoutGrid className="w-4 h-4 text-[#2C3E2D]" />,
  workspace: <PlugZap className="w-4 h-4 text-[#2C3E2D]" />,
  table7: <LayoutGrid className="w-4 h-4 text-[#C88A4B]" />,
  speaker: <Volume2 className="w-4 h-4 text-[#2C3E2D]" />,
  board: <Calendar className="w-4 h-4 text-[#2C3E2D]" />,
  counter: <Coffee className="w-4 h-4 text-[#C88A4B]" />,
};

export const CafePhotoStage: React.FC<CafePhotoStageProps> = ({
  activeViewId,
  tables,
  selectedTableId,
  pinsVisible,
  onTogglePins,
  onSelectTable,
  onPinAction,
  onSelectView,
  drawerOpen = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const activeView = CAFE_VIEWS.find((v) => v.id === activeViewId) ?? CAFE_VIEWS[0];

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, Number((z + 0.2).toFixed(2))));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1, Number((z - 0.2).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pan.x,
      origY: pan.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const maxOffset = (zoom - 1) * 260;
    setPan({
      x: Math.max(-maxOffset, Math.min(maxOffset, dragRef.current.origX + dx)),
      y: Math.max(-maxOffset, Math.min(maxOffset, dragRef.current.origY + dy)),
    });
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  const visiblePins = SPATIAL_PINS.filter((p) => p.visibleInViews.includes(activeViewId));

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#2C3E2D] flex items-center justify-center select-none"
      data-testid="cafe-photo-stage"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Synchronized 16:9 Interactive Photo Frame */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          cursor: zoom > 1 ? 'grab' : 'default',
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          }}
        >
          {imgError[activeView.id] ? (
            <div className="w-full h-full bg-[#DCE3D6] flex flex-col items-center justify-center p-6 text-center text-[#1E241E]">
              <Coffee className="w-10 h-10 text-[#2C3E2D] mb-2" />
              <p className="font-serif-display text-xl font-semibold">{activeView.label}</p>
              <p className="text-xs text-[#2C3E2D] mt-1">{activeView.subtitle}</p>
            </div>
          ) : (
            <img
              src={activeView.image}
              alt={activeView.alt}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImgError((prev) => ({ ...prev, [activeView.id]: true }))}
              className="w-full h-full object-cover"
            />
          )}

          {/* Subtle warm daylight vignette for pin legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E241E]/25 via-transparent to-[#1E241E]/15"
          />

          {/* Interactive Table Hotspots on Real Furniture (Overview) */}
          {activeViewId === 'overview' &&
            tables.map((table) => {
              const available = isTableAvailableForSlot(table);
              const isSelected = selectedTableId === table.id;
              return (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => onSelectTable(table.id)}
                  aria-label={`Inspect and customize ${table.name}`}
                  style={{
                    left: `${table.photoPos.x}%`,
                    top: `${table.photoPos.y}%`,
                  }}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C88A4B]"
                >
                  <span
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center text-xs font-mono-tabular font-semibold transition-transform duration-150 group-hover:scale-110 shadow-md ${
                      isSelected
                        ? 'bg-[#C88A4B] border-[#F6F3EC] text-[#1E241E] scale-110'
                        : available
                          ? 'bg-[#2C3E2D]/85 border-[#C88A4B] text-[#F6F3EC]'
                          : 'bg-[#DCE3D6]/90 border-[#2C3E2D]/50 text-[#1E241E]'
                    }`}
                  >
                    T{table.number}
                  </span>
                </button>
              );
            })}

          {/* Close-Up View Direct Action Hotspots */}
          {activeViewId === 'window' && (
            <button
              type="button"
              onClick={() => onSelectTable('table-2')}
              style={{ left: '53%', top: '62%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 px-3.5 py-2 rounded-xl bg-[#F6F3EC]/95 hover:bg-[#F6F3EC] border border-[#C88A4B] text-[#1E241E] shadow-lg text-xs font-semibold cursor-pointer transition-transform hover:scale-105"
            >
              Customize Window Table 2 · Open
            </button>
          )}

          {activeViewId === 'counter' && (
            <button
              type="button"
              onClick={() =>
                onPinAction({
                  id: 'counter',
                  title: 'Bespoke Beverage Builder',
                  subtitle: 'Customize Drinks & Combos',
                  photoPos: { x: 50, y: 50 },
                  visibleInViews: ['counter'],
                  actionType: 'beverage',
                })
              }
              style={{ left: '46%', top: '54%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 px-4 py-2 rounded-xl bg-[#2C3E2D] hover:bg-[#1E241E] border border-[#C88A4B] text-[#F6F3EC] shadow-lg text-xs font-semibold cursor-pointer transition-transform hover:scale-105"
            >
              Customize Your Drink &amp; Combos
            </button>
          )}

          {/* Spatial Feature Pins Locked onto Real Photo Targets */}
          {pinsVisible &&
            visiblePins.map((pin) => {
              const isTable7Active = pin.id === 'table7' && selectedTableId === 'table-7';
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => onPinAction(pin)}
                  style={{
                    left: `${pin.photoPos.x}%`,
                    top: `${pin.photoPos.y}%`,
                  }}
                  className={`hidden sm:flex absolute -translate-x-1/2 -translate-y-full z-10 items-center gap-2.5 px-3 py-2 rounded-xl border text-left shadow-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C88A4B] ${
                    isTable7Active
                      ? 'bg-[#2C3E2D] border-[#C88A4B] text-[#F6F3EC]'
                      : 'bg-[#F6F3EC]/95 hover:bg-[#F6F3EC] border-[#2C3E2D]/20 text-[#1E241E]'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isTable7Active ? 'bg-[#F6F3EC]' : 'bg-[#DCE3D6]'
                    }`}
                  >
                    {PIN_ICONS[pin.id]}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold leading-tight whitespace-nowrap">
                      {pin.title}
                    </span>
                    <span
                      className={`block text-[11px] leading-tight whitespace-nowrap mt-0.5 ${
                        isTable7Active ? 'text-[#DCE3D6]' : 'text-[#2C3E2D]/80'
                      }`}
                    >
                      {pin.subtitle}
                    </span>
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Top-Left Controls: Pin Toggle + Real-View Switcher */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onTogglePins}
          aria-label={pinsVisible ? 'Hide spatial pins' : 'Show spatial pins'}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#F6F3EC]/95 hover:bg-[#F6F3EC] text-[#1E241E] border border-[#2C3E2D]/20 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {pinsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="whitespace-nowrap">{pinsVisible ? 'Hide Pins' : 'Show Pins'}</span>
        </button>

        <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-[#F6F3EC]/95 border border-[#2C3E2D]/20 shadow-sm">
          {CAFE_VIEWS.map((view) => {
            const active = view.id === activeViewId;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => {
                  handleResetZoom();
                  onSelectView(view.id);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#2C3E2D] text-[#F6F3EC]'
                    : 'text-[#2C3E2D] hover:bg-[#DCE3D6]/70'
                }`}
              >
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top-Right Compact Zoom Controls (shifts left when booking drawer is open on desktop) */}
      <div
        className={`absolute top-3 z-20 flex items-center gap-1 p-1 rounded-lg bg-[#F6F3EC]/95 border border-[#2C3E2D]/20 shadow-sm transition-all duration-200 ${
          drawerOpen ? 'right-3 md:right-[434px]' : 'right-3'
        }`}
      >
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out cafe view"
          className="p-1.5 rounded-md text-[#1E241E] hover:bg-[#DCE3D6] cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="px-1.5 text-[11px] font-mono-tabular font-semibold text-[#2C3E2D]">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in cafe view"
          className="p-1.5 rounded-md text-[#1E241E] hover:bg-[#DCE3D6] cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        {zoom > 1 && (
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            className="p-1.5 rounded-md text-[#2C3E2D] hover:bg-[#DCE3D6] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
