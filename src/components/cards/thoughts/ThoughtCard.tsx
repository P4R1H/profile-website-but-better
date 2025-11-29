"use client";

import { ThoughtItem } from "./ThoughtsExpanded";
import { MessageCircle, Repeat2, Heart, Bookmark, Share, Pin } from "lucide-react";
import { memo, useState } from "react";

interface ThoughtCardProps {
  thought: ThoughtItem;
  onClick?: () => void;
}

// Shared utility
export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

// Icon wrapper with hover background
const IconWrapper = ({ children, hoverBg }: { children: React.ReactNode; hoverBg: string }) => (
  <div className={`w-[34.75px] h-[34.75px] flex items-center justify-center rounded-full transition-colors -mr-1 ${hoverBg}`}>
    {children}
  </div>
);

export const ThoughtCard = memo(({ thought, onClick }: ThoughtCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [localLikes, setLocalLikes] = useState(thought.likes || 0);
  const [localRetweets, setLocalRetweets] = useState(thought.retweets || 0);

  const isBlog = thought.tags?.includes("blog");

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <article 
      onClick={onClick}
      className={`border-b border-[#2F3336] transition-colors ${onClick ? 'hover:bg-[#080808] cursor-pointer' : ''}`}
    >
      <div className="flex gap-3 px-4 pt-3 pb-1">
        <img 
          src="https://avatars.githubusercontent.com/u/76397616?v=4"
          alt="Parth"
          className="w-12 h-12 rounded-full shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 text-[15px] leading-5 mb-0.5">
            <span className="font-bold text-[#E7E9EA] hover:underline cursor-pointer">Parth</span>
            <span className="text-[#71767B]">@parthg</span>
            <span className="text-[#71767B]">·</span>
            <span className="text-[#71767B] hover:underline cursor-pointer">{thought.date}</span>
            {thought.isPinned && (
              <>
                <span className="text-[#71767B]">·</span>
                <Pin className="w-3.5 h-3.5 text-[#71767B]" />
              </>
            )}
          </div>

          {/* Blog Title */}
          {thought.title && isBlog && (
            <div className="text-[15px] leading-5 font-bold text-[#E7E9EA] mt-1 mb-1">
              {thought.title}
            </div>
          )}

          {/* Content Body */}
          <div className="relative mt-1">
            <div className={`font-normal text-[#E7E9EA] whitespace-pre-wrap wrap-break-word ${
              isBlog ? "text-[15px] leading-5" : "text-[17px] leading-[22px]"
            }`}>
              {isBlog ? thought.content.split('\n').slice(0, 3).join('\n') : thought.content}
            </div>
            {isBlog && thought.content.split('\n').length > 3 && (
              <div className="absolute -bottom-3 left-0 right-0 h-10 bg-linear-to-t from-black via-black/50 to-transparent pointer-events-none" />
            )}
          </div>

          {/* Image */}
          {thought.image && (
            <div className="mt-3 mb-3 rounded-2xl overflow-hidden border border-[#2F3336]">
              <img src={thought.image} alt={thought.title} className="w-full h-auto" loading="lazy" />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between max-w-[425px] mt-3 mb-1 -ml-2">
            {/* Reply */}
            <button 
              className="flex items-center text-[#71767B] hover:text-[#1D9BF0] group transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Reply"
            >
              <IconWrapper hoverBg="group-hover:bg-[#1D9BF0]/10">
                <MessageCircle className="w-[18.75px] h-[18.75px]" strokeWidth={2} />
              </IconWrapper>
              {(thought.replies ?? 0) > 0 && (
                <span className="text-[13px] tabular-nums">{formatNumber(thought.replies!)}</span>
              )}
            </button>

            {/* Retweet */}
            <button 
              className={`flex items-center group transition-colors ${
                isRetweeted ? 'text-[#00BA7C]' : 'text-[#71767B] hover:text-[#00BA7C]'
              }`}
              onClick={(e) => handleAction(e, () => {
                setIsRetweeted(!isRetweeted);
                setLocalRetweets(prev => isRetweeted ? prev - 1 : prev + 1);
              })}
              aria-label="Retweet"
            >
              <IconWrapper hoverBg="group-hover:bg-[#00BA7C]/10">
                <Repeat2 className="w-[18.75px] h-[18.75px]" strokeWidth={2} />
              </IconWrapper>
              {localRetweets > 0 && (
                <span className="text-[13px] tabular-nums">{formatNumber(localRetweets)}</span>
              )}
            </button>

            {/* Like */}
            <button 
              className={`flex items-center group transition-colors ${
                isLiked ? 'text-[#F91880]' : 'text-[#71767B] hover:text-[#F91880]'
              }`}
              onClick={(e) => handleAction(e, () => {
                setIsLiked(!isLiked);
                setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
              })}
              aria-label="Like"
            >
              <IconWrapper hoverBg="group-hover:bg-[#F91880]/10">
                <Heart className={`w-[18.75px] h-[18.75px] ${isLiked ? 'fill-current' : ''}`} strokeWidth={2} />
              </IconWrapper>
              {localLikes > 0 && (
                <span className="text-[13px] tabular-nums">{formatNumber(localLikes)}</span>
              )}
            </button>

            {/* Bookmark */}
            <button 
              className={`flex items-center group transition-colors ${
                isBookmarked ? 'text-[#1D9BF0]' : 'text-[#71767B] hover:text-[#1D9BF0]'
              }`}
              onClick={(e) => handleAction(e, () => setIsBookmarked(!isBookmarked))}
              aria-label="Bookmark"
            >
              <IconWrapper hoverBg="group-hover:bg-[#1D9BF0]/10">
                <Bookmark className={`w-[18.75px] h-[18.75px] ${isBookmarked ? 'fill-current' : ''}`} strokeWidth={2} />
              </IconWrapper>
            </button>

            {/* Share */}
            <button 
              className="flex items-center text-[#71767B] hover:text-[#1D9BF0] group transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Share"
            >
              <IconWrapper hoverBg="group-hover:bg-[#1D9BF0]/10">
                <Share className="w-[18.75px] h-[18.75px]" strokeWidth={2} />
              </IconWrapper>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

ThoughtCard.displayName = "ThoughtCard";
