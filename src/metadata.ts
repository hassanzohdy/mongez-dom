import { MetaData, OpenGraph } from "./types";

const metaData = {
  title: null,
  description: null,
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
 * @param   {object} attributes
 * @returns {void}
 */
export function setHTMLAttributes(attributes: { [key: string]: any }) {
  for (const attribute in attributes) {
    document.documentElement.setAttribute(attribute, attributes[attribute]);
  }
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
  if (metaData.title === pageTitle) return pageTitle;

  document.title = metaData.title = pageTitle;

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
  if (metaData.description === description) return description;

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
  meta("image", imagePath);
  meta("og:image", imagePath);
  meta("twitter:image", imagePath);
  itemprop("image", imagePath);
}

/**
 * Set meta url
 *
 * @param string url
 * @returns void
 */
export function setUrl(url) {
  meta("og:url", url);
  meta("twitter:url", url);
}

/**
 * Set page meta color
 *
 * @param   {string} color
 * @returns {void}
 */
export function setPageColor(color: string) {
  return meta("theme-color", color);
}

/**
 * Set meta url
 *
 * @param string url
 * @returns void
 */
export function setFavIcon(favIcon) {
  return metaLink("icon", favIcon);
}

/**
 * Set canonical url
 *
 * @param {string} url
 */
export function setCanonicalUrl(url: string) {
  metaLink("canonical", url);
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
