---
layout: default
title: Place Types
nav_order: 100
---

# Place types

In Data Commons, a "place type" is a specific geographic or administrative unit
for which we provide data. This could range from broad categories such as
countries, states, and provinces to more granular classifications like counties,
cities, and postal codes. This page provides the DCIDs and a description of
place types available in our APIs and tools.

**Note:** Not all data is available for all place types. Sources often don’t
provide data at all levels of granularity. You can check what place types have
data available for a specific variable using our
[Statistical Variable Explorer](https://datacommons.org/tools/statvar).

## Globally available administrative divisions

These place types are generally available for Earth and/or all countries.

|Place Type DCID|Place Type Description|
|--- |--- |
|[AdministrativeArea1](https://datacommons.org/browser/AdministrativeArea1)|A country’s first-level administrative divisions.<br><br>For example, this would encompass US states, Canada’s provinces, and Japan’s prefectures.|
|[AdministrativeArea2](https://datacommons.org/browser/AdministrativeArea2)|A country’s second-level administrative divisions.<br><br>For example, this would encompass US counties, France’s departments, or India’s divisions.|
|[Country](https://datacommons.org/browser/Country)|A nation.<br><br>Note that sources can differ on which countries are recognized. Thus, this category may include some territories and disputed regions.|
|[City](https://datacommons.org/browser/City)|A city.|
{: .doc-table}

## Partially available administrative divisions

These place types represent administrative divisions that are available for some
countries, but not all countries.

|Place Type DCID|Place Type Description|
|--- |--- |
|[AdministrativeArea3](https://datacommons.org/browser/AdministrativeArea3)|A country's third-level adminstrative divisions. |
|[AdministrativeArea4](https://datacommons.org/browser/AdministrativeArea4)|A country's fourth-level administrative divisions. |
|[AdministrativeArea5](https://datacommons.org/browser/AdministrativeArea5)|A country's fifth-level administrative divisions. |
|[Town](https://datacommons.org/browser/Town)|A settlement that is bigger than a village but smaller than a city. |
|[Village](https://datacommons.org/browser/Village)|A small clustered human settlement smaller than a town. |
{: .doc-table}

### US-specific administrative divisions

These place types can only be used for places that are contained within the
[United States](https://datacommons.org/place/country/USA) (DCID:
[country/USA](https://datacommons.org/browser/country/USA)).

|Place Type DCID|Place Type Description|
|--- |--- |
|[State](https://datacommons.org/browser/State)|US states.<br><br>For example, [California](https://datacommons.org/place/geoId/06) or [Maryland](https://datacommons.org/place/geoId/)|
|[County](https://datacommons.org/browser/County)|US counties.<br><br>For example, [Santa Clara County](https://datacommons.org/place/geoId/0669084)|
|[CensusZipCodeTabulationArea](https://datacommons.org/browser/CensusZipCodeTabulationArea)|US zip codes as defined by the US Census Bureau.<br><br>For example, [94043](https://datacommons.org/place/zip/94043).<br><br>While there is significant overlap, these codes don't always correspond to the zip codes used by the US Postal Service.|
{: .doc-table}

### India-specific administrative divisions

These place types can only be used for places that are contained within
[India](https://datacommons.org/place/country/IND) (dcid:
[country/IND](https://datacommons.org/browser/country/IND)).

|Place Type DCID|Place Type Description|
|--- |--- |
|[State](https://datacommons.org/browser/State)|Indian states.<br><br>For example, [Uttar Pradesh](https://datacommons.org/place/wikidataId/Q1498) or [Karnataka](https://datacommons.org/place/wikidataId/Q1185)|
{: .doc-table}

### Europe-specific administrative divisions

These place types can only be used for places that are contained within Europe
(dcid: [europe](http://datacommons.org/browser/europe)).

|Place Type DCID|Place Type Description|
|--- |--- |
|[EurostatNUTS1](https://datacommons.org/browser/EurostatNUTS1)|First-level statistical subdivision within an EU member country.|
|[EurostatNUTS2](https://datacommons.org/browser/EurostatNUTS2)|Second-level statistical subdivision within an EU member country.|
|[EurostatNUTS3](https://datacommons.org/browser/EurostatNUTS3)|Third-level statistical subdivision within an EU member country.|
{: .doc-table}

## Earth grids

These place types represent regions defined by various geographic grid systems. These
place types are typically used with climate-related data.

|Place Type DCID|Place Type Description|
|--- |--- |
| [GeoGridPlace\_0.25Deg](https://datacommons.org/browser/GeoGridPlace_0.25Deg) | A place representing a uniform 0.25x0.25 degree grid on the surface of the earth. |
| [GeoGridPlace\_1Deg](https://datacommons.org/browser/GeoGridPlace_1Deg) | A place representing a uniform 1x1 degree grid on the surface of the earth. Unlike IPCCPlace entities, these are not defined in the context of a country. |
| [GeoGridPlace\_4KM](https://datacommons.org/browser/GeoGridPlace_4KM) | A place representing a uniform 4km grid on the surface of the earth. |
| [IPCCPlace\_25](https://datacommons.org/browser/IPCCPlace_25) | A grid on the earth's surface approximately corresponding to 0.25-degree resolution for attaching climate-related observations. These are defined within the context of a specific country. |
| [IPCCPlace\_50](https://datacommons.org/browser/IPCCPlace_50) | A grid on the earth's surface approximately corresponding to 0.50-degree resolution for attaching climate related observations. These are defined within the context of a specific country. |
| [S2CellLevel7](https://datacommons.org/browser/S2CellLevel7) | [S2 cell](http://s2geometry.io/devguide/s2cell_hierarchy.html) at level 7 which corresponds to an average area of 5188.66 sq km. |
| [S2CellLevel8](https://datacommons.org/browser/S2CellLevel8) | [S2 cell](http://s2geometry.io/devguide/s2cell_hierarchy.html) at level 8 which corresponds to an average area of 1297.17 sq km. |
| [S2CellLevel9](https://datacommons.org/browser/S2CellLevel9) | [S2 cell](http://s2geometry.io/devguide/s2cell_hierarchy.html) at level 9 which corresponds to an average area of 324.29 sq km. |
| [S2CellLevel10](https://datacommons.org/browser/S2CellLevel10) | [S2 cell](http://s2geometry.io/devguide/s2cell_hierarchy.html) at level 10 which corresponds to an average area of 81.07 sq km. |
| [S2CellLevel11](https://datacommons.org/browser/S2CellLevel11) | [S2 cell](http://s2geometry.io/devguide/s2cell_hierarchy.html) at level 11 which corresponds to an average area of 20.27 sq km. |
| [S2CellLevel12](https://datacommons.org/browser/S2CellLevel12) | [S2 cell](http://s2geometry.io/devguide/s2cell_hierarchy.html) at level 12 which corresponds to an average area of 5.07 sq km. |
| [S2CellLevel13](https://datacommons.org/browser/S2CellLevel13) | [S2 cell](http://s2geometry.io/devguide/s2cell_hierarchy.html) at level 13 which corresponds to an average area of 1.27 sq km. |
| [S2CellLevel14](https://datacommons.org/browser/S2CellLevel14) | [S2 cell](http://s2geometry.io/devguide/s2cell_hierarchy.html) at level 14 which corresponds to an average area of 0.32 sq km. |
{: .doc-table}
