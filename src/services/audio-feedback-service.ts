/**
 * 音声フィードバックサービス（Phase 4）
 * CBT問題専用・アクセシビリティ対応・パフォーマンス最適化
 */

import { Audio } from "expo-av";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AudioFeedbackConfig {
  enableSoundEffects: boolean;
  enableVoiceFeedback: boolean;
  soundVolume: number;
  voiceVolume: number;
  voiceSpeed: number;
  preferredLanguage: "ja" | "en";
}

export interface SoundEffectDefinition {
  id: string;
  name: string;
  category: "ui" | "feedback" | "navigation" | "alert" | "cbt";
  duration: number;
  frequency?: number; // Hz for generated tones
  pattern?: number[]; // Vibration pattern
  description: string;
}

export class AudioFeedbackService {
  private static instance: AudioFeedbackService;
  private isInitialized = false;
  private soundCache = new Map<string, Audio.Sound>();
  private config: AudioFeedbackConfig;
  private synthesizedSounds = new Map<string, string>();

  // 音声効果の定義
  private readonly soundEffects: SoundEffectDefinition[] = [
    // 基本UI音
    {
      id: "tap",
      name: "タップ音",
      category: "ui",
      duration: 100,
      frequency: 1000,
      description: "ボタンタップ時の音",
    },
    {
      id: "navigation",
      name: "ナビゲーション音",
      category: "navigation",
      duration: 150,
      frequency: 800,
      description: "画面遷移時の音",
    },
    {
      id: "focus",
      name: "フォーカス音",
      category: "ui",
      duration: 80,
      frequency: 1200,
      description: "要素フォーカス時の音",
    },

    // フィードバック音
    {
      id: "success",
      name: "成功音",
      category: "feedback",
      duration: 300,
      frequency: 1500,
      description: "正解・成功時の音",
    },
    {
      id: "error",
      name: "エラー音",
      category: "feedback",
      duration: 400,
      frequency: 400,
      description: "不正解・エラー時の音",
    },
    {
      id: "warning",
      name: "警告音",
      category: "alert",
      duration: 250,
      frequency: 600,
      description: "警告・注意時の音",
    },
    {
      id: "info",
      name: "情報音",
      category: "feedback",
      duration: 200,
      frequency: 1000,
      description: "情報表示時の音",
    },

    // CBT専用音
    {
      id: "question_start",
      name: "問題開始音",
      category: "cbt",
      duration: 200,
      frequency: 900,
      description: "問題開始時の音",
    },
    {
      id: "answer_submit",
      name: "解答送信音",
      category: "cbt",
      duration: 150,
      frequency: 1100,
      description: "解答送信時の音",
    },
    {
      id: "timer_warning",
      name: "時間警告音",
      category: "cbt",
      duration: 300,
      frequency: 800,
      pattern: [0, 200, 100, 200],
      description: "制限時間警告音",
    },
    {
      id: "exam_complete",
      name: "試験完了音",
      category: "cbt",
      duration: 500,
      frequency: 1200,
      description: "試験完了時の音",
    },

    // アクセシビリティ音
    {
      id: "screen_reader_on",
      name: "スクリーンリーダー開始音",
      category: "alert",
      duration: 250,
      frequency: 1300,
      description: "スクリーンリーダー有効化時の音",
    },
    {
      id: "high_contrast_on",
      name: "ハイコントラスト開始音",
      category: "alert",
      duration: 200,
      frequency: 1100,
      description: "ハイコントラストモード有効化時の音",
    },
  ];

  private constructor() {
    this.config = {
      enableSoundEffects: true,
      enableVoiceFeedback: true,
      soundVolume: 0.7,
      voiceVolume: 0.8,
      voiceSpeed: 1.0,
      preferredLanguage: "ja",
    };
  }

  public static getInstance(): AudioFeedbackService {
    if (!AudioFeedbackService.instance) {
      AudioFeedbackService.instance = new AudioFeedbackService();
    }
    return AudioFeedbackService.instance;
  }

  /**
   * 音声システムの初期化
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 設定の読み込み
      await this.loadConfig();

      // 音声モードの設定
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // 基本的な音声効果を事前生成
      await this.preloadBasicSounds();

      this.isInitialized = true;
      console.log("[AudioFeedbackService] 音声システム初期化完了");
    } catch (error) {
      console.error("[AudioFeedbackService] 初期化エラー:", error);
      throw error;
    }
  }

  /**
   * 設定の読み込み
   */
  private async loadConfig(): Promise<void> {
    try {
      const savedConfig = await AsyncStorage.getItem("audio_feedback_config");
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.warn("[AudioFeedbackService] 設定読み込みエラー:", error);
    }
  }

  /**
   * 設定の保存
   */
  public async saveConfig(
    newConfig: Partial<AudioFeedbackConfig>,
  ): Promise<void> {
    try {
      this.config = { ...this.config, ...newConfig };
      await AsyncStorage.setItem(
        "audio_feedback_config",
        JSON.stringify(this.config),
      );
    } catch (error) {
      console.error("[AudioFeedbackService] 設定保存エラー:", error);
    }
  }

  /**
   * 基本音声の事前読み込み
   */
  private async preloadBasicSounds(): Promise<void> {
    const basicSounds = ["tap", "success", "error", "navigation"];

    await Promise.all(
      basicSounds.map(async (soundId) => {
        try {
          await this.generateToneSound(soundId);
        } catch (error) {
          console.warn(
            `[AudioFeedbackService] 音声生成エラー (${soundId}):`,
            error,
          );
        }
      }),
    );
  }

