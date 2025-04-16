---
layout: default
title: Get statistical observations as Pandas DataFrames
nav_order: 3
parent: Python (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Observations Dataframe

In addition to the [Observation endpoint](observation.md), the client provides direct access to a special property method, `observations_dataframe` which provides the same functionality, but returns results as [Pandas](https://pandas.pydata.org/docs/index.html){: target="_blank"} [DataFrames](https://pandas.pydata.org/docs/user_guide/dsintro.html#basics-dataframe){: target="_blank"}.

> **Note:** To use this feature, you must have installed the `Pandas` module. See [Install the Python Data Commons V2 API](index.md#install) for details.

* TOC
{:toc}

## observation_dataframe

Fetches observations for specified variables, dates, and entities, by DCID or entity type. 

### Signature

```python
observation_dataframe(variable_dcids, date, entity_dcids, entity_type, parent_entity, property_filters)
```

### Input parameters

| Name          | Type  |   Description  |
|---------------|-------|----------------|
| variable_dcids <br/> <required-tag>Required</required-tag> | string or list of strings | One or more DCIDs of the statistical variables to query. |
date <br/><required-tag>Required</required-tag> | string or string literal | The date (and time) for which the observations are being requested. Allowed values are: <br/>- `"latest"`: return the latest observations. One observation is returned for each specified entity and variable, for each provenance of the data. </br>- A string in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601){: target="_blank"} format that specifies the date and time used by the target variable; for example, `2020` or `2010-12`.<br/>- `"all"`: Get all observations for the specified variables and entities. |
| entity_dcids <br/><optional-tag>Optional</optional-tag> | string or list of strings or string literal | By default this is set to `"all"`, in which case you must use the `entity_type` parameter, to limit the results to a given type.  To limit to specific entities, set this to one or more DCIDs of the entities to query. |
| entity_type | string | The DCID of the type of the entities to query; for example, `Country` or `Region`. Required when `entity_dcids` is set to `"all"` (the default); invalid otherwise. | 
| parent_entity | string | The DCID of the parent entities to query; for example, `africa` for African countries, or `Earth` for all countries. Required when `entity_dcids` is set to `"all"` (the default); invalid otherwise. |
| property_filters <br/><optional-tag>Optional</optional-tag> | dict mapping a string to a string or list of strings | The observation properties by which to filter the results, where the key is the observation property, such as `measurementMethod`, `unit`, or `observationPeriod`, and the value is the list of values to filter by. |
{: .doc-table }

## Examples

{: .no_toc}
### Example 1: Get all observations for a single variable and entity

This example retrieves the count of men in the state of Arkansas over all data history.

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids="Count_Person_Male", date="all", entity_dcids="geoId/05")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```python
     date    entity entity_name           variable  ...   measurementMethod  observationPeriod                                      provenanceUrl  unit
0    2011  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS5yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
1    2012  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS5yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
2    2013  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS5yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
3    2014  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS5yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
4    2015  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS5yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
..    ...       ...         ...                ...  ...                 ...                ...                                                ...   ...
191  2015  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS1yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
192  2016  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS1yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
193  2017  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS1yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
194  2018  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS1yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None
195  2019  geoId/05    Arkansas  Count_Person_Male  ...  CensusACS1yrSurvey               None  https://www.census.gov/programs-surveys/acs/da...  None

[196 rows x 12 columns]
```

{: .no_toc}
### Example 2: Get all observations for a single variable and multiple entities

This example compares the historic populations of Sudan and South Sudan.

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids="Count_Person", date="all", entity_dcids=["country/SSD","country/SDN"])
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```python
     date       entity  entity_name      variable  ...                       measurementMethod  observationPeriod                                      provenanceUrl  unit
0    1960  country/SSD  South Sudan  Count_Person  ...                                    None                P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
1    1961  country/SSD  South Sudan  Count_Person  ...                                    None                P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
2    1962  country/SSD  South Sudan  Count_Person  ...                                    None                P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
3    1963  country/SSD  South Sudan  Count_Person  ...                                    None                P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
4    1964  country/SSD  South Sudan  Count_Person  ...                                    None                P1Y  https://datacatalog.worldbank.org/dataset/worl...  None
..    ...          ...          ...           ...  ...                                     ...                ...                                                ...   ...
165  2016  country/SDN        Sudan  Count_Person  ...  WorldBankSubnationalPopulationEstimate                P1Y  https://databank.worldbank.org/source/subnatio...  None
166  2024  country/SDN        Sudan  Count_Person  ...                               Wikipedia               None                          https://www.wikipedia.org  None
167  2008  country/SDN        Sudan  Count_Person  ...                      WikidataPopulation               None   https://www.wikidata.org/wiki/Wikidata:Main_Page  None
168  2015  country/SDN        Sudan  Count_Person  ...                      WikidataPopulation               None   https://www.wikidata.org/wiki/Wikidata:Main_Page  None
169  2017  country/SDN        Sudan  Count_Person  ...                      WikidataPopulation               None   https://www.wikidata.org/wiki/Wikidata:Main_Page  None

[170 rows x 12 columns]
```

{: .no_toc}
### Example 3: Get all observations for multiple variables and multiple entities

