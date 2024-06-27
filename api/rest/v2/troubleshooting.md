---
layout: default
title: Troubleshooting
nav_order: 5
parent: REST (v2)
grand_parent: API
published: true
---

{:.no_toc}
# Troubleshoot common error responses

* TOC
{:toc}

## "Method does not exist"

```json
{
  "code": 5,
  "message": "Method does not exist.",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "service_control"
    }
  ]
}
```

This is most commonly seen when the endpoint is misspelled or otherwise malformed. Check the spelling of your endpoint and that all required path parameters are provided in the right order.

## Missing API key

```json
{
 "code": 16,
 "message": "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.",
 "details": [
  {
   "@type": "type.googleapis.com/google.rpc.DebugInfo",
   "stackEntries": [],
   "detail": "service_control"
  }
 ]
}
```

This is seen when your request is missing an API key. Please [request your own API key](/api/index.html#get-key).


## "Invalid request URI"

```json
{
  "code": 3,
  "message": "Invalid request URI",
  "details": [
    {
      "@type": "type.googleapis.com/google.rpc.DebugInfo",
      "stackEntries": [],
      "detail": "internal"
    }
  ]
}
```

This is most commonly seen when your request is missing a required path parameter. Make sure endpoints and parameters are both spelled correctly and provided in the right order.

## Empty response

```json
{}
```

Sometimes your query might return an empty result. This is most commonly seen when the value provided for a parameter is misspelled or doesn't exist. Make sure the values you are passing for parameters are spelled correctly.

## Marshaling errors

```json
{
 "code": 13,
 "message": "grpc: error while marshaling: proto: Marshal called with nil",
 "details": [
  {
   "@type": "type.googleapis.com/google.rpc.DebugInfo",
   "stackEntries": [],
   "detail": "internal"
  }
 ]
}
```

This is most commonly seen when a query parameter is missing, misspelled or incorrect. Check the spelling of query parameters and ensure all required parameters are sent in the request.