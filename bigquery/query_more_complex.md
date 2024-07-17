---
layout: default
title: More complex queries
nav_order: 4
parent: BigQuery
---

# Query category: More complex queries

### Places matching some criterion

As an example, listing the European equivalent (aka [NUTS 3](https://en.wikipedia.org/wiki/Nomenclature_of_Territorial_Units_for_Statistics)) geos with < 2.1 fertility rate:

```sql
WITH ChildPlace AS (
  SELECT id AS PlaceId FROM `data_commons.Place`
  WHERE EXISTS(SELECT * FROM UNNEST(all_types) AS T WHERE T = 'EurostatNUTS3') AND
  EXISTS(SELECT * FROM UNNEST(linked_contained_in_place) AS C WHERE C = 'europe')
)
SELECT O.observation_about AS PlaceId,
       P.name AS PlaceName,
       CAST(O.value AS FLOAT64) AS Value,
FROM `data_commons.Observation` AS O
JOIN ChildPlace ON TRUE
JOIN `data_commons.Place` AS P ON TRUE
WHERE O.is_preferred_obs_across_facets AND
      O.variable_measured = 'FertilityRate_Person_Female' AND
      O.observation_about = ChildPlace.PlaceId AND
      O.observation_about = P.id AND
      CAST(O.value AS FLOAT64) < 2.1
ORDER BY Value
```

### Computing a new Statistic.

As an example, listing countries of the world with highest electricity consumption per unit GDP:

```sql
WITH ChildPlace AS (
  SELECT id AS PlaceId FROM `data_commons.Place`
  WHERE EXISTS(SELECT * FROM UNNEST(all_types) AS T WHERE T = 'Country') AND
  EXISTS(SELECT * FROM UNNEST(linked_contained_in_place) AS C WHERE C = 'Earth')
)
SELECT ONum.observation_about AS PlaceId,
       P.name AS PlaceName,
       IF(CAST(ODenom.value AS FLOAT64) > 0,
          CAST(ONum.value AS FLOAT64) / CAST(ODenom.value AS FLOAT64),
          NULL) AS Value
FROM `data_commons.Observation` AS ONum
JOIN `data_commons.Observation` AS ODenom ON TRUE
JOIN ChildPlace ON TRUE
JOIN `data_commons.Place` AS P ON TRUE
WHERE ONum.is_preferred_obs_across_facets AND
      ONum.variable_measured = 'Annual_Consumption_Electricity' AND
      ODenom.is_preferred_obs_across_facets AND
      ODenom.variable_measured = 'Amount_EconomicActivity_GrossDomesticProduction_Nominal' AND
      ONum.observation_about = ChildPlace.PlaceId AND
      ODenom.observation_about = ONum.observation_about AND
      P.id = ONum.observation_about
ORDER BY Value DESC
```
