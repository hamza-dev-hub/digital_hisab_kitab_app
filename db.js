/**
 * DIGITAL HISAB KITAB - STORAGE & DATA ENGINE (db.js)
 * High performance local storage with auto cloud sync simulation,
 * complete JSON backup/restore, seed records, and transactions handling.
 */

const STORAGE_KEYS = {
  PARTIES: 'dhk_parties_v2',
  TRANSACTIONS: 'dhk_transactions_v2',
  ROZNAMCHA: 'dhk_roznamcha_v2',
  INVENTORY: 'dhk_inventory_v2',
  INVOICES: 'dhk_invoices_v2',
  SETTINGS: 'dhk_settings_v2',
  LAST_SYNC: 'dhk_last_sync_v2'
};

const DEFAULT_SETTINGS = {
  shopName: 'بسم اللہ جنرل اسٹور',
  shopPhone: '0300-1234567',
  shopAddress: 'مین مارکیٹ، نزد جامع مسجد، لاہور',
  pin: '1234',
  pinEnabled: true,
  currency: 'Rs',
  lang: 'ur'
};

const INITIAL_PARTIES = [
  { id: 'c1', name: 'محمد علی خان', phone: '03001234567', type: 'customer', balance: 4500, balanceType: 'got', createdAt: '2026-09-01' },
  { id: 'c2', name: 'طارق محمود کریانہ', phone: '03219876543', type: 'customer', balance: 12000, balanceType: 'got', createdAt: '2026-09-05' },
  { id: 'c3', name: 'چوہدری اکرم', phone: '03335554444', type: 'customer', balance: 0, balanceType: 'settled', createdAt: '2026-09-10' },
  { id: 's1', name: 'غوثیہ فلور ملز (سپلائر)', phone: '03451112233', type: 'supplier', balance: 28000, balanceType: 'gave', createdAt: '2026-08-20' },
  { id: 's2', name: 'حبیب آئل ملز ایجنسی', phone: '03124445566', type: 'supplier', balance: 15500, balanceType: 'gave', createdAt: '2026-08-25' }
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx1', partyId: 'c1', type: 'gave', amount: 5000, note: 'چینی 1 بوری اور گھی خریدا', date: '2026-09-15', paymentMode: 'cash' },
  { id: 'tx2', partyId: 'c1', type: 'got', amount: 500, note: 'جزوی وصولی نقد', date: '2026-09-18', paymentMode: 'cash' },
  { id: 'tx3', partyId: 'c2', type: 'gave', amount: 12000, note: 'ماہانہ راشن سامان ادھار', date: '2026-09-10', paymentMode: 'cash' },
  { id: 'tx4', partyId: 's1', type: 'got', amount: 35000, note: 'آٹے کی سپلائی موصول ہوئی', date: '2026-09-05', paymentMode: 'cash' },
  { id: 'tx5', partyId: 's1', type: 'gave', amount: 7000, note: 'بینک سے ادائیگی کی گئی', date: '2026-09-12', paymentMode: 'bank' }
];

const INITIAL_ROZNAMCHA = [
  { id: 'rz1', date: '2026-09-21', type: 'in', category: 'فروخت (Sale)', amount: 18500, note: 'صبح اور شام کی نقد سیل' },
  { id: 'rz2', date: '2026-09-21', type: 'in', category: 'گاہک سے وصولی (Udhar Recovery)', amount: 2000, note: 'اکرم کریانہ سے ادھار ملا' },
  { id: 'rz3', date: '2026-09-21', type: 'out', category: 'دکان خرچہ (Shop Expense)', amount: 450, note: 'چائے، بسکٹ و صفائی سامان' },
  { id: 'rz4', date: '2026-09-21', type: 'out', category: 'سامان کی خریداری (Purchase)', amount: 6200, note: 'دودھ و کولڈ ڈرنکس کی نقد خریداری' }
];

