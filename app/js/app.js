/* 지속가능한 실천방안 세우기 — 앱 로직 */

const state = { name: null };

const FIELD_MAP = {
  roadmap: { prefix: 'rm', fields: ['growthGoal', 'actions', 'resources', 'checkMethods'] },
  flow:    { prefix: 'fl', fields: ['start', 'apply', 'expand', 'sustain'] },
  final:   { prefix: 'fn', fields: ['growthGoal', 'act1', 'sup1', 'chk1', 'act2', 'sup2', 'chk2', 'act3', 'sup3', 'chk3'] }
};

const ERROR_MESSAGES = {
  NOT_FOUND: '명단에서 이름을 찾을 수 없습니다. 이름을 다시 확인해 주세요.',
  EMPTY_NAME: '이름을 입력해 주세요.',
  TIMEOUT: '서버 응답이 늦어지고 있어요. 잠시 후 다시 시도해 주세요.',
  NETWORK: '네트워크 연결을 확인한 뒤 다시 시도해 주세요.',
  INVALID_RESPONSE: '서버가 아직 준비되지 않았습니다. 강사에게 문의해 주세요.',
  NO_AUTH_SHEET: '명단 시트가 아직 준비되지 않았습니다. 강사에게 문의해 주세요.'
};

function msgFor(error) {
  return ERROR_MESSAGES[error] || `오류가 발생했습니다. (${error})`;
}

/* ---------- UI 유틸 ---------- */

function $(id) { return document.getElementById(id); }

function toast(message, type = 'success') {
  const wrap = $('toast-wrap');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(() => el.classList.add('is-out'), 2500);
  setTimeout(() => el.remove(), 2900);
}

function setBusy(btn, busy) {
  btn.disabled = busy;
  btn.classList.toggle('is-busy', busy);
}

