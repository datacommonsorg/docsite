---
layout: default
title: Schema design guidelines
nav_order: 6
parent: Build your own Data Commons
---

# Schema design and naming guidelines

This page describes guidelines you should follow when creating your Data Commons schemas. It shows how to correctly define statistical variables and entities, and supply observations. Following these guidelines ensures that your data is correctly linked to the rest of the Data Commons graph, can be properly aggregated, and conform to best practices assumed by base Data Commons import pipelines.

This page assumes that you have familiarized yourself with the concepts 


## 1. Principles



1. **Inheritance graph integrity**: All nodes must connect through inheritance (`subClassOf`, `typeOf`); orphan nodes are strictly forbidden. Root classes should eventually trace back to canonical Schema.org building blocks (e.g., `schema:StatisticalVariable`, `schema:Observation`, `schema:Class`).
2. **Reusability vs. ambiguity**: Optimize node and property definitions for reusability across datasets. However, never force data into an existing schema if doing so introduces semantic ambiguity or risk of data misinterpretation.
3. **Clean property splitting**: Avoid duplicating concepts across property names and value enumerations. Properties must be cleanly separated with each having a distinct purpose (e.g., avoid `measuredProperty: dcs:householdIncome`, and use `measuredProperty: schema:Income `and` populationType: schema:Household`).
4. **Optimized traversal**: Structure schemas to support reasonable node traversal for downstream retrievability - there should neither be orphan nodes (absence of inheritance) nor multiple traversals for common retrieval patterns.
5. **StatVar vs. observation boundary**: A Statistical Variable defines the semantic concept (what is being measured in abstract terms), whereas an Observation records the concrete data value at a specific point in time for a specific entity with respective attributes describing the data value.



---



## 2. Namespace conventions

When defining custom variables or nodes, adhere to the following formal rules:



