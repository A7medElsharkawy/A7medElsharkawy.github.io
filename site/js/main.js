// ---- Dark / light mode toggle ----
const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

toggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    /* storage blocked: theme just won't be remembered */
  }
});

// ---- News cards: arrow buttons scroll the row ----
const newsRow = document.querySelector(".news");
const newsButtons = document.querySelectorAll(".news-nav__btn");

if (newsRow) {
  newsButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = newsRow.querySelector(".news-card");
      const step = card ? card.offsetWidth + 16 : 260; // card width + gap
      newsRow.scrollBy({ left: step * Number(btn.dataset.dir) });
    });
  });

  // Grey out an arrow when you're already at that end.
  const updateArrows = () => {
    const max = newsRow.scrollWidth - newsRow.clientWidth - 2;
    newsButtons[0].disabled = newsRow.scrollLeft <= 2;
    newsButtons[1].disabled = newsRow.scrollLeft >= max;
  };
  newsRow.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();
}

// ---- Footer year ----
document.getElementById("year").textContent = new Date().getFullYear();
