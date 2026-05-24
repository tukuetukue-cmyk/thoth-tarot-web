// Firebase Project Configuration (Test ENV)
// Please fill YOUR_API_KEY with the proper key generated in Firebase Console.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "cinnamonclove-7be76.firebaseapp.com",
    projectId: "cinnamonclove-7be76",
    storageBucket: "cinnamonclove-7be76.appspot.com",
    messagingSenderId: "338830155099",
    appId: "1:338830155099:web:aefb6cb077e680dc1d7f1d"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Global state
window.userPlan = 'free';
window.currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const userProfile = document.getElementById('user-profile');
    const userEmailSpan = document.getElementById('user-email');
    const userBadge = document.getElementById('user-badge');
    const authStatusMsg = document.getElementById('auth-status-msg');
    const historyBtn = document.getElementById('history-btn');
    const historyModal = document.getElementById('history-modal');
    const closeHistoryBtn = document.getElementById('close-history-btn');

    // 1. Auth Button Click (Opens Modal or Logs out)
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (window.currentUser) {
                if(confirm("ログアウトしますか？/ Log out?")) {
                    auth.signOut().then(() => {
                        window.location.reload();
                    });
                }
            } else {
                premiumModal.classList.add('active');
            }
        });
    }

    // 2. Close Modals
    if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', () => historyModal.classList.remove('active'));

    // 3. Google Sign in
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            googleLoginBtn.disabled = true;
            authStatusMsg.textContent = "Googleでログイン中... / Logging in...";
            try {
                const result = await auth.signInWithPopup(provider);
                authStatusMsg.textContent = "✨ ログイン成功！ / Success!";
                authStatusMsg.style.color = "var(--accent-gold)";
                
                // Initialize user profile in Firestore
                const userRef = db.collection('profiles').doc(result.user.uid);
                const doc = await userRef.get();
                if (!doc.exists) {
                    await userRef.set({
                        email: result.user.email,
                        premium: false,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                setTimeout(() => premiumModal.classList.remove('active'), 1500);
            } catch (error) {
                console.error("Auth Error:", error);
                authStatusMsg.textContent = "Error: " + error.message;
                authStatusMsg.style.color = "var(--error-color)";
                googleLoginBtn.disabled = false;
            }
        });
    }

    // 4. Removed

    // 5. Open History Modal & Load Data
    if (historyBtn) {
        historyBtn.addEventListener('click', async () => {
            if (!window.currentUser) return;
            historyModal.classList.add('active');
            await loadReadingHistory();
        });
    }

    // 6. Auth State Observer
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            window.currentUser = user;
            
            window.userPlan = 'free';
            updateUIForUser(user, isPremium);
            updatePremiumGates();
            
            if(googleLoginBtn) {
                googleLoginBtn.style.display = 'none';
                authStatusMsg.textContent = "✨ ログイン済みです / Logged in";
                authStatusMsg.style.color = "var(--accent-gold)";
            }
            
            const licenseContainer = document.getElementById('license-key-container');
            if(isPremium && licenseContainer) {
                licenseContainer.style.display = 'none';
            }
            
        } else {
            window.currentUser = null;
            window.userPlan = 'free';
            updateUIForUser(null, false);
            updatePremiumGates();
            if(googleLoginBtn) {
                 googleLoginBtn.style.display = 'block';
                 googleLoginBtn.disabled = false;
                 authStatusMsg.textContent = "Googleアカウントでログイン";
                 authStatusMsg.style.color = "var(--text-secondary)";
            }
            const licenseContainer = document.getElementById('license-key-container');
            if (licenseContainer) {
                licenseContainer.style.display = 'block';
            }
        }
    });

    // History Detail Modal Setup
    const historyDetailModal = document.getElementById('history-detail-modal');
    const closeHistoryDetailBtn = document.getElementById('close-history-detail-btn');
    const historyDetailContent = document.getElementById('history-detail-content');
    const reflectionContainer = document.getElementById('reflection-container');
    const reflectionText = document.getElementById('reflection-text');
    const getReflectionBtn = document.getElementById('get-reflection-btn');

    if (closeHistoryDetailBtn) {
        closeHistoryDetailBtn.addEventListener('click', () => {
            historyDetailModal.classList.remove('active');
        });
    }

    // --- Helper Functions ---
    function updateUIForUser(user, isPremium) {
        if (user) {
            authBtn.textContent = window.currentLang === 'en' ? 'Logout' : 'ログアウト';
            userProfile.classList.remove('hidden-section');
            userEmailSpan.textContent = user.email;
            userBadge.textContent = isPremium ? 'Premium' : 'Free';
            userBadge.className = isPremium ? 'badge premium-badge-ui' : 'badge';
        } else {
            authBtn.textContent = 'Premium Access 🗝️';
            userProfile.classList.add('hidden-section');
            userEmailSpan.textContent = '';
        }
    }

    function updatePremiumGates() {
        // Gates logic removed
    }

    async function loadReadingHistory() {
        const listContainer = document.getElementById('history-list');
        listContainer.innerHTML = '<div class="mystic-loader" style="margin:40px auto;"></div>';

        try {
            const snapshot = await db.collection('readings')
                .where('userId', '==', window.currentUser.uid)
                .orderBy('createdAt', 'desc')
                .limit(20)
                .get();

            if (snapshot.empty) {
                // We use global t() function from app.js if available
                const emptyMsg = typeof t === 'function' ? t('history.empty') : "履歴がありません。";
                listContainer.innerHTML = `<p style="text-align:center; color:var(--text-secondary); padding: 2rem;">${emptyMsg}</p>`;
                return;
            }

            listContainer.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const d = data.createdAt ? data.createdAt.toDate() : new Date();
                const isEn = window.currentLang === 'en';
                const dateStr = d.toLocaleDateString(isEn ? 'en-US' : 'ja-JP', { 
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
                });
                
                const item = document.createElement('div');
                item.className = 'history-item';
                
                let cardsSummary = "";
                if(data.spread === 'one_oracle' && data.cards && data.cards.length > 0) {
                    cardsSummary = isEn ? data.cards[0].name_en : data.cards[0].name_ja;
                } else if (data.spread === 'three_card' && data.cards && data.cards.length > 2) {
                    const names = data.cards.map(c => isEn ? c.name_en : c.name_ja);
                    cardsSummary = names.join(' / ');
                }

                const noThemeTxt = typeof t === 'function' ? t('result.no_theme') : '(No Theme)';
                
                item.innerHTML = `
                    <span class="history-date">${dateStr}</span>
                    <div class="history-theme">Q: ${data.theme || noThemeTxt}</div>
                    <div class="history-spread">${data.spread === 'three_card' ? 'Three Cards' : 'One Oracle'}</div>
                    <div class="history-card-names">${isEn ? 'Cards' : 'カード'}: ${cardsSummary}</div>
                `;

                item.addEventListener('click', () => {
                    historyDetailContent.innerHTML = data.htmlContent || '<p>Content not available.</p>';
                    reflectionContainer.classList.add('hidden-section');
                    reflectionText.textContent = '';
                    
                    if (window.userPlan === 'premium') {
                        getReflectionBtn.style.display = 'block';
                        
                        // Check if reflection already exists in data
                        if (data.reflection) {
                            reflectionText.textContent = data.reflection;
                            reflectionContainer.classList.remove('hidden-section');
                            getReflectionBtn.style.display = 'none';
                        } else {
                            // Assign a unique handler for this document to generate reflection
                            getReflectionBtn.onclick = async () => {
                                getReflectionBtn.textContent = '... 通信中 ...';
                                getReflectionBtn.disabled = true;
                                try {
                                    const res = await fetch('https://thoth-tarot-api.onrender.com/api/reflect-reading', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            user_name: window.currentUser.displayName || 'あなた',
                                            html_content: data.htmlContent || '',
                                            language: window.currentLang
                                        })
                                    });
                                    const resData = await res.json();
                                    reflectionText.textContent = resData.reflection;
                                    reflectionContainer.classList.remove('hidden-section');
                                    getReflectionBtn.style.display = 'none';
                                    
                                    // Save reflection to Firestore so we don't fetch again
                                    await db.collection('readings').doc(doc.id).update({
                                        reflection: resData.reflection
                                    });
                                } catch (e) {
                                    console.error('Reflection failed', e);
                                    alert('振り返りの取得に失敗しました。');
                                } finally {
                                    getReflectionBtn.textContent = '✦ 今だから言えるハルの一言 ✦';
                                    getReflectionBtn.disabled = false;
                                }
                            };
                        }
                    } else {
                        getReflectionBtn.style.display = 'none';
                    }

                    document.getElementById('history-modal').classList.remove('active');
                    historyDetailModal.classList.add('active');
                });

                listContainer.appendChild(item);
            });
        } catch (error) {
            console.error("Error loading history:", error);
            listContainer.innerHTML = `<p style="text-align:center; color:red;">Error loading history.</p>`;
        }
    }
});

