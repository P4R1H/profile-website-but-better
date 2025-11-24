"use client";

import { useState, useRef, useEffect } from "react";
import { ThoughtCard } from "./ThoughtCard";
import { ThoughtDetail } from "./ThoughtDetail";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";

export interface ThoughtItem {
  id: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
  tags?: string[];
  image?: string;
  isPinned?: boolean;
  likes?: number;
  retweets?: number;
  replies?: number;
  bookmarks?: number;
}

export interface PremiumContent {
  title: string;
  description: string;
  buttonText: string;
}

export interface NewsItem {
  category: string;
  title: string;
  subtitle?: string;
  time: string;
  posts: string;
}

export interface TrendingTopic {
  tag: string;
  category: string;
  posts: string;
}

export interface PersonToFollow {
  name: string;
  handle: string;
  avatar: string;
}

interface ThoughtsExpandedProps {
  onClose: () => void;
  thoughts: ThoughtItem[];
  premiumContent: PremiumContent;
  newsItems: NewsItem[];
  trendingTopics: TrendingTopic[];
  peopleToFollow: PersonToFollow[];
}

export const ThoughtsExpanded = ({ 
  onClose, 
  thoughts,
  premiumContent,
  newsItems,
  trendingTopics,
  peopleToFollow
}: ThoughtsExpandedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBottomBlur, setShowBottomBlur] = useState(false);
  const [selectedThought, setSelectedThought] = useState<ThoughtItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"thoughts" | "blogs">("thoughts");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowBottomBlur(scrollHeight - scrollTop - clientHeight > 10);
    
    // Detect scroll direction for mobile nav hiding (only if scrolled past threshold)
    if (scrollTop > 50) {
      const isScrollingDown = scrollTop > lastScrollTop.current;
      setIsScrolled(isScrollingDown);
    } else {
      setIsScrolled(false);
    }
    lastScrollTop.current = scrollTop;
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [thoughts, selectedThought]);

  // Filter thoughts
  const filteredThoughts = thoughts.filter((thought) => {
    const matchesSearch = searchQuery === "" || 
      thought.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thought.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      (thought.tags && thought.tags.some(tag => selectedTags.includes(tag)));
    
    const matchesTab = activeTab === "thoughts" || 
      (activeTab === "blogs" && thought.tags && thought.tags.includes("blog"));
    
    return matchesSearch && matchesTags && matchesTab;
  });

  // Separate pinned and regular thoughts
  const pinnedThoughts = filteredThoughts.filter(t => t.isPinned);
  const regularThoughts = filteredThoughts.filter(t => !t.isPinned);
  
  // Combine: pinned first, then chronological (reverse)
  const sortedThoughts = [...pinnedThoughts, ...regularThoughts];
  const visibleThoughts = sortedThoughts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedThoughts.length;

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-black via-black/90 to-transparent z-10 pointer-events-none" />

      {/* 3-Column Layout */}
      <div className="h-full flex max-w-[1300px] mx-auto">
        
        {/* Left Sidebar - Nav */}
        <LeftSidebar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={Array.from(new Set(thoughts.flatMap(t => t.tags || [])))}
        />

        {/* Center Feed */}
        <div className="flex-1 min-w-0 border-x border-zinc-900">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto scrollbar-hide"
          >
            {/* Feed Header - Tabs */}
            <div className={`sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-900 z-20 transition-transform duration-300 ${isScrolled ? '-translate-y-full xl:translate-y-0' : 'translate-y-0'}`}>
              <div className="flex">
                <button
                  onClick={() => setActiveTab("thoughts")}
                  className={`flex-1 py-4 text-[15px] font-semibold transition-colors relative ${
                    activeTab === "thoughts" 
                      ? "text-zinc-100" 
                      : "text-zinc-500 hover:bg-zinc-900/50"
                  }`}
                >
                  Thoughts
                  {activeTab === "thoughts" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("blogs")}
                  className={`flex-1 py-4 text-[15px] font-semibold transition-colors relative ${
                    activeTab === "blogs" 
                      ? "text-zinc-100" 
                      : "text-zinc-500 hover:bg-zinc-900/50"
                  }`}
                >
                  Blogs
                  {activeTab === "blogs" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Thoughts Feed */}
            <div>
              {visibleThoughts.map((thought) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  onClick={() => setSelectedThought(thought)}
                />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="border-t border-zinc-900 p-4">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    className="w-full py-3 text-sm text-blue-500 hover:bg-zinc-950 transition-colors rounded-full font-medium"
                  >
                    Load more thoughts
                  </button>
                </div>
              )}

              {/* Empty State */}
              {visibleThoughts.length === 0 && (
                <div className="p-12 text-center text-zinc-600">
                  <p>No thoughts found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Gradient */}
          {showBottomBlur && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Right Sidebar - Widgets */}
        <RightSidebar 
          premiumContent={premiumContent}
          newsItems={newsItems}
          trendingTopics={trendingTopics}
          peopleToFollow={peopleToFollow}
        />
      </div>

      {/* Thought Detail Overlay */}
      {selectedThought && (
        <ThoughtDetail 
          thought={selectedThought}
          onClose={() => setSelectedThought(null)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <div className={`xl:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 z-30 transition-transform duration-300 ${isScrolled ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="flex items-center justify-around py-3 px-4">
          <button className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full transition-colors" aria-label="Home">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L3 9v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9l-9-7zm0 2.8l6 4.8V19h-3v-6H9v6H6V9.6l6-4.8z"/>
            </svg>
          </button>
          <button 
            onClick={() => setShowMobileSearch(true)}
            className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full transition-colors"
            aria-label="Search"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          <div className="p-2" aria-label="Profile">
            <img src="/social/pglogo.png" alt="PG" className="w-7 h-7" />
          </div>
          <button className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full transition-colors" aria-label="Notifications">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            </svg>
          </button>
          <button className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full transition-colors" aria-label="Messages">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="xl:hidden fixed inset-0 bg-black z-50 flex flex-col">
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-zinc-900">
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
              aria-label="Close search"
            >
              <svg className="w-6 h-6 text-zinc-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder="Search thoughts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-3 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery ? (
              <>
                {filteredThoughts.length > 0 ? (
                  <div>
                    {filteredThoughts.slice(0, 20).map((thought) => (
                      <ThoughtCard
                        key={thought.id}
                        thought={thought}
                        onClick={() => {
                          setSelectedThought(thought);
                          setShowMobileSearch(false);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-zinc-600">
                    <p>No thoughts found for "{searchQuery}"</p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8">
                <h3 className="text-zinc-400 text-sm font-semibold mb-4">Recent searches</h3>
                <div className="text-center text-zinc-600 py-8">
                  <p>Try searching for topics, keywords, or phrases</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
