// Adds a Show/Hide button to every password field on the page.
(function () {
  document.querySelectorAll('input[type="password"]').forEach(function (input) {
    var wrap = document.createElement("div");
    wrap.className = "pw";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    var b = document.createElement("button");
    b.type = "button";
    b.className = "pw-toggle";
    b.textContent = "Show";
    b.setAttribute("aria-label", "Show password");
    b.onclick = function () {
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      b.textContent = show ? "Hide" : "Show";
      b.setAttribute("aria-label", show ? "Hide password" : "Show password");
    };
    wrap.appendChild(b);
  });
})();
