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
    subtitle: "Yes I know I could've added comment functionality",
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
    id: "blog-blinkit-interview",
    title: "Blinkit Interview Experience",
    content: `Role: SDE-1 Backend <> Verdict: Selected

R1 - DSA (1.5H)
30m resume discussion, then:
• Product of Array Except Self
• Rotting Oranges (BFS)
• Union-Find variant
• Count Square Submatrices (DP)

SQL: 2nd highest rank query, person rank by ID

First technical interview, made errors but interviewer was understanding. 
Asked difference between out of bounds vs segmentation fault when I made an error in the code.

R2 - System Design (1H15M)
Design SAAS for company note-sharing with access control.

- LLD (code), HLD, Database design, API design

Grilled on:
• File storage vs blob storage
• Microservice boundaries
• Database per service
• REST vs gRPC
• SQL vs NoSQL
• PATCH vs PUT

Advice: "Focus on requirements before scaling"

R3 - Cultural Fit (30M)
Expected HR, got technical!

• Why Blinkit?
• Why logistics over pure tech?
• Deep dive on ML internship
• OOPs vs Functional Programming
`,
    date: "Nov 28",
    readTime: "2 min",
    tags: ["blog", "interviews", "system-design", "career"],
    isPinned: false,
    likes: 84200,
    retweets: 12300,
    replies: 3400,
  },
  {
    id: "blog-sprinklr-interview",
    title: "Sprinklr Interview Experience",
    content: `Role: Product Intern <> Verdict: Selected

R1 - DSA (45M)
• 4Sum (O(n²))
• LRU Cache

R2 - Everything (45M → 1H30M)

Behavioral:
• What drives you to build products?
• Shipping under deadline pressure

Deduplication System Deep Dive:
Took my project to production scale.

• 10k+ event types, auto TTL configuration
• Cache management with skewed observation windows
• Metrics for dedup performance
• Cache failure recovery strategies
• Multi-tenant configuration system

Designed YAML config:
• TTL modes: Fixed, Adaptive, Custom
• Cache type selection
• boolean isDuplicate(event E)

Coding:
Implement adaptive TTL algorithm in Python.
• Event frequency tracking
• Dynamic TTL adjustment
• Self-healing, stable

DSA:
Equation validation (A==B, A!=B)
• O(N) + O(N²) space → rejected
• Union-Find → "optimize more"
• Path compression + union by rank → approved

R3 - C&T (30M)
• Why not campus?
• Dream company?
• Other interviews?
• HPE internship decision
• AI impact on recruiting

Ended discussing chole kulche.
`,
    date: "Nov 27",
    readTime: "2 min",
    tags: ["blog", "interviews", "system-design", "architecture"],
    isPinned: false,
    likes: 67800,
    retweets: 9200,
    replies: 2800,
  },
  {
    id: "blog-cred-interview",
    title: "CRED Interview Experience",
    content: `Role: SDE-1 Backend <> Verdict: Selected

R1 - Vibe Check
Senior leader conversation.

R2 - RCA + System Design
Senior Leader.

RCA: Real production issue.
• Root cause identification
• Solutions with tradeoffs
• Monitoring and prevention

Discussd a lot of possible solutions to a problem.

System Design: Contextual problem.
• Real constraints
• Business logic
• When NOT to optimize

Genuine technical discussion, Defended decisions, challenged assumptions etc.

R3 - LLD Assignment
Build a working application.

• Clean code
• SOLID principles
• Design patterns
• Proper abstractions
• Tests and docs

Really liked the lack of a DSA round, I feel like system design is a much better metric.

Verdict: Selected`,
    date: "Nov 26",
    readTime: "2 min",
    tags: ["blog", "interviews", "system-design", "career", "philosophy"],
    isPinned: false,
    likes: 92500,
    retweets: 15600,
    replies: 4100,
  },
  {
    id: "thought-1",
    title: "Hello world",
    content: "skeptics run the world.",
    date: "Nov 24",
    readTime: "2 min",
    tags: ["philosophy", "engineering"],
    isPinned: true,
    likes: 42000,
    retweets: 12000,
    replies: 5000,
    bookmarks: 28,
  },
];

export const thoughtsData: TesseractCellData = {
  id: "thoughts",
  title: "THOUGHTS",
  subtitle: "Writing",
  content: <ThoughtsPreview />,
  renderExpanded: ({ onClose, path, onNavigate }) => {
    // Get the thought ID from path if present (e.g., ["thoughts", "blog-blinkit-interview"])
    const initialThoughtId = path.length > 1 ? path[1] : undefined;
    
    // Handle navigation to/from individual thoughts
    const handleNavigateToThought = (thoughtId: string | null) => {
      if (thoughtId) {
        onNavigate(["thoughts", thoughtId]);
      } else {
        onNavigate(["thoughts"]);
      }
    };

    return (
      <ThoughtsExpanded 
        onClose={onClose} 
        thoughts={thoughtsList}
        premiumContent={premiumContent}
        newsItems={newsItems}
        trendingTopics={trendingTopics}
        peopleToFollow={peopleToFollow}
        initialThoughtId={initialThoughtId}
        onNavigateToThought={handleNavigateToThought}
      />
    );
  },
};
