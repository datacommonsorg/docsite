---
layout: default
title: Customize the site
nav_order: 4
parent: Custom Data Commons
---

{:.no_toc}
# Customize the site

* TOC
{:toc}

The default custom Data Commons image provides a bare-bones UI that you will undoubtedly want to customize to your liking. Data Commons uses the Python [Flask](https://flask.palletsprojects.com/en/3.0.x/#) web framework and [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/) HTML templates. If you're not familiar with these, the following documents are good starting points:

- [Flask Templates](https://flask.palletsprojects.com/en/3.0.x/tutorial/templates/)
- [Flask Static Files](https://flask.palletsprojects.com/en/3.0.x/tutorial/static/)

HTML and CSS customization files are provided as samples to get you started. They are as follows:

<table>
  <thead>
    <tr>
      <th>Directory/files</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="450"><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html"><code>server/templates/custom_dc/custom/base.html</code></a></td>
      <td>Template file for the site's header and footer. More details below.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/homepage.html"><code>server/templates/custom_dc/custom/homepage.html</code></a></td>
      <td>Template file for the site's home page</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/browser_landing.html"><code>server/templates/custom_dc/custom/browser_landing.html</code></a></td>
      <td>Template file for the Graph Browser landing page. You can change the default text.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css"><code>static/custom_dc/custom/overrides.css</code></a></td>
      <td>Stylesheet overrides for the site. </td>
    </tr>
    <tr>
      <td><a href="https://github.com/datacommonsorg/website/blob/a246b809e1d756e0512ed4f09b59137a64dc6e4e/static/custom_dc/custom/logo.png"><code>static/custom_dc/custom/logo.png</code></a></td>
      <td>Sample logo file – replace with your own.</td>
    </tr>
  </tbody>
</table>

Note that the `custom` parent directory is customizable as the `FLASK_ENV` environment variable. You can rename the directory as desired and update the environment variable.

To enable the changes to be picked up by the Docker image, and allow you to refresh the browser for further changes, restart the Docker image with this additional flag to map the directories to the Docker workspace:

```shell
-v $PWD/server/templates/custom_dc/custom:/workspace/server/templates/custom_dc/custom
-v $PWD/static/custom_dc/custom:/workspace/static/custom_dc/custom
```

<!--[Note: the second line doesn't currently do anything, but this is the way it should work IMO]-->

If you have renamed the parent `custom` directory, be sure to use that name in the flag.

## Customize HTML templates {#html-templates}

You can customize the page header and footer (by default, empty) in [base.html](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/base.html) by adding or changing the HTML elements within the `<header></header>` and `<footer></footer>` tags, respectively.

<!--TODO: Add an example of customization e.g. different colors or text-->

## Customize Javascript and styles {#styles}

Use the [overrides.css](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom/overrides.css) file to customize the default Data Commons styles. The file provides a default color override. You can add all style overrides to that file.

Alternatively, if you have existing existing CSS and Javascript files, put them under the [/static/custom_dc/custom](https://github.com/datacommonsorg/website/blob/master/static/custom_dc/custom) folder. Then include these files in the `<head>` section of the corresponding HTML files as:

<pre>
&lt;link href="/custom_dc/custom/<var>FILENAME</var>.css|js" rel="stylesheet" /&gt;
</pre>

See [`server/templates/custom_dc/custom/new.html`](https://github.com/datacommonsorg/website/blob/master/server/templates/custom_dc/custom/new.html) as an example.

Note: Currently, making changes to any of the files in the `static/` directory, even if you're testing locally, requires that you rebuild a local version of the repo to pick up the changes, as described in [Build a local image](manage_repo.md#build-repo). We plan to fix this in the near future.
