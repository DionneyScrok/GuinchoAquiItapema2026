"use strict";

/* =========================================================
   GUINCHO AQUI ITAPEMA
   MAIN.JS
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menuButton = document.getElementById("menuButton");
const backToTop = document.getElementById("backToTop");
const currentYear = document.getElementById("currentYear");

const navigationLinks = document.querySelectorAll(".nav a");
const faqItems = document.querySelectorAll(".faq-list details");
const conversionLinks = document.querySelectorAll("[data-conversion]");


/* =========================================================
   ANO AUTOMÁTICO
========================================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   HEADER AO ROLAR
========================================================= */

function updateHeader() {
    if (!header) {
        return;
    }

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();


/* =========================================================
   MENU MOBILE
========================================================= */

function openMenu() {
    if (!nav || !menuButton) {
        return;
    }

    nav.classList.add("active");
    menuButton.classList.add("active");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Fechar menu");

    document.body.classList.add("menu-open");
}


function closeMenu() {
    if (!nav || !menuButton) {
        return;
    }

    nav.classList.remove("active");
    menuButton.classList.remove("active");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");

    document.body.classList.remove("menu-open");
}


function toggleMenu() {
    if (!nav) {
        return;
    }

    const isOpen = nav.classList.contains("active");

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}


if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
}


navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});


/* =========================================================
   FECHAR MENU CLICANDO FORA
========================================================= */

document.addEventListener("click", (event) => {
    if (!nav || !menuButton) {
        return;
    }

    if (!nav.classList.contains("active")) {
        return;
    }

    const clickedInsideNav = nav.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (!clickedInsideNav && !clickedMenuButton) {
        closeMenu();
    }
});


/* =========================================================
   FECHAR MENU COM ESC
========================================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});


/* =========================================================
   CORRIGIR MENU AO REDIMENSIONAR
========================================================= */

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMenu();
    }
});


/* =========================================================
   BOTÃO VOLTAR AO TOPO
========================================================= */

function updateBackToTop() {
    if (!backToTop) {
        return;
    }

    if (window.scrollY > 500) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
}

window.addEventListener("scroll", updateBackToTop, {
    passive: true
});

updateBackToTop();


if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================================
   FAQ
   APENAS UMA PERGUNTA ABERTA POR VEZ
========================================================= */

faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) {
            return;
        }

        faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
                otherItem.open = false;
            }
        });
    });
});


/* =========================================================
   SCROLL SUAVE PARA LINKS INTERNOS
========================================================= */

const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        const headerHeight = header
            ? header.offsetHeight
            : 0;

        const targetPosition =
            target.getBoundingClientRect().top
            + window.scrollY
            - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    });
});


/* =========================================================
   DESTAQUE DO MENU CONFORME A SEÇÃO
========================================================= */

const sections = document.querySelectorAll(
    "main section[id]"
);


function updateActiveNavigation() {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 160;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
                sectionTop + sectionHeight
        ) {
            currentSection = section.id;
        }
    });

    navigationLinks.forEach((link) => {
        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener(
    "scroll",
    updateActiveNavigation,
    {
        passive: true
    }
);

updateActiveNavigation();


/* =========================================================
   RASTREAMENTO DE CLIQUES
========================================================= */

function trackConversion(conversionName, link) {
    const eventData = {
        event: "site_conversion_click",
        conversion_name: conversionName,
        destination: link.href,
        page_path: window.location.pathname
    };

    /*
       GOOGLE TAG MANAGER

       Caso o GTM esteja instalado, este evento será enviado
       para o dataLayer.

       No GTM crie um acionador:
       Evento personalizado

       Nome:
       site_conversion_click
    */

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push(eventData);


    /*
       GA4 VIA GTAG

       Caso gtag esteja instalado diretamente no site,
       também enviamos o evento.
    */

    if (typeof window.gtag === "function") {
        window.gtag(
            "event",
            "site_conversion_click",
            {
                conversion_name:
                    conversionName,

                destination:
                    link.href,

                page_path:
                    window.location.pathname
            }
        );
    }


    /*
       LOG PARA DEBUG

       Pode remover depois dos testes.
    */

    console.log(
        "[Guincho Aqui] Conversão:",
        eventData
    );
}


conversionLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const conversionName =
            link.dataset.conversion;

        if (!conversionName) {
            return;
        }

        trackConversion(
            conversionName,
            link
        );
    });
});


