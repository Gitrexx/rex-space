const ui = {
  backLink: '← All Posts',
  readingTime: (n: number) => `${n} min read`,
  updated: 'Updated',
  aiAssisted: {
    label: 'AI-assisted',
    note: 'Written with the help of AI, thinking and opinions are original — I argued it out with a model, it pushed back and pulled up sources, and this is what survived.',
  },
  relatedPosts: 'Related',
  allPosts: 'All Posts →',
  postsEyebrow: 'Posts',
  postsTitle: 'All Posts',
  heroTitle: 'Keep notes.',
  heroTitleLine2: '',
  viewAll: 'All Posts →',
  readLink: 'Read →',
  postFeed: {
    all: 'All',
    filterLabel: 'Filter posts by category',
    previousCategories: 'Scroll categories left',
    nextCategories: 'Scroll categories right',
    searchLabel: 'Search posts',
    empty: 'No posts match this filter.',
    more: 'Load more',
    read: 'Read',
  },
};

export function getUiText() {
  return ui;
}
