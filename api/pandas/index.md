---
layout: default
title: Pandas
nav_order: 30
parent: API
has_children: true
---

# Data Commons Pandas API

The **Data Commons Pandas API** is a superset of the Data Commons Python API:
all functions from the Python API are also accessible from
the Pandas API, and supplemental functions help with directly creating
[pandas](https://pandas.pydata.org/)
objects using data from the Data Commons knowledge graph for common
use cases. 

**Note:** The Pandas API only supports the [v1](/api/rest/v1/index.html) of the REST APIs. 

Before proceeding, make sure you have followed the setup instructions below.

## Install the Python Data Commons API

1. If not done already, install python3 and pip3. See [Setting up a Python development environment](https://cloud.google.com/python/docs/setup#installing_python) for procedures.
1. Use pip to install the `datacommons_pandas` package:

```bash
$ pip install datacommons_pandas
```
You are ready to go! You can view our [tutorials](/tutorials) on how to use the
API to perform certain tasks using [Google Colab](https://colab.sandbox.google.com/), or refer to pages in the navigation bar for detailed information about all the methods available.

## Run Python interactively

The pages in this site demonstrate running the Pandas methods interactively from the Bash shell. To use this facility, be sure to import the `datacommons_pandas` package:

From your virtual environment, run:

```bash
python3
>>> import datacommons_pandas
>>>
```