const INITIAL_INVENTORY = [
  { id: 'i1', name: 'ڈالڈا کوکنگ آئل 1 لیٹر', category: 'کریانہ', unit: 'بوتل (btl)', cost: 510, salePrice: 560, qty: 24, minQty: 10 },
  { id: 'i2', name: 'باسمتی چاول کرنل سپر', category: 'اناج', unit: 'کلو (kg)', cost: 290, salePrice: 340, qty: 85, minQty: 25 },
  { id: 'i3', name: 'چینی سفید صافی', category: 'کریانہ', unit: 'کلو (kg)', cost: 135, salePrice: 148, qty: 8, minQty: 15 }, // Low stock!
  { id: 'i4', name: 'لپٹن یلو لیبل چائے 400g', category: 'کریانہ', unit: 'پیکٹ (pkt)', cost: 820, salePrice: 920, qty: 4, minQty: 8 }, // Low stock!
  { id: 'i5', name: 'حبیب بناسپتی گھی 1 کلو', category: 'کریانہ', unit: 'پیکٹ (pkt)', cost: 480, salePrice: 520, qty: 40, minQty: 12 }
];

class HisabDB {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.save(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PARTIES)) {
      this.save(STORAGE_KEYS.PARTIES, INITIAL_PARTIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.save(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROZNAMCHA)) {
      this.save(STORAGE_KEYS.ROZNAMCHA, INITIAL_ROZNAMCHA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
      this.save(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      this.save(STORAGE_KEYS.INVOICES, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LAST_SYNC)) {
      this.save(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed reading key', key, e);
      return null;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.error('Failed saving key', key, e);
      return false;
    }
  }

  // --- Parties (Customers & Suppliers) ---
  getParties(type = null) {
    const list = this.get(STORAGE_KEYS.PARTIES) || [];
    return type ? list.filter(p => p.type === type) : list;
  }

  addParty(party) {
    const parties = this.get(STORAGE_KEYS.PARTIES) || [];
    party.id = 'p_' + Date.now();
    party.createdAt = new Date().toISOString().split('T')[0];
    parties.unshift(party);
    this.save(STORAGE_KEYS.PARTIES, parties);
    return party;
  }

  updatePartyBalance(partyId) {
    const parties = this.get(STORAGE_KEYS.PARTIES) || [];
    const txs = (this.get(STORAGE_KEYS.TRANSACTIONS) || []).filter(t => t.partyId === partyId);
    
    let net = 0; // Positive = You Got more (Credit), Negative = You Gave more (Debit)
    txs.forEach(t => {
      if (t.type === 'gave') net -= Number(t.amount);
      if (t.type === 'got') net += Number(t.amount);
    });

    const index = parties.findIndex(p => p.id === partyId);
    if (index !== -1) {
      const p = parties[index];
      // For Customer: If we gave them goods (gave), they owe us (You Will Get)
      // If we received payment (got), their debt decreases
      if (p.type === 'customer') {
        const debt = -net; // debt > 0 means customer owes us (You will get)
        p.balance = Math.abs(debt);
        p.balanceType = debt > 0 ? 'got' : debt < 0 ? 'gave' : 'settled';
      } else {
        // For Supplier: If supplier gave us goods (got), we owe them (You Will Give)
        // If we gave payment (gave), our debt decreases
        const payable = net; // net > 0 means we got goods and owe them (You will give)
        p.balance = Math.abs(payable);
        p.balanceType = payable > 0 ? 'gave' : payable < 0 ? 'got' : 'settled';
      }
      parties[index] = p;
      this.save(STORAGE_KEYS.PARTIES, parties);
    }
  }

  // --- Transactions ---
  getTransactions(partyId = null) {
    const list = this.get(STORAGE_KEYS.TRANSACTIONS) || [];
    return partyId ? list.filter(t => t.partyId === partyId) : list;
  }

  addTransaction(tx) {
    const list = this.get(STORAGE_KEYS.TRANSACTIONS) || [];
    tx.id = 'tx_' + Date.now();
    list.unshift(tx);
    this.save(STORAGE_KEYS.TRANSACTIONS, list);
    this.updatePartyBalance(tx.partyId);
    return tx;
  }

  deleteTransaction(txId) {
    let list = this.get(STORAGE_KEYS.TRANSACTIONS) || [];
    const tx = list.find(t => t.id === txId);
    if (!tx) return false;
    list = list.filter(t => t.id !== txId);
    this.save(STORAGE_KEYS.TRANSACTIONS, list);
    this.updatePartyBalance(tx.partyId);
    return true;
  }

  // --- Roznamcha (Cash Book) ---
  getRoznamcha(date = null) {
    const list = this.get(STORAGE_KEYS.ROZNAMCHA) || [];
    return date ? list.filter(r => r.date === date) : list;
  }

  addRoznamchaEntry(entry) {
    const list = this.get(STORAGE_KEYS.ROZNAMCHA) || [];
    entry.id = 'rz_' + Date.now();
    list.unshift(entry);
    this.save(STORAGE_KEYS.ROZNAMCHA, list);
    return entry;
  }

  deleteRoznamchaEntry(entryId) {
    let list = this.get(STORAGE_KEYS.ROZNAMCHA) || [];
    list = list.filter(r => r.id !== entryId);
    this.save(STORAGE_KEYS.ROZNAMCHA, list);
    return true;
  }

  // --- Inventory ---
  getInventory() {
    return this.get(STORAGE_KEYS.INVENTORY) || [];
  }

  addInventoryItem(item) {
    const list = this.getInventory();
    item.id = 'inv_' + Date.now();
    list.unshift(item);
    this.save(STORAGE_KEYS.INVENTORY, list);
    return item;
  }

  updateInventoryItem(updated) {
    let list = this.getInventory();
    list = list.map(item => item.id === updated.id ? updated : item);
    this.save(STORAGE_KEYS.INVENTORY, list);
    return true;
  }

  deleteInventoryItem(itemId) {
    let list = this.getInventory();
    list = list.filter(item => item.id !== itemId);
    this.save(STORAGE_KEYS.INVENTORY, list);
    return true;
  }

  deductStock(itemId, quantity) {
    const list = this.getInventory();
    const item = list.find(i => i.id === itemId);
    if (item) {
      item.qty = Math.max(0, Number(item.qty) - Number(quantity));
      this.save(STORAGE_KEYS.INVENTORY, list);
    }
  }

  // --- Invoices ---
  getInvoices() {
    return this.get(STORAGE_KEYS.INVOICES) || [];
  }

  saveInvoice(invoice) {
    const list = this.getInvoices();
    invoice.id = 'INV-' + (list.length + 101);
    invoice.createdAt = new Date().toISOString();
    list.unshift(invoice);
    this.save(STORAGE_KEYS.INVOICES, list);
    return invoice;
  }

  // --- Settings ---
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS) || DEFAULT_SETTINGS;
  }

