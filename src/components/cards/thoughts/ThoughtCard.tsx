"use client";

import { ThoughtItem } from "./ThoughtsExpanded";
import { MessageCircle, Repeat2, Heart, Bookmark, Share, Pin } from "lucide-react";
import { memo } from "react";

interface ThoughtCardProps {
  thought: ThoughtItem;
  onClick: () => void;
}

const formatTimestamp = (date: string) => date;

export const ThoughtCard = memo(({ thought, onClick }: ThoughtCardProps) => {

  return (
    <article 
      onClick={onClick}
      className="border-b border-zinc-900 px-4 py-3 hover:bg-zinc-950 transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <img 
          src="https://avatars.githubusercontent.com/u/76397616?v=4"
          alt="Parth G"
          className="w-10 h-10 rounded-full shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-zinc-100 hover:underline">Parth G</span>
            <span className="text-zinc-600 text-sm">@parthg</span>
            <span className="text-zinc-600 text-sm">·</span>
            <span className="text-zinc-600 text-sm hover:underline">{formatTimestamp(thought.date)}</span>
            
            {thought.isPinned && (
              <>
                <span className="text-zinc-600 text-sm">·</span>
                <Pin className="w-3 h-3 text-zinc-600" />
              </>
            )}
          </div>

          {/* Thought Content */}
          <div className="text-zinc-100 text-[15px] leading-normal whitespace-pre-wrap mb-3">
            {thought.content}
          </div>

          {/* Image */}
          {thought.image && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-zinc-800">
              <img 
                src={thought.image}
                alt={thought.title}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between max-w-md mt-2">
            <button 
              className="flex items-center gap-2 text-zinc-600 hover:text-blue-500 group transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Reply"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle className="w-[18px] h-[18px]" />
              </div>
              {thought.replies && thought.replies > 0 && (
                <span className="text-sm">{thought.replies}</span>
              )}
            </button>

            <button 
              className="flex items-center gap-2 text-zinc-600 hover:text-green-500 group transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Retweet"
            >
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Repeat2 className="w-[18px] h-[18px]" />
              </div>
              {thought.retweets && thought.retweets > 0 && (
                <span className="text-sm">{thought.retweets}</span>
              )}
            </button>

            <button 
              className="flex items-center gap-2 text-zinc-600 hover:text-red-500 group transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Like"
            >
              <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                <Heart className="w-[18px] h-[18px]" />
              </div>
              {thought.likes && thought.likes > 0 && (
                <span className="text-sm">{thought.likes}</span>
              )}
            </button>

            <button 
              className="flex items-center gap-2 text-zinc-600 hover:text-blue-500 group transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Bookmark"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <Bookmark className="w-[18px] h-[18px]" />
              </div>
            </button>

            <button 
              className="flex items-center gap-2 text-zinc-600 hover:text-blue-500 group transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Share"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <Share className="w-[18px] h-[18px]" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