/* =========================================================
   EVENTOS ESPECÍFICOS DE TELEFONE E WHATSAPP
========================================================= */

const telephoneLinks =
    document.querySelectorAll('a[href^="tel:"]');

const whatsappLinks =
    document.querySelectorAll(
        'a[href*="wa.me"]'
    );


telephoneLinks.forEach((link) => {
    link.addEventListener("click", () => {
        window.dataLayer =
            window.dataLayer || [];

        window.dataLayer.push({
            event: "click_ligar",
            event_category: "lead",
            event_label: "telefone",
            lead_type: "phone_call",
            telefone: link.href,
            page_title: document.title,
            page_path: window.location.pathname
        });

        if (
            typeof window.gtag ===
            "function"
        ) {
            window.gtag(
                "event",
                "click_ligar",
                {
                    event_category: "lead",
                    event_label: "telefone",
                    lead_type: "phone_call",
                    telefone: link.href,
                    page_title: document.title,
                    page_path: window.location.pathname
                }
            );
        }

        console.log(
            "[Guincho Aqui] Clique em ligação"
        );
    });
});


whatsappLinks.forEach((link) => {
    link.addEventListener("click", () => {
        window.dataLayer =
            window.dataLayer || [];

        window.dataLayer.push({
            event: "click_whatsapp",
            event_category: "lead",
            event_label: "whatsapp",
            lead_type: "whatsapp",
            whatsapp_url: link.href,
            page_title: document.title,
            page_path: window.location.pathname
        });

        if (
            typeof window.gtag ===
            "function"
        ) {
            window.gtag(
                "event",
                "click_whatsapp",
                {
                    event_category: "lead",
                    event_label: "whatsapp",
                    lead_type: "whatsapp",
                    whatsapp_url: link.href,
                    page_title: document.title,
                    page_path: window.location.pathname
                }
            );
        }

        console.log(
            "[Guincho Aqui] Clique no WhatsApp"
        );
    });
});


/* =========================================================
   ANIMAÇÃO DE ENTRADA DOS ELEMENTOS
========================================================= */

const revealElements =
    document.querySelectorAll(
        [
            ".service-card",
            ".trust-item",
            ".step",
            ".coverage-list > div",
            ".advantages-grid article",
            ".about-features > div",
            ".faq-list details"
        ].join(",")
    );


