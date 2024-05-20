# Documentation style guide

## General rules

We use the Google [Developer Documentation Style Guide](https://developers.google.com/style/) as our writing standard. Please follow the guidelines in that guide when making documentation changes.

## Links

The site supports both absolute and [relative links](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#relative-links); you can use either. Relative links work as in standard Github Markdown, using `.md` extensions. For example, for a
target page at a higher level of the tree than a source page, you can use this:

```
[Place types](../place_types.md)
```

Absolute links are against the repo root and must be specified _with .html extensions_. For example:

```
[Place types](/place_types.html)
```

## TOCs

To add a TOC to a page, use the following Markdown:

```
* TOC
{:toc}
```

## Page title

Add an H1 heading at the start of a page to get a page title. Be sure to exclude it from showing up in a TOC. For example:

```
{:.no_toc}
# Here is a page title
```

## Plurals

When describing a place or `Place`, be careful to distinguish between Data Commons `Place` objects and places that one might visit, and use the appropriate styling for each. Here are two sample sentences that illustrate the distinction:

Sarah loves travelling to many new places.
Sarah should call the API by specifying DCIDs associated with the `Place` objects whose populations she wishes to measure.

When describing more than one Data Commons `Class` (for example, two `Place` objects or three instances of `StatisticalVariable`), do not pluralize them. Instead, use terminology like five `Count` measurements or eight `Observation` occurrences. 