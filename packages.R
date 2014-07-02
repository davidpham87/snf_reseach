install.packages('sp')
# Run this on ubuntu: sudo apt-get install libgdal1-dev libproj-dev
install.packages('rgdal') # GDAL must be installed

install.packages('rgdal',repos="http://www.stats.ox.ac.uk/pub/RWin")

install.packages('maptools')

install.packages('rgeos') # for Maptools
# install.packages('rgeos', repos="http://www.stats.ox.ac.uk/pub/RWin") # for Maptools

install.packages('maps')