(function () {
  "use strict";

  const cfg = Object.assign(
    {
      whatsapp: "",
      instagram: "",
      facebook: "",
      youtube: "",
      pix: "",
      impacto: {}
    },
    window.TRUPE_CONFIG || {}
  );

  const digits = String(cfg.whatsapp || "").replace(/\D/g, "");
  const hasWhatsApp = digits.length >= 10;

  function waLink(text) {
    const msg = encodeURIComponent(text);
    if (!hasWhatsApp) return "";
    return "https://wa.me/" + digits + "?text=" + msg;
  }

  function setLink(selector, url) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (url) {
        el.href = url;
        el.removeAttribute("aria-disabled");
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      } else {
        el.href = "#redes";
        el.setAttribute("aria-disabled", "true");
        el.title = "Link oficial ainda não inserido";
      }
    });
  }

  setLink("[data-social='instagram']", cfg.instagram);
  setLink("[data-social='facebook']", cfg.facebook);
  setLink("[data-social='youtube']", cfg.youtube);

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    const intent = el.getAttribute("data-wa");
    const texts = {
      acao: "Olá! Gostaria de solicitar uma ação da Trupe Peniel.",
      participar: "Olá! Quero saber como fazer parte da Trupe Peniel.",
      apoiar: "Olá! Quero apoiar a missão da Trupe Peniel."
    };
    const href = waLink(texts[intent] || "Olá! Gostaria de falar com a Trupe Peniel.");
    if (href) {
      el.href = href;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    } else {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        alert("Para ativar o WhatsApp, abra o arquivo js/config.js e cole o número oficial no campo whatsapp.");
      });
    }
  });

  const pixBox = document.querySelector("[data-pix]");
  if (pixBox) {
    pixBox.textContent = cfg.pix
      ? "Pix: " + cfg.pix
      : "[INSERIR CHAVE PIX OU LINK DE DOAÇÃO]";
  }

  const labels = {
    acoes: "ações realizadas",
    pessoas: "pessoas alcançadas",
    instituicoes: "instituições visitadas",
    palhacos: "palhaços humanitários",
    voluntarios: "voluntários"
  };

  Object.keys(labels).forEach(function (key) {
    const el = document.querySelector("[data-stat='" + key + "']");
    if (!el) return;
    const raw = (cfg.impacto && cfg.impacto[key]) || "";
    el.textContent = raw ? raw : "[XX]";
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const wa = document.querySelector(".wa");
  const waBtn = document.querySelector(".wa__btn");
  if (wa && waBtn) {
    waBtn.addEventListener("click", function () {
      const open = wa.classList.toggle("is-open");
      waBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function serialize(form) {
    const data = new FormData(form);
    const lines = [];
    data.forEach(function (value, key) {
      lines.push(key + ": " + value);
    });
    return lines.join("\n");
  }

  document.querySelectorAll("form[data-intent]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const intent = form.getAttribute("data-intent");
      const prefix =
        intent === "voluntario"
          ? "Olá! Quero conhecer a Trupe Peniel.\n\n"
          : "Olá! Gostaria de solicitar uma ação da Trupe Peniel.\n\n";
      const body = prefix + serialize(form);
      const href = waLink(body);
      if (href) {
        window.open(href, "_blank", "noopener");
        form.reset();
      } else {
        alert(
          "O formulário está pronto. Para enviar de verdade, cole o WhatsApp oficial em js/config.js. Enquanto isso, você pode copiar os dados e enviar por outro canal."
        );
      }
    });
  });

  const lightbox = document.querySelector(".lightbox");
  const lightboxSlot = document.querySelector(".lightbox [data-lightbox-caption]");
  if (lightbox) {
    document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const caption = btn.getAttribute("data-caption") || "[INSERIR FOTO REAL]";
        if (lightboxSlot) lightboxSlot.textContent = caption;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        const closeBtn = lightbox.querySelector(".lightbox__close");
        if (closeBtn) closeBtn.focus();
      });
    });
    function closeLb() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    }
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLb();
    });
    const closeBtn = lightbox.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.addEventListener("click", closeLb);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLb();
    });
  }
})();
