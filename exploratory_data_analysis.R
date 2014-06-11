library('ggplot2')
library('gridExtra')
library('plyr')
library('RColorBrewer')
library('data.table')
library('rCharts') # Interactive Plot

load('data/dat_clean.RData') # load dat
load('data/dat_agg_clean.RData') # load list dat.agg


##
dat.base <- dat[, .N, by = 'project_year,base_disc_name']
n <- nPlot(N ~ project_year, group = 'base_disc_name', data = dat.base[order(project_year)], type = 'multiBarChart')


head(dat)

unique(dat[c('MainDisciplin', 'MainDiscNummer')])

dat$basic_disciplin <- round(dat$MainDiscNummer/100)
dat.disc <- ddply(dat, .(Project_year, MainDisciplin, basic_disciplin), nrow)
colnames(dat.disc)[4] <- 'project_count'

l.p <- list()
for (i in seq(1,3)) {
    dev.new()
    l.p[[i]] <- ggplot(subset(dat.disc, basic_disciplin == i),
            aes(Project_year, project_count, color = MainDisciplin)) +
                geom_line() + ylim(c(0, 175)) +
                    scale_color_brewer(palette='Paired')
    print(l.p[[i]])
}

dat.disc.summary <- ddply(dat.disc, .(MainDisciplin),
    function(x) data.frame(project_count = sum(x$project_count)))

### Economics and Finance are included in social sciences...
### Or the SNF under fund the economics and finance!
ggplot(dat.disc.summary,
       aes(reorder(MainDisciplin, project_count), project_count)) +
    geom_bar(fill = 'steelblue',  stat="identity") + coord_flip()

### Location 

dat$basic_disciplin <- round(dat$MainDiscNummer/100)
dat.disc <- ddply(dat, .(Project_year, Host_Country, basic_disciplin), nrow)
colnames(dat.disc)[4] <- 'project_count'

dat.disc.summary <- ddply(dat.disc, .(Host_Country, basic_disciplin),
    function(x) data.frame(project_count = sum(x$project_count)))

ggplot(subset(dat.disc.summary[c(-1, -2),], project_count > 10),
       aes(Host_Country, project_count,
           fill = factor(basic_disciplin)))+
    geom_bar(position='dodge') +  scale_fill_brewer(palette='RdYlBu')


for (i in seq(1,3)) {
    dev.new()
    l.p[[i]] <- ggplot(
        subset(dat.disc, basic_disciplin == i),
            aes(Project_year, project_count, color = Host_Country)) +
                geom_line() + ylim(c(0, 175)) +
                    scale_color_brewer(palette='Paired')
    print(l.p[[i]])
}