function initializeRevealAnimations() {
    if (
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach(
            (element) => {
                element.classList.add(
                    "reveal-visible"
                );
            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }

                    entry.target.classList.add(
                        "reveal-visible"
                    );

                    observerInstance.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    revealElements.forEach(
        (element, index) => {
            element.classList.add(
                "reveal-element"
            );

            element.style.setProperty(
                "--reveal-delay",
                `${Math.min(
                    index % 6,
                    5
                ) * 70}ms`
            );

            observer.observe(element);
        }
    );
}

initializeRevealAnimations();


/* =========================================================
   CSS DAS ANIMAÇÕES VIA JAVASCRIPT
========================================================= */

const animationStyle =
    document.createElement("style");

animationStyle.textContent = `

    .reveal-element {
        opacity: 0;
        transform: translateY(28px);
        transition:
            opacity 0.7s ease var(--reveal-delay, 0ms),
            transform 0.7s ease var(--reveal-delay, 0ms);
    }

    .reveal-element.reveal-visible {
        opacity: 1;
        transform: translateY(0);
    }

    .nav a.active {
        color: var(--whatsapp);
    }

    .header.scrolled .nav a.active {
        color: var(--primary);
    }

    @media (prefers-reduced-motion: reduce) {

        .reveal-element {
            opacity: 1;
            transform: none;
        }

    }

`;

document.head.appendChild(animationStyle);


/* =========================================================
   BOTÕES COM PROTEÇÃO CONTRA CLIQUE DUPLO
========================================================= */

const actionButtons =
    document.querySelectorAll(
        [
            ".button",
            ".contact-card-button",
            ".emergency-button",
            ".button-primary",
            ".faq-whatsapp",
            ".mobile-action-bar a"
        ].join(",")
    );


actionButtons.forEach((button) => {
    let recentlyClicked = false;

    button.addEventListener(
        "click",
        () => {
            if (recentlyClicked) {
                return;
            }

            recentlyClicked = true;

            button.classList.add(
                "button-clicked"
            );

            window.setTimeout(() => {
                recentlyClicked = false;

                button.classList.remove(
                    "button-clicked"
                );
            }, 700);
        }
    );
});


const clickStyle =
    document.createElement("style");

clickStyle.textContent = `

    .button-clicked {
        transform: scale(0.97) !important;
    }

`;

document.head.appendChild(clickStyle);


/* =========================================================
   DETECTAR DISPOSITIVO MOBILE
========================================================= */

function isMobileDevice() {
    return (
        window.matchMedia(
            "(max-width: 650px)"
        ).matches
    );
}


/* =========================================================
   ESCONDER WHATSAPP FLUTUANTE PRÓXIMO DO CTA FINAL
========================================================= */

const floatingWhatsapp =
    document.querySelector(
        ".floating-whatsapp"
    );

const finalCta =
    document.querySelector(
        ".final-cta"
    );


function updateFloatingWhatsapp() {
    if (
        !floatingWhatsapp ||
        !finalCta ||
        isMobileDevice()
    ) {
        return;
    }

    const ctaPosition =
        finalCta.getBoundingClientRect();

    const isFinalCtaVisible =
        ctaPosition.top <
            window.innerHeight &&
        ctaPosition.bottom > 0;

    if (isFinalCtaVisible) {
        floatingWhatsapp.style.opacity =
            "0";

        floatingWhatsapp.style.pointerEvents =
            "none";

        floatingWhatsapp.style.transform =
            "translateY(20px)";
    } else {
        floatingWhatsapp.style.opacity =
            "1";

        floatingWhatsapp.style.pointerEvents =
            "auto";

        floatingWhatsapp.style.transform =
            "";
    }
}


window.addEventListener(
    "scroll",
    updateFloatingWhatsapp,
    {
        passive: true
    }
);

window.addEventListener(
    "resize",
    updateFloatingWhatsapp
);

updateFloatingWhatsapp();


/* =========================================================
   ALTERAR MENSAGEM DO WHATSAPP CONFORME HORÁRIO
========================================================= */

function getServicePeriod() {
    const currentHour =
        new Date().getHours();

    if (
        currentHour >= 5 &&
        currentHour < 12
    ) {
        return "Bom dia";
    }

    if (
        currentHour >= 12 &&
        currentHour < 18
    ) {
        return "Boa tarde";
    }

    return "Boa noite";
}


/*
   Só altera links que tenham a mensagem padrão
   "Olá! Preciso de um guincho."
*/

whatsappLinks.forEach((link) => {
    try {
        const url =
            new URL(link.href);

        const message =
            url.searchParams.get("text");

        if (
            message ===
            "Olá! Preciso de um guincho."
        ) {
            const newMessage =
                `${getServicePeriod()}! ` +
                "Preciso de um guincho. " +
                "Minha localização é: ";

            url.searchParams.set(
                "text",
                newMessage
            );

            link.href = url.toString();
        }
    } catch (error) {
        console.warn(
            "[Guincho Aqui] Link inválido:",
            link.href
        );
    }
});


/* =========================================================
   PERFORMANCE
   EXECUTAR TAREFAS NÃO URGENTES
========================================================= */

function runIdleTasks() {
    console.log(
        "[Guincho Aqui] Site carregado",
        {
            page:
                window.location.pathname,

            mobile:
                isMobileDevice(),

            timestamp:
                new Date().toISOString()
        }
    );
}


if (
    "requestIdleCallback" in window
) {
    window.requestIdleCallback(
        runIdleTasks
    );
} else {
    window.setTimeout(
        runIdleTasks,
        1000
    );
}


/* =========================================================
   ERROS GLOBAIS
========================================================= */

window.addEventListener(
    "error",
    (event) => {
        console.error(
            "[Guincho Aqui] Erro JavaScript:",
            event.message
        );
    }
);


/* =========================================================
   FINAL
========================================================= */

console.log(
    "%cGUINCHO AQUI ITAPEMA",
    [
        "background:#0B5ED7",
        "color:#FFFFFF",
        "font-size:15px",
        "font-weight:bold",
        "padding:8px 14px",
        "border-radius:5px"
    ].join(";")
);

console.log(
    "Main.js carregado com sucesso 🚛"
);

/* =========================================================
   MOBILE V2
   HEADER INTELIGENTE + INDICADORES DA GALERIA
========================================================= */


/* =========================================================
   HEADER SOME DESCENDO E VOLTA SUBINDO
========================================================= */

let lastScrollPosition = window.scrollY;
let scrollDirectionThreshold = 8;


function updateSmartHeader() {
    if (!header) {
        return;
    }

    /*
       Só usar o efeito em telas mobile/tablet.
    */

    if (window.innerWidth > 900) {
        header.classList.remove("header-hidden");

        lastScrollPosition = window.scrollY;

        return;
    }


    /*
       Não esconder o header com menu aberto.
    */

    if (
        nav &&
        nav.classList.contains("active")
    ) {
        header.classList.remove("header-hidden");

        lastScrollPosition = window.scrollY;

        return;
    }


    const currentScrollPosition =
        window.scrollY;


    const scrollDifference =
        currentScrollPosition -
        lastScrollPosition;


    /*
       Evita tremedeira causada por pequenos movimentos.
    */

    if (
        Math.abs(scrollDifference) <
        scrollDirectionThreshold
    ) {
        return;
    }


    /*
       No início da página o header fica visível.
    */

    if (currentScrollPosition < 100) {
        header.classList.remove("header-hidden");

        lastScrollPosition =
            currentScrollPosition;

        return;
    }


    /*
       Descendo.
    */

    if (
        currentScrollPosition >
        lastScrollPosition
    ) {
        header.classList.add("header-hidden");
    }


    /*
       Subindo.
    */

    if (
        currentScrollPosition <
        lastScrollPosition
    ) {
        header.classList.remove("header-hidden");
    }


    lastScrollPosition =
        currentScrollPosition;
}


window.addEventListener(
    "scroll",
    updateSmartHeader,
    {
        passive: true
    }
);


window.addEventListener(
    "resize",
    () => {
        if (
            window.innerWidth > 900 &&
            header
        ) {
            header.classList.remove(
                "header-hidden"
            );
        }
    }
);


/* =========================================================
   INDICADORES DA GALERIA MOBILE
========================================================= */

const realServicesGrid =
    document.querySelector(
        ".real-services-grid"
    );


function initializeGalleryDots() {
    if (!realServicesGrid) {
        return;
    }


    const galleryCards =
        Array.from(
            realServicesGrid.querySelectorAll(
                ".real-service-card"
            )
        );


    if (galleryCards.length < 2) {
        return;
    }


    /*
       Evitar criar os indicadores duas vezes.
    */

    if (
        document.querySelector(
            ".gallery-dots"
        )
    ) {
        return;
    }


    const dotsContainer =
        document.createElement("div");


    dotsContainer.className =
        "gallery-dots";


    dotsContainer.setAttribute(
        "aria-label",
        "Navegação da galeria"
    );


    const dots = galleryCards.map(
        (card, index) => {

            const dot =
                document.createElement(
                    "button"
                );


            dot.type = "button";


            dot.className =
                "gallery-dot";


            if (index === 0) {
                dot.classList.add(
                    "active"
                );
            }


            dot.setAttribute(
                "aria-label",
                `Ver foto ${index + 1}`
            );


            dot.addEventListener(
                "click",
                () => {

                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center"
                    });

                }
            );


            dotsContainer.appendChild(dot);


            return dot;

        }
    );


    realServicesGrid.insertAdjacentElement(
        "afterend",
        dotsContainer
    );


    /*
       Detectar qual foto está visível.
    */

    function updateGalleryDots() {

        if (
            window.innerWidth > 650
        ) {
            return;
        }


        const gridRect =
            realServicesGrid
                .getBoundingClientRect();


        const gridCenter =
            gridRect.left +
            gridRect.width / 2;


        let nearestIndex = 0;
        let nearestDistance = Infinity;


        galleryCards.forEach(
            (card, index) => {

                const cardRect =
                    card.getBoundingClientRect();


                const cardCenter =
                    cardRect.left +
                    cardRect.width / 2;


                const distance =
                    Math.abs(
                        gridCenter -
                        cardCenter
                    );


                if (
                    distance <
                    nearestDistance
                ) {
                    nearestDistance =
                        distance;

                    nearestIndex =
                        index;
                }

            }
        );


        dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === nearestIndex
                );

            }
        );

    }


    realServicesGrid.addEventListener(
        "scroll",
        updateGalleryDots,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        updateGalleryDots
    );


    updateGalleryDots();
}


initializeGalleryDots();