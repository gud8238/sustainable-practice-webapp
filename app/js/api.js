/* GAS Web App API — GET 쿼리스트링, POST는 text/plain(JSON)으로 preflight 회피 */

async function request(url, options = {}, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal, redirect: 'follow' });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { ok: false, error: 'INVALID_RESPONSE' };
    }
  } catch (err) {
    return { ok: false, error: err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK' };
  } finally {
    clearTimeout(timer);
  }
}

function apiLogin(name) {
  const url = `${CONFIG.GAS_URL}?action=login&name=${encodeURIComponent(name)}`;
  return request(url);
}

function apiLoad(name) {
  const url = `${CONFIG.GAS_URL}?action=load&name=${encodeURIComponent(name)}`;
  return request(url);
}

function apiSave(sheet, name, data) {
  return request(CONFIG.GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'save', sheet, name, data })
  });
}
