/* Wedding invitation — behaviour. Content lives in js/config.js. */
(function () {
  "use strict";
  var C = window.WEDDING;
  var TZ = "Asia/Jakarta";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function get(path) { return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, C); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function fmt(d, opts) { return new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: TZ }, opts)).format(d); }
  function hm(d) { return fmt(d, { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", "."); }

  /* Invitation type from the link: ?type=akad → Akad + Resepsi, otherwise Resepsi only */
  var INV = C.invite || {};
  var typeParam = (new URLSearchParams(location.search).get("type") || INV.default || "resepsi").toLowerCase();
  var INVITE = typeParam === "akad" ? "akad" : "resepsi";
  document.documentElement.setAttribute("data-invite", INVITE);
  var visibleSessions = C.event.sessions.filter(function (s) { return INVITE === "akad" || !s.akadOnly; });
  var sessions = visibleSessions.map(function (s) { return { name: s.name, start: new Date(s.start), end: new Date(s.end) }; });
  var first = sessions[0];
  // The Save the Date card always lists every session (same card for both invitations)
  var allSessions = C.event.sessions.map(function (s) { return { name: s.name, start: new Date(s.start), end: new Date(s.end) }; });
  C.__dateLong = fmt(first.start, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  /* ---------- Bind config into the page ---------- */
  $$("[data-text]").forEach(function (n) {
    var v = get(n.getAttribute("data-text"));
    if (v) n.textContent = v; else if (n.closest("blockquote")) n.closest("blockquote").hidden = true;
  });
  $$("[data-src]").forEach(function (n) { var v = get(n.getAttribute("data-src")); if (v) n.src = v; });
  $$("[data-href]").forEach(function (n) { var v = get(n.getAttribute("data-href")); if (v) { n.href = v; n.hidden = false; } });
  $$("[data-initial]").forEach(function (n) { n.textContent = (C[n.getAttribute("data-initial")].nickname || "").charAt(0); });
  // Your own monogram image replaces the initials everywhere (media.monogram)
  if (C.media.monogram) {
    $$(".monogram").forEach(function (m) {
      var img = el("img", "monogram__img"); img.src = C.media.monogram; img.alt = ""; img.decoding = "async";
      m.textContent = ""; m.classList.add("monogram--image"); m.appendChild(img);
    });
  }

  /* ---------- Moving background ---------- */
  var bgv = $("#bgVideo"), M = C.media;
  $("#bgShade").style.opacity = M.backgroundDarkness == null ? 0.5 : M.backgroundDarkness;
  if (M.backgroundPoster) { $(".bg").style.backgroundImage = "url('" + M.backgroundPoster + "')"; bgv.poster = M.backgroundPoster; }
  if (M.backgroundVideo) {
    bgv.src = M.backgroundVideo;
    bgv.muted = true;                 // required for autoplay on iPhone/Android
    var tryPlay = function () { var p = bgv.play(); if (p && p.catch) p.catch(function () {}); };
    tryPlay();
    // iOS pauses background video when the tab is hidden or in Low Power Mode; resume when possible
    document.addEventListener("visibilitychange", function () { if (!document.hidden) tryPlay(); });
    document.addEventListener("touchstart", tryPlay, { once: true, passive: true });
  } else { bgv.remove(); }

  /* ---------- Personalised guest name: ?to=Budi+Santoso ---------- */
  var to = new URLSearchParams(location.search).get("to");
  if (to) {
    to = to.trim().slice(0, 60);
    $("#guestName").textContent = to;
    $("#guestBlock").hidden = false;
    $("#fName").value = to;
  }

  /* ---------- Cover / open / sound ----------
     Sound comes from media.music if set, otherwise from the background
     video itself (media.backgroundVideoSound: true). Browsers only allow
     sound after a tap, so it switches on with "Open invitation".        */
  var audio = $("#bgm"), musicBtn = $("#musicBtn");
  var soundFrom = M.music ? "music" : (M.backgroundVideo && M.backgroundVideoSound ? "video" : "");
  if (soundFrom === "music") audio.src = M.music;
  function setBtn(on) { musicBtn.setAttribute("aria-pressed", on ? "true" : "false"); musicBtn.setAttribute("aria-label", on ? "Mute sound" : "Play sound"); }
  function setMusic(on) {
    if (soundFrom === "music") {
      if (on) { var p = audio.play(); if (p && p.catch) p.catch(function () { setBtn(false); }); } else audio.pause();
    } else if (soundFrom === "video") {
      bgv.muted = !on;
      if (on) { var q2 = bgv.play(); if (q2 && q2.catch) q2.catch(function () { bgv.muted = true; bgv.play().catch(function () {}); setBtn(false); }); }
    } else return;
    setBtn(on);
  }
  $("#openBtn").addEventListener("click", function () {
    $("#cover").classList.add("is-open");
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    if (M.backgroundVideo) bgv.play().catch(function () {});
    if (soundFrom) { musicBtn.hidden = false; setMusic(true); }
    $("#dock").hidden = false;
    setTimeout(function () { $("#cover").hidden = true; }, 1100);
  });
  musicBtn.addEventListener("click", function () { setMusic(musicBtn.getAttribute("aria-pressed") !== "true"); });
  document.addEventListener("visibilitychange", function () {
    if (soundFrom !== "music") return;   // a video pauses itself when the tab is hidden
    if (document.hidden && !audio.paused) { audio.pause(); audio.dataset.resume = "1"; }
    else if (!document.hidden && audio.dataset.resume) { delete audio.dataset.resume; setMusic(true); }
  });

  /* ---------- Event cards: Akad + Resepsi ---------- */
  function gcal(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var q = encodeURIComponent(C.event.mapsQuery || C.event.venueName);
  var mapsUrl = C.event.mapsLink || ("https://www.google.com/maps/search/?api=1&query=" + q);
  var pageUrl = location.href.split("?")[0].split("#")[0];
  /* One card: date + both sessions + venue */
  var last = sessions[sessions.length - 1];
  var schedText = sessions.map(function (s) { return s.name + ": " + hm(s.start) + " – " + hm(s.end) + " WIB"; }).join("\n");
  var cal = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(C.event.title) +
    "&dates=" + gcal(first.start) + "/" + gcal(last.end) +
    "&details=" + encodeURIComponent(C.event.calendarDescription + "\n\n" + schedText + "\n\n" + pageUrl) +
    "&location=" + encodeURIComponent(C.event.venueName + ", " + C.event.venueAddress) +
    "&ctz=" + TZ;
  var c = el("article", "event glass reveal");
  var d = el("div", "event__date");
  d.appendChild(el("span", null, fmt(first.start, { weekday: "long" })));
  d.appendChild(el("span", "event__day-num", fmt(first.start, { day: "numeric" })));
  d.appendChild(el("span", null, fmt(first.start, { year: "numeric" })));
  c.appendChild(d);
  c.appendChild(el("p", "event__month", fmt(first.start, { month: "long" })));
  var list = el("div", "event__sessions");
  allSessions.forEach(function (s) {
    var row = el("div", "event__session");
    row.appendChild(el("h3", "event__name", s.name));
    row.appendChild(el("p", "event__time", hm(s.start) + " – " + hm(s.end) + " WIB"));
    list.appendChild(row);
  });
  c.appendChild(list);
  c.appendChild(el("p", "small event__at", "Located at"));
  c.appendChild(el("p", "event__venue", C.event.venueName));
  c.appendChild(el("p", "event__addr", C.event.venueAddress));
  var btns = el("div", "event__btns");
  var a1 = el("a", "btn btn--ghost", "Google Maps"); a1.href = mapsUrl; a1.target = "_blank"; a1.rel = "noopener";
  var a2 = el("a", "btn btn--solid", "Save to calendar"); a2.href = cal; a2.target = "_blank"; a2.rel = "noopener";
  btns.appendChild(a1); btns.appendChild(a2); c.appendChild(btns);
  $("#eventCards").appendChild(c);
  $("#mapFrame").src = "https://maps.google.com/maps?q=" + q + "&z=16&output=embed";

  /* ---------- Countdown ---------- */
  var cd = { d: $("#cdD"), h: $("#cdH"), m: $("#cdM"), s: $("#cdS") };
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  (function tick() {
    var ms = first.start - Date.now();
    if (ms <= 0) { $(".cd").hidden = true; $("#cdDone").hidden = false; return; }
    var s = Math.floor(ms / 1000);
    cd.d.textContent = Math.floor(s / 86400);
    cd.h.textContent = pad(Math.floor(s % 86400 / 3600));
    cd.m.textContent = pad(Math.floor(s % 3600 / 60));
    cd.s.textContent = pad(s % 60);
    setTimeout(tick, 1000 - (Date.now() % 1000));
  })();

  /* ---------- Dress code ---------- */
  C.dressCode.colors.forEach(function (c) {
    var w = el("div", "swatch"), chip = el("span", "swatch__chip");
    chip.style.background = c.hex;
    w.appendChild(chip); w.appendChild(el("span", "swatch__name", c.name)); w.appendChild(el("span", "swatch__hex", c.hex.toUpperCase()));
    $("#swatches").appendChild(w);
  });

  /* ---------- Gallery + lightbox ---------- */
  (M.gallery || []).forEach(function (src, i) {
    var b = el("button"); b.type = "button"; b.setAttribute("aria-label", "View photo " + (i + 1));
    var img = el("img"); img.src = src; img.alt = "Pre-wedding photo " + (i + 1); img.loading = "lazy"; img.decoding = "async";
    b.appendChild(img);
    b.addEventListener("click", function () { openLightbox(src, img.alt, b); });
    $("#galleryGrid").appendChild(b);
  });
  function openLightbox(src, alt, back) {
    var lb = el("div", "lightbox"); lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
    var img = el("img"); img.src = src; img.alt = alt;
    var x = el("button", "lightbox__close", "×"); x.type = "button"; x.setAttribute("aria-label", "Close photo");
    function close() { lb.remove(); document.removeEventListener("keydown", onKey); back.focus(); }
    function onKey(e) { if (e.key === "Escape") close(); }
    lb.addEventListener("click", function (e) { if (e.target !== img) close(); });
    document.addEventListener("keydown", onKey);
    lb.appendChild(img); lb.appendChild(x); document.body.appendChild(lb); x.focus();
  }
  var vw = $("#videoWrap");
  if (M.youtubeId) {
    vw.classList.add("video--wide");
    var f = el("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(M.youtubeId) + "?rel=0&playsinline=1";
    f.title = "Pre-wedding video"; f.loading = "lazy"; f.allow = "encrypted-media; picture-in-picture"; f.allowFullscreen = true;
    vw.appendChild(f); vw.hidden = false;
  } else if (M.video) {
    // Designed motion gallery: silent, autoplay, loop — plays only while on screen
    var v = el("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = "metadata";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-label", "Pre-wedding gallery");
    if (M.videoPoster) v.poster = M.videoPoster;
    v.src = M.video;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) v.play().catch(function () {}); else v.pause(); });
      }, { threshold: 0.2 }).observe(vw);
    }
    vw.appendChild(v); vw.hidden = false;
  }

  /* ---------- Gifts ---------- */
  C.gifts.banks.forEach(function (b) {
    var card = el("div", "bank glass reveal");
    card.appendChild(el("p", "bank__name", b.bank));
    card.appendChild(el("p", "bank__num", b.number));
    card.appendChild(el("p", "bank__holder", "a.n. " + b.holder));
    var btn = el("button", "btn btn--ghost btn--sm", "Copy number"); btn.type = "button";
    btn.addEventListener("click", function () { copy(b.number, b.bank + " account number copied"); btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy number"; }, 2000); });
    card.appendChild(btn);
    $("#banks").appendChild(card);
  });
  var waMsg = encodeURIComponent(C.gifts.whatsappMessage || "");
  [["whatsappBride", C.bride.nickname], ["whatsappGroom", C.groom.nickname]].forEach(function (p) {
    var num = (C.gifts[p[0]] || "").replace(/\D/g, ""); if (!num) return;
    var a = el("a", "btn btn--ghost", "WhatsApp " + p[1]);
    a.href = "https://wa.me/" + num + (waMsg ? "?text=" + waMsg : ""); a.target = "_blank"; a.rel = "noopener";
    $("#waBtns").appendChild(a);
  });
  if (!$("#waBtns").children.length) $("#sendBlock").hidden = true;

  function copy(text, msg) {
    var done = function () { toast(msg); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      var t = el("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select(); t.setSelectionRange(0, 99);
      try { document.execCommand("copy"); done(); } catch (e) { toast("Couldn't copy. Please copy it manually."); }
      t.remove();
    }
  }
  var toastTimer;
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.classList.add("is-on"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 2200); }

  /* ---------- RSVP ---------- */
  var form = $("#rsvpForm"), guests = $("#fGuests"), status = $("#rsvpStatus"), sendBtn = $("#rsvpBtn");
  var max = C.rsvp.maxGuests || 5; guests.max = max;
  $$(".stepper__btn").forEach(function (b) {
    b.addEventListener("click", function () { guests.value = Math.min(max, Math.max(1, (parseInt(guests.value, 10) || 1) + parseInt(b.dataset.step, 10))); });
  });
  // Akad / Resepsi tick boxes, built from event.sessions
  var multiSession = visibleSessions.length > 1;   // only Akad guests get to choose
  visibleSessions.forEach(function (sess) {
    var lab = el("label", "choice__opt choice__opt--tick");
    var inp = el("input"); inp.type = "checkbox"; inp.name = "events"; inp.value = sess.name;
    inp.addEventListener("change", function () { $("#errSess").hidden = true; });
    lab.appendChild(inp); lab.appendChild(el("span", null, sess.name + " \u00b7 " + hm(new Date(sess.start)) + "–" + hm(new Date(sess.end))));
    $("#sessionChoices").appendChild(lab);
  });
  function showAttendingFields(on) { $("#guestsField").hidden = !on; $("#sessionsField").hidden = !on || !multiSession; }
  showAttendingFields(true);
  // Note under "Will you attend?": Akad guests get akadNote, Resepsi-only guests get resepsiNote
  var noteText = INVITE === "akad" ? INV.akadNote : INV.resepsiNote;
  if (noteText) {
    var noteSess = INVITE === "akad"
      ? C.event.sessions.filter(function (x) { return x.akadOnly; })[0]
      : visibleSessions[0];
    var note = el("p", "field__note", noteText.replace("{time}", noteSess ? hm(new Date(noteSess.start)) + " WIB" : ""));
    $("#errAtt").parentNode.querySelector("legend").insertAdjacentElement("afterend", note);   // right under "Will you attend?"
  }
  $$('input[name="attendance"]').forEach(function (r) {
    r.addEventListener("change", function () { showAttendingFields(r.value === "Attending"); $("#errAtt").hidden = true; });
  });
  $("#fName").addEventListener("input", function () { $("#errName").hidden = true; this.closest(".field").classList.remove("is-invalid"); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#fName").value.trim();
    var att = (form.querySelector('input[name="attendance"]:checked') || {}).value;
    var ok = true;
    if (!name) { $("#errName").hidden = false; $("#fName").closest(".field").classList.add("is-invalid"); ok = false; }
    if (!att) { $("#errAtt").hidden = false; ok = false; }
    var events = $$('input[name="events"]:checked').map(function (c) { return c.value; });
    var needEvents = att === "Attending" && multiSession;
    if (!multiSession) events = visibleSessions.map(function (x) { return x.name; });
    if (needEvents && !events.length) { $("#errSess").hidden = false; ok = false; }
    if (!ok) {
      (!name ? $("#fName") : !att ? form.querySelector('input[name="attendance"]') : form.querySelector('input[name="events"]')).focus();
      return;
    }
    var data = {
      name: name, attendance: att, events: att === "Attending" ? events.join(", ") : "",
      guests: att === "Attending" ? Math.min(max, Math.max(1, parseInt(guests.value, 10) || 1)) : 0,
      message: $("#fMsg").value.trim(), website: form.website.value,
      invite: INVITE === "akad" ? "Akad + Resepsi" : "Resepsi only"
    };
    sendBtn.disabled = true; sendBtn.textContent = "Sending…"; status.className = "form__status"; status.textContent = "";
    submit(data).then(function () {
      status.textContent = att === "Attending" ? "Thank you, " + name + ". We can't wait to see you!" : "Thank you, " + name + ". You'll be missed. Thank you for your prayers.";
      if (data.message) addWish({ name: name, message: data.message, time: new Date().toISOString() }, true);
      form.reset(); showAttendingFields(true); if (to) $("#fName").value = to;
      sendBtn.textContent = "RSVP sent";
      setTimeout(function () { sendBtn.disabled = false; sendBtn.textContent = "Send RSVP"; }, 4000);
    }).catch(function () {
      status.className = "form__status is-err";
      status.textContent = "Your RSVP didn't go through. Check your connection and tap Send RSVP again.";
      sendBtn.disabled = false; sendBtn.textContent = "Send RSVP";
    });
  });
  function submit(data) {
    if (!C.rsvp.scriptUrl) { console.info("[RSVP demo mode] Set rsvp.scriptUrl in js/config.js to save to Google Sheets.", data); return new Promise(function (r) { setTimeout(r, 600); }); }
    return fetch(C.rsvp.scriptUrl, { method: "POST", body: new URLSearchParams(data) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j.ok) throw new Error(j.error || "Failed"); return j; });
  }

  /* ---------- Guest book ---------- */
  var list = $("#wishList"), seen = {}, total = 0;
  var rtf = window.Intl && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }) : null;
  function ago(iso) {
    var d = new Date(iso); if (isNaN(d)) return "";
    var s = (d - Date.now()) / 1000, a = Math.abs(s);
    if (!rtf) return d.toLocaleDateString("en-GB");
    if (a < 60) return "just now";
    if (a < 3600) return rtf.format(Math.round(s / 60), "minute");
    if (a < 86400) return rtf.format(Math.round(s / 3600), "hour");
    if (a < 86400 * 30) return rtf.format(Math.round(s / 86400), "day");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
  function addWish(w, prepend) {
    var k = (w.name + "|" + w.message).toLowerCase(); if (seen[k]) return; seen[k] = 1;
    var li = el("li", "wish" + (prepend ? " wish--new" : ""));
    var head = el("p", "wish__name");
    head.appendChild(el("span", null, w.name)); head.appendChild(el("span", "wish__when", ago(w.time)));
    li.appendChild(head); li.appendChild(el("p", "wish__msg", "“" + w.message + "”"));
    if (prepend) list.insertBefore(li, list.firstChild); else list.appendChild(li);
    total++; count();
  }
  function count() { $("#wishEmpty").hidden = total > 0; $("#wishCount").textContent = total ? total + (total === 1 ? " wish" : " wishes") + " so far" : ""; }
  function loadWishes(initial) {
    if (!C.rsvp.scriptUrl) { count(); return; }
    fetch(C.rsvp.scriptUrl + "?action=wishes&t=" + Date.now()).then(function (r) { return r.json(); }).then(function (j) {
      var items = (j && j.wishes) || [];
      if (initial) items.forEach(function (w) { addWish(w, false); }); else items.slice().reverse().forEach(function (w) { addWish(w, true); });
      count();
    }).catch(count);
  }
  loadWishes(true);
  setInterval(function () { if (!document.hidden) loadWishes(false); }, (C.rsvp.refreshSeconds || 30) * 1000);

  /* ---------- Reveal on scroll + active dock item ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (n) { io.observe(n); });

    var links = $$(".dock a"), map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var groups = { groom: "bride", countdown: "events", dresscode: "events", wishes: "rsvp", closing: "gallery", words: "home" };
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = map[e.target.id] ? e.target.id : groups[e.target.id];
        links.forEach(function (a) { a.classList.toggle("is-active", a === map[id]); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section").forEach(function (s) { spy.observe(s); });
  } else { $$(".reveal").forEach(function (n) { n.classList.add("is-in"); }); }
})();
