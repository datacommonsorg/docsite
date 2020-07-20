---
layout: default
title: Data Model
nav_order: 2
---

# Understanding the Data Commons Data Model

The Data Commons **data model** answers three questions:

1.  What types of data are stored in Data Commons?
2.  How do different data types relate to one another?
3.  How does one extend Data Commons to represent new data types?

This will require some basic knowledge of the purpose of Data Commons and how it
represents information. If you have not already, take a look at
[Introduction to Data Commons](/).

## The Data Model

The Data Commons data model defines a **schema** which standardizes what types
of entities are in the Data Commons Graph and how these entities are related.
This schema includes the [Schema.org](https://schema.org/docs/datamodel.html)
vocabulary and thus carries the same components as that in Schema.org:

1.  A set of **Classes** denoting the different types of information that is
    stored in the Data Commons graph.
2.  A set of **Properties** which relate these classes together.

However, the Data Commons data model also contains components that are not built
into Schema.org. In particular, it is important for Data Commons to represent
where the data is sourced from. Let us discuss classes, properties, and the
sourcing of information in greater detail.

### Classes

Every entity in the Data Commons graph has an at least one associated class
(also called its **type**) for which it is an instance of. Thus classes
categorize what types of entities are in the Data Commons graph. For example,
the state of California is an instance of [State](https://schema.org/State) and
Berkeley, California is an instance of [City](https://schema.org/City). Classes
are meant to be created for a reasonable group of entities that we wish to
represent:

-   Events via [Event](https://schema.org/Event)
-   Organizations via [Organization](https://schema.org/Organization)
-   Stores via [Store](https://schema.org/Store)

Like the Schema.org vocabulary, classes are organized into a **multiple
inheritance hierarchy** which means that a class can have multiple
*sub-classes*: Store has subclasses such as

-   [BookStore](https://schema.org/BookStore)
-   [ClothingStore](https://schema.org/ClothingStore)
-   [GroceryStore](https://schema.org/GroceryStore)

and a class can be sub-classed from multiple parent classes. When a class
sub-classes another, the sub-class inherits any properties applied to the parent
class.

> TIP: In Schema.org, all classes are sub-classes of
> [Thing](https://schema.org/Thing) for which properties such as
> [name](https://schema.org/name) and
> [description](https://schema.org/description) apply to. This means that "name"
> and "description" also apply to every other class defined in Schema.org.

This form of inheritance sometimes has unintuitive consequences. Because
[Volcano](https://schema.org/Volcano) is a sub-class of
[Place](https://schema.org/Place) and the property
[faxNumber](https://schema.org/faxNumber) applies to Place, the vocabulary
allows for Volcanos to have a fax-number. This is a byproduct of the fact that
the Data Commons schema supports Schema.org as a subset. In particular, the Data
Commons schema subsumes all benefits (and pecularities) of the Schema.org's
design. For this particular case, we leave it to the community to use the
vocabulary as intended. To quote the Schema.org data model documentation:

> We do not attempt to perfect this aspect of schema.org's structure, and
> instead rely heavily on an extensive collection of illustrative examples that
> capture common and useful combinations of schema.org terms.

### Properties

Properties in Data Commons relate different data types together. Specifically, a
property in Data Commons is an entity that relates classes in its **domain** to
classes in its **range**. For example, the
[location](https://schema.org/location) property denotes where something
occurs, is, or is otherwise located. The domain of "location" includes classes
such as [Action](https://schema.org/Action), [Event](https://schema.org/Event),
and [Organization](https://schema.org/Organization) and thus can have an
associated location. The location itself is represented by an instance of one of
the classes in the property's range: [Place](https://schema.org/Place),
[PostalAddress](https://schema.org/PostalAddress), and
[Text](https://schema.org/Text).

Properties can have sub-properties which capture a subset of the relations
defined by the parent property. But unlike Classes, sub-properties do not have
inheritance behaviors defined. For example, location has sub-properties
[workLocation](https://schema.org/workLocation) and
[homeLocation](https://schema.org/homeLocation) which represent the location of
a person's work and home. Consequently, the domain of workLocation and
homeLocation contains [Person](https://schema.org/Person) while the range
contains Place and [ContactPoint](https://schema.org/ContactPoint).

### Representing Statistics in Data Commons

Please see the [documentation on
GitHub](https://github.com/datacommonsorg/data/blob/master/docs/representing_statistics.md)