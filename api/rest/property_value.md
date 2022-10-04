---
layout: default
title: Property Value
nav_order: 4
parent: REST (v0)
grand_parent: API
---

# Retrieve property values of nodes

This endpoint is suitable for situations in which you have a node or list of nodes and desire to obtain the values of a specified property attached to those nodes.

## General information about this endpoint

**URL**: `/node/property-values`

**Methods available**: `GET`, `POST`

**Required arguments**:

*   [`dcids`](/glossary.html): A list of nodes to query, identified by their [DCID](/glossary.html).
*   `property`: The property to query for.

**Optional arguments**:

*   `valueType`: The type of the property value to filter by. Only applicable if
    the value refers to a node.
*   [`direction`](/glossary.html): The label's direction. Only valid values are `out` (returning response nodes directed towards the requested node) and `in` (returning response nodes directed away from the request node).
*   `limit`: (≤ 500) Maximum number of values returned per node.

## How to construct a request to the property value endpoint

### Step 1: Assembling the information you will need

Going into more detail on how to assemble the values for the required arguments:

 - `dcids`: Data Commons uniquely identifies nodes by assigning them DCIDs, or Data Commons IDs. Your query will need to specify the DCIDs for the nodes of interest.

 - `property`: The property whose value you are interested in, such as "name" for the name of a node, or "typeOf" for the type of a node.

In addition to these required properties, this endpoint also allows for other, optional arguments. Here are helpful arguments in regular use by Data Commons developers:

  - `valueType`: If the property queried only takes on node values, you can use this argument to filter nodes in the response, ensuring the response only contains nodes with the specified type.

  - `direction`: This refers to the orientation, or direction, of the edge. You can specify this argument as `out` to indicate that you desire the response to only include nodes with the value of the property equivalent to one or more of the specified `DCIDs`, or `in` to only return nodes equivalent to one or more of the values of the properties of the specified `DCIDs`. (To visualize this, Figure 1 illustrates the directions for the property `containedInPlace` of the node for Argentina.)

![](/assets/images/rest/property_value_direction_example.png)

*Figure 1. Relationship diagram for the property `containedInPlace` of the country Argentina. Note the directionality of the property `containedInPlace`: the API returns both nodes with direction `in` (Buenos Aires is `containedInPlace` of Argentina) and nodes with direction `out` (Argentina is `containedInPlace` of South America).*

### Step 2: Creating the request

When actually putting together your request, you can choose from two options. If you intend to use only a small number of parameters, you may want to use the simpler formatting offered by the GET method, which makes requests against the main endpoint while altering the query parameters incorporated into the URL. For more complex queries, or if you prefer to utilize a static URL, a POST request likely makes more sense. To use it, make a POST request against the main endpoint while changing the fields of the JSON body it sends.

## What to expect in the response

Your response will always look like this:

```json
{
    "payload": "<payload string>",
}
```

Here `"<payload string>"` is a long encoded JSON string, whose structure changes depending on whether the response contains node references. You can run `JSON.parse()` on the `payload` field to retrieve the data. For example, in javascript: `var data = JSON.parse(response['payload'])`.

After decoding the response payload string, there are two possible structures it could adhere to.

**Structure 1:** Decoded response payload string for property values that are not node references.

