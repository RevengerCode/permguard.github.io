import type { ClientModule } from "@docusaurus/types";
import { createRoot } from "react-dom/client";
import React from "react";
import "./ImageZoomOverlay.css";

const LIGHTBOX_CONTAINER_ID = "image-zoom-lightbox-root";
const WRAPPED_ATTR = "data-zoom-wrapped";

/**
 * Wrap each article image with a container that shows a "zoom" label on hover.
 * Also assigns a figure number (per page) to each image.
 */
function wrapImages(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    "article img:not(.navbar__logo img)"
  );

  let figureIndex = 0;

  images.forEach((img) => {
    // Skip already‑wrapped images
    if (img.getAttribute(WRAPPED_ATTR)) return;
    img.setAttribute(WRAPPED_ATTR, "true");

    figureIndex++;

    // Create wrapper
    const wrapper = document.createElement("span");
    wrapper.className = "image-zoom-wrapper";
    wrapper.setAttribute("data-figure-index", String(figureIndex));

    // Create label
    const label = document.createElement("span");
    label.className = "image-zoom-label";
    label.textContent = "zoom";

    // Insert wrapper around the image
    img.parentNode?.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(label);
  });
}

function getCaption(img: HTMLImageElement): string {
  // Check if the image is inside a <figure> with a <figcaption>
  const figure = img.closest("figure");
  if (figure) {
    const figcaption = figure.querySelector("figcaption");
    if (figcaption?.textContent) {
      return figcaption.textContent.trim();
    }
  }

  // Fallback: use alt text OR title attribute
  return img.getAttribute("alt") || img.getAttribute("title") || "";
}

function getFigureIndex(img: HTMLImageElement): number {
  const wrapper = img.closest(".image-zoom-wrapper");
  if (wrapper) {
    const idx = wrapper.getAttribute("data-figure-index");
    if (idx) return parseInt(idx, 10);
  }
  return 0;
}

function openLightbox(img: HTMLImageElement): void {
  // Avoid duplicate containers
  if (document.getElementById(LIGHTBOX_CONTAINER_ID)) return;

  const container = document.createElement("div");
  container.id = LIGHTBOX_CONTAINER_ID;
  document.body.appendChild(container);

  const root = createRoot(container);

  import("./ImageZoomOverlay").then(({ default: ImageZoomOverlay }) => {
    const src = img.getAttribute("src") || "";
    const alt = img.getAttribute("alt") || "";
    const rawCaption = getCaption(img);
    const figureIndex = getFigureIndex(img);

    // Build the caption with "Figure N:" prefix
    let caption = "";
    if (figureIndex > 0) {
      caption = rawCaption
        ? `Figure ${figureIndex}: ${rawCaption}`
        : `Figure ${figureIndex}`;
    } else if (rawCaption) {
      caption = rawCaption;
    }

    const onClose = () => {
      root.unmount();
      container.remove();
    };

    root.render(
      React.createElement(ImageZoomOverlay, { src, alt, caption, onClose })
    );
  });
}

function handleClick(e: MouseEvent): void {
  const target = e.target as HTMLElement;

  // Handle clicks on the wrapper or the label too
  let img: HTMLImageElement | null = null;

  if (target.tagName === "IMG") {
    img = target as HTMLImageElement;
  } else if (
    target.classList.contains("image-zoom-wrapper") ||
    target.classList.contains("image-zoom-label")
  ) {
    img = target.closest(".image-zoom-wrapper")?.querySelector("img") || null;
  }

  if (!img) return;

  // Only handle images inside article content (docs)
  if (!img.closest("article")) return;

  // Skip navbar logos and other UI images
  if (img.closest(".navbar__logo")) return;
  if (img.closest("nav")) return;

  e.preventDefault();
  e.stopPropagation();
  openLightbox(img);
}

const clientModule: ClientModule = {
  onRouteDidUpdate() {
    // Wrap images after a short delay so DOM is settled
    setTimeout(wrapImages, 100);

    // Attach a single delegated listener on the document
    document.removeEventListener("click", handleClick, true);
    document.addEventListener("click", handleClick, true);
  },
};

export default clientModule;
