---
layout: default
title: Migrate to Python API V2
nav_order: 7
parent: Python (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Migrate from API V1 to V2

The Data Commons [Python API V2](index.md) is significantly different from V1. This document summarizes the important differences that you should be aware of and provides examples of translating queries from V1 to V2.

* TOC
{:toc}

## Summary of changes 

| Feature | V1 | V2 |
|---------|----|----|
| API key | Not required | Required; get from <https://apikeys.datacommons.com> |
| Custom Data Commons supported | No | Yes: see details in [Create a client](index.md#create-a-client) |
| Pandas support | Separate package | Module in the same package : see details in [Install](index.md#install) |
| Base URL | https://api.datacommons.org/v1/ | https://api.datacommons.org/v2/ |
| Sessions | Managed by the `datacommons` package object | Managed by a `datacommons_client` object: see details in [Create a client](index.md#create-a-client) |
| Classes/methods | 7 methods, members of `datacommons` class | 3 classes representing REST endpoints `node`, `observation` and `resolve`; several member functions for each endpoint class. Variations of methods in V1 are represented as function parameters in V2. See [Request endpoints and responses](index.md#request-endpoints-and-responses) |
| Pandas classes/methods | 3 methods, all members of `datacommons_pandas` class | 1 method, member of `datacommons_client` class. Variations of the Pandas methods in V1 are represented as parameters in V2. See [Observations DataFrame](pandas.md) |
| Pagination | Required for queries resulting in large data volumes | Optional: see [Pagination](node.md#pagination)  |
| DCID lookup method | No | Yes: [`resolve`](resolve.md) endpoint methods |
| Statistics | With the `get_stat_value` and `get_stat_series` methods, Data Commons chooses the most "relevant" data source to answer the query; typically this is based on the data source providing the most recent data | Data from all available data sources is returned by default for all observation endpoint methods (if you don't apply a filter); for details, see [Observation response](/observation.html#response) |


## V1 function equivalences in V2

This section shows you how to translate from a given V1 function to the equivalent code in V2. Examples of both are given in the following section.

| `datacommmons` V1 function |  V2 equivalent |
|-------------|------------------|
| `get_triples` | No direct equivalent; triples are not returned. Instead you indicate the directionality of the relationship in the triple, i.e. incoming or outgoing edges, using `node.fetch` and a relation expression |
| `get_places_in` | `node.fetch_place_descendants` |
| `get_stat_value` | `observation.fetch_observations_by_entity_dcid` with a single place and variable, and the `date` parameter set to a specific date |
| `get_stat_series` | `observation.fetch_observations_by_entity_id` with a single place and variable, and the `date` parameter set to `all` |
| `get_stat_all` | `observation.fetch_observations_by_entity_id` with an array of places and/or variables and `date` parameter set to `all`  |
| `get_property_labels` |  `node.fetch_property_labels` |
| `get_property_values` | `node.fetch_property_values` |

| `datacommons_pandas` V1 function | V2 equivalent |
|----------------------------------|------------------|
| `build_time_series` | `observations_dataframe` with a single place and variable and the `date` parameter set to `all` |
| `build_time_series_dataframe` | `observations_dataframe` with an array of places, a single variable and the `date` parameter set to `all` |
| `build_multivariate_dataframe` | `observations_dataframe` with an array of places and/or variables and the `date` parameter set to `latest` |

## Examples

The following examples show equivalent API queries and responses using V1 and V2.

### Example 1: Get triples associated with a single place

This example retrieves triples associated with zip code 94043. In V2, this is expressed as "incoming relationships".

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_triples(['zip/94043'])
```
{% endtab %}

{% tab request V2 request %}

```python
client.node.fetch(node_dcids=["zip/94043"], expression="<-*")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```jsonc
{{'zip/94043': [('zip/94043', 'containedInPlace', 'country/USA'),
  ('zip/94043', 'containedInPlace', 'geoId/06085'),
  ('zip/94043', 'containedInPlace', 'geoId/0608592830'),
  ('zip/94043', 'containedInPlace', 'geoId/0616'),
  ('zip/94043', 'geoId', 'zip/94043'),
  //...
}}
```
{% endtab %}

{% tab response V2 response %}

```jsonc

{'data': {'zip/94043': {'arcs': {'locatedIn': {'nodes': [{'dcid': 'EpaParentCompany/AlphabetInc',
      'name': 'AlphabetInc',
      'provenanceId': 'dc/base/EPA_ParentCompanies',
      'types': ['EpaParentCompany']},
      {'dcid': 'EpaParentCompany/Google',
      'name': 'Google',
      'provenanceId': 'dc/base/EPA_ParentCompanies',
      'types': ['EpaParentCompany']}]},
   'containedInPlace': {'nodes': [{'dcid': 'epaGhgrpFacilityId/1005910',
       'name': 'City Of Mountain View (Shoreline Landfill)',
       'provenanceId': 'dc/base/EPA_GHGRPFacilities',
       'types': ['EpaReportingFacility']},
      {'dcid': 'epaSuperfundSiteId/CA2170090078',
       'name': 'Moffett Naval Air Station',
       'provenanceId': 'dc/base/EPA_Superfund_Sites',
       'types': ['SuperfundSite']},
      {'dcid': 'epaSuperfundSiteId/CAD009111444',
       'name': 'Teledyne Semiconductor',
       'provenanceId': 'dc/base/EPA_Superfund_Sites',
       'types': ['SuperfundSite']},
      {'dcid': 'epaSuperfundSiteId/CAD009138488',
       'name': 'Spectra-Physics Inc.',
       'provenanceId': 'dc/base/EPA_Superfund_Sites',
       'types': ['SuperfundSite']},
      //...
      }
   }
}
```

{% endtab %}

{% endtabs %}

</div>

### Example 2: Get a list of places in another place

This example retrieves a list of counties in the U.S. state of Delaware.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_places_in(["geoId/10"], "County")
```

{% endtab %}

{% tab request V2 request %}

```python
client.node.fetch_place_children(place_dcids="geoId/10", children_type="County")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{'geoId/10': ['geoId/10001', 'geoId/10003', 'geoId/10005']}
```
{% endtab %}

{% tab response V2 response %}

```json
{'geoId/10': [{'dcid': 'geoId/10001', 'name': 'Kent County'},
  {'dcid': 'geoId/10003', 'name': 'New Castle County'},
  {'dcid': 'geoId/10005', 'name': 'Sussex County'}]}
```

{% endtab %}

{% endtabs %}

</div>

### Example 3: Get a list of places in multiple other places

This example retrieves a list of congressional districts in the U.S. states of Alaska and Hawaii.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_places_in(["geoId/15","geoId/02"], "CongressionalDistrict")
```

{% endtab %}

{% tab request V2 request %}

```python
client.node.fetch_place_children(place_dcids=["geoId/15","geoId/02"], children_type="CongressionalDistrict")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{{'geoId/15': ['geoId/1501', 'geoId/1502'], 'geoId/02': ['geoId/0200']}
```
{% endtab %}

{% tab response V2 response %}

```json
{'geoId/15': [{'dcid': 'geoId/1501',
   'name': 'Congressional District 1 (113th Congress), Hawaii'},
  {'dcid': 'geoId/1502',
   'name': 'Congressional District 2 (113th Congress), Hawaii'}],
 'geoId/02': [{'dcid': 'geoId/0200',
   'name': 'Congressional District (at Large) (113th Congress), Alaska'}]}
```

{% endtab %}

{% endtabs %}

</div>

### Example 4: Get the latest value of a single statistical variable for a single place

This example gets the latest count of men in the state of California.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_stat_value("geoId/05", "Count_Person_Male")
```
{% endtab %}

{% tab request V2 request %}

```python
client.observation.fetch_observations_by_entity_dcid(date="latest", entity_dcids="geoId/05", variable_dcids="Count_Person_Male")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
1524533
```
{% endtab %}

{% tab response V2 response %}

```json
{'byVariable': {'Count_Person_Male': {'byEntity': {'geoId/05': {'orderedFacets': [{'earliestDate': '2023',
       'facetId': '1145703171',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '2024',
       'facetId': '3999249536',
       'latestDate': '2024',
       'obsCount': 1,
       'observations': [{'date': '2024', 'value': 1524533.0}]},
      {'earliestDate': '2023',
       'facetId': '1964317807',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '2023',
       'facetId': '10983471',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495096.943}]},
      {'earliestDate': '2023',
       'facetId': '196790193',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495096.943}]},
      {'earliestDate': '2021',
       'facetId': '4181918134',
       'latestDate': '2021',
       'obsCount': 1,
       'observations': [{'date': '2021', 'value': 1493178.0}]},
      {'earliestDate': '2020',
       'facetId': '2825511676',
       'latestDate': '2020',
       'obsCount': 1,
       'observations': [{'date': '2020', 'value': 1486856.0}]},
      {'earliestDate': '2019',
       'facetId': '1226172227',
       'latestDate': '2019',
       'obsCount': 1,
       'observations': [{'date': '2019', 'value': 1474705.0}]}]}}}},
 'facets': {'2825511676': {'importName': 'CDC_Mortality_UnderlyingCause',
   'provenanceUrl': 'https://wonder.cdc.gov/ucd-icd10.html'},
  '1226172227': {'importName': 'CensusACS1YearSurvey',
   'measurementMethod': 'CensusACS1yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
  '1145703171': {'importName': 'CensusACS5YearSurvey',
   'measurementMethod': 'CensusACS5yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
  '3999249536': {'importName': 'USCensusPEP_Sex',
   'measurementMethod': 'CensusPEPSurvey_PartialAggregate',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
  '1964317807': {'importName': 'CensusACS5YearSurvey_SubjectTables_S0101',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101'},
  '10983471': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2601A',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A'},
  '196790193': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2602',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602'},
  '4181918134': {'importName': 'OECDRegionalDemography_Population',
   'measurementMethod': 'OECDRegionalStatistics',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C'}}}
```
{% endtab %}

{% endtabs %}

</div>

### Example 5: Get the latest value of a single statistical variable for a single place, selecting the facet to return



<div>

{% tabs request %}

{% tab request V1 request %}

```python

```
{% endtab %}

{% tab request V2 request %}

```python

```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json

```
{% endtab %}

{% tab response V2 response %}

```json

```
{% endtab %}

{% endtabs %}


### Example 6: Get all values of a single statistical variable for a single place

This example retrieve the count of men in the state of California for all years available.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_stat_series("geoId/05", "Count_Person_Male")
```
{% endtab %}

{% tab request V2 request %}

```python
client.observation.fetch_observations_by_entity_dcid(date="all", entity_dcids="geoId/05", variable_dcids="Count_Person_Male")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{'2023': 1495958,
 '2017': 1461651,
 '2022': 1491622,
 '2015': 1451913,
 '2021': 1483520,
 '2018': 1468412,
 '2011': 1421287,
 '2016': 1456694,
 '2012': 1431252,
 '2019': 1471760,
 '2013': 1439862,
 '2014': 1447235,
 '2020': 1478511}
```
{% endtab %}

{% tab response V2 response %}

```json
{'byVariable': {'Count_Person_Male': {'byEntity': {'geoId/05': {'orderedFacets': [{'earliestDate': '2023',
       'facetId': '1145703171',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '2024',
       'facetId': '3999249536',
       'latestDate': '2024',
       'obsCount': 1,
       'observations': [{'date': '2024', 'value': 1524533.0}]},
      {'earliestDate': '2023',
       'facetId': '1964317807',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '2023',
       'facetId': '10983471',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495096.943}]},
      {'earliestDate': '2023',
       'facetId': '196790193',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495096.943}]},
      {'earliestDate': '2021',
       'facetId': '4181918134',
       'latestDate': '2021',
       'obsCount': 1,
       'observations': [{'date': '2021', 'value': 1493178.0}]},
      {'earliestDate': '2020',
       'facetId': '2825511676',
       'latestDate': '2020',
       'obsCount': 1,
       'observations': [{'date': '2020', 'value': 1486856.0}]},
      {'earliestDate': '2019',
       'facetId': '1226172227',
       'latestDate': '2019',
       'obsCount': 1,
       'observations': [{'date': '2019', 'value': 1474705.0}]}]}}}},
 'facets': {'10983471': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2601A',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A'},
  '196790193': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2602',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602'},
  '4181918134': {'importName': 'OECDRegionalDemography_Population',
   'measurementMethod': 'OECDRegionalStatistics',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C'},
  '2825511676': {'importName': 'CDC_Mortality_UnderlyingCause',
   'provenanceUrl': 'https://wonder.cdc.gov/ucd-icd10.html'},
  '1226172227': {'importName': 'CensusACS1YearSurvey',
   'measurementMethod': 'CensusACS1yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
  '1145703171': {'importName': 'CensusACS5YearSurvey',
   'measurementMethod': 'CensusACS5yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
  '3999249536': {'importName': 'USCensusPEP_Sex',
   'measurementMethod': 'CensusPEPSurvey_PartialAggregate',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
  '1964317807': {'importName': 'CensusACS5YearSurvey_SubjectTables_S0101',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101'}}}
```
{% endtab %}

{% endtabs %}

</div>

### Example 7: Get all values of a multiple statistical variables for a single place

This example retrieves the total population as well as the male population of the state of Arkansas for all available years.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_stat_all(["geoId/05"], ["Count_Person", "Count_Person_Male"])
```
{% endtab %}

{% tab request V2 request %}

```python
client.observation.fetch_observations_by_entity_dcid(date="all", entity_dcids="geoId/05", variable_dcids="Count_Person_Male")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{'geoId/05': {'Count_Person': {'sourceSeries': [{'val': {'1961': 1806000,
      '1902': 1360000,
      '1978': 2243127,
      '2010': 2921998,
      '2006': 2821761,
      '1988': 2342656,
      '2021': 3025891,
      '1987': 2342355,
      '1926': 1826000,
      '1992': 2394098,
      '1904': 1419000,
      '2018': 3012161,
      '1990': 2354343,
      '2012': 2952876,
      '1995': 2480121,
      '1950': 1908000,
      '1972': 2018638,
      '1932': 1836000,
      '1948': 1825000,
      '1973': 2059256,
      '2013': 2960459,
      '1989': 2346358,
      '1977': 2209010,
      '1931': 1848000,
      '1918': 1749000,
      '1968': 1902000,
      '1975': 2159526,
      '2001': 2691571,
      '2014': 2968759,
      '1921': 1769000,
      '1909': 1545000,
      '2016': 2991815,
      '1905': 1447000,
      '2002': 2705927,
      '2022': 3047704,
      '1981': 2293201,
      '1999': 2551373,
      '2003': 2724816,
      '1908': 1513000,
      '1933': 1854000,
      '1928': 1847000,
      '1997': 2524007,
      '1955': 1725000,
      '1994': 2450605,
      '2019': 3020985,
      '1954': 1734000,
      '1949': 1844000,
      '1970': 1923322,
      '1934': 1878000,
      '1985': 2327046,
      '1929': 1852000,
      '1922': 1772000,
      '1911': 1610000,
      '1974': 2101403,
      '1914': 1688000,
      '1916': 1719000,
      '1942': 1977000,
      '1953': 1780000,
      '1917': 1737000,
      '1996': 2504858,
      '1945': 1762000,
      '1952': 1838000,
      '2008': 2874554,
      '1903': 1384000,
      '1980': 2286435,
      '1959': 1756000,
      '1900': 1314000,
      '1907': 1484000,
      '2011': 2941038,
      '1944': 1768000,
      '2024': 3088354,
      '2004': 2749686,
      '2000': 2678588,
      '1936': 1892000,
      '1965': 1894000,
      '1924': 1800000,
      '1967': 1901000,
      '1998': 2538202,
      '2023': 3069463,
      '2015': 2979732,
      '2005': 2781097,
      '1951': 1901000,
      '1963': 1875000,
      '1946': 1797000,
      '1941': 1969000,
      '1930': 1859000,
      '1940': 1955000,
      '1910': 1583000,
      '1966': 1899000,
      '1993': 2423743,
      '1979': 2271333,
      '1983': 2305761,
      '1943': 1843000,
      '1976': 2170161,
      '1982': 2294257,
      '1920': 1756000,
      '1925': 1812000,
      '1927': 1840000,
      '1947': 1836000,
      '2009': 2896843,
      '1937': 1903000,
      '1919': 1742000,
      '1957': 1733000,
      '1938': 1928000,
      '1913': 1664000,
      '1915': 1702000,
      '2020': 3030522,
      '1958': 1726000,
      '2017': 3003855,
      '1984': 2319768,
      '1912': 1636000,
      '1923': 1784000,
      '1956': 1704000,
      '1971': 1972312,
      '1939': 1948000,
      '2007': 2848650,
      '1986': 2331984,
      '1962': 1853000,
      '1969': 1913000,
      '1935': 1890000,
      '1906': 1465000,
      '1991': 2370666,
      '1901': 1341000,
      '1964': 1897000,
      '1960': 1789000},
     'measurementMethod': 'CensusPEPSurvey',
     'observationPeriod': 'P1Y',
     'importName': 'USCensusPEP_Annual_Population',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
    {'val': {'2013': 2933369,
      '2017': 2977944,
      '2021': 3006309,
      '2011': 2895928,
      '2016': 2968472,
      '2014': 2947036,
      '2012': 2916372,
      '2022': 3018669,
      '2018': 2990671,
      '2020': 3011873,
      '2023': 3032651,
      '2019': 2999370,
      '2015': 2958208},
     'measurementMethod': 'CensusACS5yrSurvey',
     'importName': 'CensusACS5YearSurvey',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
    {'val': {'2000': 2673400, '2020': 3011524, '2010': 2915918},
     'measurementMethod': 'USDecennialCensus',
     'importName': 'USDecennialCensus_RedistrictingRelease',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html'},
    {'val': {'2019': 3017804,
      '2016': 2989918,
      '2010': 2921964,
      '1995': 2535399,
      '2001': 2691571,
      '2003': 2724816,
      '2014': 2967392,
      '2004': 2749686,
      '1996': 2572109,
      '1994': 2494019,
      '2018': 3009733,
      '2006': 2821761,
      '2002': 2705927,
      '1999': 2651860,
      '1993': 2456303,
      '2007': 2848650,
      '2017': 3001345,
      '2020': 3014348,
      '2009': 2896843,
      '2022': 3046404,
      '2005': 2781097,
      '1998': 2626289,
      '1997': 2601090,
      '2011': 2940667,
      '1992': 2415984,
      '2021': 3028443,
      '1991': 2383144,
      '2023': 3067732,
      '2008': 2874554,
      '2015': 2978048,
      '2000': 2678588,
      '1990': 2356586,
      '2013': 2959400,
      '2012': 2952164},
     'measurementMethod': 'OECDRegionalStatistics',
     'observationPeriod': 'P1Y',
     'importName': 'OECDRegionalDemography_Population',
     'provenanceDomain': 'oecd.org',
     'provenanceUrl': 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C'},
    {'val': {'2011': 2895928,
      '2022': 3018669,
      '2015': 2958208,
      '2013': 2933369,
      '2010': 2872684,
      '2018': 2990671,
      '2023': 3032651,
      '2019': 2999370,
      '2021': 3006309,
      '2020': 3011873,
      '2016': 2968472,
      '2014': 2947036,
      '2017': 2977944,
      '2012': 2916372},
     'measurementMethod': 'CensusACS5yrSurveySubjectTable',
     'importName': 'CensusACS5YearSurvey_SubjectTables_S0101',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101'},
    {'val': {'2015': 2958208,
      '2012': 2916372,
      '2020': 3011873,
      '2021': 3006309,
      '2023': 3032651,
      '2022': 3018669,
      '2014': 2947036,
      '2016': 2968472,
      '2010': 2872684,
      '2018': 2990671,
      '2017': 2977944,
      '2019': 2999370,
      '2011': 2895928,
      '2013': 2933369},
     'measurementMethod': 'CensusACS5yrSurveySubjectTable',
     'importName': 'CensusACS5YearSurvey_SubjectTables_S2601A',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A'},
    {'val': {'2018': 2990671,
      '2021': 3006309,
      '2022': 3018669,
      '2023': 3032651,
      '2020': 3011873,
      '2017': 2977944,
      '2019': 2999370},
     'measurementMethod': 'CensusACS5yrSurveySubjectTable',
     'importName': 'CensusACS5YearSurvey_SubjectTables_S2602',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602'},
    {'val': {'2016': 2988248,
      '1999': 2651860,
      '2020': 3030522,
      '2006': 2821761,
      '2008': 2874554,
      '2009': 2896843,
      '2004': 2749686,
      '2014': 2966369,
      '2013': 2959373,
      '2007': 2848650,
      '2000': 2673400,
      '2002': 2705927,
      '2015': 2978204,
      '2010': 2915918,
      '2019': 3017804,
      '2012': 2949131,
      '2001': 2691571,
      '2017': 3004279,
      '2018': 3013825,
      '2011': 2937979,
      '2003': 2724816,
      '2005': 2781097},
     'importName': 'CDC_Mortality_UnderlyingCause',
     'provenanceDomain': 'cdc.gov',
     'provenanceUrl': 'https://wonder.cdc.gov/ucd-icd10.html'},
    {'val': {'1991': 2370666,
      '1976': 2170161,
      '1983': 2319774,
      '1904': 1419000,
      '1942': 1977000,
      '1906': 1465000,
      '1998': 2538202,
      '1959': 1756000,
      '1915': 1702000,
      '1908': 1513000,
      '1967': 1901000,
      '1920': 1756000,
      '1971': 1972312,
      '1944': 1768000,
      '1922': 1772000,
      '1954': 1734000,
      '1935': 1890000,
      '1928': 1847000,
      '1987': 2342638,
      '2007': 2841595,
      '1984': 2327044,
      '1968': 1902000,
      '1953': 1780000,
      '1996': 2504858,
      '2009': 2887331,
      '1931': 1848000,
      '1943': 1843000,
      '1937': 1903000,
      '1941': 1969000,
      '1997': 2524007,
      '1940': 1955000,
      '1918': 1749000,
      '1917': 1737000,
      '1979': 2271333,
      '2018': 3009733,
      '1980': 2293195,
      '1962': 1853000,
      '1929': 1852000,
      '2000': 2576476,
      '1914': 1688000,
      '1934': 1878000,
      '1932': 1836000,
      '1973': 2059256,
      '1964': 1897000,
      '1961': 1806000,
      '1995': 2480121,
      '1974': 2101403,
      '1923': 1784000,
      '1950': 1908000,
      '2011': 2940667,
      '1913': 1664000,
      '1952': 1838000,
      '1990': 2354343,
      '1956': 1704000,
      '1910': 1583000,
      '1957': 1733000,
      '1978': 2243127,
      '1972': 2018638,
      '1975': 2159526,
      '1945': 1762000,
      '1911': 1610000,
      '1924': 1800000,
      '2002': 2704471,
      '1955': 1725000,
      '2010': 2910236,
      '1963': 1875000,
      '1938': 1928000,
      '1912': 1636000,
      '1902': 1360000,
      '2015': 2978048,
      '1927': 1840000,
      '2008': 2867099,
      '1985': 2331990,
      '2001': 2690743,
      '2017': 3001345,
      '1969': 1913000,
      '2003': 2722804,
      '1921': 1769000,
      '1901': 1341000,
      '1925': 1812000,
      '1986': 2342359,
      '2019': 3017804,
      '1977': 2209010,
      '1951': 1901000,
      '1981': 2294262,
      '1989': 2350725,
      '1970': 1923322,
      '1965': 1894000,
      '1930': 1859000,
      '1982': 2305754,
      '1936': 1892000,
      '2006': 2814910,
      '1992': 2394098,
      '1994': 2450605,
      '2016': 2989918,
      '1905': 1447000,
      '1966': 1899000,
      '2013': 2959400,
      '1939': 1948000,
      '1933': 1854000,
      '1903': 1384000,
      '1993': 2423743,
      '1900': 1314000,
      '1960': 1789000,
      '1907': 1484000,
      '2014': 2967392,
      '1999': 2551373,
      '2004': 2746215,
      '1909': 1545000,
      '2012': 2952164,
      '2005': 2776257,
      '1988': 2346387,
      '1919': 1742000,
      '1926': 1826000,
      '1958': 1726000,
      '1916': 1719000},
     'measurementMethod': 'CensusPEPSurvey',
     'importName': 'CensusPEP',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
    {'val': {'2011': 2937979,
      '2019': 3017804,
      '2012': 2949131,
      '2015': 2978204,
      '2010': 2921606,
      '2016': 2988248,
      '2017': 3004279,
      '2014': 2966369,
      '2013': 2959373,
      '2018': 3013825},
     'measurementMethod': 'CensusACS1yrSurvey',
     'importName': 'CensusACS1YearSurvey',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
    {'val': {'1910': 1574449,
      '1940': 1949387,
      '1920': 1752204,
      '2000': 2673400,
      '1970': 1923295,
      '1960': 1786272,
      '1950': 1909511,
      '2015': 2978204,
      '2010-04-01': 2915918,
      '1990': 2350725,
      '1980': 2286435,
      '2020-04-01': 3011524,
      '1930': 1854482},
     'measurementMethod': 'WikidataPopulation',
     'importName': 'WikidataPopulation',
     'provenanceDomain': 'wikimediafoundation.org',
     'provenanceUrl': 'https://www.wikidata.org/wiki/Wikidata:Main_Page'}]},
  'Count_Person_Male': {'sourceSeries': [{'val': {'2017': 1461651,
      '2022': 1491622,
      '2019': 1471760,
      '2018': 1468412,
      '2020': 1478511,
      '2023': 1495958,
      '2011': 1421287,
      '2016': 1456694,
      '2012': 1431252,
      '2015': 1451913,
      '2021': 1483520,
      '2013': 1439862,
      '2014': 1447235},
     'measurementMethod': 'CensusACS5yrSurvey',
     'importName': 'CensusACS5YearSurvey',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
    {'val': {'1972': 979822,
      '1983': 1112460,
      '1976': 1051166,
      '2008': 1410334,
      '2004': 1346638,
      '1978': 1084374,
      '1975': 1047112,
      '1982': 1107142,
      '2019': 1482909,
      '1984': 1119061,
      '1995': 1228626,
      '2018': 1479090,
      '1991': 1150369,
      '2003': 1333293,
      '1988': 1129014,
      '2015': 1463916,
      '1980': 1105739,
      '2007': 1397292,
      '1974': 1019259,
      '2021': 1495032,
      '2005': 1362802,
      '1997': 1263936,
      '1973': 999264,
      '2014': 1457950,
      '1989': 1130916,
      '2006': 1383333,
      '1981': 1107249,
      '1994': 1207014,
      '2009': 1421830,
      '2020': 1488756,
      '1986': 1124357,
      '1998': 1277869,
      '1979': 1097123,
      '2012': 1450467,
      '2011': 1444411,
      '2016': 1469966,
      '2023': 1513837,
      '2001': 1314726,
      '2002': 1322688,
      '1990': 1136163,
      '1987': 1129353,
      '2024': 1524533,
      '1977': 1069003,
      '1985': 1122425,
      '2022': 1503494,
      '2017': 1475907,
      '1992': 1167203,
      '1993': 1187503,
      '1970': 937034,
      '1971': 956802,
      '2000': 1307573,
      '2010': 1434725,
      '1996': 1248406,
      '1999': 1292415,
      '2013': 1453888},
     'measurementMethod': 'CensusPEPSurvey_PartialAggregate',
     'observationPeriod': 'P1Y',
     'importName': 'USCensusPEP_Sex',
     'provenanceDomain': 'census.gov',
     'isDcAggregate': True,
     'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
    {'val': {'2019': 1471760,
      '2013': 1439862,
      '2017': 1461651,
      '2016': 1456694,
      '2012': 1431252,
      '2022': 1491622,
      '2020': 1478511,
      '2018': 1468412,
      '2014': 1447235,
      '2023': 1495958,
      '2015': 1451913,
      '2010': 1408945,
      '2011': 1421287,
      '2021': 1483520},
     'measurementMethod': 'CensusACS5yrSurveySubjectTable',
     'importName': 'CensusACS5YearSurvey_SubjectTables_S0101',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101'},
    {'val': {'2010': 1407615.16,
      '2023': 1495096.943,
      '2014': 1446994.676,
      '2018': 1468419.461,
      '2022': 1491222.486,
      '2020': 1478829.643,
      '2017': 1462170.504,
      '2019': 1472690.67,
      '2012': 1431938.652,
      '2013': 1440284.179,
      '2011': 1421900.648,
      '2021': 1482110.337,
      '2016': 1457519.752,
      '2015': 1452480.128},
     'measurementMethod': 'CensusACS5yrSurveySubjectTable',
     'importName': 'CensusACS5YearSurvey_SubjectTables_S2601A',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A'},
    {'val': {'2017': 1462170.504,
      '2022': 1491222.486,
      '2019': 1472690.67,
      '2023': 1495096.943,
      '2018': 1468419.461,
      '2021': 1482110.337,
      '2020': 1478829.643},
     'measurementMethod': 'CensusACS5yrSurveySubjectTable',
     'importName': 'CensusACS5YearSurvey_SubjectTables_S2602',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602'},
    {'val': {'2007': 1398338,
      '2005': 1362878,
      '1993': 1187503,
      '2002': 1323841,
      '2017': 1475417,
      '2020': 1486839,
      '2013': 1453470,
      '1997': 1263936,
      '2000': 1307629,
      '2009': 1422521,
      '1999': 1292415,
      '2021': 1493178,
      '2008': 1410042,
      '2018': 1480143,
      '2003': 1332910,
      '2010': 1434720,
      '2012': 1450131,
      '1990': 1136163,
      '2019': 1471760,
      '1996': 1248406,
      '2011': 1444156,
      '1991': 1150369,
      '1998': 1277869,
      '1992': 1167203,
      '1994': 1207014,
      '2001': 1315211,
      '2016': 1469237,
      '1995': 1228626,
      '2006': 1383070,
      '2004': 1346274,
      '2015': 1463307,
      '2014': 1457487},
     'measurementMethod': 'OECDRegionalStatistics',
     'observationPeriod': 'P1Y',
     'importName': 'OECDRegionalDemography_Population',
     'provenanceDomain': 'oecd.org',
     'provenanceUrl': 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C'},
    {'val': {'2014': 1457316,
      '2011': 1442779,
      '2017': 1476064,
      '2002': 1322688,
      '1999': 1292415,
      '2007': 1397292,
      '2016': 1467873,
      '2005': 1362802,
      '2008': 1410334,
      '2003': 1333293,
      '2004': 1346638,
      '2013': 1453591,
      '2015': 1462856,
      '2010': 1431637,
      '2019': 1481616,
      '2001': 1314726,
      '2012': 1448490,
      '2006': 1383333,
      '2018': 1480143,
      '2000': 1304693,
      '2009': 1421830,
      '2020': 1486856},
     'importName': 'CDC_Mortality_UnderlyingCause',
     'provenanceDomain': 'cdc.gov',
     'provenanceUrl': 'https://wonder.cdc.gov/ucd-icd10.html'},
    {'val': {'2018': 1476680,
      '2012': 1449265,
      '2015': 1463576,
      '2017': 1479682,
      '2019': 1474705,
      '2014': 1456778,
      '2010': 1430837,
      '2016': 1468782,
      '2013': 1461544,
      '2011': 1447850},
     'measurementMethod': 'CensusACS1yrSurvey',
     'importName': 'CensusACS1YearSurvey',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'}]}}}

```
{% endtab %}

{% tab response V2 response %}

```json
{'byVariable': {'Count_Person_Male': {'byEntity': {'geoId/05': {'orderedFacets': [{'earliestDate': '2023',
       'facetId': '1145703171',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '2024',
       'facetId': '3999249536',
       'latestDate': '2024',
       'obsCount': 1,
       'observations': [{'date': '2024', 'value': 1524533.0}]},
      {'earliestDate': '2023',
       'facetId': '1964317807',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '2023',
       'facetId': '10983471',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495096.943}]},
      {'earliestDate': '2023',
       'facetId': '196790193',
       'latestDate': '2023',
       'obsCount': 1,
       'observations': [{'date': '2023', 'value': 1495096.943}]},
      {'earliestDate': '2021',
       'facetId': '4181918134',
       'latestDate': '2021',
       'obsCount': 1,
       'observations': [{'date': '2021', 'value': 1493178.0}]},
      {'earliestDate': '2020',
       'facetId': '2825511676',
       'latestDate': '2020',
       'obsCount': 1,
       'observations': [{'date': '2020', 'value': 1486856.0}]},
      {'earliestDate': '2019',
       'facetId': '1226172227',
       'latestDate': '2019',
       'obsCount': 1,
       'observations': [{'date': '2019', 'value': 1474705.0}]}]}}}},
 'facets': {'10983471': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2601A',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A'},
  '196790193': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2602',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602'},
  '4181918134': {'importName': 'OECDRegionalDemography_Population',
   'measurementMethod': 'OECDRegionalStatistics',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C'},
  '2825511676': {'importName': 'CDC_Mortality_UnderlyingCause',
   'provenanceUrl': 'https://wonder.cdc.gov/ucd-icd10.html'},
  '1226172227': {'importName': 'CensusACS1YearSurvey',
   'measurementMethod': 'CensusACS1yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
  '1145703171': {'importName': 'CensusACS5YearSurvey',
   'measurementMethod': 'CensusACS5yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
  '3999249536': {'importName': 'USCensusPEP_Sex',
   'measurementMethod': 'CensusPEPSurvey_PartialAggregate',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
  '1964317807': {'importName': 'CensusACS5YearSurvey_SubjectTables_S0101',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101'}}}
```
{% endtab %}

{% endtabs %}

</div>

### Example 1: Get information on a single place

Get basic information about New York City (DCID: `geoId/3651000`). In this example, the `property_value` method is replaced by the `node.fetch_entity` endpoint. In V2 all properties are considered "outgoing" nodes of a given node; the direction is indicated by an arrow symbol (`->`). Multiple properties are specified in the `node` endpoint using a bracketed array.

The V2 query does not exactly match the V1 query, and this is reflected in the different response fields.

<div>

{% tabs request %}

{% tab request V1 request %}

```python

```
{% endtab %}

{% tab request V2 request %}

```python

```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```

```
{% endtab %}

{% tab response V2 response %}

```json

```
{% endtab %}

{% endtabs %}

</div>

### Example 4: Get variables for an entity

Get all the statistical variables associated with the city of Hagåtña, the capital of Guam. (DCID: `wikidataId/Q30988`). In this example the `variables` endpoint is replaced by the `observation` endpoint, with a `select=entity` and `select=variable` indicating that no observations need to be returned.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/variables/wikidataId/Q30988'
```
{% endtab %}

{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&entity.dcids=wikidataId/Q30988&select=entity&select=variable'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
  "entity": "wikidataId/Q30988",
  "variables": [
    "Count_Person",
    "Max_Rainfall",
    "Max_Snowfall",
    "Max_Temperature",
    "Mean_BarometricPressure",
    "Mean_Rainfall",
    "Mean_Snowfall",
    "Mean_Temperature",
    "Mean_Visibility",
    "Min_Rainfall",
    "Min_Snowfall",
    "Min_Temperature"
  ]
}
```
{% endtab %}

{% tab response V2 response %}

```json
{
   "byVariable" : {
      "Count_Person" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Count_Person_Female" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Count_Person_Male" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Max_Humidity_RelativeHumidity" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Max_Rainfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Max_Snowfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Max_Temperature" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_BarometricPressure" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Humidity_RelativeHumidity" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Rainfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Snowfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Temperature" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Mean_Visibility" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Min_Rainfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Min_Snowfall" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      },
      "Min_Temperature" : {
         "byEntity" : {
            "wikidataId/Q30988" : {}
         }
      }
   }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 5: Get places contained in other places

Get all states in India (DCID: `country/IND`). In this example, the `property/values` endpoint is replaced by the `node` endpoint, and the edge directions `in` and `out` are replaced by the arrow symbols `<-` and `->`.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
  $ curl --request GET --url \
  'https://api.datacommons.org/v1/property/values/in/linked/country/IND/containedInPlace?value_node_type=State&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=country%2FIND&property=%3C-containedInPlace%2B%7BtypeOf%3AState%7D'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```jsonc
{
   "values" : [
      {
         "dcid" : "wikidataId/Q1061",
         "name" : "Gujarat"
      },
      {
         "dcid" : "wikidataId/Q1159",
         "name" : "Andhra Pradesh"
      },
      {
         "dcid" : "wikidataId/Q1162",
         "name" : "Arunachal Pradesh"
      },
      {
         "dcid" : "wikidataId/Q1164",
         "name" : "Assam"
      },
      {
         "dcid" : "wikidataId/Q1165",
         "name" : "Bihar"
      },
      {
         "dcid" : "wikidataId/Q1168",
         "name" : "Chhattisgarh"
      },
      {
         "dcid" : "wikidataId/Q1171",
         "name" : "Goa"
      },
      {
         "dcid" : "wikidataId/Q1174",
         "name" : "Haryana"
      },
      {
         "dcid" : "wikidataId/Q1177",
         "name" : "Himachal Pradesh"
      },
      {
         "dcid" : "wikidataId/Q1184",
         "name" : "Jharkhand"
      },
      {
         "dcid" : "wikidataId/Q1185",
         "name" : "Karnataka"
      },
      {
         "dcid" : "wikidataId/Q1186",
         "name" : "Kerala"
      },
      {
         "dcid" : "wikidataId/Q1188",
         "name" : "Madhya Pradesh"
      },
      {
         "dcid" : "wikidataId/Q1191",
         "name" : "Maharashtra"
      },
      {
         "dcid" : "wikidataId/Q1193",
         "name" : "Manipur"
      },
      {
         "dcid" : "wikidataId/Q1195",
         "name" : "Meghalaya"
      },
      // -- truncated --
      {
         "dcid" : "wikidataId/Q677037",
         "name" : "Telangana"
      }
   ]
}
```
{% endtab %}
{% tab response V2 response %}

```jsonc
{
   "data" : {
      "country/IND" : {
         "arcs" : {
            "containedInPlace+" : {
               "nodes" : [
                  {
                     "dcid" : "wikidataId/Q1061",
                     "name" : "Gujarat"
                  },
                  {
                     "dcid" : "wikidataId/Q1159",
                     "name" : "Andhra Pradesh"
                  },
                  {
                     "dcid" : "wikidataId/Q1162",
                     "name" : "Arunachal Pradesh"
                  },
                  {
                     "dcid" : "wikidataId/Q1164",
                     "name" : "Assam"
                  },
                  {
                     "dcid" : "wikidataId/Q1165",
                     "name" : "Bihar"
                  },
                  {
                     "dcid" : "wikidataId/Q1168",
                     "name" : "Chhattisgarh"
                  },
                  {
                     "dcid" : "wikidataId/Q1171",
                     "name" : "Goa"
                  },
                  {
                     "dcid" : "wikidataId/Q1174",
                     "name" : "Haryana"
                  },
                  {
                     "dcid" : "wikidataId/Q1177",
                     "name" : "Himachal Pradesh"
                  },
                  {
                     "dcid" : "wikidataId/Q1184",
                     "name" : "Jharkhand"
                  },
                  {
                     "dcid" : "wikidataId/Q1185",
                     "name" : "Karnataka"
                  },
                  {
                     "dcid" : "wikidataId/Q1186",
                     "name" : "Kerala"
                  },
                  {
                     "dcid" : "wikidataId/Q1188",
                     "name" : "Madhya Pradesh"
                  },
                  {
                     "dcid" : "wikidataId/Q1191",
                     "name" : "Maharashtra"
                  },
                  {
                     "dcid" : "wikidataId/Q1193",
                     "name" : "Manipur"
                  },
                  {
                     "dcid" : "wikidataId/Q1195",
                     "name" : "Meghalaya"
                  },
                  //-- truncated --
                  {
                     "dcid" : "wikidataId/Q677037",
                     "name" : "Telangana"
                  }
               ]
            }
         }
      }
   }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 6: Get nodes of outgoing edges

Get nodes connected to the node representing Carbon Dioxide (DCID: `CarbonDioxide`), where edges point away from the node for Carbon Dioxide (also known as "properties"). Here the `triples` endpoint is replaced by the `node` endpoint, and the `out` direction is replaced by the arrow symbol (`->`).

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/triples/out/CarbonDioxide?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/node?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&nodes=CarbonDioxide&property=-%3E*'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
   "triples" : {
      "description" : {
         "nodes" : [
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "A colorless gas consisting of a carbon atom covalently double bonded to two oxygen atoms."
            }
         ]
      },
      "descriptionUrl" : {
         "nodes" : [
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "https://en.wikipedia.org/wiki/Carbon_dioxide"
            }
         ]
      },
      "epaPollutantCode" : {
         "nodes" : [
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "CO2"
            }
         ]
      },
      "name" : {
         "nodes" : [
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "Carbon Dioxide (CO2)"
            },
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "Carbon Dioxide"
            },
            {
               "provenanceId" : "dc/base/BaseSchema",
               "value" : "CarbonDioxide"
            }
         ]
      },
      "provenance" : {
         "nodes" : [
            {
               "dcid" : "dc/base/BaseSchema",
               "name" : "BaseSchema",
               "provenanceId" : "dc/base/BaseSchema",
               "types" : [
                  "Provenance"
               ]
            }
         ]
      },
      "typeOf" : {
         "nodes" : [
            {
               "dcid" : "GasType",
               "name" : "GasType",
               "provenanceId" : "dc/base/BaseSchema",
               "types" : [
                  "Class"
               ]
            },
            {
               "dcid" : "GreenhouseGas",
               "name" : "GreenhouseGas",
               "provenanceId" : "dc/base/BaseSchema",
               "types" : [
                  "Class"
               ]
            }
         ]
      }
   }
}
```
{% endtab %}

{% tab response V1 response %}

```json
{
  "data": {
    "CarbonDioxide": {
      "arcs": {
        "description": {
          "nodes": [
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "A colorless gas consisting of a carbon atom covalently double bonded to two oxygen atoms."
            }
          ]
        },
        "descriptionUrl": {
          "nodes": [
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "https://en.wikipedia.org/wiki/Carbon_dioxide"
            }
          ]
        },
        "epaPollutantCode": {
          "nodes": [
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "CO2"
            }
          ]
        },
        "name": {
          "nodes": [
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "Carbon Dioxide (CO2)"
            },
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "Carbon Dioxide"
            },
            {
              "provenanceId": "dc/base/BaseSchema",
              "value": "CarbonDioxide"
            }
          ]
        },
        "provenance": {
          "nodes": [
            {
              "name": "BaseSchema",
              "types": [
                "Provenance"
              ],
              "dcid": "dc/base/BaseSchema",
              "provenanceId": "dc/base/BaseSchema"
            }
          ]
        },
        "typeOf": {
          "nodes": [
            {
              "name": "GasType",
              "types": [
                "Class"
              ],
              "dcid": "GasType",
              "provenanceId": "dc/base/BaseSchema"
            },
            {
              "name": "GreenhouseGas",
              "types": [
                "Class"
              ],
              "dcid": "GreenhouseGas",
              "provenanceId": "dc/base/BaseSchema"
            }
          ]
        }
      }
    }
  }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 7: Get latest observations for a given variable and entity