function showPage(id) {
  if (!state.name && id !== 'page-login') { id = 'page-login'; }
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('is-active', p.id === id));
  document.querySelectorAll('.stepnav .step').forEach(btn => {
    const current = btn.dataset.page === id;
    btn.classList.toggle('is-current', current);
    if (current) btn.setAttribute('aria-current', 'step');
    else btn.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function setLoggedIn(name) {
  state.name = name;
  $('username').textContent = `${name} 선생님`;
  $('userbox').hidden = false;
  document.querySelectorAll('.stepnav .step').forEach(btn => { btn.disabled = false; });
  localStorage.setItem(CONFIG.STORAGE_KEY, name);
}

function setLoggedOut() {
  state.name = null;
  $('userbox').hidden = true;
  document.querySelectorAll('.stepnav .step').forEach(btn => { btn.disabled = true; });
  localStorage.removeItem(CONFIG.STORAGE_KEY);
  showPage('page-login');
}

/* ---------- 데이터 <-> 폼 ---------- */

function fieldEl(sheet, field) {
  return $(`${FIELD_MAP[sheet].prefix}-${field}`);
}

function collect(sheet) {
  const data = {};
  FIELD_MAP[sheet].fields.forEach(f => { data[f] = fieldEl(sheet, f).value.trim(); });
  return data;
}

function fill(sheet, data) {
  if (!data) return;
  FIELD_MAP[sheet].fields.forEach(f => {
    if (data[f]) fieldEl(sheet, f).value = data[f];
  });
}

/* 4페이지 프리필: 비어있는 칸만 앞 단계 내용으로 채움 */
function prefillFinal() {
  const pairs = [
    ['fn-growthGoal', 'rm-growthGoal'],
    ['fn-act1', 'fl-start'],
    ['fn-act2', 'fl-apply'],
    ['fn-act3', 'fl-expand']
  ];
  pairs.forEach(([to, from]) => {
    if (!$(to).value.trim() && $(from).value.trim()) $(to).value = $(from).value.trim();
  });
}

/* ---------- 임시저장(draft) ---------- */

function draftKey() { return `${CONFIG.DRAFT_KEY}_${state.name || 'anon'}`; }

function saveDraft() {
  if (!state.name) return;
  const all = {};
  document.querySelectorAll('[data-draft]').forEach(el => { all[el.id] = el.value; });
  localStorage.setItem(draftKey(), JSON.stringify(all));
}

function restoreDraft() {
  const raw = localStorage.getItem(draftKey());
  if (!raw) return;
  try {
    const all = JSON.parse(raw);
    Object.entries(all).forEach(([id, value]) => {
      const el = $(id);
      if (el && !el.value.trim() && value) el.value = value;
    });
  } catch { /* 손상된 draft는 무시 */ }
}

/* ---------- 저장/로드 ---------- */

async function loadInto(name) {
  const res = await apiLoad(name);
  if (!res.ok) { toast(msgFor(res.error), 'error'); return false; }
  fill('roadmap', res.roadmap);
  fill('flow', res.flow);
  fill('final', res.final);
  restoreDraft();
  return true;
}

async function handleSave(sheet, btn, successMsg) {
  setBusy(btn, true);
  const res = await apiSave(sheet, state.name, collect(sheet));
  setBusy(btn, false);
  if (res.ok) toast(successMsg);
  else toast(msgFor(res.error), 'error');
  return res.ok;
}

/* ---------- 요약 뷰 ---------- */

function renderSummary() {
  const d = collect('final');
  $('summary-title').textContent = `${state.name} 선생님의 실천로드맵`;
  $('summary-goal').textContent = d.growthGoal || '(성장목표 미작성)';
  const periods = [
    ['1–2개월', d.act1, d.sup1, d.chk1],
    ['3–4개월', d.act2, d.sup2, d.chk2],
    ['5–6개월', d.act3, d.sup3, d.chk3]
  ];
  $('summary-grid').innerHTML = periods.map(([period, act, sup, chk]) => `
    <div class="summary-card">
      <span class="summary-period">${period}</span>
      <dl>
        <dt>실천</dt><dd>${escapeHtml(act) || '—'}</dd>
        <dt>지원</dt><dd>${escapeHtml(sup) || '—'}</dd>
        <dt>성장 점검</dt><dd>${escapeHtml(chk) || '—'}</dd>
      </dl>
    </div>`).join('');
  $('summary').hidden = false;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- 이벤트 바인딩 ---------- */

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = $('login-name').value.trim();
  if (!name) { toast(msgFor('EMPTY_NAME'), 'error'); return; }
  const btn = $('btn-login');
  setBusy(btn, true);
  const res = await apiLogin(name);
  if (!res.ok) {
    setBusy(btn, false);
    toast(msgFor(res.error), 'error');
    return;
  }
  setLoggedIn(res.name);
  await loadInto(res.name);
  setBusy(btn, false);
  toast(`${res.name} 선생님, 환영합니다!`);
  showPage('page-roadmap');
});

$('btn-logout').addEventListener('click', () => { saveDraft(); setLoggedOut(); });

document.querySelectorAll('.stepnav .step').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.page === 'page-final') prefillFinal();
    showPage(btn.dataset.page);
  });
});

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.goto === 'page-final') prefillFinal();
    showPage(btn.dataset.goto);
  });
});

$('btn-save-roadmap').addEventListener('click', () => handleSave('roadmap', $('btn-save-roadmap'), '실천로드맵이 저장되었습니다.'));
$('btn-save-flow').addEventListener('click', () => handleSave('flow', $('btn-save-flow'), '실천흐름이 저장되었습니다.'));
$('btn-save-final').addEventListener('click', async () => {
  const ok = await handleSave('final', $('btn-save-final'), '실천로드맵이 완성되었습니다!');
  if (ok) renderSummary();
});

document.querySelectorAll('[data-draft]').forEach(el => {
  el.addEventListener('input', saveDraft);
});

/* ---------- 초기화 ---------- */

(async function init() {
  const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (!saved) { showPage('page-login'); return; }
  setLoggedIn(saved);
  showPage('page-roadmap');
  await loadInto(saved);
})();
