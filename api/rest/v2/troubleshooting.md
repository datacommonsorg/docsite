---
layout: default
title: Troubleshooting
nav_order: 6
parent: REST (v2)
grand_parent: API
published: true
---

{:.no_toc}
# Troubleshoot common error responses

* TOC
{:toc}

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

## Empty response

```json
{}
```

Sometimes your query might return an empty result. This is most commonly seen when the value provided for a query parameter is misspelled or doesn't exist. Make sure the values you are passing for parameters are spelled correctly.

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