(() => {
    const LANGUAGE_KEY = "blueberry-site-language";
    const ENTRY_KEY = "blueberry-locale-entry";
    const supported = language => language === "en" || language === "pl";

    // Locale preferences are set by explicit links, never inferred on deep links.
    // Without storage, leave navigation functional and skip automatic selection.
    document.querySelectorAll("a[data-site-language]").forEach(link => {
        link.addEventListener("click", () => {
            const language = link.dataset.siteLanguage;
            if (!supported(language)) return;
            try {
                localStorage.setItem(LANGUAGE_KEY, language);
            } catch {}
        });
    });

    // Native disclosure handles touch and keyboard; mouse users also get hover.
    document.querySelectorAll("details.site-language").forEach(picker => {
        const summary = picker.querySelector("summary");
        const options = picker.querySelector(".site-language-options");
        let hoverOpened = false;
        const close = () => {
            picker.open = false;
            hoverOpened = false;
        };
        picker.addEventListener("pointerenter", event => {
            if (event.pointerType !== "mouse" || picker.open) return;
            hoverOpened = true;
            picker.open = true;
        });
        picker.addEventListener("pointerleave", () => {
            if (hoverOpened && !options.contains(document.activeElement)) close();
        });
        picker.addEventListener("focusout", event => {
            if (event.relatedTarget && !picker.contains(event.relatedTarget) && !picker.matches(":hover")) close();
        });
        summary.addEventListener("click", () => { hoverOpened = false; });
        document.addEventListener("pointerdown", event => {
            if (!picker.contains(event.target)) close();
        });
        document.addEventListener("keydown", event => {
            if (event.key !== "Escape" || !picker.open) return;
            if (picker.contains(document.activeElement)) summary.focus();
            close();
        });
    });

    // English URLs remain directly reachable and indexable. Only the neutral,
    // directly entered homepage (not a search/article/referral landing) may
    // choose automatically. Preserve campaign parameters; anchors are explicit.
    const url = new URL(location.href);
    if (location.protocol === "file:" || url.pathname !== "/" || url.hash || document.referrer) return;
    try {
        const preferred = localStorage.getItem(LANGUAGE_KEY);
        if (!supported(preferred) && sessionStorage.getItem(ENTRY_KEY)) return;
        const browserLanguage = navigator.languages?.[0] || navigator.language || "";
        const inferred = /^pl(?:-|$)/i.test(browserLanguage) ? "pl" : "en";
        if (!supported(preferred)) sessionStorage.setItem(ENTRY_KEY, "1");
        if ((supported(preferred) ? preferred : inferred) !== "pl") return;
        url.pathname = "/pl/";
        window.blueberryLocaleRedirecting = true;
        location.replace(url.href);
    } catch {
        // Blocked storage or navigation must not prevent entry in English.
    }
})();
