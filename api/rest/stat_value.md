---
layout: default
title: Place Statistics - Single Value
nav_order: 7
parent: REST (v0)
grand_parent: API
---

# Retrieve a statistical value for a place

Returns a statistical value for a place based on the
[`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).
See the [full list of StatisticalVariables](/statistical_variables.html).

When there are multiple sources for the same statistical variable, a prefered
source with more recent data or more authority is selected.

## General information about this endpoint

**URL**: `/stat/value`

**Methods available**: `GET`

**Required arguments**:

* `place`: The [DCID](https://docs.datacommons.org/glossary.html) of the [`Place`](https://datacommons.org/browser/Place) to query for.
* [`stat_var`](/glossary.html): The DCID of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable). More information is available in [the glossary](https://docs.datacommons.org/glossary.html).

You can find a list of StatisticalVariables with human-readable names [within this documentation](/statistical_variables.html).

**Optional arguments**:

* `date`: The preferred date of observation in ISO 8601 format. If not specified, returns the latest observation.
* [`measurement_method`](/glossary.html): The DCID of the preferred `measurementMethod` value.
* [`observation_period`](/glossary.html): The preferred `observationPeriod` value.
* [`unit`](/glossary.html): The DCID of the preferred `unit` value.
* [`scaling_factor`](/glossary.html): The preferred `scalingFactor` value.

## How to construct a request to the place statistics value endpoint

### Step 1: Assembling the information you will need

Going into more detail on how to assemble the values for the required arguments:

 - `place`: For this parameter, you will need to specify the [DCID](https://docs.datacommons.org/glossary.html) (the unique ID assigned by Data Commons to each node in the graph) of the place you are interested in.
 - `stat_var`: The [statistical variable](https://docs.datacommons.org/glossary.html) whose value you are interested in.

In addition to these required properties, this endpoint also allows for other, optional arguments. Here are helpful arguments in regular use by Data Commons developers:

  - [`date`](https://docs.datacommons.org/glossary.html): Specified in ISO 8601 format. Examples include `2011` (the year 2011), `2019-06` (the month of June in the year 2019), and `2019-06-05T17:21:00-06:00` (5:17PM on June 5, 2019, in CST).

  - [`measurement_method`](https://docs.datacommons.org/glossary.html): The technique used for measuring a statistical variable.

  - [`observation_period`](https://docs.datacommons.org/glossary.html): The time period over which an observation is made.

  - [`unit`](https://docs.datacommons.org/glossary.html): The unit of measurement.

  - [`scaling_factor`](https://docs.datacommons.org/glossary.html): Property of statistical variables indicating factor by which a measurement is multiplied to fit a certain format.

### Step 2: Creating the request

Since only the GET method is available for this endpoint, you will need to assemble the request via query parameters in the URL.

## What to expect in the response

Your response will always look like this:

```json
{
  "value": integer
}
```

## Example requests and responses

### Example 1: Retrieve the count of men in the state of California.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=geoId/06&stat_var=Count_Person_Male'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/43c8arob/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

### Example 2: Retrieve the count of robberies in the state of Georgia in the year 2011.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=geoId/13&stat_var=Count_CriminalActivities_Robbery&date=2011'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/g04ydh9v/5/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

### Example 3: Retrieve the number of people in Bosnia and Herzegovina as counted by the Bosnian census.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=country/BIH&stat_var=Count_Person&measurement_method=BosniaCensus'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/dnk3bh10/3/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

### Example 4: Retrieve the death count in Miami-Dade County over a period of one year.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=geoId/12086&stat_var=Count_Death&observation_period=P1Y'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/7okp90wb/4/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

### Example 5: Retrieve the distrubtion of the drug naloxone in Miami-Dade County in grams.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=geoId/12086&stat_var=RetailDrugDistribution_DrugDistribution_Naloxone&unit=Grams'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/0steafk4/2/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

### Example 6: Retrieve the percentage of nominal GDP spent by the government of the Gambia on education.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=country/GMB&stat_var=Amount_EconomicActivity_ExpenditureActivity_EducationExpenditure_Government_AsFractionOf_Amount_EconomicActivity_GrossDomesticProduction_Nominal&scalingFactor=100.0000000000'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/rm1kpfdn/2/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

## Error Responses

If your request does not include a required argument, you will receive a 400 status code and an error message like the following:

```json
{
  "code": 3,
  "message": "Missing required argument: stat_var",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```
If your request includes a bad argument, you will receive a 404 status code and an error message like the following:

```json
{
  "code": 5,
  "message": "No statistical variable found for CountPerson_Male",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```
