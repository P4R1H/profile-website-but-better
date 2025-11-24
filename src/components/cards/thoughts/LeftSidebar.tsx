"use client";

import { Home, Search, Bell, Mail, User, BookMarked, Settings } from "lucide-react";

interface LeftSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
}

export const LeftSidebar = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedTags, 
  setSelectedTags,
  allTags 
}: LeftSidebarProps) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="w-[275px] hidden lg:flex flex-col px-3 py-4 gap-2">
      {/* PG Logo */}
      <div className="px-3 py-2 mb-2">
        <img src="/social/pglogo.png" alt="PG" className="w-8 h-8" />
      </div>

      {/* Nav Items */}
      <NavItem icon={Home} label="Home" />
      <NavItem icon={Search} label="Explore" />
      <NavItem icon={Bell} label="Notifications" />
      <NavItem icon={Mail} label="Messages" />
      <NavItem icon={BookMarked} label="Bookmarks" />
      <NavItem icon={User} label="Profile" />
      <NavItem icon={Settings} label="Settings" />

      {/* Search */}
      <div className="mt-6 px-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
          <input
            type="text"
            placeholder="Search thoughts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="mt-4 px-3">
          <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Filter by topic</div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <button className="flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-colors group">
    <Icon className="w-6 h-6 text-zinc-100" />
    <span className="text-xl text-zinc-100">{label}</span>
  </button>
);
