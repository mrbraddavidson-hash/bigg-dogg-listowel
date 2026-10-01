(() => {
  const cookieName = "bigg_dogg_cookie_notice";
  const banner = document.querySelector("#cookie-banner");
  if (!banner) return;

  const hasSeenNotice = document.cookie.split("; ").some((cookie) => cookie.startsWith(`${cookieName}=`));
  const close = () => {
    banner.hidden = true;
    banner.setAttribute("aria-hidden", "true");
  };
  const remember = () => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${cookieName}=1; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
    close();
  };
  const open = () => {
    banner.hidden = false;
    banner.removeAttribute("aria-hidden");
  };

  if (hasSeenNotice) close();
  else open();

  banner.querySelector("[data-cookie-dismiss]")?.addEventListener("click", remember);
  document.querySelectorAll("[data-cookie-settings]").forEach((control) => control.addEventListener("click", open));
  window.BiggDoggCookies = { open, remember };
})();
