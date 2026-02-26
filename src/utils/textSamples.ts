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
  'Actions speak louder than words.',
  'A picture is worth a thousand words.',
  'Better late than never.',
  'Honesty is the best policy.',
  'Look before you leap.',
  'The pen is mightier than the sword.',
  'You cannot judge a book by its cover.',
  'Where there is a will, there is a way.',
  'Two heads are better than one.',
  'Rome was not built in a day.',
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
  'The development of sustainable energy sources is crucial for the long-term survival of our planet and ecosystems.',
  'Learning a second language can improve cognitive flexibility and delay the onset of age-related mental decline.',
  'The industrial revolution brought about massive changes in agriculture, manufacturing, mining, and transport.',
  'Regular exercise and a balanced diet are fundamental components of maintaining good physical and mental health.',
  'Space exploration has led to numerous technological advancements that benefit our daily lives on Earth.',
  'Effective communication requires not only speaking clearly but also listening actively to others.',
  'The global economy is highly interconnected, meaning events in one country can affect markets worldwide.',
  'Protecting biodiversity is essential for maintaining the delicate balance of ecosystems around the world.',
  'Critical thinking skills are necessary for evaluating the vast amount of information available on the internet.',
  'Historical events often shape the cultural identity and social structures of modern nations.',
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
  'The intricate relationship between macroeconomic indicators and fiscal policy determines the trajectory of national and global economic growth.',
  'Neuroplasticity demonstrates the remarkable ability of the human brain to reorganize its neural pathways in response to new experiences and learning.',
  'The theoretical framework of string theory attempts to reconcile general relativity with quantum mechanics by modeling particles as one-dimensional strings.',
  'Epidemiological studies provide vital insights into the distribution, determinants, and dynamic patterns of health and disease conditions in defined populations.',
  'The complex socio-political dynamics of international relations often require nuanced diplomatic strategies to resolve enduring conflicts and disputes.',
  'Metabolic pathways involve a highly coordinated series of biochemical reactions that convert substrates into necessary cellular products.',
  'The architectural design of modern skyscrapers must account for aerodynamic forces, structural integrity, and sustainable energy utilization.',
  'Cognitive behavioral therapy posits that maladaptive thinking patterns can be systematically identified, challenged, and restructured to improve mental health.',
  'The evolution of democratic institutions reflects a continuous struggle to balance individual liberties with collective societal responsibilities.',
  'Advancements in nanotechnology hold the potential to revolutionize targeted drug delivery systems and minimally invasive medical procedures.',
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
