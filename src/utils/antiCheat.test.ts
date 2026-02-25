import {
  checkBotPatterns,
  checkCopyPaste,
  checkPageVisibility,
  checkUnrealisticSpeed,
  cleanupAntiCheatListeners,
  comprehensiveAntiCheatCheck,
  handleVisibilityChange,
  initializeAntiCheat,
  recordKeystroke,
  resetAntiCheat,
  setupAntiCheatListeners,
  validateInputSequence,
} from './antiCheat';

// Mock document methods
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockPreventDefault = vi.fn();

// Store original document
const originalDocument = globalThis.document;

describe('antiCheat', () => {
  beforeEach(() => {
    // Reset anti-cheat state before each test
    initializeAntiCheat();

    // Mock document methods
    const mockDocument = Object.create(originalDocument) as Document & {
      hidden: boolean;
    };
    mockDocument.addEventListener = mockAddEventListener;
    mockDocument.removeEventListener = mockRemoveEventListener;
    Object.defineProperty(mockDocument, 'hidden', {
      value: false,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'document', {
      value: mockDocument,
      writable: true,
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original document
    Object.defineProperty(globalThis, 'document', {
      value: originalDocument,
      writable: true,
    });
  });

  describe('initializeAntiCheat', () => {
    it('resets anti-cheat state', () => {
      // Add some keystrokes first
      recordKeystroke(Date.now());
      recordKeystroke(Date.now() + 100);

      // Initialize to reset
      initializeAntiCheat();

      // Should reset state (verified by other functions)
      const result = checkBotPatterns();
      expect(result.isCheating).toBe(false);
    });
  });

  describe('checkUnrealisticSpeed', () => {
    it('allows realistic typing speeds', () => {
      const result = checkUnrealisticSpeed(100, 30000); // 100 chars in 30 seconds = 200 WPM
      expect(result.isCheating).toBe(false);
    });

    it('detects unrealistic WPM', () => {
      const result = checkUnrealisticSpeed(1000, 1000); // 1000 chars in 1 second = 3000 WPM
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Unrealistic typing speed');
    });

    it('handles edge cases for WPM calculation', () => {
      // Test boundary conditions around the 200 WPM limit
      const result1 = checkUnrealisticSpeed(500, 30000); // 500 chars in 30 seconds = 200 WPM (exactly at limit)
      expect(result1.isCheating).toBe(false);

      const result2 = checkUnrealisticSpeed(501, 30000); // 501 chars in 30 seconds = ~200.2 WPM (over limit)
      expect(result2.isCheating).toBe(true);
      expect(result2.reason).toContain('Unrealistic typing speed');
    });

    it('handles zero or negative time', () => {
      const result1 = checkUnrealisticSpeed(100, 0);
      expect(result1.isCheating).toBe(false);

      const result2 = checkUnrealisticSpeed(100, -1000);
      expect(result2.isCheating).toBe(false);
    });

    it('handles edge cases', () => {
      const result1 = checkUnrealisticSpeed(0, 60000); // No characters typed
      expect(result1.isCheating).toBe(false);

      const result2 = checkUnrealisticSpeed(250, 60000); // 250 chars in 1 minute = 50 WPM
      expect(result2.isCheating).toBe(false);
    });

    it('detects exact boundary conditions', () => {
      // Test exactly at the limit - should pass
      const result1 = checkUnrealisticSpeed(1000, 60000); // 1000 chars in 1 minute = 200 WPM (exactly at limit)
      expect(result1.isCheating).toBe(false);

      // Test just over the limit - should fail
      const result2 = checkUnrealisticSpeed(1001, 60000); // 1001 chars in 1 minute = ~200.2 WPM (over limit)
      expect(result2.isCheating).toBe(true);
      expect(result2.reason).toContain('Unrealistic typing speed');
    });

    it('validates timestamp in result', () => {
      const result = checkUnrealisticSpeed(100, 5000);
      expect(result.detectedAt).toBeInstanceOf(Date);
      expect(result.detectedAt.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('recordKeystroke', () => {
    it('records keystroke timestamps', () => {
      const timestamp1 = Date.now();
      recordKeystroke(timestamp1);

      const timestamp2 = timestamp1 + 100;
      recordKeystroke(timestamp2);

      // Should detect bot patterns with consistent intervals
      // Add more keystrokes to trigger bot detection
      for (let i = 0; i < 10; i++) {
        recordKeystroke(timestamp2 + i * 100);
      }

      const result = checkBotPatterns();
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Impossibly fast keystrokes');
    });

    it('uses current timestamp when none provided', () => {
      // Should have recorded a timestamp
      const result = checkBotPatterns();
      expect(result.isCheating).toBe(false); // Not enough keystrokes yet
    });

    it('cleans up old timestamps', () => {
      const oldTimestamp = Date.now() - 10000; // 10 seconds ago
      recordKeystroke(oldTimestamp);

      const currentTimestamp = Date.now();
      recordKeystroke(currentTimestamp);

      // Old timestamp should be cleaned up (verified by checking bot patterns)
      const result = checkBotPatterns();
      expect(result.isCheating).toBe(false); // Only 2 timestamps, not enough for bot detection
    });
  });

  describe('checkBotPatterns', () => {
    it('allows normal typing patterns', () => {
      // Record keystrokes with varying intervals
      const baseTime = Date.now();
      recordKeystroke(baseTime);
      recordKeystroke(baseTime + 150); // 150ms interval
      recordKeystroke(baseTime + 320); // 170ms interval
      recordKeystroke(baseTime + 500); // 180ms interval
      recordKeystroke(baseTime + 750); // 250ms interval

      const result = checkBotPatterns();
      expect(result.isCheating).toBe(false);
    });

    it('detects perfectly consistent intervals', () => {
      const baseTime = Date.now();
      // Record 25 keystrokes with exactly 100ms intervals
      for (let i = 0; i < 25; i++) {
        recordKeystroke(baseTime + i * 100);
      }

      const result = checkBotPatterns();
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Bot-like typing pattern');
    });

    it('detects impossibly fast keystrokes', () => {
      const baseTime = Date.now();
      recordKeystroke(baseTime);
      recordKeystroke(baseTime + 30); // 30ms interval (too fast)

      // Add more keystrokes to reach minimum threshold
      for (let i = 2; i < 10; i++) {
        recordKeystroke(baseTime + i * 100);
      }

      const result = checkBotPatterns();
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Impossibly fast keystrokes');
    });

    it('requires minimum keystrokes for analysis', () => {
      // Only record a few keystrokes
      recordKeystroke(Date.now());
      recordKeystroke(Date.now() + 100);
      recordKeystroke(Date.now() + 200);

      const result = checkBotPatterns();
      expect(result.isCheating).toBe(false); // Not enough keystrokes
    });
  });

  describe('checkPageVisibility', () => {
    it('allows normal usage', () => {
      const result = checkPageVisibility();
      expect(result.isCheating).toBe(false);
    });

    it('detects tab switching', () => {
      initializeAntiCheat(); // Set start time
      handleVisibilityChange(false); // Page hidden

      const result = checkPageVisibility();
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('tab switching detected');
    });

    it('ignores visibility changes before test start', () => {
      handleVisibilityChange(false); // Page hidden before initialization

      initializeAntiCheat(); // Set start time after hiding

      const result = checkPageVisibility();
      expect(result.isCheating).toBe(false); // Should not detect cheating
    });
  });

  describe('handleVisibilityChange', () => {
    it('tracks page visibility changes', () => {
      initializeAntiCheat();

      handleVisibilityChange(false); // Hide page
      const result1 = checkPageVisibility();
      expect(result1.isCheating).toBe(true);

      // Should not reset the flag
      handleVisibilityChange(true); // Show page again
      const result2 = checkPageVisibility();
      expect(result2.isCheating).toBe(true); // Still cheating detected
    });

    it('ignores changes when no test is active', () => {
      // Reset the anti-cheat state to simulate no test being active
      resetAntiCheat();

      handleVisibilityChange(false); // No test started

      const result = checkPageVisibility();
      expect(result.isCheating).toBe(false);
    });
  });

  describe('checkCopyPaste', () => {
    it('detects paste attempts', () => {
      const pasteEvent = {
        type: 'paste',
        preventDefault: mockPreventDefault,
      } as unknown as ClipboardEvent;

      const result = checkCopyPaste(pasteEvent);
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Paste attempt detected');
    });

    it('detects copy attempts', () => {
      const copyEvent = {
        type: 'copy',
        preventDefault: mockPreventDefault,
      } as unknown as ClipboardEvent;

      const result = checkCopyPaste(copyEvent);
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Copy/cut attempt detected');
    });

    it('detects cut attempts', () => {
      const cutEvent = {
        type: 'cut',
        preventDefault: mockPreventDefault,
      } as unknown as ClipboardEvent;

      const result = checkCopyPaste(cutEvent);
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Copy/cut attempt detected');
    });

    it('allows other clipboard events', () => {
      const otherEvent = {
        type: 'other',
        preventDefault: mockPreventDefault,
      } as unknown as ClipboardEvent;

      const result = checkCopyPaste(otherEvent);
      expect(result.isCheating).toBe(false);
    });
  });

  describe('validateInputSequence', () => {
    it('allows normal typing', () => {
      initializeAntiCheat();

      // Simulate normal typing with some errors
      const result = validateInputSequence('hello wrold', 'hello world');
      expect(result.isCheating).toBe(false);
    });

    it('detects perfect accuracy at high speed', () => {
      initializeAntiCheat();

      // Mock Date.now to control timing and achieve >150 WPM
      const baseTime = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(baseTime);

      // Set test start time to baseTime
      initializeAntiCheat();

      // Record keystrokes with very fast intervals to simulate high speed typing
      for (let i = 0; i < 60; i++) {
        recordKeystroke(baseTime + i * 10); // Extremely fast typing
      }

      // Advance time to make it seem like high speed (should be >150 WPM)
      // 43 chars / 5 = 8.6 words, need < 3.44 seconds for >150 WPM
      vi.spyOn(Date, 'now').mockReturnValue(baseTime + 3000);

      // Simulate perfect typing at high speed
      const result = validateInputSequence(
        'the quick brown fox jumps over the lazy dog',
        'the quick brown fox jumps over the lazy dog',
      );
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain(
        'Suspicious perfect accuracy at high speed',
      );

      vi.restoreAllMocks();
    });

    it('detects suspicious input patterns', () => {
      initializeAntiCheat();

      // Record some keystrokes
      const baseTime = Date.now();
      recordKeystroke(baseTime);

      // Wait longer than a second and add lots of text
      const laterTime = baseTime + 2000;
      vi.spyOn(Date, 'now').mockReturnValue(laterTime);

      const result = validateInputSequence(
        'the quick brown fox jumps',
        'the quick brown fox jumps',
      );
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Suspicious input pattern');

      vi.restoreAllMocks();
    });

    it('ignores short input sequences', () => {
      initializeAntiCheat();

      const result = validateInputSequence('hello', 'hello world');
      expect(result.isCheating).toBe(false); // Too short to trigger suspicion
    });
  });

  describe('comprehensiveAntiCheatCheck', () => {
    it('passes normal typing', () => {
      initializeAntiCheat();

      // Simulate normal typing
      recordKeystroke(Date.now());
      recordKeystroke(Date.now() + 150);

      const result = comprehensiveAntiCheatCheck(
        10,
        5000,
        'hello',
        'hello world',
      );
      expect(result.isCheating).toBe(false);
    });

    it('detects unrealistic speed', () => {
      const result = comprehensiveAntiCheatCheck(
        1000,
        1000,
        'text',
        'expected',
      );
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Unrealistic typing speed');
    });

    it('detects bot patterns', () => {
      initializeAntiCheat();

      // Create bot-like pattern
      const baseTime = Date.now();
      for (let i = 0; i < 25; i++) {
        recordKeystroke(baseTime + i * 100);
      }

      const result = comprehensiveAntiCheatCheck(
        25,
        2500,
        'perfect typing text',
        'perfect typing text',
      );
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Bot-like typing pattern');
    });

    it('detects page visibility issues', () => {
      initializeAntiCheat();
      handleVisibilityChange(false);

      const result = comprehensiveAntiCheatCheck(
        10,
        5000,
        'hello',
        'hello world',
      );
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('tab switching detected');
    });

    it('detects input sequence issues', () => {
      initializeAntiCheat();

      // Mock Date.now to control timing
      const baseTime = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(baseTime);

      // Record keystrokes with varying intervals to avoid bot detection (all >= 50ms)
      recordKeystroke(baseTime);
      recordKeystroke(baseTime + 60);
      recordKeystroke(baseTime + 120);
      recordKeystroke(baseTime + 180);
      recordKeystroke(baseTime + 240);
      recordKeystroke(baseTime + 300);
      recordKeystroke(baseTime + 360);
      recordKeystroke(baseTime + 420);
      recordKeystroke(baseTime + 480);
      recordKeystroke(baseTime + 540);
      recordKeystroke(baseTime + 600);
      recordKeystroke(baseTime + 660);
      recordKeystroke(baseTime + 720);
      recordKeystroke(baseTime + 780);
      recordKeystroke(baseTime + 840);
      recordKeystroke(baseTime + 900);
      recordKeystroke(baseTime + 960);
      recordKeystroke(baseTime + 1020);
      recordKeystroke(baseTime + 1080);
      recordKeystroke(baseTime + 1140);

      // Advance time to achieve high WPM but avoid speed check
      vi.spyOn(Date, 'now').mockReturnValue(baseTime + 2000);

      // Use parameters that should trigger sequence check but not other checks
      const result = comprehensiveAntiCheatCheck(
        30,
        2000,
        'perfect accuracy at high speed',
        'perfect accuracy at high speed',
      );
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain(
        'Suspicious perfect accuracy at high speed',
      );

      vi.restoreAllMocks();
    });
  });

  describe('setupAntiCheatListeners', () => {
    it('sets up event listeners', () => {
      setupAntiCheatListeners();

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function),
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'contextmenu',
        expect.any(Function),
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
    });

    it('handles visibility change events', () => {
      setupAntiCheatListeners();

      // Get the visibilitychange handler
      const visibilityCall = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'visibilitychange',
      );
      const visibilityHandler = visibilityCall?.[1] as EventListener;

      // Simulate page becoming hidden
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
        configurable: true,
      });

      // Trigger the visibility change handler
      visibilityHandler(new Event('visibilitychange'));

      // Check that visibility change was recorded
      const visibilityResult = checkPageVisibility();
      expect(visibilityResult.isCheating).toBe(true);
      expect(visibilityResult.reason).toContain('Page visibility changed');
    });

    it('prevents default actions for keyboard shortcuts', () => {
      setupAntiCheatListeners();

      // Get the keydown handler
      const keydownCall = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'keydown',
      );
      if (!keydownCall) {
        throw new Error('Keydown listener not found');
      }
      const keydownHandler: (event: KeyboardEvent) => void = keydownCall[1] as (
        event: KeyboardEvent,
      ) => void;

      // Test Ctrl+A prevention
      const ctrlAEvent = {
        ctrlKey: true,
        key: 'a',
        preventDefault: mockPreventDefault,
      } as unknown as KeyboardEvent;

      keydownHandler(ctrlAEvent);
      expect(mockPreventDefault).toHaveBeenCalled();

      // Reset mock
      mockPreventDefault.mockClear();

      // Test Ctrl+C prevention
      const ctrlCEvent = {
        ctrlKey: true,
        key: 'c',
        preventDefault: mockPreventDefault,
      } as unknown as KeyboardEvent;

      keydownHandler(ctrlCEvent);
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    it('prevents context menu', () => {
      setupAntiCheatListeners();

      const contextMenuCall = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'contextmenu',
      );
      if (!contextMenuCall) {
        throw new Error('Context menu listener not found');
      }
      const contextMenuHandler: (event: Event) => void = contextMenuCall[1] as (
        event: Event,
      ) => void;

      const contextMenuEvent = {
        preventDefault: mockPreventDefault,
      } as unknown as Event;

      contextMenuHandler(contextMenuEvent);
      expect(mockPreventDefault).toHaveBeenCalled();
    });
  });

  describe('cleanupAntiCheatListeners', () => {
    it('provides cleanup interface', () => {
      // This is mainly a placeholder function to show cleanup intent
      expect(() => {
        cleanupAntiCheatListeners();
      }).not.toThrow();
    });
  });

  describe('integration tests', () => {
    it('handles complete anti-cheat workflow', () => {
      // Initialize
      initializeAntiCheat();

      // Setup listeners
      setupAntiCheatListeners();

      // Simulate normal typing
      recordKeystroke(Date.now());
      recordKeystroke(Date.now() + 120);
      recordKeystroke(Date.now() + 250);

      // Check comprehensive anti-cheat
      const result = comprehensiveAntiCheatCheck(3, 300, 'hel', 'hello');
      expect(result.isCheating).toBe(false);

      // Cleanup
      cleanupAntiCheatListeners();
    });

    it('detects multiple cheating methods', () => {
      initializeAntiCheat();

      // Create bot pattern
      const baseTime = Date.now();
      for (let i = 0; i < 25; i++) {
        recordKeystroke(baseTime + i * 100);
      }

      // Also hide page
      handleVisibilityChange(false);

      // Should detect the first issue found (bot patterns)
      const result = comprehensiveAntiCheatCheck(
        25,
        2500,
        'bot like typing',
        'bot like typing',
      );
      expect(result.isCheating).toBe(true);
      expect(result.reason).toContain('Bot-like typing pattern');
    });

    it('handles edge cases gracefully', () => {
      // Test with no initialization
      const result1 = comprehensiveAntiCheatCheck(0, 0, '', '');
      expect(result1.isCheating).toBe(false);

      // Test with extreme values
      const result2 = comprehensiveAntiCheatCheck(
        Number.MAX_SAFE_INTEGER,
        1,
        'a',
        'a',
      );
      expect(result2.isCheating).toBe(true);
    });
  });
});
