import type { DifficultyLevel, TestResult, TypingTest } from 'src/types';

import {
  clearCurrentTest,
  clearTestHistory,
  getCurrentTest,
  getTestHistory,
  saveCurrentTest,
  saveTestResult,
} from './sessionStorage';

interface SessionData {
  testHistory: TestResult[];
  currentTest?: TypingTest | null;
}

// Mock sessionStorage with state management
let mockStorage: Record<string, string> = {};
const sessionStorageMock = {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    const newStorage = { ...mockStorage };
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete newStorage[key];
    mockStorage = newStorage;
  }),
  clear: vi.fn(() => {
    mockStorage = {};
  }),
  length: 0,
  key: vi.fn(),
};

// Replace global sessionStorage with mock
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

describe('sessionStorage', () => {
  beforeEach(() => {
    // Clear call counts but preserve implementations
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.clear.mockClear();
    mockStorage = {};
  });

  afterEach(() => {
    sessionStorageMock.clear();
  });

  describe('saveTestResult', () => {
    it('saves a test result to session storage', () => {
      const mockResult: TestResult = {
        id: 'test-1',
        wpm: 60,
        accuracy: 95,
        timeElapsed: 120,
        timestamp: new Date('2026-02-24T12:00:00Z'),
        difficulty: 'medium' as DifficultyLevel,
        textSampleId: 'sample-1',
      };

      // Mock existing empty history
      sessionStorageMock.getItem.mockReturnValue(
        JSON.stringify({ testHistory: [] }),
      );

      saveTestResult(mockResult);

      expect(sessionStorageMock.getItem).toHaveBeenCalledWith(
        'typing-speed.data',
      );
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'typing-speed.data',
        expect.stringContaining('"testHistory"'),
      );
    });

    it('appends to existing test history', () => {
      const existingResult: TestResult = {
        id: 'test-1',
        wpm: 50,
        accuracy: 90,
        timeElapsed: 100,
        timestamp: new Date('2026-02-24T11:00:00Z'),
        difficulty: 'easy' as DifficultyLevel,
        textSampleId: 'sample-1',
      };

      const newResult: TestResult = {
        id: 'test-2',
        wpm: 60,
        accuracy: 95,
        timeElapsed: 120,
        timestamp: new Date('2026-02-24T12:00:00Z'),
        difficulty: 'medium' as DifficultyLevel,
        textSampleId: 'sample-2',
      };

      // Mock existing history
      sessionStorageMock.getItem.mockReturnValue(
        JSON.stringify({ testHistory: [existingResult] }),
      );

      saveTestResult(newResult);

      const savedData = JSON.parse(
        sessionStorageMock.setItem.mock.calls[0][1],
      ) as SessionData;
      expect(savedData.testHistory).toHaveLength(2);
      // Compare dates as strings since JSON serialization converts Date to string
      expect(savedData.testHistory[0].id).toEqual(existingResult.id);
      expect(savedData.testHistory[0].wpm).toEqual(existingResult.wpm);
      expect(savedData.testHistory[0].accuracy).toEqual(
        existingResult.accuracy,
      );
      expect(savedData.testHistory[0].timeElapsed).toEqual(
        existingResult.timeElapsed,
      );
      expect(savedData.testHistory[0].timestamp).toEqual(
        (typeof existingResult.timestamp === 'string'
          ? new Date(existingResult.timestamp)
          : existingResult.timestamp
        ).toISOString(),
      );
      expect(savedData.testHistory[0].difficulty).toEqual(
        existingResult.difficulty,
      );
      expect(savedData.testHistory[0].textSampleId).toEqual(
        existingResult.textSampleId,
      );

      expect(savedData.testHistory[1].id).toEqual(newResult.id);
      expect(savedData.testHistory[1].wpm).toEqual(newResult.wpm);
      expect(savedData.testHistory[1].accuracy).toEqual(newResult.accuracy);
      expect(savedData.testHistory[1].timeElapsed).toEqual(
        newResult.timeElapsed,
      );
      expect(savedData.testHistory[1].timestamp).toEqual(
        (typeof newResult.timestamp === 'string'
          ? new Date(newResult.timestamp)
          : newResult.timestamp
        ).toISOString(),
      );
      expect(savedData.testHistory[1].difficulty).toEqual(newResult.difficulty);
      expect(savedData.testHistory[1].textSampleId).toEqual(
        newResult.textSampleId,
      );
    });

    it('handles empty session storage', () => {
      const mockResult: TestResult = {
        id: 'test-1',
        wpm: 60,
        accuracy: 95,
        timeElapsed: 120,
        timestamp: new Date('2026-02-24T12:00:00Z'),
        difficulty: 'medium' as DifficultyLevel,
        textSampleId: 'sample-1',
      };

      // Mock empty session storage
      sessionStorageMock.getItem.mockReturnValue(null);

      saveTestResult(mockResult);

      const savedData = JSON.parse(
        sessionStorageMock.setItem.mock.calls[0][1],
      ) as SessionData;
      expect(savedData.testHistory).toHaveLength(1);
      // Compare dates as strings since JSON serialization converts Date to string
      expect(savedData.testHistory[0].id).toEqual(mockResult.id);
      expect(savedData.testHistory[0].wpm).toEqual(mockResult.wpm);
      expect(savedData.testHistory[0].accuracy).toEqual(mockResult.accuracy);
      expect(savedData.testHistory[0].timeElapsed).toEqual(
        mockResult.timeElapsed,
      );
      expect(savedData.testHistory[0].timestamp).toEqual(
        (typeof mockResult.timestamp === 'string'
          ? new Date(mockResult.timestamp)
          : mockResult.timestamp
        ).toISOString(),
      );
      expect(savedData.testHistory[0].difficulty).toEqual(
        mockResult.difficulty,
      );
      expect(savedData.testHistory[0].textSampleId).toEqual(
        mockResult.textSampleId,
      );
    });

    it('handles corrupted session storage data', () => {
      const mockResult: TestResult = {
        id: 'test-1',
        wpm: 60,
        accuracy: 95,
        timeElapsed: 120,
        timestamp: new Date('2026-02-24T12:00:00Z'),
        difficulty: 'medium' as DifficultyLevel,
        textSampleId: 'sample-1',
      };

      // Mock corrupted data
      sessionStorageMock.getItem.mockReturnValue('invalid json');

      // Should not throw error and should create new history
      expect(() => {
        saveTestResult(mockResult);
      }).not.toThrow();

      const savedData = JSON.parse(
        sessionStorageMock.setItem.mock.calls[0][1],
      ) as SessionData;
      expect(savedData.testHistory).toHaveLength(1);
      // Compare dates as strings since JSON serialization converts Date to string
      expect(savedData.testHistory[0].id).toEqual(mockResult.id);
      expect(savedData.testHistory[0].wpm).toEqual(mockResult.wpm);
      expect(savedData.testHistory[0].accuracy).toEqual(mockResult.accuracy);
      expect(savedData.testHistory[0].timeElapsed).toEqual(
        mockResult.timeElapsed,
      );
      expect(savedData.testHistory[0].timestamp).toEqual(
        (typeof mockResult.timestamp === 'string'
          ? new Date(mockResult.timestamp)
          : mockResult.timestamp
        ).toISOString(),
      );
      expect(savedData.testHistory[0].difficulty).toEqual(
        mockResult.difficulty,
      );
      expect(savedData.testHistory[0].textSampleId).toEqual(
        mockResult.textSampleId,
      );
    });

    it('handles sessionStorage setItem errors', () => {
      const mockResult: TestResult = {
        id: 'test-1',
        wpm: 60,
        accuracy: 95,
        timeElapsed: 120,
        timestamp: new Date('2026-02-24T12:00:00Z'),
        difficulty: 'medium' as DifficultyLevel,
        textSampleId: 'sample-1',
      };

      // Mock sessionStorage setItem to throw error
      sessionStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should not throw error
      expect(() => {
        saveTestResult(mockResult);
      }).not.toThrow();
    });
  });

  describe('getTestHistory', () => {
    it('retrieves test history from session storage', () => {
      const mockHistory: TestResult[] = [
        {
          id: 'test-1',
          wpm: 60,
          accuracy: 95,
          timeElapsed: 120,
          timestamp: new Date('2026-02-24T12:00:00Z'),
          difficulty: 'medium' as DifficultyLevel,
          textSampleId: 'sample-1',
        },
      ];

      sessionStorageMock.getItem.mockReturnValue(
        JSON.stringify({ testHistory: mockHistory }),
      );

      const history = getTestHistory();

      expect(history).toHaveLength(1);
      // Compare dates as strings since JSON serialization converts Date to string
      expect(history[0].id).toEqual(mockHistory[0].id);
      expect(history[0].wpm).toEqual(mockHistory[0].wpm);
      expect(history[0].accuracy).toEqual(mockHistory[0].accuracy);
      expect(history[0].timeElapsed).toEqual(mockHistory[0].timeElapsed);
      expect(history[0].timestamp).toEqual(mockHistory[0].timestamp);
      expect(history[0].difficulty).toEqual(mockHistory[0].difficulty);
      expect(history[0].textSampleId).toEqual(mockHistory[0].textSampleId);
      expect(sessionStorageMock.getItem).toHaveBeenCalledWith(
        'typing-speed.data',
      );
    });

    it('returns empty array when no history exists', () => {
      sessionStorageMock.getItem.mockReturnValue(null);

      const history = getTestHistory();

      expect(history).toEqual([]);
    });

    it('handles corrupted session storage data', () => {
      sessionStorageMock.getItem.mockReturnValue('invalid json');

      const history = getTestHistory();

      expect(history).toEqual([]);
    });

    it('handles missing testHistory property', () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      const history = getTestHistory();

      expect(history).toEqual([]);
    });
  });

  describe('clearTestHistory', () => {
    it('clears test history from session storage', () => {
      const mockHistory: TestResult[] = [
        {
          id: 'test-1',
          wpm: 60,
          accuracy: 95,
          timeElapsed: 120,
          timestamp: new Date('2026-02-24T12:00:00Z'),
          difficulty: 'medium' as DifficultyLevel,
          textSampleId: 'sample-1',
        },
      ];

      sessionStorageMock.getItem.mockReturnValue(
        JSON.stringify({ testHistory: mockHistory }),
      );

      clearTestHistory();

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'typing-speed.data',
        JSON.stringify({ testHistory: [], currentTest: null }),
      );
    });

    it('handles empty session storage', () => {
      // mockStorage is already empty from beforeEach

      clearTestHistory();

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'typing-speed.data',
        JSON.stringify({ testHistory: [], currentTest: null }),
      );
    });

    it('handles sessionStorage setItem errors', () => {
      sessionStorageMock.getItem.mockReturnValue(
        JSON.stringify({ testHistory: [] }),
      );
      sessionStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw error
      expect(() => {
        clearTestHistory();
      }).not.toThrow();
    });
  });

  describe('saveCurrentTest', () => {
    it('saves current test to session storage', () => {
      const mockTest: TypingTest = {
        id: 'test-1',
        textSample: {
          id: 'sample-1',
          content: 'Test text',
          difficulty: 'medium' as DifficultyLevel,
          wordCount: 2,
          characterCount: 9,
        },
        userInput: 'Test',
        startTime: new Date('2026-02-24T12:00:00Z'),
        endTime: null,
        isActive: true,
        difficulty: 'medium' as DifficultyLevel,
      };

      sessionStorageMock.getItem.mockReturnValue(
        JSON.stringify({ testHistory: [] }),
      );

      saveCurrentTest(mockTest);

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'typing-speed.data',
        expect.stringContaining('"currentTest"'),
      );
    });

    it('handles empty session storage', () => {
      const mockTest: TypingTest = {
        id: 'test-1',
        textSample: {
          id: 'sample-1',
          content: 'Test text',
          difficulty: 'medium' as DifficultyLevel,
          wordCount: 2,
          characterCount: 9,
        },
        userInput: 'Test',
        startTime: new Date('2026-02-24T12:00:00Z'),
        endTime: null,
        isActive: true,
        difficulty: 'medium' as DifficultyLevel,
      };

      sessionStorageMock.getItem.mockReturnValue(null);

      saveCurrentTest(mockTest);

      const savedData = JSON.parse(
        sessionStorageMock.setItem.mock.calls[0][1],
      ) as SessionData;
      // Compare dates as strings since JSON serialization converts Date to string
      expect(savedData.currentTest?.id).toEqual(mockTest.id);
      expect(savedData.currentTest?.textSample).toEqual(mockTest.textSample);
      expect(savedData.currentTest?.userInput).toEqual(mockTest.userInput);
      expect(savedData.currentTest?.startTime).toEqual(
        mockTest.startTime?.toISOString(),
      );
      expect(savedData.currentTest?.endTime).toEqual(mockTest.endTime);
      expect(savedData.currentTest?.isActive).toEqual(mockTest.isActive);
      expect(savedData.currentTest?.difficulty).toEqual(mockTest.difficulty);
    });

    it('handles sessionStorage errors', () => {
      const mockTest: TypingTest = {
        id: 'test-1',
        textSample: {
          id: 'sample-1',
          content: 'Test text',
          difficulty: 'medium' as DifficultyLevel,
          wordCount: 2,
          characterCount: 9,
        },
        userInput: 'Test',
        startTime: new Date('2026-02-24T12:00:00Z'),
        endTime: null,
        isActive: true,
        difficulty: 'medium' as DifficultyLevel,
      };

      sessionStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        saveCurrentTest(mockTest);
      }).not.toThrow();
    });
  });

  describe('getCurrentTest', () => {
    it('retrieves current test from session storage', () => {
      const mockTest: TypingTest = {
        id: 'test-1',
        textSample: {
          id: 'sample-1',
          content: 'Test text',
          difficulty: 'medium' as DifficultyLevel,
          wordCount: 2,
          characterCount: 9,
        },
        userInput: 'Test',
        startTime: new Date('2026-02-24T12:00:00Z'),
        endTime: null,
        isActive: true,
        difficulty: 'medium' as DifficultyLevel,
      };

      sessionStorageMock.getItem.mockReturnValue(
        JSON.stringify({ testHistory: [], currentTest: mockTest }),
      );

      const currentTest = getCurrentTest();

      // Compare dates as strings since JSON serialization converts Date to string
      expect(currentTest?.id).toEqual(mockTest.id);
      expect(currentTest?.textSample).toEqual(mockTest.textSample);
      expect(currentTest?.userInput).toEqual(mockTest.userInput);
      expect(currentTest?.startTime).toEqual(mockTest.startTime?.toISOString());
      expect(currentTest?.endTime).toEqual(mockTest.endTime);
      expect(currentTest?.isActive).toEqual(mockTest.isActive);
      expect(currentTest?.difficulty).toEqual(mockTest.difficulty);
    });

    it('returns null when no current test exists', () => {
      sessionStorageMock.getItem.mockReturnValue(null);

      const currentTest = getCurrentTest();

      expect(currentTest).toBeNull();
    });

    it('handles corrupted session storage data', () => {
      sessionStorageMock.getItem.mockReturnValue('invalid json');

      const currentTest = getCurrentTest();

      expect(currentTest).toBeNull();
    });

    it('handles missing currentTest property', () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      const currentTest = getCurrentTest();

      expect(currentTest).toBeNull();
    });

    it('handles sessionStorage getItem errors in getTestHistory', () => {
      sessionStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const history = getTestHistory();

      expect(history).toEqual([]);
    });

    it('handles sessionStorage getItem errors in getCurrentTest', () => {
      sessionStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const currentTest = getCurrentTest();

      expect(currentTest).toBeNull();
    });
  });

  describe('clearCurrentTest', () => {
    it('clears current test from session storage', () => {
      const mockTest: TypingTest = {
        id: 'test-1',
        textSample: {
          id: 'sample-1',
          content: 'Test text',
          difficulty: 'medium' as DifficultyLevel,
          wordCount: 2,
          characterCount: 9,
        },
        userInput: 'Test',
        startTime: new Date('2026-02-24T12:00:00Z'),
        endTime: null,
        isActive: true,
        difficulty: 'medium' as DifficultyLevel,
      };

      sessionStorageMock.getItem.mockReturnValue(
        JSON.stringify({ testHistory: [], currentTest: mockTest }),
      );

      clearCurrentTest();

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'typing-speed.data',
        JSON.stringify({ testHistory: [], currentTest: null }),
      );
    });

    it('handles empty session storage', () => {
      sessionStorageMock.getItem.mockReturnValue(null);

      clearCurrentTest();

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'typing-speed.data',
        JSON.stringify({ testHistory: [], currentTest: null }),
      );
    });

    it('handles sessionStorage errors', () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify({}));
      sessionStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        clearCurrentTest();
      }).not.toThrow();
    });
  });
});
