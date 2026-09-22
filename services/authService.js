// TDV Community Labs - Vahid Giriş Sistemi (Unified Ecosystem SSO & Session Service)

const SESSION_KEY = 'tdv_ecosystem_session_v1';

export const authService = {
  /**
   * Cari aktiv sessiyanı yoxlayır və qaytarır.
   * Əgər URL-də ?sso_ticket= varsa, onu təsdiqləyib sessiyaya çevirir.
   */
  getSession() {
    if (typeof window === 'undefined') return null;

    // 1. URL parametrlərindən SSO biletini yoxla
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ssoTicket = urlParams.get('sso_ticket');
      if (ssoTicket) {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(ssoTicket))));
        if (decoded && (decoded.username || decoded.userId)) {
          const sessionData = {
            ...decoded,
            expiresAt: decoded.expiresAt || (Date.now() + 30 * 24 * 60 * 60 * 1000)
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
          
          urlParams.delete('sso_ticket');
          const newSearch = urlParams.toString();
          const cleanUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
          
          return sessionData;
        }
      }
    } catch (e) {
      console.warn('⚠️ [SSO] Keçid bileti oxunarkən xəta:', e);
    }

    // 2. localStorage-də mövcud vahid sessiyanı yoxla
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.expiresAt && session.expiresAt > Date.now()) {
          return session;
        } else if (session) {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.warn('⚠️ [Auth] Sessiya oxunarkən xəta:', e);
    }

    return null;
  },

  /**
   * İstifadəçi adı, sinif və şifrə ilə daxilolma
   */
  login(username, grade = 10, pin = '', role = 'student') {
    const trimmed = (username || '').trim();
    if (!trimmed) throw new Error('Zəhmət olmasa istifadəçi adını və ya şagird kodunu daxil edin.');

    const cleanGrade = Number(grade) || 10;
    const avatar = role === 'teacher' ? '👨‍🏫' : (cleanGrade >= 10 ? '🧑‍🎓' : '🎒');

    const session = {
      userId: 'tdv-usr-' + Date.now().toString(36),
      username: trimmed,
      fullName: trimmed,
      grade: cleanGrade,
      schoolClass: `${cleanGrade}A`,
      role: role || 'student',
      avatar: avatar,
      token: 'tdv_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      const existingStatsRaw = localStorage.getItem('mekteb_plus_user_stats_v1');
      const existingStats = existingStatsRaw ? JSON.parse(existingStatsRaw) : {};
      localStorage.setItem('mekteb_plus_user_stats_v1', JSON.stringify({
        ...existingStats,
        name: session.fullName,
        grade: session.grade,
        avatar: session.avatar
      }));
    } catch (e) {
      console.error('⚠️ [Auth] Sessiya yaddaşa yazıla bilmədi:', e);
    }

    return session;
  },

  /**
   * Yeni istifadəçi qeydiyyatı (Ad, Soyad, İstifadəçi adı, Sinif, Şifrə və Avatar ilə)
   */
  register({ fullName, username, grade = 10, schoolClass = '', pin = '', avatar = '🧑‍🎓', role = 'student' }) {
    const trimmedUser = (username || '').trim();
    const trimmedName = (fullName || '').trim() || trimmedUser;
    if (!trimmedUser) throw new Error('Zəhmət olmasa istifadəçi adını daxil edin.');

    const cleanGrade = Number(grade) || 10;
    const finalClass = schoolClass || (cleanGrade > 0 ? `${cleanGrade}A` : 'Müəllim');
    const finalAvatar = avatar || (role === 'teacher' ? '👨‍🏫' : (cleanGrade >= 10 ? '🧑‍🎓' : '🎒'));

    const session = {
      userId: 'tdv-usr-' + Date.now().toString(36),
      username: trimmedUser,
      fullName: trimmedName,
      grade: cleanGrade,
      schoolClass: finalClass,
      role: role || 'student',
      avatar: finalAvatar,
      token: 'tdv_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    };

    try {
      const regUsersRaw = localStorage.getItem('tdv_registered_users_v1');
      const regUsers = regUsersRaw ? JSON.parse(regUsersRaw) : [];
      regUsers.push({
        ...session,
        pin: pin || ''
      });
      localStorage.setItem('tdv_registered_users_v1', JSON.stringify(regUsers));

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      const existingStatsRaw = localStorage.getItem('mekteb_plus_user_stats_v1');
      const existingStats = existingStatsRaw ? JSON.parse(existingStatsRaw) : {};
      localStorage.setItem('mekteb_plus_user_stats_v1', JSON.stringify({
        ...existingStats,
        name: session.fullName,
        grade: session.grade,
        avatar: session.avatar
      }));
    } catch (e) {
      console.error('⚠️ [Auth] Qeydiyyat yaddaşa yazıla bilmədi:', e);
    }

    return session;
  },

  /**
   * Sürətli şagird və ya müəllim testi üçün hazır profil girişi
   */
  loginWithDemo(type = 'student-10') {
    if (type === 'student-11') {
      return this.login('Murad Məmmədov', 11, '1100', 'student');
    }
    if (type === 'teacher') {
      return this.login('Aysel Müəllimə (Dəqiq Fənlər)', 10, 'teacher2026', 'teacher');
    }
    return this.login('Orxan Əliyev', 10, '1000', 'student');
  },

  /**
   * Çıxış funksiyası
   */
  logout() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('⚠️ [Auth] Sessiya silinmə xətası:', e);
    }
  },

  /**
   * Cross-domain SSO bilet generasiyası
   */
  createSsoTicket(session) {
    if (!session) return '';
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(session))));
    } catch (e) {
      return '';
    }
  }
};
