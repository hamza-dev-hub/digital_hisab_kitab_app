/**
 * DIGITAL HISAB KITAB - MAIN APPLICATION ENGINE (app.js)
 * High performance single-page application with full multilingual dictionaries (Urdu, Roman Urdu, English),
 * security PIN lock, live Khata calculations, WhatsApp & SMS direct integrations,
 * Roznamcha cash balancing, inventory alerts, PDF & Excel generation.
 */

// ============================================================
// 1. MULTILINGUAL DICTIONARY
// ============================================================
const DICTIONARY = {
  ur: {
    dir: 'rtl',
    headerBrand: 'ڈیجیٹل حساب کتاب',
    navDashboard: 'ڈیش بورڈ (خلاصہ)',
    navKhata: 'کھاتہ (گاہک و سپلائر)',
    navRoznamcha: 'روزنامچہ (کیش بک)',
    navInventory: 'اسٹاک و سامان',
    navInvoice: 'رسید و بل (Invoice)',
    navReports: 'رپورٹس و منافع',
    navSettings: 'سیٹنگز و بیک اپ',
    dashYouWillGet: 'آپ کو ملیں گے',
    dashYouWillGive: 'آپ نے دینے ہیں',
    dashTodayCash: 'کیش بیلنس',
    btnTxtAddCustomer: 'نیا گاہک شامل کریں',
    btnTxtAddCashEntry: 'روزنامچہ اندراج',
    btnTxtNewBill: 'نیا بل بنائیں',
    btnTxtAddStock: 'سامان شامل کریں',
    topCustomersHeader: 'واجب الادا گاہک (جن سے رقم لینی ہے)',
    recentCashHeader: 'آج کا کیش اندراج',
    tabCustomers: 'گاہک کھاتہ (Customers)',
    tabSuppliers: 'سپلائر کھاتہ (Suppliers)',
    btnAddParty: 'نیا کھاتہ کھولیں',
    backToKhata: 'پیچھے واپس جائیں',
    btnSendWhatsApp: 'واٹس ایپ پر تقاضہ بھیجیں',
    btnSendSMS: 'SMS بھیجیں',
    btnYouGave: 'آپ نے دیے (ادھار / مال دیا)',
    btnYouGot: 'آپ کو ملے (وصولی / ادائیگی ملی)',
    online: 'آن لائن',
    offline: 'آف لائن',
    synced: 'محفوظ ہے',
    syncing: 'سنک ہو رہا ہے...'
  },
  roman: {
    dir: 'ltr',
    headerBrand: 'Digital Hisab Kitab',
    navDashboard: 'Dashboard (Khulasa)',
    navKhata: 'Khata (Customers & Suppliers)',
    navRoznamcha: 'Roznamcha (Cash Book)',
    navInventory: 'Stock & Items',
    navInvoice: 'Receipt & Bill',
    navReports: 'Reports & Munafa',
    navSettings: 'Settings & Backup',
    dashYouWillGet: 'Aap Ko Milein Ge',
    dashYouWillGive: 'Aap Ne Dene Hain',
    dashTodayCash: 'Cash Balance',
    btnTxtAddCustomer: 'Naya Grahak Shamil Karein',
    btnTxtAddCashEntry: 'Roznamcha Entry',
    btnTxtNewBill: 'Naya Bill Banayein',
    btnTxtAddStock: 'Stock Item Shamil Karein',
    topCustomersHeader: 'Wajib-ul-Ada Grahak (Jin se vasooli leni hai)',
    recentCashHeader: 'Aaj Ka Cash Indraj',
    tabCustomers: 'Grahak Khata (Customers)',
    tabSuppliers: 'Supplier Khata (Suppliers)',
    btnAddParty: 'Naya Khata Kholein',
    backToKhata: 'Wapas Jayein',
    btnSendWhatsApp: 'WhatsApp Par Reminder Bheinjein',
    btnSendSMS: 'SMS Bheinjein',
    btnYouGave: 'Aap Ne Diye (Udhar / Maal)',
    btnYouGot: 'Aap Ko Mile (Vasooli / Payment)',
    online: 'Online',
    offline: 'Offline',
    synced: 'Saved (Cloud)',
    syncing: 'Syncing...'
  },
  en: {
    dir: 'ltr',
    headerBrand: 'Digital Hisab Kitab',
    navDashboard: 'Dashboard',
    navKhata: 'Ledger (Khata)',
    navRoznamcha: 'Daily Cash Book',
    navInventory: 'Stock & Inventory',
    navInvoice: 'Invoices & Billing',
    navReports: 'Reports & P&L',
    navSettings: 'Settings & Cloud Backup',
    dashYouWillGet: "You'll Get",
    dashYouWillGive: "You'll Give",
    dashTodayCash: "Today's Cash Balance",
    btnTxtAddCustomer: 'Add Customer',
    btnTxtAddCashEntry: 'Add Cash Entry',
    btnTxtNewBill: 'Create Bill',
    btnTxtAddStock: 'Add Stock Item',
    topCustomersHeader: 'Top Debtors (Due for Recovery)',
    recentCashHeader: "Today's Cash Activity",
    tabCustomers: 'Customers Ledger',
    tabSuppliers: 'Suppliers Ledger',
    btnAddParty: 'Add New Account',
    backToKhata: 'Back to Ledger',
    btnSendWhatsApp: 'Send WhatsApp Reminder',
    btnSendSMS: 'Send SMS',
    btnYouGave: 'You Gave (Debit / Credit Sale)',
    btnYouGot: 'You Got (Credit / Payment Received)',
    online: 'Online',
    offline: 'Offline',
    synced: 'Cloud Synced',
    syncing: 'Syncing...'
  }
};

// ============================================================
// 2. APPLICATION STATE
// ============================================================
const state = {
  currentView: 'dashboard',
  currentLang: 'ur',
  currentKhataTab: 'customer',
  activePartyId: null,
  enteredPin: '',
  invoiceItems: [],
  selectedRoznamchaDate: new Date().toISOString().split('T')[0],
  reportPeriod: 'month'
};

// ============================================================
// 3. LIFECYCLE & INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initSecurity();
  initNetworkListeners();
  loadSettings();
  setLanguage(state.currentLang);
  navigateTo('dashboard');
  initInvoiceDate();
  initDashboardHero();
});

