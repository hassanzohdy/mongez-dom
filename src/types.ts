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
  [attributeKey: string]: any;
};

export type FontWeightSetup = FontFaceDescriptors & {
  /**
   * Font url, a generic url, can be added exactly as in the font-family `src` property.
   */
  src?: string;
  /**
   * Font url for woff (Web Open Font Format)
   */
  woff?: string;
  /**
   * Font url for woff2 (Web Open Font Format 2)
   */
  woff2?: string;
  /**
   * Font url for true type
   */
  ttf?: string;
  /**
   * Font url for eot (embedded-open type font)
   */
  eot?: string;
  /**
   * Font url for svg (vector-data)
   */
  svg?: string;
  /**
   * Font url for otf (open type font)
   */
  otf?: string;
};

export type FontOptions = {
  /**
   * Font family name
   */
  name: string;
  /**
   * font src path
   */
  src?: string;
  /**
   * Font face descriptors
   */
  descriptors?: FontFaceDescriptors;
  /**
   * For more advanced fonts configurations, use the weights object instead of src.
   * Font weights
   */
  weights?: FontWeightSetup[];
};
