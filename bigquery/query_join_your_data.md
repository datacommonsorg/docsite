---
layout: default
title: Joining with Your Own Data
nav_order: 4
parent: DC to BQ Sample Queries
grand_parent: BigQuery
---

# Query Category: Joining with Data outside Data Commons

This page illustrates how you can join external datasets with Data Commons by relying on unique IDs and geo locations.  For the examples below, we use other public datasets in BigQuery Analytics Hub, but they can be any other private/public dataset.

### Using [FIPS](https://www.census.gov/library/reference/code-lists/ansi.html) codes

We use the [Fatal Accidents dataset from National Highway Traffic Safety Administration](https://console.cloud.google.com/bigquery/analytics-hub/exchanges(analyticshub:projects/1057666841514/locations/us/dataExchanges/google_cloud_public_datasets_17e74966199/listings/nhtsa_traffic_fatalities_17f892354f9)) to compute counties with highest fatal accidents per capita. We map to DC counties by using the FIPS or geoId, and use total population statistics. We find Loving County, TX (the least populated county in main US), followed by Kenedy County, TX, to be at the top.

```sql
WITH FatalAccidents AS (
SELECT
  CONCAT(LPAD(CAST(NHTSA.state_number AS STRING), 2, '0'), LPAD(CAST(NHTSA.county AS STRING), 3, '0')) AS FIPS,
  COUNT(consecutive_number) AS Count
FROM `nhtsa_traffic_fatalities.accident_2016` AS NHTSA
GROUP BY FIPS)
SELECT P.id AS CountyId,
       P.name AS CountyName,
       IF(Obs.value IS NOT NULL, FA.Count / CAST(Obs.value AS FLOAT64), NULL) AS FatalAccidentsPerCapita
FROM FatalAccidents AS FA
JOIN `data_commons.Observation` AS Obs ON TRUE
JOIN `data_commons.Place` AS P ON TRUE
WHERE
  P.id = Obs.observation_about AND
  P.geo_id = FA.FIPS AND
  Obs.variable_measured = 'Count_Person' AND
  Obs.is_preferred_obs_across_facets
ORDER BY FatalAccidentsPerCapita DESC
```

### Using Zip codes

We use Google's [Project SunRoof](https://console.cloud.google.com/bigquery/analytics-hub/exchanges(analyticshub:projects/1057666841514/locations/us/dataExchanges/google_cloud_public_datasets_17e74966199/listings/d29ba6d0d3a64b6284d0fe57eedc9355)) dataset to compute solar potential for low-income Zip code areas in the US.  From 500 Zip code areas with the lowest median income, we compute those Zip codes that have the highest solar potential (among those that were sufficiently qualified). Of the 500, we find that 133 of them had > 50% potential.

```sql
WITH LowestEarnerZips AS (
    SELECT Obs.observation_about AS PlaceId,
           Obs.Value AS Income
    FROM `data_commons.Observation` AS Obs
    WHERE
        Obs.is_preferred_obs_across_facets AND
        Obs.variable_measured = 'Median_Income_Person' AND
        Obs.observation_about LIKE 'zip/%'
    ORDER BY CAST(Value AS FLOAT64)
    LIMIT 500)
SELECT SunRoof.region_name AS Zip, SunRoof.state_name AS State, SunRoof.percent_qualified AS PercentSunRoof
FROM LowestEarnerZips AS DC
JOIN `project_sunroof.solar_potential_by_postal_code` AS SunRoof ON TRUE
WHERE CONCAT('zip/', SunRoof.region_name) = DC.PlaceId AND
      SunRoof.percent_qualified > 0 AND
      SunRoof.percent_covered > 80
ORDER BY PercentSunRoof DESC
```

### Latitude/Longitude based join

From the [OpenStreetMap Public Dataset](https://console.cloud.google.com/bigquery/analytics-hub/exchanges(analyticshub:projects/1057666841514/locations/us/dataExchanges/google_cloud_public_datasets_17e74966199/listings/openstreetmap_public_dataset_17f8979a16c)), we look up fire-hydrants and their associated geo locations to compute the US counties with most fire-hydrants per unit area.  To do this, we use the geo boundaries in DC to map latitude/longitude to US counties and also use the land area value from DC.  We find that Alexandria County, Virginia comes up at the top.

```sql
WITH CountyFireHydrantCount AS(
  WITH FireHydrantLocations AS (
    SELECT geometry AS Geo
    FROM  `openstreetmap_public_dataset.planet_nodes` AS node
    JOIN UNNEST(all_tags) AS tags
    WHERE (tags.key = 'emergency' AND tags.value = 'fire_hydrant'))
  SELECT PB.id AS CountyId, COUNT(*) AS NumHydrants
  FROM `data_commons.PlaceBoundary` AS PB
  JOIN `data_commons.Place` AS P ON TRUE
  JOIN FireHydrantLocations ON TRUE
  WHERE
    P.id = PB.id AND
    EXISTS(SELECT * FROM UNNEST(P.all_types) AS T WHERE T = 'County') AND
    ST_WITHIN(FireHydrantLocations.Geo,
              ST_GEOGFROMGEOJSON(PB.geo_json_coordinates, make_valid => TRUE))
  GROUP BY CountyId)
SELECT P.id AS CountyId,
       P.name AS CountyName,
       CountyFireHydrantCount.NumHydrants /
             (SUBSTR(P.land_Area, 12) AS INT64) AS HydrantsPerSqMeter
FROM `data_commons.Place` AS P
JOIN CountyFireHydrantCount ON TRUE
WHERE
  P.id = CountyFireHydrantCount.CountyId AND
  STARTS_WITH(P.land_area, 'SquareMeter')
ORDER BY HydrantsPerSqMeter DESC
```