  /**
   * トーン音の生成
   */
  private async generateToneSound(
    soundId: string,
  ): Promise<Audio.Sound | null> {
    const soundDef = this.soundEffects.find((s) => s.id === soundId);
    if (!soundDef?.frequency) return null;

    try {
      // Web Audio APIによるトーン生成（Web環境）
      if (Platform.OS === "web") {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          soundDef.frequency,
          audioContext.currentTime,
        );
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          this.config.soundVolume,
          audioContext.currentTime + 0.01,
        );
        gainNode.gain.linearRampToValueAtTime(
          0,
          audioContext.currentTime + soundDef.duration / 1000,
        );

        const buffer = audioContext.createBuffer(
          1,
          (audioContext.sampleRate * soundDef.duration) / 1000,
          audioContext.sampleRate,
        );
        const dataURL = this.bufferToDataURL(buffer);

        this.synthesizedSounds.set(soundId, dataURL);
        return null; // Web環境では Audio.Sound を使用しない
      }

      // ネイティブ環境では外部ライブラリまたは事前録音された音声ファイルを使用
      return null;
    } catch (error) {
      console.warn(
        `[AudioFeedbackService] トーン生成エラー (${soundId}):`,
        error,
      );
      return null;
    }
  }

  /**
   * AudioBufferをData URLに変換（Web用）
   */
  private bufferToDataURL(buffer: AudioBuffer): string {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(length * 2);
    const view = new DataView(arrayBuffer);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(
        i * 2,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true,
      );
    }

    const blob = new Blob([arrayBuffer], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  }

  /**
   * 音声効果の再生
   */
  public async playSoundEffect(
    soundId: string,
    options: { volume?: number; delay?: number } = {},
  ): Promise<void> {
    if (!this.config.enableSoundEffects || !this.isInitialized) return;

    const { volume = this.config.soundVolume, delay = 0 } = options;

    try {
      const executePlay = async () => {
        if (Platform.OS === "web") {
          // Web環境での再生
          const dataURL = this.synthesizedSounds.get(soundId);
          if (dataURL) {
            const audio = new Audio(dataURL);
            audio.volume = volume;
            await audio.play();
          }
        } else {
          // ネイティブ環境での再生
          let sound = this.soundCache.get(soundId);

          if (!sound) {
            sound = await this.generateToneSound(soundId);
            if (sound) {
              this.soundCache.set(soundId, sound);
            }
          }

          if (sound) {
            await sound.setVolumeAsync(volume);
            await sound.replayAsync();
          }
        }
      };

      if (delay > 0) {
        setTimeout(executePlay, delay);
      } else {
        await executePlay();
      }
    } catch (error) {
      console.warn(
        `[AudioFeedbackService] 音声再生エラー (${soundId}):`,
        error,
      );
    }
  }

  /**
   * CBT専用フィードバック音の再生
   */
  public async playCBTFeedback(
    action:
      | "correct"
      | "incorrect"
      | "navigate"
      | "submit"
      | "timer_warning"
      | "complete",
    questionType?: "journal" | "ledger" | "trial_balance",
  ): Promise<void> {
    const soundMap = {
      correct: "success",
      incorrect: "error",
      navigate: "navigation",
      submit: "answer_submit",
      timer_warning: "timer_warning",
      complete: "exam_complete",
    };

    const soundId = soundMap[action];
    await this.playSoundEffect(soundId);

    // 問題タイプ別の追加フィードバック
    if (questionType && action === "correct") {
      setTimeout(() => {
        this.playSoundEffect("info", { volume: 0.5 });
      }, 300);
    }
  }

  /**
   * アクセシビリティ状態変更の音声通知
   */
  public async playAccessibilityNotification(
    type:
      | "screen_reader_on"
      | "screen_reader_off"
      | "high_contrast_on"
      | "high_contrast_off",
  ): Promise<void> {
    const soundId = type.endsWith("_on") ? type : "info";
    await this.playSoundEffect(soundId, { volume: 0.8 });
  }

  /**
   * 音声効果のテスト
   */
  public async testSoundEffects(): Promise<void> {
    if (!this.isInitialized) {
      console.warn("[AudioFeedbackService] 音声システムが初期化されていません");
      return;
    }

    console.log("[AudioFeedbackService] 音声効果テスト開始");
    const testSounds = ["tap", "success", "error", "warning", "info"];

    for (let i = 0; i < testSounds.length; i++) {
      const soundId = testSounds[i];
      console.log(`[AudioFeedbackService] テスト再生: ${soundId}`);
      await this.playSoundEffect(soundId);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("[AudioFeedbackService] 音声効果テスト完了");
  }

  /**
   * 音声効果の一覧取得
   */
  public getSoundEffects(): SoundEffectDefinition[] {
    return [...this.soundEffects];
  }

  /**
   * 現在の設定取得
   */
  public getConfig(): AudioFeedbackConfig {
    return { ...this.config };
  }

  /**
   * リソースのクリーンアップ
   */
  public async cleanup(): Promise<void> {
    try {
      // 音声リソースの解放
      for (const [soundId, sound] of this.soundCache) {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.warn(
            `[AudioFeedbackService] 音声解放エラー (${soundId}):`,
            error,
          );
        }
      }
      this.soundCache.clear();

      // 合成音声のクリーンアップ
      if (Platform.OS === "web") {
        for (const [soundId, dataURL] of this.synthesizedSounds) {
          try {
            URL.revokeObjectURL(dataURL);
          } catch (error) {
            console.warn(
              `[AudioFeedbackService] URL解放エラー (${soundId}):`,
              error,
            );
          }
        }
      }
      this.synthesizedSounds.clear();

      this.isInitialized = false;
      console.log("[AudioFeedbackService] クリーンアップ完了");
    } catch (error) {
      console.error("[AudioFeedbackService] クリーンアップエラー:", error);
    }
  }
}

// シングルトンインスタンスのエクスポート
export const audioFeedbackService = AudioFeedbackService.getInstance();
