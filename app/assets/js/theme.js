// Applies the saved light/dark choice before the page paints.
(function () {
  try { var t = localStorage.getItem("theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) {}
})();

/* Folder links such as login/ work on the live site. Opened straight from disk, the browser cannot open a folder, so add index.html. */
window.LJ_URL = function (u) { return location.protocol === "file:" ? u.replace(/^([^?#]*\/)(?=$|[?#])/, "$1index.html") : u; };
if (location.protocol === "file:") document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[href]").forEach(function (a) { var h = a.getAttribute("href"); if (h && !/^(https?:|mailto:|#)/.test(h)) a.setAttribute("href", LJ_URL(h)); });
});
