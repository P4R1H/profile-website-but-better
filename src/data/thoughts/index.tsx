import { TesseractCellData } from '@/types/types';
import { ThoughtsPreview } from '@/components/cards/thoughts/ThoughtsPreview';
import { ThoughtsExpanded, ThoughtItem } from '@/components/cards/thoughts/ThoughtsExpanded';
import React from 'react';

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

export const premiumContent: PremiumContent = {
  title: "Subscribe to Premium",
  description: "Subscribe to unlock new features and if eligible, receive a share of revenue.",
  buttonText: "Subscribe"
};

export const newsItems: NewsItem[] = [
  {
    category: "Technology",
    title: "AI bots takes over saudi arabia unleashes oil crisis",
    time: "2h ago",
    posts: "124K"
  },
  {
    category: "Portfolio",
    title: "New website who this",
    time: "5h ago",
    posts: "89K"
  },
  {
    category: "Breaking",
    title: "Parth completes aquisition of X, renames it PG",
    subtitle: "only contains his thoughts now, narcissitc much?",
    time: "12h ago",
    posts: "342K"
  }
];

export const trendingTopics: TrendingTopic[] = [
  { tag: "WebDev", category: "Technology", posts: "45.2K" },
  { tag: "NextJS15", category: "Development", posts: "28.9K" },
  { tag: "AI", category: "Trending", posts: "156K" }
];

export const peopleToFollow: PersonToFollow[] = [
  { name: "3Blue1Brown", handle: "3blue1brown", avatar: "https://github.com/3b1b.png" },
  { name: "Andrej Karpathy", handle: "karpathy", avatar: "https://github.com/karpathy.png" },
  { name: "Veritasium", handle: "veritasium", avatar: "https://pbs.twimg.com/profile_images/1455185376876826625/s1Fn2RIT_400x400.jpg" },
  { name: "NileRed", handle: "NileRed2", avatar: "https://pbs.twimg.com/profile_images/1526231349615718401/3Ll1RSo7_400x400.jpg" }
];

export const thoughtsList: ThoughtItem[] = [
  {
    id: "thought-1",
    title: "Hello world",
    content: "Namaste",
    date: "Nov 24",
    readTime: "2 min",
    tags: ["philosophy", "engineering"],
    isPinned: true,
    likes: 42,
    retweets: 12,
    replies: 5,
    bookmarks: 28,
  },
];

export const thoughtsData: TesseractCellData = {
  id: "thoughts",
  title: "THOUGHTS",
  subtitle: "Writing",
  content: <ThoughtsPreview />,
  renderExpanded: ({ onClose }) => (
    <ThoughtsExpanded 
      onClose={onClose} 
      thoughts={thoughtsList}
      premiumContent={premiumContent}
      newsItems={newsItems}
      trendingTopics={trendingTopics}
      peopleToFollow={peopleToFollow}
    />
  ),
};
