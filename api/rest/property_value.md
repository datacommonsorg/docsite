---
layout: default
title: Property Value
nav_order: 4
parent: REST
grand_parent: API
---

# Retrieve property values

This endpoint is suitable for situations in which you have a node or list of nodes and desire to obtain the values of specified properties attached to those nodes. 

## General information about this endpoint

**URL**: `/node/property-values`

**Methods available**: `GET`, `POST`

**Authentication**: Optional

**Required arguments**:

*   `dcids`: A list of nodes to query, identified by their DCID.
*   `property`: The property label to query for.

**Optional arguments**:

*   `valueType`: The type of the property value to filter by. Only applicable if
    the value refers to a node.
*   `direction`: The label's direction. Only valued as `out` (returning response nodes directed towards the requested node) or `in` (returning response nodes directed away from the request node).
*   `limit`: (≤ 500) Maximum number of values returned per node.
*   `key`: Your API key.

## How to construct a request to the property value endpoint

### Step 1: Assembling the information you will need

This endpoint requires two arguments and offers four additional optional arguments, as listed:

 - `dcids`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest.
 - `property`: The property whose value you are interested in.

In addition to these required properties, this endpoint also allows for other, optional arguments.

  - `valueType`: If the property queried only takes on node values, you can use this argument to filter nodes in the response, ensuring the response only contains nodes with the specified type.

  - `direction`: You can specify this argument as `out` to indicate that you desire the response to only include nodes which are supercategories of the specified `DCIDs`, or `in` to only return nodes that are subcategories of the specified `DCIDs`. (For example, South America is a supercategory of Argentina, which in turn is a supercategory of Buenos Aires.)
  
  - `limit`: (≤ 500) Maximum number of values returned per node.

  - `key`: Your API key.

### Step 2: Creating the request

When actually putting together your request, you can choose from two options. If you intend to use only a small number of parameters, you may want to use the simpler formatting offered by the GET method, which makes requests against the main endpoint while altering the query parameters incorporated into the URL. For more complex queries, or if you prefer to utilize a static URL, a POST request likely makes more sense. To use it, make a POST request against the main endpoint while changing the fields of the JSON body it sends.

## What to expect in the response

Your response will always look like this:

```json
{
    "payload": "<payload string>",
}
```

Here `"<payload string>"` is replaced by JSON, whose structure changes depending on whether the response contains node references.

**Structure 1:** Response for property values that are not node references.

```json
{
    "dcid": {
        "direction": [
          {
            "value": "string",
            "provenanceId": "string"
          },
          ...
        ]
    },
    ...
}
```

**Structure 2:** Response for property values that are node references.

```json
{
    "dcid":
        {
        "direction": [
            {
              "dcid": "string",
              "name": "string",
              "provenanceId": "string",
              "types": "string[]"
            },
            ...
        ]
    },
    ...
}
```

**NOTES:** 
 - The `provenanceId` is the DCID of the provenance for the corresponding value.
 - You can run `JSON.parse()` on the `payload` field to retrieve the data. For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

## Example requests and responses

### Example 1: Retrieve the order to which the plant _Austrobaileya scandens_ belongs.

#### GET Request

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=dc%2Fbsmvthtq89217&property=order'
```

#### POST Request

```curl
curl --request POST \
  --url https://api.datacommons.org/node/property-values \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"dc/bsmvthtq89217"
	],
	"property": "order"
}'
```

#### Response

```json
{
  "payload": {
    "dc/bsmvthtq89217": {
      "out": [
        {
          "provenanceId": "dc/93qydx3",
          "value": "Austrobaileyales"
        }
      ]
    }
  }
}
```

### Example 2: Retrieve the addresses of Stuyvesant High School in New York and Gunn High School in California.

#### GET Request

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=nces%2F360007702877&dcids=nces%2F062961004587&property=address'
```

#### POST Request

```curl
curl --request POST \
  --url https://api.datacommons.org/node/property-values \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"nces/360007702877",
		"nces/062961004587"
	],
	"property": "address"
}'
```

#### Response

```json
{
  "payload": {
    "nces/062961004587": {
      "out": [
        {
          "provenanceId": "dc/mzy8we",
          "value": "780 Arastradero Rd., Palo Alto, California"
        }
      ]
    },
    "nces/360007702877": {
      "out": [
        {
          "provenanceId": "dc/mzy8we",
          "value": "345 Chambers St, New York, New York"
        }
      ]
    }
  }
}
```

### Example 3: Retrieve a list of earthquakes in Madagascar.

#### GET Request

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=country%2FMDG&property=affectedPlace&valueType=EarthquakeEvent'
```

#### POST Request

```curl
curl --request POST \
  --url https://api.datacommons.org/node/property-values \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"country/MDG"
	],
	"property": "affectedPlace",
	"valueType": "EarthquakeEvent"
}'
```

#### Response

```json
{
  "payload": {
    "country/MDG": {
      "in": [
        {
          "dcid": "earthquake/usp000jgbb",
          "name": "Madagascar",
          "provenanceId": "dc/xz8ndk3",
          "types": [
            "EarthquakeEvent"
          ]
        },
        ...
      ]
    }
  }
}
```

### Example 4: Retrieve just one cyclone in India.

#### GET Request

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=country%2FIND&property=affectedPlace&valueType=CycloneEvent&limit=1'
```

#### POST Request

```curl
curl --request POST \
  --url https://api.datacommons.org/node/property-values \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"country/IND"
	],
	"property": "affectedPlace",
	"valueType": "CycloneEvent",
	"limit": 1
}'
```

#### Response

```json
{
  "payload": {
    "country/IND": {
      "in": [
        {
          "dcid": "cyclone/ibtracs_2019117N05088",
          "name": "Fani",
          "provenanceId": "dc/xwq0y5",
          "types": [
            "CycloneEvent"
          ]
        }
      ]
    }
  }
}
```

### Example 5: Retrieve the country in which Buenos Aires is located.

#### GET Request

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=wikidataId%2FQ1486&property=containedInPlace&direction=out'
```

#### POST Request

```curl
curl --request POST \
  --url https://api.datacommons.org/node/property-values \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"wikidataId/Q1486"
	],
	"property": "containedInPlace",
	"direction": "out"
}'
```

#### Response

```json
{
  "payload": {
    "wikidataId/Q1486": {
      "out": [
        {
          "dcid": "country/ARG",
          "name": "Argentina",
          "provenanceId": "dc/5n63hr1",
          "types": [
            "Country"
          ]
        }
      ]
    }
  }
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