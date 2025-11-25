---
layout: default
title: Migrate from V1 to V2
nav_order: 7
parent: Python (V2)
grand_parent: API - Query data programmatically
published: true
---

{: .no_toc}
# Migrate from Python API V1 to V2


Version V1 of the Data Commons Python API will be deprecated in early 2026. The [V2](index.md) APIs are significantly different from V1. This document summarizes the important differences that you should be aware of and provides examples of translating queries from V1 to V2.

* TOC
{:toc}

## Summary of changes 

| Feature | V1 | V2 |
|---------|----|----|
| API key | Not required | Required: get from <https://apikeys.datacommons.com> |
| Custom Data Commons supported | No | Yes: see details in [Create a client](index.md#create-a-client) |
| Pandas support | Separate package | Module in the same package: see details in [Install](index.md#install) |
| Sessions | Managed by the `datacommons` package object | Managed by a `datacommons_client` object that you must create: see details in [Create a client](index.md#create-a-client) |
| Classes/methods | 7 methods, members of `datacommons` class | 3 classes representing REST endpoints `node`, `observation` and `resolve`; several member functions for each endpoint class. Variations of methods in V1 are represented as function parameters in V2. See [Request endpoints and responses](index.md#request-endpoints-and-responses) |
| Pandas classes/methods | 3 methods, all members of `datacommons_pandas` class | 1 method, member of `datacommons_client` class. Variations of the Pandas methods in V1 are represented as parameters in V2. See [Observations DataFrame](pandas.md) |
| Pagination | Required for queries resulting in large data volumes | Optional: see [Pagination](node.md#pagination)  |
| DCID lookup method | No | Yes: [`resolve`](resolve.md) endpoint methods |
| Statistical facets | With the `get_stat_value` and `get_stat_series` methods, Data Commons chooses the most "relevant" facet to answer the query; typically this is the facet that has the most recent data. | For all Observation methods, results from all available facets are returned by default (if you don"t apply a filter); for details, see [Observation response](/observation.html#response) |
| Statistical facet filtering | The `get_stat_value`, `get_stat_series` and Pandas `build_time_series` methods allow you to filter results by specific facet fields, such as measurement method, unit, observation period, etc. | The `observations_dataframe` method allows you to filter results by specific facet fields. Observation methods only allow filtering results by the facet domain or ID; for details, see [Observation fetch](observation.md#fetch). |
| Response contents | Simple structures mostly containing values only | Nested structures containing values and additional properties and metadata | 
| Different response formats | No | Yes: for details, see [Response formatting](index.md#response-formatting). |

## V1 function equivalences in V2

This section shows you how to translate from a given V1 function to the equivalent code in V2. Examples of both versions are given in the [Examples](#examples) section.

| `datacommmons` V1 function |  V2 equivalent |
|-------------|------------------|
| `get_triples` | No direct equivalent; triples are not returned. Instead you indicate the directionality of the relationship in the triple, i.e. incoming or outgoing edges, using [`node.fetch`](node.md#fetch) and a [relation expression](/api/rest/v2/index.html#relation-expressions) |
| `get_places_in` | [`node.fetch_place_descendants`](node.md#fetch_place_descendants) |
| `get_stat_value` | [`observation.fetch_observations_by_entity_dcid`](observation.md#fetch_observations_by_entity_dcid) with a single place and variable |
| `get_stat_series` | [`observation.fetch_observations_by_entity_dcid`](observation.md#fetch_observations_by_entity_dcid) with a single place and variable, and the `date` parameter set to `all` |
| `get_stat_all` | [`observation.fetch_observations_by_entity_dcid`](observation.md#fetch_observations_by_entity_dcid) with an array of places and/or variables and `date` parameter set to `all`  |
| `get_property_labels` | [`node.fetch_property_labels`](node.md#fetch_property_labels) |
| `get_property_values` | [`node.fetch_property_values`](node.md#fetch_property_values) |

| `datacommons_pandas` V1 function | V2 equivalent |
|----------------------------------|------------------|
| `build_time_series` | [`observations_dataframe`](pandas.md) with a single place and variable and the `date` parameter set to `all` |
| `build_time_series_dataframe` | [`observations_dataframe`](pandas.md) with an array of places, a single variable and the `date` parameter set to `all` |
| `build_multivariate_dataframe` | [`observations_dataframe`](pandas.md) with an array of places and/or variables and the `date` parameter set to `latest` |

## Examples

### datacommons package examples

The following examples show equivalent API requests and responses using the V1 `datacommons` package and V2.

{: .no_toc}
#### Example 1: Get triples associated with a single place

This example retrieves triples associated with zip code 94043. In V1, the `get_triples` method returns all triples, in which the zip code is the subject or the object. In V2, you cannot get both directions in a single request; you must send one request for the outgoing relationships and one for the incoming relationships.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_triples(["zip/94043"])
```
{% endtab %}

{% tab request V2 request %}
Request 1:
```python
client.node.fetch(node_dcids=["zip/94043"], expression="->*")
```
Request 2:
```python
client.node.fetch(node_dcids=["zip/94043"], expression="<-*")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
{ "zip/94043": [
  // Outgoing relations
  ("zip/94043", "containedInPlace", "country/USA"),
  ("zip/94043", "containedInPlace", "geoId/06085"),
  ("zip/94043", "containedInPlace", "geoId/0608592830"),
  ("zip/94043", "containedInPlace", "geoId/0616"),
  ("zip/94043", "geoId", "zip/94043"),
  //...
  ("zip/94043", "landArea", "SquareMeter21906343"),
  ("zip/94043", "latitude", "37.411913"),
  ("zip/94043", "longitude", "-122.068919"),
  ("zip/94043", "name", "94043"),
  ("zip/94043", "provenance", "dc/base/BaseGeos"),
  ("zip/94043", "typeOf", "CensusZipCodeTabulationArea"),
  ("zip/94043", "usCensusGeoId", "860Z200US94043"),
  ("zip/94043", "waterArea", "SquareMeter0"),
  // Incoming relations
  ("EpaParentCompany/AlphabetInc", "locatedIn", "zip/94043"),
  ("EpaParentCompany/Google", "locatedIn", "zip/94043"),
  ("epaGhgrpFacilityId/1005910", "containedInPlace", "zip/94043"),
  ("epaSuperfundSiteId/CA2170090078", "containedInPlace", "zip/94043"),
  ("epaSuperfundSiteId/CAD009111444", "containedInPlace", "zip/94043"),
  ("epaSuperfundSiteId/CAD009138488", "containedInPlace", "zip/94043"),
  ("epaSuperfundSiteId/CAD009205097", "containedInPlace", "zip/94043"),
  ("epaSuperfundSiteId/CAD009212838", "containedInPlace", "zip/94043"),
  ("epaSuperfundSiteId/CAD061620217", "containedInPlace", "zip/94043"),
  ("epaSuperfundSiteId/CAD095989778", "containedInPlace", "zip/94043"),
  //...
  ]
}
```
{% endtab %}

{% tab response V2 response %}
Response 1 (outgoing relations):
```python
{"data": {"zip/94043": {"arcs": {
   "longitude": {"nodes": [{"provenanceId": "dc/base/BaseGeos",
       "value": "-122.068919"}]},
    "name": {"nodes": [{"provenanceId": "dc/base/BaseGeos",
       "value": "94043"}]},
    "typeOf": {"nodes": [{"dcid": "CensusZipCodeTabulationArea",
       "name": "CensusZipCodeTabulationArea",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["Class"]}]},
    "usCensusGeoId": {"nodes": [{"provenanceId": "dc/base/BaseGeos",
       "value": "860Z200US94043"}]},
    "containedInPlace": {"nodes": [{"dcid": "country/USA",
       "name": "United States",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["Country"]},
      {"dcid": "geoId/06085",
       "name": "Santa Clara County",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["AdministrativeArea2", "County"]},
      {"dcid": "geoId/0608592830",
       "name": "San Jose CCD",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["CensusCountyDivision"]},
      {"dcid": "geoId/0616",
       "name": "Congressional District 16 (113th Congress), California",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["CongressionalDistrict"]}]},
       //...
      "geoOverlaps": {"nodes": [{"dcid": "geoId/06085504601",
       "name": "Census Tract 5046.01, Santa Clara County, California",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["CensusTract"]},
      {"dcid": "geoId/06085504700",
       "name": "Census Tract 5047, Santa Clara County, California",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["CensusTract"]},
      {"dcid": "geoId/06085509108",
       "name": "Census Tract 5091.08, Santa Clara County, California",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["CensusTract"]},
       //...
    "landArea": {"nodes": [{"dcid": "SquareMeter21906343",
       "name": "SquareMeter 21906343",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["Quantity"]}]},
    "latitude": {"nodes": [{"provenanceId": "dc/base/BaseGeos",
       "value": "37.411913"}]},
    "provenance": {"nodes": [{"dcid": "dc/base/BaseGeos",
       "name": "BaseGeos",
       "provenanceId": "dc/base/BaseGeos",
       "types": ["Provenance"]}]}}}}}
```
Response 2 (incoming relations):

```python
{"data": {"zip/94043": {"arcs":  {
    "locatedIn": {"nodes": [
      {"dcid": "EpaParentCompany/AlphabetInc",
      "name": "AlphabetInc",
      "provenanceId": "dc/base/EPA_ParentCompanies",
      "types": ["EpaParentCompany"]},
      {"dcid": "EpaParentCompany/Google",
      "name": "Google",
      "provenanceId": "dc/base/EPA_ParentCompanies",
      "types": ["EpaParentCompany"]}]},
    "containedInPlace": {"nodes": [
      {"dcid": "epaGhgrpFacilityId/1005910",
       "name": "City Of Mountain View (Shoreline Landfill)",
       "provenanceId": "dc/base/EPA_GHGRPFacilities",
       "types": ["EpaReportingFacility"]},
      {"dcid": "epaSuperfundSiteId/CA2170090078",
       "name": "Moffett Naval Air Station",
       "provenanceId": "dc/base/EPA_Superfund_Sites",
       "types": ["SuperfundSite"]},
      {"dcid": "epaSuperfundSiteId/CAD009111444",
       "name": "Teledyne Semiconductor",
       "provenanceId": "dc/base/EPA_Superfund_Sites",
       "types": ["SuperfundSite"]},
      {"dcid": "epaSuperfundSiteId/CAD009138488",
       "name": "Spectra-Physics Inc.",
       "provenanceId": "dc/base/EPA_Superfund_Sites",
       "types": ["SuperfundSite"]},
      //...
     ]
    }
  }
}
```
{% endtab %}

{% endtabs %}

</div>

{: .no_toc}
#### Example 2: Get a list of places in another place

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

```python
{"geoId/10": ["geoId/10001", "geoId/10003", "geoId/10005"]}
```
{% endtab %}

{% tab response V2 response %}

```python
{"geoId/10": [
  {"dcid": "geoId/10001", "name": "Kent County"},
  {"dcid": "geoId/10003", "name": "New Castle County"},
  {"dcid": "geoId/10005", "name": "Sussex County"}]}
```

{% endtab %}

{% endtabs %}

</div>

{: .no_toc}
#### Example 3: Get the latest value of a single statistical variable for a single place

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

```python
1524533
```
{% endtab %}

{% tab response V2 response %}

```python
{"byVariable": {"Count_Person_Male": {"byEntity": {"geoId/05": {"orderedFacets": [
      {"earliestDate": "2023",
       "facetId": "1145703171",
       "latestDate": "2023",
       "obsCount": 1,
       "observations": [{"date": "2023", "value": 1495958.0}]},
      {"earliestDate": "2024",
       "facetId": "3999249536",
       "latestDate": "2024",
       "obsCount": 1,
       "observations": [{"date": "2024", "value": 1524533.0}]},
      {"earliestDate": "2023",
       "facetId": "1964317807",
       "latestDate": "2023",
       "obsCount": 1,
       "observations": [{"date": "2023", "value": 1495958.0}]},
      {"earliestDate": "2023",
       "facetId": "10983471",
       "latestDate": "2023",
       "obsCount": 1,
       "observations": [{"date": "2023", "value": 1495096.943}]},
      {"earliestDate": "2023",
       "facetId": "196790193",
       "latestDate": "2023",
       "obsCount": 1,
       "observations": [{"date": "2023", "value": 1495096.943}]},
      {"earliestDate": "2021",
       "facetId": "4181918134",
       "latestDate": "2021",
       "obsCount": 1,
       "observations": [{"date": "2021", "value": 1493178.0}]},
      {"earliestDate": "2020",
       "facetId": "2825511676",
       "latestDate": "2020",
       "obsCount": 1,
       "observations": [{"date": "2020", "value": 1486856.0}]},
      {"earliestDate": "2019",
       "facetId": "1226172227",
       "latestDate": "2019",
       "obsCount": 1,
       "observations": [{"date": "2019", "value": 1474705.0}]}]}}}},
 "facets": {"2825511676": {"importName": "CDC_Mortality_UnderlyingCause",
   "provenanceUrl": "https://wonder.cdc.gov/ucd-icd10.html"},
  "1226172227": {"importName": "CensusACS1YearSurvey",
   "measurementMethod": "CensusACS1yrSurvey",
   "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"},
  "1145703171": {"importName": "CensusACS5YearSurvey",
   "measurementMethod": "CensusACS5yrSurvey",
   "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"},
  "3999249536": {"importName": "USCensusPEP_Sex",
   "measurementMethod": "CensusPEPSurvey_PartialAggregate",
   "observationPeriod": "P1Y",
   "provenanceUrl": "https://www.census.gov/programs-surveys/popest.html"},
  "1964317807": {"importName": "CensusACS5YearSurvey_SubjectTables_S0101",
   "measurementMethod": "CensusACS5yrSurveySubjectTable",
   "provenanceUrl": "https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101"},
  "10983471": {"importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
   "measurementMethod": "CensusACS5yrSurveySubjectTable",
   "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A"},
  "196790193": {"importName": "CensusACS5YearSurvey_SubjectTables_S2602",
   "measurementMethod": "CensusACS5yrSurveySubjectTable",
   "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602"},
  "4181918134": {"importName": "OECDRegionalDemography_Population",
   "measurementMethod": "OECDRegionalStatistics",
   "observationPeriod": "P1Y",
   "provenanceUrl": "https://data-explorer.oecd.org/vis?fs[0]=Topic%2C0%7CRegional%252C%20rural%20and%20urban%20development%23GEO%23&pg=40&fc=Topic&bp=true&snb=117&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_REG_DEMO%40DF_POP_5Y&df[ag]=OECD.CFE.EDS&df[vs]=2.0&dq=A.......&to[TIME_PERIOD]=false&vw=tb&pd=%2C"}}}
```
{% endtab %}

{% endtabs %}

</div>

{: #example-4}
{: .no_toc}
#### Example 4: Get all values of a single statistical variable for a single place

This example retrieves the number of men in the state of California for all years available. As in example 3 above, V1 returns data from a single facet (which appears to be 1145703171, the U.S. Census ACS 5-year survey). V2 returns data for all available facets.

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

```python
{"2023": 1495958,
 "2017": 1461651,
 "2022": 1491622,
 "2015": 1451913,
 "2021": 1483520,
 "2018": 1468412,
 "2011": 1421287,
 "2016": 1456694,
 "2012": 1431252,
 "2019": 1471760,
 "2013": 1439862,
 "2014": 1447235,
 "2020": 1478511}
```
{% endtab %}

{% tab response V2 response %}

```python
{"byVariable": {"Count_Person_Male": {"byEntity": {"geoId/05": {"orderedFacets": [
      {"earliestDate": "2011",
       "facetId": "1145703171",
       "latestDate": "2023",
       "obsCount": 13,
       "observations": [
        {"date": "2011", "value": 1421287.0},
        {"date": "2012", "value": 1431252.0},
        {"date": "2013", "value": 1439862.0},
        {"date": "2014", "value": 1447235.0},
        {"date": "2015", "value": 1451913.0},
        {"date": "2016", "value": 1456694.0},
        {"date": "2017", "value": 1461651.0},
        {"date": "2018", "value": 1468412.0},
        {"date": "2019", "value": 1471760.0},
        {"date": "2020", "value": 1478511.0},
        {"date": "2021", "value": 1483520.0},
        {"date": "2022", "value": 1491622.0},
        {"date": "2023", "value": 1495958.0}]},
      {"earliestDate": "1970",
       "facetId": "3999249536",
       "latestDate": "2024",
       "obsCount": 55,
       "observations": [
        {"date": "1970", "value": 937034.0},
        {"date": "1971", "value": 956802.0},
        {"date": "1972", "value": 979822.0},
        {"date": "1973", "value": 999264.0},
        {"date": "1974", "value": 1019259.0},
        {"date": "1975", "value": 1047112.0},
        {"date": "1976", "value": 1051166.0},
        {"date": "1977", "value": 1069003.0},
        {"date": "1978", "value": 1084374.0},
        {"date": "1979", "value": 1097123.0},
        {"date": "1980", "value": 1105739.0},
        {"date": "1981", "value": 1107249.0},
        {"date": "1982", "value": 1107142.0},
        {"date": "1983", "value": 1112460.0},
        {"date": "1984", "value": 1119061.0},
        {"date": "1985", "value": 1122425.0},
        {"date": "1986", "value": 1124357.0},
        {"date": "1987", "value": 1129353.0},
        {"date": "1988", "value": 1129014.0},
        {"date": "1989", "value": 1130916.0},
        {"date": "1990", "value": 1136163.0},
        //...
 "facets": {"1964317807": {"importName": "CensusACS5YearSurvey_SubjectTables_S0101",
   "measurementMethod": "CensusACS5yrSurveySubjectTable",
   "provenanceUrl": "https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101"},
  "10983471": {"importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
   "measurementMethod": "CensusACS5yrSurveySubjectTable",
   "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A"},
  "196790193": {"importName": "CensusACS5YearSurvey_SubjectTables_S2602",
   "measurementMethod": "CensusACS5yrSurveySubjectTable",
   "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602"},
   //...
}}
```
{% endtab %}

{% endtabs %}

</div>

{: #example-5}
{: .no_toc}
#### Example 5: Get the all values of a single statistical variable for a single place, selecting the facet to return

This example gets the nominal GDP for Italy, filtering for facets that show the results in U.S. dollars. In V1, this is done directly with the `unit` parameter. In V2, using the Observation endpoint, we use the domain representing the facet whose unit is U.S. dollars. Note that you may need to make two requests with the Observation APIs before applying a filter: one to get the IDs and attributes of all the facets and identify the one you want, and a second one to apply the appropriate filter to get the desired facet.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_stat_series("country/ITA", "Amount_EconomicActivity_GrossDomesticProduction_Nominal", unit="USDollar")
```
{% endtab %}

{% tab request V2 request %}

```python
client.observation.fetch_observations_by_entity_dcid(date="all", entity_dcids="country/ITA",variable_dcids="Amount_EconomicActivity_GrossDomesticProduction_Nominal", filter_facet_domains="worldbank.org")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
{'2003': 1582930016538.82,
 '2002': 1281746271196.04,
 '1961': 46649487320.4225,
 '1986': 641862313287.44,
 '1974': 200024444775.231,
 '2000': 1149661363439.38,
 '2015': 1845428048839.1,
 '2001': 1172041488805.87,
 '1966': 76622444787.3696,
 '1971': 124959712858.92598,
 '1999': 1255004736463.98,
 //...
 '1979': 394584507107.9,
 '2016': 1887111188176.93,
 '1981': 431695533980.583,
 '2024': 2372774547793.12,
 '1985': 453259761687.456,
 '1975': 228220643534.994,
 '1960': 42012422612.3955,
 '1991': 1249092439519.28}
```
{% endtab %}

{% tab response V2 response %}

```python
{'byVariable': {'Amount_EconomicActivity_GrossDomesticProduction_Nominal': {'byEntity': {'country/ITA': {'orderedFacets': [{'earliestDate': '1960',
       'facetId': '3496587042',
       'latestDate': '2024',
       'obsCount': 65,
       'observations': [{'date': '1960', 'value': 42012422612.3955},
        {'date': '1961', 'value': 46649487320.4225},
        {'date': '1962', 'value': 52413872628.0045},
        {'date': '1963', 'value': 60035924617.9277},
        {'date': '1964', 'value': 65720771779.4768},
        {'date': '1965', 'value': 70717012186.1774},
        {'date': '1966', 'value': 76622444787.3696},
        {'date': '1967', 'value': 84401995573.2456},
        {'date': '1968', 'value': 91485448147.84},
        {'date': '1969', 'value': 100996667239.335},
        ..//
        {'date': '2022', 'value': 2104067630319.46},
        {'date': '2023', 'value': 2304605139862.79},
        {'date': '2024', 'value': 2372774547793.12}]}]}}}},
 'facets': {'3496587042': {'importName': 'WorldDevelopmentIndicators',
   'observationPeriod': 'P1Y',
   'provenanceUrl': 'https://datacatalog.worldbank.org/dataset/world-development-indicators/',
   'unit': 'USDollar'}}}
```
{% endtab %}

{% endtabs %}

</div>

{: #example-6}
{: .no_toc}
#### Example 6: Get all values of a single statistical variables for multiple places

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

```python
{"geoId/27": {"Count_Person_EducationalAttainmentDoctorateDegree": {"sourceSeries": [
   {"val": 
     {"2016": 50039,
      "2017": 52737,
      "2015": 47323,
      "2013": 42511,
      "2012": 40961,
      "2022": 60300,
      "2023": 63794,
      "2014": 44713,
      "2021": 58452,
      "2019": 55185,
      "2020": 56170,
      "2018": 54303},
     "measurementMethod": "CensusACS5yrSurvey",
     "importName": "CensusACS5YearSurvey",
     "provenanceDomain": "census.gov",
     "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"}]}},
 "geoId/55": {"Count_Person_EducationalAttainmentDoctorateDegree": {"sourceSeries": [
   {"val": 
     {"2020": 49385,
      "2017": 43737,
      "2022": 53667,
      "2014": 40133,
      "2021": 52306,
      "2023": 55286,
      "2016": 42590,
      "2012": 38052,
      "2013": 38711,
      "2019": 47496,
      "2018": 46071,
      "2015": 41387},
     "measurementMethod": "CensusACS5yrSurvey",
     "importName": "CensusACS5YearSurvey",
     "provenanceDomain": "census.gov",
     "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"}]}}}
```
{% endtab %}

{% tab response V2 response %}

```python
{"byVariable": {"Count_Person_EducationalAttainmentDoctorateDegree": {"byEntity": {
  "geoId/55": {"orderedFacets": [{"earliestDate": "2012",
       "facetId": "1145703171",
       "latestDate": "2023",
       "obsCount": 12,
       "observations": [
        {"date": "2012", "value": 38052.0},
        {"date": "2013", "value": 38711.0},
        {"date": "2014", "value": 40133.0},
        {"date": "2015", "value": 41387.0},
        {"date": "2016", "value": 42590.0},
        {"date": "2017", "value": 43737.0},
        {"date": "2018", "value": 46071.0},
        {"date": "2019", "value": 47496.0},
        {"date": "2020", "value": 49385.0},
        {"date": "2021", "value": 52306.0},
        {"date": "2022", "value": 53667.0},
        {"date": "2023", "value": 55286.0}]}]},
    "geoId/27": {"orderedFacets": [{"earliestDate": "2012",
       "facetId": "1145703171",
       "latestDate": "2023",
       "obsCount": 12,
       "observations": [
        {"date": "2012", "value": 40961.0},
        {"date": "2013", "value": 42511.0},
        {"date": "2014", "value": 44713.0},
        {"date": "2015", "value": 47323.0},
        {"date": "2016", "value": 50039.0},
        {"date": "2017", "value": 52737.0},
        {"date": "2018", "value": 54303.0},
        {"date": "2019", "value": 55185.0},
        {"date": "2020", "value": 56170.0},
        {"date": "2021", "value": 58452.0},
        {"date": "2022", "value": 60300.0},
        {"date": "2023", "value": 63794.0}]}]}}}},
 "facets": {"1145703171": {"importName": "CensusACS5YearSurvey",
   "measurementMethod": "CensusACS5yrSurvey",
   "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"}}}
```
{% endtab %}

{% endtabs %}

</div>

{: #example-7}
{: .no_toc}
#### Example 7: Get all values of multiple statistical variables for a single place

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

```python
{"geoId/05": {"Count_Person": {"sourceSeries": [{"val": {
      "2019": 3020985,
      "1936": 1892000,
      "2013": 2960459,
      "1980": 2286435,
      "1904": 1419000,
      "2023": 3069463,
      "2010": 2921998,
      "1946": 1797000,
      "1967": 1901000,
      "1902": 1360000,
      "1962": 1853000,
      "1993": 2423743,
      "1991": 2370666,
      "1986": 2331984,
      "2009": 2896843,
      "2014": 2968759,
      "1933": 1854000,
      "1954": 1734000,
      "1921": 1769000,
      "1929": 1852000,
      "1956": 1704000,
      "1949": 1844000,
      //...
     "measurementMethod": "CensusPEPSurvey",
     "observationPeriod": "P1Y",
     "importName": "USCensusPEP_Annual_Population",
     "provenanceDomain": "census.gov",
     "provenanceUrl": "https://www.census.gov/programs-surveys/popest.html"},
    {"val": {
      "2022": 3018669,
      "2018": 2990671,
      "2020": 3011873,
      "2016": 2968472,
      "2013": 2933369,
      "2019": 2999370,
      "2021": 3006309,
      "2015": 2958208,
      "2011": 2895928,
      "2023": 3032651,
      "2014": 2947036,
      "2012": 2916372,
      "2017": 2977944},
     "measurementMethod": "CensusACS5yrSurvey",
     "importName": "CensusACS5YearSurvey",
     "provenanceDomain": "census.gov",
     "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"},
    {"val": {"2000": 2673400, "2020": 3011524, "2010": 2915918},
     "measurementMethod": "USDecennialCensus",
     "importName": "USDecennialCensus_RedistrictingRelease",
     "provenanceDomain": "census.gov",
     "provenanceUrl": "https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html"},
    //...
  "Count_Person_Male": {"sourceSeries": [{"val": {
      "2015": 1451913,
      "2021": 1483520,
      "2020": 1478511,
      "2023": 1495958,
      "2016": 1456694,
      "2022": 1491622,
      "2019": 1471760,
      "2013": 1439862,
      "2018": 1468412,
      "2014": 1447235,
      "2011": 1421287,
      "2012": 1431252,
      "2017": 1461651},
     "measurementMethod": "CensusACS5yrSurvey",
     "importName": "CensusACS5YearSurvey",
     "provenanceDomain": "census.gov",
     "provenanceUrl": "https://www.census.gov/programs-surveys/acs/data/data-via-ftp.html"},
    {"val": {
      "1975": 1047112,
      "1995": 1228626,
      "2023": 1513837,
      "1991": 1150369,
      "2019": 1482909,
      "1990": 1136163,
      "1998": 1277869,
      "1989": 1130916,
      "2011": 1444411,
      "2021": 1495032,
      "2013": 1453888,
      "1992": 1167203,
      "2004": 1346638,
      "2022": 1503494,
      "1982": 1107142,
      "1978": 1084374,
      //...
     "measurementMethod": "CensusPEPSurvey_PartialAggregate",
     "observationPeriod": "P1Y",
     "importName": "USCensusPEP_Sex",
     "provenanceDomain": "census.gov",
     "isDcAggregate": True,
     "provenanceUrl": "https://www.census.gov/programs-surveys/popest.html"},
    {"val": {"2013": 1439862,
      "2018": 1468412,
      "2011": 1421287,
      "2015": 1451913,
      "2020": 1478511,
      "2017": 1461651,
      "2021": 1483520,
      "2019": 1471760,
      "2014": 1447235,
      "2012": 1431252,
      "2010": 1408945,
      "2022": 1491622,
      "2023": 1495958,
      "2016": 1456694},
     "measurementMethod": "CensusACS5yrSurveySubjectTable",
     "importName": "CensusACS5YearSurvey_SubjectTables_S0101",
     "provenanceDomain": "census.gov",
     "provenanceUrl": "https://data.census.gov/table?q=S0101:+Age+and+Sex&tid=ACSST1Y2022.S0101"},
   //...
]}}}
```
{% endtab %}

{% tab response V2 response %}

```python
{"byVariable": {"Count_Person": {"byEntity": {
  "geoId/05": {"orderedFacets": [
      {"earliestDate": "1900",
       "facetId": "2176550201",
       "latestDate": "2024",
       "obsCount": 125,
       "observations": [{"date": "1900", "value": 1314000.0},
        {"date": "1901", "value": 1341000.0},
        {"date": "1902", "value": 1360000.0},
        {"date": "1903", "value": 1384000.0},
        {"date": "1904", "value": 1419000.0},
        {"date": "1905", "value": 1447000.0},
        {"date": "1906", "value": 1465000.0},
        {"date": "1907", "value": 1484000.0},
        //...
      {"earliestDate": "2011",
       "facetId": "1145703171",
       "latestDate": "2023",
       "obsCount": 13,
       "observations": [{"date": "2011", "value": 2895928.0},
        {"date": "2012", "value": 2916372.0},
        {"date": "2013", "value": 2933369.0},
        {"date": "2014", "value": 2947036.0},
        {"date": "2015", "value": 2958208.0},
        {"date": "2016", "value": 2968472.0},
        {"date": "2017", "value": 2977944.0},
        {"date": "2018", "value": 2990671.0},
        {"date": "2019", "value": 2999370.0},
        {"date": "2020", "value": 3011873.0},
        {"date": "2021", "value": 3006309.0},
        {"date": "2022", "value": 3018669.0},
        {"date": "2023", "value": 3032651.0}]},
      {"earliestDate": "2000",
       "facetId": "1541763368",
       "latestDate": "2020",
       "obsCount": 3,
       "observations": [{"date": "2000", "value": 2673400.0},
        {"date": "2010", "value": 2915918.0},
        {"date": "2020", "value": 3011524.0}]},
      //...
  "Count_Person_Male": {"byEntity": {
    "geoId/05": {"orderedFacets": [{"earliestDate": "2011",
       "facetId": "1145703171",
       "latestDate": "2023",
       "obsCount": 13,
       "observations": [{"date": "2011", "value": 1421287.0},
        {"date": "2012", "value": 1431252.0},
        {"date": "2013", "value": 1439862.0},
        {"date": "2014", "value": 1447235.0},
        {"date": "2015", "value": 1451913.0},
        {"date": "2016", "value": 1456694.0},
        {"date": "2017", "value": 1461651.0},
        {"date": "2018", "value": 1468412.0},
        {"date": "2019", "value": 1471760.0},
        {"date": "2020", "value": 1478511.0},
        {"date": "2021", "value": 1483520.0},
        {"date": "2022", "value": 1491622.0},
        {"date": "2023", "value": 1495958.0}]},
      {"earliestDate": "1970",
       "facetId": "3999249536",
       "latestDate": "2024",
       "obsCount": 55,
       "observations": [{"date": "1970", "value": 937034.0},
        {"date": "1971", "value": 956802.0},
        {"date": "1972", "value": 979822.0},
        {"date": "1973", "value": 999264.0},
        {"date": "1974", "value": 1019259.0},
        {"date": "1975", "value": 1047112.0},
        {"date": "1976", "value": 1051166.0},
        {"date": "1977", "value": 1069003.0},
        {"date": "1978", "value": 1084374.0},
        {"date": "1979", "value": 1097123.0},
        {"date": "1980", "value": 1105739.0},
       //...
      {"earliestDate": "2010",
       "facetId": "1964317807",
       "latestDate": "2023",
       "obsCount": 14,
       "observations": [{"date": "2010", "value": 1408945.0},
        {"date": "2011", "value": 1421287.0},
        {"date": "2012", "value": 1431252.0},
        {"date": "2013", "value": 1439862.0},
        {"date": "2014", "value": 1447235.0},
        {"date": "2015", "value": 1451913.0},
        {"date": "2016", "value": 1456694.0},
        {"date": "2017", "value": 1461651.0},
        //...
      {"earliestDate": "2010",
       "facetId": "10983471",
       "latestDate": "2023",
       "obsCount": 14,
       "observations": [{"date": "2010", "value": 1407615.16},
        {"date": "2011", "value": 1421900.648},
        {"date": "2012", "value": 1431938.652},
        {"date": "2013", "value": 1440284.179},
        {"date": "2014", "value": 1446994.676},
        {"date": "2015", "value": 1452480.128},
        {"date": "2016", "value": 1457519.752},
        {"date": "2017", "value": 1462170.504},
        //...
      {"earliestDate": "2017",
       "facetId": "196790193",
       "latestDate": "2023",
       "obsCount": 7,
       "observations": [{"date": "2017", "value": 1462170.504},
        {"date": "2018", "value": 1468419.461},
        {"date": "2019", "value": 1472690.67},
        {"date": "2020", "value": 1478829.643},
        {"date": "2021", "value": 1482110.337},
        {"date": "2022", "value": 1491222.486},
        {"date": "2023", "value": 1495096.943}]},
      //...
 "facets": {"10983471": {"importName": "CensusACS5YearSurvey_SubjectTables_S2601A",
   "measurementMethod": "CensusACS5yrSurveySubjectTable",
   "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2601A&tid=ACSST5Y2019.S2601A"},
  "2176550201": {"importName": "USCensusPEP_Annual_Population",
   "measurementMethod": "CensusPEPSurvey",
   "observationPeriod": "P1Y",
   "provenanceUrl": "https://www.census.gov/programs-surveys/popest.html"},
  "196790193": {"importName": "CensusACS5YearSurvey_SubjectTables_S2602",
   "measurementMethod": "CensusACS5yrSurveySubjectTable",
   "provenanceUrl": "https://data.census.gov/cedsci/table?q=S2602&tid=ACSST5Y2019.S2602"},
  //...
}}
```
{% endtab %}

{% endtabs %}

</div>

{: .no_toc}
#### Example 8: Get all outgoing property labels for a single node

This example retrieves the outwardly directed property labels (but not the values) of Wisconsin"s eighth congressional district.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_property_labels(["geoId/5508"])
```
{% endtab %}

{% tab request V2 request %}

```python
client.node.fetch_property_labels(node_dcids="geoId/5508")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
{"geoId/5508": [
  "containedInPlace",
  "geoId",
  "geopythonCoordinates",
  "geoOverlaps",
  "kmlCoordinates",
  "landArea",
  "latitude",
  "longitude",
  "name",
  "provenance",
  "typeOf",
  "usCensusGeoId",
  "waterArea"]}
```
{% endtab %}

{% tab response V2 response %}

```python
{"data": {"geoId/5508": {"properties": [
    "containedInPlace",
    "geoId",
    "geopythonCoordinates",
    "geoOverlaps",
    "kmlCoordinates",
    "landArea",
    "latitude",
    "longitude",
    "name",
    "provenance",
    "typeOf",
    "usCensusGeoId",
    "waterArea"]}}}
```
{% endtab %}

{% endtabs %}

</div>

{: .no_toc}
#### Example 9: Get the value(s) of a single outgoing property of a node (place) 

This example retrieves the common names of the country of Côte d"Ivoire.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_property_values(["country/CIV"],"name")
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

```python
{"country/CIV": ["Côte d"Ivoire", "Ivory Coast"]}
```
{% endtab %}

{% tab response V2 response %}

```python
{"data": {"country/CIV": {"arcs": {"name": {"nodes": [
   {"provenanceId": "dc/base/WikidataOtherIdGeos",
      "value": "Côte d"Ivoire"},
   {"provenanceId": "dc/base/WikidataOtherIdGeos",
      "value": "Ivory Coast"}]}}}}}
```
{% endtab %}

{% endtabs %}

</div>

{: .no_toc}
#### Example 10: Retrieve the values of a single outgoing property for multiple nodes (places)

This example gets the the addresses of Stuyvesant High School in New York and Gunn High School in California.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons.get_property_values(["nces/360007702877","nces/062961004587"],"address")
```
{% endtab %}

{% tab request V2 request %}

```python
client.node.fetch_property_values(node_dcids=["nces/360007702877","nces/062961004587"], properties="address")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
{"nces/360007702877": ["345 Chambers St New York NY 10282-1099"],
 "nces/062961004587": ["780 Arastradero Rd. Palo Alto 94306-3827"]}
```
{% endtab %}

{% tab response V2 response %}

```python
{"data": {"nces/360007702877": {"arcs": {"address": {"nodes": [{"provenanceId": "dc/base/NCES_PublicSchool",
       "value": "345 Chambers St New York NY 10282-1099"}]}}},
  "nces/062961004587": {"arcs": {"address": {"nodes": [{"provenanceId": "dc/base/NCES_PublicSchool",
       "value": "780 Arastradero Rd. Palo Alto 94306-3827"}]}}}}}
```
{% endtab %}

{% endtabs %}

</div>

### datacommons_pandas package examples

The following examples show equivalent API requests and responses using the V1 `datacommons_pandas` package and V2.

{: .no_toc}
#### Example 1: Get all values of a single statistical variable for a single place

This example is the same as [example 4](#example-4) above, but returns a Pandas DataFrame object. Note that V1 selects a single facet, while V2 returns all facets. To restrict the V2 method to a single facet, you could use the `property_filters` parameter.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons_pandas.build_time_series("geoId/05", "Count_Person_Male")
```
{% endtab %}

{% tab request V2 request %}

```python
client.observations_dataframe(variable_dcids="Count_Person_Male", date="all", entity_dcids="geoId/05")
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
	0
2023	1495958
2012	1431252
2022	1491622
2018	1468412
2014	1447235
2020	1478511
2011	1421287
2016	1456694
2017	1461651
2015	1451913
2019	1471760
2021	1483520
2013	1439862

dtype: int64
```
{% endtab %}

{% tab response V2 response %}

```python
	date	entity	entity_name	variable	variable_name	facetId	importName	measurementMethod	observationPeriod	provenanceUrl	unit	value
0	2011	geoId/05	Arkansas	Count_Person_Male	Male population	1145703171	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1421287.0
1	2012	geoId/05	Arkansas	Count_Person_Male	Male population	1145703171	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1431252.0
2	2013	geoId/05	Arkansas	Count_Person_Male	Male population	1145703171	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1439862.0
3	2014	geoId/05	Arkansas	Count_Person_Male	Male population	1145703171	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1447235.0
4	2015	geoId/05	Arkansas	Count_Person_Male	Male population	1145703171	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1451913.0
...	...	...	...	...	...	...	...	...	...	...	...	...
162	2015	geoId/05	Arkansas	Count_Person_Male	Male population	1226172227	CensusACS1YearSurvey	CensusACS1yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1463576.0
163	2016	geoId/05	Arkansas	Count_Person_Male	Male population	1226172227	CensusACS1YearSurvey	CensusACS1yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1468782.0
164	2017	geoId/05	Arkansas	Count_Person_Male	Male population	1226172227	CensusACS1YearSurvey	CensusACS1yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1479682.0
165	2018	geoId/05	Arkansas	Count_Person_Male	Male population	1226172227	CensusACS1YearSurvey	CensusACS1yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1476680.0
166	2019	geoId/05	Arkansas	Count_Person_Male	Male population	1226172227	CensusACS1YearSurvey	CensusACS1yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1474705.0
167 rows × 12 columns
```
{% endtab %}

{% endtabs %}

</div>

{: .no_toc}
#### Example 2: Get the all values of a single statistical variable for a single place, selecting the facet to return

This example is the same as [example 5](#example-5) above, but returns a Pandas DataFrame object.

<div>
{% tabs request %}

{% tab request V1 request %}

```python
datacommons_pandas.build_time_series("country/ITA", "Amount_EconomicActivity_GrossDomesticProduction_Nominal", unit="USDollar")
```
{% endtab %}

{% tab request V2 request %}

```python
client.observations_dataframe(variable_dcids="Amount_EconomicActivity_GrossDomesticProduction_Nominal", date="all", entity_dcids="country/ITA",  property_filters={"unit": ["USDollar"]})
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
	0
1988	8.936639e+11
1990	1.183945e+12
1970	1.136567e+11
1966	7.662244e+10
1992	1.323204e+12
...	...
2007	2.222524e+12
2022	2.104068e+12
2021	2.179208e+12
1977	2.581900e+11
2020	1.907481e+12
65 rows × 1 columns


dtype: float64
```
{% endtab %}

{% tab response V2 response %}

```python
	date	entity	entity_name	variable	variable_name	facetId	importName	measurementMethod	observationPeriod	provenanceUrl	unit	value
0	1960	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	4.201242e+10
1	1961	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	4.664949e+10
2	1962	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	5.241387e+10
3	1963	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	6.003592e+10
4	1964	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	6.572077e+10
...	...	...	...	...	...	...	...	...	...	...	...	...
60	2020	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	1.907481e+12
61	2021	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	2.179208e+12
62	2022	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	2.104068e+12
63	2023	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	2.304605e+12
64	2024	country/ITA	Italy	Amount_EconomicActivity_GrossDomesticProductio...	Nominal gross domestic product	3496587042	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	USDollar	2.372775e+12
65 rows × 12 columns
```
{% endtab %}

{% endtabs %}

</div>

{: .no_toc}
#### Example 3: Get all values of a single statistical variable for multiple places

This example compares the historic populations of Sudan and South Sudan. Note that V1 selects a single facet, while V2 returns all facets. To restrict the V2 method to a single facet, you could use the `property_filters` parameter.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons_pandas.build_time_series_dataframe(["country/SSD","country/SDN"], "Count_Person")
```
{% endtab %}

{% tab request V2 request %}

```python
client.observations_dataframe(variable_dcids="Count_Person", date="all", entity_dcids=["country/SSD", "country/SDN"])
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
	1960	1961	1962	1963	1964	1965	1966	1967	1968	1969	...	2015	2016	2017	2018	2019	2020	2021	2022	2023	2024
place																					
country/SDN	8364489	8634941	8919028	9218077	9531109	9858030	10197578	10550597	10917999	11298936	...	40024431	41259892	42714306	44230596	45548175	46789231	48066924	49383346	50042791	50448963
country/SSD	2931559	2976724	3024308	3072669	3129918	3189835	3236423	3277648	3321528	3365533	...	11107561	10830102	10259154	10122977	10423384	10698467	10865780	11021177	11483374	11943408
2 rows × 65 columns
```
{% endtab %}

{% tab response V2 response %}

```python
	date	entity	entity_name	variable	variable_name	facetId	importName	measurementMethod	observationPeriod	provenanceUrl	unit	value
0	1960	country/SDN	Sudan	Count_Person	Total population	3981252704	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	None	8364489.0
1	1961	country/SDN	Sudan	Count_Person	Total population	3981252704	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	None	8634941.0
2	1962	country/SDN	Sudan	Count_Person	Total population	3981252704	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	None	8919028.0
3	1963	country/SDN	Sudan	Count_Person	Total population	3981252704	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	None	9218077.0
4	1964	country/SDN	Sudan	Count_Person	Total population	3981252704	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	None	9531109.0
...	...	...	...	...	...	...	...	...	...	...	...	...
167	2016	country/SSD	South Sudan	Count_Person	Total population	473499523	Subnational_Demographics_Stats	WorldBankSubnationalPopulationEstimate	P1Y	https://databank.worldbank.org/source/subnatio...	None	12231000.0
168	2024	country/SSD	South Sudan	Count_Person	Total population	1456184638	WikipediaStatsData	Wikipedia	None	https://www.wikipedia.org	None	12703714.0
169	2008	country/SSD	South Sudan	Count_Person	Total population	2458695583	WikidataPopulation	WikidataPopulation	None	https://www.wikidata.org/wiki/Wikidata:Main_Page	None	8260490.0
170	2015	country/SSD	South Sudan	Count_Person	Total population	2458695583	WikidataPopulation	WikidataPopulation	None	https://www.wikidata.org/wiki/Wikidata:Main_Page	None	12340000.0
171	2017	country/SSD	South Sudan	Count_Person	Total population	2458695583	WikidataPopulation	WikidataPopulation	None	https://www.wikidata.org/wiki/Wikidata:Main_Page	None	12575714.0
172 rows × 12 columns
```
{% endtab %}

{% endtabs %}

</div>

{: .no_toc}
#### Example 4: Get all values of multiple statistical variables for multiple places

This example compares the current populations, median ages, and unemployment rates of the US, California, and Santa Clara County. To restrict the V2 method to a single facet, you could use the `property_filters` parameter.

<div>

{% tabs request %}

{% tab request V1 request %}

```python
datacommons_pandas.build_multivariate_dataframe(["country/USA", "geoId/06", "geoId/06085"],["Count_Person", "Median_Age_Person", "UnemploymentRate_Person"])
```
{% endtab %}

{% tab request V2 request %}

```python
client.observations_dataframe(variable_dcids=["Count_Person", "Median_Age_Person", "UnemploymentRate_Person"], date="latest", entity_dcids=["country/USA", "geoId/06", "geoId/06085"])
```
{% endtab %}

{% endtabs %}

</div>

<div>

{% tabs response %}

{% tab response V1 response %}

```python
	Median_Age_Person	Count_Person	UnemploymentRate_Person
place			
country/USA	38.7	332387540	4.3
geoId/06	37.6	39242785	5.5
geoId/06085	37.9	1903297	NaN

```
{% endtab %}

{% tab response V2 response %}

```python
	date	entity	entity_name	variable	variable_name	facetId	importName	measurementMethod	observationPeriod	provenanceUrl	unit	value
0	2024	geoId/06085	Santa Clara County	Count_Person	Total population	2176550201	USCensusPEP_Annual_Population	CensusPEPSurvey	P1Y	https://www.census.gov/programs-surveys/popest...	None	1926325.0
1	2023	geoId/06085	Santa Clara County	Count_Person	Total population	1145703171	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1903297.0
2	2020	geoId/06085	Santa Clara County	Count_Person	Total population	1541763368	USDecennialCensus_RedistrictingRelease	USDecennialCensus	None	https://www.census.gov/programs-surveys/decenn...	None	1936259.0
3	2024	geoId/06085	Santa Clara County	Count_Person	Total population	2390551605	USCensusPEP_AgeSexRaceHispanicOrigin	CensusPEPSurvey_Race2000Onwards	P1Y	https://www2.census.gov/programs-surveys/popes...	None	1926325.0
4	2023	geoId/06085	Santa Clara County	Count_Person	Total population	1964317807	CensusACS5YearSurvey_SubjectTables_S0101	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/table?q=S0101:+Age+and...	None	1903297.0
5	2022	geoId/06085	Santa Clara County	Count_Person	Total population	2564251937	CDC_Social_Vulnerability_Index	None	None	https://www.atsdr.cdc.gov/place-health/php/svi...	None	1916831.0
6	2020	geoId/06085	Santa Clara County	Count_Person	Total population	2825511676	CDC_Mortality_UnderlyingCause	None	None	https://wonder.cdc.gov/ucd-icd10.html	None	1907105.0
7	2019	geoId/06085	Santa Clara County	Count_Person	Total population	2517965213	CensusPEP	CensusPEPSurvey	None	https://www.census.gov/programs-surveys/popest...	None	1927852.0
8	2019	geoId/06085	Santa Clara County	Count_Person	Total population	1226172227	CensusACS1YearSurvey	CensusACS1yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	1927852.0
9	2024	country/USA	United States of America	Count_Person	Total population	2176550201	USCensusPEP_Annual_Population	CensusPEPSurvey	P1Y	https://www.census.gov/programs-surveys/popest...	None	340110988.0
10	2023	country/USA	United States of America	Count_Person	Total population	2645850372	CensusACS5YearSurvey_AggCountry	CensusACS5yrSurvey	None	https://www.census.gov/	None	335642425.0
11	2023	country/USA	United States of America	Count_Person	Total population	1145703171	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	332387540.0
12	2020	country/USA	United States of America	Count_Person	Total population	1541763368	USDecennialCensus_RedistrictingRelease	USDecennialCensus	None	https://www.census.gov/programs-surveys/decenn...	None	331449281.0
13	2024	country/USA	United States of America	Count_Person	Total population	3981252704	WorldDevelopmentIndicators	None	P1Y	https://datacatalog.worldbank.org/dataset/worl...	None	340110988.0
14	2024	country/USA	United States of America	Count_Person	Total population	2390551605	USCensusPEP_AgeSexRaceHispanicOrigin	CensusPEPSurvey_Race2000Onwards	P1Y	https://www2.census.gov/programs-surveys/popes...	None	340110988.0
15	2023	country/USA	United States of America	Count_Person	Total population	4181918134	OECDRegionalDemography_Population	OECDRegionalStatistics	P1Y	https://data-explorer.oecd.org/vis?fs[0]=Topic...	None	334914895.0
16	2023	country/USA	United States of America	Count_Person	Total population	1964317807	CensusACS5YearSurvey_SubjectTables_S0101	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/table?q=S0101:+Age+and...	None	332387540.0
17	2023	country/USA	United States of America	Count_Person	Total population	10983471	CensusACS5YearSurvey_SubjectTables_S2601A	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2601A&...	None	332387540.0
18	2023	country/USA	United States of America	Count_Person	Total population	196790193	CensusACS5YearSurvey_SubjectTables_S2602	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2602&t...	None	332387540.0
19	2023	country/USA	United States of America	Count_Person	Total population	217147238	CensusACS5YearSurvey_SubjectTables_S2603	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2603&t...	None	332387540.0
20	2020	country/USA	United States of America	Count_Person	Total population	2825511676	CDC_Mortality_UnderlyingCause	None	None	https://wonder.cdc.gov/ucd-icd10.html	None	329484123.0
21	2019	country/USA	United States of America	Count_Person	Total population	2517965213	CensusPEP	CensusPEPSurvey	None	https://www.census.gov/programs-surveys/popest...	None	328239523.0
22	2019	country/USA	United States of America	Count_Person	Total population	1226172227	CensusACS1YearSurvey	CensusACS1yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	328239523.0
23	2024	geoId/06	California	Count_Person	Total population	2176550201	USCensusPEP_Annual_Population	CensusPEPSurvey	P1Y	https://www.census.gov/programs-surveys/popest...	None	39431263.0
24	2023	geoId/06	California	Count_Person	Total population	1145703171	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	39242785.0
25	2020	geoId/06	California	Count_Person	Total population	1541763368	USDecennialCensus_RedistrictingRelease	USDecennialCensus	None	https://www.census.gov/programs-surveys/decenn...	None	39538223.0
26	2023	geoId/06	California	Count_Person	Total population	4181918134	OECDRegionalDemography_Population	OECDRegionalStatistics	P1Y	https://data-explorer.oecd.org/vis?fs[0]=Topic...	None	38965193.0
27	2023	geoId/06	California	Count_Person	Total population	1964317807	CensusACS5YearSurvey_SubjectTables_S0101	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/table?q=S0101:+Age+and...	None	39242785.0
28	2023	geoId/06	California	Count_Person	Total population	10983471	CensusACS5YearSurvey_SubjectTables_S2601A	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2601A&...	None	39242785.0
29	2023	geoId/06	California	Count_Person	Total population	196790193	CensusACS5YearSurvey_SubjectTables_S2602	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2602&t...	None	39242785.0
30	2020	geoId/06	California	Count_Person	Total population	2825511676	CDC_Mortality_UnderlyingCause	None	None	https://wonder.cdc.gov/ucd-icd10.html	None	39368078.0
31	2019	geoId/06	California	Count_Person	Total population	2517965213	CensusPEP	CensusPEPSurvey	None	https://www.census.gov/programs-surveys/popest...	None	39512223.0
32	2019	geoId/06	California	Count_Person	Total population	1226172227	CensusACS1YearSurvey	CensusACS1yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	None	39512223.0
33	2023	geoId/06085	Santa Clara County	Median_Age_Person	Median age of population	3795540742	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	Year	37.9
34	2023	geoId/06085	Santa Clara County	Median_Age_Person	Median age of population	815809675	CensusACS5YearSurvey_SubjectTables_S0101	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/table?q=S0101:+Age+and...	Years	37.9
35	2023	country/USA	United States of America	Median_Age_Person	Median age of population	3795540742	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	Year	38.7
36	2023	country/USA	United States of America	Median_Age_Person	Median age of population	815809675	CensusACS5YearSurvey_SubjectTables_S0101	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/table?q=S0101:+Age+and...	Years	38.7
37	2023	country/USA	United States of America	Median_Age_Person	Median age of population	2763329611	CensusACS5YearSurvey_SubjectTables_S2601A	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2601A&...	Years	38.7
38	2023	country/USA	United States of America	Median_Age_Person	Median age of population	3690003977	CensusACS5YearSurvey_SubjectTables_S2602	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2602&t...	Years	38.7
39	2023	country/USA	United States of America	Median_Age_Person	Median age of population	4219092424	CensusACS5YearSurvey_SubjectTables_S2603	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2603&t...	Years	38.7
40	2023	geoId/06	California	Median_Age_Person	Median age of population	3795540742	CensusACS5YearSurvey	CensusACS5yrSurvey	None	https://www.census.gov/programs-surveys/acs/da...	Year	37.6
41	2023	geoId/06	California	Median_Age_Person	Median age of population	815809675	CensusACS5YearSurvey_SubjectTables_S0101	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/table?q=S0101:+Age+and...	Years	37.6
42	2023	geoId/06	California	Median_Age_Person	Median age of population	2763329611	CensusACS5YearSurvey_SubjectTables_S2601A	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2601A&...	Years	37.6
43	2023	geoId/06	California	Median_Age_Person	Median age of population	3690003977	CensusACS5YearSurvey_SubjectTables_S2602	CensusACS5yrSurveySubjectTable	None	https://data.census.gov/cedsci/table?q=S2602&t...	Years	37.6
44	2025-08	country/USA	United States of America	UnemploymentRate_Person	Unemployment rate	3707913853	BLS_CPS	BLSSeasonallyAdjusted	P1M	https://www.bls.gov/cps/	None	4.3
45	2025-06	country/USA	United States of America	UnemploymentRate_Person	Unemployment rate	1714978719	BLS_CPS	BLSSeasonallyAdjusted	P3M	https://www.bls.gov/cps/	None	4.2
46	2025-08	geoId/06	California	UnemploymentRate_Person	Unemployment rate	324358135	BLS_LAUS	BLSSeasonallyUnadjusted	P1M	https://www.bls.gov/lau/	None	5.8
47	2024	geoId/06	California	UnemploymentRate_Person	Unemployment rate	2978659163	BLS_LAUS	BLSSeasonallyUnadjusted	P1Y	https://www.bls.gov/lau/	None	5.3
48	2025-08	geoId/06	California	UnemploymentRate_Person	Unemployment rate	1249140336	BLS_LAUS	BLSSeasonallyAdjusted	P1M	https://www.bls.gov/lau/	None	5.5
49	2025-08	geoId/06085	Santa Clara County	UnemploymentRate_Person	Unemployment rate	324358135	BLS_LAUS	BLSSeasonallyUnadjusted	P1M	https://www.bls.gov/lau/	None	4.6
50	2024	geoId/06085	Santa Clara County	UnemploymentRate_Person	Unemployment rate	2978659163	BLS_LAUS	BLSSeasonallyUnadjusted	P1Y	https://www.bls.gov/lau/	None	4.1
51	2022	geoId/06085	Santa Clara County	UnemploymentRate_Person	Unemployment rate	2564251937	CDC_Social_Vulnerability_Index	None	None	https://www.atsdr.cdc.gov/place-health/php/svi...	None	4.4
```
{% endtab %}

{% endtabs %}

</div>
