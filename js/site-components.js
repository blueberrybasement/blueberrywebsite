const sitePath = path => {
    if (window.location.protocol !== "file:") {
        return path;
    }

    const currentPath = window.location.pathname.replace(/\\/g, "/");
    const prefix = currentPath.includes("/articles/") ? "../" : "";
    const cleanPath = path.replace(/^\//, "");

    if (cleanPath === "") {
        return `${prefix}index.html`;
    }

    if (cleanPath === "#faq") {
        return `${prefix}index.html#faq`;
    }

    if (cleanPath === "articles/") {
        return `${prefix}articles/index.html`;
    }

    return `${prefix}${cleanPath}`;
};

class SiteHeader extends HTMLElement {
    connectedCallback() {
        const active = this.getAttribute("active") || "";

        const linkClass = key => key === active ? ' class="is-active"' : "";

        this.innerHTML = `
            <nav class="site-nav">
                <div class="container nav-container">
                    <a href="${sitePath("/")}" class="brand-logo" aria-label="Blueberry Basement home">
                        <img src="${sitePath("/assets/logo.jpg")}" alt="Blueberry Basement logo">
                        <span>Blueberry Basement</span>
                    </a>
                    <button class="mobile-toggle" type="button" aria-label="Open menu" aria-expanded="false">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-links">
                        <li><a href="${sitePath("/")}"${linkClass("home")}>Home</a></li>
                        <li><a href="${sitePath("/articles/")}"${linkClass("articles")}>Articles</a></li>
                        <li><a href="${sitePath("/#faq")}">FAQ</a></li>
                        <li><a href="${sitePath("/privacy.html")}"${linkClass("privacy")}>Privacy</a></li>
                        <li><a href="${sitePath("/terms.html")}"${linkClass("terms")}>Terms</a></li>
                    </ul>
                </div>
            </nav>
        `;
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="container footer-grid">
                    <div>
                        <strong>Blueberry Basement</strong>
                        <p>&copy; 2026 Szymon Borowka / Blueberry Basement. All rights reserved.</p>
                    </div>
                    <div class="footer-links">
                        <a href="mailto:contact@blueberrybasement.com">contact@blueberrybasement.com</a>
                        <a href="${sitePath("/#faq")}">FAQ</a>
                        <a href="${sitePath("/articles/")}">Articles</a>
                        <a href="${sitePath("/privacy.html")}">Privacy Policy</a>
                        <a href="${sitePath("/terms.html")}">Terms of Use</a>
                    </div>
                    <div class="social-links" aria-label="Blueberry Basement social media">
                        <a href="https://x.com/BlueberryBsmnt" target="_blank" rel="noopener" aria-label="Follow Blueberry Basement on X">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M13.9 10.5 21.2 2h-1.7l-6.4 7.4L8.1 2H2.2l7.7 11.2L2.2 22h1.7l6.7-7.8 5.4 7.8h5.9l-8-11.5Zm-2.4 2.8-.8-1.1L4.5 3.3h2.8l5 7.1.8 1.1 6.5 9.3h-2.8l-5.3-7.5Z"/>
                            </svg>
                            <span class="sr-only">X</span>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61589391430145" target="_blank" rel="noopener" aria-label="Follow Blueberry Basement on Facebook">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M14 8.2V6.6c0-.7.5-.9.9-.9h2.2V2.1L14 2c-3.4 0-5.2 2-5.2 5.6v.6H5.6V12h3.2v10H13V12h3.4l.5-3.8H14Z"/>
                            </svg>
                            <span class="sr-only">Facebook</span>
                        </a>
                        <a href="https://www.instagram.com/blueberrybasement/" target="_blank" rel="noopener" aria-label="Follow Blueberry Basement on Instagram">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.9 2.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
                            </svg>
                            <span class="sr-only">Instagram</span>
                        </a>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
