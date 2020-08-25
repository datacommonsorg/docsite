---
layout: default
title: Set API Key
nav_order: 1
parent: Python
grand_parent: API
---

# Sets the API key (Optional)

## `datacommons.set_api_key(api_key)`

Sets an environment variable `"DC_API_KEY"` to given `api_key`.

An API key can be provided to
the API after importing the library, or set as an environment variable
`"DC_API_KEY"`.

For more details about how to get an API key and provide it to the Python
Client API, please visit the [Python library setup guide](/api/python/)
for more details.

Setting the API key is optional. Data Commons *does not charge* users, but uses the
API key for understanding API usage.

**Arguments**

*   `api_key (str)` - The API key.
