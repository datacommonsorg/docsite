[![Build and deploy to GitHub Pages](https://github.com/datacommonsorg/docsite/actions/workflows/github-pages.yml/badge.svg)](https://github.com/datacommonsorg/docsite/actions/workflows/github-pages.yml)

# Data Commons documentation site

This repo hosts Data Commons API documentation
available at https://docs.datacommons.org/.

## About Data Commons

[Data Commons](https://datacommons.org/) is an open knowledge graph that
provides a unified view across multiple public data sets and statistics.
We've bootstrapped the graph with lots of
[data](https://datacommons.org/datasets) from US Census, CDC, NOAA, etc.,
and through collaborations with the New York Botanical Garden,
Opportunity Insights, and more. However, Data Commons is
meant to be for community, by the community. We're excited to work with you
to make public data accessible to everyone.

To see the extent of data we have today, [browse the Knowledge Graph](https://datacommons.org/browser).

## Markdown

The Data Commons documentation uses [Kramdown](https://kramdown.gettalong.org/syntax.html) Markdown.

## Build locally

The documentation site is built using Jekyll. To run this locally:

1. Install [Ruby](https://jekyllrb.com/docs/installation/)
1. Run `bundle update`
1. Run `bundle exec jekyll serve --incremental`

You can continue to make local changes and just refresh the browser. If you make changes to YAML files, re-run `bundle exec jekyll serve`

Tip: If you want to make the staged site accessible to others (and not just on the loopback), add `--host 0.0.0.0` to the command. Then, users can access the site using the hostname of the machine where the site is running.

## License

Apache 2.0

## Contribute changes

### One-time setup steps

1. In https://github.com/datacommonsorg/docsite, click the **Fork** button to fork the repo.
1. Clone your forked repo to your desktop:

    <pre>
    git clone https://github.com/<var>USER_NAME</var>/docsite
    </pre>

    This adds your fork as the remote called `origin`.

1. Add `datacommonsorg/docsite` repo as a remote:

    <pre>
    git remote add <var>REMOTE_NAME</var> https://github.com/datacommonsorg/docsite.git
    </pre>

### Create a pull request

Every time you want to create a pull request, create a new branch and sync to the master branch:

<pre>
git checkout master
git pull master
git checkout -b <var>BRANCH_NAME</var>
</pre>

Make your changes, and then create the PR as follows:

<pre>
git add .
git commit -m "<var>COMMIT_MESSAGE<var>"
git push -u origin <var>BRANCH_NAME</var>
</pre>

Then, in github.com, in your forked repo, you can send a pull request. You will need to assign at least one reviewer to approve.

If this is your first
time contributing to a Google Open Source project, you may need to follow the
steps in [CONTRIBUTING.md](CONTRIBUTING.md). Be sure to follow [the style guide](STYLE_GUIDE.md)
when submitting documentation PRs.

Wait for approval of the pull request and merge the change.

## Support

For general questions or issues, please open an issue on our
[issues](https://github.com/datacommonsorg/docsite/issues) page. For all other
questions, please [send us feedback](https://docs.google.com/forms/d/e/1FAIpQLScJTtNlIItT-uSPXI98WT6yNlavF-kf5JS0jMrCvJ9TPLmelg/viewform).

**Note** - This is not an officially supported Google product.
