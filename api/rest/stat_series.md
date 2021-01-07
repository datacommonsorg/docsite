---
layout: default
title: Place Statistics - Time Series
nav_order: 11
parent: REST
grand_parent: API
---

# Get Statistical Time Series for a Place

Returns a time series of statistical values for a place based on a
[`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).
See the [full list of StatisticalVariables](/statistical_variables.html).

When there are multiple sources for the same statistical variable, a prefered
source with more recent or more authorative data is selected.

## General information about this endpoint

**URL**: `/stat/series`

**Method**: `GET`

**Required Arguments**:

- `place`: The `dcid` of the [`Place`](https://datacommons.org/browser/Place) to query for.
- `stat_var`: The `dcid` of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

**Optional Arguments**:

- `measurement_method`: The `dcid` of the preferred `measurementMethod` value.
- `observation_period`: The preferred `observationPeriod` value.
- `unit`: The dcid of the preferred `unit` value.
- `scaling_factor`: The preferred `scalingFactor` value.

## How to construct a request to the place statistics time series endpoint

### Step 1: Assembling the information you will need

>  **NOTE:**
>
>  Specifying arguments that do not exist for the target place and variable will result in an empty response.

Going into more detail on how to assemble the values for the required arguments:

 - `place`: For this parameter, you will need to specify the DCID (the unique ID assigned by Data Commons to each node in the graph) of the place you are interested in.
 - `stat_var`: The statistical variable whose value you are interested in.

In addition to these required properties, this endpoint also allows for other, optional arguments. Here are helpful arguments in regular use by Data Commons developers:

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
  "value": <number>
}
```

## Example requests and responses

### Example 1: Retrieve the count of men in the state of California.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/series?place=geoId%2F06&stat_var=Count_Person_Male'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log JavaScript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/w32gmo68/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

### Example 2: Retrieve the number of people in Bosnia and Herzegovina as counted by the Bosnian census.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/series?place=country%2FBIH&stat_var=Count_Person&measurement_method=BosniaCensus'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log JavaScript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/sL4r6ckm/4/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

### Example 3: Retrieve the death count in Miami-Dade County over a period of one year.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/series?place=geoId%2F12086&stat_var=Count_Death&observation_period=P1Y'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log JavaScript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/2w9sphqc/2/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

### Example 4: Retrieve the distribution of the drug naloxone in Miami-Dade County in grams.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/series?place=geoId%2F12086&stat_var=RetailDrugDistribution_DrugDistribution_Naloxone&unit=Grams'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log JavaScript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/6y9tbdh5/5/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

### Example 5: Retrieve the percentage of nominal GDP spent by the government of the Gambia on education.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/series?place=country%2FGMB&stat_var=Amount_EconomicActivity_ExpenditureActivity_EducationExpenditure_Government_AsFractionOf_Amount_EconomicActivity_GrossDomesticProduction_Nominal&scalingFactor=100.0000000000'
```

{% endtab %}

{% tab log POST Request %}

This endpoint does not support POST requests.

{% endtab %}

{% tab log JavaScript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/1gmewbvx/13/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

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
