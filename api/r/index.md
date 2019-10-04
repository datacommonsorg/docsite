---
layout: default
title: R
nav_order: 4
parent: API
has_children: true
---
# Data Commons R API

The **Data Commons R API** is a R library that enables developers to
programmatically access nodes in the Data Commons knowledge graph. This package
allows users to explore the structure of the graph, integrate statistics from
the graph into data analysis workflows and much more. Please see the [overview](/api)
for more details on the design and structure of the API.

Before proceeding, make sure you have followed the setup instructions below.

## Getting Started

To get started using the R API Client requires the following steps:

*   Install the R API Client via `devtools`.
*   Create an API key and enable the **Data Commons API**.
*   Provide the API key to the R API Client and begin developing.

### Installing the R API Client

In the R console, install the `datacommons` package using `devtools`.

```R
# If devtools is not installed yet, install devtools
if(!require(devtools)) install.packages("devtools")
# Load devtools
library(devtools)
# Install the R API Client
devtools::install_github("datacommonsorg/api-r@latest", subdir="datacommons")
```

### Creating an API Key

Using the Data Commons R API Client requires you to setup access to the **Data Commons API** on Google Cloud Platform.
Follow [the setup guide here](/api/setup.html).

### Using the R API Client

With the API key created and Data Commons API activated, we can now get started
using the Data Commons R API Client.

You can set the API key by calling `set_api_key`.
Start by loading `datacommons`, then set the API key like so.
    ```r
    library(datacommons)
    set_api_key('YOUR-API-KEY')
    ```

This will create an environment variable in your R runtime called
`DC_API_KEY` holding your key. Your key will then be used whenever
the package sends a request to the Data Commons graph.

You are now ready to go! From here you can view our tutorials on how to use the
API to perform certain tasks, or see a full list of functions, classes and
methods available for use below.
