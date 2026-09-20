// MəktəbPlus - Yerli Yaddaş və Firebase Firestore İnteqrasiyalı Məlumat Xidməti (Storage Service)

import { MOCK_LESSONS } from '../data/lessons.js';
import { MOCK_EXAMS } from '../data/exams.js';
import { MOCK_PVP_QUESTIONS } from '../data/pvpQuestions.js';
import { firebaseConfig, useRealFirebase } from './firebase-config.js';

// Firebase Modular SDK
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

let db = null;
let isFirestoreReady = false;
const listeners = new Set();

// Firebase Başlatma
try {
  if (useRealFirebase) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isFirestoreReady = true;
    console.log('🔥 [Firebase] TDV E-School Firestore uğurla qoşuldu:', firebaseConfig.projectId);
  }
} catch (e) {
  console.warn('⚠️ [Firebase] Qoşulma xətası, yerli yaddaşdan istifadə olunur:', e);
}

const STORAGE_KEYS = {
  LESSONS: 'mekteb_plus_lessons_v10',
  EXAMS: 'mekteb_plus_exams_v1',
  PVP_QUESTIONS: 'mekteb_plus_pvp_questions_v1',
  USER_STATS: 'mekteb_plus_user_stats_v1',
  THEME: 'mekteb_plus_theme_v1',
  LEADERBOARD: 'mekteb_plus_leaderboard_v1',
  SEEDED: 'mekteb_plus_firestore_seeded_v1'
};

