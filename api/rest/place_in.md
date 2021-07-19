---
layout: default
title: Places within a Place
nav_order: 5
parent: REST
grand_parent: API
---

# Retrieve all places contained within a place

Given a list of parent [`Place`](https://datacommons.org/browser/Place) DCIDs,
(e.g. any [`State`](https://datacommons.org/browser/State), [`Country`](https://datacommons.org/browser/Country), etc.), return a list of child places
contained within the specified DCIDs. Only returns children whose place type matches
the request's `placeType` parameter.

## General information about this endpoint

**URL**: `/node/places-in`

**Methods available**: `GET`, `POST`

**Required arguments**:

*   [`dcids`](/glossary.html): A list of (parent) `Place` nodes, identified by their DCIDs.

*   `placeType`: The type of the contained (child) `Place` nodes to filter by.

## How to construct a request to the places within a place endpoint

### Step 1: assembling the information you will need

This endpoint requires the argument `dcids`. DCIDs are unique node identifiers defined by Data Commons. Your query will need to specify the DCIDs for the parent places of interest.

This endpoint also requires the argument `placeType`, specifying the type of the child places you desire in the response.

### Step 2: creating the request

When actually putting together your request, you can choose from two options. If you intend to query only a small number of DCIDs, you may want to use the simpler formatting offered by the GET method. For larger numbers of DCIDs, or if you prefer to utilize a static URL, a POST request likely makes more sense. To use it, make a POST request against the main endpoint while changing the fields of the JSON body it sends.

Examples of usage for both GET and POST can be found below.

## What to expect in the response

Your response will always look like this:

```json
{
    "payload": "<payload string>",
}
```

Here `"<payload string>"` is a long encoded JSON string, whose structure changes depending on whether the response contains node references. You can run `JSON.parse()` on the `payload` field to retrieve the data. For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

After decoding the response payload string, its structure adheres to the following form:

```json
[
  {
    "dcid": "stringOfParentPlaceDCID",
    "place": "stringOfChildPlaceDCID"
  },
  ...
]
```

## Example requests and responses

### Example 1: Retrieve a list of the counties in Delaware.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/places-in?dcids=geoId%2F10&placeType=County'
```

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/node/places-in \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"geoId/10"
	],
	"placeType": "County"
}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/Lvt18jgd/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

```json
{
  "payload": [
    {
      "dcid": "geoId/10",
      "place": "geoId/10001"
    },
    {
      "dcid": "geoId/10",
      "place": "geoId/10003"
    },
    {
      "dcid": "geoId/10",
      "place": "geoId/10005"
    }
  ]
}
```

### Example 2: Retrieve a list of congressional districts in Alaska and Hawaii.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/places-in?dcids=geoId%2F15&dcids=geoId%2F02&placeType=CongressionalDistrict'
```

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/node/places-in \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"geoId/15",
		"geoId/02"
	],
	"placeType": "CongressionalDistrict"
}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/nw2dyose/3/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

```json
{
  "payload": [
    {
      "dcid": "geoId/15",
      "place": "geoId/1501"
    },
    {
      "dcid": "geoId/15",
      "place": "geoId/1502"
    },
    {
      "dcid": "geoId/02",
      "place": "geoId/0200"
    }
  ]
}
```

## Error Responses

If your request is malformed in some way, you will receive a 400 status code and an error message like the following:

```json
{
  "code": 3,
  "message": "Missing required arguments",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```