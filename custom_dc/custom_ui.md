---
layout: default
title: Customize the site
nav_order: 6
parent: Build your own Data Commons
---

{:.no_toc}
# Customize the site

This page shows you how to customize the UI of your local instance. This is step 3 of the [recommended workflow](/custom_dc/index.html#workflow).

* TOC
{:toc}

## Overview

The default custom Data Commons image provides a bare-bones UI that you will undoubtedly want to customize to your liking. Data Commons uses the Python [Flask](https://flask.palletsprojects.com/en/3.0.x/#) web framework and [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/) HTML templates. If you're not familiar with these, the following documents are good starting points:

- [Flask Templates](https://flask.palletsprojects.com/en/3.0.x/tutorial/templates/)
- [Flask Static Files](https://flask.palletsprojects.com/en/3.0.x/tutorial/static/)

The following files contain the content you can reuse and customize.

<table>
  <thead>
    <tr>
      <th>Directory/files</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="450"><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html" target="_blank"><code>server/templates/custom_dc/custom/base.html</code></a></td>
      <td>HTML template for the entire site. For details, see  </td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/homepage.html" target="_blank"><code>server/templates/custom_dc/custom/homepage.html</code></a></td>
      <td>HTML template file for the site's home page. For details, see </td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/browser_landing.html" target="_blank"><code>server/templates/custom_dc/custom/browser_landing.html</code></a></td>
      <td>HTML template file for the Graph Browser landing page at `/explore`. You can change the sample links that appear.</td>
    </tr>

  <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/server/config/" target="_blank"><code>server/templates/custom_dc/custom/browser_landing.html</code></a></td>
      <td>HTML template file for the Graph Browser landing page at `/explore`. You can change the sample links that appear.</td>
    </tr>
      <tr>
      <td width="450"><a href="https://github.com/datacommonsorg/website/blob/master/server/config/custom_dc/custom/base/header.json" target="_blank"><code>server/config/custom_dc/custom/base/header.json</code></a></td>
      <td>JSON file for header content. See   </td>
    </tr>
      <tr>
      <td width="450"><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/tools/map_examples.json" target="_blank"><code>server/templates/tools/map_examples.json</code></a></td>
      <td>JSON file for the examples that appear in the Map Explorer. See   </td>
    </tr>
    <tr>
      <td width="450"><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/tools/scatter_examples.json" target="_blank"><code>server/templates/tools/scatter_examples.json</code></a></td>
      <td>JSON file for the examples that appear in the Scatter Plot Explorer. See   </td>
    </tr>
        <tr>
      <td width="450"><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/tools/timeline_examples.json" target="_blank"><code>server/templates/tools/timeline_examples.json</code></a></td>
      <td>JSON file for the examples that appear in the Timeline Explorer. See   </td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css"><code>static/custom_dc/custom/overrides.css</code></a></td>
      <td>Stylesheet overrides for the site. For details, see Customize styles and static assets</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/a246b809e1d756e0512ed4f09b59137a64dc6e4e/static/custom_dc/custom/logo.png"><code>static/custom_dc/custom/logo.svg</code></a></td>
      <td>Sample logo file – replace with your own.</td>
    </tr>
  </tbody>
</table>

> **Note:** Currently, making changes to any of the files in the `static/` directory, even if you're testing locally, requires that you rebuild a local version of the repo to pick up the changes, as described in [Build a local image](/custom_dc/build_image.html#build-repo). 

## Customize 

### Customize the home page 

You can customize the page header and footer (by default, empty) in [base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html) by adding or changing the HTML elements within the `<header></header>` and `<footer></footer>` tags, respectively.

### Customize the site header


## Customize JSON content {#json}



## Customize CSS, logo, and static assets {#styles}

Use the [overrides.css](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css) file to customize the default Data Commons styles. The file provides a default color override. You can add all style overrides to that file.

Alternatively, if you have existing CSS and Javascript files, put them under the [/static/custom_dc/custom](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom) folder. Then include these files in the `<head>` section of the corresponding HTML files as:

<pre>
&lt;link href="/custom_dc/custom/<var>FILENAME</var>.css|js" rel="stylesheet" /&gt;
</pre>


