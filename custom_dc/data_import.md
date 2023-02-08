---
layout: default
title: Data Import
nav_order: 2
parent: Custom Data Commons
published: true
---

## Adding a custom hierarchy

When using a custom DC instance with new statistical variables, it can be useful to define a custom hierarchy for the variables. The hierarchy is used in the Explorer tools to navigate the variables in a structured manner.

The hierarchy consists of `StatVarGroup` nodes which are linked to each other and to a custom root node via `specializationOf` properties. For example, a sample custom hierarchy with two layers of groups is provided below. This example be used as a template — please replace all <span class="param">{}</span> with custom identifiers: 

<div class="schema-example">
Node: dcid:dc/g/Custom_Root
typeOf: dcs:StatVarGroup
specializationOf: dcid:dc/g/Root
name: "<span class="param">{Example Root Node}</span>"

Node: dcid:dc/g/Custom_<span class="param">{1A}</span>
typeOf: dcs:StatVarGroup
name: "<span class="param">{Group 1A}</span>"
specializationOf: dcid:dc/g/Custom_Root
displayRank: <span class="param">{1}</span>

Node: dcid:dc/g/Custom_<span class="param">{1B}</span>
typeOf: dcs:StatVarGroup
name: "<span class="param">{Group 1B}</span>"
specializationOf: dcid:dc/g/Custom_Root
displayRank: <span class="param">{2}</span>

Node: dcid:dc/g/Custom_<span class="param">{2A}</span>
typeOf: dcs:StatVarGroup
name: "<span class="param">{Group 2A}</span>"
specializationOf: dcid:dc/g/Custom_<span class="param">{1A}</span>
displayRank: <span class="param">{1}</span>
</div>

In this example, `"Example Root Node"` has two child groups: `"Group 1A"` and `"Group 1B"`. `"Group 1A"` additionally has a child group `"Group 2A"`.

Next, each new variable needs a `StatisticalVariable` node definition, which will specify which group in the hierarchy it belongs to. For example, two sample statistical variable definitions are provided below. These example be used as a template — please replace all <span class="param">{}</span> with custom identifiers: 

<div class="schema-example">
Node: dcid:<span class="param">{Variable_X}</span>
name: "<span class="param">{Variable X}</span>"
typeOf: dcs:StatisticalVariable
populationType: dcs:Thing
measuredProperty: dcs:<span class="param">{Variable_X}</span>
statType: dcs:measuredValue
memberOf: dcid:dc/g/Custom_<span class="param">{1A}</span>

Node: dcid:<span class="param">{Variable_Y}</span>
name: "<span class="param">{Variable Y}</span>"
typeOf: dcs:StatisticalVariable
populationType: dcs:Thing
measuredProperty: dcs:<span class="param">{Variable_Y}</span>
statType: dcs:measuredValue
memberOf: dcid:dc/g/Custom_<span class="param">{2A}</span>
</div>

In this example, `"Variable X"` is part of `"Group 1A"` and `"Variable Y"` is part of `"Group 2A"`.

The `StatVarGroup` and `StatisticalVariable` nodes that make up the hiearchy can be included in a `.mcf` file and added to the GCS bucket associated with the custom DC instance.