// App.js calls this function after a reading is generated
window.saveReadingToHistory = async function(theme, spread, cards, resultHtml) {
    if (!window.currentUser) return;
    try {
        await db.collection('readings').add({
            userId: window.currentUser.uid,
            theme: theme,
            spread: spread,
            cards: cards.map(c => ({ id: c.id, name_en: c.name_en, name_ja: c.name_ja })), // Store minimal info
            htmlContent: resultHtml, 
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Reading saved to history successfully.");
    } catch (e) {
        console.error("Failed to save reading:", e);
    }
};

window.fetchRecentHistoryForSynthesis = async function() {
    if (!window.currentUser) return [];
    try {
        const snapshot = await db.collection('readings')
            .where('userId', '==', window.currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(10) // Limit to 10 for synthesis token savings
            .get();
        
        let history = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const d = data.createdAt ? data.createdAt.toDate() : new Date();
            const dateStr = d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
            let cardsCombined = "";
            if(data.cards) {
                cardsCombined = data.cards.map(c => c.name_ja).join(', ');
            }
            history.push({
                theme: data.theme || 'N/A',
                spread: data.spread || 'N/A',
                cards: cardsCombined,
                date: dateStr
            });
        });
        return history;
    } catch (e) {
        console.error("Failed to fetch history for synthesis", e);
        return [];
    }
};
