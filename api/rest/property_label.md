---
layout: default
title: Property Label
nav_order: 3
parent: REST
grand_parent: API
---

# Retrieve property labels

This endpoint is suitable for situations in which you have a node or list of nodes and desire to obtain the labels of all properties defined for those nodes. 

## General information about this endpoint

**URL**: `/node/property-labels`

**Method**: `GET`, `POST`

**Auth required**: Optional

**Required Arguments**:

*   `dcids`: A list of nodes to query, identified by their `DCIDs`.

**Optional Arguments**:

*   `key`: Your API key.

## How to construct a request to the property label endpoint

### Step 1: Assembling the information you will need

This endpoint requires the argument `dcids`, which are unique node identifiers defined by Data Commons. Your query will need to specify the DCIDs for the nodes of interest.

In addition to this required property, this endpoint also allows you to specify your API key as an optional argument.

### Step 2: Creating the request

When actually putting together your request, you can choose from two options. If you intend to query only a small number of DCIDs, you may want to use the simpler formatting offered by the GET method. For larger numbers of DCIDs, or if you prefer to utilize a static URL, a POST request likely makes more sense. To use it, make a POST request against the main endpoint while changing the fields of the JSON body it sends.

## What to expect in the response

Your response will always look like this:

```json
{
    "payload": "<payload string>",
}
```

Here `"<payload string>"` is a long encoded JSON string, whose structure changes depending on whether the response contains node references. You can run `JSON.parse()` on the `payload` field to retrieve the data. For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

Here is the structure the response payload string adheres to after decoding:

```json
{
    "dcid": {
        "inLabels": [
            "label",
            ...
        ],
        "outLabels": [
            "label",
            ...
        ]
    },
    ...
}
```

For each node, `inLabels` contains labels directed towards the node while
`outLabels` contains labels directed away from the node.

## Example requests and responses

### Example 1: Retrieve the property labels of Wisconsin's eighth congressional district.

<div>

{% tabs log %}

{% tab log GET Request %}

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/property-labels?dcids=geoId%2F5508'
```

{% endtab %}

{% tab log POST Request %}

```curl
curl --request POST \
  --url https://api.datacommons.org/node/property-labels \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"geoId/5508"
	]
}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/6n58xeyj/17/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

```json
{
  "payload": {
    "geoId/5508": {
      "inLabels": [
        "containedInPlace",
        "geoOverlaps",
        "location"
      ],
      "outLabels": [
        "containedInPlace",
        "geoId",
        "geoJsonCoordinates",
        "geoOverlaps",
        "kmlCoordinates",
        "landArea",
        "latitude",
        "longitude",
        "name",
        "provenance",
        "typeOf",
        "waterArea"
      ]
    }
  }
}
```

### Example 2: Retrieve the property labels of two different leukocyte cell lines.

<div>

{% tabs log %}

{% tab log GET Request %}

```curl
curl --request GET \
  --url 'https://api.datacommons.org/node/property-labels?dcids=dc%2Fc3j78rpyssdmf&dcids=dc%2F7hfhd2ek8ppd2'
```

{% endtab %}

{% tab log POST Request %}

```curl
curl --request POST \
  --url https://api.datacommons.org/node/property-labels \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"dc/c3j78rpyssdmf",
		"dc/7hfhd2ek8ppd2"
	]
}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/rauh4kyL/16/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

```json
{
  "payload": {
    "dc/7hfhd2ek8ppd2": {
      "inLabels": [
        "biosampleOntology"
      ],
      "outLabels": [
        "cellSlims",
        "classification",
        "dbxrefs",
        "developmentalSlims",
        "encodeUUID",
        "name",
        "organSlims",
        "provenance",
        "sameAs",
        "status",
        "systemSlims",
        "termId",
        "termName",
        "typeOf"
      ]
    },
    "dc/c3j78rpyssdmf": {
      "inLabels": [
        "biosampleOntology"
      ],
      "outLabels": [
        "cellSlims",
        "classification",
        "dbxrefs",
        "encodeUUID",
        "name",
        "provenance",
        "sameAs",
        "status",
        "systemSlims",
        "termId",
        "termName",
        "typeOf"
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