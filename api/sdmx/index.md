---
layout: default
title: SDMX 3.0
nav_order: 3
parent: API - Query data programmatically
has_children: true
published: true
---

{:.no_toc}
# Data Commons SDMX 3.0 API

* TOC
{:toc}

## Overview

Data Commons Platform supports a limited version of the [SDMX](https://sdmx.org/) (Statistical Data and Metadata eXchange) [version 3.0](https://sdmx.org/wp-content/uploads/SDMx_3-0-0_Major_Changes_FINAL-1_0.pdf){: target="_blank"} standard API GET requests. The equivalent of the [REST Observation API](/api/rest/v2/observation.html) is supported: you can query to discover what data is available for given entities, and to fetch time series data (observations), both single-entity and multi-entity. 

## Service endpoints

The base URL for SDMX endpoints is:

<pre>
https://api.datacommons.org/sdmx/<var>VERSION</var>
</pre>

The current version is `v3`.

The currently supported endpoints are:

| API | URI path | Description |
| :---| :--- | :--- |
| [Availability](https://github.com/sdmx-twg/sdmx-rest/blob/v2.0.0/doc/availability.md){: target="_blank} | [/availability](availability.md) | Gets metadata about the data available for selected entities and variables |
| [Data](https://github.com/sdmx-twg/sdmx-rest/blob/v2.0.0/doc/data.md){: target="_blank"} | [/data](data.md) | Fetches statistical observations for selected entities and variables |

### Common parameters

All endpoints use the following parameters after the endpoint, that represent the standard SDMX parameters `context`, `agencyID`, `resourceID`, `version` and `key`, respectively:

```
dataflow/DC/DF_OBS/1.0.0/*
```

The `key` always uses the wildcard *.

{: #authentication}
## Authentication

All access to the base Data Commons (datacommons.org) using the SDMX APIs must be authenticated and authorized with an API key.

We provide a trial API key for general public use. This key will let you try the API and make single requests.

<div markdown="span" class="alert alert-secondary" role="alert">
   <b>Trial key: </b>
   `AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI`
</div>

_The trial key is capped with a limited quota for requests._ If you are planning on using our APIs more rigorously (e.g. for personal or school projects, developing applications, etc.) please request an official key without any quota limits; please see [Obtain an API key](/api/index.html#get-key) for information.

To include an API key, add your API key to the URL as a query parameter by appending <code>?key=<var>API_KEY</var></code>.

This looks like:

<pre>
https://api.datacommons.org/sdmx/v3/<var>ENDPOINT</var>/dataflow/DC/DF_OBS/1.0.0/*?key=<var>API_KEY</var>
</pre>

If the key is not the first query parameter, use <code>&key=<var>API_KEY</var></code> instead. This looks like:

<pre>
https://api.datacommons.org/sdmx/v3/<var>ENDPOINT</var>/dataflow/DC/DF_OBS/1.0.0/*?<var>QUERY</var>&key=<var>API_KEY</var>
</pre>

In cURL, you can also pass the key as a header. For example:

<pre>
curl -g \
"https://api.datacommons.org/sdmx/v3/<var>ENDPOINT</var>/dataflow/DC/DF_OBS/1.0.0/*?<var>QUERY</var>" -H "X-API-Key: <var>API_KEY</var>"
</pre>

## URL-encoding reserved characters

All SDMX requests use HTTP GET. GET requests do not allow some of the characters used by Data Commons DCIDs and relation expressions. When sending GET requests, you may need to use the [corresponding percent codes](https://en.wikipedia.org/wiki/Percent-encoding){: target="_blank"} for reserved characters. For example, a query string such as the following:

```
https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId/06&property=<-*
```
should be encoded as:

```
https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=geoId%2F06&property=%3C-%2A
```

Although sometimes the original characters may work, it's safest to always encode them.

> **Tip:** Don't URL-encode delimiters between parameters (`&`), separators between parameter names and values  (`=`), or `-`. 

See [https://www.w3schools.com/tags/ref_urlencode.ASP](https://www.w3schools.com/tags/ref_urlencode.ASP){: target="_blank"} for a handy reference.


