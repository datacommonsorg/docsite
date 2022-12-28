---
layout: default
title: Data Literacy with Data Commons
nav_order: 1
parent: Courseware
---

# Data Literacy with Data Commons

"Data Literacy with Data Commons" comprises curriculum/course materials for instructors, students and other practitioners working on or helping others become _data literate_. This includes detailed modules with pedagogical narratives, explanations of key concepts, examples, and suggestions for exercises/projects focused on advancing the _consumption_, _understanding_ and _interpretation_ of data in the contemporary world. In our quest to expand the reach and utility of this material, we assume no background in computer science or programming, thereby removing a key obstacle to many such endeavors.

### What is it?

A set of [modules](#modules) focusing on several [key concepts](#key-concepts) focusing on data modeling, analysis, visualization and the (ab)use of data to tell (false) narratives. Each module lists its objectives and builds on a pedagogical narrative around the explanation of key concepts, e.g. the differences between correlations and causation. We extensively use the Data Commons platform to point to _real world_ examples without needing to write a single line of code!  

All material is provided publicly and free of charge, under a Creative Commons license ([CC BY](https://creativecommons.org/licenses/by/4.0/)).

### Who is this for?

Anyone and everyone. Instructors, students, aspiring data scientists and anyone interested in advancing their data comprehension and analysis skills without needing to code. For instructors, the rest of this page details the curriculum organization and how to find key concepts/ideas to use.

### What's Different?

There are several excellent courses which range from basic data analysis to advanced data science. We make no claim about "Data Literacy with Data Commons" being a replacement for them. Instead, we hope for this curriculum to become a useful starting point for those who want to whet their appetite in becoming data literate. This material uses a hands on approach, replete with _real world_ examples but without requiring any programming. It also assumes only a high-school level of comfort with Math and Statistics. Data Commons is a natural companion platform to enable easy access to data and core visualizations. We hope that anyone exploring the suggested examples will rapidly be able to explore more and even generate new examples and case studies on their own! If you end up finding and exploring new examples and case studies, please do share them with us at [courses@datacommons.org](mailto:courses@datacommons.org).

### What do we mean by data literacy?

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

## Curriculum

### Objectives

With the view outlined above, we embarked on a mission to imagine a Data Literacy curriculum aimed at anyone and everyone who consumes data and aspires to correctly understand and interpret it to help with better decision-making. 

We list the following core objectives of such a curriculum:

- Exposing students (and practitioners) to the basics of data comprehension and interpretation.
- Introducing some basic and intermediate data-driven decision making concepts.
- Explicitly cater to the needs of students (and practitioners) who have no prior programming experience and a limited exposure to basic statistical concepts. 
- Adopt a narrative-based approach to appeal to a wide range of audiences.
- Grounding most/all examples and illustrative assignments on real data.
- Using as many of the out-of-the-box and freely available data exploration tools to preclude any advanced or specialized knowledge.
- Make the curriculum materials openly available and support extensive customizations for any instructors who wish to adopt components/modules to suit their needs.

### Suggested Prerequisites

We suggest only the following prerequisites for this curriculum:

- High-School level Mathematics (basic).
- High-School level Statistics (basic).

### How To Use

The curriculum is organized in self-contained modules. Instructors (and students) are welcome to consume or work through any of the modules or the components within any module. Each module <reference the module section> is available as a detailed document with several pedagogical notes, objectives and an outline/table of contents to allow easy navigation. 

To find what you may be looking for, or to use any content in your own courses/curriculum, we recommend the following approach:

1. Read the previous sections to re-familiarize yourself with the curriculum objectives which may explain our curriculum design choices.
   
2. Navigate to the Key Themes <reference to Key Themes section> section. It lists several key themes along with some pointers to specific modules which have the complete details.

3. Navigate to the Modules section. For each module, we show the Table of Contents. If you find what you are looking for (e.g. search "Categorical vs Numeric Variables" and you should find yourself at the second module <link to the second module>). You can then access the module itself for the content.

4. Use search (Ctrl + F) on this page to search for a term or topic you are interested in. If found, navigate to the linked module(s) to find the content. If you do not find the topic/concept you are looking for, please email us at [courses@datacommons.org](mailto:courses@datacommons.org) with suggestions about topics/concepts to add. If you would like to contribute to this endeavor, please do reach out at [courses@datacommons.org](mailto:courses@datacommons.org) and help us add more content.

### Key Concepts
{:#key-concepts}

* **Data and Modeling Overview** [Data and Modeling Overview &lt;url>]
    * What it means to ‘model’ a phenomenon
    * What is a variable
    * What is a measurement
        * Observation (direct) vs estimation (indirect)
        * Interpolation as an instance of estimation (indirect)
        * Introduce concepts such as sampling vs complete population-level observations
            * Types of sampling e.g. random, systematic, cluster, etc.
* **Basic Data Analysis**
    * Summary Statistics [Data and Modeling Overview, Deep Dive into Data “Set” &lt;url>]
        * Measures of central tendency and their benefits/drawbacks
            * E.g. Mean, median, mode
        * Measures of variability and their benefits/drawbacks
            * E.g. Variation, range, standard deviation
        * Discuss the limitations of summary statistics with examples
            * E.g. Anscombe Quartet
    * Aggregations
        * When and why do aggregations make sense or are necessary [Relating Data “Sets”, Mapping &lt;url>]
        * How to aggregate two data sets into one [Relating Data “Sets” &lt;url>]
        * How to aggregate data sets between levels of granularity [Mapping &lt;url>]
    * Outliers [Plotting/Graphing &lt;url>]
        * Why we care about outliers
        * How to spot and handle outliers
* **Techniques for Data Visualization** [Plotting/Graphing &lt;url>]
    * Plotting vs graphing
    * Why we visualize data
    * Types of plots
        * Scatter, line, map, bar, histogram, etc.
    * How to visualize 1-D vs 2-D vs N-D Data
* **Techniques for Statistical Modeling**
    * Distributions [Plotting/Graphing: Advanced Topic &lt;url>]
        * Theoretical vs empirical (i.e. probability distributions vs frequency distributions)
        * Normal/Gaussian distribution
            * Properties of the normal distribution
            * When it is appropriate to model using the normal distribution 
        * Exponential distribution
        * Other distributions
            * Bernoulli
            * Binomial
    * Correlations [Correlations &lt;url>]
        * Linear vs quadratic vs exponential
        * Degree and direction of correlation
        * How to identify correlations
            * Visually (e.g. scatter plot)
            * Numerically (e.g. correlation coefficient)
        * Common pitfalls such as overgeneralization, Simpson’s paradox, etc.
        * Correlation vs. causation
* **Data Science in the Real World** [Data and Modeling Overview &lt;url>]
    * Lies, damn lies and statistics
        * Manipulative visuals
        * Manipulative statistics
    * Cognitive biases
        * Survivorship bias
        * False causality fallacy
        * Other biases

### Modules
{:#modules}

The curriculum modules are listed below along with the table of contents from each module. Click on the module name and references to access all the content in the module.

Note: this is constantly a work in progress and we aim to keep making additions and complete the "TBD" modules over time. If there are discrepancies or if you do not find what you are looking for and/or if you would like to contribute to this effort by helping develop more content (or have suggested corrections), we would love to hear from you at [courses@datacommons.org](mailto:courses@datacommons.org).

<table>
  <tr>
    <td><strong>#</strong></td>
    <td><strong>Module</strong></td>
    <td><strong>Table of Contents</strong></td>
  </tr>
  <tr>
    <td>1</td>
    <td>Data Overview &lt;url></td>
    <td>
      Lies, Damn Lies, and Statistics
      <p>Why is Data Literacy Important?</p>

      <p>Manipulating Visuals</p>

      <p>Misleading Statistics</p>

      <p>Cognitive Biases</p>

      <p>Survivorship Bias</p>

      <p>False Causality Fallacy</p>

      <p>Other Biases</p>

      <p>Truth, Damn Truths, and Statistics</p>

      <p>Data Is Powerful</p>

      <p>So, What is Data, Anyway?</p>

      <p>Variables</p>

      <p>Measurements</p>

      <p>Direct Observation</p>

      <p>Estimation</p>

      <p>Interpolation and Extrapolation</p>

      <p>Population</p>

      <p>Sampling</p>

      <p>Random Sampling</p>

      <p>Systematic Sampling</p>

      <p>Convenience Sampling</p>

      <p>Cluster Sampling</p>

      <p>Models</p>

      <p>The Big Picture</p>

      <p>Communicating Data</p>

      <p>Descriptive Statistics</p>

      <p>Mode</p>

      <p>Median</p>

      <p>Mean</p>

      <p>Standard deviation</p>

      <p>Data Visualization</p>

      <p>Bar Chart</p>

      <p>Line Chart</p>

      <p>Scatter Plot</p>

      <p>Histogram</p>

      <p>Map Plot</p>
    </td>
  </tr>
  <tr>
    <td>2</td>
    <td>Deep Dive into Data "Set" &lt;url></td>
    <td>
      Introduction to Datasets
      <p>Where Do Data Sets Come From?</p>

      <p>Examples of Datasets</p>

      <p>Exploring Datasets</p>

      <p>Variables & Dimensions</p>

      <p>Categorical vs Numeric Variables</p>

      <p>Number of Observations</p>

      <p>Exercise: Dice Rolls</p>

      <p>Missing Observations</p>

      <p>Summary Statistics</p>

      <p>Measures of Central Tendency</p>

      <p>One Measure to Rule Them All?</p>

      <p>Mean</p>

      <p>Median</p>

      <p>Mode</p>

      <p>One and Done?</p>

      <p>Three and Complete?</p>

      <p>Measures of Variability</p>

      <p>Range and Standard Deviation</p>

      <p>Assignments</p>

      <p>Explore, Analyze and Compare Two Datasets</p>
    </td>
  </tr>
  <tr>
    <td>3</td>
    <td>Relating Data "Sets" &lt;url></td>
    <td>
      Introduction to Relating Data “Sets”
      <p>What Are Related Data Sets?</p>

      <p>Examples of Related Data Sets</p>

      <p>What About “Unrelated” Data Sets?</p>

      <p>Exercise: Finding Relationships</p>

      <p>How Do We Combine Related Data Sets?</p>

      <p>Visualizing Data Sets</p>

      <p>Examples of Tabular Data</p>

      <p>Basic Data Combinations</p>

      <p>Adding Rows</p>

      <p>Adding Columns</p>

      <p>More Complicated Combinations</p>

      <p>Exercise: Find the Combination</p>

      <p>Analyzing Combined Data</p>

      <p>Why Do We Combine Related Data Sets?</p>

      <p>Case Studies</p>

      <p>Blood Pressure vs. Age</p>

      <p>Simpson’s Paradox</p>

      <p>Global Covid Data</p>

      <p>Which Country is the “Best”?</p>

      <p>Exercise: Exploring New Places</p>

      <p>Exercise: Where to Live?</p>
    </td>
  </tr>
  <tr>
    <td>4</td>
    <td>Plotting/Graphing &lt;url></td>
    <td>
      Introduction to Plotting and Graphing
      <p>Plot vs. Graph</p>

      <p>Why Do We Plot?</p>

      <p>Common Plots</p>

      <p>Scatter</p>

      <p>Line</p>

      <p>Map</p>

      <p>Bar</p>

      <p>Histogram</p>

      <p>1-D vs. 2-D vs. N-D</p>

      <p>Exercise: Exploring Plots and Graphs</p>

      <p>Outliers</p>

      <p>Where Do Outliers Come From?</p>

      <p>How Do We Handle Outliers?</p>

      <p>Advanced Topic: Introduction to Distributions</p>

      <p>Normal Distribution</p>

      <p>Definition</p>

      <p>Properties</p>

      <p>When is Data Normal?</p>

      <p>Exercise: Is It Normal?</p>

      <p>Exceptions to the Rule</p>

      <p>Exponential</p>

      <p>Other Distributions (Optional)</p>

      <p>Bernoulli</p>

      <p>Binomial</p>
    </td>
  </tr>
  <tr>
    <td>5</td>
    <td>Correlations &lt;url></td>
    <td>
      Introduction to Correlation
      <p>What is Correlation?</p>

      <p>Linear, Quadratic, and Exponential Correlations</p>

      <p>Direction of Correlation: Positive and Negative</p>

      <p>Degree of Correlation</p>

      <p>Identifying Correlations</p>

      <p>Visual: Scatter Plot</p>

      <p>Line of Best Fit</p>

      <p>Numerical: Correlation Coefficient</p>

      <p>Examples of Correlated/Uncorrelated Variables</p>

      <p>Exercise: Spotting Correlations</p>

      <p>Exercise: Correlations in the Wild</p>

      <p>Common Pitfalls</p>

      <p>Lack of Data</p>

      <p>Simpson’s Paradox</p>

      <p>Important Outliers</p>

      <p>Weighted Correlation Coefficient</p>

      <p>Misleading Correlations</p>

      <p>Overgeneralization</p>

      <p>Correlation and Causation</p>

      <p>What is Causation?</p>

      <p>Correlation vs Causation</p>

      <p>What’s the Difference?</p>

      <p>Can We Have…</p>

      <p>Confounding Variable</p>

      <p>Case Studies</p>
    </td>
  </tr>
  <tr>
    <td>6</td>
    <td>Mapping &lt;url></td>
    <td>
      Introduction to Geographic Data
      <p>Examples of Geographic Data</p>

      <p>Levels of Granularity</p>

      <p>Latitude/Longitude Coordinates</p>

      <p>Mini-Exercise: Getting Used to Lat/Lon</p>

      <p>Numerical vs. Categorical Granularity</p>

      <p>Two Places, One Name? One Place, Two Names?</p>

      <p>Change Over Time</p>

      <p>Change Across Borders</p>

      <p>Visualizing Geographic Data: Map Plots</p>

      <p>Interpreting Geographic Data</p>

      <p>Analyzing Geographic Data</p>

      <p>Converting between Levels of Granularity</p>

      <p>Mapping Step</p>

      <p>Aggregation Step</p>

      <p>Aggregation by Summing</p>

      <p>Aggregation by Averaging</p>

      <p>Aggregation by Something Else?</p>

      <p>Exercise: Aggregation by You</p>

      <p>Converting between Types of Granularity</p>
    </td>
  </tr>
  <tr>
    <td>7</td>
    <td>Time Series [under development]</td>
    <td>[under development]</td>
  </tr>
</table>


<!-- **Module 1: [Data Overview]()**

* Lies, Damn Lies, and Statistics
    * Why is Data Literacy Important?
    * Manipulating Visuals
    * Misleading Statistics
    * Cognitive Biases
        * Survivorship Bias
        * False Causality Fallacy
        * Other Biases
* Truth, Damn Truths, and Statistics
    * Data Is Powerful
    * So, What is Data, Anyway?
        * Variables
        * Measurements
            * Direct Observation
            * Estimation
              * Interpolation and Extrapolation
        * Population

**Module 2: [] -->


### Deficiencies

We note that the curriculum objectives, themes, content and areas of focus are neither exhaustive nor a one size fits all. For example, we do not focus on the ethics of data collection in this curriculum. While these issues are of utmost importance, we chose to focus on a more basic and hands-on approach with the available resources. If you wish to help contribute any themes/topics that would supplement this material, please reach out at [courses@datacommons.org](mailto:courses@datacommons.org) and we would love to work with you.

We also have more advanced ["Data Science with Real Data"](/courseware/intro_data_science.md) curriculum/course material.

## Feedback

Data Literacy with Data Commons is constantly a work in progress and we aim to keep making additions and complete the "TBD" modules over time. If there are discrepancies or if you do not find what you are looking for and/or if you would like to contribute to this effort by helping develop more content (or have suggested corrections), we would love to hear from you at [courses@datacommons.org](mailto:courses@datacommons.org).

Finally, if you end up using any of this material or find it useful, we would love to hear from you at [courses@datacommons.org](mailto:courses@datacommons.org).
