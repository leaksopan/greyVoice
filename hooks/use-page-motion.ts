"use client";

import { useEffect, useRef, useState } from "react";

export function usePageMotion() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      ".section-label, .intro-grid > *, .product-demo, .workflow h2, .workflow-grid article, .integration-grid > *, .integration-details > div, .pricing-heading > *, .price-card, .estimate, .billing-note, .faq-grid > *, .closing > *, footer",
    ));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let lastSection = "";
    let lastScrolled = false;

    function reveal(element: HTMLElement) {
      element.classList.add("motion-visible");
      observer?.unobserve(element);
    }

    function configureReveals() {
      observer?.disconnect();
      if (preference.matches || !("IntersectionObserver" in window)) {
        targets.forEach(reveal);
        return;
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      }, { rootMargin: "0px 0px -5% 0px", threshold: 0.06 });
      targets.forEach(element => {
        const siblings = Array.from(element.parentElement?.children ?? []).filter(child => targets.includes(child as HTMLElement));
        element.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(element), 3) * 90}ms`);
        element.classList.add("motion-reveal");
        // Hash navigation and keyboard focus must never land on hidden content.
        if (element.getBoundingClientRect().top < window.innerHeight * 0.95) reveal(element);
        else observer?.observe(element);
      });
    }

    function update() {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      const section = sections.filter(element => element.getBoundingClientRect().top <= window.innerHeight * 0.4).at(-1)?.id ?? "";
      const isScrolled = window.scrollY > 30;
      progressRef.current?.style.setProperty("--scroll-progress", String(progress));
      hero?.style.setProperty("--hero-travel", `${preference.matches || window.innerWidth <= 760 ? 0 : Math.min(window.scrollY, hero.offsetHeight)}px`);
      if (section !== lastSection) { lastSection = section; setActiveSection(section); }
      if (isScrolled !== lastScrolled) { lastScrolled = isScrolled; setScrolled(isScrolled); }
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function onPreferenceChange() { configureReveals(); scheduleUpdate(); }
    function onFocus(event: FocusEvent) {
      if (event.target instanceof Element) {
        const element = event.target.closest<HTMLElement>(".motion-reveal");
        if (element) reveal(element);
      }
    }

    configureReveals();
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    preference.addEventListener("change", onPreferenceChange);
    document.addEventListener("focusin", onFocus);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      preference.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("focusin", onFocus);
      targets.forEach(element => { element.classList.remove("motion-reveal", "motion-visible"); element.style.removeProperty("--reveal-delay"); });
      hero?.style.removeProperty("--hero-travel");
    };
  }, []);

  return { progressRef, activeSection, scrolled };
}
