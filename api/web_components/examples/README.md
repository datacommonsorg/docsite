# Web Components Examples

This directory contains the pages that render the side-by-side source code and rendered output for the Data Commons web components examples.

## How the examples are rendered

The examples are rendered into the `code-preview` layout in `/_layouts/code-preview.html`.

A `<script>` tag in the layout pulls the the raw HTML source of the file specified in the `iframe_content_url` frontmatter property and displays it in a `<code>` block. It then applies syntax highlighting to the code via [Prism.js](https://prismjs.com/).

The right-side live-render is an iframe that loads the same file.

## How to add a new example

1. Add a new HTML file to the assets/examples/web-components/ directory containing the full HTML for the example.
2. Create a new markdown file in this directory that uses the code-preview layout.
3. Add frontmatter to the new file following this template:

```yaml
---
layout: code-preview
title: Web components example - [SOME DESCRIPTIVE NAME HERE]
published: true
nav_exclude: true # This keeps the page from showing up in the left navigation
iframe_content_url: /assets/examples/web-components/[FILENAME].html
---
```

The `iframe_content_url` should point to the HTML file you created in step 1.

4. Finally, you can link to the new example using the path `/api/web_components/examples/[FILENAME].html`