```json
{
    "<dcid>": {
        "<direction>": [
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

**Structure 2:** Decoded response payload string for property values that are node references.

```json
{
    "<dcid>":
        {
        "<direction>": [
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

**NOTE:** The `provenanceId` is the DCID of the provenance for the corresponding value.

## Example requests and responses

### Example 1: Retrieve the common names of the country of Côte d'Ivoire.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=country%2FCIV&property=name'
```

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/node/property-values \
  --header 'content-type: application/json' \
  --data '{
    "dcids": [
      "country/CIV"
    ],
    "property": "name"
  }'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/xbnsqo4a/4/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

##### Raw

```json
{
  "payload": "{\"country/CIV\":{\"out\":[{\"provenanceId\":\"dc/5n63hr1\",\"value\":\"Ivory Coast\"},{\"provenanceId\":\"dc/5n63hr1\",\"value\":\"Côte d'Ivoire\"}]}}"
}
```

##### Parsed and prettified

```json
{
  "payload": {
    "country/CIV": {
      "out": [
        {
          "provenanceId": "dc/5n63hr1",
          "value": "Ivory Coast"
        },
        {
          "provenanceId": "dc/5n63hr1",
          "value": "Côte d'Ivoire"
        }
      ]
    }
  }
}
```

### Example 2: Retrieve the order to which the plant _Austrobaileya scandens_ belongs.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=dc%2Fbsmvthtq89217&property=order'
```

{% endtab %}

{% tab log POST Request %}

```bash
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

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/d5npo3ue/17/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

##### Raw

```json
{
  "payload": "{\"dc/bsmvthtq89217\":{\"out\":[{\"provenanceId\":\"dc/93qydx3\",\"value\":\"Austrobaileyales\"}]}}"
}
```

##### Parsed and prettified

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

### Example 3: Retrieve the addresses of Stuyvesant High School in New York and Gunn High School in California.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=nces%2F360007702877&dcids=nces%2F062961004587&property=address'
```

{% endtab %}

{% tab log POST Request %}

```bash
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

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/94s2c5bp/4/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

##### Raw

```json
{
  "payload": "{\"nces/062961004587\":{\"out\":[{\"provenanceId\":\"dc/mzy8we\",\"value\":\"780 Arastradero Rd., Palo Alto, California\"}]},\"nces/360007702877\":{\"out\":[{\"provenanceId\":\"dc/mzy8we\",\"value\":\"345 Chambers St, New York, New York\"}]}}"
}
```

##### Parsed and prettified

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

### Example 4: Retrieve a list of earthquake events in Madagascar.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=country%2FMDG&property=affectedPlace&valueType=EarthquakeEvent'
```

{% endtab %}

{% tab log POST Request %}

```bash
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

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/fp7sa9v8/16/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

##### Raw

```json
{
  "payload": "{\"country/MDG\":{\"in\":[{\"dcid\":\"earthquake/usp000jgbb\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp000h6zw\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp000gmuf\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp000fu24\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp000dckw\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp0008vc6\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp0007k9j\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp0005gu9\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp0004qn4\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp0002kfd\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp00020ud\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp0001ss5\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp0001fcd\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp0000afz\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp00006yt\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usp00005zf\",\"name\":\"Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/usc000evr6\",\"name\":\"8km NW of Anakao, Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/us60003r15\",\"name\":\"50km ESE of Ambanja, Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]},{\"dcid\":\"earthquake/us200040me\",\"name\":\"25km W of Antalaha, Madagascar\",\"provenanceId\":\"dc/xz8ndk3\",\"types\":[\"EarthquakeEvent\"]}]}}"
}
```

##### Parsed and prettified

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

### Example 5: Retrieve just one cyclone event in India.

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=country%2FIND&property=affectedPlace&valueType=CycloneEvent&limit=1'
```

{% endtab %}

{% tab log POST Request %}

```bash
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

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/yf7sgz25/8/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

##### Raw

```json
{
  "payload": "{\"country/IND\":{\"in\":[{\"dcid\":\"cyclone/ibtracs_2019117N05088\",\"name\":\"Fani\",\"provenanceId\":\"dc/xwq0y5\",\"types\":[\"CycloneEvent\"]}]}}"
}
```

##### Parsed and prettified

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

### Example 6: Retrieve the country in which Buenos Aires is located.

![](/assets/images/rest/property_value_direction_example.png)

*Figure 2. Relationship diagram for the property `containedInPlace` of the country Argentina. Note the directionality of the property `containedInPlace`: the API returns both nodes with direction `in` (Buenos Aires is `containedInPlace` of Argentina) and nodes with direction `out` (Argentina is `containedInPlace` of South America).*

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/property-values?dcids=country/ARG&property=containedInPlace'
```

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/node/property-values \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"country/ARG"
	],
	"property": "containedInPlace"
}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/g6ctqbxj/12/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

##### Raw

```json
{
  "payload": "{\"wikidataId/Q1486\":{\"out\":[{\"dcid\":\"country/ARG\",\"name\":\"Argentina\",\"provenanceId\":\"dc/5n63hr1\",\"types\":[\"Country\"]}]}}"
}
```

##### Parsed and prettified

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