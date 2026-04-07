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

{: #setup}
## Before you start: Set up your environment

The files that control the Custom Data Commons UI are in the following directories in the `website` repo:
- [`server/app_env/`](https://github.com/datacommonsorg/website/tree/master/server/app_env){: target="_blank"}: Python web server configuration
- [`server/templates/custom_dc/custom/`](https://github.com/datacommonsorg/website/tree/master/server/templates/custom_dc/custom){: target="_blank"}: Jinja HTML templates
- [`server/templates/tools/`](https://github.com/datacommonsorg/website/tree/master/server/templates/tools){: target="_blank"}: JSON files for visualization tools
- [`server/config/custom_dc/custom/`](https://github.com/datacommonsorg/website/tree/master/server/config/custom_dc/custom){: target="_blank"}: JSON files for layout elements
- [`static/custom_dc/custom/`](https://github.com/datacommonsorg/website/tree/master/static/custom_dc/custom){: target="_blank"}: CSS and image files

While it's possible to edit all of the files in place, this risks causing merge conflicts or overwrites whenever you sync to the latest stable release. Instead, we recommend the following procedure.

### Step 1: Set up your Flask templates environment 

1. Choose a simple name for directories that will host template and static files, e.g. `myproject`.
1. Create a new subdirectory under `server/templates/custom_dc` using the new name. For example:
   ```
   cd website/server/templates/custom_dc
   mkdir myproject
   ```
1. For any of the HTML template files you would like to edit directly, copy them from the `custom` subdirectory into your new directory. 
   ```
   cp custom/*.html myproject/
   ```
  For additional HTML files, you can store them here too; be sure to set required variables as described in the comments at the top of [`base.html`](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"}.

1. If you'd like to customize the examples that appear in the visualization tools, copy any or all of the JSON files from `server/templates/tools/` into your new directory.
   ```
   cp ../tools/*.json myproject/
   ```
1. If you'd like to customize the menus and menu items that appear in the header, create a new `base` subdirectory under your directory and copy [`server/config/custom_dc/custom/base/header.json`](https://github.com/datacommonsorg/website/blob/master/server/config/custom_dc/custom/base/header.json){: target="_blank"} there.
   ```
   cd myproject
   mkdir base
   cp ../../../config/custom_dc/custom/base/header.json base/
   ```

### Step 2: Set up your static assets environment

1. Create a new subdirectory under `static/custom_dc/` using the same name you created in step 1.
   ```
   cd website/static/custom_dc
   mkdir myproject
   ```
1. Copy [`static/custom_dc/custom/overrides.css`](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css){: target="_blank"} into this directory. You can use this file to define your own styles.
   ```
   cp custom/overrides.css myproject/
   ```
1. Place your logo, image files and any custom Javascript and CSS files in this directory. In the relevant HTML template files (e.g. `base.html` etc.), be sure to add `script` and `link` elements to reference them. For example:
   ```{% raw %}
   <head>
      ...
      <script src={{url_for('static', filename='my_file.js', t=config['VERSION'])}} async></script>
      <link rel="stylesheet" href={{url_for('static', filename='css/my_file.css', t=config['VERSION'])}}>
      ...
   </head>
   {% endraw %}```

### Step 3: Set up environment variables

1. In your `custom_dc/env.list` file, set the `FLASK_ENV` variable to the same name you created in step 1:
   ```
   FLASK_ENV=myproject
   ```
1. Copy and rename the file [`server/app_env/custom.py`](https://github.com/datacommonsorg/website/blob/master/server/app_env/custom.py){: target="_blank"} to the same name.
   ```
   cd website/server/app_env
   cp custom.py myproject.py
   ```
1. In this file, set the following variables:
   ```
   NAME = "My Data Commons" # Used for browser title bar
   OVERRIDE_CSS_PATH = "/custom_dc/myproject/overrides.css"
   LOGO_PATH = "/custom_dc/myproject/logo.svg"
   ```

> Tip: The `app_env/myproject.py` file overrides default options set in `app_env/_base.py`. You can add other variables you would like to override from that file.

## Simple customizations

The following are simple customizations you can make by editing HTML, CSS, and JSON files directly.

- Logo: Replace [`logo.svg`](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/logo.svg){: target="_blank"} with your own logo file.
- Styles: Add new selectors and declaration blocks to [`overrides.css`](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css){: target="_blank"}. (Note: The provided blocks control more than just styles, but content as well. Don't try to override them.)
- Add a site-wide footer:  Add elements to the `footer` block in [`base.html`](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"}. To style the footer using `overrides.css`, create a new CSS block. For example:
  ```
  <!--base.html-->
  <footer id="my-footer">
  <p>Here is my footer!</p>
  </footer>
  ```
  ```
  /* overrides.css */
  #my-footer {
    border-top: 1px solid #efefef;
    background-color: green;
  }
  ```
- Header bar menus: In [`header.json`](https://github.com/datacommonsorg/website/blob/master/server/config/custom_dc/custom/base/header.json){: target="_blank"}, add, remove, or edit the default entries to change menus, text, items, section layout, and links.

- Add a search bar to the header: In [`base.html`](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"}, set this option:
   ```{% raw %}
   {% set is_hide_header_search_bar = 'false' %}
   ```{% endraw %}
- Text and links on the Knowledge Graph landing page (`/browser`): Edit or replace the content in the `content` block of [browser_landing.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/browser_landing.html){: target="_blank"}.

- Visualization tools (Map Explorer, Scatter Plot Explorer, Timeline Explorer) example chips: Add, remove, or modify default entries in the [`*_examples.json`](https://github.com/datacommonsorg/website/blob/master/server/templates/tools/){: target="_blank"} files as follows:

  - Set `id` to any string you want.
  - Replace titleMessageId with title, and specify the text that you want to appear in the example chip. (Note: titleMessageId is only used if you are localizing your site, and is mutually exclusive with title.)
  - Set `url` to the full, URL-encoded path to the chart you would like to display.
	  Here's an example:

    ```json
    {
      "id": "map_oecd_country_gender_wage_gap",
      "title": "Gender wage gap by OECD country",
      "url": "tools/map#%26sv%3Dgender_wage_gap%26pc%3D0%26denom%3DCount_Person%26pd%3DEarth%26ept%3DCountry"
    }
    ```
- Add more pages to the site: Add HTML templates to your `server/templates/` directory. They should extend `base.html` and set the required variables listed at the top of that file.

> **Note:** Currently, making changes to any of the files in the `static/` directory, even if you're testing locally, requires that you rebuild a local version of the repo to pick up the changes, as described in [Build a local image](/custom_dc/build_image.html#build-repo). 


{: #complex}
## Complex customizations: header and homepage

The contents of the home page and site-wide header, defined in
 [`homepage.html`](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/homepage.html){: target="_blank"} and [`base.html`](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html){: target="_blank"} respectively, are entirely generated by Javascript as React "apps". The Javascript is actually compiled at build time, using [Webpack](https://webpack.js.org/){: target="_blank"}. To make changes to these elements, you have two options:

- Override the default Javascript entirely to start from scratch. With this option, you can directly modify the template HTML and/or reuse JS you are already using in other parts of your site. However, you will essentially remove all the default content and start with a blank page and/or header. For example, if you override the home page JS, you'll need to provide code to generate the search bar. For the header, this is the only available option currently.
- Modify the existing React component(s). In this way, you can mix and match the default content with your own. However, you'll need to code in Typescript and add build rules to Webpack to create your custom Javascript file(s). The Typescript is a separate Custom Data Commons component that you can copy and build. This option is only usable for the homepage.

### Option 1: Override default components

To remove the default header contents (logo, title, and menus), do the following:

1. In your copied `base.html` file, remove the header `main-header` ID (or rename to something else), and add HTML elements in the tags. 
   ```
   <header id="my-header">
   <p>Here is my header content!</p>
   </header>
   ```
1. If you have your own JS file(s), add them to your <code>static/custom_dc/<var>PROJECT_NAME</var></code> directory and add script elements to the head section of base.html. For example:
   ```{% raw %}
   <head>
   ...
   <script src={{url_for('static', filename='my_file.js', t=config['VERSION'])}} async></script>
   ...
   </head>
   {% endraw %}```

1. To add styling for the header to `overrides.css`, add a new block for it:
   ```
   #my-header {
    ...
   }
   ```

To remove the default home page main body (text, search bar and tools), do the following:
1. In your copied `homepage.html` file, remove the `main-header` ID from the content block div (or rename it to something else), and add HTML elements in the tags. 

   ```
   <div id="my-content">
   <p>Here is my home page content!</p>
   </div> 
   ```

1. If you have your own JS file(s), add them to your <code>static/custom_dc/<var>PROJECT_NAME</var></code> directory and add lines like this to the head section of `homepage.html`:
   ```{% raw %}
   <head>
      ...
      <script src={{url_for('static', filename='my_file.js', t=config['VERSION'])}} async></script>
      ...
   </head>
   {% endraw %}```
1. To add styling, add new selector blocks to `overrides.css`.

### Option 2: Modify default Javascript

> **Note**: Only use this procedure if you are familiar with React libraries and coding in Typescript.

To modify elements of the home page:

1. Copy the files [`static/js/apps/homepage/custom_dc_app.tsx`](https://github.com/datacommonsorg/website/blob/master/static/js/apps/homepage/custom_dc_app.tsx){: target="_blank"} and [`static/js/apps/homepage/main_custom_dc.ts`](https://github.com/datacommonsorg/website/blob/master/static/js/apps/homepage/main_custom_dc.ts){: target="_blank"} and give them different file names. For example:
   ```
   cd website/static/js/apps/homepage
   cp custom_dc_app.tsx my_homepage.tsx
   cp main_custom_dc.ts my_main.ts
   ```
1. Edit [`static/webpack.config.js`](https://github.com/datacommonsorg/website/blob/master/static/webpack.config.js){: target="_blank"} to add another build entry: 
   ```
   my_homepage: [
   __dirname + "/js/apps/homepage/my_main.ts",
   __dirname + "/css/homepage.scss",
   ]
   ```

1. Edit the `.tsx` file to add or remove components.

1. In `base.html`, replace the `homepage_custom_dc.js` script file name with your new name. For example:
   ```{% raw %}
   <head>
      ...
      <script src={{url_for('static', filename='my_homepage.js', t=config['VERSION'])}} async></script>
      ...
   </head>
   {% endraw %}```