This example gets the population count (DCID: `Count_Person` ) for the United States of America (DCID: `country/USA` ), with only the latest observation returned for each dataset in which the variable is present

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/observations/point/country/USA/Count_Person?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=LATEST&variable.dcids=Count_Person&entity.dcids=country/USA&select=entity&select=variable&select=value&select=date'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V2 response %}

```json
{
  "date": "2024",
  "value": 340110988,
  "metadata": {
    "importName": "USCensusPEP_Annual_Population",
    "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
    "measurementMethod": "CensusPEPSurvey",
    "observationPeriod": "P1Y"
  }
}
```
{% endtab %}
{% tab response V2 response %}

```json
{
  "byVariable": {
    "Count_Person": {
      "byEntity": {
        "country/USA": {
          "orderedFacets": [
            {
              "facetId": "2176550201",
              "observations": [
                {
                  "date": "2024",
                  "value": 340110988
                }
              ],
              "obsCount": 1,
              "earliestDate": "2024",
              "latestDate": "2024"
            },
            {
              "facetId": "2645850372",
              "observations": [
                {
                  "date": "2023",
                  "value": 335642425
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1145703171",
              "observations": [
                {
                  "date": "2023",
                  "value": 332387540
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1541763368",
              "observations": [
                {
                  "date": "2020",
                  "value": 331449281
                }
              ],
              "obsCount": 1,
              "earliestDate": "2020",
              "latestDate": "2020"
            },
            {
              "facetId": "3981252704",
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1151455814",
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "4181918134",
              "observations": [
                {
                  "date": "2023",
                  "value": 334914895
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "10983471",
              "observations": [
                {
                  "date": "2023",
                  "value": 332387540
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "196790193",
              "observations": [
                {
                  "date": "2023",
                  "value": 332387540
                }
              ],
              "obsCount": 1,
              "earliestDate": "2023",
              "latestDate": "2023"
            },
            {
              "facetId": "1964317807",
              "observations": [
                {
                  "date": "2021",
                  "value": 329725481
                }
              ],
              "obsCount": 1,
              "earliestDate": "2021",
              "latestDate": "2021"
            },
            {
              "facetId": "217147238",
              "observations": [
                {
                  "date": "2021",
                  "value": 329725481
                }
              ],
              "obsCount": 1,
              "earliestDate": "2021",
              "latestDate": "2021"
            },
            {
              "facetId": "2825511676",
              "observations": [
                {
                  "date": "2020",
                  "value": 329484123
                }
              ],
              "obsCount": 1,
              "earliestDate": "2020",
              "latestDate": "2020"
            },
            {
              "facetId": "2517965213",
              "observations": [
                {
                  "date": "2019",
                  "value": 328239523
                }
              ],
              "obsCount": 1,
              "earliestDate": "2019",
              "latestDate": "2019"
            },
            {
              "facetId": "1226172227",
              "observations": [
                {
                  "date": "2019",
                  "value": 328239523
                }
              ],
              "obsCount": 1,
              "earliestDate": "2019",
              "latestDate": "2019"
            }
          ]
        }
      }
    }
  },
  "facets": {
    "1145703171": {
      "importName": "CensusACS5YearSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html",
      "measurementMethod": "CensusACS5yrSurvey"
    },
    "1226172227": {
      "importName": "CensusACS1YearSurvey",
      "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html",
      "measurementMethod": "CensusACS1yrSurvey"
    },
    "1964317807": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S0101",
      "provenanceUrl": "https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "3981252704": {
      "importName": "WorldDevelopmentIndicators",
      "provenanceUrl": "https://datacatalog.worldbank.org/dataset/world-development-indicators/",
      "observationPeriod": "P1Y"
    },
    "2517965213": {
      "importName": "CensusPEP",
      "provenanceUrl": "https://www.census.gov/programs-surveys/popest.html",
      "measurementMethod": "CensusPEPSurvey"
    },
    "2645850372": {
      "importName": "CensusACS5YearSurvey_AggCountry",
      "provenanceUrl": "https://www.census.gov/",
      "measurementMethod": "CensusACS5yrSurvey",
      "isDcAggregate": true
    },
    "2825511676": {
      "importName": "CDC_Mortality_UnderlyingCause",
      "provenanceUrl": "https://wonder.cdc.gov/ucd-icd10.html"
    },
    "10983471": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "2176550201": {
      "importName": "USCensusPEP_Annual_Population",
      "provenanceUrl": "https://www2.census.gov/programs-surveys/popest/tables",
      "measurementMethod": "CensusPEPSurvey",
      "observationPeriod": "P1Y"
    },
    "1151455814": {
      "importName": "OECDRegionalDemography",
      "provenanceUrl": "https://stats.oecd.org/Index.aspx?DataSetCode=REGION_DEMOGR#",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    },
    "1541763368": {
      "importName": "USDecennialCensus_RedistrictingRelease",
      "provenanceUrl": "https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html",
      "measurementMethod": "USDecennialCensus"
    },
    "196790193": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2602",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "217147238": {
      "importName": "CensusACS5YearSurvey_SubjectTables_S2603",
      "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2603&tid=ACSST5Y2019.S2603",
      "measurementMethod": "CensusACS5yrSurveySubjectTable"
    },
    "4181918134": {
      "importName": "OECDRegionalDemography_Population",
      "provenanceUrl": "https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C",
      "measurementMethod": "OECDRegionalStatistics",
      "observationPeriod": "P1Y"
    }
  }
}
```
{% endtab %}

