---
layout: default
title: Pandas (V1)
nav_order: 40
parent: API - Query data programmatically
has_children: true
---

# Data Commons Pandas API

> **Warning:** This version of the Data Commons Python API will be deprecated in early 2026. Please migrate your applications to [V2](/api/python/v2). For help on translating your requests, see the [Migration guide](/api/python/v2/migration.html).

The **Data Commons Pandas API** is a superset of the Data Commons Python API:
all functions from the Python API are also accessible from
the Pandas API, and supplemental functions help with directly creating
[pandas](https://pandas.pydata.org/){: target="_blank"}
objects using data from the Data Commons knowledge graph for common
use cases. 

Before proceeding, make sure you have followed the setup instructions below.

## Install the Python Data Commons API

1. If not done already, install python3 and pip3. See [Setting up a Python development environment](https://cloud.google.com/python/docs/setup#installing_python){: target="_blank"} for procedures.
1. Install the `datacommons_pandas` package:

```bash
$ pip install datacommons_pandas
```
You are ready to go! You can view our [tutorials](/api/python/tutorials.html) on how to use the
API to perform certain tasks using [Google Colab](https://colab.sandbox.google.com/){: target="_blank"}, or refer to pages in the navigation bar for detailed information about all the methods available.

## Run Python interactively

The pages in this site demonstrate running the Pandas methods interactively from the Bash shell. To use this facility, be sure to import the `datacommons_pandas` package:

From your virtual environment, run:

```bash
python3
>>> import datacommons_pandas
>>>
```
