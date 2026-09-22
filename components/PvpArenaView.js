// MəktəbPlus - 1v1 PvP Viktorina Arenası (Real-time Multiplayer Simulation)

import React, { useState, useEffect, useRef } from 'react';
import { PvpEngine } from '../services/pvpEngine.js';
import { StorageService } from '../services/storageService.js';
import { KatexRenderer } from './KatexRenderer.js';

export const PvpArenaView = ({
  pvpQuestions,
  userStats,
  onUpdateStats
}) => {
  // Arenanın cari mərhələsi: 'lobby', 'matchmaking', 'battle', 'gameover'
  const [stage, setStage] = useState('lobby');
  
  // Otaq rejimi: 'quick' və ya 'friend'
  const [matchMode, setMatchMode] = useState('quick');
  const [createdRoomCode, setCreatedRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [copyNotification, setCopyNotification] = useState(false);

  // Oyunçu və Rəqib vəziyyətləri
  const [opponent, setOpponent] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [matchQuestions, setMatchQuestions] = useState([]);
  
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [opponentStreak, setOpponentStreak] = useState(0);

  const [timeLeft, setTimeLeft] = useState(15);
  const [playerSelectedKey, setPlayerSelectedKey] = useState(null);
  const [opponentSelectedKey, setOpponentSelectedKey] = useState(null);
  const [roundEnded, setRoundEnded] = useState(false);
  
  const [battleHistory, setBattleHistory] = useState([]); // Hər raundun nəticəsi
  const [leaderboard, setLeaderboard] = useState(() => StorageService.getLeaderboard());

  const roundTimerRef = useRef(null);
  const botTimeoutRef = useRef(null);
  const questionStartTimeRef = useRef(Date.now());

  // 1. Təsadüfi Rəqib Axtarışını Başlat
  const startQuickMatch = () => {
    setMatchMode('quick');
    setStage('matchmaking');

    // 2-3 saniyəlik axtarış effekti
    setTimeout(() => {
      const bot = PvpEngine.getRandomBot();
      setOpponent(bot);
      
      // Təsadüfi 5 sual seçirik
      const shuffled = [...pvpQuestions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 5);
      setMatchQuestions(selectedQuestions);

      // Oyuna başla
      startBattle(bot, selectedQuestions);
    }, 2200);
  };

  // 2. Dostla Oynamaq üçün Otaq Yarat
  const createFriendRoom = () => {
    const code = PvpEngine.generateRoomCode();
    setCreatedRoomCode(code);
    setMatchMode('friend');
  };

  // 3. Otaq Kodu ilə Qoşul
  const joinFriendRoom = () => {
    if (!inputRoomCode.trim()) return;
    setStage('matchmaking');
    setTimeout(() => {
      const friendOpponent = {
        name: `Dost (${inputRoomCode.toUpperCase()})`,
        grade: 10,
        avatar: '🎮',
        school: 'Dəvət Olunmuş Oyunçu',
        rating: 1750,
        accuracy: 0.8
      };
      setOpponent(friendOpponent);
      const shuffled = [...pvpQuestions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      setMatchQuestions(selected);
      startBattle(friendOpponent, selected);
    }, 1500);
  };

  // 4. Döyüşü Başlat
  const startBattle = (opp, qList) => {
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerStreak(0);
    setOpponentStreak(0);
    setCurrentQuestionIndex(0);
    setBattleHistory([]);
    setStage('battle');
    initRound(0, qList, opp);
  };

  // 5. Raundu Başlat
  const initRound = (qIndex, qList, opp) => {
    const currentQ = qList[qIndex];
    if (!currentQ) return;

    setTimeLeft(15);
    setPlayerSelectedKey(null);
    setOpponentSelectedKey(null);
    setRoundEnded(false);
    questionStartTimeRef.current = Date.now();

    // Rəqib Botun cavab simulyasiyası
    if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    const botPlan = PvpEngine.simulateBotAnswer(currentQ, opp);
    
    botTimeoutRef.current = setTimeout(() => {
      setOpponentSelectedKey(botPlan.chosenKey);
    }, botPlan.timeSpent * 1000);
  };

  // 6. 15 Saniyəlik Raund Taymeri
  useEffect(() => {
    if (stage !== 'battle' || roundEnded) return;

    roundTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(roundTimerRef.current);
          handleRoundTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(roundTimerRef.current);
  }, [stage, currentQuestionIndex, roundEnded]);

  // Vaxt bitdikdə raundu yekunlaşdır
  const handleRoundTimeout = () => {
    finalizeRound(playerSelectedKey, opponentSelectedKey || 'TIMEOUT');
  };

  // Oyunçu Cavab Seçdikdə
  const handlePlayerAnswer = (key) => {
    if (playerSelectedKey || roundEnded) return;

    const timeSpent = (Date.now() - questionStartTimeRef.current) / 1000;
    setPlayerSelectedKey(key);

    // Əgər rəqib hələ cavab verməyibsə, bir azdan və ya vaxt bitəndə raund bağlansın
    setTimeout(() => {
      if (!roundEnded) {
        finalizeRound(key, opponentSelectedKey);
      }
    }, 1200);
  };

  // Raundun yekunlaşdırılması və xalların yazılması
  const finalizeRound = (pKey, oKey) => {
    if (roundEnded) return;
    setRoundEnded(true);
    clearInterval(roundTimerRef.current);
    clearTimeout(botTimeoutRef.current);

    const currentQ = matchQuestions[currentQuestionIndex];
    const isPlayerCorrect = pKey === currentQ.correctKey;
    const isOpponentCorrect = oKey === currentQ.correctKey;

    const timeSpent = (Date.now() - questionStartTimeRef.current) / 1000;
    
    let nextPStreak = isPlayerCorrect ? playerStreak + 1 : 0;
    let nextOStreak = isOpponentCorrect ? opponentStreak + 1 : 0;
    
    const pPoints = PvpEngine.calculateScore(isPlayerCorrect, timeSpent, playerStreak);
    const oPoints = PvpEngine.calculateScore(isOpponentCorrect, Math.random() * 5 + 3, opponentStreak);

    setPlayerScore(prev => prev + pPoints);
    setOpponentScore(prev => prev + oPoints);
    setPlayerStreak(nextPStreak);
    setOpponentStreak(nextOStreak);

    setBattleHistory(prev => [
      ...prev,
      {
        question: currentQ.text,
        correctKey: currentQ.correctKey,
        pKey,
        oKey,
        isPlayerCorrect,
        isOpponentCorrect,
        pPoints,
        oPoints
      }
    ]);

    // 2.5 saniyə sonra növbəti suala və ya finişə keç
    setTimeout(() => {
      if (currentQuestionIndex < matchQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        initRound(nextIndex, matchQuestions, opponent);
      } else {
        finishMatch(playerScore + pPoints, opponentScore + oPoints);
      }
    }, 2800);
  };

  // Matçı Bitir
  const finishMatch = (finalPlayerScore, finalOpponentScore) => {
    setStage('gameover');

    const isVictory = finalPlayerScore > finalOpponentScore;
    if (isVictory && window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const pointsGained = isVictory ? 60 : 15;

    // Yalnız real oyunçunun nəticəsini qeyd edirik (olmayan adamlar yazılmır)
    const updatedLeaderboard = StorageService.recordMatchToLeaderboard(
      userStats?.name || 'Şagird',
      userStats?.grade || 10,
      isVictory,
      pointsGained
    );
    setLeaderboard(updatedLeaderboard);

    if (onUpdateStats) {
      onUpdateStats(prev => ({
        ...prev,
        pvpScore: prev.pvpScore + pointsGained,
        pvpWins: prev.pvpWins + (isVictory ? 1 : 0),
        pvpMatches: prev.pvpMatches + 1,
        xp: prev.xp + (isVictory ? 150 : 50)
      }));
    }
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(createdRoomCode);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2000);
  };

  const currentQ = matchQuestions[currentQuestionIndex];

  // =========================================================================
  // 1. MATCHMAKING EKRANI
  // =========================================================================
  if (stage === 'matchmaking') {
    return React.createElement(
      'div',
      { className: 'min-h-[500px] flex flex-col items-center justify-center space-y-6 text-center animate-fadeIn p-6' },
      React.createElement(
        'div',
        { className: 'relative flex items-center justify-center' },
        React.createElement('div', { className: 'w-24 h-24 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin' }),
        React.createElement('span', { className: 'absolute text-3xl' }, '⚔️')
      ),
      React.createElement(
        'div',
        null,
        React.createElement('h3', { className: 'text-xl font-black text-slate-800 dark:text-slate-100' }, 'Rəqib Axtarılır...'),
        React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, 'Səviyyənizə uyğun şagird tapılır və suallar hazırlanır')
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-2 text-xs font-mono text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-4 py-2 rounded-xl' },
        React.createElement('span', { className: 'animate-pulse' }, '●'),
        React.createElement('span', null, 'Azərbaycan Üzrə Şəbəkəyə Qoşulur...')
      )
    );
  }

  // =========================================================================
  // 2. DÖYÜŞ ARENA EKRANI (BATTLE)
  // =========================================================================
  if (stage === 'battle' && currentQ) {
    const pPercentage = Math.min((playerScore / 1000) * 100, 100);
    const oPercentage = Math.min((opponentScore / 1000) * 100, 100);

    return React.createElement(
      'div',
      { className: 'max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16 no-print' },
      
      // Yuxarı Xal və Oyunçular Barları (Split Screen)
      React.createElement(
        'div',
        { className: 'grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg relative overflow-hidden' },
        
        // Mərkəzi 15s Taymer Dairəsi
        React.createElement(
          'div',
          { className: 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10' },
          React.createElement(
            'div',
            {
              className: `w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono font-black shadow-lg border-4 transition-all ${
                timeLeft <= 3
                  ? 'bg-rose-600 border-rose-300 text-white animate-bounce'
                  : 'bg-white dark:bg-slate-900 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              }`
            },
            React.createElement('span', { className: 'text-base leading-none' }, timeLeft),
            React.createElement('span', { className: 'text-[8px] uppercase tracking-tighter' }, 'san')
          )
        ),

        // Sol: Oyunçu (Sən)
        React.createElement(
          'div',
          { className: 'space-y-2 pr-8' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2' },
            React.createElement('span', { className: 'text-2xl' }, '🧑‍🎓'),
            React.createElement(
              'div',
              { className: 'min-w-0' },
              React.createElement('div', { className: 'text-xs font-black text-slate-800 dark:text-slate-100 truncate' }, userStats?.name || 'Sən'),
              React.createElement('div', { className: 'text-[10px] text-amber-500 font-bold' }, playerStreak > 1 ? `🔥 ${playerStreak}x Kombo` : '10-cu sinif')
            )
          ),
          React.createElement(
            'div',
            { className: 'text-xl font-black text-indigo-600 dark:text-indigo-400' },
            `${playerScore} XP`
          ),
          // Xal Tərəqqi Barı
          React.createElement(
            'div',
            { className: 'w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden' },
            React.createElement('div', {
              className: 'h-full bg-indigo-600 transition-all duration-500 rounded-full',
              style: { width: `${pPercentage}%` }
            })
          ),
          playerSelectedKey && React.createElement(
            'span',
            { className: 'inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse' },
            '✓ Cavabınız qeydə alındı'
          )
        ),

        // Sağ: Rəqib
        React.createElement(
          'div',
          { className: 'space-y-2 pl-8 text-right' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-end space-x-2' },
            React.createElement(
              'div',
              { className: 'min-w-0' },
              React.createElement('div', { className: 'text-xs font-black text-slate-800 dark:text-slate-100 truncate' }, opponent?.name || 'Rəqib'),
              React.createElement('div', { className: 'text-[10px] text-amber-500 font-bold' }, opponentStreak > 1 ? `🔥 ${opponentStreak}x Kombo` : `${opponent?.rating || 1800} Reytinq`)
            ),
            React.createElement('span', { className: 'text-2xl' }, opponent?.avatar || '👩‍🎓')
          ),
          React.createElement(
            'div',
            { className: 'text-xl font-black text-cyan-600 dark:text-cyan-400' },
            `${opponentScore} XP`
          ),
          // Xal Barı
          React.createElement(
            'div',
            { className: 'w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex justify-end' },
            React.createElement('div', {
              className: 'h-full bg-cyan-500 transition-all duration-500 rounded-full',
              style: { width: `${oPercentage}%` }
            })
          ),
          opponentSelectedKey ? React.createElement(
            'span',
            { className: 'inline-block text-[10px] font-bold text-cyan-500 animate-pulse' },
            '⚡ Rəqib cavab verdi'
          ) : React.createElement(
            'span',
            { className: 'inline-block text-[10px] text-slate-400' },
            'Düşünür...'
          )
        )
      ),

      // Sual Kartı və Variantlar
      React.createElement(
        'div',
        { className: 'bento-card p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6' },
        
        React.createElement(
          'div',
          { className: 'flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800' },
          React.createElement('span', { className: 'text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600' }, `Raund ${currentQuestionIndex + 1} / ${matchQuestions.length}`),
          React.createElement('span', { className: 'text-xs text-slate-400' }, 'Sürətli cavaba görə +50 əlavə XP')
        ),

        // Sual mətni
        React.createElement(
          'div',
          { className: 'text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100' },
          React.createElement(KatexRenderer, { text: currentQ.text })
        ),

        // Variantlar
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
          currentQ.options.map(opt => {
            const isUserChoice = playerSelectedKey === opt.key;
            let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400';

            if (roundEnded) {
              if (opt.key === currentQ.correctKey) {
                btnStyle = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold scale-[1.02] shadow-sm';
              } else if (isUserChoice && opt.key !== currentQ.correctKey) {
                btnStyle = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-800 dark:text-rose-200 font-bold';
              }
            } else if (isUserChoice) {
              btnStyle = 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-md';
            }

            return React.createElement(
              'button',
              {
                key: opt.key,
                onClick: () => handlePlayerAnswer(opt.key),
                disabled: roundEnded || playerSelectedKey !== null,
                className: `p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-center space-x-3 transition-all transform active:scale-98 ${btnStyle}`
              },
              React.createElement(
                'span',
                { className: `w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                  isUserChoice && !roundEnded ? 'bg-white text-indigo-700' : 'bg-slate-200 dark:bg-slate-700'
                }` },
                opt.key
              ),
              React.createElement('div', { className: 'flex-1 font-semibold' },
                React.createElement(KatexRenderer, { text: opt.text })
              )
            );
          })
        ),

        // Raundun Canlı Nəticəsi (Əgər raund bitibsə)
        roundEnded && React.createElement(
          'div',
          { className: 'p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs font-bold animate-fadeIn' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2' },
            React.createElement('span', null, playerSelectedKey === currentQ.correctKey ? '🎉 Düzgün cavab verdiniz!' : '❌ Təəssüf, yanlış cavab!'),
            React.createElement('span', { className: 'text-slate-400' }, `(Doğru variant: ${currentQ.correctKey})`)
          ),
          React.createElement('span', { className: 'text-indigo-600 dark:text-indigo-400 font-black' }, 'Növbəti sual yüklənir...')
        )
      )
    );
  }

  // =========================================================================
  // 3. OYUN BİTDİ / NƏTİCƏ EKRANI (GAMEOVER)
  // =========================================================================
  if (stage === 'gameover') {
    const isVictory = playerScore > opponentScore;
    const isDraw = playerScore === opponentScore;

    return React.createElement(
      'div',
      { className: 'max-w-2xl mx-auto space-y-6 animate-fadeIn pb-16 text-center' },
      
      React.createElement(
        'div',
        { className: 'bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6' },
        
        React.createElement(
          'div',
          { className: 'text-6xl animate-bounce' },
          isVictory ? '🏆' : isDraw ? '🤝' : '💔'
        ),
        React.createElement(
          'div',
          null,
          React.createElement('h2', { className: 'text-3xl font-black text-slate-800 dark:text-slate-100' },
            isVictory ? 'Möhtəşəm Qələbə!' : isDraw ? 'Heç-heçə Oldu!' : 'Məğlubiyyət'
          ),
          React.createElement('p', { className: 'text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1' },
            isVictory ? 'Təbriklər! Rəqibdən daha sürətli və dəqiq cavab verdiniz.' : 'Yaxşı mübarizə idi, növbəti matçda qələbə sizin olacaq!'
          )
        ),

        // Hesab Müqayisəsi
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700' },
          React.createElement(
            'div',
            { className: 'text-center border-r border-slate-200 dark:border-slate-700' },
            React.createElement('div', { className: 'text-xs text-slate-400 font-bold uppercase' }, userStats?.name || 'Sən'),
            React.createElement('div', { className: 'text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1' }, playerScore),
            React.createElement('div', { className: 'text-[11px] text-emerald-500 font-bold' }, isVictory ? '+150 Bonus XP' : '+50 Təcrübə')
          ),
          React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement('div', { className: 'text-xs text-slate-400 font-bold uppercase' }, opponent?.name || 'Rəqib'),
            React.createElement('div', { className: 'text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-1' }, opponentScore),
            React.createElement('div', { className: 'text-[11px] text-slate-400' }, `${opponent?.rating || 1800} Reytinq`)
          )
        ),

        // Əməliyyat Düymələri
        React.createElement(
          'div',
          { className: 'flex flex-wrap gap-3 justify-center pt-2' },
          React.createElement(
            'button',
            {
              onClick: startQuickMatch,
              className: 'px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition'
            },
            'Yenidən Oyna (Təsadüfi Rəqib)'
          ),
          React.createElement(
            'button',
            {
              onClick: () => setStage('lobby'),
              className: 'px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition'
            },
            'Lobbiyə Qayıt'
          )
        )
      )
    );
  }

  // =========================================================================
  // 4. ƏSAS LOBBY VƏ LİDERLƏR CƏDVƏLİ (LOBBY)
  // =========================================================================
  return React.createElement(
    'div',
    { className: 'space-y-8 animate-fadeIn pb-16 no-print' },
    
    // Yuxarı Başlıq
    React.createElement(
      'div',
      { className: 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl' },
      React.createElement(
        'div',
        { className: 'max-w-2xl' },
        React.createElement('span', { className: 'text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-white/20 backdrop-blur-md' }, '1v1 PvP Duel Arenası'),
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black mt-2' }, 'Biliyini Sına, Rəqibləri Üstələ!'),
        React.createElement('p', { className: 'text-xs sm:text-sm text-amber-100 mt-1' }, 'Hər sual üçün 15 saniyə, sürətli cavaba görə ekstra xallar və canlı liderlik reytinqi.')
      )
    ),

    // Otaq Seçimləri: Təsadüfi Rəqib və Dostla Oyna
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
      
      // 1. Təsadüfi Rəqib (Quick Match)
      React.createElement(
        'div',
        { className: 'bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4' },
        React.createElement(
          'div',
          { className: 'space-y-2' },
          React.createElement('div', { className: 'w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-2xl' }, '⚡'),
          React.createElement('h3', { className: 'font-black text-lg text-slate-800 dark:text-slate-100' }, 'Təsadüfi Rəqib (Sürətli Matç)'),
          React.createElement('p', { className: 'text-xs text-slate-500 dark:text-slate-400 leading-relaxed' },
            'Respublika üzrə sizinlə eyni sinifdə oxuyan təsadüfi şagirdlə və ya zəka botu ilə 5 suallıq sürətli dueldə yarışın.'
          )
        ),
        React.createElement(
          'button',
          {
            onClick: startQuickMatch,
            className: 'w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition'
          },
          'Dərhal Matça Başla ⚔️'
        )
      ),

      // 2. Dostla Oyna (Otaq Kodu)
      React.createElement(
        'div',
        { className: 'bento-card p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-4' },
        React.createElement(
          'div',
          { className: 'space-y-1' },
          React.createElement('div', { className: 'w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-2xl' }, '👥'),
          React.createElement('h3', { className: 'font-black text-lg text-slate-800 dark:text-slate-100' }, 'Dostla Oyna (Otaq Kodu)'),
          React.createElement('p', { className: 'text-xs text-slate-500 dark:text-slate-400' }, 'Xüsusi 6 rəqəmli kod yaradın və ya dostunuzun göndərdiyi kodu daxil edin.')
        ),

        // Otaq Yarat və ya Qoşul
        React.createElement(
          'div',
          { className: 'space-y-3 pt-2' },
          !createdRoomCode ? React.createElement(
            'button',
            {
              onClick: createFriendRoom,
              className: 'w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition'
            },
            'Yeni Otaq Kodu Yarat'
          ) : React.createElement(
            'div',
            { className: 'p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between' },
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-[10px] text-indigo-500 font-bold uppercase' }, 'Sizin Otaq Kodunuz:'),
              React.createElement('div', { className: 'text-lg font-mono font-black text-indigo-700 dark:text-indigo-300' }, createdRoomCode)
            ),
            React.createElement(
              'button',
              {
                onClick: copyRoomLink,
                className: 'px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700'
              },
              copyNotification ? 'Kopyalandı!' : 'Kodu Kopyala'
            )
          ),

          // Koda görə qoşul
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2' },
            React.createElement('input', {
              type: 'text',
              value: inputRoomCode,
              onChange: e => setInputRoomCode(e.target.value.toUpperCase()),
              placeholder: 'Dostunun kodunu yaz (məs: AZ89X2)',
              className: 'flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 uppercase font-mono'
            }),
            React.createElement(
              'button',
              {
                onClick: joinFriendRoom,
                disabled: !inputRoomCode.trim(),
                className: 'px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs'
              },
              'Qoşul'
            )
          )
        )
      )
    ),

    // 5. Həftəlik Liderlər Cədvəli (Leaderboard)
    React.createElement(
      'div',
      { className: 'bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement('i', { className: 'fas fa-trophy text-amber-500 text-lg' }),
          React.createElement('h3', { className: 'font-black text-base text-slate-800 dark:text-slate-100' }, 'Liderlər Cədvəli'),
          React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' }, 'Yalnız Real Oyunçular')
        ),
        React.createElement('span', { className: 'text-xs text-slate-400 font-semibold' }, `${leaderboard.length} İştirakçı`)
      ),

      leaderboard.length === 0 ? React.createElement(
        'div',
        { className: 'py-8 text-center text-xs text-slate-400' },
        React.createElement('i', { className: 'fas fa-users-slash text-2xl mb-2 block' }),
        'Hələ ki heç bir real oyunçu qeydə alınmayıb. İlk oyunu oynayaraq liderlər cədvəlində yer alın!'
      ) : React.createElement(
        'div',
        { className: 'overflow-x-auto' },
        React.createElement(
          'table',
          { className: 'w-full text-left text-xs' },
          React.createElement(
            'thead',
            { className: 'text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800' },
            React.createElement(
              'tr',
              null,
              React.createElement('th', { className: 'py-2 px-3' }, '#'),
              React.createElement('th', { className: 'py-2 px-3' }, 'Şagird'),
              React.createElement('th', { className: 'py-2 px-3' }, 'Sinif'),
              React.createElement('th', { className: 'py-2 px-3' }, 'Qələbə Nisbəti'),
              React.createElement('th', { className: 'py-2 px-3' }, 'Xal (XP)'),
              React.createElement('th', { className: 'py-2 px-3 text-right' }, 'Titul / Status')
            )
          ),
          React.createElement(
            'tbody',
            { className: 'divide-y divide-slate-100 dark:divide-slate-800/60' },
            leaderboard.map(user => {
              return React.createElement(
                'tr',
                { key: user.id, className: 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition' },
                React.createElement(
                  'td',
                  { className: 'py-3 px-3 font-black text-slate-400' },
                  user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank
                ),
                React.createElement(
                  'td',
                  { className: 'py-3 px-3 font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2' },
                  React.createElement('span', { className: 'text-base' }, user.avatar || '🧑‍🎓'),
                  React.createElement('span', null, user.name)
                ),
                React.createElement('td', { className: 'py-3 px-3 text-slate-500' }, `${user.schoolGrade}-ci sinif`),
                React.createElement('td', { className: 'py-3 px-3 text-emerald-600 font-bold' }, `${user.winRate}% (${user.wins} Q)`),
                React.createElement('td', { className: 'py-3 px-3 font-black text-indigo-600 dark:text-indigo-400' }, `${user.points} XP`),
                React.createElement('td', { className: 'py-3 px-3 text-right' },
                  React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' }, user.badge || '⚡ Real İştirakçı')
                )
              );
            })
          )
        )
      )
    )
  );
};
