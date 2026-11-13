/* Vigyan Atlas — privacy-friendly visitor counter (unique visitors + session visits).
   Uses Abacus (https://abacus.jasoncameron.dev, free, open-source, no cookies, no account)
   with localStorage/sessionStorage deduplication so page refreshes do not inflate unique visitors.
   Optionally activates GoatCounter if <meta name="va-goatcounter" content="YOUR_SITE_CODE"> is set. */
(() => {
  "use strict";

  const DEFAULT_NS = "shipransh28aug2016-lab-vigyan-atlas";
  const ABACUS_BASE = "https://abacus.jasoncameron.dev";
  const KEY_VISITOR = "va.visitor.counted.v1";
  const KEY_LOCK = "va.visitor.lock.v1";
  const KEY_SESSION = "va.session.counted.v1";
  const KEY_CACHE = "va.visitor.cache.v1";
  const LOCK_TTL_MS = 15000;
  const FETCH_TIMEOUT_MS = 4500;

  const meta = (name) => {
    const el = document.querySelector(`meta[name="${name}"]`);
    return el ? (el.getAttribute("content") || "").trim() : "";
  };

  const NS = (window.VA_COUNTER_NS || meta("va-counter-ns") || DEFAULT_NS).replace(/[^a-zA-Z0-9._-]/g, "-");

  const safeStore = (store, op, k, v) => {
    try {
      if (op === "get") return store.getItem(k);
      if (op === "set") store.setItem(k, v);
      if (op === "del") store.removeItem(k);
    } catch {
      return null;
    }
    return null;
  };

  const isProductionOrigin = () => {
    const p = location.protocol;
    const h = location.hostname;
    if (p !== "https:" && p !== "http:") return false;
    if (!h || h === "localhost" || h === "127.0.0.1" || h === "::1" || h.endsWith(".local")) return false;
    if (navigator.webdriver) return false;
    if (/[?&]no-analytics=1\b/.test(location.search)) return false;
    return true;
  };

  const fmt = (n) => {
    try {
      return new Intl.NumberFormat("en-IN").format(n);
    } catch {
      return String(n);
    }
  };

  let state = { visitors: null, visits: null, cached: false };

  const readCache = () => {
    const raw = safeStore(localStorage, "get", KEY_CACHE);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.visitors === "number" && parsed.visitors >= 0) {
        return {
          visitors: parsed.visitors,
          visits: typeof parsed.visits === "number" && parsed.visits >= 0 ? parsed.visits : null,
          cached: true
        };
      }
    } catch {}
    return null;
  };

  const writeCache = (visitors, visits) => {
    if (typeof visitors !== "number" || visitors < 0) return;
    safeStore(localStorage, "set", KEY_CACHE, JSON.stringify({ visitors, visits, ts: Date.now() }));
  };

  const fetchAbacus = async (action, key) => {
    const ctrl = typeof AbortController === "function" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS) : null;
    try {
      const res = await fetch(`${ABACUS_BASE}/${action}/${encodeURIComponent(NS)}/${encodeURIComponent(key)}`, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        signal: ctrl ? ctrl.signal : undefined
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data && typeof data.value === "number" && Number.isFinite(data.value) && data.value >= 0
        ? Math.floor(data.value)
        : null;
    } catch {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const renderBadge = () => {
    if (typeof state.visitors !== "number" || state.visitors < 0) return;

    const tipParts = [`Unique visitors (browsers): ${fmt(state.visitors)}`, `अनूठे दर्शक: ${fmt(state.visitors)}`];
    if (typeof state.visits === "number") {
      tipParts.push(`Total visits: ${fmt(state.visits)}`);
    }
    if (state.cached) tipParts.push("offline cached");
    const tip = tipParts.join(" · ");

    // 1) Main app (#homeStats pill bar)
    const homeStats = document.getElementById("homeStats");
    if (homeStats) {
      let badge = document.getElementById("vaVisitors");
      if (!badge) {
        badge = document.createElement("span");
        badge.id = "vaVisitors";
        homeStats.appendChild(badge);
      }
      badge.title = tip;
      badge.setAttribute("aria-label", tip);
      const html = `<b>👥 ${fmt(state.visitors)}</b> visitors · दर्शक`;
      if (badge.innerHTML !== html) badge.innerHTML = html;
    }

    // 2) 2D gallery landing page (public/2d/index.html)
    const sub2d = document.querySelector(".container .subtitle");
    if (sub2d && !homeStats) {
      let wrap = document.getElementById("vaVisitors2d");
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.id = "vaVisitors2d";
        wrap.style.cssText = "text-align:center;margin:-20px 0 24px";
        sub2d.insertAdjacentElement("afterend", wrap);
      }
      wrap.innerHTML = `<span title="${tip.replace(/"/g, "&quot;")}" style="display:inline-block;background:rgba(255,213,79,0.1);border:1px solid rgba(255,213,79,0.32);border-radius:999px;padding:4px 14px;font-size:13px;color:#e8eef2"><b style="color:#ffd54f">👥 ${fmt(state.visitors)}</b> visitors · दर्शक</span>`;
    }
  };

  // Re-attach pill whenever Course tabs (Class X / IX / IX Adv) redraw #homeStats
  const observeHomeStats = () => {
    const homeStats = document.getElementById("homeStats");
    if (!homeStats || typeof MutationObserver !== "function") return;
    const obs = new MutationObserver(() => {
      if (!document.getElementById("vaVisitors")) renderBadge();
    });
    obs.observe(homeStats, { childList: true });
  };

  const loadGoatCounter = () => {
    const code = (window.VA_GOATCOUNTER || meta("va-goatcounter") || "").trim();
    if (!code) return;
    const url = /^https?:\/\//i.test(code) ? code : `https://${code.replace(/[^a-zA-Z0-9-]/g, "")}.goatcounter.com/count`;
    if (document.querySelector('script[data-goatcounter]')) return;
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-goatcounter", url);
    s.src = "https://gc.zgo.at/count.js";
    document.head.appendChild(s);
  };

  const countVisitors = async () => {
    // Allow deterministic local preview via query param or test mock without touching live counter
    if (window.__vaVisitsMock && typeof window.__vaVisitsMock.visitors === "number") {
      state = {
        visitors: window.__vaVisitsMock.visitors,
        visits: typeof window.__vaVisitsMock.visits === "number" ? window.__vaVisitsMock.visits : null,
        cached: false
      };
      renderBadge();
      return;
    }

    const cached = readCache();
    if (cached) {
      state = cached;
      renderBadge();
    }

    if (!isProductionOrigin() || navigator.onLine === false) return;

    loadGoatCounter();

    // Determine whether this browser has already been counted as a unique visitor
    const counted = safeStore(localStorage, "get", KEY_VISITOR) === "1";
    const lockRaw = safeStore(localStorage, "get", KEY_LOCK);
    const lockActive = lockRaw && (Date.now() - Number(lockRaw) < LOCK_TTL_MS);

    let visitorAction = "get";
    let acquiredLock = false;
    if (!counted && !lockActive) {
      safeStore(localStorage, "set", KEY_LOCK, String(Date.now()));
      visitorAction = "hit";
      acquiredLock = true;
    }

    // Determine whether this browser session has already been counted
    const sessionCounted = safeStore(sessionStorage, "get", KEY_SESSION) === "1";
    const visitAction = sessionCounted ? "get" : "hit";
    if (!sessionCounted) safeStore(sessionStorage, "set", KEY_SESSION, "1");

    const [visitorsVal, visitsVal] = await Promise.all([
      fetchAbacus(visitorAction, "visitors"),
      fetchAbacus(visitAction, "visits")
    ]);

    if (acquiredLock) {
      safeStore(localStorage, "del", KEY_LOCK);
      if (typeof visitorsVal === "number") {
        safeStore(localStorage, "set", KEY_VISITOR, "1");
      }
    }

    if (visitAction === "hit" && typeof visitsVal !== "number") {
      safeStore(sessionStorage, "del", KEY_SESSION);
    }

    if (typeof visitorsVal === "number") {
      state = {
        visitors: visitorsVal,
        visits: typeof visitsVal === "number" ? visitsVal : state.visits,
        cached: false
      };
      writeCache(state.visitors, state.visits);
      renderBadge();
    }
  };

  const init = () => {
    observeHomeStats();
    countVisitors();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.__vaVisits = {
    get: () => ({ ...state, namespace: NS }),
    refresh: countVisitors
  };
})();
