/* Stitchcraft enquiry form: AJAX submit to Formspree with a mailto fallback. */
(function () {
  "use strict";

  var EMAIL = "stitchcraftdesignuk@gmail.com";
  var WHATSAPP = "https://wa.me/447944915880?text=" +
    encodeURIComponent("Hi Stitchcraft, I'd like a quote for custom embroidery");

  var form = document.getElementById("quote-form");
  if (!form || !window.fetch || !window.FormData) return; // falls back to a normal form post

  var status = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');
  var fileInput = document.getElementById("f-upload");

  function checkedGarments() {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="garment"]:checked'),
      function (el) { return el.value; }
    );
  }

  function val(name) {
    var el = form.elements[name];
    return el && el.value ? el.value.trim() : "";
  }

  function mailtoLink() {
    var lines = [
      "Name: " + val("name"),
      "Email: " + val("email"),
      "Phone: " + val("phone"),
      "Garment(s): " + checkedGarments().join(", "),
      "Quantity: " + val("quantity"),
      "Sizes & colours: " + val("sizes_colours"),
      "Placement: " + val("placement"),
      "",
      val("message"),
      "",
      "(I'll attach my logo to this email.)"
    ];
    return "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Embroidery quote – " + (val("name") || "new enquiry")) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function show(type, html) {
    status.className = "form-status " + type;
    status.innerHTML = html;
    status.hidden = false;
    status.focus({ preventScroll: true });
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function showError(extra) {
    show("error",
      "Sorry, your enquiry couldn't be sent. " + (extra ? extra + " " : "") +
      '<br><a href="' + mailtoLink() + '">Send it by email instead</a> (your details are filled in) or ' +
      '<a href="' + WHATSAPP + '" target="_blank" rel="noopener">message us on WhatsApp</a>.');
  }

  function validate() {
    var ok = true, first = null;
    ["name", "email", "quantity"].forEach(function (name) {
      var el = form.elements[name];
      var valid = el.checkValidity();
      el.setAttribute("aria-invalid", valid ? "false" : "true");
      if (!valid) { ok = false; first = first || el; }
    });
    if (!ok) {
      show("error", "Please fill in your name, a valid email address and a quantity.");
      first.focus();
    }
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;

    // Not configured yet: offer the email fallback instead of failing silently.
    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      showError("(The online form isn't set up yet.)");
      return;
    }

    var data = new FormData(form);
    // Send garments as one readable field.
    data.delete("garment");
    data.append("garments", checkedGarments().join(", ") || "Not specified");
    // Don't send an empty file field.
    var hasFiles = fileInput && fileInput.files && fileInput.files.length > 0;
    if (!hasFiles) data.delete("upload");

    button.disabled = true;
    var label = button.textContent;
    button.textContent = "Sending…";

    fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          return { ok: res.ok, json: json };
        });
      })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          show("success", "Thanks! Your enquiry has been sent. We'll get back to you within 24 hours." +
            (hasFiles ? "" : ' If you haven\'t sent your logo yet, you can <a href="' + WHATSAPP +
            '" target="_blank" rel="noopener">WhatsApp</a> or <a href="mailto:' + EMAIL + '">email</a> it to us.'));
        } else {
          var msg = r.json && r.json.errors ? r.json.errors.map(function (x) { return x.message; }).join(" ") : "";
          var tip = hasFiles ? "If you attached a file, try removing it and sending your logo by WhatsApp or email." : "";
          showError([msg, tip].filter(Boolean).join(" "));
        }
      })
      .catch(function () { showError("Please check your connection."); })
      .then(function () { button.disabled = false; button.textContent = label; });
  });

  // Clear invalid state as the user types.
  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) {
      e.target.setAttribute("aria-invalid", "false");
    }
  });
})();
