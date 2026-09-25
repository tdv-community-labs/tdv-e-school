// MəktəbPlus - 1v1 PvP Mühərriki
// QEYD: Real olmayan şəxs adları daxil edilmir. Tək oyunçu rejimi üçün şəffaf AI Məşqçi Botları təqdim olunur.

export const BOT_OPPONENTS = [
  {
    name: 'AI Zəka Botu (Təlimçi)',
    grade: 10,
    avatar: '🤖',
    school: 'Süni İntellekt Simulyatoru',
    rating: 1500,
    accuracy: 0.75
  },
  {
    name: 'AI Məşqçi (Sürətli)',
    grade: 10,
    avatar: '⚡',
    school: 'Süni İntellekt Simulyatoru',
    rating: 1650,
    accuracy: 0.82
  },
  {
    name: 'AI Çempion (Yüksək Dərəcə)',
    grade: 11,
    avatar: '🧠',
    school: 'Süni İntellekt Simulyatoru',
    rating: 1850,
    accuracy: 0.88
  }
];

export const PvpEngine = {
  // FIX: Matchmaking race condition — eyni anda iki joinMatchmaking() çağırışını önlemək üçün lock flag
  _matchmakingLock: false,

  /**
   * Matchmaking kilidini alır. Artıq kilidlənibsə false qaytarır.
   * @returns {boolean} Kilidi alan oldu mu?
   */
  acquireMatchmakingLock() {
    if (this._matchmakingLock) return false;
    this._matchmakingLock = true;
    return true;
  },

  /**
   * Matchmaking kilidini azad edir.
   */
  releaseMatchmakingLock() {
    this._matchmakingLock = false;
  },

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  getRandomBot() {
    return BOT_OPPONENTS[Math.floor(Math.random() * BOT_OPPONENTS.length)];
  },

  // FIX: Score calculation — finite number validation + try/catch
  calculateScore(isCorrect, timeSpentSeconds, currentStreak) {
    try {
      if (!isCorrect) return 0;

      // Defensive check: qiymətlər sonlu ədəd olmalıdır
      const safeTime = Number.isFinite(timeSpentSeconds) ? timeSpentSeconds : 15;
      const safeStreak = Number.isFinite(currentStreak) && currentStreak >= 0 ? currentStreak : 0;

      let baseScore = 100;
      let speedBonus = 0;
      if (safeTime <= 3) {
        speedBonus = 50;
      } else if (safeTime <= 6) {
        speedBonus = 35;
      } else if (safeTime <= 10) {
        speedBonus = 20;
      } else {
        speedBonus = 5;
      }

      const streakBonus = Math.min(safeStreak * 15, 60);
      const total = baseScore + speedBonus + streakBonus;

      // Son nəticənin sonlu olduğunu təsdiq et
      return Number.isFinite(total) ? total : 0;
    } catch (e) {
      console.error('PvpEngine.calculateScore error:', e);
      return 0;
    }
  },

  simulateBotAnswer(question, botProfile) {
    try {
      const minTime = 3.5;
      const maxTime = 11.0;
      const timeSpent = parseFloat((Math.random() * (maxTime - minTime) + minTime).toFixed(1));
      const accuracy = Number.isFinite(botProfile?.accuracy) ? botProfile.accuracy : 0.75;
      const isCorrect = Math.random() <= accuracy;

      let chosenKey;
      if (isCorrect) {
        chosenKey = question?.correctKey || 'A';
      } else {
        const wrongOptions = (question?.options || [])
          .map(o => o.key)
          .filter(k => k !== question?.correctKey);
        chosenKey = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || 'A';
      }

      return {
        timeSpent,
        isCorrect,
        chosenKey
      };
    } catch (e) {
      console.error('PvpEngine.simulateBotAnswer error:', e);
      return { timeSpent: 8, isCorrect: false, chosenKey: 'A' };
    }
  },

  // FIX: Page refresh resilience — aktiv PvP sessiyasını localStorage-ə yaz
  saveSession(sessionData) {
    try {
      localStorage.setItem('pvp_active_session', JSON.stringify({
        ...sessionData,
        savedAt: Date.now()
      }));
    } catch (e) {
      console.warn('PvpEngine.saveSession error:', e);
    }
  },

  // FIX: Sessiya bərpası — səhifə yenilənmə zamanı aktiv oyunu bərpa et
  recoverSession() {
    try {
      const raw = localStorage.getItem('pvp_active_session');
      if (!raw) return null;
      const session = JSON.parse(raw);
      // 10 dəqiqədən köhnə sessiyanı etibarsız say
      if (!session?.savedAt || Date.now() - session.savedAt > 10 * 60 * 1000) {
        this.clearSession();
        return null;
      }
      return session;
    } catch (e) {
      console.warn('PvpEngine.recoverSession error:', e);
      return null;
    }
  },

  clearSession() {
    try {
      localStorage.removeItem('pvp_active_session');
    } catch (e) {}
  }
};
