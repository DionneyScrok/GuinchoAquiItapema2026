"use strict";
window.dataLayer=window.dataLayer||[];
document.querySelectorAll('a[href^="tel:"]').forEach(link=>link.addEventListener("click",()=>window.dataLayer.push({event:"click_ligar",page_path:window.location.pathname,destination:link.href})));
document.querySelectorAll('a[href*="wa.me"]').forEach(link=>link.addEventListener("click",()=>window.dataLayer.push({event:"click_whatsapp",page_path:window.location.pathname,destination:link.href})));
