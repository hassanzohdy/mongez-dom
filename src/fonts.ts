import { createHeadElement, styleSheet } from "./metadata";
import { FontOptions } from "./types";

let isGoogleFontInitialized: boolean = false;

function initializeGoogleFonts(): void {
  createHeadElement("link", {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  });
  createHeadElement("link", {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "",
  });

  isGoogleFontInitialized = true;
}

/**
 * Add Google font or update it.
 * If id is passed, then find the link with that id, otherwise create new meta link tag
 */
export function googleFont(
  href: string,
  id: string | null = null
): HTMLLinkElement {
  if (!isGoogleFontInitialized) {
    initializeGoogleFonts();
  }

  return styleSheet(href, id);
}

/**
 * Load font either externally or internally
 */
export function loadFont(
  fontSettings: FontOptions
): Promise<FontFace | FontFace[]> {
  return new Promise((resolve, reject) => {
    if (fontSettings.weights) {
      const loadedFonts: Promise<FontFace>[] = [];
      for (const fontWeight of fontSettings.weights) {
        const sources: string[] = [];
        if (fontWeight.src) {
          sources.push(`url(${fontWeight.src})`);
        }

        if (fontWeight.woff) {
          sources.push(`url(${fontWeight.woff}) format("woff")`);
        }

        if (fontWeight.woff2) {
          sources.push(`url(${fontWeight.woff2}) format("woff2")`);
        }

        if (fontWeight.ttf) {
          sources.push(`url(${fontWeight.ttf}) format("truetype")`);
        }

        if (fontWeight.eot) {
          sources.push(`url(${fontWeight.eot}) format("embedded-opentype")`);
        }

        if (fontWeight.svg) {
          sources.push(`url(${fontWeight.svg}) format("svg")`);
        }

        if (fontWeight.otf) {
          sources.push(`url(${fontWeight.otf}) format("opentype")`);
        }

        const src: string = sources.join(", ");

        const fontFace = new FontFace(fontSettings.name, src, {
          ...fontWeight,
          // Convert light weight to 300 as it is not accepted value for font weight
          weight: fontWeight.weight
            ? String(fontWeight.weight).toLocaleLowerCase() === "light"
              ? "300"
              : String(fontWeight.weight)
            : undefined,
        });

        loadedFonts.push(fontFace.load());
      }

      Promise.all(loadedFonts)
        .then((loadedFonts) => {
          loadedFonts.forEach((loadedFont) => {
            document.fonts.add(loadedFont);
          });

          resolve(loadedFonts);
        })
        .catch((error) => {
          reject(error);
        });
    } else if (fontSettings.src) {
      const fontFace = new FontFace(
        fontSettings.name,
        `url(${fontSettings.src})`,
        fontSettings.descriptors
      );
      fontFace
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
          resolve(loadedFont);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}
