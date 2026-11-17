import { useCallback, useEffect, useMemo, useState } from 'react';
import { BeverageBuilderModal } from './components/BeverageBuilderModal';
import { CafePhotoStage } from './components/CafePhotoStage';
import { EventsModal } from './components/EventsModal';
import { FoodMenuModal } from './components/FoodMenuModal';
import { FooterBar } from './components/FooterBar';
import { Navbar, NavSection } from './components/Navbar';
import { PlaylistWidget } from './components/PlaylistWidget';
import { TableBookingDrawer } from './components/TableBookingDrawer';
import { WorkspaceTourHud } from './components/WorkspaceTourHud';
import {
  AttachedMealItem,
  AttachedOrderItem,
  BeverageConfig,
  CafeTable,
  CafeViewId,
  CommunityEvent,
  INITIAL_EVENTS,
  INITIAL_TABLES,
  MealPeriod,
  PLAYLIST_TRACKS,
  SpatialPinAnchor,
  TableCustomization,
} from './data/cafeData';
import { cafeAudio } from './utils/cafeAudio';
import { computeLiveCapacityPercent } from './utils/cafeLogic';

export default function App() {
  const [tables, setTables] = useState<CafeTable[]>(INITIAL_TABLES);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);
  const [foodMenuOpen, setFoodMenuOpen] = useState(false);
  const [beverageModalOpen, setBeverageModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [activeViewId, setActiveViewId] = useState<CafeViewId>('overview');
  const [activeMealPeriod, setActiveMealPeriod] = useState<MealPeriod>('breakfast');

  const [pinsVisible, setPinsVisible] = useState(true);
  const [hudCollapsed, setHudCollapsed] = useState(false);

  const [beverage, setBeverage] = useState<BeverageConfig>({
    milk: 'oat',
    espresso: 'double',
    flavors: ['caramel'],
    style: 'hot',
    size: '12oz',
    sweetness: 'light',
    toppings: ['cinnamon'],
  });
  const [attachedOrder, setAttachedOrder] = useState<AttachedOrderItem | null>(null);
  const [attachedMeals, setAttachedMeals] = useState<AttachedMealItem[]>([]);

  const [events, setEvents] = useState<CommunityEvent[]>(INITIAL_EVENTS);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0.45);

  const openCapacityPercent = useMemo(() => computeLiveCapacityPercent(tables), [tables]);

  useEffect(() => {
    return () => {
      cafeAudio.dispose();
    };
  }, []);

  const handleSelectTable = useCallback(
    (tableId: string) => {
      const targetTable = tables.find((t) => t.id === tableId);
      if (!targetTable) return;
      setSelectedTableId(tableId);
      setBookingDrawerOpen(true);
      setActiveSection('seating');
    },
    [tables],
  );

  const handleUpdateTableCustomization = useCallback(
    (tableId: string, customization: TableCustomization) => {
      setTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, customization } : t)),
      );
    },
    [],
  );

  const handleNavigate = useCallback(
    (section: NavSection) => {
      setActiveSection(section);
      if (section === 'home') {
        setBookingDrawerOpen(false);
        setFoodMenuOpen(false);
        setBeverageModalOpen(false);
        setEventsModalOpen(false);
        setSelectedTableId(null);
        setActiveViewId('overview');
      } else if (section === 'seating') {
        setFoodMenuOpen(false);
        setBeverageModalOpen(false);
        setEventsModalOpen(false);
        setActiveViewId('overview');
        handleSelectTable('table-7');
      } else if (section === 'food') {
        setBeverageModalOpen(false);
        setEventsModalOpen(false);
        setFoodMenuOpen(true);
      } else if (section === 'menu') {
        setFoodMenuOpen(false);
        setEventsModalOpen(false);
        setActiveViewId('counter');
        setBeverageModalOpen(true);
      } else if (section === 'events') {
        setFoodMenuOpen(false);
        setBeverageModalOpen(false);
        setEventsModalOpen(true);
      }
    },
    [handleSelectTable],
  );

  const handlePinAction = useCallback(
    (pin: SpatialPinAnchor) => {
      if (pin.actionType === 'table' && pin.targetId) {
        handleSelectTable(pin.targetId);
      } else if (pin.actionType === 'view' && pin.targetId) {
        setActiveViewId(pin.targetId as CafeViewId);
      } else if (pin.actionType === 'playlist') {
        setPlaylistOpen(true);
      } else if (pin.actionType === 'events') {
        setEventsModalOpen(true);
      } else if (pin.actionType === 'beverage') {
        setActiveViewId('counter');
        setBeverageModalOpen(true);
      }
    },
    [handleSelectTable],
  );

  const handleConfirmBooking = useCallback(
    (params: {
      tableId: string;
      slotId: string;
      guestName: string;
      guestEmail: string;
      partySize: number;
    }) => {
      setTables((prev) =>
        prev.map((t) =>
          t.id === params.tableId
            ? {
                ...t,
                slots: t.slots.map((s) =>
                  s.id === params.slotId
                    ? { ...s, available: false, bookedBy: params.guestName }
                    : s,
                ),
              }
            : t,
        ),
      );
    },
    [],
  );

  const handleToggleRsvp = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const nextRsvp = !ev.rsvped;
        return {
          ...ev,
          rsvped: nextRsvp,
          attendees: Math.max(0, ev.attendees + (nextRsvp ? 1 : -1)),
        };
      }),
    );
  }, []);

  const handleTogglePlayAudio = useCallback(() => {
    const track = PLAYLIST_TRACKS[trackIndex] ?? PLAYLIST_TRACKS[0];
    setIsPlayingAudio((prev) => {
      const next = !prev;
      if (next) {
        cafeAudio.setVolume(audioVolume);
        cafeAudio.start(track);
      } else {
        cafeAudio.stop();
      }
      return next;
    });
  }, [trackIndex, audioVolume]);

  const handleStepTrack = useCallback(
    (dir: -1 | 1) => {
      const nextIdx = (trackIndex + dir + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
      setTrackIndex(nextIdx);
      const nextTrack = PLAYLIST_TRACKS[nextIdx];
      cafeAudio.switchTrack(nextTrack, isPlayingAudio);
    },
    [trackIndex, isPlayingAudio],
  );

  const handleVolumeChange = useCallback((val: number) => {
    setAudioVolume(val);
    cafeAudio.setVolume(val);
  }, []);

  const appState = foodMenuOpen
    ? 'food-menu'
    : beverageModalOpen
      ? 'beverage'
      : eventsModalOpen
        ? 'events'
        : bookingDrawerOpen
          ? 'booking'
          : 'overview';

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden bg-[#F6F3EC] text-[#1E241E]"
      data-app-state={appState}
    >
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onBookTable={() => handleSelectTable(selectedTableId ?? 'table-7')}
      />

      {/* Mobile Compact Quick Navigation */}
      <nav
        aria-label="Mobile quick sections"
        className="flex md:hidden items-center justify-around border-b border-[#2C3E2D]/12 bg-[#EFECE3] px-1.5 py-1.5 text-[11px] font-medium text-[#2C3E2D] shrink-0"
      >
        <button
          type="button"
          onClick={() => handleNavigate('home')}
          className="px-1.5 py-1 whitespace-nowrap"
        >
          Cafe
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('seating')}
          className="px-1.5 py-1 whitespace-nowrap"
        >
          Seating
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('food')}
          className="px-1.5 py-1 whitespace-nowrap font-semibold"
        >
          Food Menu
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('menu')}
          className="px-1.5 py-1 whitespace-nowrap"
        >
          Drinks
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('events')}
          className="px-1.5 py-1 whitespace-nowrap"
        >
          Events
        </button>
      </nav>

      {/* Interactive Real-Time Photorealistic Cafe Stage + Overlays */}
      <main className="relative flex-1 min-h-0 overflow-hidden">
        <CafePhotoStage
          activeViewId={activeViewId}
          tables={tables}
          selectedTableId={selectedTableId}
          pinsVisible={pinsVisible}
          drawerOpen={bookingDrawerOpen}
          onTogglePins={() => setPinsVisible((v) => !v)}
          onSelectTable={handleSelectTable}
          onPinAction={handlePinAction}
          onSelectView={setActiveViewId}
        />

        <PlaylistWidget
          isOpen={playlistOpen}
          isPlaying={isPlayingAudio}
          trackIndex={trackIndex}
          volume={audioVolume}
          onClose={() => setPlaylistOpen(false)}
          onTogglePlay={handleTogglePlayAudio}
          onPrevTrack={() => handleStepTrack(-1)}
          onNextTrack={() => handleStepTrack(1)}
          onVolumeChange={handleVolumeChange}
        />

        <WorkspaceTourHud
          openCapacityPercent={openCapacityPercent}
          activeViewId={activeViewId}
          collapsed={hudCollapsed}
          onToggleCollapse={() => setHudCollapsed((c) => !c)}
          onSelectView={setActiveViewId}
          onOpenSeating={() => handleSelectTable(selectedTableId ?? 'table-7')}
        />

        <TableBookingDrawer
          isOpen={bookingDrawerOpen}
          tables={tables}
          selectedTableId={selectedTableId}
          attachedOrder={attachedOrder}
          attachedMeals={attachedMeals}
          onClose={() => {
            setBookingDrawerOpen(false);
            setSelectedTableId(null);
            setActiveSection('home');
          }}
          onSelectTable={handleSelectTable}
          onUpdateTableCustomization={handleUpdateTableCustomization}
          onOpenBeverageBuilder={() => setBeverageModalOpen(true)}
          onOpenFoodMenu={() => setFoodMenuOpen(true)}
          onClearAttachedOrder={() => setAttachedOrder(null)}
          onRemoveMeal={(index) =>
            setAttachedMeals((prev) => prev.filter((_, i) => i !== index))
          }
          onConfirmBooking={handleConfirmBooking}
        />
      </main>

      <FooterBar />

      <FoodMenuModal
        isOpen={foodMenuOpen}
        activePeriod={activeMealPeriod}
        attachedMeals={attachedMeals}
        onChangePeriod={setActiveMealPeriod}
        onAddMeal={(meal) => setAttachedMeals((prev) => [...prev, meal])}
        onRemoveMeal={(index) =>
          setAttachedMeals((prev) => prev.filter((_, i) => i !== index))
        }
        onOpenBookingDrawer={() => {
          setFoodMenuOpen(false);
          handleSelectTable(selectedTableId ?? 'table-7');
        }}
        onClose={() => {
          setFoodMenuOpen(false);
          if (!bookingDrawerOpen) setActiveSection('home');
        }}
      />

      <BeverageBuilderModal
        isOpen={beverageModalOpen}
        beverage={beverage}
        attachedOrder={attachedOrder}
        onChangeBeverage={setBeverage}
        onAttachOrder={(item) => setAttachedOrder(item)}
        onOpenFoodMenu={() => {
          setBeverageModalOpen(false);
          setFoodMenuOpen(true);
          setActiveSection('food');
        }}
        onClose={() => {
          setBeverageModalOpen(false);
          if (!bookingDrawerOpen) setActiveSection('home');
        }}
      />

      <EventsModal
        isOpen={eventsModalOpen}
        events={events}
        onToggleRsvp={handleToggleRsvp}
        onClose={() => {
          setEventsModalOpen(false);
          if (!bookingDrawerOpen) setActiveSection('home');
        }}
      />
    </div>
  );
}
