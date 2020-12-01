---
layout: default
title: Triple
nav_order: 2
parent: REST
grand_parent: API
---

# Show Triples Associated with Node(s)

Given a list of nodes, return triples which are associated with the specified
node(s).

A knowledge graph can be described as a collection of *triples* which are
3-tuples that take the form *(s, p, o)*. Here, *s* and *o* are nodes in the
graph called the *subject* and *object* respectively, while *p* is the property
label of a directed edge from *s* to *o* (sometimes also called the *predicate*).

## General information about this endpoint

**URL**: `/node/triples`

**Method**: `GET`, `POST`

**Auth required**: Optional

**Required Arguments**:

*   `dcids`: A list of nodes to query, identified by their DCID.

**Optional Arguments**:

*   `limit`: The maximum number of triples per combination of property and type
    associated with nodes linked by that property to fetch, up to *500*.

*   `key`: Your API key.

## How to construct a request to the triples endpoint

### Step 1: assembling the information you will need

This endpoint requires the argument `dcids`, which are unique node identifiers defined by Data Commons. Your query will need to specify the DCIDs for the nodes of interest.

In addition to this required property, this endpoint also allows you to specify your API key as an optional argument as well as a limit on how many triples (up to 500) you would like to see in the response.

### Step 2: creating the request

When actually putting together your request, you can choose from two options. If you intend to query only a small number of DCIDs, you may want to use the simpler formatting offered by the GET method. For larger numbers of DCIDs, or if you prefer to utilize a static URL, a POST request likely makes more sense. To use it, make a POST request against the main endpoint while changing the fields of the JSON body it sends.

## What to expect in the response

Your response will always look like this:

```json
{
    "payload": "<payload string>",
}
```

Here "<payload string>" is a long encoded JSON string, whose structure changes depending on whether the response contains node references. You can run JSON.parse() on the payload field to retrieve the data. For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

When decoded, the response adheres to this structure:

```json
{
    "<dcid>": {
        <Triples>
    },
    ...
}
```

## Example requests and responses

### Example 1: Retrieve triples associated with squareMeter 1238495 (a land tract in southern Florida).

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/triples?dcids=SquareMeter1238495'
```

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/node/triples \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"SquareMeter1238495"
	]
}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/630fqova/19/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

##### Raw

```json
{
  "payload": "{\"SquareMeter1238495\":[{\"subjectId\":\"SquareMeter1238495\",\"predicate\":\"value\",\"objectValue\":\"1238495\",\"provenanceId\":\"dc/sm3m2w3\"},{\"subjectId\":\"SquareMeter1238495\",\"predicate\":\"unitOfMeasure\",\"objectId\":\"SquareMeter\",\"provenanceId\":\"dc/sm3m2w3\"},{\"subjectId\":\"SquareMeter1238495\",\"predicate\":\"typeOf\",\"objectId\":\"Quantity\",\"objectName\":\"Quantity\",\"objectTypes\":[\"Class\"],\"provenanceId\":\"dc/sm3m2w3\"},{\"subjectId\":\"SquareMeter1238495\",\"predicate\":\"provenance\",\"objectId\":\"dc/sm3m2w3\",\"objectName\":\"https://www.census.gov/geographies/reference-files.html\",\"objectTypes\":[\"Provenance\"],\"provenanceId\":\"dc/sm3m2w3\"},{\"subjectId\":\"SquareMeter1238495\",\"predicate\":\"name\",\"objectValue\":\"SquareMeter 1238495\",\"provenanceId\":\"dc/sm3m2w3\"},{\"subjectId\":\"geoId/12086008906\",\"subjectName\":\"Census Tract 89.06, Miami-Dade County, Florida\",\"subjectTypes\":[\"CensusTract\"],\"predicate\":\"landArea\",\"objectId\":\"SquareMeter1238495\",\"objectName\":\"SquareMeter 1238495\",\"objectTypes\":[\"Quantity\"],\"provenanceId\":\"dc/sm3m2w3\"}]}"
}
```

##### Parsed and prettified

```json
{
  "payload": {
    "SquareMeter1238495": [
      {
        "subjectId": "SquareMeter1238495",
        "predicate": "value",
        "objectValue": "1238495",
        "provenanceId": "dc/sm3m2w3"
      },
      {
        "subjectId": "SquareMeter1238495",
        "predicate": "unitOfMeasure",
        "objectId": "SquareMeter",
        "provenanceId": "dc/sm3m2w3"
      },
      {
        "subjectId": "SquareMeter1238495",
        "predicate": "typeOf",
        "objectId": "Quantity",
        "objectName": "Quantity",
        "objectTypes": [
          "Class"
        ],
        "provenanceId": "dc/sm3m2w3"
      },
      {
        "subjectId": "SquareMeter1238495",
        "predicate": "provenance",
        "objectId": "dc/sm3m2w3",
        "objectName": "https://www.census.gov/geographies/reference-files.html",
        "objectTypes": [
          "Provenance"
        ],
        "provenanceId": "dc/sm3m2w3"
      },
      {
        "subjectId": "SquareMeter1238495",
        "predicate": "name",
        "objectValue": "SquareMeter 1238495",
        "provenanceId": "dc/sm3m2w3"
      },
      {
        "subjectId": "geoId/12086008906",
        "subjectName": "Census Tract 89.06, Miami-Dade County, Florida",
        "subjectTypes": [
          "CensusTract"
        ],
        "predicate": "landArea",
        "objectId": "SquareMeter1238495",
        "objectName": "SquareMeter 1238495",
        "objectTypes": [
          "Quantity"
        ],
        "provenanceId": "dc/sm3m2w3"
      }
    ]
  }
}
```

### Example 2: Retrieve the triples associated with two American biological research labs

<div>

{% tabs log %}

{% tab log GET Request %}

```bash
curl --request GET \
  --url 'https://api.datacommons.org/node/triples?dcids=dc%2F02qyghln81jr4&dcids=dc%2F1jrmkql8dprv9'
