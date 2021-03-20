---
layout: default
title: Union of Place Statistical Variables
nav_order: 13
parent: REST
grand_parent: API
---

# Retrieve all statistical variables available for a particular place

Given a list of [`Place`](https://datacommons.org/browser/Place) DCIDs,
(e.g. any [`State`](https://datacommons.org/browser/State), [`Country`](https://datacommons.org/browser/Country), etc.), return a union of statistical variables available for the specified DCIDs.

## General information about this endpoint

**URL**: `/place/stat-vars/union`

**Methods available**: `POST`

**Required arguments**:

*   [`dcids`](/glossary.html): A list of `Place` nodes, identified by their DCIDs.

## Example requests and responses

### Example 1: Retrieve a list of the union of statistical variables available for the countries of Bolivia and Bhutan.

<div>

{% tabs log %}

{% tab log GET Request %}

This endpoint does not support GET requests.

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/place/stat-vars/union \
  --header 'content-type: application/json' \
  --data '{ "dcids": ["country/BTN", "country/BOL"]}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/tzowhea3/14/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

```json
{
  "statVars": {
    "statVars": [
      "Amount_Consumption_Alcohol_15OrMoreYears_AsFractionOf_Count_Person_15OrMoreYears",
      "Amount_Consumption_Electricity_PerCapita",
      "Amount_Consumption_Energy_PerCapita",
      "Amount_Consumption_RenewableEnergy_AsFractionOf_Amount_Consumption_Energy",
      ...
    ]
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