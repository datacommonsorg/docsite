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

The following files contain the content you can reuse and customize:

<table>
  <thead>
    <tr>
      <th>Directory and file(s)</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="450"><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html"><code>server/templates/custom_dc/custom/base.html</code></a></td>
      <td>HTML template file for the site's header. See [Customize the website header]() for details.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/homepage.html"><code>server/templates/custom_dc/custom/homepage.html</code></a></td>
      <td>HTML template file for the site's home page. See [Customize the home page]() for details.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/browser_landing.html"><code>server/templates/custom_dc/custom/browser_landing.html</code></a></td>
      <td>HTML template file for the landing page served by the bare `/explore` endpoint. See [Customize the explore page]() for details.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css"><code>static/custom_dc/custom/overrides.css</code></a></td>
      <td>Stylesheet overrides for the site. See [Customize static assets]() for details. </td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/logo.png"><code>static/custom_dc/custom/logo.svg</code></a></td>
      <td>Sample logo file – replace with your own. See [Customize static assets]() for details.</td>
    </tr>
  </tbody>
</table>

> **Note:** Currently, making changes to any of the files in the `static/` directory, even if you're testing locally, requires that you rebuild a local version of the repo to pick up the changes, as described in [Build a local image](/custom_dc/build_image.html#build-repo). We plan to fix this in the near future.

## Customize HTML templates {#html-templates}

### Before you start: Copy template files

Before you make changes to the template files in the repo, to ensure that you don't override your changes or have to resolve merge conflicts when you resync to the latest release, we recommend that you create a copy of the directory and files as follows:

1. Create a new subdirectory under `server/templates/custom_dc` and name it with your project name.
1. Copy the HTML files under `server/templates/custom_dc/custom` to your new directory.
1. In your `custom_dc/env.list` file, set the `FLASK_ENV` environment variable to the name of your new directory. When you build the website, your customized files will be picked up instead of the original ones.

You can customize the page header and footer (by default, empty) in [base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html) by adding or changing the HTML elements within the `<header></header>` and `<footer></footer>` tags, respectively.

## Customize Javascript and styles {#styles}

Use the [overrides.css](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css) file to customize the default Data Commons styles. The file provides a default color override. You can add all style overrides to that file.

Alternatively, if you have existing CSS and Javascript files, put them under the [/static/custom_dc/custom](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom) folder. Then include these files in the `<head>` section of the corresponding HTML files as:

<pre>
&lt;link href="/custom_dc/custom/<var>FILENAME</var>.css|js" rel="stylesheet" /&gt;
</pre>


