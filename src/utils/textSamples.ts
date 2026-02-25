/**
 * Public domain text samples for typing practice
 * All content is from public domain sources
 */

import type { DifficultyLevel, TextSample } from 'src/types/typing.types';

/**
 * Easy difficulty text samples
 * Simple words, common vocabulary, shorter sentences
 */
const easyTexts: string[] = [
  'The quick brown fox jumps over the lazy dog.',
  'A good beginning makes a good ending.',
  'Time flies when you are having fun.',
  'The early bird catches the worm.',
  'Practice makes perfect in all things.',
  'Every journey begins with a single step.',
  'The sun rises in the east each morning.',
  'Books are a great way to learn new things.',
  'Water is essential for all living things.',
  'Kindness costs nothing but means everything.',
];

/**
 * Medium difficulty text samples
 * More complex vocabulary, longer sentences, mixed punctuation
 */
const mediumTexts: string[] = [
  'Technology has revolutionized the way we communicate and access information in our daily lives.',
  'The ancient civilizations built remarkable structures that still puzzle modern architects and engineers.',
  'Understanding different cultures helps us appreciate the diversity and richness of human experience.',
  'Climate change represents one of the most significant challenges facing our generation today.',
  'Education is the foundation upon which we build our future and develop our potential.',
  'The internet has transformed how we work, learn, and interact with people around the world.',
  'Scientific discoveries continue to expand our understanding of the universe and our place in it.',
  'Artistic expression allows humans to convey emotions and ideas that words alone cannot capture.',
  'Economic systems evolve over time to meet the changing needs of societies and individuals.',
  'Health and wellness depend on balance between physical activity, nutrition, and mental well-being.',
];

/**
 * Hard difficulty text samples
 * Complex vocabulary, technical terms, longer sentences, advanced punctuation
 */
const hardTexts: string[] = [
  'Quantum mechanics fundamentally challenges our classical understanding of particles and their behavior at subatomic scales.',
  'The interdisciplinary nature of modern neuroscience requires integration of psychology, biology, chemistry, and computational modeling.',
  'Cryptocurrency and blockchain technology represent paradigm shifts in financial systems and decentralized digital transactions.',
  'Biomechanical engineering applies principles of physics and materials science to analyze and improve human movement and performance.',
  'The philosophical implications of artificial intelligence raise profound questions about consciousness, ethics, and human identity.',
  'Sustainable development requires balancing economic growth, environmental protection, and social equity for future generations.',
  'Epigenetic research reveals how environmental factors can influence gene expression without altering DNA sequences.',
  'The anthropocene epoch reflects humanity unprecedented impact on Earth geology and ecosystems through industrial activities.',
  'Computational linguistics combines computer science, cognitive psychology, and linguistics to understand language processing.',
  'Renewable energy technologies continue to advance, offering promising alternatives to fossil fuel dependency and climate change mitigation.',
];

/**
 * Create a text sample object with calculated metrics
 */
const createTextSample = (
  id: string,
  content: string,
  difficulty: DifficultyLevel,
): TextSample => {
  const words = content.trim().split(/\s+/);
  const wordCount = words.length;
  const characterCount = content.length;

  return {
    id,
    content,
    difficulty,
    wordCount,
    characterCount,
  };
};

/**
 * Generate all text samples for each difficulty level
 */
const generateTextSamples = (): TextSample[] => {
  const samples: TextSample[] = [];

  // Generate easy samples
  easyTexts.forEach((content, index) => {
    samples.push(
      createTextSample(`easy-${String(index + 1)}`, content, 'easy'),
    );
  });

  // Generate medium samples
  mediumTexts.forEach((content, index) => {
    samples.push(
      createTextSample(`medium-${String(index + 1)}`, content, 'medium'),
    );
  });

  // Generate hard samples
  hardTexts.forEach((content, index) => {
    samples.push(
      createTextSample(`hard-${String(index + 1)}`, content, 'hard'),
    );
  });

  return samples;
};

/**
 * All available text samples
 */
export const textSamples = generateTextSamples();

/**
 * Get text samples by difficulty level
 */
export const getTextSamplesByDifficulty = (
  difficulty: DifficultyLevel,
): TextSample[] => {
  return textSamples.filter((sample) => sample.difficulty === difficulty);
};

/**
 * Get a random text sample for a specific difficulty level
 */
export const getRandomTextSample = (
  difficulty: DifficultyLevel,
): TextSample => {
  const samples = getTextSamplesByDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * samples.length);
  return samples[randomIndex];
};

/**
 * Get a text sample by ID
 */
export const getTextSampleById = (id: string): TextSample | undefined => {
  return textSamples.find((sample) => sample.id === id);
};
