export type MetaData = {
  /**
   * Set page title
   */
  title?: string;
  /**
   * Set page meta description
   */
  description?: string;
  /**
   * Set page meta image
   */
  image?: string;
  /**
   * Set page meta keywords
   */
  keywords?: string | string[];
  /**
   * Set page meta Canonical url
   */
  url?: string;
  /**
   * Set page meta fav icon
   */
  favIcon?: string;
  /**
   * Set page meta color
   */
  color?: string;
  /**
   * Page type, usually sets with og:type
   */
  type?:
    | "website"
    | "article"
    | "profile"
    | "book"
    | "music"
    | "video"
    | string;
};

export type OpenGraph = {
  siteName?: string;
  locale?: string;
};

export type AttributesList = {
  [attributeKey: string]: string;
};
