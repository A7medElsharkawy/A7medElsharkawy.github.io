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

// ---- News "show more" ----
const newsList = document.querySelector(".news");
const newsToggle = document.getElementById("news-toggle");

if (!newsList.querySelector(".news--extra")) {
  newsToggle.hidden = true;
}

newsToggle.addEventListener("click", () => {
  const expanded = newsList.classList.toggle("is-expanded");
  newsToggle.textContent = expanded ? "Show less" : "Show more";
  newsToggle.setAttribute("aria-expanded", String(expanded));
});

// ---- Footer year ----
document.getElementById("year").textContent = new Date().getFullYear();
