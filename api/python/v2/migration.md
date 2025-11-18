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
(Truncated)
```python
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
(Truncated)
```python
{'data': {'zip/94043': {'arcs': 
   {'locatedIn': {'nodes': [
      {'dcid': 'EpaParentCompany/AlphabetInc',
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

This example gets the latest count of men in the state of California. Note that the V1 method `get_stat_value` returns a single value, automatically selecting the most "relevant" data source, while the V2 method returns all data sources ("facets"), i.e. multiple values for the same variable, as well as metadata for all the sources. Comparing the results, you can see that the V1 method has selected facet 3999249536, which has the most recent date, and comes from the U.S. Census PEP survey.

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
{'byVariable': {'Count_Person_Male': {'byEntity': {'geoId/05': {'orderedFacets': [
      {'earliestDate': '2023',
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

This example retrieve the number of men in the state of California for all years available. As in the previous example, V1 returns data from a single facet, which appears to be 1145703171, the U.S. Census ACS 5-year survey. V2 returns all data for all available facets.

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
(Truncated)
```jsonc
{'byVariable': {'Count_Person_Male': {'byEntity': {'geoId/05': {'orderedFacets': [
      {'earliestDate': '2011',
       'facetId': '1145703171',
       'latestDate': '2023',
       'obsCount': 13,
       'observations': [{'date': '2011', 'value': 1421287.0},
        {'date': '2012', 'value': 1431252.0},
        {'date': '2013', 'value': 1439862.0},
        {'date': '2014', 'value': 1447235.0},
        {'date': '2015', 'value': 1451913.0},
        {'date': '2016', 'value': 1456694.0},
        {'date': '2017', 'value': 1461651.0},
        {'date': '2018', 'value': 1468412.0},
        {'date': '2019', 'value': 1471760.0},
        {'date': '2020', 'value': 1478511.0},
        {'date': '2021', 'value': 1483520.0},
        {'date': '2022', 'value': 1491622.0},
        {'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '1970',
       'facetId': '3999249536',
       'latestDate': '2024',
       'obsCount': 55,
       'observations': [{'date': '1970', 'value': 937034.0},
        {'date': '1971', 'value': 956802.0},
        {'date': '1972', 'value': 979822.0},
        {'date': '1973', 'value': 999264.0},
        {'date': '1974', 'value': 1019259.0},
        {'date': '1975', 'value': 1047112.0},
        {'date': '1976', 'value': 1051166.0},
        {'date': '1977', 'value': 1069003.0},
        {'date': '1978', 'value': 1084374.0},
        {'date': '1979', 'value': 1097123.0},
        {'date': '1980', 'value': 1105739.0},
        {'date': '1981', 'value': 1107249.0},
        {'date': '1982', 'value': 1107142.0},
        {'date': '1983', 'value': 1112460.0},
        {'date': '1984', 'value': 1119061.0},
        {'date': '1985', 'value': 1122425.0},
        {'date': '1986', 'value': 1124357.0},
        {'date': '1987', 'value': 1129353.0},
        {'date': '1988', 'value': 1129014.0},
        {'date': '1989', 'value': 1130916.0},
        {'date': '1990', 'value': 1136163.0},
        //...
 'facets': {'1964317807': {'importName': 'CensusACS5YearSurvey_SubjectTables_S0101',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101'},
  '10983471': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2601A',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A'},
  '196790193': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2602',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602'},
   //...
}}
```
{% endtab %}

{% endtabs %}

</div>

### Example 7: Get all values of a single statistical variables for multiple places

This example retrieves the number of people with doctoral degrees in the states of Minnesota and Wisconsin for all years available. Note that the `get_stat_all` method behaves more like V2 and returns data for all facets (in this case, there is only one), as well as metadata for all facets.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_stat_all(["geoId/27","geoId/55"], ["Count_Person_EducationalAttainmentDoctorateDegree"])
```
{% endtab %}

{% tab request V2 request %}

```python
client.observation.fetch_observations_by_entity_dcid(date="all", variable_dcids="Count_Person_EducationalAttainmentDoctorateDegree", entity_dcids=["geoId/27","geoId/55"])
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```json
{'geoId/27': {'Count_Person_EducationalAttainmentDoctorateDegree': {'sourceSeries': [
   {'val': {'2016': 50039,
      '2017': 52737,
      '2015': 47323,
      '2013': 42511,
      '2012': 40961,
      '2022': 60300,
      '2023': 63794,
      '2014': 44713,
      '2021': 58452,
      '2019': 55185,
      '2020': 56170,
      '2018': 54303},
     'measurementMethod': 'CensusACS5yrSurvey',
     'importName': 'CensusACS5YearSurvey',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'}]}},
 'geoId/55': {'Count_Person_EducationalAttainmentDoctorateDegree': {'sourceSeries': [
   {'val': {'2020': 49385,
      '2017': 43737,
      '2022': 53667,
      '2014': 40133,
      '2021': 52306,
      '2023': 55286,
      '2016': 42590,
      '2012': 38052,
      '2013': 38711,
      '2019': 47496,
      '2018': 46071,
      '2015': 41387},
     'measurementMethod': 'CensusACS5yrSurvey',
     'importName': 'CensusACS5YearSurvey',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'}]}}}
```
{% endtab %}

{% tab response V2 response %}

```json
{'byVariable': {'Count_Person_EducationalAttainmentDoctorateDegree': {'byEntity': {'geoId/55': {'orderedFacets': [{'earliestDate': '2012',
       'facetId': '1145703171',
       'latestDate': '2023',
       'obsCount': 12,
       'observations': [{'date': '2012', 'value': 38052.0},
        {'date': '2013', 'value': 38711.0},
        {'date': '2014', 'value': 40133.0},
        {'date': '2015', 'value': 41387.0},
        {'date': '2016', 'value': 42590.0},
        {'date': '2017', 'value': 43737.0},
        {'date': '2018', 'value': 46071.0},
        {'date': '2019', 'value': 47496.0},
        {'date': '2020', 'value': 49385.0},
        {'date': '2021', 'value': 52306.0},
        {'date': '2022', 'value': 53667.0},
        {'date': '2023', 'value': 55286.0}]}]},
    'geoId/27': {'orderedFacets': [{'earliestDate': '2012',
       'facetId': '1145703171',
       'latestDate': '2023',
       'obsCount': 12,
       'observations': [{'date': '2012', 'value': 40961.0},
        {'date': '2013', 'value': 42511.0},
        {'date': '2014', 'value': 44713.0},
        {'date': '2015', 'value': 47323.0},
        {'date': '2016', 'value': 50039.0},
        {'date': '2017', 'value': 52737.0},
        {'date': '2018', 'value': 54303.0},
        {'date': '2019', 'value': 55185.0},
        {'date': '2020', 'value': 56170.0},
        {'date': '2021', 'value': 58452.0},
        {'date': '2022', 'value': 60300.0},
        {'date': '2023', 'value': 63794.0}]}]}}}},
 'facets': {'1145703171': {'importName': 'CensusACS5YearSurvey',
   'measurementMethod': 'CensusACS5yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'}}}
```
{% endtab %}

{% endtabs %}

</div>

### Example 8: Get all values of multiple statistical variables for a single place

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
client.observation.fetch_observations_by_entity_dcid(date="all", entity_dcids="geoId/05", variable_dcids=["Count_Person","Count_Person_Male"])
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}
(Truncated)
```jsonc
{'geoId/05': {'Count_Person': {'sourceSeries': [{'val': {'2019': 3020985,
      '1936': 1892000,
      '2013': 2960459,
      '1980': 2286435,
      '1904': 1419000,
      '2023': 3069463,
      '2010': 2921998,
      '1946': 1797000,
      '1967': 1901000,
      '1902': 1360000,
      '1962': 1853000,
      '1993': 2423743,
      '1991': 2370666,
      '1986': 2331984,
      '2009': 2896843,
      '2014': 2968759,
      '1933': 1854000,
      '1954': 1734000,
      '1921': 1769000,
      '1929': 1852000,
      '1956': 1704000,
      '1949': 1844000,
      //...
     'measurementMethod': 'CensusPEPSurvey',
     'observationPeriod': 'P1Y',
     'importName': 'USCensusPEP_Annual_Population',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
    {'val': {'2022': 3018669,
      '2018': 2990671,
      '2020': 3011873,
      '2016': 2968472,
      '2013': 2933369,
      '2019': 2999370,
      '2021': 3006309,
      '2015': 2958208,
      '2011': 2895928,
      '2023': 3032651,
      '2014': 2947036,
      '2012': 2916372,
      '2017': 2977944},
     'measurementMethod': 'CensusACS5yrSurvey',
     'importName': 'CensusACS5YearSurvey',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
    {'val': {'2000': 2673400, '2020': 3011524, '2010': 2915918},
     'measurementMethod': 'USDecennialCensus',
     'importName': 'USDecennialCensus_RedistrictingRelease',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html'},
    //...
  'Count_Person_Male': {'sourceSeries': [{'val': {'2015': 1451913,
      '2021': 1483520,
      '2020': 1478511,
      '2023': 1495958,
      '2016': 1456694,
      '2022': 1491622,
      '2019': 1471760,
      '2013': 1439862,
      '2018': 1468412,
      '2014': 1447235,
      '2011': 1421287,
      '2012': 1431252,
      '2017': 1461651},
     'measurementMethod': 'CensusACS5yrSurvey',
     'importName': 'CensusACS5YearSurvey',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
    {'val': {'1975': 1047112,
      '1995': 1228626,
      '2023': 1513837,
      '1991': 1150369,
      '2019': 1482909,
      '1990': 1136163,
      '1998': 1277869,
      '1989': 1130916,
      '2011': 1444411,
      '2021': 1495032,
      '2013': 1453888,
      '1992': 1167203,
      '2004': 1346638,
      '2022': 1503494,
      '1982': 1107142,
      '1978': 1084374,
      //...
     'measurementMethod': 'CensusPEPSurvey_PartialAggregate',
     'observationPeriod': 'P1Y',
     'importName': 'USCensusPEP_Sex',
     'provenanceDomain': 'census.gov',
     'isDcAggregate': True,
     'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
    {'val': {'2013': 1439862,
      '2018': 1468412,
      '2011': 1421287,
      '2015': 1451913,
      '2020': 1478511,
      '2017': 1461651,
      '2021': 1483520,
      '2019': 1471760,
      '2014': 1447235,
      '2012': 1431252,
      '2010': 1408945,
      '2022': 1491622,
      '2023': 1495958,
      '2016': 1456694},
     'measurementMethod': 'CensusACS5yrSurveySubjectTable',
     'importName': 'CensusACS5YearSurvey_SubjectTables_S0101',
     'provenanceDomain': 'census.gov',
     'provenanceUrl': 'https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101'},
   //...
]}}}
```
{% endtab %}

{% tab response V2 response %}
(Truncated)
```jsonc
{'byVariable': {'Count_Person': {'byEntity': {'geoId/05': {'orderedFacets': [
      {'earliestDate': '1900',
       'facetId': '2176550201',
       'latestDate': '2024',
       'obsCount': 125,
       'observations': [{'date': '1900', 'value': 1314000.0},
        {'date': '1901', 'value': 1341000.0},
        {'date': '1902', 'value': 1360000.0},
        {'date': '1903', 'value': 1384000.0},
        {'date': '1904', 'value': 1419000.0},
        {'date': '1905', 'value': 1447000.0},
        {'date': '1906', 'value': 1465000.0},
        {'date': '1907', 'value': 1484000.0},
        {'date': '1908', 'value': 1513000.0},
        {'date': '1909', 'value': 1545000.0},
        {'date': '1910', 'value': 1583000.0},
        {'date': '1911', 'value': 1610000.0},
        {'date': '1912', 'value': 1636000.0},
        {'date': '1913', 'value': 1664000.0},
        {'date': '1914', 'value': 1688000.0},
        {'date': '1915', 'value': 1702000.0},
      //...
      {'earliestDate': '2011',
       'facetId': '1145703171',
       'latestDate': '2023',
       'obsCount': 13,
       'observations': [{'date': '2011', 'value': 2895928.0},
        {'date': '2012', 'value': 2916372.0},
        {'date': '2013', 'value': 2933369.0},
        {'date': '2014', 'value': 2947036.0},
        {'date': '2015', 'value': 2958208.0},
        {'date': '2016', 'value': 2968472.0},
        {'date': '2017', 'value': 2977944.0},
        {'date': '2018', 'value': 2990671.0},
        {'date': '2019', 'value': 2999370.0},
        {'date': '2020', 'value': 3011873.0},
        {'date': '2021', 'value': 3006309.0},
        {'date': '2022', 'value': 3018669.0},
        {'date': '2023', 'value': 3032651.0}]},
      {'earliestDate': '2000',
       'facetId': '1541763368',
       'latestDate': '2020',
       'obsCount': 3,
       'observations': [{'date': '2000', 'value': 2673400.0},
        {'date': '2010', 'value': 2915918.0},
        {'date': '2020', 'value': 3011524.0}]},
      //...
  'Count_Person_Male': {'byEntity': {'geoId/05': {'orderedFacets': [{'earliestDate': '2011',
       'facetId': '1145703171',
       'latestDate': '2023',
       'obsCount': 13,
       'observations': [{'date': '2011', 'value': 1421287.0},
        {'date': '2012', 'value': 1431252.0},
        {'date': '2013', 'value': 1439862.0},
        {'date': '2014', 'value': 1447235.0},
        {'date': '2015', 'value': 1451913.0},
        {'date': '2016', 'value': 1456694.0},
        {'date': '2017', 'value': 1461651.0},
        {'date': '2018', 'value': 1468412.0},
        {'date': '2019', 'value': 1471760.0},
        {'date': '2020', 'value': 1478511.0},
        {'date': '2021', 'value': 1483520.0},
        {'date': '2022', 'value': 1491622.0},
        {'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '1970',
       'facetId': '3999249536',
       'latestDate': '2024',
       'obsCount': 55,
       'observations': [{'date': '1970', 'value': 937034.0},
        {'date': '1971', 'value': 956802.0},
        {'date': '1972', 'value': 979822.0},
        {'date': '1973', 'value': 999264.0},
        {'date': '1974', 'value': 1019259.0},
        {'date': '1975', 'value': 1047112.0},
        {'date': '1976', 'value': 1051166.0},
        {'date': '1977', 'value': 1069003.0},
        {'date': '1978', 'value': 1084374.0},
        {'date': '1979', 'value': 1097123.0},
        {'date': '1980', 'value': 1105739.0},
        {'date': '1981', 'value': 1107249.0},
        {'date': '1982', 'value': 1107142.0},
        {'date': '1983', 'value': 1112460.0},
        {'date': '1984', 'value': 1119061.0},
        {'date': '1985', 'value': 1122425.0},
        {'date': '1986', 'value': 1124357.0},
        {'date': '1987', 'value': 1129353.0},
        {'date': '1988', 'value': 1129014.0},
        {'date': '1989', 'value': 1130916.0},
        {'date': '1990', 'value': 1136163.0},
       //...
      {'earliestDate': '2010',
       'facetId': '1964317807',
       'latestDate': '2023',
       'obsCount': 14,
       'observations': [{'date': '2010', 'value': 1408945.0},
        {'date': '2011', 'value': 1421287.0},
        {'date': '2012', 'value': 1431252.0},
        {'date': '2013', 'value': 1439862.0},
        {'date': '2014', 'value': 1447235.0},
        {'date': '2015', 'value': 1451913.0},
        {'date': '2016', 'value': 1456694.0},
        {'date': '2017', 'value': 1461651.0},
        {'date': '2018', 'value': 1468412.0},
        {'date': '2019', 'value': 1471760.0},
        {'date': '2020', 'value': 1478511.0},
        {'date': '2021', 'value': 1483520.0},
        {'date': '2022', 'value': 1491622.0},
        {'date': '2023', 'value': 1495958.0}]},
      {'earliestDate': '2010',
       'facetId': '10983471',
       'latestDate': '2023',
       'obsCount': 14,
       'observations': [{'date': '2010', 'value': 1407615.16},
        {'date': '2011', 'value': 1421900.648},
        {'date': '2012', 'value': 1431938.652},
        {'date': '2013', 'value': 1440284.179},
        {'date': '2014', 'value': 1446994.676},
        {'date': '2015', 'value': 1452480.128},
        {'date': '2016', 'value': 1457519.752},
        {'date': '2017', 'value': 1462170.504},
        {'date': '2018', 'value': 1468419.461},
        {'date': '2019', 'value': 1472690.67},
        {'date': '2020', 'value': 1478829.643},
        {'date': '2021', 'value': 1482110.337},
        {'date': '2022', 'value': 1491222.486},
        {'date': '2023', 'value': 1495096.943}]},
      {'earliestDate': '2017',
       'facetId': '196790193',
       'latestDate': '2023',
       'obsCount': 7,
       'observations': [{'date': '2017', 'value': 1462170.504},
        {'date': '2018', 'value': 1468419.461},
        {'date': '2019', 'value': 1472690.67},
        {'date': '2020', 'value': 1478829.643},
        {'date': '2021', 'value': 1482110.337},
        {'date': '2022', 'value': 1491222.486},
        {'date': '2023', 'value': 1495096.943}]},
      //...
 'facets': {'10983471': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2601A',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A'},
  '2176550201': {'importName': 'USCensusPEP_Annual_Population',
   'measurementMethod': 'CensusPEPSurvey',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
  '196790193': {'importName': 'CensusACS5YearSurvey_SubjectTables_S2602',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602'},
  '1226172227': {'importName': 'CensusACS1YearSurvey',
   'measurementMethod': 'CensusACS1yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
  '2825511676': {'importName': 'CDC_Mortality_UnderlyingCause',
   'provenanceUrl': 'https://wonder.cdc.gov/ucd-icd10.html'},
  '2458695583': {'importName': 'WikidataPopulation',
   'measurementMethod': 'WikidataPopulation',
   'provenanceUrl': 'https://www.wikidata.org/wiki/Wikidata:Main_Page'},
  '2517965213': {'importName': 'CensusPEP',
   'measurementMethod': 'CensusPEPSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
  '3999249536': {'importName': 'USCensusPEP_Sex',
   'measurementMethod': 'CensusPEPSurvey_PartialAggregate',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/popest.html'},
  '1145703171': {'importName': 'CensusACS5YearSurvey',
   'measurementMethod': 'CensusACS5yrSurvey',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html'},
  '1541763368': {'importName': 'USDecennialCensus_RedistrictingRelease',
   'measurementMethod': 'USDecennialCensus',
   'provenanceUrl': 'https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html'},
  '4181918134': {'importName': 'OECDRegionalDemography_Population',
   'measurementMethod': 'OECDRegionalStatistics',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C'},
  '1964317807': {'importName': 'CensusACS5YearSurvey_SubjectTables_S0101',
   'measurementMethod': 'CensusACS5yrSurveySubjectTable',
   'provenanceUrl': 'https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101'}}}
```
{% endtab %}

{% endtabs %}

</div>

### Example 9: Get all property labels for a single node

This example retrieves the outwardly directed property labels (but not the values) of Wisconsin's eighth congressional district.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_property_labels(['geoId/5508'])
```
{% endtab %}

{% tab request V2 request %}

```python
{'geoId/5508': [
  'containedInPlace',
  'geoId',
  'geoJsonCoordinates',
  'geoOverlaps',
  'kmlCoordinates',
  'landArea',
  'latitude',
  'longitude',
  'name',
  'provenance',
  'typeOf',
  'usCensusGeoId',
  'waterArea']}
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
{'data': {'geoId/5508': {'properties': [
    'containedInPlace',
    'geoId',
    'geoJsonCoordinates',
    'geoOverlaps',
    'kmlCoordinates',
    'landArea',
    'latitude',
    'longitude',
    'name',
    'provenance',
    'typeOf',
    'usCensusGeoId',
    'waterArea']}}}
```
{% endtab %}

{% tab response V2 response %}

```json

```
{% endtab %}

{% endtabs %}

</div>

### Example 10: Get the value(s) of a single property of a node (place) 

This example retrieve the common names of the country of Côte d'Ivoire.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_property_values(['country/CIV'],'name')
```
{% endtab %}

{% tab request V2 request %}

```python
client.node.fetch_property_values(node_dcids="country/CIV", properties="name")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```
{'country/CIV': ["Côte d'Ivoire", 'Ivory Coast']}
```
{% endtab %}

{% tab response V2 response %}

```json
{'data': {'country/CIV': {'arcs': {'name': {'nodes': [
   {'provenanceId': 'dc/base/WikidataOtherIdGeos',
      'value': "Côte d'Ivoire"},
   {'provenanceId': 'dc/base/WikidataOtherIdGeos',
      'value': 'Ivory Coast'}]}}}}}
```
{% endtab %}

{% endtabs %}

</div>

### Example 11: Retrieve the values of a single property for multiple nodes (places)

This example gets the the addresses of Stuyvesant High School in New York and Gunn High School in California.

```python
>>> datacommons.get_property_values(["nces/360007702877","nces/062961004587"],'address')
{'nces/360007702877': ['345 Chambers St, New York, New York'], 'nces/062961004587': ['780 Arastradero Rd., Palo Alto, California']}
```

### Example 4: Retrieve a list of earthquake events in Madagascar.

>    **NOTE:**
>    Unlike in the REST API, the Python endpoint returns only one direction. Hence, you must specify `out` as False to obtain results _in_ Madagascar.

```python
>>> datacommons.get_property_values(dcids=["country/MDG"],prop='affectedPlace',out=False,value_type='EarthquakeEvent')
{'country/MDG': ['earthquake/us200040me', 'earthquake/us60003r15', 'earthquake/usc000evr6', 'earthquake/usp00005zf', 'earthquake/usp00006yt', 'earthquake/usp0000afz', 'earthquake/usp0001fcd', 'earthquake/usp0001ss5', 'earthquake/usp00020ud', 'earthquake/usp0002kfd', 'earthquake/usp0004qn4', 'earthquake/usp0005gu9', 'earthquake/usp0007k9j', 'earthquake/usp0008vc6', 'earthquake/usp000dckw', 'earthquake/usp000fu24', 'earthquake/usp000gmuf', 'earthquake/usp000h6zw', 'earthquake/usp000jgbb']}
```

### Example 5: Retrieve just one cyclone event in India.

```python
>>> datacommons.get_property_values(dcids=["country/IND"],prop='affectedPlace',out=False,value_type='CycloneEvent',limit=1)
{'country/IND': ['cyclone/ibtracs_2018314N12093']}
```
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