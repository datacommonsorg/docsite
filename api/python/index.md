---
layout: default
title: Python (V1)
nav_order: 30
parent: API - Query data programmatically
has_children: true
---

# Data Commons Python API

> **Warning:** This version of the Data Commons Python API will be deprecated in early 2026. Please migrate your applications to [V2](/api/python/v2). For help on translating your requests, see the [Migration guide](/api/python/v2/migration.html).

The Data Commons Python API is a Python library that enables developers to
programmatically access nodes in the Data Commons knowledge graph. This package
allows users to explore the structure of the graph, integrate statistics from
the graph into data analysis workflows and much more. 

Before proceeding, make sure you have followed the setup instructions below.

## Install the Python Data Commons API

This procedure uses a Python virtual environment as recommended by Google Cloud [Setting up a Python development environment](https://cloud.google.com/python/docs/setup){: target="_blank"}.

1. If not done already, install python3 and pip3. See [Installing Python](https://cloud.google.com/python/docs/setup#installing_python) for procedures.
1. Go to your project directory and create a virtual environment using venv, as described in [Using venv to isolate dependencies](https://cloud.google.com/python/docs/setup#installing_and_using_virtualenv){: target="_blank"}. 
1. Install the the `datacommons` package:

```bash
$ pip install datacommons
```

You are ready to go! You can view our [tutorials](/api/python/tutorials.html) on how to use the
API to perform certain tasks using [Google Colab](https://colab.sandbox.google.com/){: target="_blank"}, or refer to pages in the navigation bar for detailed information about all the methods available.

## Run Python interactively

The pages in this site demonstrate running Python methods interactively from the Bash shell. To use this facility, be sure to import the `datacommons` package:

From your virtual environment, run:

```bash
python3
>>> import datacommons
>>>
```



