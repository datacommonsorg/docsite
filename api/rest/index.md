---
layout: default
title: REST
nav_order: 4
parent: API
has_children: true
---
# Data Commons REST API

The **Data Commons REST API** is a REST library that enables developers to
programmatically access nodes in the Data Commons knowledge graph. This package
allows users to explore the structure of the graph, integrate statistics from
the graph into data analysis applications and much more. Please see the
[overview](/api) for more details on the design and structure of the API.

Before proceeding, make sure you have followed the setup instructions below.

## Creating an API key (Optional)

If you would like to provide an API key, follow the steps in [the API setup
guide](/api/setup.html). Data Commons *does not charge* users, but uses the
API key for understanding API usage.

You can provide the API key as a get parameter to all REST API calls. As an example:

```bash
curl -X POST 'https://api.datacommons.org/node/observations' \
-d '{"dcids": ["dc/p/x6t44d8jd95rd", "dc/p/lr52m1yr46r44"], \
     "measuredProperty": "count", \
     "statsType": "measuredValue", \
     "observationDate": "2018-12", \
     "observationPeriod": "P1M", \
     "measurementMethod": "BLSSeasonallyAdjusted"}'
```

### Using the REST API

You are now ready to go! From here you can view our
[tutorials](/tutorials.html) on how to use the API to perform certain tasks,
or see a full list of calls available for use in the left navigation menu.
