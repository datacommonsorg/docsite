---
layout: default
title: Troubleshooting
nav_order: 16
parent: REST (V2)
grand_parent: API - Query data programmatically
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

The request is missing an API key or the parameter specifying it is misspelled. Please [request your own API key](/api/index.html#get-key).

## Empty response

```json
{}
```

This is most commonly seen when the value provided for a query parameter is misspelled or doesn't exist. Make sure the values you are passing for parameters are spelled correctly, that you are correctly [URL-encoding](/api/rest/v2/index.html#url-encode) special characters in parameter values, and not URL-encoding parameter delimiters.

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

This is most commonly seen when a query parameter is missing, misspelled or incorrect. Check the spelling of query parameters, ensure all required parameters are sent in the request, that you are correctly [URL-encoding](/api/rest/v2/index.html#url-encode) special characters in parameter values, and not URL-encoding parameter delimiters.
