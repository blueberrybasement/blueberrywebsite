document.addEventListener("DOMContentLoaded", () => {
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links");

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

    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = lightbox?.querySelector("img");
    const lightboxCaption = lightbox?.querySelector("figcaption");
    const lightboxClose = lightbox?.querySelector(".lightbox-close");
    let lastFocusedElement = null;

    const closeLightbox = () => {
        if (!lightbox) {
            return;
        }

        lightbox.hidden = true;
        document.body.style.overflow = "";

        if (lightboxImage) {
            lightboxImage.src = "";
            lightboxImage.alt = "";
        }

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
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
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});