*   **Namespace prefixes**: Every reference to a node in the knowledge graph must be prefixed by a namespace identifier:
    *   `schema:` If a type, class, or property exists in schema.org, it should use the `schema:` prefix (e.g., `schema:Person`, `schema:StatisticalVariable`).
    *   `dcs:` If a type, class, or property does not exist in schema.org but is defined in the [Data Commons schema add-on](https://github.com/datacommonsorg/schema/tree/main/core), it should use the `dcs:` prefix (e.g., `dcs:rentAsked`,` dcs:foodLossIndex`).
    *   `dcid:` Every node in base Data Commons has a unique `dcid:` identifier. All nodes that are not part of the core Data Commons schema should use dcid:. For custom nodes created in a Data Commons Platform instance, use a prefix of your choice, i.e., company :.
    *   **Custom instance namespace**: For custom nodes created in a Data Commons Platform instance, utilize a unique namespace prefix for your instance (e.g., `who/` or `partner/`).
*   **Quoting and references**: All fields referencing another node in the graph MUST use their appropriate namespace prefix (`schema:`, `dcs:`, `dcid:`, or custom instance prefix). All literal values or strings that do not reference a node MUST be enclosed in quotation marks.
*   **Immutability of definitions**: If reusing existing entities or StatVars, existing node definitions cannot be overridden by modifying field values. Any semantic change requires generating a new variable with a unique DCID.



---



## 3. Statistical Variable Anatomy (`schema:StatisticalVariable`)

A valid Statistical Variable must explicitly define its mathematical nature, subject, and constraints using the following rules:


<table>
  <tr>
   <td><strong>Field</strong>
   </td>
   <td><strong>Requirement</strong>
   </td>
   <td><strong>Guidance</strong>
   </td>
   <td><strong>Good Example</strong>
   </td>
   <td><strong>Failure Example </strong>
   </td>
  </tr>
  <tr>
   <td><code><del>population</del></code>
<p>
<code><del>Type</del></code>
<p>
<code>measured</code>
<p>
<code>Subject</code>
   </td>
   <td><strong>Mandatory</strong>
   </td>
   <td><em>Who or what is the focus of this measurement? </em>
<p>
• <strong>Person vs. event</strong>: Promote the event class when the entity is a point-in-time transaction (such as diseases, deaths, births, or traffic crashes). Promote the person subcategory when the entity has an ongoing state. The distinction is often subtle and in the research methodology.
<p>
• <strong>Place</strong>: Place is very generic, and should be avoided when there is more specific information to make a <code>populationType</code>. The only case in which a place is valid to use as a populationType is if only properties of the place itself are being measured, e.g. the area.
   </td>
   <td>Measure events instead of people when it’s the incident being measured.

```
Node: dcid:Count_MedicalConditionIncident_Chlamydia
typeOf: schema:StatisticalVariable
populationType: dcs:MedicalConditionIncident
measuredProperty: 
statType: dcs:Count
constraintProperties: dcs:MedicalCondition
medicalCondition: dcs:Chlamydia          
```


   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td><code>measured</code>
<p>
<code>Property</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td><em>What quantitative metric of the group are we measuring?</em>
<p>
The specific attribute evaluated on an individual member of the population. The observation value represents the <code>measuredProperty</code>, i.e., if the <code>measuredProperty</code> is age, the observation value is an age.
<p>
If measuring the existence/count of the <code>populationType</code>, it’s recommended to omit.
   </td>
   <td>Measuring the existence of a <code>populationType</code>.

```
Node: dcid:Count_Person
typeOf: schema:StatisticalVariable
populationType: schema:Person
measuredProperty:  
statType: dcs:Count
```


<p>
Measuring a characteristic of people.

```
Node: dcid:Mean_Age_Person
typeOf: schema:StatisticalVariable
populationType: schema:Person
measuredProperty: schema:Age
statType: dcs:MeanValue
```


<p>
Measuring a characteristic of a thing.

```
Node: dcid: Mean_Cost_Fuel
typeOf: schema:StatisticalVariable
populationType: dcs:Fuel
measuredProperty: dcs:Cost
statType: dcs:MeanValue
```



```
Node: dcid: Amount_Debt_Government
typeOf: schema:StatisticalVariable
populationType: schema:Government
measuredProperty: schema:Debt
statType: dcs:Amount
```


   </td>
   <td>Mathematical operator in <code>measuredProperty</code>.

```
Node: dcid: Count_Student
typeOf: schema:StatisticalVariable
populationType: schema:Student
measuredProperty: dcs:Count
statType: measuredValue
```


<p>
Merge mathematical operator with <code>measuredProperty</code>.

```
Node: dcid:MedianIncome_Household
typeOf: dcs:StatisticalVariable
populationType: schema:Household
measuredProperty: dcs:medianIncome 
statType: measuredValue
```


   </td>
  </tr>
  <tr>
   <td><code>statType</code>
   </td>
   <td><strong>Mandatory</strong>
   </td>
   <td><em>How was this column calculated?</em> 
<p>
Explicit math class operator. With Data Commons measuring purely aggregations (to date), every StatVar has a mathematical operator to calculate the aggregation.
<p>
statType is not the unit of measurement, e.g., statType can be <code>rate</code> but not <code>percent</code>. 
   </td>
   <td>Averages.

```
Node: dcid:Median_Age_Person
typeOf: schema:StatisticalVariable
populationType: schema:Person 
measuredProperty: schema:Age 
statType: dcs:MedianValue
```


<p>
Rates of people: illiteracy rate, poverty rate, disability rate.

```
Node: dcid:Rate_Unemployment_Person
typeOf: schema:StatisticalVariable
populationType: schema:Person
measuredProperty: dcid:Unemployment
statType: dcs:Rate
```



```
Node: dcid: Rate_Interest_TreasuryBill_Month1
typeOf: schema:StatisticalVariable
populationType: dcs:TreasuryBill
measuredProperty: dcs:Interest      statType: dcs:Rate         constraintProperties: dcs:Maturity
maturity: dcs:Month1               
```


   </td>
   <td>Generic values, e.g., <code>measuredValue</code>.

```
Node: dcid:Count_Student
typeOf: dcs:StatisticalVariable
populationType: schema:Student
measuredProperty: dcs:count
statType: dcs:measuredValue
```


<p>
Observation-level attributes, e.g.,<code> marginOfError</code>.

```
Node: dcid:MarginOfError_Monthly_Median_GrossRent_HousingUnit
typeOf: dcid:StatisticalVariable
populationType: schema:HousingUnit
measuredProperty: dcid:grossRent
statType: dcid:marginOfError
```


   </td>
  </tr>
  <tr>
   <td><code>constraint</code>
<p>
<code>Property</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td>A property narrowing the population to a specific slice.
<p>
• <strong>MP vs. CP test</strong>: If evaluating a single aggregate value on the subject (e.g., age of a person), use <code>measuredProperty</code>; if slices partition the population (e.g., income of people between 25-34), use <code>constraintProperty</code>.
   </td>
   <td>Narrowing to female population slice.

```
Node: dcid: Count_Person_Female
typeOf: schema:StatisticalVariable
populationType: schema:Person
measuredProperty:  
statType: dcs:Count         constraintProperties: schema:Gender
gender: schema:Female               
```


   </td>
   <td>Bake places into <code>constraintProperty</code>.

```
Node: dcid: Annual_TradeBalance_EconomicActivity_CountryUSA
typeOf: dcs:StatisticalVariable
populationType: EconomicActivity
measuredProperty: tradeBalance
statType: measuredValue
constraintProperties: toCountry
toCountry: countryUSA
```


   </td>
  </tr>
  <tr>
   <td><code>measurementDenominator</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td>Reference to another valid Statistical Variable DCID defining the baseline for relative metrics.
<p>
Can be omitted if information is not present in the data source.
   </td>
   <td>Per-capita rates.

```
Node: dcid: Amount_Debt_Goverment_PerCapita
typeOf: schema:StatisticalVariable
populationType: schema:Government
measuredProperty: schema:Debt      
statType: dcs:Amount         
measuremendDenominator: dcid:Count_Person              
```


   </td>
   <td>Omitting denominator on relative metrics even though source references it. 

```
Node: dcid:Count_Person_PerCapita_Diabetes
typeOf: dcs:StatisticalVariable
populationType: schema:Person
measuredProperty: dcs:count
constraintProperty: dcs:diabetesStatus
diabetesStatus: dcs:Diabetic 
```


   </td>
  </tr>
  <tr>
   <td><code>comparison</code>
<p>
<code>Period</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td>For rates calculated in comparison to a specific time in the past.
<p>
Can be omitted if information is not present in the data source.
   </td>
   <td>Growth rate.

```
Node: dcid:GrowthRate_ConsumerPriceIndex_ConsumerGoodsAndServices_MonthOnChange
typeOf: schema:StatisticalVariable
populationType: dcs:ConsumerGoodsAndServices
measuredProperty: dcs:ConsumerPriceIndex
statType: dcs:GrowthRate                 
comparisonPeriod: dcs:MonthOnChange      
```


   </td>
   <td>Omitting <code>comparisonPeriod</code> on relative metrics even though source references it. 

```
Node: dcid:InflationRate_ConsumerGoods
typeOf: dcs:StatisticalVariable
populationType: dcs:ConsumerGoodsAndServices
measuredProperty: dcs:inflationRate      
statType: dcs:measuredValue
```


   </td>
  </tr>
  <tr>
   <td><code>measurementQualifier</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td><em>"How was data treated or adjusted?"</em> 
<p>
Applies operational filters or scales.
<p>
<strong>Do’s:</strong>
<p>
<strong>Macroeconomics:</strong> <code>Nominal</code>, <code>RealValue</code>, or <code>PurchasingPowerParity (PPP)</code>.
<p>
<strong>Time-series aggregation:</strong> <code>Annual</code>, <code>Monthly</code>, or <code>Weekly</code> (used when an observation is bundled into an accounting period rather than a snapshot).
<p>
<strong>Date adjustments:</strong> <code>SeasonallyAdjusted</code>, <code>Rolling30YAvg</code>.
<p>
<strong>Financial metrics:</strong> <code>StandardizedCurrency</code> vs. <code>LocalCurrency</code>.
<p>
<strong>Don’t’s:</strong>
<p>
• <strong>Temporal rule</strong>: Do not use for simple calendar dates; only include time when signaling a mathematical smoothing or accounting window.
<p>
• <strong>Constraints: </strong>Do not use it to express additional constraints.
   </td>
   <td>Macroeconomics qualifiers.

```
Node: dcid:Nominal_Amount_EconomicActivity_GrossValueAdded
typeOf: schema:StatisticalVariable
populationType: dcs:EconomicActivity (?)
measuredProperty: dcs:GrossValueAdded
statType: dcs:Amount                 
measurementQualifier: schema:Nominal  
constraintProperties: dcs:ActivitySource
activitySource: dcs:GrossValueAdded  
```


   </td>
   <td>Confusing calendar timestamps with qualifiers.

```
Node: dcid:Annual_Rainfall_Place
typeOf: dcs:StatisticalVariable
populationType: schema:Place
measuredProperty: dcs:Rainfall
statType: dcs:measuredValue                 
measurementQualifier: dcs:Annual    
```


<p>
Baking <code>constraintProperties</code> into <code>measurementQualifier</code>.

```
Node: dcid:Offense_Count_CriminalIncidents_IsHateCrime
typeOf: dcs:StatisticalVariable
populationType: dcs:HateCrimeIncidents
measuredProperty: dcs:count
statType: dcs:measuredValue                 
measurementQualifier: dcs:Offense    
```


   </td>
  </tr>
  <tr>
   <td><code>domain</code>
<p>
<code>Includes</code> / <code>range</code>
<p>
<code>Includes</code>
   </td>
   <td><strong>Mandatory</strong> <em>(on properties)</em>
   </td>
   <td>Explicitly define allowable subject classes (<code>domainIncludes</code>) and enumeration classes (<code>rangeIncludes</code>) for all property nodes.
   </td>
   <td>Include both for a property node.

```
Node: schema:Gender
typeOf: schema:Property
domainIncludes: schema:Person
rangeIncludes: schema:GenderType
```


   </td>
   <td>Allowing untyped property assignments.
   </td>
  </tr>
  <tr>
   <td><code>subClassOf</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td>Every time you are creating a class, it needs to be a subclass of something, even if it’s a subclass of <code>Thing</code>. 
   </td>
   <td>
   </td>
   <td>Creating niche subclasses.

```
Node: dcid:PersonFemale15To64
subClassOf: schema:Person
```


   </td>
  </tr>
  <tr>
   <td><code>typeOf</code>
   </td>
   <td><strong>Mandatory</strong>
   </td>
   <td>Every node <strong>MUST </strong>have a <code>typeOf</code>. 
<p>
Enum instances <strong>MUST</strong> be typed directly to their custom enum class (which subclasses <code>schema:Enumeration</code>), not directly to <code>schema:Enumeration</code>.
   </td>
   <td>Enum instances typed to their enum class.

```
Node: dcs:CollisionCrash
typeOf: dcs:CrashTypeEnum                
```


   </td>
   <td>Absence of typeOf for any node. 
   </td>
  </tr>
</table>




---



## 4. Observation Anatomy (`schema:Observation`)

An **Observation** connects a Statistical Variable to a concrete entity, time period, and numerical value. To guarantee retrievability and accuracy across both Place and Non-Place entities, Observations must strictly follow these rules:


<table>
  <tr>
   <td><strong>Field</strong>
   </td>
   <td><strong>Requirement</strong>
   </td>
   <td><strong>Guidance</strong>
   </td>
   <td><strong>Failure Example</strong>
   </td>
  </tr>
  <tr>
   <td><code>observationAbout</code> / <code>Entities</code>
   </td>
   <td><strong>Mandatory</strong>
   </td>
   <td><em>“For who or what am I measuring for?”</em>
<p>
The physical or conceptual entity the observation is anchored and aggregated to.
<p>
• <strong>Place entities</strong>: Geographic locations (e.g., country, state, city).
<p>
• <strong>Non-place entities</strong>: Non-geographic entities such as companies, or commodities. Most suitable for high cardinality entities that would otherwise cause StatVar explosion.
<p>
• <strong>Retrievability Rule</strong>: When designing multi-entity relationships (e.g., trade flows or exports), resolve directional partners as observation properties or constraint properties without causing entity ambiguity.
   </td>
   <td>Failing to distinguish between Place and Non-Place target entities during resolution.
   </td>
  </tr>
  <tr>
   <td><code>observationDate</code> / <code>time</code>
   </td>
   <td><strong>Mandatory</strong>
   </td>
   <td><em>“When am I measuring?”</em>
<p>
The calendar point or accounting period in which the observation was recorded (e.g., <code>"2023"</code>, <code>"2023-05"</code>).
<p>
• <strong>Boundary with qualifiers</strong>: Raw calendar counts only require <code>observationDate</code>. Do NOT duplicate calendar periods into <code>measurementQualifier</code> unless a mathematical rolling window or temporal aggregation formula was applied.
   </td>
   <td>Adding the date of the publication, e.g., adding <code>2023-05</code> for an annual measurement
   </td>
  </tr>
  <tr>
   <td><code>unit</code>
   </td>
   <td><strong>Mandatory</strong>
   </td>
   <td><strong>Everything should have a unit.</strong> The unit of measurement (e.g., currency, physical dimension, or standard scale). It must directly align with and connect to the concept defined in <code>measuredProperty</code>.
<p>
The <code>unit</code> is what is displayed on charts. 
   </td>
   <td>Omitting units on numerical values or using unit strings that conflict with the <code>measuredProperty</code> domain.

```
Node: dcid: Count_Person_Female
typeOf: schema:StatisticalVariable
populationType: schema:Person
statType: dcs:Count   

> unit: dcs:Person                   
```



```
Node: dcid:Rate_Unemployment_Person
typeOf: schema:StatisticalVariable
populationType: schema:Person
measuredProperty: dcid:Unemployment
statType: dcs:Rate

> unit: dcs:Percent
```



```
Node: dcid:Mean_Age_Person
typeOf: schema:StatisticalVariable
populationType: schema:Person
measuredProperty: schema:Age
statType: dcs:MeanValue

> unit: dcs:Years
```


<p>
Unit baked into measuredProperty

```
Node: dcid:Count_Household_Income_USD50000To74999
typeOf: dcs:StatisticalVariable
populationType: schema:Household
measuredProperty: dcs:incomeInUSD    # Violation: unit baked into measured property
```


   </td>
  </tr>
  <tr>
   <td><code>value</code>
   </td>
   <td><strong>Mandatory</strong>
   </td>
   <td>The numerical data point recorded for the entity and statistical variable.
   </td>
   <td>Putting calculated statistical error boundaries (like margin of error) as the primary value.
   </td>
  </tr>
  <tr>
   <td><code>scalingFactor</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td>The multiplier by which the raw number was scaled in the source dataset (e.g., thousands, millions, billions). 
   </td>
   <td>Leaving scaled values unnormalized, causing 1000x or 1,000,000x magnitude discrepancies in queries.
   </td>
  </tr>
  <tr>
   <td><code>measurement</code>
<p>
<code>Method</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td>The technique, survey, or algorithmic method used to collect and calculate the observation data. Critical for data provenance and cross-source comparisons.
<p>
These are often the names of the specific surveys used to collect the raw data. 
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td><code>attributes1 / attribute2 / attribute3 🆕</code>
   </td>
   <td><strong>Optional</strong>
   </td>
   <td>Supplemental observation-level statistical attributes (e.g., <code>marginOfError</code>, <code>stdErr</code>, <code>minValue</code>, <code>maxValue</code>).
<p>
This is information that belongs to each observation value and keeping them close to the value (vs. in a separate StatVar) is critical to further assess the observation value.
   </td>
   <td>Forcing margin of error or variance into <code>statType</code> instead of observation attributes.

```
Node: dcid:MarginOfError_Monthly_Median_GrossRent_HousingUnit
typeOf: dcid:StatisticalVariable
populationType: schema:HousingUnit
measuredProperty: dcid:grossRent
statType: dcid:marginOfError
```


   </td>
  </tr>
  <tr>
   <td><code>source</code> / <code>provenance</code>
   </td>
   <td><strong>Mandatory (import level); Optional (observation level)</strong>
   </td>
   <td>Explicit reference linking to the dataset publisher, dataset and original import job.
<p>
Recommended metadata:
<p>
• Name of the organization (<code>source</code>)
<p>
• URL to the source (<code>source_URL</code>)
<p>
• Name of the table (<code>provenance_name</code>)
<p>
• URL to the table description (<code>provenance_URL</code>)
<p>
• URL to the data (?)
<p>
• License type (<code>license_type</code>)
   </td>
   <td>Importing orphaned observations without traceability to a source dataset.
<p>
Encoding source concept into the StatVar itself (exception: specific code lists from an organization that are alternative names of a property, e.g., UN/LOCODE).

```
employmentStatus: dcs:BLS_InLaborForce  
```


   </td>
  </tr>
</table>




---



## 5. Choosing the Modelling Level

Certain modelling decisions are subjective to the questions that the data should answer, and may differ based on the specific use case. Decide systematically where a concept belongs - whether to elevate it to `populationType`, bind it as a `constraintProperties` on the StatVar, or model it as an `observationProperties`. 



1. **Shared universe**: When a dimension is modeled as a `constraintProperties` or `observationProperties`, its enums are inherently connected as partitions of a single shared universe. Slices can easily be evaluated as fractions of the total `populationType`, but they cannot represent fundamentally separate entities. If two concepts require independent schemas or cannot be compared as slices of the same base entity (e.g., individual debt vs. government debt are fundamentally different financial concepts rarely compared as slices of a single pie), elevate them to distinct `populationType` classes instead of modeling them as `constraintProperties`.
2. **Aggregation:** If a concept represents a partition or slice where individual members naturally sum up to a measured total across the base population, model it as a `constraintProperties` on the StatVar (since it is easier to measure the total across all events when modeled as constraints).
3. **Attribute density: **If there are many distinct characteristics to measure about a specific subject (the entire research data is about aspects of hateCrime), promote that subject to be the primary `populationType` class rather than a simple `constraintProperties` value.
4. **StatVar explosion**: Once a concept is modeled as a `constraintProperties`, every unique combination of constraint values generates a standalone StatVar. If a dimension has low cardinality, and a standardized taxonomy (e.g., gender, age bracket, or broad economic sector), bind it as a `constraintProperties`. If a dimension has very high cardinality, or involves dynamic entities (e.g., thousands of destination countries or specific partner corporations), model it as an `observationProperties` to prevent StatVar explosion.
5. **Performance**: The Data Commons Platform is currently optimized for up to 3 `observationProperties` - beyond that, the system hasn’t been stresstested for performance and functionality. 


### Example: Multi-Entity Trade Flows

Envision the example of _product exports of companies from country A to country B. _



*   **Option 1: Company & product as <code>constraintProperty</code>; countries as <code>observationProperty</code></strong> → <code>StatVar</code> = <code>Amount_Exports_[Product]_[Company]</code>. 

    Because there are thousands of potential countries (high cardinality), countries are kept as an <code>observationProperty</code>.

*   **Option 2: Product as <code>constraintProperty</code>; company & countries as <code>observationProperty </code></strong>→<code> StatVar</code> = <code>Amount_Exports_[Product]</code>. 

    If companies involved in export are dynamic and high-cardinality, both Company and target Country are modeled as <code>observationProperty</code>.


    **Option 3: Product, company & countries as <code>observationProperty </code>→</strong> <code>StatVar</code> = <code>Amount_Exports</code>.


    Not feasible due to current system requirements on Data Commons Platform. 


Choose the structure that optimizes for downstream retrievability while keeping the StatVar graph reasonably scoped.



---



## 6. Naming & Casing Conventions



1. **StatVar Dcid**
    *   **Standard Formula**: \
`[measurementQualifier]_statType_[measuredProperty]_populationType_[constraintValue1]_[constraintValue2]_[...]_[measurementDenominator]`
    *   **Alphabetical constraint ordering**: When multiple constraint values are present, order them alphabetically by their underlying **property name** (not the value string). For example, because the property `gender` precedes `race` alphabetically, a gender constraint value must appear before a race constraint value in the DCID.
    *   **Denominator suffixes**: If a variable includes a `measurementDenominator`, append `_AsAFractionOf_[measurementDenominator]` to the end of the DCID string.
    *   For b) I believe entities (classes), enums, and therefore StatVars are supposed to be capitalized but properties must not be. I believe this is actually documented in various docs,
2. **StatVar name: **While StaVar Dcid is a machine readable, deterministically-created field, StatVar name should be
    *   Human readable
    *   Optimized for display in user experiences
    *   Not inclusive of methodology details
    *   Example: _[Gender wage gap](https://screenshot.googleplex.com/3UjQZMtMMqe4afe https://screenshot.googleplex.com/AbCrGHyUcweUVMH) _vs. `Mean_Income_AsAFractionOf_Mean_Income_Men`.
3. **StatVar description: **[Placeholder]
4. **Casing**
    *   StatVar name: Use `PascalCase` for all component blocks, separated by underscores (`_`).
    *   properties: camelCase.
    *   classes and enums: CamelCase.