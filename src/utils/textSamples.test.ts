import type { DifficultyLevel, TextSample } from 'src/types/typing.types';

import {
  getRandomTextSample,
  getTextSampleById,
  getTextSamplesByDifficulty,
  textSamples,
} from './textSamples';

describe('textSamples', () => {
  describe('textSamples array', () => {
    it('should contain 60 text samples (20 for each difficulty)', () => {
      expect(textSamples).toHaveLength(60);
    });

    it('should have proper structure for each sample', () => {
      textSamples.forEach((sample) => {
        expect(sample).toHaveProperty('id');
        expect(sample).toHaveProperty('content');
        expect(sample).toHaveProperty('difficulty');
        expect(sample).toHaveProperty('wordCount');
        expect(sample).toHaveProperty('characterCount');

        expect(typeof sample.id).toBe('string');
        expect(typeof sample.content).toBe('string');
        expect(typeof sample.difficulty).toBe('string');
        expect(typeof sample.wordCount).toBe('number');
        expect(typeof sample.characterCount).toBe('number');
      });
    });

    it('should have valid difficulty levels', () => {
      const validDifficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];
      textSamples.forEach((sample) => {
        expect(validDifficulties).toContain(sample.difficulty);
      });
    });

    it('should have non-empty content', () => {
      textSamples.forEach((sample) => {
        expect(sample.content).toBeTruthy();
        expect(sample.content.length).toBeGreaterThan(0);
      });
    });

    it('should have positive word and character counts', () => {
      textSamples.forEach((sample) => {
        expect(sample.wordCount).toBeGreaterThan(0);
        expect(sample.characterCount).toBeGreaterThan(0);
      });
    });

    it('should have wordCount matching actual word count', () => {
      textSamples.forEach((sample) => {
        const expectedWordCount = sample.content.trim().split(/\s+/).length;
        expect(sample.wordCount).toBe(expectedWordCount);
      });
    });

    it('should have characterCount matching actual character count', () => {
      textSamples.forEach((sample) => {
        expect(sample.characterCount).toBe(sample.content.length);
      });
    });
  });

  describe('getTextSamplesByDifficulty', () => {
    it('should return 20 easy samples', () => {
      const easySamples = getTextSamplesByDifficulty('easy');
      expect(easySamples).toHaveLength(20);
      easySamples.forEach((sample) => {
        expect(sample.difficulty).toBe('easy');
      });
    });

    it('should return 20 medium samples', () => {
      const mediumSamples = getTextSamplesByDifficulty('medium');
      expect(mediumSamples).toHaveLength(20);
      mediumSamples.forEach((sample) => {
        expect(sample.difficulty).toBe('medium');
      });
    });

    it('should return 20 hard samples', () => {
      const hardSamples = getTextSamplesByDifficulty('hard');
      expect(hardSamples).toHaveLength(20);
      hardSamples.forEach((sample) => {
        expect(sample.difficulty).toBe('hard');
      });
    });

    it('should return empty array for invalid difficulty', () => {
      const invalidSamples = getTextSamplesByDifficulty(
        'invalid' as DifficultyLevel,
      );
      expect(invalidSamples).toHaveLength(0);
    });

    it('should return different instances (no reference sharing)', () => {
      const samples1 = getTextSamplesByDifficulty('easy');
      const samples2 = getTextSamplesByDifficulty('easy');
      expect(samples1).not.toBe(samples2);
    });
  });

  describe('getRandomTextSample', () => {
    it('should return a sample for valid difficulty', () => {
      const sample = getRandomTextSample('easy');
      expect(sample).toBeDefined();
      expect(sample.difficulty).toBe('easy');
      expect(textSamples).toContain(sample);
    });

    it('should return a sample for each difficulty', () => {
      const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];
      difficulties.forEach((difficulty) => {
        const sample = getRandomTextSample(difficulty);
        expect(sample).toBeDefined();
        expect(sample.difficulty).toBe(difficulty);
      });
    });

    it('should return a valid TextSample object', () => {
      const sample = getRandomTextSample('medium');
      expect(sample).toHaveProperty('id');
      expect(sample).toHaveProperty('content');
      expect(sample).toHaveProperty('difficulty');
      expect(sample).toHaveProperty('wordCount');
      expect(sample).toHaveProperty('characterCount');
    });

    it('should potentially return different samples on multiple calls', () => {
      // This test is probabilistic but should work most of the time
      const samples = new Set<TextSample>();
      for (let i = 0; i < 20; i++) {
        samples.add(getRandomTextSample('easy'));
      }
      // With 10 samples and 20 draws, we should get multiple different samples
      expect(samples.size).toBeGreaterThan(1);
    });
  });

  describe('getTextSampleById', () => {
    it('should return the correct sample for valid ID', () => {
      const firstSample = textSamples[0];
      const foundSample = getTextSampleById(firstSample.id);
      expect(foundSample).toBe(firstSample);
    });

    it('should return undefined for invalid ID', () => {
      const foundSample = getTextSampleById('invalid-id');
      expect(foundSample).toBeUndefined();
    });

    it('should return undefined for empty ID', () => {
      const foundSample = getTextSampleById('');
      expect(foundSample).toBeUndefined();
    });

    it('should find samples from all difficulty levels', () => {
      const easySample = getTextSamplesByDifficulty('easy')[0];
      const mediumSample = getTextSamplesByDifficulty('medium')[0];
      const hardSample = getTextSamplesByDifficulty('hard')[0];

      expect(getTextSampleById(easySample.id)).toBe(easySample);
      expect(getTextSampleById(mediumSample.id)).toBe(mediumSample);
      expect(getTextSampleById(hardSample.id)).toBe(hardSample);
    });

    it('should handle ID lookups for all samples', () => {
      textSamples.forEach((sample) => {
        const foundSample = getTextSampleById(sample.id);
        expect(foundSample).toBe(sample);
      });
    });
  });

  describe('ID generation', () => {
    it('should generate unique IDs for all samples', () => {
      const ids = textSamples.map((sample) => sample.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should follow proper ID format', () => {
      const easySamples = getTextSamplesByDifficulty('easy');
      const mediumSamples = getTextSamplesByDifficulty('medium');
      const hardSamples = getTextSamplesByDifficulty('hard');

      // Check easy samples format
      easySamples.forEach((sample, index) => {
        expect(sample.id).toBe(`easy-${String(index + 1)}`);
      });

      // Check medium samples format
      mediumSamples.forEach((sample, index) => {
        expect(sample.id).toBe(`medium-${String(index + 1)}`);
      });

      // Check hard samples format
      hardSamples.forEach((sample, index) => {
        expect(sample.id).toBe(`hard-${String(index + 1)}`);
      });
    });
  });

  describe('Content characteristics', () => {
    it('should have appropriate difficulty progression', () => {
      const easySamples = getTextSamplesByDifficulty('easy');
      const mediumSamples = getTextSamplesByDifficulty('medium');
      const hardSamples = getTextSamplesByDifficulty('hard');

      // Easy samples should generally be shorter
      const avgEasyWords =
        easySamples.reduce((sum, s) => sum + s.wordCount, 0) /
        easySamples.length;
      const avgMediumWords =
        mediumSamples.reduce((sum, s) => sum + s.wordCount, 0) /
        mediumSamples.length;
      const avgHardWords =
        hardSamples.reduce((sum, s) => sum + s.wordCount, 0) /
        hardSamples.length;

      expect(avgEasyWords).toBeLessThan(avgMediumWords);
      expect(avgMediumWords).toBeLessThan(avgHardWords);
    });

    it('should have proper punctuation', () => {
      textSamples.forEach((sample) => {
        // All samples should end with proper punctuation
        expect(['.', '!', '?']).toContain(
          sample.content[sample.content.length - 1],
        );
      });
    });

    it('should not have excessive whitespace', () => {
      textSamples.forEach((sample) => {
        // Should not start with whitespace
        expect(sample.content[0]).not.toBe(' ');

        // Should not have multiple consecutive spaces
        expect(sample.content).not.toContain('  ');
      });
    });
  });
});