{% endtabs %}

</div>

### Example 8: Get a single observation at a specific date, for a given variable and entity

Get the annual electricity generation (DCID: `Annual_Generation_Electricity` ) of California (DCID: `geoId/06` ) in 2018.

<div>

{% tabs request %}

{% tab request V1 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v1/observations/point/geoId/06/Annual_Generation_Electricity?date=2018&key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI'
```
{% endtab %}
{% tab request V2 GET request %}

```bash
$ curl --request GET --url \
'https://api.datacommons.org/v2/observation?key=AIzaSyCTI4Xz-UW_G2Q2RfknhcfdAnTHq5X5XuI&date=2018&variable.dcids=Annual_Generation_Electricity&entity.dcids=geoId/06&select=entity&select=variable&select=value&select=date'
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{
 {
   "date": "2018",
   "value": 195465638180,
   "facet": {
     "importName": "EIA_Electricity",
     "provenanceUrl": "https://www.eia.gov/opendata/qb.php?category=0",
     "unit": "KilowattHour"
   }
 }
}
```
{% endtab %}

{% tab response V2 response %}

```json
{
   "byVariable" : {
      "Annual_Generation_Electricity" : {
         "byEntity" : {
            "geoId/06" : {
               "orderedFacets" : [
                  {
                     "earliestDate" : "2018",
                     "facetId" : "2392525955",
                     "latestDate" : "2018",
                     "obsCount" : 1,
                     "observations" : [
                        {
                           "date" : "2018",
                           "value" : 195465638180
                        }
                     ]
                  }
               ]
            }
         }
      }
   },
   "facets" : {
      "2392525955" : {
         "importName" : "EIA_Electricity",
         "provenanceUrl" : "https://www.eia.gov/opendata/qb.php?category=0",
         "unit" : "KilowattHour"
      }
   }
}
```
{% endtab %}

{% endtabs %}

</div>