---
layout: default
title: test
nav_order: 1
parent: REST
grand_parent: API
---
<html>
  <body> 
<h2> First tabs </h2>

{% tabs log %}

{% tab log curl %}

```bash
    curl 'https://api.datacommons.org/node/property-values?dcids=geoId/05&property=location&valueType=Election&limit=5'
```

{% endtab %}

{% tab log  %}

```bash
    curl 'https://api.datacommons.org/node/property-values?dcids=geoId/05&property=location&valueType=Election&limit=5'
```

{% endtab %}

{% endtabs %}

    <script src="/assets/js/tabs.js"></script>
  </body>
</html>