"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ThoughtCard, formatNumber } from "./ThoughtCard";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { MessageCircle, Repeat2, Heart, Bookmark, Share, X } from "lucide-react";

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
  initialThoughtId?: string;  // For deep linking to a specific thought
  onNavigateToThought?: (thoughtId: string | null) => void; // Update URL when selecting a thought
}

// Reusable SVG icons
const Icons = {
  home: <path d="M12 2L3 9v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9l-9-7zm0 2.8l6 4.8V19h-3v-6H9v6H6V9.6l6-4.8z"/>,
  search: <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
  notifications: <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>,
  messages: <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>,
  close: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>,
};

const SvgIcon = ({ path, className = "w-6 h-6" }: { path: React.ReactNode; className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">{path}</svg>
);

export const ThoughtsExpanded = ({ 
  onClose, 
  thoughts,
  premiumContent,
  newsItems,
  trendingTopics,
  peopleToFollow,
  initialThoughtId,
  onNavigateToThought,
}: ThoughtsExpandedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  
  // Initialize with deep-linked thought if provided
  const initialThought = initialThoughtId 
    ? thoughts.find(t => t.id === initialThoughtId) || null 
    : null;
  
  // UI State
  const [selectedThought, setSelectedThought] = useState<ThoughtItem | null>(initialThought);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"thoughts" | "blogs">(
    initialThought?.tags?.includes("blog") ? "blogs" : "thoughts"
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Handle thought selection with URL update
  const handleSelectThought = (thought: ThoughtItem | null) => {
    setSelectedThought(thought);
    onNavigateToThought?.(thought?.id || null);
  };
  
  // Interaction state for detail view
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const [localRetweets, setLocalRetweets] = useState(0);
  const [localBookmarks, setLocalBookmarks] = useState(0);

  // Reset interaction state when thought changes
  useEffect(() => {
    if (selectedThought) {
      setIsLiked(false);
      setIsRetweeted(false);
      setIsBookmarked(false);
      setLocalLikes(selectedThought.likes || 0);
      setLocalRetweets(selectedThought.retweets || 0);
      setLocalBookmarks(selectedThought.bookmarks || 0);
    }
  }, [selectedThought?.id]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop } = scrollRef.current;
    
    if (scrollTop > 50) {
      setIsScrolled(scrollTop > lastScrollTop.current);
    } else {
      setIsScrolled(false);
    }
    lastScrollTop.current = scrollTop;
  };

  // Filter and sort thoughts (memoized)
  const { visibleThoughts, hasMore, allTags } = useMemo(() => {
    const filtered = thoughts.filter((thought) => {
      const matchesSearch = !searchQuery || 
        thought.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thought.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        thought.tags?.some(tag => selectedTags.includes(tag));
      
      const matchesTab = activeTab === "thoughts" 
        ? !thought.tags?.includes("blog")
        : thought.tags?.includes("blog");
      
      return matchesSearch && matchesTags && matchesTab;
    });

    const pinned = filtered.filter(t => t.isPinned);
    const regular = filtered.filter(t => !t.isPinned);
    const sorted = [...pinned, ...regular];

    return {
      visibleThoughts: sorted.slice(0, visibleCount),
      hasMore: visibleCount < sorted.length,
      allTags: Array.from(new Set(thoughts.flatMap(t => t.tags || [])))
    };
  }, [thoughts, searchQuery, selectedTags, activeTab, visibleCount]);

  // Tab button component
  const TabButton = ({ tab, label }: { tab: "thoughts" | "blogs"; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        handleSelectThought(null); // Close any open thought when switching tabs
      }}
      className={`flex-1 py-4 text-[15px] font-semibold transition-colors relative ${
        activeTab === tab ? "text-zinc-100" : "text-zinc-500 hover:bg-zinc-900/50"
      }`}
    >
      {label}
      {activeTab === tab && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
      )}
    </button>
  );

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-black via-black/90 to-transparent z-10 pointer-events-none" />

      {/* 3-Column Layout */}
      <div className="h-full flex max-w-[1300px] mx-auto">
        
        <LeftSidebar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={allTags}
        />

        {/* Center Feed */}
        <div className="flex-1 min-w-0 border-x border-zinc-900">
          <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto scrollbar-hide">
            {/* Tabs */}
            <div className={`sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-900 z-20 transition-transform duration-300 ${isScrolled ? '-translate-y-full xl:translate-y-0' : ''}`}>
              <div className="flex">
                <TabButton tab="thoughts" label="Thoughts" />
                <TabButton tab="blogs" label="Blogs" />
              </div>
            </div>

            {/* Content */}
            {selectedThought ? (
              <div className="px-4 py-3 border-b border-zinc-900">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <img src="https://avatars.githubusercontent.com/u/76397616?v=4" alt="Parth" className="w-12 h-12 rounded-full" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-zinc-100">Parth</div>
                      <div className="text-zinc-600 text-sm">@parthg</div>
                    </div>
                    <button onClick={() => handleSelectThought(null)} className="text-zinc-500 hover:text-zinc-100 p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                {selectedThought.title && selectedThought.tags?.includes("blog") && (
                  <div className="font-bold text-zinc-100 text-[23px] leading-tight mb-4">
                    {selectedThought.title}
                  </div>
                )}

                {/* Content */}
                <div className="text-zinc-100 text-[17px] leading-relaxed whitespace-pre-wrap mb-4">
                  {selectedThought.content}
                </div>

                {/* Image */}
                {selectedThought.image && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-zinc-800">
                    <img src={selectedThought.image} alt={selectedThought.title} className="w-full object-cover" />
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-zinc-600 text-sm py-3 border-y border-zinc-900">
                  {selectedThought.date} · {selectedThought.readTime} read
                </div>

                {/* Stats */}
                {(localRetweets > 0 || localLikes > 0 || localBookmarks > 0) && (
                  <div className="flex gap-4 py-3 border-b border-zinc-900 text-sm">
                    {localRetweets > 0 && (
                      <div><span className="font-bold text-zinc-100">{formatNumber(localRetweets)}</span> <span className="text-zinc-600">Retweets</span></div>
                    )}
                    {localLikes > 0 && (
                      <div><span className="font-bold text-zinc-100">{formatNumber(localLikes)}</span> <span className="text-zinc-600">Likes</span></div>
                    )}
                    {localBookmarks > 0 && (
                      <div><span className="font-bold text-zinc-100">{formatNumber(localBookmarks)}</span> <span className="text-zinc-600">Bookmarks</span></div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-around py-2 border-b border-zinc-900">
                  <button className="p-2 text-zinc-600 hover:text-blue-500"><MessageCircle className="w-5 h-5" /></button>
                  <button 
                    onClick={() => { setIsRetweeted(!isRetweeted); setLocalRetweets(p => isRetweeted ? p - 1 : p + 1); }}
                    className={`p-2 ${isRetweeted ? 'text-green-500' : 'text-zinc-600 hover:text-green-500'}`}
                  >
                    <Repeat2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => { setIsLiked(!isLiked); setLocalLikes(p => isLiked ? p - 1 : p + 1); }}
                    className={`p-2 ${isLiked ? 'text-pink-600' : 'text-zinc-600 hover:text-pink-600'}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => { setIsBookmarked(!isBookmarked); setLocalBookmarks(p => isBookmarked ? p - 1 : p + 1); }}
                    className={`p-2 ${isBookmarked ? 'text-blue-500' : 'text-zinc-600 hover:text-blue-500'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 text-zinc-600 hover:text-blue-500"><Share className="w-5 h-5" /></button>
                </div>
              </div>
            ) : (
              <div>
                {visibleThoughts.map((thought) => {
                  const isExpandable = thought.tags?.includes("blog");
                  return (
                    <ThoughtCard 
                      key={thought.id} 
                      thought={thought} 
                      onClick={isExpandable ? () => handleSelectThought(thought) : undefined} 
                    />
                  );
                })}

                {hasMore && (
                  <div className="border-t border-zinc-900 p-4">
                    <button onClick={() => setVisibleCount(p => p + 10)} className="w-full py-3 text-sm text-blue-500 hover:bg-zinc-950 rounded-full font-medium">
                      Load more thoughts
                    </button>
                  </div>
                )}

                {visibleThoughts.length === 0 && (
                  <div className="p-12 text-center text-zinc-600">No thoughts found.</div>
                )}
              </div>
            )}
          </div>
        </div>

        <RightSidebar premiumContent={premiumContent} newsItems={newsItems} trendingTopics={trendingTopics} peopleToFollow={peopleToFollow} />
      </div>

      {/* Mobile Bottom Nav */}
      <div className={`xl:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 z-30 transition-transform duration-300 ${isScrolled ? 'translate-y-full' : ''}`}>
        <div className="flex items-center justify-around py-3 px-4">
          <button className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full"><SvgIcon path={Icons.home} /></button>
          <button onClick={() => setShowMobileSearch(true)} className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full"><SvgIcon path={Icons.search} /></button>
          <img src="/social/pglogo.png" alt="PG" className="w-7 h-7" />
          <button className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full"><SvgIcon path={Icons.notifications} /></button>
          <button className="p-2 text-zinc-100 hover:bg-zinc-900 rounded-full"><SvgIcon path={Icons.messages} /></button>
        </div>
      </div>

      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="xl:hidden fixed inset-x-0 bottom-0 bg-black z-50 flex flex-col rounded-t-2xl" style={{height: 'calc(100vh - 60px)'}}>
          <div className="flex items-center gap-3 p-4 border-b border-zinc-900">
            <button onClick={() => setShowMobileSearch(false)} className="p-2 hover:bg-zinc-900 rounded-full">
              <SvgIcon path={Icons.close} className="w-6 h-6 text-zinc-100" />
            </button>
            <div className="flex-1 relative">
              <SvgIcon path={Icons.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type="text"
                placeholder="Search thoughts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-3 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded-full">
                  <SvgIcon path={Icons.close} className="w-5 h-5 text-zinc-600" />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {searchQuery ? (
              visibleThoughts.length > 0 ? (
                visibleThoughts.slice(0, 20).map((thought) => {
                  const isExpandable = thought.tags?.includes("blog");
                  return (
                    <ThoughtCard 
                      key={thought.id} 
                      thought={thought} 
                      onClick={isExpandable ? () => { handleSelectThought(thought); setShowMobileSearch(false); } : undefined} 
                    />
                  );
                })
              ) : (
                <div className="p-12 text-center text-zinc-600">No thoughts found for "{searchQuery}"</div>
              )
            ) : (
              <div className="p-8">
                <h3 className="text-zinc-400 text-sm font-semibold mb-4">Recent searches</h3>
                <div className="text-center text-zinc-600 py-8">Try searching for topics, keywords, or phrases</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
