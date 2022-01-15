import { AttributesList, MetaData, OpenGraph } from "./types";

const currentMetaData = {
  title: document.title,
  url: null,
  description: null,
  keywords: null,
  image: null,
  color: null,
  favIcon: null,
};

/**
 * Set page meta data
 * Useful as it collects most used meta data in one function
 *
 * @param   {MetaData} metaList
 * @returns {void}
 */
export function setPageMeta(metaList: MetaData): void {
  metaList.title && setTitle(metaList.title);
  metaList.description && setDescription(metaList.description);
  metaList.favIcon && setFavIcon(metaList.favIcon);
  metaList.url && setCanonicalUrl(metaList.url);
  metaList.image && setImage(metaList.image);
  metaList.keywords && setKeywords(metaList.keywords);
  metaList.color && setPageColor(metaList.color);
  metaList.type && meta("og:type", metaList.type);
}

/**
 * Create new meta tag and add it to the head tag
 * @param   {object} props
 * @returns {HTMLElement}
 */
export function createNewMeta(props) {
  return createHeadElement("meta", props);
}

/**
 * Update html element attributes
 *
 * @param {AttributesList} attributes
 * @returns {void}
 */
export function setHTMLAttributes(attributes: AttributesList): void {
  return setElementAttributes(document.documentElement, attributes);
}

/**
 * Set the given attributes to the given element
 *
 * @param {HTMLElement} element
 * @param {AttributesList} attributes
 * @returns {void}
 */
export function setElementAttributes(
  element: HTMLElement,
  attributes: AttributesList
): void {
  for (const attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
}

/**
 * Get current element dom attributes
 *
 * @return object
 */
export function getElementAttributes(element: HTMLElement): AttributesList {
  const attributesList: AttributesList = {};

  for (const attribute of element.attributes) {
    attributesList[attribute.name] = attribute.value;
  }

  return attributesList;
}

/**
 * Create and append the given tag to the head
 *
 * @param   {String} tagName
 * @param   {Object} props
 * @returns {HTMLElement}
 */
export function createHeadElement(tagName, props) {
  const tag = document.createElement(tagName);

  for (const key in props) {
    tag.setAttribute(key, props[key]);
  }

  document.head.appendChild(tag);

  return tag;
}

/**
 * Create or modify the given meta name
 *
 * @param {string} metaName
 * @param {string} value
 */
export function meta(metaName, value) {
  const attributeName = ["keywords", "description"].includes(metaName)
    ? "name"
    : "property";

  let meta = document.head.querySelector(
    `meta[${attributeName}="${metaName}"]`
  );

  if (!meta) {
    meta = createNewMeta({
      [attributeName]: metaName,
    });
  }

  meta.setAttribute("content", value.trim());

  return meta;
}

/**
 * Add Itemprop meta
 *
 * @param {string} name
 * @param {string} value
 */
export function itemprop(name, value) {
  let meta = document.head.querySelector(`meta[itemprop="${name}"]`);

  if (!meta) {
    meta = createNewMeta({
      itemprop: name,
    });
  }

  meta.setAttribute("content", value.trim());
}

/**
 * Set page title
 *
 * @param   {string} pageTitle
 */
export function setTitle(pageTitle) {
  if (currentMetaData.title === pageTitle) return pageTitle;

  document.title = currentMetaData.title = pageTitle;

  meta("og:title", pageTitle);
  meta("og:image:alt", pageTitle);
  meta("twitter:title", pageTitle);
  meta("twitter:image:alt", pageTitle);
  itemprop("name", pageTitle);
}

/**
 * Set page description
 *
 * @param {string} title
 */
export function setDescription(description) {
  if (currentMetaData.description === description) return description;

  meta("description", description);
  itemprop("description", description);
  meta("og:description", description);
  meta("twitter:description", description);

  return description;
}

/**
 * Set Meta keywords
 *
 * @param   {string|Array} keywords
 */
export function setKeywords(keywords: string | string[]) {
  if (Array.isArray(keywords)) {
    keywords = keywords.join(",");
  }

  if (currentMetaData.keywords === keywords) return;

  currentMetaData.keywords = keywords;

  return meta("keywords", keywords);
}

/**
 * Set twitter settings
 *
 * @param  string type
 */
export function twitter(type = "summary") {
  return meta("twitter:card", type);
}

/**
 * Set Open graph
 *
 * @param  string type
 */
export function og(ogOptions: OpenGraph) {}

/**
 * Meta image
 *
 * @param string imagePath
 */
export function setImage(imagePath) {
  if (currentMetaData.image === imagePath) return;

  currentMetaData.image = imagePath;

  meta("image", imagePath);
  meta("og:image", imagePath);
  meta("twitter:image", imagePath);
  itemprop("image", imagePath);
}

/**
 * Set page meta color
 *
 * @param   {string} color
 * @returns {void}
 */
export function setPageColor(color: string) {
  if (currentMetaData.color === color) return;

  currentMetaData.color = color;

  return meta("theme-color", color);
}

/**
 * Set meta url
 *
 * @param string url
 * @returns void
 */
export function setFavIcon(favIcon) {
  if (currentMetaData.favIcon === favIcon) return;

  currentMetaData.color = favIcon;

  return metaLink("icon", favIcon);
}

/**
 * Get current meta data
 * If no arguments passed, then return the entire object
 *
 * @param name
 * @returns any
 */
export function getMetaData(name?: keyof MetaData): any {
  if (!name) return currentMetaData;

  return currentMetaData[name];
}

/**
 * Set canonical url
 *
 * @param {string} url
 */
export function setCanonicalUrl(url: string) {
  if (currentMetaData.url === url) return;

  currentMetaData.color = url;

  metaLink("canonical", url);
  meta("twitter:url", url);
  meta("og:url", url);
}

/**
 * Get or Create a new meta link element for the given rel value
 */
export function metaLink(
  rel: string,
  href: string,
  otherAttributes = {}
): HTMLLinkElement {
  const link: HTMLLinkElement =
    document.head.querySelector(`link[rel="${rel}"]`) ||
    createHeadElement("link", {
      rel: rel,
    });

  link.href = href;

  for (const attribute in otherAttributes) {
    link.setAttribute(attribute, otherAttributes[attribute]);
  }

  return link;
}

/**
 * Add stylesheet or update it.
 * If id is passed, then find the link with that id, otherwise create new meta link tag
 */
export function styleSheet(
  href: string,
  id: string | null = null
): HTMLLinkElement {
  let link: HTMLLinkElement | null;
  if (id) {
    link = document.getElementById(id) as HTMLLinkElement;
    if (link && link.getAttribute("rel").toLocaleLowerCase() !== "stylesheet") {
      link = null;
    }
  }

  if (!link) {
    link = createHeadElement("link", {
      rel: "stylesheet",
      id: id || "link-" + String(Math.floor(Math.random() * 10000000)),
    }) as HTMLLinkElement;
  }

  link.href = href;

  return link;
}

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
