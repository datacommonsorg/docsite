---
layout: default
title: Why Data Commons
nav_order: 1
---

# Why Data Commons?

Data underlies everything, from science and public policy to journalism, but often, the data does not get used as much as it should be. The problem often (not always) is not the lack of data. There is a substantial amount of data that  is publicly available, most notably from organizations such  as the World Bank, Census Bureaus of different countries, CDC, etc. The problem is the difficulty in using the data.

Unfortunately, though the data is open, using it to answer specific questions often involves tedious 'foraging' --- finding the data, cleaning the data, reconciling different formats and schemas, figuring out how to merge data about the same entity from different sources, etc. This error prone and tedious process is repeated, once (or more) by each organization. This is a problem in almost every area of study involving data, from the social sciences and physical sciences to public policy.

Data Commons is an attempt to ameliorate some of this tedium by doing this once, on a large scale and providing cloud accessible APIs to the cleaned, normalized and joined data. While there are millions of datasets and it will be a while before Data Commons includes a substantial fraction of them, in every domain, some collections of data get used more frequently than others. We have started with a core set of these in the hope that useful applications can be built on top of them.

One of the salient aspects of Data Commons is that it is not a repository of data sets. There are many great repositories (dataverse, BQ public datasets, data.gov) that more than adequately address that need. Instead, it is a single unified database created by normalizing/aligning the schemas and entity references across these different datasets (to the extent possible). So, for example, if a researcher wants the population, violent crime rate and unemployment rate of a county, the researcher does not have to go to three different datasets (Census, FBI and BLS), but can instead, get it from a single database, using one schema, one API. Of course, she would want to know the provenance of the data, which is recorded with every data point, something enabled in the APIs.
