// Queue the existing GA4 configuration without allowing inline executable scripts.
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
if (!window.blueberryLocaleRedirecting) {
    window.gtag('js', new Date());
    window.gtag('config', 'G-9VYH4NCNHG');
}
