---
layout: default
title: Frequently Asked Questions
nav_order: 9
parent: Custom Data Commons
---

{:.no_toc}
# Custom Data Commons Frequently Asked Questions

* TOC
{:toc}

## Privacy and security

### Can I restrict access to my custom instance?

Yes; there are many options for doing so. If you want an entirely private site with a non-public domain, you may consider using a Google Virtual Private Cloud to host your instance. If you want to have authentication and authorization controls on your site, there are also many other options. Please see [Restricting ingress for Cloud Run](https://cloud.google.com/run/docs/securing/ingress) for more information. 

Note that you cannot apply fine-grained access restrictions, such as access to specific data or pages. Access is either all or nothing. If you want to be able to partition off data, you would need to create additional custom instances.

### Will my custom data end up in the main Data Commons database?

No. Even if a query needs data from the main Data Commons, gleaned from the (incomplete) results from your custom data, it will never transfer any custom data to the main site.

## Natural language processing

### How does the natural language interface work?

The NL interface uses an open-source Python ML library, Sentence Transformers model, from [https://huggingface.co/sentence-transformers](https://huggingface.co/sentence-transformers). When you load data into a custom instance, the Data Commons NL server generates embeddings for both the main Data Commons data, and for your custom data, based on the statistical variables and search descriptions you have defined in your configuration. When a query comes in, the server generates equivalent embeddings, and the variables are assigned a relevance score based on cosine similarity. 

### Does the model use any Google technologies, such as Vertex AI?

No. At this time, there is no plan to use any Google-specific ML technologies for NL processing in custom Data Commons. All models are open-source.

### Where does the ML model run and where are embeddings stored?

The ML model runs entirely on your custom Data Commons instance, inside the Docker image. It does not use any Google-hosted systems, and data is never leaked to the main Data Commons. If a natural-language query requires data to be joined from the main Data Commons site, the custom site will use the embeddings that are locally generated before making the call to the main Data Commons to fetch the data.

### Does the model use feedback from user behavior to adjust scoring?

No. At this time, there is no plan to enable user feedback mechnanisms for custom Data Commons.