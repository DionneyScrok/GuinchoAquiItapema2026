"use strict";
const nav=document.getElementById("nav");
const menu=document.getElementById("menuButton");
const header=document.getElementById("header");
function closeMenu(){nav?.classList.remove("active");menu?.setAttribute("aria-expanded","false");menu?.setAttribute("aria-label","Abrir menu");document.body.classList.remove("menu-open");document.querySelectorAll(".nav-group.open").forEach(g=>{g.classList.remove("open");g.querySelector(".nav-trigger")?.setAttribute("aria-expanded","false")})}
menu?.addEventListener("click",()=>{const open=nav.classList.toggle("active");if(open)nav.scrollTop=0;menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");document.body.classList.toggle("menu-open",open)});
document.querySelectorAll(".nav-trigger").forEach(btn=>btn.addEventListener("click",e=>{const group=btn.closest(".nav-group");if(innerWidth<=960){e.preventDefault();group.classList.toggle("open");btn.setAttribute("aria-expanded",String(group.classList.contains("open")))}else{document.querySelectorAll(".nav-group.open").forEach(g=>{if(g!==group)g.classList.remove("open")});group.classList.toggle("open");btn.setAttribute("aria-expanded",String(group.classList.contains("open")))}}));
document.addEventListener("click",e=>{if(innerWidth>960&&!e.target.closest(".nav-group"))document.querySelectorAll(".nav-group.open").forEach(g=>g.classList.remove("open"))});
document.querySelectorAll(".nav>a,.dropdown a").forEach(a=>a.addEventListener("click",closeMenu));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
window.addEventListener("scroll",()=>header?.classList.toggle("scrolled",scrollY>24),{passive:true});
document.getElementById("currentYear")?.append(new Date().getFullYear());
window.dataLayer=window.dataLayer||[];
document.querySelectorAll(".track").forEach(a=>a.addEventListener("click",()=>{window.dataLayer.push({event:a.dataset.event||"site_conversion_click",conversion_location:a.dataset.location||"unknown",link_url:a.href,page_path:location.pathname})}));
const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();document.querySelectorAll('.nav a').forEach(a=>{if((a.getAttribute('href')||'').toLowerCase()===current)a.setAttribute('aria-current','page')});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -30px'});document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%4,3)*70}ms`;observer.observe(el)})}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

window.addEventListener("resize",()=>{if(innerWidth>960)closeMenu()},{passive:true});
