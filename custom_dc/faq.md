---
layout: default
title: Frequently asked questions
nav_order: 13
parent: Build your own Data Commons
---

{:.no_toc}
# Custom Data Commons frequently asked questions

* TOC
{:toc}

## General questions

### Should I contribute my data to the base Data Commons or should I run my own instance?

If you have determined that your data is a [good fit for Data Commons](https://datacommons.org/faq#fit), the main considerations for whether to host your data in the base Data Commons or in your own custom instance are as follows:
- If you have any private data, or you want to restrict access to your data, you must use your own instance.
- If you want to maintain governance and licensing over your data, you should use your own instance.
- If you want to control the UI of the website hosting your data, use your own instance.
- If you want the widest possible visibility of your data, including direct access through Google Search, add your data to base Data Commons.

For detailed comparison on the differences between base and custom Data Commons, see the [Overview](/custom_dc/index.html#comparison) page.

### How can I request new features or provide feedback? {#feedback}

Please see [Get support](support.md).

## Privacy and security

### Can I restrict access to my custom instance?

Yes; there are many options for doing so. If you want an entirely private site with a non-public domain, you may consider using a Google Virtual Private Cloud to host your instance. If you want to have authentication and authorization controls on your site, there are also many other options. Please see [Restricting ingress for Cloud Run](https://cloud.google.com/run/docs/securing/ingress) for more information. 

Note that you cannot apply fine-grained access restrictions, such as access to specific data or pages. Access is either all or nothing. If you want to be able to partition off data, you would need to create additional custom instances.

### Will my data or queries end up in base Data Commons? {#data-security}

Your user queries, observations data, or property values are never transferred to base Data Commons. The NL model built from your custom data lives solely in your custom instance. The custom Data Commons instance does make API calls to the base Data Commons instance (as depicted in [this diagram](/custom_dc/index.html#system-overview)) only in the following instances:
- At data load time, API calls are made from the custom instance to the base instance to resolve entity names to [DCIDs](/glossary.html#dcid); for example, if your data refers to a particular country name, the custom instance will send an API request to look up its DCID. 
- At run time, when a user enters an NL query, the custom instance uses its local NL model to identify the relevant statistical variables. The custom instance then issues two requests for statistical variable observations: a SQL query to your custom SQL database and an API call to the base Data Commons database. These requests only include DCIDs and contain no information about the original query or context of the user request. The data is joined by entity DCIDs.
- At run time, when the website frontend renders a data visualization, it will also make the same two requests to get observations data. 

## Natural language processing

### How does the natural language (NL) interface work?

The Data Commons NL interface has the ability to use a combination of different embedding models, heuristics and large-language models (LLMs) (as fallback). Given an NL query, it first detects schema information (variables, properties, etc.) and entities (e.g., places like "California") in the query, and then responds with a set of charts chosen based on the query shape (ranking, etc.) and data existence constraints.

The custom instance uses a local open-source Python ML library, Sentence Transformers model, from [https://huggingface.co/sentence-transformers](https://huggingface.co/sentence-transformers), and does not use LLM fallback.

When you load data into a custom instance, the Data Commons NL server generates embeddings for both the base Data Commons data, and for your custom data, based on the statistical variables and search descriptions you have defined in your configuration. When a query comes in, the server generates equivalent embeddings, and the variables are assigned a relevance score based on cosine similarity.

### Does the model use any Google technologies, such as Vertex AI?

No. While the base Data Commons uses Vertex AI, the custom instance uses open-source ML technologies only.

### Where does the ML model run and where are embeddings stored?

The ML model runs entirely on your custom Data Commons instance, inside the Docker image. It does not use any Google-hosted systems, and data is never leaked to the base Data Commons. If a natural-language query requires data to be joined from the base data store, the custom site will use the embeddings that are locally generated before making the call to the base Data Commons to fetch the data.

### Does the model use feedback from user behavior to adjust scoring?

No. However, you have the ability to improve query quality by improving your [search descriptions](/custom_dc/custom_data.html#varparams).

### How can I find out what terms my users are searching on?

The best way to record your users' search queries is with Google Analytics. Data Commons exports many custom Google Analytics events that you can use to create dimensions to report on. In particular, for NL queries, there are three different event types, that are triggered when a user submits a query, when results are returned and so on. See [https://github.com/datacommonsorg/website/blob/f5e8e87c2291d87dfa37a3a887f01d7ff28d6467/static/js/shared/ga_events.ts](https://github.com/datacommonsorg/website/blob/f5e8e87c2291d87dfa37a3a887f01d7ff28d6467/static/js/shared/ga_events.ts){: target="_blank"} for details. For procedures on setting this up, see [Report on custom dimensions](/custom_dc/launch_cloud.html#custom-dimensions).

