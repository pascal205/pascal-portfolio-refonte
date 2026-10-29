# Pascal / Portfolio — reconstruction UI/UX

Reconstruction **à l'identique** du portfolio : mêmes sections, même ordre, mêmes contenus, mêmes assets, mêmes noms de classes. Seule la mise en œuvre change — typographie, contraste, grille, responsive, accessibilité, mouvement.

> **Ce qui n'a pas changé** : `header` → hero vidéo → « À propos » → « Technologies » (marquee).
> Aucune section ajoutée, aucune section supprimée, aucun contenu réinventé.

---

## Aperçu

```bash
# le plus simple
double-cliquer sur index.html

# ou avec un serveur local (nécessaire pour la vidéo sur certains navigateurs)
python -m http.server 8000
# puis http://localhost:8000
```

---

## Structure du projet

```
index.html      markup — même squelette que l'original
style.css       feuille de style, organisée en 10 blocs commentés
main.js         ~70 lignes : menu mobile + apparition au scroll
favicon.svg     icône d'onglet
imagedev.png    poster de la vidéo (inchangé)
photo.jpg       portrait (inchangé)
uhd.mp4         vidéo de fond (inchangée)
iconeSvg/       les 10 icônes utilisées (noms en minuscules)
```

---

## Ce qui a été corrigé

### 1. Typographie

| Avant | Après |
|---|---|
| `Isometra` chargée depuis Google Fonts — **elle n'y existe pas**, le titre tombait en Times New Roman partout ailleurs | `local("Isometra")` (si installée) → fallback **Bricolage Grotesque** servi par Google Fonts |
| `body` sans `font-family` → tout le texte courant en serif par défaut | Manrope sur `body`, échelle fluide en `clamp()` |
| Titre hero à `8.3em` + `max-width: 600px` + `letter-spacing: -8px` (4 lignes subies, lettres qui se touchent) | `clamp(2.75rem, 9.5vw, 7.5rem)`, `line-height .92`, `-0.02em`, 2 lignes maîtrisées |

### 2. Couleur & contraste

- Voile uniforme à 0,55 sur la vidéo → **scrim directionnel** (dense à gauche, léger à droite) + variante verticale sous 900 px.
  Mesure : le paragraphe d'intro passait de **1,37:1** à un contraste conforme.
- Ombre turquoise `rgba(…, 0.69)` → `0.22` avec un flou plus large.

### 3. Gabarit & espacement

- Header en `padding: 1.2em 10em` et container en `8em` → **même axe** : la marge du header reprend exactement celle du container.
- Une seule échelle d'espacement (8 px) et un `--section-y` commun.
- `.apropos .body` : `flex + space-between` (≈ 350 px de vide à droite) → **grille 4/8**.
- Photo ronde `400px` fixe → `clamp(180px, 28vw, 400px)`.

### 4. Responsive

- Suppression des largeurs fixes et de `translateX(500px)` qui élargissaient la page.
- **Zéro débordement horizontal** vérifié de 320 à 1440 px.
- Breakpoints choisis par le contenu : 1080, 900, 560.

### 5. Navigation

- `href=""` (recharge la page) et `href="#"` (remonte en haut) → ancres réelles `#apropos`, `#technologies`.
- Menu mobile : `aria-expanded` + `data-open`, ouverture/fermeture au clic, à `Échap`, et fermeture au clic sur un lien. L'ancien menu s'ouvrait **invisible** (`visibility: hidden` dans l'état ouvert).
- `scroll-margin-top` pour compenser le header fixe.

### 6. Accessibilité

- Un seul `h1`, hiérarchie `h2` / `h3` correcte.
- Lien d'évitement (*skip link*), `:focus-visible` visible partout.
- `</h5>` orphelins corrigés, `<main>` ajouté pour la structure du document.
- `alt` descriptif sur le portrait, `alt=""` sur les icônes décoratives.
- `prefers-reduced-motion` respecté (marquee figé, plus de transitions).

### 7. Performance

- **Swiper supprimé** (−150 Ko de JS) : le marquee est en CSS pur, avec pause au survol.
- Icônes écrites dans le HTML (plus d'injection JS, donc plus de CLS).
- `preload="metadata"` sur la vidéo, `loading="lazy"` sur les images secondaires.
- Casse des noms d'icônes corrigée : `React.svg` → `react.svg` (5 icônes renvoyaient 404 sur un serveur Linux).

### 8. Mouvement

- `arise` terminait à `translateY(-30px)` : le contenu restait **décalé de 30 px** en permanence. Remplacé par un reveal `IntersectionObserver` qui revient à `0`.
- Survols à `-7px` → `-2px`, durées unifiées.

### 9. Contenu

Fautes corrigées : *intension* → **intention**, *developpe* → **développe**, *moderne et efficace* → **modernes et efficaces**, *choisis* → **choisies**, *maitrisées* → **maîtrisées**, *AMETPE* → **AMETEPE**, *REPERES* → **REPÈRES**. Numérotation `01` / `02` au lieu de `01` deux fois.

---

## Décisions à valider

Trois points ne relèvent pas du design : je n'ai **rien inventé**, j'ai laissé l'information telle quelle en la signalant.

1. **« Depuis huit ans » vs « 2024—aujourd'hui »** — les deux affirmations se contredisent. Une seule des deux est vraie : à trancher.
2. **Nav « Projets » / « Expériences »** — les sections n'existent pas dans la structure d'origine. Les entrées sont conservées mais désactivées (`aria-disabled`), en attendant les sections.
3. **« Me contacter » et « Parlons-en »** — pointent vers le profil GitHub, faute d'adresse fournie. Remplacer par `mailto:` ou LinkedIn (repère `TODO` dans `index.html`).

---

## Suites possibles

- Ajouter les sections **Projets** et **Expériences** (réactivité des liens de nav).
- Compresser `uhd.mp4` (11,6 Mo → ~1,5 Mo) : `ffmpeg -i uhd.mp4 -vf scale=1280:-2 -c:v libx264 -crf 28 -an -movflags +faststart hero.mp4`.
- Déployer sur GitHub Pages (Settings → Pages → branche `main`, dossier `/root`).
