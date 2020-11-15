---
layout: default
title: Places within a Place
nav_order: 9
parent: REST
grand_parent: API
---

# Retrieve all places contained within a place

Given a list of parent [`Place`](https://datacommons.org/browser/Place) DCIDs,
(e.g. `County`, `State`, `Country`, etc...), return a list of child places
contained within the specified DCIDs. Only returns children whose place type matches
the request's `placeType` parameter.

## General information about this endpoint

**URL**: `/node/places-in`

**Method**: `GET`, `POST`

**Auth required**: Optional

**Required Arguments**:

*   `dcids`: A list of (parent) places, identified by their DCIDs.

*   `placeType`: The type of the contained (child) `Places` to filter by. For example, `City` and `County` are contained within `State`. For a
    full list of available types, see [the Data Commons graph browser entry for `Place`](https://datacommons.org/browser/Place).

**Optional Arguments**:

*   `key`: Your API key.

## How to construct a request to the places within a place endpoint

### Step 1: assembling the information you will need

This endpoint requires the argument `DCIDs`. DCIDs are unique node identifiers defined by Data Commons. Your query will need to specify the DCIDs for the parent places of interest.

This endpoint also requires the argument `placeType`, specifying the type of the child places you desire in the response.

In addition to these required properties, this endpoint also allows you to specify your API key as an optional argument.

### Step 2: creating the request

When actually putting together your request, you can choose from two options. If you intend to query only a small number of DCIDs, you may want to use the simpler formatting offered by the GET method. For larger numbers of DCIDs, or if you prefer to utilize a static URL, a POST request likely makes more sense. To use it, make a POST request against the main endpoint while changing the fields of the JSON body it sends.

## What to expect in the response

Your response will always look like this:

```json
{
    "payload": "<payload string>",
}
```

Here `"<payload string>"` is replaced by JSON, whose structure adheres to the following form:

```json
[
  {
    "dcid": "string",
    "place": "string"
  },
  ...
]
```

**NOTES:** 
 - You can run `JSON.parse()` on the `payload` field to retrieve the data. For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

## Example requests and responses

### Example 1: Retrieve a list of the counties in Delaware.

#### GET Request

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/places-in?dcids=geoId%2F10&placeType=County'
```

#### POST Request

```curl
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

#### GET Request

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/places-in?dcids=geoId%2F15&dcids=geoId%2F02&placeType=CongressionalDistrict'
```

#### POST Request

```curl
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

In general, if your request is malformed in some way, you will receive a 400 status code and an error message like the following:

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