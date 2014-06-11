library('data.table')
load('data/dat_agg_clean.RData') # load list dat.agg

library(rgdal)
library('rgeos')
library(ggplot2)
library(maptools)
library('RColorBrewer')

gpclibPermit()

world.map <- readOGR(dsn="data", layer="TM_WORLD_BORDERS_SIMPL-0.3")
world.ggmap <- fortify(world.map, region = "ISO3")

n <- length(unique(world.ggmap$id))
df <- data.frame(iso3 = unique(world.ggmap$id), growth = 0)

dat.lyb <- dat.agg[[1]]
setkey(dat.lyb, 'base_disciplin', 'project_year')

dat.l <- dat.lyb[, list(N = sum(N)), by='iso3'][order(N)]

world_map_void <- ggplot(df, aes(map_id = iso3)) +
  geom_map(map = world.ggmap, alpha = 0.4, fill = 'grey') +
  expand_limits(x = world.ggmap$long, y = world.ggmap$lat) +
  scale_fill_gradientn(
    colours = brewer.pal(9, 'Blues')[c(-1,-2)], guide = "colorbar",
    name = 'Log of Number\nof Project') +
  labs(y = NULL, x = NULL) + theme_bw() +
  theme(axis.line = element_blank(), axis.ticks = element_blank(),
        axis.text = element_blank())

