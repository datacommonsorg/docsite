---
layout: default
title: Place Statistics - Single Value
nav_order: 10
parent: REST
grand_parent: API
---

# Retrieve statistical value for a place

Returns a statistical value for a place based on the
[`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).
See the [full list of StatisticalVariables](/statistical_variables.html).

When there are multiple sources for the same statistical variable, a prefered
source with more recent data or more authorative is selected.

## General information about this endpoint

**URL**: `/stat/value`

**Methods available**: `GET`

**Authentication**: Optional

**Required arguments**:

* `place`: The DCID of the [`Place`](https://datacommons.org/browser/Place) to query for.
* `stat_var`: The DCID of the [`StatisticalVariable`](https://datacommons.org/browser/StatisticalVariable).

You can find a list of StatisticalVariables with human-readable names [here](/statistical_variables.html).

**Optional arguments**:

* `date`: The preferred date of observation in ISO 8601 format. If not specified, returns the latest observation.
* `measurement_method`: The DCID of the preferred `measurementMethod` value.
* `observation_period`: The preferred `observationPeriod` value.
* `unit`: The DCID of the preferred `unit` value.
* `scaling_factor`: The preferred `scalingFactor` value.

## How to construct a request to the place statistics value endpoint

### Step 1: Assembling the information you will need

This endpoint requires two arguments and offers five additional optional arguments, as listed:

 - `place`: For this parameter, you will need to specify the DCID (the unique ID assigned by Data Commons to each node in the graph) of the place you are interested in.
 - `stat_var`: The statistical variable whose value you are interested in.

In addition to these required properties, this endpoint also allows for other, optional arguments.

  - `date`: If the property queried only takes on node values, you can use this argument to filter nodes in the response, ensuring the response only contains nodes with the specified type.

  - `measurement_method`: You can specify this argument as `out` to indicate that you desire the response to only include nodes which are supercategories of the specified `DCIDs`, or `in` to only return nodes that are subcategories of the specified `DCIDs`. (For example, South America is a supercategory of Argentina, which in turn is a supercategory of Buenos Aires, as illustrated in Figure 1.)
  
  - `observation_period`: (≤ 500) Maximum number of values returned per node.

  - `unit`: The unit of measurement.

  - `scaling_factor`: 

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

{% tab log curl %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=geoId%2F06&stat_var=Count_Person_Male'
```

{% endtab %}

{% tab log js %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/43c8arob/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

### Example 2: Retrieve the count of robberies in the state of Georgia in the year 2011.

<div>

{% tabs log %}

{% tab log curl %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=geoId%2F13&stat_var=Count_CriminalActivities_Robbery&date=2011'
```

{% endtab %}

{% tab log js %}

<!-- TODO need to change the jsfiddle -->

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/43c8arob/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

### Example 3: Retrieve the number of people in Bosnia and Herzegovina as counted by the Bosnian census.

<div>

{% tabs log %}

{% tab log curl %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=country%2FBIH&stat_var=Count_Person&measurement_method=BosniaCensus'
```

{% endtab %}

{% tab log js %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/43c8arob/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

### Example 4: Retrieve the death count in Miami-Dade County over a period of one year.

<div>

{% tabs log %}

{% tab log curl %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=geoId%2F12086&stat_var=Count_Death&observation_period=P1Y'
```

{% endtab %}

{% tab log js %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/43c8arob/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

### Example 5: Retrieve the distrubtion of naloxone in Miami-Dade County in grams.

<div>

{% tabs log %}

{% tab log curl %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=geoId%2F12086&stat_var=RetailDrugDistribution_DrugDistribution_Naloxone&unit=Grams'
```

{% endtab %}

{% tab log js %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/43c8arob/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

### Example 6: Retrieve the percentage of nominal GDP spent by the government of the Gambia on education.

<div>

{% tabs log %}

{% tab log curl %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/stat/value?place=country%2FGMB&stat_var=Amount_EconomicActivity_ExpenditureActivity_EducationExpenditure_Government_AsFractionOf_Amount_EconomicActivity_GrossDomesticProduction_Nominal&scalingFactor=100.0000000000'
```

{% endtab %}

{% tab log js %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/43c8arob/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
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
