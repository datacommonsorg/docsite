---
layout: default
title: About the Course
nav_order: 1
parent: Data Literacy with Data Commons
grand_parent: Courseware
---

# About: Data Literacy with Data Commons

<div markdown="span" class="alert alert-info" role="alert" style="text-align: center">
    >> [Access the course materials here](course_materials.html). <<
</div>

## What is it?

A set of [modules](#modules) focusing on several [key concepts](#key-concepts) focusing on data modeling, analysis, visualization and the (ab)use of data to tell (false) narratives. Each module lists its objectives and builds on a pedagogical narrative around the explanation of key concepts, e.g. the differences between correlations and causation. We extensively use the Data Commons platform to point to _real world_ examples without needing to write a single line of code!  

All material is provided publicly and free of charge, under a Creative Commons license ([CC BY](https://creativecommons.org/licenses/by/4.0/)).

## Who is this for?

Anyone and everyone. Instructors, students, aspiring data scientists and anyone interested in advancing their data comprehension and analysis skills without needing to code. For instructors, the rest of this page details the curriculum organization and how to find key concepts/ideas to use.

## What's Different?

There are several excellent courses which range from basic data analysis to advanced data science. We make no claim about "Data Literacy with Data Commons" being a replacement for them. Instead, we hope for this curriculum to become a useful starting point for those who want to whet their appetite in becoming data literate. This material uses a hands on approach, replete with _real world_ examples but without requiring any programming. It also assumes only a high-school level of comfort with Math and Statistics. Data Commons is a natural companion platform to enable easy access to data and core visualizations. We hope that anyone exploring the suggested examples will rapidly be able to explore more and even generate new examples and case studies on their own! If you end up finding and exploring new examples and case studies, please do share them with us at [courses@datacommons.org](mailto:courses@datacommons.org).

## What topics are covered?
{:#key-concepts}

A non-exhaustive outline is:

- **Data and Modeling Overview** [Data and Modeling Overview &lt;url>]
  - What it means to ‘model’ a phenomenon
  - What is a variable
  - What is a measurement
    - Observation (direct) vs estimation (indirect)
    - Interpolation as an instance of estimation (indirect)
    - Introduce concepts such as sampling vs complete population-level observations
      - Types of sampling e.g. random, systematic, cluster, etc.
- **Basic Data Analysis**
  - Summary Statistics [Data and Modeling Overview, Deep Dive into Data “Set” &lt;url>]
    - Measures of central tendency and their benefits/drawbacks
      - E.g. Mean, median, mode
    - Measures of variability and their benefits/drawbacks
      - E.g. Variation, range, standard deviation
    - Discuss the limitations of summary statistics with examples
      - E.g. Anscombe Quartet
  - Aggregations
    - When and why do aggregations make sense or are necessary [Relating Data “Sets”, Mapping &lt;url>]
    - How to aggregate two data sets into one [Relating Data “Sets” &lt;url>]
    - How to aggregate data sets between levels of granularity [Mapping &lt;url>]
  - Outliers [Plotting/Graphing &lt;url>]
    - Why we care about outliers
    - How to spot and handle outliers
- **Techniques for Data Visualization** [Plotting/Graphing &lt;url>]
  - Plotting vs graphing
  - Why we visualize data
  - Types of plots
    - Scatter, line, map, bar, histogram, etc.
  - How to visualize 1-D vs 2-D vs N-D Data
- **Techniques for Statistical Modeling**
  - Distributions [Plotting/Graphing: Advanced Topic &lt;url>]
    - Theoretical vs empirical (i.e. probability distributions vs frequency distributions)
    - Normal/Gaussian distribution
      - Properties of the normal distribution
      - When it is appropriate to model using the normal distribution
    - Exponential distribution
    - Other distributions
      - Bernoulli
      - Binomial
  - Correlations [Correlations &lt;url>]
    - Linear vs quadratic vs exponential
    - Degree and direction of correlation
    - How to identify correlations
      - Visually (e.g. scatter plot)
      - Numerically (e.g. correlation coefficient)
    - Common pitfalls such as overgeneralization, Simpson’s paradox, etc.
    - Correlation vs. causation
- **Data Science in the Real World** [Data and Modeling Overview &lt;url>]
  - Lies, damn lies and statistics
    - Manipulative visuals
    - Manipulative statistics
  - Cognitive biases
    - Survivorship bias
    - False causality fallacy
    - Other biases

## What do we mean by data literacy?

What does it mean to be "data literate"? Unsurprisingly, the answer depends on who one asks: from those who believe it implies being a casual consumer of data visualizations (in the media, for example) to those who believe that such a person ought to be able to run linear regressions on large volumes of data in a spreadsheet. Given that most (or all) of us are proliferate _consumers_ of data, we take an opinionated approach to defining "data literacy": someone who is data literate ought to be comfortable with _consuming_ data across a wide range of modalities and be able to interpret it to make informed decisions. And we believe that data literacy ought not to be exclusionary and should be accessible to anyone and everyone.

There is no shortage of data all around us. While some of it will always be beyond the comprehension of most of us, e.g. advanced clinical trials data about new drugs under development or data reporting the inner workings of complex systems like satellites, much of the data we consume is not as complex and should not need advanced degrees to consume and decipher. For example, the promise of hundreds of dollars in savings when switching insurance providers or that nine out of ten dentists recommend a particular brand of toothpaste or that different segments of the society (men, women, youth, veterans etc) tend to vote a certain way on specific issues. We _consume_ this data regularly and being able to interpret it to draw sound conclusions ought not to require advanced statistics.

Unfortunately, data literacy has been an elusive goal for many because it has been gated on relative comfort with programming or programming-like skills, e.g. spreadsheets. We believe data literacy should be more inclusive and require fewer prerequisites. There is no hiding from a basic familiarity with statistics, e.g. knowing how to take a sample average—after all, interpreting data is a statistical exercise. However, for a large majority of us the consumption, interpretation and decision-making based on data does not need a working knowledge of computer science (programming).

As a summary, our view on “Data Literacy” can be described as follows:

- Ability to consume, understand, create, and communicate with data.
- Ability to make decisions based on data.
- And to do so confidently, i.e. reduce "data anxiety".
- A skill for everyone, not just "data scientists".

### Why Data Commons?

Data Commons (datacommons.org) is an open and public access platform to all sorts of publicly available data in the world. From demographic data to economic/financial data to health indicators to weather/climate, Data Commons aggregates and makes available data about millions of places across over 130,000 variables, e.g. Population Growth Rate. Additionally, Data Commons also provides some out-of-the-box data analysis tools, e.g. timeline charts, maps, scatter plots and the ability to download the data.

For the purpose of the Data Literacy, the Data Commons platform becomes an important component of the curriculum because it helps satisfy several curriculum development objectives:

- **Real Data** Data Commons provides open and easy access to a plethora of publicly available _real_ data.
- **Open Access** Data Commons is available to everyone at no cost and with no restrictions of use.
- **No Programming** Much of the Data Literacy curriculum expectations can be met by using the basic data analysis tools on the Data Commons website. While all of Data Commons's data is available via APIs, that is not required for accessing the data and performing basic analyses.
- **Customization** When viewing or analyzing any data on the Data Commons website, e.g. the [median household income in California, Nevada and Oregon](https://datacommons.org/tools/timeline#place=geoId%2F06%2CgeoId%2F32%2CgeoId%2F41&statsVar=Median_Income_Household&chart=%7B%22income%22%3A%7B%22pc%22%3Afalse%7D%7D), one can easily replace the places to display the same information for an entirely different set of locations, e.g. the [median household income in Florida, Louisiana and Texas](https://datacommons.org/tools/timeline#place=geoId%2F12%2CgeoId%2F22%2CgeoId%2F06&statsVar=Median_Income_Household&chart=%7B%22income%22%3A%7B%22pc%22%3Afalse%7D%7D).

### Deficiencies

We note that the curriculum objectives, themes, content and areas of focus are neither exhaustive nor a one size fits all. For example, we do not focus on the ethics of data collection in this curriculum. While these issues are of utmost importance, we chose to focus on a more basic and hands-on approach with the available resources. If you wish to help contribute any themes/topics that would supplement this material, please reach out at [courses@datacommons.org](mailto:courses@datacommons.org) and we would love to work with you.

We also have more advanced ["Data Science with Real Data"](/courseware/intro_data_science.md) curriculum/course material.
