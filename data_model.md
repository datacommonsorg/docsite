---
layout: default
title: Data Model
nav_order: 2
---
---
layout: default
title: Data Models
nav_order: 2
---


##Data models
  The data included in data commons, even today, covers a wider range of domains, ranging from time series about demographics and employment to hurricanes to election results to protein structures. There is an inherent tension between using domain specific data models versus a more expressive but likely verbose data model capable of covering  the breadth of domains we hope to have in data commons.

  It is important for there to have an underlying model capable of expressing the breadth of data we might have about a single entity. For example, consider a place (such as Cook County, IL). There are time series about this place (related to demographics, jobs, etc.), there are specific events (like winter storms), information about historic events, etc. We would like a single uniform schema and query API for a client to access all this data. At the same time, for many applications that access a narrower slice of the data, it would be convenient to use data models that enable more compact encodings and/or more standard query languages such as SQL. To accomplish this, we use an expressive though verbose ‘base’ representation layer into which everything can be mapped. And on top of this we layer APIs which provide alternate views of the data in more specific data models.

Data Commons also provides access to the data in the following different views:
The data model for the base layer is the one used by schema.org <link>. This models the world as a set of entities, with attributes and relationships between entities. There is a taxonomy of entities and each entity is an instance of at least one of the types in the taxonomy. The types and relations types are also entities. This kind of structure has its origins in knowledge representation systems such as KRL and Cyc and has recently found adoption under the name “knowledge graph”. The node api and sparql apis provide access to this view. The KG browser (raw graph view) allows one to browse through data commons in this view
Time series view provides a set of time series for combinations of entities and variables (StatVars, in data commons parlance). The DCGet api provides API access to this view of the data and the timeline tool allows one to browse data commons in this view
The relational view provides access to a subset of the data commons data as a set of relational tables in Big Query (coming soon). This makes it easier for users to combine their data with data from Data Commons.

##Schemas
   A single schema (to the extent possible) for all the data is one of data common’s main goals. We would like this schema to be ‘web friendly’ in the sense that it is an extension of some of the most widely used schemas on the web for structured data. To this end, Data Commons is built on top of Schema.org. We make heavy use of some of Schema.org term (notably StatisticalPopulation and Observation) and extend Schema.org as required, introducing both general constructs (such as Intervals) and values for common attribute values (e.g., Ethnicities, EducationalAttainments, etc.).

##CrossWalks
  A significant part of the work in building Data Commons is in aligning terms used to refer to the same or overlapping concepts across different datasets. Certain kinds of terms have widely shared meaning, e.g., age, life expectancy. Others, such as educational attainment are measured differently across different regions. Sometimes, different data sets about the same topic will use slightly different definitions of a term (e.g., BLS vs Census on the definition of what it means to be employed) and in some cases, the same dataset might even change its definition over time. Even in these cases, for many applications that aim to perform comparisons, it is useful to have mappings or aggregations between these different terminologies. 

In Data Commons, to the extent possible, we preserve the original encodings. We also introduce new derived attributes/time series that capture mappings. We hope that this will enable useful applications for end users, while preserving the ability for researchers to explore implications of alternate mappings.

