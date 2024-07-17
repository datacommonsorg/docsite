---
layout: default
title: Properties of places
nav_order: 2
parent: BigQuery
---

# Statistical variables associated with places (and other entities)

### Latest value from preferred source for a single variable

As an example, the latest population of CA:

```sql
SELECT Obs.Value AS Value
FROM `data_commons.Observation` AS Obs
WHERE Obs.observation_about = 'geoId/06' AND
      Obs.variable_measured = 'Count_Person' AND
      Obs.is_preferred_obs_across_facets
```

### Latest value from specific source for a single variable

As an example, the latest CA population from [ACS 5 Year Survey](https://www.census.gov/programs-surveys/acs):

```sql
SELECT Obs.value AS Value
FROM `data_commons.Observation` AS Obs
WHERE Obs.observation_about = 'geoId/06' AND
      Obs.variable_measured = 'Count_Person' AND
      Obs.measurement_method = 'CensusACS5yrSurvey'
ORDER BY Obs.observation_date DESC
LIMIT 1
```

### Variables available for a given place

As an example, the variables available for California state:

```sql
SELECT DISTINCT Obs.variable_measured AS Var
FROM `data_commons.Observation` AS Obs
WHERE Obs.observation_about = 'geoId/06'
ORDER BY Var;
```

### Sources available for a given place/variable combination

As an example, the sources for count of housing units in California:

```sql
SELECT DISTINCT
       Prov.name AS Name,
       Prov.provenance_url AS URL,
       Obs.measurement_method AS MeasurementMethod
FROM `data_commons.Observation` AS Obs
JOIN `data_commons.Provenance` AS Prov ON TRUE
WHERE Obs.observation_about = 'geoId/06' AND
      Obs.variable_measured = 'Count_HousingUnit' AND
      Prov.id = Obs.prov_id
ORDER BY Name
```

### Time series from preferred source for a single variable

As an example, CA population over time from preferred source:

```sql
SELECT Obs.observation_date AS Date,
       Obs.Value AS Value
FROM `data_commons.Observation` AS Obs
WHERE Obs.observation_about = 'geoId/06' AND
      Obs.variable_measured = 'Count_Person' AND
      Obs.facet_rank = 1
ORDER BY Date
```

### Latest value from preferred source for all the places of a given type contain in

As an example, the unemployment rate in counties of USA:

```sql
WITH ChildPlace AS (
  SELECT id AS PlaceId FROM `data_commons.Place`
  WHERE EXISTS(SELECT * FROM UNNEST(all_types) AS T WHERE T = 'County') AND
  EXISTS(SELECT * FROM UNNEST(linked_contained_in_place) AS C WHERE C = 'country/USA')
)
SELECT O.observation_about AS PlaceId,
       P.name AS PlaceName,
       O.value AS Value,
FROM `data_commons.Observation` AS O
JOIN ChildPlace ON TRUE
JOIN `data_commons.Place` AS P ON TRUE
WHERE O.is_preferred_obs_across_facets AND
      O.variable_measured = 'UnemploymentRate_Person' AND
      O.observation_about = ChildPlace.PlaceId AND
      O.observation_about = P.id
ORDER BY PlaceName
```
