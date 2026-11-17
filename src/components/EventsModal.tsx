import React from 'react';
import { Calendar, Check, MapPin, Users, X } from 'lucide-react';
import { CommunityEvent } from '../data/cafeData';

interface EventsModalProps {
  isOpen: boolean;
  events: CommunityEvent[];
  onToggleRsvp: (eventId: string) => void;
  onClose: () => void;
}

export const EventsModal: React.FC<EventsModalProps> = ({
  isOpen,
  events,
  onToggleRsvp,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Community events and RSVP"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#1E241E]/60"
    >
      <div className="w-full max-w-xl rounded-2xl bg-[#F6F3EC] border border-[#2C3E2D]/20 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2C3E2D]/12 bg-[#EFECE3] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#2C3E2D]">Community Pinboard</p>
            <h2 className="font-serif-display text-2xl font-semibold text-[#1E241E]">
              Upcoming Cafe Gatherings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close events modal"
            className="p-2 rounded-lg text-[#2C3E2D] hover:bg-[#DCE3D6] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto cafe-scroll">
          {events.map((ev) => {
            const spotsLeft = Math.max(0, ev.capacity - ev.attendees);
            return (
              <article
                key={ev.id}
                className="p-4 rounded-xl bg-white border border-[#2C3E2D]/15 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif-display text-lg font-semibold text-[#1E241E]">
                      {ev.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#2C3E2D] mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C88A4B]" />
                        <span>{ev.schedule}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C88A4B]" />
                        <span>{ev.spot}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleRsvp(ev.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 ${
                      ev.rsvped
                        ? 'bg-[#2C3E2D] text-[#F6F3EC]'
                        : 'bg-[#C88A4B] hover:bg-[#b5793c] text-[#1E241E]'
                    }`}
                  >
                    {ev.rsvped && <Check className="w-3.5 h-3.5" />}
                    <span>{ev.rsvped ? 'Going' : 'One-Click RSVP'}</span>
                  </button>
                </div>

                <p className="text-xs text-[#1E241E]/80 leading-relaxed">{ev.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#2C3E2D]/10 text-xs text-[#2C3E2D] font-mono-tabular">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {ev.attendees} / {ev.capacity} Attending
                    </span>
                  </span>
                  <span>{spotsLeft} spots remaining</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
