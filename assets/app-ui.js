/* UI-only helpers. Does not change signature generation logic. */
(function () {
  "use strict";

  document.documentElement.classList.add("app-ui");
  if (document.body) {
    document.body.classList.add("app-ui-ready");
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      document.body.classList.add("app-ui-ready");
    });
  }

  var LANGS = ["es", "de", "fr", "it", "jp"];

  function pathParts() {
    return location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  }

  function langPrefix() {
    var first = pathParts()[0];
    return LANGS.indexOf(first) !== -1 ? "/" + first : "";
  }

  function currentKey() {
    var parts = pathParts();
    if (LANGS.indexOf(parts[0]) !== -1) parts = parts.slice(1);
    var slug = parts.join("/");
    if (!slug) return "ai";
    if (slug.indexOf("draw-signature") !== -1) return "draw";
    if (slug.indexOf("text-to-signature") !== -1) return "text";
    if (slug.indexOf("text-to-logo") !== -1 || slug.indexOf("ai-logo") !== -1) return "logo";
    return "other";
  }

  function titles() {
    var lang = (document.documentElement.lang || "en").slice(0, 2);
    var map = {
      en: { ai: "AI Signature", draw: "Draw Signature", text: "Text to Sign", logo: "Logo Maker" },
      es: { ai: "Firma IA", draw: "Dibujar firma", text: "Texto a firma", logo: "Logotipo" },
      de: { ai: "KI-Signatur", draw: "Signatur zeichnen", text: "Text zu Signatur", logo: "Logo" },
      fr: { ai: "Signature IA", draw: "Dessiner", text: "Texte → signature", logo: "Logo" },
      it: { ai: "Firma IA", draw: "Disegna firma", text: "Testo → firma", logo: "Logo" },
      jp: { ai: "AI署名", draw: "署名を描く", text: "テキスト署名", logo: "ロゴ" }
    };
    return map[lang] || map.en;
  }

  function icon(name) {
    var icons = {
      ai: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l1.8 4.8L19 9.6l-4.2 3.2L16 18l-4-2.4L8 18l1.2-5.2L5 9.6l5.2-1.8L12 3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
      draw: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20l3.2-.8L19 7.4a1.8 1.8 0 10-2.5-2.5L4.7 16.8 4 20z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
      text: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7V5h14v2M12 5v14m-4 0h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
      logo: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7.2" stroke="currentColor" stroke-width="1.7"/><path d="M8 12h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
    };
    return icons[name];
  }

  function enhanceToolbox() {
    document.querySelectorAll(".toolbox .icon").forEach(function (el) {
      if (el.querySelector(".tool-label")) return;
      var label = document.createElement("span");
      label.className = "tool-label";
      var raw = el.getAttribute("aria-label") || "";
      label.textContent = raw.replace("Canvas Background Color", "Background").replace("Canvas Adjust", "Size").replace("Pen Color", "Pen");
      el.appendChild(label);
    });
  }

  function enhanceHeader() {
    var brand = document.querySelector(".mobile-brand");
    if (brand && !brand.querySelector(".app-title")) {
      var title = document.createElement("span");
      title.className = "app-title";
      var t = titles();
      var key = currentKey();
      title.textContent = t[key] || t.ai;
      brand.appendChild(title);
    }

    var headerRow = document.querySelector(".mobile-header .row");
    var langLink = document.querySelector("#language-cta");
    if (headerRow && langLink && !headerRow.querySelector(".mobile-lang")) {
      var clone = langLink.cloneNode(true);
      clone.removeAttribute("id");
      clone.classList.add("mobile-lang");
      clone.setAttribute("aria-label", "Language");
      var hamburger = headerRow.querySelector(".mobile-hamburger");
      headerRow.insertBefore(clone, hamburger || null);
    }
  }

  function injectHint() {
    var pad = document.getElementById("signature-pad");
    var canvas = document.getElementById("canvas");
    if (!pad || !canvas || pad.querySelector(".draw-hint")) return;
    var hint = document.createElement("p");
    hint.className = "draw-hint";
    hint.textContent = "Draw with your finger, then tap Download.";
    var toolbox = pad.querySelector(".toolbox");
    if (toolbox) pad.insertBefore(hint, toolbox);
    else pad.insertBefore(hint, pad.firstChild);
  }

  function injectTabbar() {
    if (document.querySelector(".app-tabbar")) return;
    var prefix = langPrefix();
    var t = titles();
    var key = currentKey();
    var items = [
      { id: "ai", href: prefix + "/", label: t.ai, icon: "ai" },
      { id: "draw", href: prefix + "/draw-signature/", label: t.draw, icon: "draw" },
      { id: "text", href: prefix + "/text-to-signature/", label: t.text, icon: "text" },
      { id: "logo", href: prefix + "/text-to-logo-maker/", label: t.logo, icon: "logo" }
    ];
    var nav = document.createElement("nav");
    nav.className = "app-tabbar";
    nav.setAttribute("aria-label", "Tools");
    items.forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.href;
      a.innerHTML = icon(item.icon) + "<span>" + item.label + "</span>";
      if (item.id === key) {
        a.className = "is-active";
        a.setAttribute("aria-current", "page");
      }
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
  }

  function start() {
    enhanceHeader();
    enhanceToolbox();
    injectHint();
    injectTabbar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
