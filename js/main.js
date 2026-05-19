document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const siteNav = document.querySelector(".site-nav");
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links");

    const updateNavState = () => {
        siteNav?.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const isOpen = navLinks.classList.contains("active");
            mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            mobileToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                mobileToggle.setAttribute("aria-expanded", "false");
                mobileToggle.setAttribute("aria-label", "Open menu");
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", event => {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
            history.pushState(null, "", targetId);
        });
    });

    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = lightbox?.querySelector("img");
    const lightboxCaption = lightbox?.querySelector("figcaption");
    const lightboxClose = lightbox?.querySelector(".lightbox-close");
    let lastFocusedElement = null;
    let closeTimer = null;

    const closeLightbox = () => {
        if (!lightbox) {
            return;
        }

        const finishClose = () => {
            lightbox.hidden = true;
            lightbox.classList.remove("is-open", "is-closing");
            document.body.style.overflow = "";

            if (lightboxImage) {
                lightboxImage.src = "";
                lightboxImage.alt = "";
            }

            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };

        if (prefersReducedMotion) {
            finishClose();
            return;
        }

        lightbox.classList.remove("is-open");
        lightbox.classList.add("is-closing");
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(finishClose, 170);
    };

    document.querySelectorAll(".screenshot-card").forEach(card => {
        card.addEventListener("click", () => {
            if (!lightbox || !lightboxImage || !lightboxCaption) {
                return;
            }

            lastFocusedElement = card;
            lightboxImage.src = card.dataset.lightboxSrc;
            lightboxImage.alt = card.dataset.lightboxAlt || "";
            lightboxCaption.textContent = card.dataset.lightboxCaption || "";
            lightbox.hidden = false;
            lightbox.classList.remove("is-closing");
            lightbox.classList.add("is-open");
            document.body.style.overflow = "hidden";
            lightboxClose?.focus();
        });
    });

    lightboxClose?.addEventListener("click", closeLightbox);

    lightbox?.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && lightbox && !lightbox.hidden) {
            closeLightbox();
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                activeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-on-scroll");
    fadeElements.forEach((el, index) => {
        el.style.setProperty("--reveal-delay", `${Math.min(index * 35, 180)}ms`);
        observer.observe(el);
    });
});
