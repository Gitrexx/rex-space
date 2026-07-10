export type Quote = {
  text: string;
  author: string;
};

/**
 * Rotating quotes for the home hero.
 *
 * One is shown per day (see the picker in `src/pages/index.astro`); the day's
 * index is derived from the date, so it's stable within a day and advances at
 * local midnight. Add or remove lines freely — the rotation adjusts to the
 * list length automatically. Keep `text` without surrounding quote marks; the
 * hero adds the typographic “ ” for you.
 */
export const quotes: Quote[] = [
  // ── Engineering & craft
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
  {
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson',
  },
  {
    text: 'Controlling complexity is the essence of computer programming.',
    author: 'Brian Kernighan',
  },
  {
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
  },
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  {
    text: 'The most dangerous phrase in the language is: we’ve always done it this way.',
    author: 'Grace Hopper',
  },
  {
    text: 'There are only two hard things in computer science: cache invalidation and naming things.',
    author: 'Phil Karlton',
  },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Deleted code is debugged code.', author: 'Jeff Sickel' },
  {
    text: 'The function of good software is to make the complex appear to be simple.',
    author: 'Grady Booch',
  },
  {
    text: 'The cheapest, fastest, and most reliable components are those that aren’t there.',
    author: 'Gordon Bell',
  },
  {
    text: 'Walking on water and developing software from a specification are easy if both are frozen.',
    author: 'Edward V. Berard',
  },
  {
    text: 'The best performance improvement is the transition from the nonworking state to the working state.',
    author: 'J. Osterhout',
  },
  { text: 'Science is about knowing; engineering is about doing.', author: 'Henry Petroski' },
  {
    text: 'Engineering is the art of directing the great sources of power in nature for the use and convenience of man.',
    author: 'Thomas Tredgold',
  },
  {
    text: 'Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.',
    author: 'Antoine de Saint-Exupéry',
  },
  {
    text: 'Simple things should be simple, complex things should be possible.',
    author: 'Alan Kay',
  },
  {
    text: 'Computing’s core challenge is how not to make a mess of it.',
    author: 'Edsger W. Dijkstra',
  },
  {
    text: 'Bad programmers worry about the code. Good programmers worry about data structures and their relationships.',
    author: 'Linus Torvalds',
  },
  { text: 'Make the change easy, then make the easy change.', author: 'Kent Beck' },
  { text: 'A fool with a tool is still a fool.', author: 'Grady Booch' },
  {
    text: 'The best way to get a project done faster is to start sooner.',
    author: 'Jim Highsmith',
  },
  { text: 'Adding manpower to a late software project makes it later.', author: 'Fred Brooks' },
  {
    text: 'The hardest part of software is deciding precisely what to build.',
    author: 'Fred Brooks',
  },
  { text: 'All models are wrong, but some are useful.', author: 'George Box' },
  {
    text: 'The programmer, like the poet, works only slightly removed from pure thought-stuff.',
    author: 'Fred Brooks',
  },

  // ── Science & futurism
  {
    text: 'Any sufficiently advanced technology is indistinguishable from magic.',
    author: 'Arthur C. Clarke',
  },
  {
    text: 'The only way of discovering the limits of the possible is to venture a little way past them into the impossible.',
    author: 'Arthur C. Clarke',
  },
  { text: 'Somewhere, something incredible is waiting to be known.', author: 'Carl Sagan' },
  {
    text: 'Science is a way of thinking much more than it is a body of knowledge.',
    author: 'Carl Sagan',
  },
  {
    text: 'The universe is under no obligation to make sense to you.',
    author: 'Neil deGrasse Tyson',
  },
  {
    text: 'The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.',
    author: 'Isaac Asimov',
  },
  {
    text: 'It is change, continuing change, inevitable change, that is the dominant factor in society today.',
    author: 'Isaac Asimov',
  },
  {
    text: 'The only thing that makes life possible is permanent, intolerable uncertainty: not knowing what comes next.',
    author: 'Ursula K. Le Guin',
  },
  {
    text: 'The good thing about science is that it’s true whether or not you believe in it.',
    author: 'Neil deGrasse Tyson',
  },
  {
    text: 'Research is what I’m doing when I don’t know what I’m doing.',
    author: 'Wernher von Braun',
  },
  {
    text: 'Some people call this artificial intelligence, but the reality is this technology will enhance us.',
    author: 'Ginni Rometty',
  },
  {
    text: 'The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.',
    author: 'Stephen Hawking',
  },
  { text: 'Extraordinary claims require extraordinary evidence.', author: 'Carl Sagan' },
  { text: 'What I cannot create, I do not understand.', author: 'Richard Feynman' },
  {
    text: 'Nature uses only the longest threads to weave her patterns.',
    author: 'Richard Feynman',
  },
  {
    text: 'The universe is not only stranger than we imagine, it is stranger than we can imagine.',
    author: 'J. B. S. Haldane',
  },
  {
    text: 'Prediction is very difficult, especially if it’s about the future.',
    author: 'Niels Bohr',
  },
  {
    text: 'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.',
    author: 'Richard Feynman',
  },
  {
    text: 'Equipped with his five senses, man explores the universe around him and calls the adventure Science.',
    author: 'Edwin Hubble',
  },
  {
    text: 'The important achievement of Apollo was demonstrating that humanity is not forever chained to this planet.',
    author: 'Neil Armstrong',
  },
  { text: 'Science is organized knowledge. Wisdom is organized life.', author: 'Immanuel Kant' },
  {
    text: 'The universe is full of magical things patiently waiting for our wits to grow sharper.',
    author: 'Eden Phillpotts',
  },

  // ── Learning & curiosity
  { text: 'I have no special talent. I am only passionately curious.', author: 'Albert Einstein' },
  {
    text: 'The important thing is not to stop questioning. Curiosity has its own reason for existing.',
    author: 'Albert Einstein',
  },
  {
    text: 'Anyone who has never made a mistake has never tried anything new.',
    author: 'Albert Einstein',
  },
  {
    text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    author: 'Mahatma Gandhi',
  },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  {
    text: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.',
    author: 'Benjamin Franklin',
  },
  {
    text: 'The mind, once stretched by a new idea, never returns to its original dimensions.',
    author: 'Ralph Waldo Emerson',
  },
  { text: 'Knowledge speaks, but wisdom listens.', author: 'Jimi Hendrix' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
  { text: 'Judge a man by his questions rather than his answers.', author: 'Voltaire' },
  { text: 'Wisdom begins in wonder.', author: 'Socrates' },
  { text: 'I am still learning.', author: 'Michelangelo' },
  {
    text: 'The beautiful thing about learning is that no one can take it away from you.',
    author: 'B. B. King',
  },
  {
    text: 'The more I read, the more I acquire, the more certain I am that I know nothing.',
    author: 'Voltaire',
  },
  { text: 'The mind is not a vessel to be filled but a fire to be kindled.', author: 'Plutarch' },
  { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates' },

  // ── AI & computing
  {
    text: 'The question of whether a computer can think is no more interesting than whether a submarine can swim.',
    author: 'Edsger W. Dijkstra',
  },
  { text: 'The computer revolution hasn’t happened yet.', author: 'Alan Kay' },
  { text: 'Perspective is worth 80 IQ points.', author: 'Alan Kay' },
  {
    text: 'Machine intelligence is the last invention that humanity will ever need to make.',
    author: 'Nick Bostrom',
  },
  {
    text: 'AI is one of the most important things humanity is working on.',
    author: 'Sundar Pichai',
  },

  // ── Leadership & teamwork
  {
    text: 'If you want to go fast, go alone. If you want to go far, go together.',
    author: 'African Proverb',
  },
  {
    text: 'The strength of the team is each individual member. The strength of each member is the team.',
    author: 'Phil Jackson',
  },
  {
    text: 'Example is not the main thing in influencing others. It is the only thing.',
    author: 'Albert Schweitzer',
  },

  // ── Innovation
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Stay hungry. Stay foolish.', author: 'Steve Jobs' },
  {
    text: 'People who are crazy enough to think they can change the world are the ones who do.',
    author: 'Steve Jobs',
  },
  { text: 'The best way to have a good idea is to have a lot of ideas.', author: 'Linus Pauling' },

  // ── Persistence
  {
    text: 'Success is the ability to go from one failure to another with no loss of enthusiasm.',
    author: 'Winston Churchill',
  },
  { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
  { text: 'Fall seven times, stand up eight.', author: 'Japanese Proverb' },

  // ── Problem solving
  { text: 'A problem well stated is a problem half solved.', author: 'Charles Kettering' },
  {
    text: 'We cannot solve our problems with the same thinking we used when we created them.',
    author: 'Albert Einstein',
  },
  {
    text: 'If I had an hour to solve a problem, I’d spend fifty-five minutes thinking about the problem.',
    author: 'Albert Einstein',
  },
  {
    text: 'Everything should be made as simple as possible, but not simpler.',
    author: 'Albert Einstein',
  },
];
