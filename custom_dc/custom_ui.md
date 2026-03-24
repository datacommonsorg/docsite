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

The Custom Data Commons image provides a default site user interface that you will want to customize. The site uses the Python [Flask](https://flask.palletsprojects.com/en/3.0.x/#) web framework, [React](https://react.dev/) Javascript components and [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/) HTML templates. 

### Simple customizations

Here are the files that control the interface for the Custom Data Commons UI. They allow for some simple customizations, namely:
- Instance-wide parameters, such as site name, static asset file paths, etc.: [server/app_env/custom.py](https://github.com/datacommonsorg/website/blob/master/server/app_env/custom.py){: target="_blank"}. See xxx 
- Styles: [static/custom_dc/custom/overrides.css](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css){: target="_blank"}. Override default styles.
- Logo: [static/custom_dc/custom/logo.svg](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/logo.svg){: target="_blank"}. Replace with your own.
- Create a site-wide footer: [server/templates/custom_dc/custom/base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"}. See xxx
- Edit the links that appear on the Knowledge Graph landing page (`/browser`): [server/templates/custom_dc/custom/browser_landing.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/browser_landing.html){: target="_blank"}. 
  ![knowlege graph browser links](/assets/images/custom_dc/customdc_screenshot15.png){: width = "200"}
  See xxx
- Edit the menus and menu items that appear in the right side of the site-wide header: [server/config/custom_dc/custom/base/header.json](https://github.com/datacommonsorg/website/blob/master/server/config/custom_dc/custom/base/header.json){: target="_blank"}
  ![menus](/assets/images/custom_dc/customdc_screenshot17.png){: width="400"}
  ![menu items](/assets/images/custom_dc/customdc_screenshot16.png){: width="200"}
  See xxx
- Edit the examples that appear at the bottom of the visualization tools (Map Explorer, Scatter Plot Explorer, Timeline Explorer): [server/templates/tools/*_examples.json](https://github.com/datacommonsorg/website/blob/master/server/templates/tools/){: target="_blank"}
  ![viztool examples](/assets/images/custom_dc/customdc_screemshot18.png){: width="200"}
- Add more pages: See xxxx

### More complex customizations

The content of the site-wide header and the homepage are built by Javascript and require more work:
- Header content: [server/templates/custom_dc/custom/base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"}. If you want to add elements to the header, beyond the logo, name, and menus, you will need to provide custom Javascript. See xxx
- Homepage content: [server/templates/custom_dc/custom/homepage.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/homepage.html){: target="_blank"}. If you want to add or remove elements from the main homepage, including the search bar and the sample tools, you will need to provide custom Javascript. See 


> **Note:** Currently, making changes to any of the files in the `static/` directory, even if you're testing locally, requires that you rebuild a local version of the repo to pick up the changes, as described in [Build a local image](/custom_dc/build_image.html#build-repo). 

## Before you start: Set up your environment

While it's possible to edit all of the files in place, this risks causing merge conflicts or overwrites whenever you sync to the latest stable release. Instead, we recommend the following procedure.

### Step : Set up environment variables (recommended)

1. Choose a simple name for directories that will host template and static files, e.g. `yourproject`.
1. In your `env.list` file, wet the `FLASK_ENV` variable to the name you choose in step 1, e.g. `yourproject`.
1. Copy and rename the file `server/app_env/custom.py` to name you choose in step 1, e.g. `server/app_env/yourproject.py`.
1. In this file, set the `NAME` option to the name you would like to appear in the header bar of the site (replacing `Custom Data Commons`).

### Step 1: Set up your Flask templates environment

1. Create a new subdirectory under `server/templates/custom_dc` using the same name.
1. For any of the HTML template files you would like to customize, copy them from `server/templates/custom_dc/custom` into your new directory. For additional HTML files, you can store them here too; be sure to set required variables as described in the comments at the top of `base.html`.
1. If you'd like to customize the menus and menu items tha appear in the header, create a subdirectory under your new directory called `base` and copy `server/config/custom_dc/custom/base/header.json`.
1. If you'd like to customize the examples that appear in the visualization tools, copy any or all of the `*_examples.json` files from `server/templates/tools/` into your new directory.



### Step 3: Set up your static assets environment

1. Create a new subdirectory under `static/custom_dc/`. Name it using the same name you used in step 1.
2. If you would like to override styles, copy `static/custom_dc/custom/overrides.css` into this directory.
3. Place your logo, image files and Javascript files in this directory.
4. In your `server/app_env/yourproject.py` options, set the `LOGO_PATH` and `OVERRIDE_CSS_PATH` to specify the new `custom_dc` subdirectory.

> Tip: The `app_env/yourproject.py` overrides default options set in `app_env/_base.py`. You can add other variables you would like to override from that file.

## Customize the header and other site-wide elements

Some site-wide elements (e.g. the logo, styles, title) are set using the .py config file described above and some are set in `custom_dc/env.list` (e.g. your Google Analytics account ID, ). You can further make the following site-wide customizations:
- Add a search bar to the header: in `base.html`, set the variable `is_hide_header_search_bar` to `false`.
- Add a footer: add elements to the `footer` block in `base.html`.
- Change styles by editing `overrides.css`.
- Add or remove items and text in the header menus: edit the the `header.json` file.
 
## Customize the home page 



## Add your own content

Alternatively, if you have existing CSS and Javascript files, put them under the [/static/custom_dc/custom](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom) folder. Then include these files in the `<head>` section of the corresponding HTML files as:

<pre>
&lt;link href="/custom_dc/custom/<var>FILENAME</var>.css|js" rel="stylesheet" /&gt;
</pre>


