---
layout: default
title: Introduction to data science
nav_order: 222
parent: Educational materials
grand_parent: Additional resources
---

# Data science with _real data_

Introductory data science and machine learning courses crave _real world_ datasets to enhance student interest and enrich their learning experience. However, identifying, accessing and preparing _real data_ can be a painstaking task. As a result, several foundational courses tend to rely on a similar subset of datasets. We hope to demonstrate that Data Commons can help increase the diversity of _real world_ data used in such foundational courses taught across the world and enrich students' (and instructors') experience.

We make available an (increasing) sample of data science course assignments developed around illustrating key concepts at an introductory college level. In addition to revolving around core data science ideas, we use _real world_ data provided by the Data Commons APIs with the aim of enhancing the pedagogical goals of each topic. Each assignment is implemented as a [Python notebook](https://colab.research.google.com/). These notebooks are not teaching notes; they serve as self-contained templates for implementing, interpreting and/or analyzing a subset of core concepts. The entire assignment revolves around using some publicly available dataset, most often directly using the Data Commons APIs. 

Each assignment notebook should ideally be adapted to suit the needs of your curriculum and serve the needs of a complete and coherent course. We intend for them to serve as examples (templates) for you to customize extensively. We encourage course instructors and teaching assistants to use different datasets (and variables) for each iteration of their course. Luckily, Data Commons makes this easy.

## Why use this?

These materials were designed to:

* **_Use real data_**. Via the Data Commons API, students engage with _real world_ data from the get-go &mdash; no more stale, synthetic datasets. 

* **_Be interactive._** Each concept is illustrated with examples that instructors and teaching assistants can tinker with minimal effort, allowing students to learn in a hands-on way.

* **_Easy to adapt_.** The notebook format and Data Commons Python API makes everything modular and easy to edit.

## Who is this for?

Teachers, professors, instructors, teaching assistants, and anyone else developing and teaching data science curriculum. We also believe early practitioners can benefit greatly from the exercises.

As an example, MIT's large [Introduction to Machine Learning](https://introml.odl.mit.edu/) course has adapted several of the examples covered in these notebooks to suit their pedagogical needs. From using the same datasets to dive deeper into the material, to modifying the data/variables to illustrate a similar effect, the adaptations span a wide spectrum. 

## How can these be used?

We strongly encourage you to change and adapt these notebooks to fit your needs! You can download any notebook in either .ipynb or .py format by clicking on its link and **File > Download**.

Datasets can be changed by editing the list of variables queried (see the [Data Commons for Data Science](https://colab.research.google.com/github/datacommonsorg/api-python/blob/master/notebooks/intro_data_science/Data_Commons_For_Data_Science_Tutorial.ipynb) tutorial for more on this); editing framing and questions is as easy as editing text cells.

Some ideas:
* Add additional cells for any additional topics you want covered.
* For students with stronger programming skills, ask to implement the methods covered on their own.
* Some of the questions posed to students in the notebooks are open ended – these can be adapted to discussion sessions with students.

## Python notebooks

*  [**Data Commons for Data Science Tutorial**](https://colab.research.google.com/github/datacommonsorg/api-python/blob/master/notebooks/intro_data_science/Data_Commons_For_Data_Science_Tutorial.ipynb) \\
A quick tutorial introducing the key concepts of working with the Data Commons Python API. Great for familiarizing yourself with how to adapt datasets to your particular needs.

* [**Feature Engineering**](https://colab.research.google.com/github/datacommonsorg/api-python/blob/master/notebooks/intro_data_science/Feature_Engineering.ipynb) \\
Explores the first steps of any data science pipeline: feature selection, data visualization, preprocessing and standardization. Pairs well with “Classification and Model Evaluation”.

* [**Classification and Model Evaluation**](https://colab.research.google.com/github/datacommonsorg/api-python/blob/master/notebooks/intro_data_science/Classification_and_Model_Evaluation.ipynb) \\
Explores the second half of a data science pipeline: training and test splits, cross validation, metrics for model evaluation. Focus is on classification models. Pairs well with “Feature Engineering”.

* [**Regression: Basics and Prediction**](https://colab.research.google.com/github/datacommonsorg/api-python/blob/master/notebooks/intro_data_science/Regression_Basics_and_Prediction.ipynb) \\
An introduction to linear regression as a tool for prediction, from a modern machine learning perspective.

* [**Regression: Evaluation and Interpretation**](https://colab.research.google.com/github/datacommonsorg/api-python/blob/master/notebooks/intro_data_science/Regression_Evaluation_and_Interpretation.ipynb) \\
A more in-depth look at linear regression, with an emphasis on interpreting model parameters and evaluation metrics beyond simple accuracy. Provides a more statistical perspective.

* [**Clustering**](https://colab.research.google.com/github/datacommonsorg/api-python/blob/master/notebooks/intro_data_science/Introduction_to_Clustering.ipynb) \\
An introduction to clustering analysis for unsupervised learning. Explores the mechanics of K-means clustering and cluster interpretation.
