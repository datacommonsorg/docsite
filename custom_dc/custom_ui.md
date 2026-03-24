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

The Custom Data Commons image provides a default site user interface that you will want to customize. The site uses the Python [Flask](https://flask.palletsprojects.com/en/3.0.x/#){: target="_blank"} web framework, [React](https://react.dev/){: target="_blank"} Javascript components and [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/){: target="_blank"} HTML templates. 

This page describes how you can reuse and modify various code and configuration files that are provided for Custom Data Commons in the `website` repo.

## Simple customizations

Here are the files that control the interface for the Custom Data Commons UI. They allow for some simple customizations, namely:
- Instance-wide parameters, such as site name, static asset file paths, etc.: [server/app_env/custom.py](https://github.com/datacommonsorg/website/blob/master/server/app_env/custom.py){: target="_blank"}. See [Set up your environment](#setup) above for details.
- Styles: [static/custom_dc/custom/overrides.css](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css){: target="_blank"}. Override default styles.
- Logo: [static/custom_dc/custom/logo.svg](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/logo.svg){: target="_blank"}. Replace with your own.
- Create a site-wide footer: [server/templates/custom_dc/custom/base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"}. Replace the `footer` block with `<footer>` tags and add your content. To style the footer using `overrides.css`, add a new selector ID to the file and specify the `id` in your `footer` tag. (Note: If you try to )
- Edit the menus that appear in the right side of the site-wide header: [server/config/custom_dc/custom/base/header.json](https://github.com/datacommonsorg/website/blob/master/server/config/custom_dc/custom/base/header.json){: target="_blank"}
  ![menus](/assets/images/custom_dc/customdc_screenshot17.png){: width="400"}
  ![menu items](/assets/images/custom_dc/customdc_screenshot16.png){: width="200"}
  Add, remove, or edit the default entries to change menus, text, items, section layout, and links.
- Edit the text and links that appear on the Knowledge Graph landing page (`/browser`): [server/templates/custom_dc/custom/browser_landing.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/browser_landing.html){: target="_blank"}. Edit or replace the content in the `content` block.
  ![knowlege graph browser links](/assets/images/custom_dc/customdc_screenshot15.png){: width = "200"}
- Edit the examples that appear at the bottom of the visualization tools (Map Explorer, Scatter Plot Explorer, Timeline Explorer): [server/templates/tools/*_examples.json](https://github.com/datacommonsorg/website/blob/master/server/templates/tools/){: target="_blank"}
  ![viztool examples](/assets/images/custom_dc/customdc_screemshot18.png){: width="200"}. 
  Add, remove, or modify default entries as follows:
  - Set `id` to any string you want.
  - Replace `titleMessageId` with `title`, and pecify the text that you want to appear in the example chip. (Note: `titleMessageId` is only used if you are localizing your site, and is mutually exclusive with `title`.)
  - Set `url` to the full, URL-encoded path to the chart you would like to display.
	  Here's an example:
    ```json
    {
      "id": "map_oecd_country_gender_wage_gap",
      "title": "Gender wage gap by OECD country",
      "url": "tools/map#%26sv%3Dgender_wage_gap%26pc%3D0%26denom%3DCount_Person%26pd%3DEarth%26ept%3DCountry"
    },
    ```
- Add more pages: See xxxx

> **Note:** Currently, making changes to any of the files in the `static/` directory, even if you're testing locally, requires that you rebuild a local version of the repo to pick up the changes, as described in [Build a local image](/custom_dc/build_image.html#build-repo). 

{: #complex}
## Complex customizations: header and homepage

The content of the site-wide header and the homepage are built by Javascript and require more work:
- Header content: [server/templates/custom_dc/custom/base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"}. If you want to add elements to the header, beyond the logo, name, and menus, you will need to provide custom Javascript. See xxx
- Homepage content: [server/templates/custom_dc/custom/homepage.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/homepage.html){: target="_blank"}. If you want to add or remove elements from the main homepage, including the search bar and the sample tools, you will need to provide custom Javascript. See xxx

{: #setup}
## Before you start: Set up your environment

While it's possible to edit all of the files in place, this risks causing merge conflicts or overwrites whenever you sync to the latest stable release. Instead, we recommend the following procedure.

### Step 1: Set up your Flask templates environment 

1. Choose a simple name for directories that will host template and static files, e.g. `yourproject`.
1. Create a new subdirectory under `server/templates/custom_dc` using your new project name.
1. For any of the HTML template files you would like to edit directly, copy them from `server/templates/custom_dc/custom` into your new directory. For additional HTML files, you can store them here too; be sure to set required variables as described in the comments at the top of `base.html`.
1. If you'd like to customize the examples that appear in the visualization tools, copy any or all of the `*_examples.json` files from `server/templates/tools/` into your new directory.
1. If you'd like to customize the menus and menu items tha appear in the header, create a subdirectory under your new directory called `base` and copy `server/config/custom_dc/custom/base/header.json` there.

### Step 2: Set up your static assets environment

1. Create a new subdirectory under `static/custom_dc/`. Name it using the same name you used in step 1.
2. If you would like to override styles, copy `static/custom_dc/custom/overrides.css` into this directory.
3. Place your logo, image files and any custom Javascript files in this directory.

### Step 3: Set up environment variables

1. In your `env.list` file, wet the `FLASK_ENV` variable to the name you choose in step 1, e.g. `yourproject`.
1. Copy and rename the file `server/app_env/custom.py` to name you choose in step 1, e.g. `server/app_env/yourproject.py`.
1. In this file, set the `NAME` option to the name you would like to appear in the header bar of the site (replacing `Custom Data Commons`). 
1. If you plan to customize the CSS overrides file and/or replace the logo, set the `LOGO_PATH` and `OVERRIDE_CSS_PATH` options to specify the new static sudirectory under `custom_dc`, e.g. `custom_dc/yourproject/overrides.css`.

> Tip: The `app_env/yourproject.py` overrides default options set in `app_env/_base.py`. You can add other variables you would like to override from that file.

## Customize the home page and/or header

The contents of the home page and site-wide header, defined in
 [server/templates/custom_dc/custom/homepage.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/homepage.html){: target="_blank"} and [server/templates/custom_dc/custom/base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"} respectively, are entirely generated by Javascript as React components. The Javascript  is actually compiled at build time, using [Webpack](https://webpack.js.org/){: target="_blank"}. You have two options for customizing them, of which the pros and cons are listed below:

- Override the default Javascript entirely. With this option, you can directly modify the template HTML and/or reuse JS you are already using in other parts of your site. However, you will start with a completely blank slate for the header and/or home page. In particular, if you override the  need to provide code to generate the search bar and tool chips (if desired) and/or any items you want to add to the header. To use this option, see 
- Modify the existing React component(s). In this way, you can mix and match the default content with your own. However, you'll need to code in Typescript add build rules to Webpack to create your custom Javascript file(s). To use this option, see 

### Option 1: Override default JS

If you would like to customize the header, beyond the logo, title, and righ-side menus, do the following:
1. If you have your your own JS file(s), add them to your <code>static/custom_dc/<var>PROJECT_NAME<var></code> directory.
1. In your copied `base.html` file, in the `head` section, remove the following line or specify your JS file name instead:
   `<script src={{url_for('static', filename='base.js', t=config['VERSION'])}} async></script>`
1. Optionally add HTML elements in the `header` tags. 
1. To add styling for the header to `overrides.css`, add a new selector and replace the `main-header` ID with its name.





