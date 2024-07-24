---
layout: default
title: REST (v2)
nav_order: 0
parent: API
has_children: true
published: true
---

{:.no_toc}
# Data Commons REST API 

* TOC
{:toc}

## Overview

The Data Commons REST API is a
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library
that enables developers to programmatically access data in the Data Commons
knowledge graph, using [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). This allows you to explore the structure of the
graph, integrate statistics from the graph into data analysis applications and
much more.

You can use the REST API with any tool or language that supports HTTP. You can make queries on the command line (e.g. using [cURL](https://curl.se/)), by scripting HTTP requests in another language like Javascript, or even by entering an endpoint into your web browser!

## What's new in V2

The V2 API collapses functionality from [V1 API](/api/rest/v1) into a smaller number of endpoints, by introducing a syntax for _relation expressions_, described [here](/api/rest/v2/getting_started.html#relation-expressions). Each API endpoint can also handle both single and bulk requests.

    {: #get-key}
## Get API keys 

All access to Data Commons using the REST APIs must be authenticated and authorized with an API key.

We provide a trial API key for general public use. This key will let you try the API and make single requests.

<div markdown="span" class="alert alert-secondary" role="alert">
   <b>Trial key: </b>
   `AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI`
</div>

_The trial key is capped with a limited quota for requests._ If you are planning on using our APIs more rigorously (e.g. for personal or school projects, developing applications, etc.) please request an official key without any quota limits by
[filling out this form](https://docs.google.com/forms/d/e/1FAIpQLSeVCR95YOZ56ABsPwdH1tPAjjIeVDtisLF-8oDYlOxYmNZ7LQ/viewform).

To use the key in requests, see the [Authentication](/api/rest/v2/getting_started.html#authentication) page.

## Find available entities, variables, and their DCIDs

Many requests require the [DCID](/glossary.html#dcid) of the entity or variable you wish to query. For tips on how to find relevant DCIDs, entities and variables, please see the [Key concepts](/data_model.html) document, specifically the following sections:

- [Find a DCID for an entity or variable](/data_model.html#find-dcid)
- [Find places available for a statistical variable](/data_model.html#find-places)