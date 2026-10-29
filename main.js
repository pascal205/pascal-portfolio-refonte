/* =========================================================================
   Pascal / Portfolio — interactions
   1. Menu mobile (burger)
   2. Apparition des blocs au scroll
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. Menu mobile
   ------------------------------------------------------------------------- */
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  nav.dataset.open = String(open);
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

/* Fermer au clic sur un lien du menu */
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

/* Fermer avec Échap, en rendant le focus au bouton */
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (toggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});

/* Repasser en navigation classique au-dessus du breakpoint */
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setMenu(false);
});

/* -------------------------------------------------------------------------
   2. Apparition au scroll
   Les éléments sont marqués ici (et non dans le HTML) : sans JavaScript,
   rien n'est masqué — le contenu reste lisible.
   ------------------------------------------------------------------------- */
const revealTargets = document.querySelectorAll(
  ".intro .container > *, .apropos .title, .apropos .body > *, .tech-left, .tech-right"
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  revealTargets.forEach((el, index) => {
    el.setAttribute("data-reveal", "");
    el.style.transitionDelay = `${(index % 4) * 70}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
}
