---
layout: default
title: Places
nav_order: 2
parent: BigQuery
---

# Query category: Places

The queries below include specific place DCID (e.g., 'geoId/06') and place type (e.g., 'County') string constants. Replace those to customize the queries to your needs.

## Place containment

### List all the places of type X contained in Y

As an example, selecting all counties in USA:

```sql
SELECT id AS PlaceId, name AS PlaceName
FROM `data_commons.Place`
WHERE EXISTS(SELECT * FROM UNNEST(all_types) AS T WHERE T = 'County') AND
      EXISTS(SELECT * FROM UNNEST(linked_contained_in_place) AS C
             WHERE C = 'country/USA')
```

### List all the places of type X within Z range of Y

As an example, we can use the "nearbyPlaces" triples to compute cities within 10KM distance of San Francisco:

```sql
-- “nearbyPlaces” triple is coded as <place>@<distance_in_meters>
SELECT Place2.id AS PlaceId, Place2.name AS PlaceName
FROM `data_commons.Place` AS Place1
JOIN `data_commons.Place` AS Place2 ON TRUE
JOIN `data_commons.Triple` AS Triple ON TRUE
WHERE Place1.id = 'geoId/0667000' AND Place1.id = Triple.subject_id AND
      Triple.predicate = 'nearbyPlaces' AND
      SPLIT(Triple.object_value, '@')[OFFSET(0)] = Place2.id AND
      CAST(RTRIM(SPLIT(Triple.object_value, '@')[OFFSET(1)], 'm') AS FLOAT64) < 10000 AND
      EXISTS(SELECT * FROM UNNEST(Place2.all_types) AS T WHERE T = 'City')

```

### List all the places of type X within Z range of Y using the [BQ Geography functions](https://cloud.google.com/bigquery/docs/reference/standard-sql/geography_functions)

As an example, counties in 50km vicinity of Palo Alto:

```sql
SELECT County.id AS CountyId, County.name AS CountyName
FROM `data_commons.PlaceBoundary` AS PaloAltoGeo
JOIN `data_commons.PlaceBoundary` AS CountyGeo ON TRUE
JOIN `data_commons.Place` AS County ON TRUE
WHERE
    PaloAltoGeo.id = 'geoId/0655282' AND
    EXISTS(SELECT * FROM UNNEST(County.all_types) AS T WHERE T = 'County') AND
    County.id = CountyGeo.id AND
    CountyGeo.geo_json_coordinates IS NOT NULL AND
    CountyGeo.geo_json_coordinates IS NOT NULL AND
    ST_DISTANCE(ST_GEOGFROMGEOJSON(CountyGeo.geo_json_coordinates,
                                   make_valid => TRUE),
                ST_GEOGFROMGEOJSON(PaloAltoGeo.geo_json_coordinates,
                                   make_valid => TRUE)) < 50000

```

## Entities of a certain type in a Place

This is the same sequence as above, except replace place with entities of type X, where X could be School, Facility, etc.

### List all entities of non-place types (School, Facility, etc.) contained in Y

As an example, getting all [EPA Reporting Facilities (within the Greenhouse Gas Reporting Program)](https://enviro.epa.gov/enviro/ad_hoc_table_column_select_v2.retrieval_list?database_type=GHG&selected_subjects=Facility+Information&subject_selection=+&table_1=+) in Texas:

```sql
SELECT I.id AS Id, I.name AS name
FROM `data_commons.Place` AS P
JOIN `data_commons.Instance` AS I ON TRUE
WHERE I.id = P.id AND I.type = 'EpaReportingFacility' AND
      EXISTS(SELECT * FROM UNNEST(linked_contained_in_place) AS C
             WHERE C = 'geoId/48')

```
