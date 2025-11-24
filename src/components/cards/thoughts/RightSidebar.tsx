"use client";

import { PremiumContent, NewsItem, TrendingTopic, PersonToFollow } from "./ThoughtsExpanded";

interface RightSidebarProps {
  premiumContent: PremiumContent;
  newsItems: NewsItem[];
  trendingTopics: TrendingTopic[];
  peopleToFollow: PersonToFollow[];
}

export const RightSidebar = ({ 
  premiumContent, 
  newsItems, 
  trendingTopics, 
  peopleToFollow 
}: RightSidebarProps) => {
  return (
    <div className="w-[350px] hidden xl:block px-4 py-2 relative">
      <div className="sticky top-0 space-y-4 overflow-y-auto max-h-screen scrollbar-hide pb-4">
        
        {/* Subscribe to Premium */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
          <h3 className="font-bold text-xl text-zinc-100 mb-2">{premiumContent.title}</h3>
          <p className="text-sm text-zinc-400 mb-3">{premiumContent.description}</p>
          <button className="bg-zinc-100 text-black font-bold py-2 px-4 rounded-full hover:bg-zinc-200 transition-colors text-sm">
            {premiumContent.buttonText}
          </button>
        </div>

        {/* Today's News */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900">
            <h3 className="font-bold text-xl text-zinc-100">Today's News</h3>
          </div>
          {newsItems.map((item, index) => (
            <div 
              key={index}
              className="px-4 py-3 hover:bg-zinc-900 transition-colors cursor-pointer border-b border-zinc-900 last:border-b-0"
            >
              <div className="text-xs text-zinc-600 mb-1">{item.category}</div>
              <div className="font-bold text-sm text-zinc-100 mb-1">{item.title}</div>
              {item.subtitle && (
                <div className="text-xs text-zinc-500 mb-1">{item.subtitle}</div>
              )}
              <div className="text-xs text-zinc-600">{item.time} · {item.posts} posts</div>
            </div>
          ))}
        </div>

        {/* What's Happening */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900">
            <h3 className="font-bold text-xl text-zinc-100">What's happening</h3>
          </div>
          {trendingTopics.map((topic, index) => (
            <div 
              key={index}
              className="px-4 py-3 hover:bg-zinc-900 transition-colors cursor-pointer border-b border-zinc-900 last:border-b-0"
            >
              <div className="text-xs text-zinc-600 mb-1">{topic.category} · Trending</div>
              <div className="font-bold text-sm text-zinc-100 mb-1">#{topic.tag}</div>
              <div className="text-xs text-zinc-600">{topic.posts} posts</div>
            </div>
          ))}
        </div>

        {/* Who to Follow */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900">
            <h3 className="font-bold text-xl text-zinc-100">Who to follow</h3>
          </div>
          {peopleToFollow.map((person, index) => (
            <div 
              key={index}
              className="px-4 py-3 hover:bg-zinc-900 transition-colors cursor-pointer flex items-center justify-between border-b border-zinc-900 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={person.avatar}
                  alt={person.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-bold text-sm text-zinc-100">{person.name}</div>
                  <div className="text-sm text-zinc-600">@{person.handle}</div>
                </div>
              </div>
              <button className="bg-zinc-100 text-black font-bold py-1.5 px-4 rounded-full hover:bg-zinc-200 transition-colors text-sm">
                Follow
              </button>
            </div>
          ))}
        </div>

      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none" />
    </div>
  );
};
