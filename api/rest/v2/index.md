---
layout: default
title: REST (v2)
nav_order: 0
parent: API
has_children: true
published: false
permalink: /api/rest/v2
---

# Data Commons REST API

The Data Commons REST API is a
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library
that enables developers to programmatically access data in the Data Commons
knowledge graph. This package allows users to explore the structure of the
graph, integrate statistics from the graph into data analysis applications and
much more.

## What's new in V2

[//]: <> (TODO: link to new section)
The V2 API collapses functionality from V1 into a smaller number of endpoints. We do this by introducing a syntax for "Relation Expressions". Each API endpoint can also handle both single and bulk requests.

## Getting Started

[//]: <> (TODO: update this section for v2)
First time using the Data Commons API, or just need a refresher? Take a look at
our [Getting Started Guide](/api/rest/v1/getting_started).

## Service Endpoints

The base URL for all endpoints below is:

```bash
https://api.datacommons.org/v2
```

| API | URI | Description |
| --- | --- | ----------- |
| Node | [/v2/node](/api/rest/v2/node) | Fetches information about edges and neighboring nodes |
| Observation | [/v2/observation](/api/rest/v2/observation) | Fetches statistical observations |
| Resolve Entities | [/v2/resolve](/api/rest/v2/resolve) | Returns a Data Commons ID ([`DCID`](/glossary.html#dcid)) for entities in the graph |


{: #relation-expressions}
## Introducing Relation Expressions

Data Commons represents real world entities and data as nodes. These
nodes are connected by directed edges, or arcs, to form a knowledge graph. The
label of the arc is the name of the [property](/glossary.html#property).

Relation expressions include arrow annotation and other symbols in the syntax to
represent neighboring nodes, and to support chaining and filtering.
These new expressions allow all of the functionality of the V1 API to be
expressed with fewer API endpoints in V2. All V2 API calls require relation
expressions in the `property` or `expression` parameter.

The following table describes symbols in the V2 API relation expressions:

| Symbol | Represents |
| ------ | ---------- |
| `->` | An `out` arc |
| `<-` | An `in` arc |
| `{property:value}` | Filtering; identifies the property and associated value |
| `[]` | Multiple properties, separated by commas |
| `*` | All properties linked to this node |
| `+` | One or more expressions chained together for indirect relationships, like `containedInPlace+{typeOf:City}` |

### In and out arcs `<- & ->`

Note that arcs in the Data Commons Graph have directions. In the case of the [Argentina](https://datacommons.org/browser/country/ARG), the property `containedInPlace` exists in both `in` and `out` directions, illustrated in Figure 1:

![](/assets/images/rest/property_value_direction_example.png)

*Figure 1. Relationship diagram for the property `containedInPlace` of the country Argentina. Note the directionality of the property `containedInPlace`: for the node "Argentina", the `in` arc represents "Argentina contains Buenos Aires", while the `out` arc represents "Argentina in South America".*


For example, nodes from `out` arcs are represented by `->`, while nodes from
`in` arcs are represented by `<-`. To illustrate using the above example:

- Regions that include Argentina (dcid: `country/ARG`): `country/ARG->containedInPlace`
- All cities directly contained in Argentina (dcid: `country/ARG`): `country/ARG<-containedInPlace{typeOf:City}`

### Filters `{property:value}`

Filters can be used to reduce results to only match nodes with a specified property and value. Using the same example,  `country/ARG<-containedInPlace+{typeOf:City}` will only return nodes with the `typeOf:City`, filtering out `typeOf:AdministrativeArea1` and so on.

### Specifying multiple properties `[property1, property2]`

Multiple properties can be combined together within `[]`. For example, in order to request a few `out` arcs for a node, use
`->[name, latitude, longitude]` (this example is [fully described in this Node API example](/api/rest/v2/node.html#multiple-properties)).

### Wildcard `*`

In order to retrieve all properties linked to a node, use the `*`, e.g. `<-*`.
This example is [fully described in this Node API example](/api/rest/v2/node.html#wildcard).

### Chaining properties `+`

A property chain expression represents requests for information about nodes
which are connected by the same property, but are a few hops away. This is supported only for the `containedInPlace` property.

To illustrate again using the Argentina example:
- All cities directly contained in Argentina (dcid: `country/ARG`): `country/ARG<-containedInPlace{typeOf:City}`
- All cities indirectly contained in Argentina (dcid: `country/ARG`): `country/ARG<-containedInPlace+{typeOf:City}`