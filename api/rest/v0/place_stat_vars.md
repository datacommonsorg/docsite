---
layout: default
title: Place Statistical Variables
nav_order: 6
parent: REST
grand_parent: API
---

# Retrieve all statistical variables available for a particular place

Given a list of [`Place`](https://datacommons.org/browser/Place) DCIDs,
(e.g. any [`State`](https://datacommons.org/browser/State), [`Country`](https://datacommons.org/browser/Country), etc.), return a list of statistical variables available for the specified DCIDs.

## General information about this endpoint

**URL**: `/place/stat-vars`

**Methods available**: `GET`, `POST`

**Required arguments**:

*   [`dcids`](/glossary.html): A list of `Place` nodes, identified by their DCIDs.

## How to construct a request to the place statistical variables endpoint

### Step 1: assembling the information you will need

This endpoint requires the argument `dcids`. DCIDs are unique node identifiers defined by Data Commons. Your query will need to specify the DCIDs for the parent places of interest.

### Step 2: creating the request

When actually putting together your request, you can choose from two options. If you intend to query only a small number of DCIDs, you may want to use the simpler formatting offered by the GET method. For larger numbers of DCIDs, or if you prefer to utilize a static URL, a POST request likely makes more sense. To use it, make a POST request against the main endpoint while changing the fields of the JSON body it sends.

Examples of usage for both GET and POST can be found below.

## What to expect in the response

Your response will always look like this:

```json
{
  "places": {
    <dcid>: {
      "statVars": [
        <dcid>,
        ...
      ]
    },
    ...
  }
}
```

## Example requests and responses

### Example 1: Retrieve a list of the statistical variables available for the country of Palau.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/place/stat-vars?dcids=country%2FPLW'
```

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/place/stat-vars \
  --header 'content-type: application/json' \
  --data '{
    "dcids": [
      "country/PLW"
    ]
  }'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/7dLstpav/7/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

```json
{
  "places": {
    "country/PLW": {
      "statVars": [
        "MortalityRate_Person_Upto4Years_AsFractionOf_Count_BirthEvent_LiveBirth",
        "LifeExpectancy_Person_Male",
        "LifeExpectancy_Person_Female",
        "LifeExpectancy_Person",
        ...
      ]
    }
  }
}
```

### Example 2: Retrieve a list of statistical variables available for the cities of Dodoma and Dar es Salaam, Tanzania.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/place/stat-var?dcids=wikidataId%2FQ1960&dcids=wikidataId%2FQ3866'
```

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/place/stat-vars \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"wikidataId/Q1960",
		"wikidataId/Q3866"
	]
}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/gfc0a7d5/6/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

</div>

#### Response

```json
{
  "places": {
    "wikidataId/Q1960": {
      "statsVars": [
        "Count_Person"
      ]
    },
    "wikidataId/Q3866": {
      "statsVars": [
        "Count_Person"
      ]
    }
  }
}
```

## Error Responses

If your request is malformed in some way, you will receive a 400 status code and an error message like the following:

```json
{
  "code": 3,
  "message": "Missing required arguments: dcid",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```