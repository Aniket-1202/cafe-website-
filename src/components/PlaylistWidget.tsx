import React from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { PLAYLIST_TRACKS } from '../data/cafeData';

interface PlaylistWidgetProps {
  isOpen: boolean;
  isPlaying: boolean;
  trackIndex: number;
  volume: number;
  onClose: () => void;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onVolumeChange: (val: number) => void;
}

export const PlaylistWidget: React.FC<PlaylistWidgetProps> = ({
  isOpen,
  isPlaying,
  trackIndex,
  volume,
  onClose,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onVolumeChange,
}) => {
  if (!isOpen) return null;

  const track = PLAYLIST_TRACKS[trackIndex] ?? PLAYLIST_TRACKS[0];

  return (
    <aside
      aria-label="Live cafe playlist controller"
      className="absolute top-3 left-3 md:top-4 md:left-1/2 md:-translate-x-1/2 z-20 w-[calc(100vw-24px)] max-w-sm rounded-xl bg-[#2C3E2D] text-[#F6F3EC] border border-[#C88A4B]/40 shadow-xl p-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#DCE3D6]">
            In-Cafe Audio · {isPlaying ? 'Playing' : 'Paused'}
          </p>
          <h3 className="font-serif-display text-base font-semibold text-[#F6F3EC] truncate">
            {track.title}
          </h3>
          <p className="text-xs text-[#DCE3D6]/85 truncate">
            {track.artist} · {track.mood}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close playlist controller"
          className="p-1.5 rounded-lg text-[#DCE3D6] hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 pt-2.5 border-t border-white/15">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevTrack}
            aria-label="Previous track"
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="w-9 h-9 rounded-lg bg-[#C88A4B] hover:bg-[#b5793c] text-[#1E241E] flex items-center justify-center cursor-pointer transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={onNextTrack}
            aria-label="Next track"
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-[#DCE3D6]">
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
          <span className="sr-only">Audio volume</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            className="w-20 accent-[#C88A4B] cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
};