export const StorageService = {
  // Realtime Dəyişiklik İzləyicisi
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  notifyListeners(type, data) {
    listeners.forEach(cb => {
      try { cb(type, data); } catch (e) { console.error(e); }
    });
  },

  // Firestore ilə Sinxronizasiyanı Başlat
  initSync(onUpdate) {
    if (onUpdate) this.subscribe(onUpdate);
    if (!isFirestoreReady || !db) return;

    // 1. Dərsləri Firestore-dan oxu və canlı izlə
    try {
      onSnapshot(collection(db, 'lessons'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudLessons = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(cloudLessons));
          this.notifyListeners('lessons', cloudLessons);
        } else {
          // Baza boşdursa ilkin dərsləri yüklə (Seed)
          this.seedCollection('lessons', this.getLessons());
        }
      }, (err) => console.warn('Firestore lessons snapshot error:', err));
    } catch (e) { console.warn(e); }

    // 2. İmtahanları oxu və canlı izlə
    try {
      onSnapshot(collection(db, 'exams'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudExams = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(cloudExams));
          this.notifyListeners('exams', cloudExams);
        } else {
          this.seedCollection('exams', this.getExams());
        }
      }, (err) => console.warn('Firestore exams snapshot error:', err));
    } catch (e) { console.warn(e); }

    // 3. PvP Suallarını oxu və canlı izlə
    try {
      onSnapshot(collection(db, 'pvp_questions'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudQuestions = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          localStorage.setItem(STORAGE_KEYS.PVP_QUESTIONS, JSON.stringify(cloudQuestions));
          this.notifyListeners('pvp_questions', cloudQuestions);
        } else {
          this.seedCollection('pvp_questions', this.getPvpQuestions());
        }
      }, (err) => console.warn('Firestore pvp_questions snapshot error:', err));
    } catch (e) { console.warn(e); }

    // 4. Liderlik Cədvəlini oxu və canlı izlə
    try {
      onSnapshot(collection(db, 'leaderboard'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudLeaderboard = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          cloudLeaderboard.sort((a, b) => (b.points || 0) - (a.points || 0));
          cloudLeaderboard.forEach((item, index) => { item.rank = index + 1; });
          localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(cloudLeaderboard));
          this.notifyListeners('leaderboard', cloudLeaderboard);
        }
      }, (err) => console.warn('Firestore leaderboard snapshot error:', err));
    } catch (e) { console.warn(e); }
  },

  // İlkin məlumatları Firestore-a yükləmə (Seeding)
  async seedCollection(colName, items) {
    if (!isFirestoreReady || !db || !Array.isArray(items)) return;
    try {
      console.log(`🌱 [Firestore Seed] '${colName}' kolleksiyası doldurulur (${items.length} element)...`);
      for (const item of items) {
        const docId = String(item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);
        await setDoc(doc(db, colName, docId), JSON.parse(JSON.stringify(item)), { merge: true });
      }
      console.log(`✅ [Firestore Seed] '${colName}' uğurla tamamlandı!`);
    } catch (e) {
      console.warn(`Firestore seed error for ${colName}:`, e);
    }
  },

  // Dərsləri oxu
  getLessons() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LESSONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error reading lessons:', e);
    }
    return MOCK_LESSONS;
  },

  // Yeni dərs əlavə et
  saveLesson(newLesson) {
    const lessons = this.getLessons();
    const updated = [newLesson, ...lessons];
    try {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage save lesson error:', e);
    }

    // Firestore-a yaz
    if (isFirestoreReady && db) {
      const docId = String(newLesson.id || Date.now());
      setDoc(doc(db, 'lessons', docId), JSON.parse(JSON.stringify(newLesson)), { merge: true })
        .catch(err => console.error('Firestore saveLesson error:', err));
    }

    this.notifyListeners('lessons', updated);
    return updated;
  },

  // İmtahanları oxu
  getExams() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXAMS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error reading exams:', e);
    }
    return MOCK_EXAMS;
  },

  // İmtahana yeni sual əlavə et və ya yeni imtahan yarat
  saveExam(newExam) {
    const exams = this.getExams();
    const existingIndex = exams.findIndex(e => e.id === newExam.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...exams];
      updated[existingIndex] = newExam;
    } else {
      updated = [newExam, ...exams];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage save exam error:', e);
    }

    // Firestore-a yaz
    if (isFirestoreReady && db) {
      const docId = String(newExam.id || Date.now());
      setDoc(doc(db, 'exams', docId), JSON.parse(JSON.stringify(newExam)), { merge: true })
        .catch(err => console.error('Firestore saveExam error:', err));
    }

    this.notifyListeners('exams', updated);
    return updated;
  },

  // Mövcud imtahana yeni sual calaq et
  addQuestionToExam(examId, question) {
    const exams = this.getExams();
    const exam = exams.find(e => e.id === examId);
    if (!exam) return false;

    if (!Array.isArray(exam.questions)) {
      exam.questions = [];
    }
    exam.questions.push(question);
    exam.totalQuestions = exam.questions.length;
    this.saveExam(exam);
    return exam;
  },

  // PvP suallarını oxu
  getPvpQuestions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PVP_QUESTIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error reading PvP questions:', e);
    }
    return MOCK_PVP_QUESTIONS;
  },

  // PvP sualı əlavə et
  addPvpQuestion(question) {
    const list = this.getPvpQuestions();
    const updated = [question, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.PVP_QUESTIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage save PvP question error:', e);
    }

    // Firestore-a yaz
    if (isFirestoreReady && db) {
      const docId = String(question.id || Date.now());
      setDoc(doc(db, 'pvp_questions', docId), JSON.parse(JSON.stringify(question)), { merge: true })
        .catch(err => console.error('Firestore addPvpQuestion error:', err));
    }

    this.notifyListeners('pvp_questions', updated);
    return updated;
  },

  // Bütün bazanı JSON kimi ixrac et
  exportDatabaseJson() {
    const data = {
      version: '2.0-firestore',
      exportedAt: new Date().toISOString(),
      lessons: this.getLessons(),
      exams: this.getExams(),
      pvpQuestions: this.getPvpQuestions()
    };
    return JSON.stringify(data, null, 2);
  },

  // Xarici JSON-u bazaya idxal et
  importDatabaseJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.lessons && Array.isArray(parsed.lessons)) {
        localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(parsed.lessons));
        if (isFirestoreReady && db) this.seedCollection('lessons', parsed.lessons);
      }
      if (parsed.exams && Array.isArray(parsed.exams)) {
        localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(parsed.exams));
        if (isFirestoreReady && db) this.seedCollection('exams', parsed.exams);
      }
      if (parsed.pvpQuestions && Array.isArray(parsed.pvpQuestions)) {
        localStorage.setItem(STORAGE_KEYS.PVP_QUESTIONS, JSON.stringify(parsed.pvpQuestions));
        if (isFirestoreReady && db) this.seedCollection('pvp_questions', parsed.pvpQuestions);
      }
      return { success: true, message: 'Məlumat bazası uğurla idxal edildi və Firestore ilə sinxronlaşdırıldı!' };
    } catch (e) {
      return { success: false, message: 'Yanlış JSON formatı: ' + e.message };
    }
  },

  // Standart vəziyyətə sıfırla
  resetToDefault() {
    try {
      localStorage.removeItem(STORAGE_KEYS.LESSONS);
      localStorage.removeItem(STORAGE_KEYS.EXAMS);
      localStorage.removeItem(STORAGE_KEYS.PVP_QUESTIONS);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // İstifadəçi profil və statistikaları
  getUserStats() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return {
      name: 'Şagird',
      grade: 10,
      pvpScore: 1420,
      pvpWins: 12,
      pvpMatches: 15,
      completedLessons: 6,
      examsCompleted: 4,
      xp: 3200
    };
  },

  updateUserStats(updater) {
    const current = this.getUserStats();
    const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  // Canlı Liderlər Cədvəli
  getLeaderboard() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    const user = this.getUserStats();
    return [
      {
        id: 'real-user-1',
        rank: 1,
        name: user.name || 'Şagird',
        schoolGrade: user.grade || 10,
        avatar: '🧑‍🎓',
        points: user.pvpScore || 1420,
        wins: user.pvpWins || 0,
        winRate: user.pvpMatches > 0 ? Math.round(((user.pvpWins || 0) / user.pvpMatches) * 100) : 100,
        badge: '🎖️ Fəal İştirakçı'
      }
    ];
  },

  recordMatchToLeaderboard(playerName, grade, won, pointsGained) {
    const list = this.getLeaderboard();
    const existing = list.find(u => u.name === playerName);
    let targetUser;

    if (existing) {
      existing.points = Math.max(0, (existing.points || 0) + pointsGained);
      if (won) existing.wins = (existing.wins || 0) + 1;
      targetUser = existing;
    } else {
      targetUser = {
        id: `user_${playerName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
        rank: list.length + 1,
        name: playerName,
        schoolGrade: grade,
        avatar: '🧑‍🎓',
        points: pointsGained,
        wins: won ? 1 : 0,
        winRate: won ? 100 : 0,
        badge: '⚡ Yeni Oyunçu'
      };
      list.push(targetUser);
    }

    list.sort((a, b) => b.points - a.points);
    list.forEach((item, index) => { item.rank = index + 1; });
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
    } catch (e) {}

    // Firestore leaderboard kolleksiyasına yaz
    if (isFirestoreReady && db) {
      const docId = targetUser.id;
      setDoc(doc(db, 'leaderboard', docId), JSON.parse(JSON.stringify(targetUser)), { merge: true })
        .catch(err => console.error('Firestore recordMatch error:', err));
    }

    this.notifyListeners('leaderboard', list);
    return list;
  }
};
