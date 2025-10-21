// Browser notification sound utilities
// Uses native Web Audio API for cross-browser compatibility
/* eslint-disable */
export class NotificationSound {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio context (required for playing sounds)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Resume context if suspended (required by browser security)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio context not available:', error);
    }
  }

  async playMessageSound(): Promise<void> {
    await this.init();
    if (!this.audioContext) return;

    try {
      // Create a simple "ding" sound using OscillatorNode
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Connect nodes: oscillator -> gain -> destination (speakers)
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure sound: 1 second ding at 800Hz
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime); // 800Hz pitch
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime); // Moderate volume

      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

      // Start and stop
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  async playTypingSound(): Promise<void> {
    await this.init();
    if (!this.audioContext) return;

    try {
      // Subtle typing sound - very short and quiet
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Could not play typing sound:', error);
    }
  }
}

// Singleton instance for app-wide use
export const notificationSound = new NotificationSound();

// Quick access functions
export const playMessageSound = () => notificationSound.playMessageSound();
export const playTypingSound = () => notificationSound.playTypingSound();