  saveSettings(settings) {
    const current = this.getSettings();
    const merged = Object.assign({}, current, settings);
    this.save(STORAGE_KEYS.SETTINGS, merged);
    return merged;
  }

  // --- Cloud Sync & Backup ---
  exportFullDataJSON() {
    return JSON.stringify({
      version: '2.0',
      exportedAt: new Date().toISOString(),
      parties: this.getParties(),
      transactions: this.getTransactions(),
      roznamcha: this.get(STORAGE_KEYS.ROZNAMCHA) || [],
      inventory: this.getInventory(),
      invoices: this.getInvoices(),
      settings: this.getSettings()
    }, null, 2);
  }

  importFullDataJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.parties || !data.transactions) {
        throw new Error('Invalid Hisab Kitab backup file format.');
      }
      this.save(STORAGE_KEYS.PARTIES, data.parties);
      this.save(STORAGE_KEYS.TRANSACTIONS, data.transactions);
      this.save(STORAGE_KEYS.ROZNAMCHA, data.roznamcha || []);
      this.save(STORAGE_KEYS.INVENTORY, data.inventory || []);
      this.save(STORAGE_KEYS.INVOICES, data.invoices || []);
      if (data.settings) this.save(STORAGE_KEYS.SETTINGS, data.settings);
      this.save(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  }

  resetAllData() {
    localStorage.clear();
    this.init();
  }
}

window.dhkDB = new HisabDB();
