/**
 * 지속가능한 실천방안 세우기 — 백엔드 API
 * 시트: auth(명단) / roadmap / flow / final
 * 배포: 웹 앱, 실행 권한 "나", 액세스 권한 "모든 사용자"
 */
var SS_ID = '14tYk1n65EDeCfmF95YDAeBwsxUcFNhruwMdvGU-boD0';

var SHEETS = {
  auth:    { headers: ['이름'] },
  roadmap: { headers: ['이름', '성장목표', '실천활동', '지원자원', '점검방법', '수정일시'],
             fields:  ['growthGoal', 'actions', 'resources', 'checkMethods'] },
  flow:    { headers: ['이름', '시작(1-2개월)', '적용(3-4개월)', '확장(5-6개월)', '지속(이후)', '수정일시'],
             fields:  ['start', 'apply', 'expand', 'sustain'] },
  final:   { headers: ['이름', '성장목표',
                       '실천1(1-2개월)', '지원1', '점검1',
                       '실천2(3-4개월)', '지원2', '점검2',
                       '실천3(5-6개월)', '지원3', '점검3', '수정일시'],
             fields:  ['growthGoal', 'act1', 'sup1', 'chk1', 'act2', 'sup2', 'chk2', 'act3', 'sup3', 'chk3'] }
};

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var action = (e.parameter.action || '').trim();
    if (action === 'setup') return json(setupSheets());
    if (action === 'login') return json(login(e.parameter.name));
    if (action === 'load')  return json(loadAll(e.parameter.name));
    return json({ ok: false, error: 'UNKNOWN_ACTION' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === 'save') return json(save(body.sheet, body.name, body.data));
    return json({ ok: false, error: 'UNKNOWN_ACTION' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function ss() { return SpreadsheetApp.openById(SS_ID); }

function setupSheets() {
  var spreadsheet = ss();
  var order = ['auth', 'roadmap', 'flow', 'final'];
  order.forEach(function (name, i) {
    var sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name, i);
    var headers = SHEETS[name].headers;
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  });
  var auth = spreadsheet.getSheetByName('auth');
  if (auth.getLastRow() < 2) auth.getRange(2, 1).setValue('테스트교사');
  return { ok: true, message: 'setup complete' };
}

function normalize(name) { return String(name || '').replace(/\s+/g, ''); }

function login(name) {
  var n = normalize(name);
  if (!n) return { ok: false, error: 'EMPTY_NAME' };
  var auth = ss().getSheetByName('auth');
  if (!auth) return { ok: false, error: 'NO_AUTH_SHEET' };
  var last = auth.getLastRow();
  if (last >= 2) {
    var values = auth.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      if (normalize(values[i][0]) === n) return { ok: true, name: String(values[i][0]) };
    }
  }
  return { ok: false, error: 'NOT_FOUND' };
}

function findRow(sheet, name) {
  var n = normalize(name);
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var values = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (normalize(values[i][0]) === n) return i + 2;
  }
  return -1;
}

function save(sheetName, name, data) {
  var conf = SHEETS[sheetName];
  if (!conf || !conf.fields) return { ok: false, error: 'INVALID_SHEET' };
  var auth = login(name);
  if (!auth.ok) return auth;
  var sheet = ss().getSheetByName(sheetName);
  if (!sheet) return { ok: false, error: 'NO_SHEET_' + sheetName };
  var row = [auth.name];
  conf.fields.forEach(function (f) { row.push(String((data && data[f]) || '')); });
  row.push(Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'));
  var r = findRow(sheet, name);
  if (r === -1) r = sheet.getLastRow() + 1;
  sheet.getRange(r, 1, 1, row.length).setValues([row]);
  return { ok: true };
}

function loadOne(sheetName, name) {
  var conf = SHEETS[sheetName];
  var sheet = ss().getSheetByName(sheetName);
  if (!sheet) return null;
  var r = findRow(sheet, name);
  if (r === -1) return null;
  var values = sheet.getRange(r, 1, 1, conf.headers.length).getValues()[0];
  var out = {};
  conf.fields.forEach(function (f, i) { out[f] = String(values[i + 1] || ''); });
  return out;
}

function loadAll(name) {
  var auth = login(name);
  if (!auth.ok) return auth;
  return {
    ok: true,
    name: auth.name,
    roadmap: loadOne('roadmap', name),
    flow: loadOne('flow', name),
    final: loadOne('final', name)
  };
}
