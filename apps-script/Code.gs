/**
 * Wedding RSVP backend — Google Apps Script
 * Aprilia & Mirda · 26 December 2026
 *
 * What it does
 *   POST  → appends one row per RSVP to the "RSVP" sheet
 *   GET   ?action=wishes → returns approved wishes as JSON for the website
 *
 * Setup (once): see README.md, "Step 2 — Google Sheets + Apps Script".
 */

var SHEET_NAME = 'RSVP';
var HEADERS = ['Timestamp', 'Name', 'Attendance', 'Guests', 'Message', 'Show on website'];
var MAX_WISHES = 300;          // how many wishes the website receives at most

/** Run this once from the editor (select "setup" → Run). Creates & formats the sheet. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#647348').setFontColor('#FBF2EE');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 160); sh.setColumnWidth(2, 200); sh.setColumnWidth(3, 120);
  sh.setColumnWidth(4, 70);  sh.setColumnWidth(5, 420); sh.setColumnWidth(6, 130);
  sh.getRange('E:E').setWrap(true);
  sh.getRange('A:A').setNumberFormat('dd mmm yyyy, hh:mm');
  // "Show on website" as checkboxes — untick to hide a wish from the site
  sh.getRange(2, 6, sh.getMaxRows() - 1, 1).insertCheckboxes();
  ss.setSpreadsheetTimeZone('Asia/Jakarta');
  buildSummary_(ss);
}

/** A second tab with live totals (formulas — no maintenance needed). */
function buildSummary_(ss) {
  var sh = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  sh.clear();
  var rows = [
    ['Summary', ''],
    ['Total RSVPs',         '=COUNTA(RSVP!B2:B)'],
    ['Attending (RSVPs)',   '=COUNTIF(RSVP!C2:C,"Attending")'],
    ['Not attending',       '=COUNTIF(RSVP!C2:C,"Not Attending")'],
    ['Total guests coming', '=SUMIF(RSVP!C2:C,"Attending",RSVP!D2:D)'],
    ['Wishes received',     '=COUNTIF(RSVP!E2:E,"?*")']
  ];
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
  sh.getRange('A1').setFontWeight('bold').setFontSize(14);
  sh.setColumnWidth(1, 200);
}

/* ------------------------------------------------------------------ */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var p = (e && e.parameter) || {};

    if (p.website) return json_({ ok: true });            // honeypot: bot, silently ignore

    var name = clean_(p.name, 80);
    var attendance = p.attendance === 'Attending' ? 'Attending'
                   : p.attendance === 'Not Attending' ? 'Not Attending' : '';
    var guests = attendance === 'Attending' ? Math.max(1, Math.min(20, parseInt(p.guests, 10) || 1)) : 0;
    var message = clean_(p.message, 500);

    if (!name || !attendance) return json_({ ok: false, error: 'Name and attendance are required.' });

    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sh) { setup(); sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME); }
    sh.appendRow([new Date(), name, attendance, guests, message, true]);
    sh.getRange(sh.getLastRow(), 6).insertCheckboxes().setValue(true);
    CacheService.getScriptCache().remove('wishes');

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action !== 'wishes') return json_({ ok: true, service: 'wedding-rsvp' });

  var cache = CacheService.getScriptCache();
  var hit = cache.get('wishes');
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);

  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var wishes = [];
  if (sh && sh.getLastRow() > 1) {
    var data = sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues();
    for (var i = data.length - 1; i >= 0 && wishes.length < MAX_WISHES; i--) {
      var r = data[i];
      var show = r[5] === true || r[5] === 'TRUE' || r[5] === '';
      if (r[4] && show) {
        wishes.push({
          name: String(r[1]).replace(/^'/, ''),
          message: String(r[4]).replace(/^'/, ''),
          time: r[0] instanceof Date ? r[0].toISOString() : ''
        });
      }
    }
  }
  var out = JSON.stringify({ ok: true, wishes: wishes });
  cache.put('wishes', out, 15);                   // 15 s cache keeps it fast under load
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ */

function clean_(v, max) {
  var s = String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
  // stop spreadsheet formula injection (=, +, -, @ at the start)
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
