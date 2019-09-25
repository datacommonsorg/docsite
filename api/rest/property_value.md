---
layout: default
title: Property Value
nav_order: 4
parent: REST
grand_parent: API
---

# Show Property Values for Node(s)

Given a list of nodes and a property label, returns values associated with the
given property for each node.

**URL** : `/node/property-values`

**Method** : `GET`, `POST`

**Auth required** : YES

To get an API key, check [API Key](https://datacommonsorg.github.io/docsite/api/api_key.html) section.

**Required Arguments**:

*   `key`: Your API key.
*   `dcids`: A list of nodes to query, identified by their DCID.
*   `property`: The property label to query for.

**Optional Arguments**:

*   `valueType`: The type of the property value to filter by, only applicable if
    the value refers to a node.
*   `limit`: (<=500) Maximum number of values returned per node.

## GET Request

**Example**

*   Get name of two states

    ```bash
    curl 'https://api.datacommons.org/node/property-values?key=API_KEY&dcids=geoId/05&dcids=geoId/06&property=name'
    ```

*   Query with type filter and limit constraint

    ```bash
    curl 'https://api.datacommons.org/node/property-values?key=API_KEY&dcids=geoId/05&property=location&valueType=Election&limit=5'
    ```

## POST Request

**Example**

```bash
curl -X POST 'https://api.datacommons.org/node/property-values?key=API_KEY' \
-d '{"dcids": ["geoId/05", "geoId/06"], "property": "name"}'
```

## Success Response

### **Code** : `200 OK`

**Response content example**

```json
{
    "payload": "<payload string>",
}
```

The equivalent JSON of "payload string" is as follows.

**Example 1:** property values that are not nodes.

```json
{
    "geoId/05": {
        "out": [
          {
            "value": "Arkansas",
            "provenanceId": "dc/sm3m2w3"
          }
        ]
    },
    "geoId/06": {
        "out": [
          {
            "value": "California",
            "provenanceId": "dc/sm3m2w3"
          }
        ]
    },
}
```

**Example 2:** property values that are node references.

```json
{
    "geoId/06":
        {
        "in": [
            {
              "dcid": "ipedsId/486619",
              "name": "Academy of Professional Cosmetology",
              "provenanceId": "dc/89fk9x3",
              "types": ["CollegeOrUniversity"]
            },
            {
              "dcid": "ipedsId/485731",
              "name": "The Beauty School",
              "provenanceId": "dc/89fk9x3",
              "types": ["CollegeOrUniversity"]
            }
        ]
    }
}
```

For each node, `in` contains nodes directed towards the node while `out`
contains nodes/values directed away from the node. When the property value is a
node, the result contains node information like `dcid`, `name`, `provenanceId`
and `types`; when the property value is not a node, it has `value` and
`provenanceId`.

`provenanceId` is the DCID of the provenance for the corresponding value.

<!--- TODO: add link to the data model --->

**NOTE:** Please run `JSON.parse()` on the `payload` field to retrieve the data.
For example, in JavaScript: `var data = JSON.parse(response['payload'])`.

## Error Response

### **Code**: `500 Internal Server Error`

**Request example:** (property not specified)

```bash
curl -X POST 'https://api.datacommons.org/node/property-values?key=API_KEY' -d '{"dcids": ["geoId/06"]}'
```

**Response content example**

```json
{
  "code": 2,
  "message": "missing required arguments"
}
```

### **Code**: `401 Unauthorized`

**Request example:** (API key not specified)

```bash
curl -X POST 'https://api.datacommons.org/node/property-values'
```

**Response content example**

```json
{
  "code": 16,
  "message": "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API."
}
```