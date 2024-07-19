---
layout: default
title: Frequently asked questions
nav_order: 9
parent: Custom Data Commons
---

{:.no_toc}
# Custom Data Commons frequently asked questions

* TOC
{:toc}

## Privacy and security

### Can I restrict access to my custom instance?

Yes; there are many options for doing so. If you want an entirely private site with a non-public domain, you may consider using a Google Virtual Private Cloud to host your instance. If you want to have authentication and authorization controls on your site, there are also many other options. Please see [Restricting ingress for Cloud Run](https://cloud.google.com/run/docs/securing/ingress) for more information. 

Note that you cannot apply fine-grained access restrictions, such as access to specific data or pages. Access is either all or nothing. If you want to be able to partition off data, you would need to create additional custom instances.

### Will my custom data end up in the base Data Commons?

No. Even if a query needs data from the base Data Commons, gleaned from the (incomplete) results from your custom data, it will never transfer any custom data to the base data store.

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