```

{% endtab %}

{% tab log POST Request %}

```bash
curl --request POST \
  --url https://api.datacommons.org/node/triples \
  --header 'content-type: application/json' \
  --data '{
	"dcids": [
		"dc/02qyghln81jr4",
		"dc/1jrmkql8dprv9"
	]
}'
```

{% endtab %}

{% tab log javascript %}

<iframe width="100%" height="300" src="//jsfiddle.net/datacommonsorg/ejxgchuy/5/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

{% endtab %}

{% endtabs %}

<script src="/assets/js/tabs.js"></script>
</div>

#### Response

##### Raw

```json
{
  "payload": "{\"dc/02qyghln81jr4\":[{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"url\",\"objectValue\":\"https://www.hsph.harvard.edu/alkes-price/contact/\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"typeOf\",\"objectId\":\"Lab\",\"objectName\":\"Lab\",\"objectTypes\":[\"Class\"],\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"status\",\"objectValue\":\"current\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"state\",\"objectValue\":\"MA\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"sameAs\",\"objectValue\":\"https://www.encodeproject.org/labs/alkes-price/\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"provenance\",\"objectId\":\"dc/h2lkz1\",\"objectName\":\"https://www.encodeproject.org/\",\"objectTypes\":[\"Provenance\"],\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"postalCode\",\"objectValue\":\"02115\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"pi\",\"objectValue\":\"https://www.encodeproject.org/users/bf09c1e0-52a5-4efb-acbd-88671257964d/\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"phone1\",\"objectValue\":\"617-432-2262\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"name\",\"objectValue\":\"Alkes Price, Harvard\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"instituteName\",\"objectValue\":\"Harvard University\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"instituteLabel\",\"objectValue\":\"Harvard\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"encodeUUID\",\"objectValue\":\"312078ef-953b-4483-8df2-99f920237306\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"country\",\"objectValue\":\"USA\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"city\",\"objectValue\":\"Boston\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"awards\",\"objectValue\":\"https://www.encodeproject.org/awards/U01HG009379/\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"address2\",\"objectValue\":\"Building 2, Room 211\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/02qyghln81jr4\",\"predicate\":\"address1\",\"objectValue\":\"665 Huntington Ave.\",\"provenanceId\":\"dc/h2lkz1\"}],\"dc/1jrmkql8dprv9\":[{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"typeOf\",\"objectId\":\"Lab\",\"objectName\":\"Lab\",\"objectTypes\":[\"Class\"],\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"status\",\"objectValue\":\"current\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"sameAs\",\"objectValue\":\"https://www.encodeproject.org/labs/andrew-fire/\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"provenance\",\"objectId\":\"dc/h2lkz1\",\"objectName\":\"https://www.encodeproject.org/\",\"objectTypes\":[\"Provenance\"],\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"pi\",\"objectValue\":\"https://www.encodeproject.org/users/0db98457-a91e-4cde-b058-a0c972c008e3/\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"name\",\"objectValue\":\"Andrew Z. Fire, Stanford\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/jqclkhdw83dl5\",\"subjectTypes\":[\"EncodeBiosample\"],\"predicate\":\"lab\",\"objectId\":\"dc/1jrmkql8dprv9\",\"objectName\":\"Andrew Z. Fire, Stanford\",\"objectTypes\":[\"Lab\"],\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/9pz5fgt9b947h\",\"subjectTypes\":[\"EncodeBiosample\"],\"predicate\":\"lab\",\"objectId\":\"dc/1jrmkql8dprv9\",\"objectName\":\"Andrew Z. Fire, Stanford\",\"objectTypes\":[\"Lab\"],\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/8n2ybm28pe3fd\",\"subjectTypes\":[\"EncodeBiosample\"],\"predicate\":\"lab\",\"objectId\":\"dc/1jrmkql8dprv9\",\"objectName\":\"Andrew Z. Fire, Stanford\",\"objectTypes\":[\"Lab\"],\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"instituteName\",\"objectValue\":\"Stanford\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"encodeUUID\",\"objectValue\":\"db35b051-215c-4c1c-8e98-610d62d30def\",\"provenanceId\":\"dc/h2lkz1\"},{\"subjectId\":\"dc/1jrmkql8dprv9\",\"predicate\":\"awards\",\"objectValue\":\"https://www.encodeproject.org/awards/R01GM037706/\",\"provenanceId\":\"dc/h2lkz1\"}]}"
}
```

##### Parsed and prettified

```json
{
  "payload": {
    "dc/02qyghln81jr4": [
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "url",
        "objectValue": "https://www.hsph.harvard.edu/alkes-price/contact/",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "typeOf",
        "objectId": "Lab",
        "objectName": "Lab",
        "objectTypes": [
          "Class"
        ],
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "status",
        "objectValue": "current",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "state",
        "objectValue": "MA",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "sameAs",
        "objectValue": "https://www.encodeproject.org/labs/alkes-price/",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "provenance",
        "objectId": "dc/h2lkz1",
        "objectName": "https://www.encodeproject.org/",
        "objectTypes": [
          "Provenance"
        ],
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "postalCode",
        "objectValue": "02115",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "pi",
        "objectValue": "https://www.encodeproject.org/users/bf09c1e0-52a5-4efb-acbd-88671257964d/",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "phone1",
        "objectValue": "617-432-2262",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "name",
        "objectValue": "Alkes Price, Harvard",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "instituteName",
        "objectValue": "Harvard University",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "instituteLabel",
        "objectValue": "Harvard",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "encodeUUID",
        "objectValue": "312078ef-953b-4483-8df2-99f920237306",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "country",
        "objectValue": "USA",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "city",
        "objectValue": "Boston",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "awards",
        "objectValue": "https://www.encodeproject.org/awards/U01HG009379/",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "address2",
        "objectValue": "Building 2, Room 211",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/02qyghln81jr4",
        "predicate": "address1",
        "objectValue": "665 Huntington Ave.",
        "provenanceId": "dc/h2lkz1"
      }
    ],
    "dc/1jrmkql8dprv9": [
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "typeOf",
        "objectId": "Lab",
        "objectName": "Lab",
        "objectTypes": [
          "Class"
        ],
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "status",
        "objectValue": "current",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "sameAs",
        "objectValue": "https://www.encodeproject.org/labs/andrew-fire/",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "provenance",
        "objectId": "dc/h2lkz1",
        "objectName": "https://www.encodeproject.org/",
        "objectTypes": [
          "Provenance"
        ],
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "pi",
        "objectValue": "https://www.encodeproject.org/users/0db98457-a91e-4cde-b058-a0c972c008e3/",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "name",
        "objectValue": "Andrew Z. Fire, Stanford",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/jqclkhdw83dl5",
        "subjectTypes": [
          "EncodeBiosample"
        ],
        "predicate": "lab",
        "objectId": "dc/1jrmkql8dprv9",
        "objectName": "Andrew Z. Fire, Stanford",
        "objectTypes": [
          "Lab"
        ],
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/9pz5fgt9b947h",
        "subjectTypes": [
          "EncodeBiosample"
        ],
        "predicate": "lab",
        "objectId": "dc/1jrmkql8dprv9",
        "objectName": "Andrew Z. Fire, Stanford",
        "objectTypes": [
          "Lab"
        ],
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/8n2ybm28pe3fd",
        "subjectTypes": [
          "EncodeBiosample"
        ],
        "predicate": "lab",
        "objectId": "dc/1jrmkql8dprv9",
        "objectName": "Andrew Z. Fire, Stanford",
        "objectTypes": [
          "Lab"
        ],
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "instituteName",
        "objectValue": "Stanford",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "encodeUUID",
        "objectValue": "db35b051-215c-4c1c-8e98-610d62d30def",
        "provenanceId": "dc/h2lkz1"
      },
      {
        "subjectId": "dc/1jrmkql8dprv9",
        "predicate": "awards",
        "objectValue": "https://www.encodeproject.org/awards/R01GM037706/",
        "provenanceId": "dc/h2lkz1"
      }
    ]
  }
}
```

## Error Responses

In general, if your request is malformed in some way, you will receive a 400 status code and an error message like the following:

```json
{
  "code": 3,
  "message": "Missing required arguments: dcids",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```