# DOM Utilities

This package provides various utilities that makes working with dom much easier.

## Installation

`yarn add @mognez/dom`

Or

`npm i @mognez/dom`

## Usage

Let's start with handling With metadata.

### Setting Page title

```js
import { setTitle } from '@mongez/dom';

setTitle('Hello World');
```

This function modifies the page title, along with adding `meta[og:title]` `meta[witter:title]` and `meta[itemprop="name"]` meta tags.

Outputs:

```html
<title>Hello World</title>

<meta property="og:title" content="Hello World" />
<meta property="og:image:alt" content="Hello World" />
<meta property="twitter:title" content="Hello World" />
<meta property="twitter:image:alt" content="Hello World" />
<meta itemprop="name" content="Hello World" />
```

### Setting Page Description

```js
import { setDescription } from '@mongez/dom';

setDescription('Hello World Page Description from other realms.');
```

This function modifies the page meta description, along with adding `meta[og:description]` `meta[witter:description]` and `meta[itemprop="description"]` meta tags.

Outputs:

```html
<meta name="description" content="Hello World Page Description from other realms." />
<meta property="og:description" content="Hello World Page Description from other realms." />
<meta property="twitter:description" content="Hello World Page Description from other realms." />
<meta itemprop="name" content="Hello World Page Description from other realms." />
```

### Setting Page keywords

```js
import { setKeywords } from '@mongez/dom';

setKeywords('hello,world,from,other,worlds');
// can also be sent as an array
setKeywords(['hello', 'world', 'from', 'other', 'worlds']);
```

This function modifies the page meta keywords.

Outputs:

```html
<meta name="keywords" content="hello,world,from,other,worlds." />
```

### Setting Canonical Url

```js
import { setCanonicalUrl } from '@mongez/dom';

setCanonicalUrl('https://site-name.com/page-url-path');
```

This function sets the page Canonical Url.

Outputs:

```html
<link rel="canonical" href="https://site-name.com/page-url-path" />
<meta property="og:url" href="https://site-name.com/page-url-path" />
```

### Setting Page image

```js
import { setImage } from '@mongez/dom';

setImage('https://site-name.com/page-image.png');
```

This function sets the page current image that can be used for page preview, it modifies `meta.image` `meta[og:image]` `meta[witter:image]` and `meta[itemprop="image"]` meta tags.

Outputs:

```html
<meta property="image" content="https://site-name.com/page-image.png" />
<meta property="og:image" content="https://site-name.com/page-image.png" />
<meta property="twitter:image" content="https://site-name.com/page-image.png" />
<meta itemprop="image" content="https://site-name.com/page-image.png" />
```

## Setting Page Favicon

```js
import { setFavIcon } from '@mongez/dom';

setFavIcon('https://site-name.com/favicon.ico');
```

Outputs:

```html
<link rel="icon" href="https://site-name.com/favicon.ico" />
```

## Setting Page Color

Setting the page color is useful when working with mobile apps as it changes the header background.

```js
import { setPageColor } from '@mongez/dom';

setPageColor('#000');
```

Outputs:

```html
<meta name="theme-color" content="#000" />
```

## Setting HTML Attributes

```js
import { setHTMLAttributes } from '@mongez/dom';

setHTMLAttributes({
    lang: 'en',
    dir: 'ltr',
    app: 'MyApp'
});
```

Outputs:

```html
<html lang="en" dir="ltr" app="MyApp">
    ...
</html>
```

## Combine meta data in one function

You can set most of the meta data in just one function called `setPageMeta`

```js
import { setPageMeta } from '@mongez/dom';

setPageMeta({
    title: 'Page Title',
    description: 'Page Description',
    keywords: 'page, keywords, list',
    image: 'page image path',
    url: 'page url',
    favIcon: 'Page favicon',
    color: 'Page color',
    type: 'website'
});
```

Full list of the page meta as follows:

```ts
type MetaData = {
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
```

## Detects if user's device is in dark mode

```js
import { userPrefersDarkMode } from '@mongez/dom';

if (userPrefersDarkMode()) {
    // switch your style to dark mode
}
```

## Scroll to element

This will make the browser scrolls to the given element selector with smooth scroll.

```js
import { scrollTo } from '@mongez/dom';

scrollTo('#my-element');
```

## Append Javascript File

```js
import { loadScript } from '@mongez/dom';

loadScript('https://site-name.com/js-file.js', () => {
    // do something when file is loaded
});
```

## Sanitizing HTML to text

Sometimes its useful to get only the text from html code.

```js
import { htmlToText } from '@mongez/dom';

htmlToText('<h1>Hello World</h1>'); // Hello World
```

## User keyboard detection

The `pressed` function will allow you to check if the user has pressed on certain keys on keyboard with readable code.

> For demonstration purposes, the following example will be used with React JS.

```jsx
import { pressed, ESC_KEY, ENTER_KEY, TAB_KEY, CONTROL_KEY } from '@mongez/dom';

export default function MyInput() {
    const detectUserInput = e => {
        if (pressed(e, ESC_KEY)) {
            // user pressed on escape key
        } else if (pressed(e, ENTER_KEY)) {
            // user pressed on enter key
        } else if (pressed(e, CONTROL_KEY)) {
            // user pressed on control key
        } else if (pressed(e, TAB_KEY)) {
            // user pressed on tab key
        }
    };


    return (
        <input onChange={detectUserInput} />
    )
}
```

## TODO

- Add Unit Tests.
- Enhance Open Graph settings.
- Enhance Twitter settings.
- Enhance Favicon sizes.
- Completing Metadata Docs.
- Enhance `pressed` function to accept array of buttons, also add more keys in the keys list.
