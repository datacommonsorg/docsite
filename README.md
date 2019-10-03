# Data Commons Documentation Site

This repository holds files that generate the Data Commons API documentation site. The website uses [Jekyll](https://jekyllrb.com) with the [just-the-docs](https://pmarsceill.github.io/just-the-docs/) theme.

### Building Locally

To build the site locally, make sure that you have the latest version of ruby installed, then install `jekyll` and `bundler` using.

    $ gem install jekyll bundler

You will need to edit `_config.yml` by commenting out the line

    remote_theme: pmarsceill/just-the-docs

then adding

    theme: "just-the-docs"

Finally, run `bundle exec` in repository to bring up a local version.

    $ bundle exec jekyll serve
