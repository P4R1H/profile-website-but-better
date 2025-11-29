"use client";

import { motion } from "framer-motion";
import { ThoughtItem } from "./ThoughtsExpanded";
import { X, MessageCircle, Repeat2, Heart, Bookmark, Share } from "lucide-react";
import { useEffect, useCallback } from "react";

interface ThoughtDetailProps {
  thought: ThoughtItem;
  onClose: () => void;
}

export const ThoughtDetail = ({ thought, onClose }: ThoughtDetailProps) => {
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto scrollbar-hide"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[600px] bg-black border border-zinc-800 rounded-2xl my-8 mx-4 max-h-[85vh] overflow-y-auto scrollbar-hide"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900">
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-100" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          {/* Profile */}
          <div className="flex items-start gap-3 mb-3">
            <img 
              src="https://avatars.githubusercontent.com/u/76397616?v=4"
              alt="Parth"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-bold text-zinc-100">Parth</div>
              <div className="text-zinc-600 text-sm">@parthg</div>
            </div>
          </div>

          {/* Title (for blogs) */}
          {thought.title && thought.tags?.includes("blog") && (
            <div className="font-bold text-zinc-100 text-[23px] leading-tight mb-4">
              {thought.title}
            </div>
          )}

          {/* Thought Text */}
          <div className="text-zinc-100 text-[17px] leading-relaxed whitespace-pre-wrap mb-4">
            {thought.content}
          </div>

          {/* Image */}
          {thought.image && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-zinc-800">
              <img 
                src={thought.image}
                alt={thought.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Timestamp & Metrics */}
          <div className="text-zinc-600 text-sm py-3 border-y border-zinc-900">
            <span>{thought.date}</span>
            <span className="mx-2">·</span>
            <span>{thought.readTime} read</span>
          </div>

          {/* Engagement Stats */}
          {(thought.replies || thought.retweets || thought.likes || thought.bookmarks) && (
            <div className="flex gap-4 py-3 border-b border-zinc-900 text-sm">
              {thought.retweets && thought.retweets > 0 && (
                <div>
                  <span className="font-bold text-zinc-100">{thought.retweets}</span>
                  <span className="text-zinc-600 ml-1">Retweets</span>
                </div>
              )}
              {thought.likes && thought.likes > 0 && (
                <div>
                  <span className="font-bold text-zinc-100">{thought.likes}</span>
                  <span className="text-zinc-600 ml-1">Likes</span>
                </div>
              )}
              {thought.bookmarks && thought.bookmarks > 0 && (
                <div>
                  <span className="font-bold text-zinc-100">{thought.bookmarks}</span>
                  <span className="text-zinc-600 ml-1">Bookmarks</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-around py-2 border-b border-zinc-900">
            <button className="flex items-center gap-2 text-zinc-600 hover:text-blue-500 transition-colors p-2">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 text-zinc-600 hover:text-green-500 transition-colors p-2">
              <Repeat2 className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 text-zinc-600 hover:text-red-500 transition-colors p-2">
              <Heart className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 text-zinc-600 hover:text-blue-500 transition-colors p-2">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 text-zinc-600 hover:text-blue-500 transition-colors p-2">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