This example compares the historic populations, median ages, and unemployment rates of the US, California, and Santa Clara County.

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids=["Count_Person", "Median_Age_Person", "UnemploymentRate_Person"], date="all", entity_dcids=["country/USA", "geoId/06", "geoId/06085"])
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```python
      date       entity         entity_name                 variable  ... measurementMethod  observationPeriod                                      provenanceUrl  unit
0     1900     geoId/06          California             Count_Person  ...   CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
1     1901     geoId/06          California             Count_Person  ...   CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
2     1902     geoId/06          California             Count_Person  ...   CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
3     1903     geoId/06          California             Count_Person  ...   CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
4     1904     geoId/06          California             Count_Person  ...   CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
...    ...          ...                 ...                      ...  ...               ...                ...                                                ...   ...
4151  2014  geoId/06085  Santa Clara County  UnemploymentRate_Person  ...              None               None  https://www.atsdr.cdc.gov/placeandhealth/svi/d...  None
4152  2016  geoId/06085  Santa Clara County  UnemploymentRate_Person  ...              None               None  https://www.atsdr.cdc.gov/placeandhealth/svi/d...  None
4153  2018  geoId/06085  Santa Clara County  UnemploymentRate_Person  ...              None               None  https://www.atsdr.cdc.gov/placeandhealth/svi/d...  None
4154  2020  geoId/06085  Santa Clara County  UnemploymentRate_Person  ...              None               None  https://www.atsdr.cdc.gov/placeandhealth/svi/d...  None
4155  2022  geoId/06085  Santa Clara County  UnemploymentRate_Person  ...              None               None  https://www.atsdr.cdc.gov/placeandhealth/svi/d...  None

[4156 rows x 12 columns]
```
{: .no_toc}
### Example 4: Get latest observations for a single variable and multiple entities, limited by type and parent

Ths example gets all observatons for the proportion of population below the international poverty line for all countries in Africa. 

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids="sdg/SI_POV_DAY1", date="latest", entity_type="Country", parent_entity="africa")
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

```python
date       entity               entity_name         variable  ... measurementMethod  observationPeriod                           provenanceUrl         unit
0   2012  country/COD               Congo [DRC]  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
1   2016  country/SWZ                  Eswatini  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
2   2018  country/GIN                    Guinea  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT    
3  2018  country/GNB             Guinea-Bissau  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
34  2016  country/SSD               South Sudan  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
35  2016  country/LBR                   Liberia  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
36  2014  country/CMR                  Cameroon  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
37  2019  country/EGY                     Egypt  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
38  2018  country/SYC                Seychelles  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
39  2015  country/NAM                   Namibia  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
40  2018  country/BEN                     Benin  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
41  2008  country/CAF  Central African Republic  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
42  2019  country/ZWE                  Zimbabwe  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
43  2017  country/STP     São Tomé and Príncipe  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
44  2018  country/TCD                      Chad  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
45  2014  country/MRT                Mauritania  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
46  2020  country/GMB                    Gambia  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
47  2013  country/BDI                   Burundi  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
48  2017  country/MUS                 Mauritius  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT
49  2014  country/COM                   Comoros  sdg/SI_POV_DAY1  ...           SDG_G_G               None  https://unstats.un.org/sdgs/dataportal  SDG_PERCENT

[50 rows x 12 columns]
```
{: .example-box-content .scroll}

{: .no_toc}
### Example 5: Get all observations for a single variable and entity, with a property filter

This example gets all observations for the populaton of the U.S., and uses a property filter to limit the results to datasets that use an observation period of `P1Y`.

Request:
{: .example-box-title}

```python
client.observations_dataframe(variable_dcids=["Count_Person"], date="all", entity_dcids=["country/USA"], property_filters={"observationPeriod": ["P1Y"]})
```
{: .example-box-content .scroll}

Response:
{: .example-box-title}

(truncated)

```python
     date       entity               entity_name      variable  ...       measurementMethod  observationPeriod                                      provenanceUrl  unit
0    1900  country/USA  United States of America  Count_Person  ...         CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
1    1901  country/USA  United States of America  Count_Person  ...         CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
2    1902  country/USA  United States of America  Count_Person  ...         CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
3    1903  country/USA  United States of America  Count_Person  ...         CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
4    1904  country/USA  United States of America  Count_Person  ...         CensusPEPSurvey                P1Y  https://www2.census.gov/programs-surveys/popes...  None
..    ...          ...                       ...           ...  ...                     ...                ...                                                ...   ...
252  2019  country/USA  United States of America  Count_Person  ...  OECDRegionalStatistics                P1Y  https://data-explorer.oecd.org/vis?fs[0]=Topic...  None
253  2020  country/USA  United States of America  Count_Person  ...  OECDRegionalStatistics                P1Y  https://data-explorer.oecd.org/vis?fs[0]=Topic...  None
254  2021  country/USA  United States of America  Count_Person  ...  OECDRegionalStatistics                P1Y  https://data-explorer.oecd.org/vis?fs[0]=Topic...  None
255  2022  country/USA  United States of America  Count_Person  ...  OECDRegionalStatistics                P1Y  https://data-explorer.oecd.org/vis?fs[0]=Topic...  None
256  2023  country/USA  United States of America  Count_Person  ...  OECDRegionalStatistics                P1Y  https://data-explorer.oecd.org/vis?fs[0]=Topic...  None

[257 rows x 12 columns]
```
{: .example-box-content .scroll}
