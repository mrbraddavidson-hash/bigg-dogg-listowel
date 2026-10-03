(() => {
  const form = document.querySelector("[data-menu-search]");
  if (!form) return;

  const input = form.querySelector("input[name=search_term_string]");
  const status = form.querySelector("[data-menu-search-status]");
  const items = [...document.querySelectorAll("#menu .price-item")];
  if (!input || !status || items.length === 0) return;

  const menu = document.querySelector("#menu");

  function applySearch(value, shouldScroll = false) {
    const query = value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    items.forEach((item) => {
      const matches = !query || item.textContent.toLocaleLowerCase().includes(query);
      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (!query) {
      status.hidden = true;
      status.textContent = "";
    } else {
      status.hidden = false;
      status.textContent = visibleCount === 1
        ? "1 menu item found."
        : `${visibleCount} menu items found.`;
      if (visibleCount === 0) {
        status.textContent = "No menu items matched that search.";
      }
    }

    if (shouldScroll && menu) {
      menu.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("search_term_string") || "";
  input.value = initialQuery;
  applySearch(initialQuery, Boolean(initialQuery));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    const nextUrl = new URL(window.location.href);
    if (value) {
      nextUrl.searchParams.set("search_term_string", value);
    } else {
      nextUrl.searchParams.delete("search_term_string");
    }
    window.history.replaceState({}, "", nextUrl);
    applySearch(value, true);
  });
})();
