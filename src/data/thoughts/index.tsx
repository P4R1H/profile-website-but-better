import { TesseractCellData } from '@/types/types';
import { ThoughtsPreview } from '@/components/cards/thoughts/ThoughtsPreview';
import { ThoughtsExpanded, ThoughtItem } from '@/components/cards/thoughts/ThoughtsExpanded';
import React from 'react';

// Sidebar content types
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

// Editable sidebar content - customize as needed
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

// Sample thoughts data - X/Twitter style
export const thoughtsList: ThoughtItem[] = [
  {
    id: "thought-1",
    title: "Question everything",
    content: "Questioning isn't about being contrarian. It's about understanding the first principles that govern systems, ideas, and decisions.\n\nEvery framework, every tool, every 'best practice' exists because someone made a choice. Understanding that choice—and whether it still applies to your context—is what separates cargo-culting from engineering.",
    date: "Nov 24",
    readTime: "2 min",
    tags: ["philosophy", "engineering"],
    isPinned: true,
    likes: 42,
    retweets: 12,
    replies: 5,
    bookmarks: 28,
  },
  {
    id: "thought-2",
    title: "Brutalist web",
    content: "There's something beautiful about websites that strip away the unnecessary. No animations for the sake of animations. Just content, structure, and intention.\n\nBrutalism in web design isn't about being ugly—it's about being honest. Form follows function.",
    date: "Nov 22",
    readTime: "1 min",
    tags: ["design", "webdev"],
    likes: 89,
    retweets: 24,
    replies: 12,
  },
  {
    id: "thought-3",
    title: "Systems programming",
    content: "Most people avoid low-level programming because it feels 'too hard' or 'not practical.' But understanding how memory works, how the CPU schedules processes, how networks actually transfer bytes—that knowledge compounds.\n\nYou don't need to write assembly daily. But knowing what happens under the hood changes how you think about every line of code.",
    date: "Nov 18",
    readTime: "2 min",
    tags: ["systems", "learning"],
    likes: 156,
    retweets: 41,
    replies: 8,
  },
  {
    id: "thought-4",
    title: "Tech stack tradeoffs",
    content: "There is no perfect stack. There are only tradeoffs.\n\nReact or Vue? Postgres or Mongo? REST or GraphQL? These aren't binary choices. They're decisions based on constraints: team expertise, scale requirements, development velocity.\n\nStop optimizing for the imaginary startup you might build. Optimize for the problem you have today.",
    date: "Nov 15",
    readTime: "1 min",
    tags: ["technical", "career"],
    likes: 203,
    retweets: 67,
    replies: 19,
  },
  {
    id: "thought-5",
    title: "Reading > Writing code",
    content: "We spend way more time reading code than writing it. Yet we optimize for write-time convenience.\n\nCleverness is the enemy of maintainability. That one-liner you're proud of? It'll confuse your teammate (and future you). Clear, boring code wins in the long run.",
    date: "Nov 10",
    readTime: "1 min",
    tags: ["engineering"],
    likes: 312,
    retweets: 94,
    replies: 23,
  },
  {
    id: "thought-6",
    title: "Side projects",
    content: "Most side projects will never get users. They won't make money. They'll sit in your GitHub gathering dust.\n\nAnd that's completely fine.\n\nSide projects are playgrounds. They're where you test ideas, learn new tools, and build things for the sake of building. The real value isn't the project—it's what you learned along the way.",
    date: "Nov 5",
    readTime: "1 min",
    tags: ["career", "learning"],
    likes: 445,
    retweets: 128,
    replies: 34,
    bookmarks: 89,
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
