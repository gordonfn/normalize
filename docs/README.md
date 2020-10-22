<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/guidelines/master/docs/images/datastream.svg?sanitize=true" alt="DataStream Logo" width="400">
  <br/>
  Normalization Engine
  <br/>
  <br/>
</h1>

## DataStream 

DataStream ([DataStream.org](http://gordonfoundation.ca/initiatives/datastream)) is an online open-access platform for sharing water quality data. Data is uploaded, stored and shared in DataStream’s Open Data Schema -- a model based on the WQX standard for the Exchange of Water Quality Data. DataStream is free to use and allows users to query, visualize, and download data in this standardized format. To date, over 9 million water quality observations have been published across DataStream’s three regional platforms (Mackenzie DataStream,  Lake Winnipeg DataStream, and Atlantic DataStream) by watershed groups, Indigenous organizations, researchers and governments at all levels.

DataStream is led nationally by [The Gordon Foundation](http://gordonfoundation.ca) and is carried out in collaboration with regional partners and monitoring networks. Data contributors maintain ownership of their data which are published under open data licenses.

## Normalization
To support the ability to compare data on DataStream.

### Coordinates
To ensure all locations are accurately placed on our map we project all coordinates into the `WGS84` datum.

### Encode *
Different operating systems store documents using different file encodings. Some use proprietary standards, to overcome this we use `UTF-8` for all of our data encoding. `UTF8` has the widest support on operating systems, browsers, and the technology we use for DataStream. Sometimes when converting between encoding characters transformations can happen, we re-map these to the visually identical character in `UTF-8`.

### Measure
There are many devices used to measure observations at varying levels of accuracy. To ensure data can be visualized together we need to normalize the units of measure.

### Method Speciation
Characteristics can be uploaded with different Method Speciations. To allow them to be visualized together we normalize using the molar masses.
This is currently not implemented. If you feel this would have value please let us know.

### Sanitize *
Lists of allowed values in our data schema are case-sensitive to ensure they're interoperable. To make it easier for data stewards we allow values to be case-insensitive and correct internally.

### Time
To ensure our schema is as minimal as possible we calculate timezones based on location. We follow `ISO 8601` for time formatting notation.

### Vertical
TODO

\* Changes the data imported before saving to the dataset file.

<div align="center">
  <a href="http://gordonfoundation.ca"><img src="https://raw.githubusercontent.com/gordonfn/guidelines/master/docs/images/the-gordon-foundation.svg?sanitize=true" alt="The Gordon Foundation Logo" width="200"></a>
</div>