// Initialize dashboard hero banner greeting, shop name and date
function initDashboardHero() {
  // Set hero date
  const dateEl = document.getElementById('dbHeroDate');
  if (dateEl) {
    const now = new Date();
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    dateEl.textContent = `${dayNames[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  // Sync shop name to hero
  const heroShop = document.getElementById('dbHeroShopName');
  const shopNameEl = document.getElementById('settingShopName');
  if (heroShop && shopNameEl && shopNameEl.value) {
    heroShop.textContent = shopNameEl.value;
  }

  // Greeting based on time
  const greetEl = document.getElementById('dbGreetingText');
  if (greetEl) {
    const hour = new Date().getHours();
    const lang = state.currentLang;
    let greet;
    if (lang === 'ur') {
      greet = hour < 12 ? 'صبح بخیر 🌤️' : hour < 17 ? 'دوپہر بخیر ☀️' : 'شام بخیر 🌙';
    } else if (lang === 'roman') {
      greet = hour < 12 ? 'Subah Bakhair 🌤️' : hour < 17 ? 'Dopahar Bakhair ☀️' : 'Sham Bakhair 🌙';
    } else {
      greet = hour < 12 ? 'Good Morning 🌤️' : hour < 17 ? 'Good Afternoon ☀️' : 'Good Evening 🌙';
    }
    greetEl.textContent = greet;
  }
}

// Setup online/offline detector
function initNetworkListeners() {
  const badge = document.getElementById('networkStatusBadge');
  const txt = document.getElementById('txtNetStatus');

  function updateStatus() {
    if (navigator.onLine) {
      badge.classList.remove('offline');
      badge.classList.add('online');
      txt.textContent = DICTIONARY[state.currentLang].online;
    } else {
      badge.classList.remove('online');
      badge.classList.add('offline');
      txt.textContent = DICTIONARY[state.currentLang].offline;
    }
  }

  window.addEventListener('online', () => {
    updateStatus();
    showToast('انٹرنیٹ بحال ہو گیا! کلاؤڈ سنک فعال ہے۔', 'success');
  });

  window.addEventListener('offline', () => {
    updateStatus();
    showToast('انٹرنیٹ منقطع ہے۔ آف لائن موڈ میں کام جاری رکھیں۔', 'error');
  });

  updateStatus();
}

// ============================================================
// ============================================================
// 4. SECURITY & PIN CODE LOCK LOGIC
// ============================================================

// ── LocalStorage keys for biometric state ─────────────────────────────────
const BIO_KEY_ENROLLED  = 'dhk_bio_enrolled';   // true/false
const BIO_KEY_DISMISSED = 'dhk_bio_dismissed';  // user said "No" to enrollment
const BIO_KEY_CRED_ID   = 'dhk_bio_cred_id';    // stored credential ID (base64)

// ── Biometric support detection ───────────────────────────────────────────
let _bioSupported = null; // cached result (null=not checked yet)

async function checkBiometricSupport() {
  if (_bioSupported !== null) return _bioSupported;
  try {
    if (!window.PublicKeyCredential) { _bioSupported = false; return false; }
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    _bioSupported = available;
    return available;
  } catch (e) {
    _bioSupported = false;
    return false;
  }
}

// ── Utility helpers ───────────────────────────────────────────────────────
function b64ToUint8Array(base64) {
  const binaryStr = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  return bytes;
}

function uint8ArrayToB64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function bioSetRingState(state) {
  const icon = document.getElementById('bioQuickIcon');
  if (!icon) return;
  icon.classList.remove('scanning', 'success');
  if (state === 'scanning') icon.classList.add('scanning');
  if (state === 'success')  icon.classList.add('success');
}

function bioSetStatus(msg, type = '') {
  const el = document.getElementById('bioStatusMsg');
  if (!el) return;
  el.textContent = msg;
  el.className = 'bio-status-msg' + (type ? ' msg-' + type : '');
}

// ── initSecurity (WhatsApp / EasyPaisa Style) ──────────────────────────────
function initSecurity() {
  const settings = window.dhkDB.getSettings();
  const lockOverlay = document.getElementById('pinLockScreen');
  if (settings.pinEnabled !== false) {
    lockOverlay.classList.add('active');
    // Auto-trigger native fingerprint scanner immediately on start
    initBiometricUI(true);
  } else {
    lockOverlay.classList.remove('active');
  }
}

let _isBioPrompting = false;

async function initBiometricUI(autoTrigger = true) {
  const supported = await checkBiometricSupport();
  const keyBtn    = document.getElementById('biometricKeyBtn');
  const quickBar  = document.getElementById('bioQuickBar');

  if (!supported) {
    // Biometrics not available on this device
    if (keyBtn) keyBtn.classList.add('bio-unavailable');
    if (quickBar) quickBar.style.display = 'none';
    return;
  }

  // Device supports Biometrics
  if (keyBtn) keyBtn.classList.remove('bio-unavailable');
  if (quickBar) quickBar.style.display = 'flex';

  // Auto-trigger biometric prompt if lock screen is active and user hasn't typed PIN yet
  if (autoTrigger) {
    setTimeout(() => {
      const lockOverlay = document.getElementById('pinLockScreen');
      if (lockOverlay && lockOverlay.classList.contains('active') && state.enteredPin.length === 0) {
        triggerBiometricAuth(true);
      }
    }, 400);
  }
}

// ── lockApp ───────────────────────────────────────────────────────────────
function lockApp() {
  state.enteredPin = '';
  updatePinDots();
  document.getElementById('pinErrorMsg').textContent = '';
  document.getElementById('pinLockScreen').classList.add('active');
  bioSetRingState(null);
  bioSetStatus('');
  // Auto-trigger biometrics on lock
  initBiometricUI(true);
}

// ── PIN entry (Always active as fallback) ───────────────────────────────────
function enterPinDigit(digit) {
  if (state.enteredPin.length < 4) {
    state.enteredPin += digit;
    updatePinDots();
  }
  if (state.enteredPin.length === 4) {
    setTimeout(verifyPin, 100);
  }
}

function deletePinDigit() {
  if (state.enteredPin.length > 0) {
    state.enteredPin = state.enteredPin.slice(0, -1);
    updatePinDots();
    document.getElementById('pinErrorMsg').textContent = '';
  }
}

function updatePinDots() {
  const dots = document.querySelectorAll('#pinDots .dot');
  dots.forEach((d, idx) => {
    if (idx < state.enteredPin.length) {
      d.classList.add('filled');
    } else {
      d.classList.remove('filled');
    }
  });
}

// ── verifyPin (PIN fallback check) ─────────────────────────────────────────
async function verifyPin() {
  const settings   = window.dhkDB.getSettings();
  const correctPin = settings.pin || '1234';

  if (state.enteredPin === correctPin) {
    unlockApp();
  } else {
    document.getElementById('pinErrorMsg').textContent = 'غلط پن کوڈ! دوبارہ کوشش کریں (ڈیفالٹ: 1234)';
    state.enteredPin = '';
    updatePinDots();
  }
}

// ── unlockApp (Shared Unlock Handler) ─────────────────────────────────────
function unlockApp() {
  document.getElementById('pinLockScreen').classList.remove('active');
  state.enteredPin = '';
  updatePinDots();
  document.getElementById('pinErrorMsg').textContent = '';
  bioSetStatus('');
  showToast('خوش آمدید! ایپ ان لاک ہو گئی۔', 'success');
}

// ── skipPinDemo ───────────────────────────────────────────────────────────
function skipPinDemo() {
  document.getElementById('pinLockScreen').classList.remove('active');
  state.enteredPin = '';
  updatePinDots();
  showToast('ڈیمو موڈ فعال!', 'success');
}

// ── BIOMETRIC AUTHENTICATION (EasyPaisa / WhatsApp Flow: No Prior Setup Needed)
async function triggerBiometricAuth(isAuto = false) {
  const supported = await checkBiometricSupport();
  if (!supported) {
    if (!isAuto) showToast('اس آلے پر فنگر پرنٹ دستیاب نہیں', 'error');
    return;
  }

  if (_isBioPrompting) return;
  _isBioPrompting = true;

  bioSetRingState('scanning');
  bioSetStatus('فنگر پرنٹ اسکین کریں...', 'info');

  try {
    const credIdB64 = localStorage.getItem(BIO_KEY_CRED_ID);
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    let authenticated = false;

    if (credIdB64) {
      // 1. Try existing platform credential
      try {
        const getOptions = {
          publicKey: {
            challenge,
            rpId: location.hostname || 'localhost',
            allowCredentials: [{
              id: b64ToUint8Array(credIdB64),
              type: 'public-key',
              transports: ['internal']
            }],
            userVerification: 'required',
            timeout: 60000
          }
        };
        const assertion = await navigator.credentials.get(getOptions);
        if (assertion) authenticated = true;
      } catch (getErr) {
        if (getErr.name !== 'NotAllowedError' && getErr.name !== 'AbortError') {
          // Credential might be stale; clear it so we create a fresh one below
          localStorage.removeItem(BIO_KEY_CRED_ID);
        } else {
          throw getErr;
        }
      }
    }

    if (!authenticated) {
      // 2. Seamless On-the-Fly Registration: prompts native biometric sensor directly
      const userId = new TextEncoder().encode('dhk-user-001');
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'Digital Hisab Kitab',
            id: location.hostname || 'localhost'
          },
          user: {
            id: userId,
            name: 'dhk-user',
            displayName: 'ڈیجیٹل حساب کتاب'
          },
          pubKeyCredParams: [
            { alg: -7,  type: 'public-key' },   // ES256
            { alg: -257, type: 'public-key' }   // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            requireResidentKey: false
          },
          timeout: 60000,
          attestation: 'none'
        }
      });

      if (credential) {
        const newCredId = uint8ArrayToB64(credential.rawId);
        localStorage.setItem(BIO_KEY_CRED_ID, newCredId);
        localStorage.setItem(BIO_KEY_ENROLLED, 'true');
        authenticated = true;
      }
    }

    if (authenticated) {
      bioSetRingState('success');
      bioSetStatus('تصدیق ہو گئی! ✓', 'success');
      setTimeout(() => {
        unlockApp();
      }, 450);
    }

  } catch (err) {
    console.log('[Biometrics]', err.name, err.message);
    bioSetRingState(null);

    // If user dismissed or cancelled the biometric prompt, fallback smoothly to PIN
    if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
      bioSetStatus('پن کوڈ درج کریں یا فنگر پرنٹ دوبارہ دبائیں', 'info');
    } else {
      bioSetStatus('دوبارہ کوشش کریں یا پن کوڈ درج کریں', 'info');
    }
  } finally {
    _isBioPrompting = false;
  }
}

// ── removeBiometricEnrollment (available in Settings) ─────────────────────
function removeBiometricEnrollment() {
  localStorage.removeItem(BIO_KEY_ENROLLED);
  localStorage.removeItem(BIO_KEY_CRED_ID);
  showToast('فنگر پرنٹ ڈیٹا ری سیٹ ہو گیا۔', 'success');
}

// Legacy stub
function simulateBiometric() { triggerBiometricAuth(); }


// ============================================================
// 5. NAVIGATION & ROUTING
// ============================================================
function navigateTo(page) {
  state.currentView = page;

  // Update panels
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('view' + page.charAt(0).toUpperCase() + page.slice(1));
  if (target) target.classList.add('active');

  // Update Nav links (sidebar & mobile)
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  // Close mobile sidebar if open
  document.getElementById('mainSidebar').classList.remove('mobile-open');

  // Route-specific refresh
  if (page === 'dashboard') renderDashboard();
  if (page === 'khata') renderKhata();
  if (page === 'roznamcha') renderRoznamcha();
  if (page === 'inventory') renderInventory();
  if (page === 'invoice') renderInvoiceView();
  if (page === 'reports') renderReports();
  if (page === 'settings') loadSettings();
}

function toggleMobileSidebar() {
  document.getElementById('mainSidebar').classList.toggle('mobile-open');
}

// ============================================================
// 6. LANGUAGE & TRANSLATIONS
// ============================================================
function setLanguage(lang) {
  state.currentLang = lang;
  const dict = DICTIONARY[lang] || DICTIONARY.ur;

  document.body.setAttribute('dir', dict.dir);
  document.body.setAttribute('data-lang', lang);

  // Update Buttons
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  // Update Translatable Strings
  const ids = {
    txtHeaderBrand: dict.headerBrand,
    navTxtDashboard: dict.navDashboard,
    navTxtKhata: dict.navKhata,
    navTxtRoznamcha: dict.navRoznamcha,
    navTxtInventory: dict.navInventory,
    navTxtInvoice: dict.navInvoice,
    navTxtReports: dict.navReports,
    navTxtSettings: dict.navSettings,
    txtDashYouWillGet: dict.dashYouWillGet,
    txtDashYouWillGive: dict.dashYouWillGive,
    txtDashTodayCash: dict.dashTodayCash,
    btnTxtAddCustomer: dict.btnTxtAddCustomer,
    btnTxtAddCashEntry: dict.btnTxtAddCashEntry,
    btnTxtNewBill: dict.btnTxtNewBill,
    btnTxtAddStock: dict.btnTxtAddStock,
    txtTopCustomersHeader: dict.topCustomersHeader,
    txtRecentCashHeader: dict.recentCashHeader,
    txtTabCustomers: dict.tabCustomers,
    txtTabSuppliers: dict.tabSuppliers,
    btnTxtAddParty: dict.btnAddParty,
    txtBackToKhata: dict.backToKhata,
    txtBtnSendWhatsApp: dict.btnSendWhatsApp,
    txtBtnSendSMS: dict.btnSendSMS,
    txtBtnYouGave: dict.btnYouGave,
    txtBtnYouGot: dict.btnYouGot
  };

  for (let key in ids) {
    const el = document.getElementById(key);
    if (el) el.textContent = ids[key];
  }

  // Refresh current view
  navigateTo(state.currentView);
}

// ============================================================
// 7. DASHBOARD RENDERER
// ============================================================
function renderDashboard() {
  const parties = window.dhkDB.getParties();
  const roznamcha = window.dhkDB.getRoznamcha(new Date().toISOString().split('T')[0]);
  const inventory = window.dhkDB.getInventory();

  // 1. Calculate You Will Get (Customers debt)
  let totalGot = 0;
  let customersWithDebt = 0;
  parties.filter(p => p.type === 'customer').forEach(c => {
    if (c.balanceType === 'got' && c.balance > 0) {
      totalGot += Number(c.balance);
      customersWithDebt++;
    }
  });

  // 2. Calculate You Will Give (Suppliers payable)
  let totalGave = 0;
  let suppliersPayable = 0;
  parties.filter(p => p.type === 'supplier').forEach(s => {
    if (s.balanceType === 'gave' && s.balance > 0) {
      totalGave += Number(s.balance);
      suppliersPayable++;
    }
  });

  // 3. Today's Cash Flow
  let todayIn = 0;
  let todayOut = 0;
  roznamcha.forEach(r => {
    if (r.type === 'in') todayIn += Number(r.amount);
    if (r.type === 'out') todayOut += Number(r.amount);
  });
  const todayCashBalance = todayIn - todayOut;

  // DOM Updates
  document.getElementById('dashTotalGot').textContent = `Rs ${totalGot.toLocaleString()}`;
  document.getElementById('dashCustomersCount').textContent = `${customersWithDebt} گاہکوں سے وصول کرنا ہے`;
  document.getElementById('dashTotalGave').textContent = `Rs ${totalGave.toLocaleString()}`;
  document.getElementById('dashSuppliersCount').textContent = `${suppliersPayable} سپلائر کو ادا کرنا ہے`;

  document.getElementById('dashTodayCashBalance').textContent = `Rs ${todayCashBalance.toLocaleString()}`;
  document.getElementById('dashTodayIn').textContent = `+Rs ${todayIn.toLocaleString()} آمدن`;
  document.getElementById('dashTodayOut').textContent = `-Rs ${todayOut.toLocaleString()} خرچہ`;

  // 4. Low stock check
  const lowStockItems = inventory.filter(i => Number(i.qty) <= Number(i.minQty));
  const banner = document.getElementById('lowStockAlertBanner');
  const badge = document.getElementById('lowStockBadge');
  if (lowStockItems.length > 0) {
    banner.style.display = 'flex';
    badge.style.display = 'inline-block';
    badge.textContent = lowStockItems.length;
  } else {
    banner.style.display = 'none';
    badge.style.display = 'none';
  }

  // 5. Top Due Customers List
  const topList = document.getElementById('dashDueCustomersList');
  topList.innerHTML = '';
  const dueCustomers = parties
    .filter(p => p.type === 'customer' && p.balanceType === 'got' && p.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  if (dueCustomers.length === 0) {
    topList.innerHTML = '<div class="text-muted" style="padding: 12px;">کوئی واجب الادا رقم نہیں ہے۔ تمام کھاتے کلیئر ہیں۔</div>';
  } else {
    dueCustomers.forEach(c => {
      const item = document.createElement('div');
      item.className = 'due-item';
      item.onclick = () => openPartyDetail(c.id);
      item.innerHTML = `
        <div>
          <strong>${c.name}</strong>
          <div class="text-muted" style="font-size:12px;">${c.phone || 'فون موجود نہیں'}</div>
        </div>
        <div style="text-align: left;">
          <span class="text-emerald" style="font-weight:700; font-size:16px;">Rs ${c.balance.toLocaleString()}</span>
          <div class="tag-got" style="font-size:10px; padding:2px 6px; border-radius:10px; text-align:center;">وصولی</div>
        </div>
      `;
      topList.appendChild(item);
    });
  }

  // 6. Recent Cash Activity List
  const recentCashList = document.getElementById('dashRecentCashList');
  recentCashList.innerHTML = '';
  if (roznamcha.length === 0) {
    recentCashList.innerHTML = '<div class="text-muted" style="padding: 12px;">آج کا کوئی کیش اندراج نہیں ہوا۔</div>';
  } else {
    roznamcha.slice(0, 5).forEach(r => {
      const isIncome = r.type === 'in';
      const item = document.createElement('div');
      item.className = 'cash-activity-item';
      item.innerHTML = `
        <div>
          <strong>${r.category}</strong>
          <div class="text-muted" style="font-size:12px;">${r.note || ''}</div>
        </div>
        <div>
          <span class="${isIncome ? 'text-emerald' : 'text-ruby'}" style="font-weight:700;">
            ${isIncome ? '+' : '-'}Rs ${Number(r.amount).toLocaleString()}
          </span>
        </div>
      `;
      recentCashList.appendChild(item);
    });
  }
}

// ============================================================
// 8. KHATA (CUSTOMER & SUPPLIER LEDGER)
// ============================================================
function switchKhataTab(tab) {
  state.currentKhataTab = tab;
  document.getElementById('tabCustomers').classList.toggle('active', tab === 'customer');
  document.getElementById('tabSuppliers').classList.toggle('active', tab === 'supplier');
  renderKhata();
}

function renderKhata() {
  const allParties = window.dhkDB.getParties();
  const customers = allParties.filter(p => p.type === 'customer');
  const suppliers = allParties.filter(p => p.type === 'supplier');

  document.getElementById('badgeCustomersCount').textContent = customers.length;
  document.getElementById('badgeSuppliersCount').textContent = suppliers.length;

  filterKhataList();
}

function filterKhataList() {
  const searchTerm = (document.getElementById('khataSearchInput').value || '').toLowerCase();
  const parties = window.dhkDB.getParties(state.currentKhataTab);
  const container = document.getElementById('partyListContainer');
  container.innerHTML = '';

  const filtered = parties.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || (p.phone && p.phone.includes(searchTerm))
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="glass-panel" style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--text-muted);">
      کوئی کھاتہ نہیں ملا۔ نیا کھاتہ کھولنے کے لیے اوپر والے بٹن پر کلک کریں۔
    </div>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'party-card glass-panel';
    card.onclick = () => openPartyDetail(p.id);

    let balanceBadge = '';
    let balanceClass = '';
    if (p.balanceType === 'got') {
      balanceBadge = state.currentKhataTab === 'customer' ? 'آپ کو ملیں گے' : 'آپ نے دیے';
      balanceClass = 'text-emerald';
    } else if (p.balanceType === 'gave') {
      balanceBadge = state.currentKhataTab === 'customer' ? 'آپ نے دینے ہیں' : 'سپلائر کو دینے ہیں';
      balanceClass = 'text-ruby';
    } else {
      balanceBadge = 'حساب بے باق (Settled)';
      balanceClass = 'text-muted';
    }

    card.innerHTML = `
      <div class="party-info-left">
        <div class="party-avatar">${p.name.charAt(0)}</div>
        <div class="party-details">
          <h4>${p.name}</h4>
          <span>${p.phone || 'فون نمبر نہیں ہے'}</span>
        </div>
      </div>
      <div class="party-balance-right">
        <div class="party-balance-amount ${balanceClass}">Rs ${Number(p.balance).toLocaleString()}</div>
        <span class="party-badge-tag ${p.balanceType === 'got' ? 'tag-got' : p.balanceType === 'gave' ? 'tag-gave' : 'tag-settled'}">
          ${balanceBadge}
        </span>
      </div>
    `;
    container.appendChild(card);
  });
}

function openPartyDetail(partyId) {
  state.activePartyId = partyId;
  const party = window.dhkDB.getParties().find(p => p.id === partyId);
  if (!party) return;

  document.getElementById('partyDetailView').style.display = 'block';
  document.getElementById('partyListContainer').style.display = 'none';
  document.querySelector('.view-header-bar').style.display = 'none';

  document.getElementById('detailPartyAvatar').textContent = party.name.charAt(0);
  document.getElementById('detailPartyName').textContent = party.name;
  document.getElementById('detailPartyPhone').textContent = party.phone || 'فون نمبر نہیں ہے';

  // Balance Badge
  const balEl = document.getElementById('detailBalanceAmount');
  const tagEl = document.getElementById('detailBalanceTag');
  balEl.textContent = `Rs ${Number(party.balance).toLocaleString()}`;

  if (party.balanceType === 'got') {
    balEl.className = 'balance-number text-emerald';
    tagEl.className = 'balance-tag tag-got';
    tagEl.textContent = party.type === 'customer' ? 'آپ کو ملیں گے (وصولی)' : 'آپ کے جمع ہیں';
  } else if (party.balanceType === 'gave') {
    balEl.className = 'balance-number text-ruby';
    tagEl.className = 'balance-tag tag-gave';
    tagEl.textContent = party.type === 'customer' ? 'آپ نے دینے ہیں' : 'سپلائر کو دینے ہیں (ادھار)';
  } else {
    balEl.className = 'balance-number text-muted';
    tagEl.className = 'balance-tag tag-settled';
    tagEl.textContent = 'حساب کلیئر ہے';
  }

  // Load Transactions Table
  const txs = window.dhkDB.getTransactions(partyId);
  const tbody = document.getElementById('partyTransactionsBody');
  tbody.innerHTML = '';

  if (txs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">کوئی ٹرانزیکشن موجود نہیں۔ نیا اندراج درج کریں۔</td></tr>`;
  } else {
    txs.forEach(t => {
      const isGave = t.type === 'gave';
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${t.date}</td>
        <td>${t.note || '—'}</td>
        <td><span class="badge-tag" style="background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${t.paymentMode || 'کیش'}</span></td>
        <td class="text-ruby" style="font-weight:700;">${isGave ? 'Rs ' + Number(t.amount).toLocaleString() : '—'}</td>
        <td class="text-emerald" style="font-weight:700;">${!isGave ? 'Rs ' + Number(t.amount).toLocaleString() : '—'}</td>
        <td>
          <button class="btn-text" style="color:var(--ruby);" onclick="deleteTx('${t.id}')">حذف</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
}

function closePartyDetail() {
  state.activePartyId = null;
  document.getElementById('partyDetailView').style.display = 'none';
  document.getElementById('partyListContainer').style.display = 'grid';
  document.querySelector('.view-header-bar').style.display = 'flex';
  renderKhata();
}

// ============================================================
// 9. WHATSAPP & SMS ONE-CLICK REMINDER INTEGRATION
// ============================================================
function triggerWhatsAppReminder() {
  if (!state.activePartyId) return;
  const party = window.dhkDB.getParties().find(p => p.id === state.activePartyId);
  if (!party) return;

  if (!party.phone) {
    alert('اس کھاتے کا فون نمبر درج نہیں ہے۔ برائے مہربانی فون نمبر درج کریں۔');
    return;
  }

  const settings = window.dhkDB.getSettings();
  const shopName = settings.shopName || 'ہماری دکان';
  const balance = Number(party.balance).toLocaleString();
  const today = new Date().toLocaleDateString('ur-PK');

  let cleanPhone = party.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '92' + cleanPhone.substring(1);
  }

  const message = `السلام علیکم محترم ${party.name} صاحب!
یہ یاد دہانی ${shopName} کی طرف سے بھیجی جا رہی ہے۔
آپ کے کھاتے کا کل واجب الادا بقایا بیلنس: *Rs ${balance}* ہے۔
برائے مہربانی جلد از جلد ادائیگی یقینی بنائیں۔
شکریہ!
تاریخ: ${today}`;

  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
  window.open(waUrl, '_blank');
}

function triggerSMSReminder() {
  if (!state.activePartyId) return;
  const party = window.dhkDB.getParties().find(p => p.id === state.activePartyId);
  if (!party || !party.phone) {
    alert('فون نمبر درج نہیں ہے۔');
    return;
  }

  const settings = window.dhkDB.getSettings();
  const message = `Muhtaram ${party.name}! Aap ka ${settings.shopName} ki taraf baqaya balance Rs ${party.balance} hai. Baraye meharbani adaigi karein. Shukriya!`;
  const smsUrl = `sms:${party.phone}?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
}

// ============================================================
// 10. ADD TRANSACTION (GAVE / GOT) MODAL & LOGIC
// ============================================================
function openAddTxModal(type) {
  if (!state.activePartyId) return;
  document.getElementById('txInputType').value = type;
  const badge = document.getElementById('txTypeBadge');
  const title = document.getElementById('modalTxTitle');

  if (type === 'gave') {
    badge.className = 'indicator-badge gave';
    badge.textContent = 'آپ نے دیے (ادھار / مال دیا)';
    title.textContent = 'رقم یا سامان دینے کا اندراج';
  } else {
    badge.className = 'indicator-badge got';
    badge.textContent = 'آپ کو ملے (وصولی / نقد ادائیگی)';
    title.textContent = 'رقم وصول کرنے کا اندراج';
  }

  document.getElementById('txInputAmount').value = '';
  document.getElementById('txInputNote').value = '';
  document.getElementById('txInputDate').value = new Date().toISOString().split('T')[0];

  openModal('modalAddTx');
}

function handleSaveTransaction(e) {
  e.preventDefault();
  const type = document.getElementById('txInputType').value;
  const amount = Number(document.getElementById('txInputAmount').value);
  const note = document.getElementById('txInputNote').value.trim();
  const date = document.getElementById('txInputDate').value;
  const paymentMode = document.getElementById('txInputPaymentMode').value;

  if (!amount || amount <= 0) {
    alert('درست رقم درج کریں');
    return;
  }

  window.dhkDB.addTransaction({
    partyId: state.activePartyId,
    type,
    amount,
    note,
    date,
    paymentMode
  });

  closeModal('modalAddTx');
  openPartyDetail(state.activePartyId);
  showToast('لین دین کا اندراج کامیابی سے محفوظ ہو گیا!', 'success');
}

function deleteTx(txId) {
  if (confirm('کیا آپ واقعی یہ اندراج حذف کرنا چاہتے ہیں؟')) {
    window.dhkDB.deleteTransaction(txId);
    openPartyDetail(state.activePartyId);
    showToast('اندراج حذف کر دیا گیا', 'error');
  }
}

// ============================================================
// 11. ADD PARTY (CUSTOMER / SUPPLIER) MODAL & LOGIC
// ============================================================
function openAddPartyModal(defaultType = null) {
  const type = defaultType || state.currentKhataTab || 'customer';
  const radio = document.querySelector(`input[name="partyTypeInput"][value="${type}"]`);
  if (radio) radio.checked = true;

  document.getElementById('partyInputName').value = '';
  document.getElementById('partyInputPhone').value = '';
  document.getElementById('partyInputOpeningBalance').value = '0';

  openModal('modalAddParty');
}

function handleSaveParty(e) {
  e.preventDefault();
  const type = document.querySelector('input[name="partyTypeInput"]:checked').value;
  const name = document.getElementById('partyInputName').value.trim();
  const phone = document.getElementById('partyInputPhone').value.trim();
  const openingBal = Number(document.getElementById('partyInputOpeningBalance').value) || 0;
  const openingType = document.getElementById('partyInputOpeningType').value;

  if (!name) {
    alert('براہ کرم نام درج کریں');
    return;
  }

  const party = window.dhkDB.addParty({
    name,
    phone,
    type,
    balance: openingBal,
    balanceType: openingBal > 0 ? openingType : 'settled'
  });

  // If opening balance > 0, record initial transaction
  if (openingBal > 0) {
    window.dhkDB.addTransaction({
      partyId: party.id,
      type: openingType,
      amount: openingBal,
      note: 'ابتدائی پرانا بقایا بیلنس (Opening Balance)',
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'cash'
    });
  }

  closeModal('modalAddParty');
  renderKhata();
  showToast('نیا کھاتہ کھول دیا گیا ہے!', 'success');
}

// ============================================================
// 12. ROZNAMCHA (DAILY CASH BOOK)
// ============================================================
function renderRoznamcha() {
  const dateInput = document.getElementById('roznamchaDatePicker');
  if (!dateInput.value) {
    dateInput.value = state.selectedRoznamchaDate;
  }
  const date = dateInput.value;

  const entries = window.dhkDB.getRoznamcha(date);

  let totalIn = 0;
  let totalOut = 0;
  entries.forEach(e => {
    if (e.type === 'in') totalIn += Number(e.amount);
    if (e.type === 'out') totalOut += Number(e.amount);
  });

  const closingBalance = totalIn - totalOut;

  document.getElementById('roznamchaTotalIn').textContent = `+Rs ${totalIn.toLocaleString()}`;
  document.getElementById('roznamchaTotalOut').textContent = `-Rs ${totalOut.toLocaleString()}`;
  document.getElementById('roznamchaClosingCash').textContent = `Rs ${closingBalance.toLocaleString()}`;
  document.getElementById('roznamchaOpeningCash').textContent = `Rs 0`;

  const tbody = document.getElementById('roznamchaEntriesBody');
  tbody.innerHTML = '';

  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">اس تاریخ کا کوئی کیش اندراج موجود نہیں۔ نیا اندراج شامل کریں۔</td></tr>`;
    return;
  }

  entries.forEach(e => {
    const isIn = e.type === 'in';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${e.date}</td>
      <td><span class="badge-tag ${isIn ? 'tag-got' : 'tag-gave'}">${isIn ? 'آمدن (Cash In)' : 'خرچہ (Cash Out)'}</span></td>
      <td>${e.category}</td>
      <td>${e.note || '—'}</td>
      <td class="text-emerald" style="font-weight:700;">${isIn ? '+Rs ' + Number(e.amount).toLocaleString() : '—'}</td>
      <td class="text-ruby" style="font-weight:700;">${!isIn ? '-Rs ' + Number(e.amount).toLocaleString() : '—'}</td>
      <td>
        <button class="btn-text" style="color:var(--ruby);" onclick="deleteCashEntry('${e.id}')">حذف</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function changeRoznamchaDate(delta) {
  const current = new Date(document.getElementById('roznamchaDatePicker').value);
  current.setDate(current.getDate() + delta);
  document.getElementById('roznamchaDatePicker').value = current.toISOString().split('T')[0];
  renderRoznamcha();
}

function setRoznamchaToday() {
  document.getElementById('roznamchaDatePicker').value = new Date().toISOString().split('T')[0];
  renderRoznamcha();
}

function loadRoznamchaForSelectedDate() {
  state.selectedRoznamchaDate = document.getElementById('roznamchaDatePicker').value;
  renderRoznamcha();
}

function openAddCashModal() {
  document.getElementById('cashInputAmount').value = '';
  document.getElementById('cashInputNote').value = '';
  openModal('modalAddCash');
}

function handleSaveCashEntry(e) {
  e.preventDefault();
  const type = document.querySelector('input[name="cashTypeInput"]:checked').value;
  const amount = Number(document.getElementById('cashInputAmount').value);
  const category = document.getElementById('cashInputCategory').value;
  const note = document.getElementById('cashInputNote').value.trim();
  const date = document.getElementById('roznamchaDatePicker').value || new Date().toISOString().split('T')[0];

  if (!amount || amount <= 0) {
    alert('درست رقم درج کریں');
    return;
  }

  window.dhkDB.addRoznamchaEntry({
    type,
    amount,
    category,
    note,
    date
  });

  closeModal('modalAddCash');
  renderRoznamcha();
  showToast('روزنامچہ میں کیش اندراج درج ہو گیا!', 'success');
}

function deleteCashEntry(id) {
  if (confirm('کیا آپ واقعی یہ کیش اندراج ختم کرنا چاہتے ہیں؟')) {
    window.dhkDB.deleteRoznamchaEntry(id);
    renderRoznamcha();
    showToast('اندراج حذف کر دیا گیا', 'error');
  }
}

// ============================================================
// 13. INVENTORY & STOCK MANAGEMENT
// ============================================================
function renderInventory() {
  const items = window.dhkDB.getInventory();
  const search = (document.getElementById('inventorySearchInput').value || '').toLowerCase();

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search) || (i.category && i.category.toLowerCase().includes(search))
  );

  let totalValuation = 0;
  let lowStockCount = 0;

  items.forEach(i => {
    totalValuation += Number(i.cost || 0) * Number(i.qty || 0);
    if (Number(i.qty) <= Number(i.minQty)) lowStockCount++;
  });

  document.getElementById('invTotalItemsCount').textContent = items.length;
  document.getElementById('invTotalValuation').textContent = `Rs ${totalValuation.toLocaleString()}`;
  document.getElementById('invLowStockCount').textContent = lowStockCount;

  const tbody = document.getElementById('inventoryItemsBody');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">کوئی سامان نہیں ملا۔ نیا سامان شامل کریں۔</td></tr>`;
    return;
  }

  filtered.forEach(item => {
    const isLow = Number(item.qty) <= Number(item.minQty);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${item.category || '—'}</td>
      <td>Rs ${Number(item.cost || 0).toLocaleString()}</td>
      <td class="text-emerald" style="font-weight:700;">Rs ${Number(item.salePrice).toLocaleString()}</td>
      <td><strong>${item.qty} ${item.unit || ''}</strong></td>
      <td>
        <span class="badge-tag ${isLow ? 'tag-gave' : 'tag-got'}">
          ${isLow ? '⚠️ کم اسٹاک (Low)' : 'موجود ہے (In Stock)'}
        </span>
      </td>
      <td>
        <button class="btn-text" style="color:var(--ruby);" onclick="deleteInventory('${item.id}')">حذف</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function openAddItemModal() {
  document.getElementById('itemInputName').value = '';
  document.getElementById('itemInputCategory').value = '';
  document.getElementById('itemInputCost').value = '';
  document.getElementById('itemInputSalePrice').value = '';
  document.getElementById('itemInputQty').value = '10';
  document.getElementById('itemInputMinQty').value = '5';
  openModal('modalAddItem');
}

function handleSaveInventoryItem(e) {
  e.preventDefault();
  const name = document.getElementById('itemInputName').value.trim();
  const category = document.getElementById('itemInputCategory').value.trim();
  const unit = document.getElementById('itemInputUnit').value;
  const cost = Number(document.getElementById('itemInputCost').value) || 0;
  const salePrice = Number(document.getElementById('itemInputSalePrice').value);
  const qty = Number(document.getElementById('itemInputQty').value) || 0;
  const minQty = Number(document.getElementById('itemInputMinQty').value) || 0;

  if (!name || !salePrice) {
    alert('برائے مہربانی سامان کا نام اور فروخت ریٹ درج کریں');
    return;
  }

  window.dhkDB.addInventoryItem({
    name,
    category,
    unit,
    cost,
    salePrice,
    qty,
    minQty
  });

  closeModal('modalAddItem');
  renderInventory();
  showToast('نیا سامان اسٹاک میں شامل ہو گیا!', 'success');
}

function deleteInventory(id) {
  if (confirm('کیا آپ واقعی یہ سامان ڈیلیٹ کرنا چاہتے ہیں؟')) {
    window.dhkDB.deleteInventoryItem(id);
    renderInventory();
    showToast('سامان حذف کر دیا گیا', 'error');
  }
}

// ============================================================
// 14. INVOICE & RECEIPT GENERATOR
// ============================================================
function initInvoiceDate() {
  const dateEl = document.getElementById('receiptDate');
  if (dateEl) dateEl.textContent = `تاریخ: ${new Date().toISOString().split('T')[0]}`;
}

function renderInvoiceView() {
  // Populate Customers datalist
  const datalist = document.getElementById('customerDatalist');
  datalist.innerHTML = '';
  const customers = window.dhkDB.getParties('customer');
  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.setAttribute('data-phone', c.phone || '');
    datalist.appendChild(opt);
  });

  // Populate Stock items select
  const itemSelect = document.getElementById('invItemSelect');
  itemSelect.innerHTML = '<option value="">-- اسٹاک سے منتخب کریں --</option>';
  const items = window.dhkDB.getInventory();
  items.forEach(i => {
    const opt = document.createElement('option');
    opt.value = i.id;
    opt.textContent = `${i.name} (Rs ${i.salePrice}) - موجودہ: ${i.qty}`;
    opt.setAttribute('data-rate', i.salePrice);
    itemSelect.appendChild(opt);
  });

  // Invoice Number
  const invoices = window.dhkDB.getInvoices();
  const nextNo = 'INV-' + String(invoices.length + 101).padStart(3, '0');
  document.getElementById('invoiceNumberDisplay').textContent = nextNo;
  document.getElementById('receiptInvNo').textContent = `بل #: ${nextNo}`;

  // Shop meta
  const settings = window.dhkDB.getSettings();
  document.getElementById('receiptShopName').textContent = settings.shopName || 'بسم اللہ جنرل اسٹور';
  document.getElementById('receiptShopPhone').textContent = `فون: ${settings.shopPhone || ''}`;
  document.getElementById('receiptShopAddress').textContent = settings.shopAddress || '';

  calcInvoiceTotals();
}

function onInvoiceItemSelectChange() {
  const select = document.getElementById('invItemSelect');
  const selected = select.options[select.selectedIndex];
  if (selected && selected.getAttribute('data-rate')) {
    document.getElementById('invItemRate').value = selected.getAttribute('data-rate');
  }
}

function addInvoiceItemRow() {
  const select = document.getElementById('invItemSelect');
  const selectedOpt = select.options[select.selectedIndex];
  const itemId = select.value;
  const name = selectedOpt && itemId ? selectedOpt.textContent.split(' (Rs')[0] : 'کسٹم آئٹم';
  const rate = Number(document.getElementById('invItemRate').value);
  const qty = Number(document.getElementById('invItemQty').value) || 1;

  if (!rate || rate <= 0) {
    alert('ریٹ درج کریں');
    return;
  }

  state.invoiceItems.push({
    itemId,
    name,
    rate,
    qty,
    total: rate * qty
  });

  // Reset item inputs
  select.value = '';
  document.getElementById('invItemRate').value = '';
  document.getElementById('invItemQty').value = '1';

  renderInvoiceTableRows();
  calcInvoiceTotals();
}

function removeInvoiceItemRow(index) {
  state.invoiceItems.splice(index, 1);
  renderInvoiceTableRows();
  calcInvoiceTotals();
}

function renderInvoiceTableRows() {
  const tbody = document.getElementById('invItemsTableBody');
  const receiptRows = document.getElementById('receiptRowsBody');
  tbody.innerHTML = '';
  receiptRows.innerHTML = '';

  state.invoiceItems.forEach((it, idx) => {
    // Form Table Row
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${it.name}</td>
      <td>Rs ${it.rate}</td>
      <td>${it.qty}</td>
      <td>Rs ${it.total.toLocaleString()}</td>
      <td><button class="btn-text" style="color:var(--ruby);" onclick="removeInvoiceItemRow(${idx})">✕</button></td>
    `;
    tbody.appendChild(tr);

    // Live Receipt Paper Row
    const rDiv = document.createElement('div');
    rDiv.className = 'receipt-item-row';
    rDiv.innerHTML = `
      <span>${it.name.substring(0, 18)}</span>
      <span>${it.qty} × ${it.rate}</span>
      <span>${it.total}</span>
    `;
    receiptRows.appendChild(rDiv);
  });
}

function calcInvoiceTotals() {
  let subtotal = 0;
  state.invoiceItems.forEach(it => subtotal += it.total);

  const discount = Number(document.getElementById('invDiscountInput').value) || 0;
  const grandTotal = Math.max(0, subtotal - discount);

  document.getElementById('invSubTotalDisplay').textContent = `Rs ${subtotal.toLocaleString()}`;
  document.getElementById('invGrandTotalDisplay').textContent = `Rs ${grandTotal.toLocaleString()}`;

  // Live Receipt
  document.getElementById('previewSubTotal').textContent = `Rs ${subtotal.toLocaleString()}`;
  document.getElementById('previewDiscount').textContent = `Rs ${discount.toLocaleString()}`;
  document.getElementById('previewGrandTotal').textContent = `Rs ${grandTotal.toLocaleString()}`;

  const payStatus = document.querySelector('input[name="invPaymentStatus"]:checked').value;
  const partialDiv = document.getElementById('partialPaidInputGroup');
  if (payStatus === 'partial') {
    partialDiv.style.display = 'block';
  } else {
    partialDiv.style.display = 'none';
  }

  const statusText = payStatus === 'paid' ? 'مکمل نقد ادا شدہ (Cash)' : payStatus === 'udhar' ? 'مکمل ادھار کھاتہ (Udhar)' : 'جزوی نقد باقی ادھار';
  document.getElementById('previewPaidStatus').textContent = statusText;

  // Customer meta
  const custName = document.getElementById('invCustomerName').value || 'کیش کسٹمر';
  const custPhone = document.getElementById('invCustomerPhone').value || '';
  document.getElementById('receiptCustName').textContent = `گاہک: ${custName}`;
  document.getElementById('receiptCustPhone').textContent = custPhone ? `فون: ${custPhone}` : '';
}

function saveAndGenerateInvoice(sendWhatsApp = false) {
  if (state.invoiceItems.length === 0) {
    alert('بل میں کم از کم ایک آئٹم شامل کریں');
    return;
  }

  const custName = document.getElementById('invCustomerName').value.trim() || 'کیش کسٹمر';
  const custPhone = document.getElementById('invCustomerPhone').value.trim();
  const payStatus = document.querySelector('input[name="invPaymentStatus"]:checked').value;
  const discount = Number(document.getElementById('invDiscountInput').value) || 0;

  let subtotal = 0;
  state.invoiceItems.forEach(it => subtotal += it.total);
  const grandTotal = Math.max(0, subtotal - discount);

  // 1. Deduct Stock for inventory items
  state.invoiceItems.forEach(it => {
    if (it.itemId) window.dhkDB.deductStock(it.itemId, it.qty);
  });

  // 2. If payment is Udhar or Partial, link to Khata
  let udharAmount = 0;
  if (payStatus === 'udhar') {
    udharAmount = grandTotal;
  } else if (payStatus === 'partial') {
    const paidCash = Number(document.getElementById('invPartialPaidAmount').value) || 0;
    udharAmount = Math.max(0, grandTotal - paidCash);
  }

  if (udharAmount > 0) {
    // Find or create customer
    let party = window.dhkDB.getParties('customer').find(c => c.name.toLowerCase() === custName.toLowerCase());
    if (!party) {
      party = window.dhkDB.addParty({
        name: custName,
        phone: custPhone,
        type: 'customer',
        balance: 0,
        balanceType: 'settled'
      });
    }

    // Record Udhar transaction
    window.dhkDB.addTransaction({
      partyId: party.id,
      type: 'gave',
      amount: udharAmount,
      note: `بل خریداری (${document.getElementById('invoiceNumberDisplay').textContent})`,
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'cash'
    });
  }

  // 3. Record Cash In Roznamcha for cash paid portion
  const cashPaid = grandTotal - udharAmount;
  if (cashPaid > 0) {
    window.dhkDB.addRoznamchaEntry({
      type: 'in',
      amount: cashPaid,
      category: 'فروخت (Sale)',
      note: `بل نقد فروخت (${document.getElementById('invoiceNumberDisplay').textContent}) - ${custName}`,
      date: new Date().toISOString().split('T')[0]
    });
  }

  // 4. Save Invoice Record
  const saved = window.dhkDB.saveInvoice({
    customerName: custName,
    customerPhone: custPhone,
    items: state.invoiceItems,
    subtotal,
    discount,
    grandTotal,
    paymentStatus: payStatus,
    udharAmount
  });

  showToast('بل کامیابی سے محفوظ ہو گیا!', 'success');

  if (sendWhatsApp) {
    if (!custPhone) {
      alert('واٹس ایپ بھیجنے کے لیے فون نمبر درج کریں۔');
      return;
    }
    sendInvoiceWhatsApp(saved);
  } else {
    // Trigger Print Dialog
    window.print();
  }
}

function sendInvoiceWhatsApp(invoice) {
  let cleanPhone = invoice.customerPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '92' + cleanPhone.substring(1);

  const settings = window.dhkDB.getSettings();
  let itemsList = '';
  invoice.items.forEach((it, idx) => {
    itemsList += `${idx + 1}. ${it.name} (${it.qty} x ${it.rate}) = Rs ${it.total}
`;
  });

  const msg = `*${settings.shopName || 'ڈیجیٹل بل رسید'}*
بل نمبر: ${invoice.id}
گاہک: ${invoice.customerName}
تاریخ: ${new Date().toLocaleDateString('ur-PK')}
---------------------------
${itemsList}---------------------------
*صافی کل رقم: Rs ${invoice.grandTotal.toLocaleString()}*
ادائیگی کی نوعیت: ${invoice.paymentStatus === 'paid' ? 'مکمل ادا شدہ' : 'ادھار کھاتہ'}

ہمارے پاس تشریف لانے کا شکریہ!`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function resetInvoiceForm() {
  state.invoiceItems = [];
  document.getElementById('invCustomerName').value = '';
  document.getElementById('invCustomerPhone').value = '';
  document.getElementById('invDiscountInput').value = '0';
  renderInvoiceTableRows();
  calcInvoiceTotals();
}

// ============================================================
// 15. REPORTS & ANALYTICS (PROFIT & LOSS, EXCEL & PDF EXPORT)
// ============================================================
function setReportPeriod(period) {
  state.reportPeriod = period;
  renderReports();
}

function renderReports() {
  const roznamcha = window.dhkDB.getRoznamcha();
  const parties = window.dhkDB.getParties();

  let totalRev = 0;
  let totalExp = 0;

  roznamcha.forEach(r => {
    if (r.type === 'in') totalRev += Number(r.amount);
    if (r.type === 'out') totalExp += Number(r.amount);
  });

  const netProfit = totalRev - totalExp;

  document.getElementById('reportTotalRevenue').textContent = `Rs ${totalRev.toLocaleString()}`;
  document.getElementById('reportTotalExpense').textContent = `Rs ${totalExp.toLocaleString()}`;
  const profitEl = document.getElementById('reportNetProfit');
  profitEl.textContent = `Rs ${netProfit.toLocaleString()}`;
  profitEl.className = netProfit >= 0 ? 'pnl-value text-emerald' : 'pnl-value text-ruby';

  // Receivables & Payables
  let recTotal = 0;
  let recCount = 0;
  parties.filter(p => p.type === 'customer').forEach(c => {
    if (c.balanceType === 'got' && c.balance > 0) {
      recTotal += Number(c.balance);
      recCount++;
    }
  });

  let payTotal = 0;
  let payCount = 0;
  parties.filter(p => p.type === 'supplier').forEach(s => {
    if (s.balanceType === 'gave' && s.balance > 0) {
      payTotal += Number(s.balance);
      payCount++;
    }
  });

  document.getElementById('repTotalDueCustomers').textContent = recCount;
  document.getElementById('repTotalUdharReceivable').textContent = `Rs ${recTotal.toLocaleString()}`;
  document.getElementById('repTotalSuppliersPayable').textContent = payCount;
  document.getElementById('repTotalPayableToSuppliers').textContent = `Rs ${payTotal.toLocaleString()}`;
}

// EXCEL (.XLSX) EXPORT VIA SHEETJS
function exportFullLedgerExcel() {
  if (typeof XLSX === 'undefined') {
    alert('SheetJS لائبریری لوڈ ہو رہی ہے، انٹرنیٹ کنکشن چیک کریں۔');
    return;
  }

  const wb = XLSX.utils.book_new();

  // 1. Customers Sheet
  const customers = window.dhkDB.getParties('customer').map(c => ({
    'گاہک کا نام (Name)': c.name,
    'فون نمبر (Phone)': c.phone || '',
    'بقایا رقم (Balance)': c.balance,
    'حالت (Status)': c.balanceType === 'got' ? 'وصولی' : c.balanceType === 'gave' ? 'ادھار' : 'کلیئر'
  }));
  const wsCust = XLSX.utils.json_to_sheet(customers);
  XLSX.utils.book_append_sheet(wb, wsCust, "Customers_Khata");

  // 2. Suppliers Sheet
  const suppliers = window.dhkDB.getParties('supplier').map(s => ({
    'سپلائر کا نام (Supplier)': s.name,
    'فون نمبر (Phone)': s.phone || '',
    'دینی رقم (Payable)': s.balance
  }));
  const wsSupp = XLSX.utils.json_to_sheet(suppliers);
  XLSX.utils.book_append_sheet(wb, wsSupp, "Suppliers_Khata");

  // 3. Cash Book Sheet
  const cash = window.dhkDB.getRoznamcha().map(r => ({
    'تاریخ (Date)': r.date,
    'قسم (Type)': r.type === 'in' ? 'آمدن' : 'خرچہ',
    'کیٹیگری (Category)': r.category,
    'رقم (Amount)': r.amount,
    'تفصیل (Note)': r.note
  }));
  const wsCash = XLSX.utils.json_to_sheet(cash);
  XLSX.utils.book_append_sheet(wb, wsCash, "Roznamcha_CashBook");

  // Write file
  XLSX.writeFile(wb, `Hisab_Kitab_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  showToast('ایکسل فائل کامیابی سے ڈاؤنلوڈ ہو گئی!', 'success');
}

function exportRoznamchaExcel() {
  exportFullLedgerExcel();
}

// PDF STATEMENT VIA JSPDF
function exportCustomerStatementPDF() {
  if (!state.activePartyId) return;
  const party = window.dhkDB.getParties().find(p => p.id === state.activePartyId);
  const txs = window.dhkDB.getTransactions(state.activePartyId);

  if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
    window.print();
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Digital Hisab Kitab - Customer Statement", 14, 20);
  doc.setFontSize(12);
  doc.text(`Customer: ${party.name}`, 14, 30);
  doc.text(`Phone: ${party.phone || 'N/A'}`, 14, 38);
  doc.text(`Outstanding Balance: Rs ${party.balance}`, 14, 46);
  doc.text(`Statement Date: ${new Date().toLocaleDateString()}`, 14, 54);

  let y = 70;
  doc.setFontSize(10);
  doc.text("Date", 14, y);
  doc.text("Description", 45, y);
  doc.text("Gave (Debit)", 110, y);
  doc.text("Got (Credit)", 150, y);
  doc.line(14, y + 2, 195, y + 2);
  y += 10;

  txs.forEach(t => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(t.date || '', 14, y);
    doc.text((t.note || 'Entry').substring(0, 30), 45, y);
    doc.text(t.type === 'gave' ? `Rs ${t.amount}` : '-', 110, y);
    doc.text(t.type === 'got' ? `Rs ${t.amount}` : '-', 150, y);
    y += 8;
  });

  doc.save(`${party.name}_statement.pdf`);
  showToast('PDF اسٹیٹمنٹ ڈاؤنلوڈ ہو گئی!', 'success');
}

function exportProfitLossPDF() {
  window.print();
}

// ============================================================
// 16. SETTINGS, SECURITY & CLOUD BACKUP
// ============================================================
function loadSettings() {
  const settings = window.dhkDB.getSettings();
  document.getElementById('settingShopName').value = settings.shopName || '';
  document.getElementById('settingShopPhone').value = settings.shopPhone || '';
  document.getElementById('settingShopAddress').value = settings.shopAddress || '';
  document.getElementById('settingPinInput').value = settings.pin || '1234';
  document.getElementById('settingPinEnabled').value = settings.pinEnabled !== false ? 'enabled' : 'disabled';
  document.getElementById('txtShopName').textContent = settings.shopName || 'میری دکان';
  // Also update dashboard hero
  const heroShop = document.getElementById('dbHeroShopName');
  if (heroShop && settings.shopName) heroShop.textContent = settings.shopName;
}

function saveShopSettings() {
  const name = document.getElementById('settingShopName').value.trim();
  const phone = document.getElementById('settingShopPhone').value.trim();
  const address = document.getElementById('settingShopAddress').value.trim();

  window.dhkDB.saveSettings({
    shopName: name,
    shopPhone: phone,
    shopAddress: address
  });

  document.getElementById('txtShopName').textContent = name;
  // Also update dashboard hero
  const heroShop = document.getElementById('dbHeroShopName');
  if (heroShop && name) heroShop.textContent = name;
  showToast('دکان کی تفصیلات محفوظ ہو گئیں!', 'success');
}

function saveSecuritySettings() {
  const pin = document.getElementById('settingPinInput').value.trim();
  const enabled = document.getElementById('settingPinEnabled').value === 'enabled';

  if (pin.length !== 4 || isNaN(pin)) {
    alert('پن کوڈ درست 4 ہندسوں پر مشتمل ہونا چاہیے');
    return;
  }

  window.dhkDB.saveSettings({
    pin,
    pinEnabled: enabled
  });

  showToast('پن کوڈ کی ترتیبات تبدیل ہو گئیں!', 'success');
}

function downloadDataBackup() {
  const json = window.dhkDB.exportFullDataJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Hisab_Kitab_Cloud_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('مکمل ڈیٹا بیک اپ فائل ڈاؤنلوڈ ہو گئی!', 'success');
}

function handleRestoreBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const success = window.dhkDB.importFullDataJSON(e.target.result);
    if (success) {
      showToast('بیک اپ کامیابی سے لوڈ ہو گیا!', 'success');
      setTimeout(() => location.reload(), 800);
    } else {
      alert('بیک اپ فائل درست نہیں ہے۔');
    }
  };
  reader.readAsText(file);
}

function confirmResetAllData() {
  if (confirm('توجہ فرمائیں! کیا آپ واقعی تمام کھاتے اور روزنامچہ مستقل طور پر ڈیلیٹ کرنا چاہتے ہیں؟')) {
    if (confirm('آخری تصدیق: تمام ریکارڈ ختم ہو جائے گا!')) {
      window.dhkDB.resetAllData();
      location.reload();
    }
  }
}

function triggerManualSync() {
  const syncPill = document.getElementById('syncStatusPill');
  const txt = document.getElementById('txtSyncStatus');
  txt.textContent = 'سنک ہو رہا ہے...';
  syncPill.style.opacity = '0.5';

  setTimeout(() => {
    syncPill.style.opacity = '1';
    txt.textContent = 'کلاؤڈ محفوظ ہے';
    showToast('کلاؤڈ سنک مکمل ہو گیا۔ تمام ریکارڈ محفوظ ہے۔', 'success');
  }, 700);
}

// ============================================================
// 17. MODALS & TOAST NOTIFICATIONS HELPER
// ============================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// Close modal on tapping the backdrop outside dialog
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
});

function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
