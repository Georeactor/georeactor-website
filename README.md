# GeoReactor

<a href="http://georeactor.com">GeoReactor</a> is makes your vector data into an interactive map. It comes up with an ideal ETL process and repeats the process when you update your data.

## Which map?

Starting with Google Maps API and Leaflet + OSM

## Current Project

- Point GeoReactor at a vector data file (if it's too big, suggest other options)
- GeoReactor converts the file to TopoJSON to minimize file size
- A browser window shows an interactive map with the GeoJSON vector data on top of it
- For first polygon, GeoReactor shows a sidebar "info window" with text of each property
- The side bar lets you customize images, links, etc. to make info window better
- Output is a HTML+CSS+JS static site, with ReactJS

## Goal

- How can this process generate a server for Heroku, for geospatial APIs?
- GeoReactor saves a config file so future data updates go through the same ETL process

## License

Open source under MIT license
