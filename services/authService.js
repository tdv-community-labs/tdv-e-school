// TDV Community Labs - Vahid Ekosistem Profili və SSO Xidməti (Unified Ecosystem SSO)
// Tək bir profil bütün ekosistemə (E-School, TDV Sports, Games, Mafia) bəs edir!

const SESSION_KEY = 'tdv_ecosystem_session_v1';
const BROKER_URL = 'https://tdv-community-hubs.vercel.app/sso-broker.html';

let brokerIframe = null;
let brokerReady = false;
const brokerQueue = [];

function getOrCreateBroker() {
  if (typeof window === 'undefined') return null;
  if (brokerIframe) return brokerIframe;

  try {
    brokerIframe = document.createElement('iframe');
    brokerIframe.src = BROKER_URL;
    brokerIframe.style.display = 'none';
    brokerIframe.style.position = 'absolute';
    brokerIframe.style.width = '0';
    brokerIframe.style.height = '0';
    brokerIframe.style.border = '0';
    brokerIframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(brokerIframe);

    window.addEventListener('message', (e) => {
      if (!e.origin.includes('vercel.app') && !e.origin.includes('localhost')) return;
      if (e.data && e.data.type === 'TDV_SSO_BROKER_READY') {
        brokerReady = true;
        while (brokerQueue.length) {
          const fn = brokerQueue.shift();
          try { fn(); } catch(err) {}
        }
      }
    });
  } catch(e) {
    console.warn('[SSO Broker] Başladıla bilmədi:', e);
  }
  return brokerIframe;
}

function sendToBroker(msg) {
  if (typeof window === 'undefined') return;
  getOrCreateBroker();
  const send = () => {
    if (brokerIframe && brokerIframe.contentWindow) {
      brokerIframe.contentWindow.postMessage(msg, '*');
    }
  };
  if (brokerReady) {
    send();
  } else {
    brokerQueue.push(send);
    setTimeout(send, 800); // Fallback timeout
  }
}

export const authService = {
  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notify(session) {
    this.listeners.forEach(fn => {
      try { fn(session); } catch(e) {}
    });
  },

  /**
   * Cari aktiv vahid profili oxuyur.
   */
  getSession() {
    if (typeof window === 'undefined') return null;

    // 1. URL-dən keçid biletini yoxla (?sso_ticket=...)
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
          
          sendToBroker({ type: 'TDV_SSO_SET', session: sessionData });
          this.updateOutboundLinks(sessionData);
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
          this.updateOutboundLinks(session);
          return session;
        } else if (session) {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {}

    // 3. Əgər yerli yaddaşda yoxdursa, mərkəzi brokerdən avtomatik soruş
    this.syncFromBroker();
    return null;
  },

  /**
   * Mərkəzi Hub-dan vahid profili soruşur və gəldikdə portala avtomatik buraxır
   */
  syncFromBroker() {
    if (typeof window === 'undefined') return;
    const reqId = 'sync_' + Date.now();

    const handler = (e) => {
      if (!e.origin.includes('vercel.app') && !e.origin.includes('localhost')) return;
      if (e.data && e.data.type === 'TDV_SSO_DATA' && e.data.requestId === reqId) {
        window.removeEventListener('message', handler);
        if (e.data.session) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(e.data.session));
          this.updateOutboundLinks(e.data.session);
          this.notify(e.data.session);
        }
      }
    };
    window.addEventListener('message', handler);

    sendToBroker({ type: 'TDV_SSO_GET', requestId: reqId });
  },

  /**
   * Tək Vahid Profil ilə Giriş
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
      schoolClass: cleanGrade > 0 ? `${cleanGrade}A` : 'Müəllim',
      role: role || 'student',
      avatar: avatar,
      ecosystem: {
        eschool: { active: true, grade: cleanGrade },
        sports: { team: `${cleanGrade}A`, role: 'player' },
        games: { nickname: trimmed },
        mafia: { tier: 'TIER_1', roleTitle: 'Klub Oyunçusu' }
      },
      token: 'tdv_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      sendToBroker({ type: 'TDV_SSO_SET', session: session });
      this.updateOutboundLinks(session);
      this.notify(session);
    } catch (e) {}

    return session;
  },

  /**
   * Yeni Vahid Profil Qeydiyyatı (Bütün platformalar üçün 1 tək profil)
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
      ecosystem: {
        eschool: { active: true, grade: cleanGrade },
        sports: { team: finalClass, role: 'player' },
        games: { nickname: trimmedUser },
        mafia: { tier: 'TIER_1', roleTitle: 'Klub Oyunçusu' }
      },
      token: 'tdv_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    };

    try {
      const regUsersRaw = localStorage.getItem('tdv_registered_users_v1');
      const regUsers = regUsersRaw ? JSON.parse(regUsersRaw) : [];
      regUsers.push({ ...session, pin: pin || '' });
      localStorage.setItem('tdv_registered_users_v1', JSON.stringify(regUsers));
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      sendToBroker({ type: 'TDV_SSO_SET', session: session, users: regUsers });
      this.updateOutboundLinks(session);
      this.notify(session);
    } catch (e) {}

    return session;
  },

  loginWithDemo(type = 'student-10') {
    if (type === 'student-11') {
      return this.login('Murad Məmmədov', 11, '1100', 'student');
    }
    if (type === 'teacher') {
      return this.login('Aysel Müəllimə', 0, 'teacher2026', 'teacher');
    }
    return this.login('Orxan Əliyev', 10, '1000', 'student');
  },

  logout() {
    try {
      localStorage.removeItem(SESSION_KEY);
      sendToBroker({ type: 'TDV_SSO_LOGOUT' });
      this.updateOutboundLinks(null);
      this.notify(null);
    } catch (e) {}
  },

  createSsoTicket(session) {
    if (!session) return '';
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(session))));
    } catch (e) {
      return '';
    }
  },

  updateOutboundLinks(session) {
    if (typeof document === 'undefined') return;
    const ticket = session ? this.createSsoTicket(session) : '';
    const selector = 'a[href*="vercel.app"]';
    document.querySelectorAll(selector).forEach(link => {
      const base = link.getAttribute('data-base-href') || link.href.split('?')[0];
      link.setAttribute('data-base-href', base);
      if (ticket) {
        link.href = base + (base.endsWith('/') ? '' : '/') + '?sso_ticket=' + encodeURIComponent(ticket);
      } else {
        link.href = base;
      }
    });
  }
};
