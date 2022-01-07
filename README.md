[![Build and deploy to GitHub Pages](https://github.com/datacommonsorg/docsite/actions/workflows/github-pages.yml/badge.svg)](https://github.com/datacommonsorg/docsite/actions/workflows/github-pages.yml)

# Data Commons Documentation Site

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

To see the extent of data we have today, browse the graph using our
[browser](https://datacommons.org/browser).

## Developing locally

The documentation site is built using Jekyll. To run this locally:

1. Install [Ruby](https://jekyllrb.com/docs/installation/)
1. Run `bundle update`
1. Run `bundle exec jekyll serve`

If you make changes to yml files, re-run `bundle exec jekyll serve`

## License

Apache 2.0

## Contributing

In https://github.com/datacommonsorg/docsite, click on "Fork" button to fork the repo.

Clone your forked repo to your desktop.

Add datacommonsorg/docsite repo as a remote:

```shell
git remote add dc https://github.com/datacommonsorg/docsite.git
```

Every time when you want to send a Pull Request, do the following steps:

```shell
git checkout master
git pull dc master
git checkout -b new_branch_name
# Make some code change
git add .
git commit -m "commit message"
git push -u origin new_branch_name
```

Then in your forked repo, you can send a Pull Request. If this is your first
time contributing to a Google Open Source project, you may need to follow the
steps in [contributing.md](contributing.md). Be sure to follow [the style guide](STYLE_GUIDE.md)
when submitting documentation PRs.

Wait for approval of the Pull Request and merge the change.

## Support

For general questions or issues, please open an issue on our
[issues](https://github.com/datacommonsorg/docsite/issues) page. For all other
questions, please send an email to `support@datacommons.org`.

**Note** - This is not an officially supported Google product.
