---
layout: default
title: Python
nav_order: 2
parent: API
has_children: true
---
# Data Commons Python API

The **Data Commons Python API** is a Python library that enables developers to
programmatically access nodes in the Data Commons knowledge graph. This package
allows users to explore the structure of the graph, integrate statistics from
the graph into data analysis workflows and much more. Please see the [Data Commons API Overview](/api)
for more details on the design and structure of the API.

Before proceeding, make sure you have followed the setup instructions below.

## Getting Started

To get started using the Python API requires the following steps:

*   Install the API using `pip`.
*   (Optional) Create an API key and enable the **Data Commons API**.
*   Begin developing with the Python API

### Installing the Python API

First, install the `datacommons` package through `pip`.

```bash
$ pip install datacommons
```

For more information about installing `pip` and setting up other parts of
your Python development environment, please refer to the
[Python Development Environment Setup Guide](https://cloud.google.com/python/setup.html)
for Google Cloud Platform.

### Creating an API Key (Optional)

If you would like to provide an API key, follow the steps in [the API setup
guide](/api/setup.html). Data Commons *does not charge* users, but uses the
API key for understanding API usage.

With the API key created and Data Commons API activated, we can now get started
using the Data Commons Python API. There are two ways to provide your key
to the Python API package.

1.  You can set the API key by calling `datacommons.set_api_key`.
    Start by importing `datacommons`, then set the API key like so.

    ```python
    import datacommons as dc

    dc.set_api_key('YOUR-API-KEY')
    ```

    This will create an environment variable in your Python runtime called
    `DC_API_KEY` holding your key. Your key will then be used whenever
    the package sends a request to the Data Commons graph.

1.  You can export an environment variable in your shell like so.

    ```python
    export DC_API_KEY='YOUR-API-KEY'
    ```

    After you've exported the variable, you can start using the Data Commons
    package.

    ```
    import datacommons as dc
    ```

    This route is particularly useful if you are building applications that
    depend on this API, and are deploying them to hosting services.

### Using the Python API

You are ready to go! From here you can view our [tutorials](/tutorials.html) on how to use the
API to perform certain tasks, or see a full list of functions, classes and
methods available for use in the sidebar.
