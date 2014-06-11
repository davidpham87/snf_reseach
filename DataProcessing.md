Data Processing for SNF Project
========================================================

## Loading Data in R    


```r
setwd('~/Dropbox/VizD3/snf_researcher') # Set working directory
library('data.table') # Efficient data.table operations
```

The file *Dataset2.csv* is exported from the xlsx file as the original csv file is corrupted.


```r
dat <- fread('data/Dataset2.csv')
head(dat)
```

```
##    Project_ID Project_year Host_Country
## 1:     121200         2008           GB
## 2:     121205         2008           BE
## 3:     121376         2008           DE
## 4:     121376         2008           DE
## 5:     121376         2008           CA
## 6:     121437         2008           US
##                                                                                     HostInstitute
## 1:                                                       Department of Computing Imperial College
## 2:                                                                 Katholieke Universiteit Leuven
## 3:                              Deutsches Institut für Internationale Pädagogische Forschung DIPF
## 4: Fakultät für Erziehungswissenschaft, Psychologie und Bewegungswissenschaft Universität Hamburg
## 5:                                       Institute for Studies in Education University of Toronto
## 6:                                             Department of Psychology University of Connecticut
##    ZIPcode_Host      Host_city project_start Project_end
## 1:      SW7 2BZ         London    01.05.2008  30.04.2009
## 2:         3000         Leuven    01.09.2008  31.05.2009
## 3:        60486 Frankfurt a.M.    01.01.2009  31.12.2010
## 4:        20146        Hamburg    01.01.2009  31.12.2010
## 5:      M5S IV6        Toronto    01.01.2009  31.12.2010
## 6:   06269-1020         Storrs    01.09.2008  31.08.2009
##             MainDisciplin MainDiscNummer
## 1: Philosophy, psychology            101
## 2: Philosophy, psychology            101
## 3: Philosophy, psychology            101
## 4: Philosophy, psychology            101
## 5: Philosophy, psychology            101
## 6: Philosophy, psychology            101
```

```r
summary(dat)
```

```
##    Project_ID      Project_year  Host_Country       HostInstitute     
##  Min.   :120877   Min.   :2008   Length:5065        Length:5065       
##  1st Qu.:130988   1st Qu.:2009   Class :character   Class :character  
##  Median :139875   Median :2011   Mode  :character   Mode  :character  
##  Mean   :139520   Mean   :2011                                        
##  3rd Qu.:148433   3rd Qu.:2013                                        
##  Max.   :157677   Max.   :2014                                        
##  ZIPcode_Host        Host_city         project_start     
##  Length:5065        Length:5065        Length:5065       
##  Class :character   Class :character   Class :character  
##  Mode  :character   Mode  :character   Mode  :character  
##                                                          
##                                                          
##                                                          
##  Project_end        MainDisciplin      MainDiscNummer
##  Length:5065        Length:5065        Min.   :101   
##  Class :character   Class :character   1st Qu.:102   
##  Mode  :character   Mode  :character   Median :203   
##                                        Mean   :187   
##                                        3rd Qu.:301   
##                                        Max.   :309
```

## Column renaming
For column name, the python/c++ standard will be used.


```r
setnames(dat, old=names(dat), new=tolower(names(dat)))
setnames(dat, c('hostinstitute', 'maindisciplin', 'maindiscnummer'),
          c('host_institute', 'main_disciplin', 'main_disc_nummer'))
```

## Date processing

```r
ProcessDate <- function(x){
  return(as.POSIXct(strptime(x, format = '%d.%m.%Y', tz = 'UTC')))
}

cols <- c('project_start', 'project_end')
for (col in cols) dat[, (col) := ProcessDate(get(col))]
dat[, project_length := project_end - project_start] # Project length
```

## Reduce variance in bias-variance trade-off

There are too many disciplines. Hence any analysis would be bound to have too much variances and it might be better to perform the analysis on the base disciplin first and then if time allows to run the analysis with the more refined data.


```r
dat[, base_disciplin := main_disc_nummer %/% 100]
dt.bdisc <- data.table(base_disciplin = c(1,2,3),
 base_disc_name = c('Social Sciences', 'Basic Sciences', 'Biology_Med'))
setkey(dat, base_disciplin)
dat <- dat[J(dt.bdisc)]

dat[, host_city := tolower(host_city)] # case not sensitive
```

## Add Countries in full name
A full name of the country is appened in order to draw the maps.

The *country.csv* file can found at this [github link](https://github.com/umpirsky/country-list/edit/master/country/cldr/en/country.csv).


```r
country <- fread('data/country.csv')

setkey(country, iso2) # Use data.table Join
setkey(dat, host_country)
dat <- country[J(dat)]
```

## NA treatment

There are some NA (mainly because of the new country has not been entered yet).


```r
nrow(dat) - sum(complete.cases(dat)) # Number of incomplete case
dat <- na.omit(dat)
setnames(dat, 'name', 'country')
```

## Aggregate for maps

These aggregations will be used to perform spatial analysis. Further, we also count the number of project in a country for a given moment in time (e.g. the number of projects in the USA in February 2001).


```r
dat.lyb <- dat[, .N, by = 'iso3,project_year,base_disciplin'] # l for land, y year, b base_discplin
dat.lb <- dat[, .N, by = 'iso3,base_disciplin'] # l for land

dat.cyb <- dat[, .N, by = 'host_city,project_year,base_disciplin']
dat.cb <- dat[, .N, by = 'host_city,base_disciplin']

dat.agg <- list(dat.lyb, dat.lb, dat.cyb, dat.cb) # List

### Creates a finer grid for plotting time series.
dat.ts <- data.table(expand.grid(base_discplin = c(1,2,3),
                      year = seq(2008, 2014), month = seq(1, 12),
                     iso3= unique(dat$iso3)))
dat.ts[, N:= 0];
```

```
##        base_discplin year month iso3 N
##     1:             1 2008     1  ALB 0
##     2:             2 2008     1  ALB 0
##     3:             3 2008     1  ALB 0
##     4:             1 2009     1  ALB 0
##     5:             2 2009     1  ALB 0
##    ---                                
## 19148:             2 2013    12  ZWE 0
## 19149:             3 2013    12  ZWE 0
## 19150:             1 2014    12  ZWE 0
## 19151:             2 2014    12  ZWE 0
## 19152:             3 2014    12  ZWE 0
```

```r
setkeyv(dat.ts, names(dat.ts)[-5])

UpdateCountPeriod <- function(x){
  month.delta <- 24*3600*30
  begin.dte <- x$project_start
  end.dte <- x$project_end
  base.disc <- x$base_disciplin
  cty <- x$iso3
  while(begin.dte < end.dte){
    dat.ts[J(base.disc, year(begin.dte), month(begin.dte), cty), N:= N+1]
    begin.dte <- begin.dte + month.delta
  }
}

for (i in seq_along(dat$iso3)){
  UpdateCountPeriod(dat[i])
}

### Update the date
dat.ts[, date:= as.POSIXct(paste0(year, '-', month, '-1'), tz = 'UTC')];
```

```
##        base_discplin year month iso3   N       date
##     1:             1 2008     1  ALB   0 2008-01-01
##     2:             1 2008     1  ARG   0 2008-01-01
##     3:             1 2008     1  AUT   0 2008-01-01
##     4:             1 2008     1  AUS   0 2008-01-01
##     5:             1 2008     1  BIH   0 2008-01-01
##    ---                                             
## 19148:             3 2014    12  USA 179 2014-12-01
## 19149:             3 2014    12  URY   0 2014-12-01
## 19150:             3 2014    12  VNM   0 2014-12-01
## 19151:             3 2014    12  ZAF   4 2014-12-01
## 19152:             3 2014    12  ZWE   0 2014-12-01
```

## Conclusion

Saving the files.


```r
head(dat)
```

```
##    iso2   country  iso_name iso3 numcode base_disciplin project_id
## 1:   AL   Albania   ALBANIA  ALB       8              1     148453
## 2:   AR Argentina ARGENTINA  ARG      32              1     123687
## 3:   AR Argentina ARGENTINA  ARG      32              1     134137
## 4:   AR Argentina ARGENTINA  ARG      32              1     142962
## 5:   AR Argentina ARGENTINA  ARG      32              1     142790
## 6:   AR Argentina ARGENTINA  ARG      32              1     126162
##    project_year
## 1:         2013
## 2:         2008
## 3:         2010
## 4:         2012
## 5:         2012
## 6:         2009
##                                                                                          host_institute
## 1:                                                       Archäologisches Museum Korça Universität Korça
## 2:                                  Facultad de Derecho y Ciencias Sociales Universidad de Buenos Aires
## 3:                                                      Facultad de Derecho Universidad de Buenos Aires
## 4: Center for Distributive, Labor & Social Stud Facultad de Ciencias Económicas Universidad de La Plata
## 5:                                 Universidad de Buenos Aires Facultad de Ciencias Economicas CEINLADI
## 6:                           Instituto Diversidad Cultural y Procesos Universidad Nacional de Río Negro
##    zipcode_host               host_city project_start project_end
## 1:                                korça    2013-09-01  2014-11-30
## 2:     C1425CKB  ciudad de buenos aires    2008-09-01  2009-11-30
## 3:         1425            buenos aires    2011-04-01  2012-03-31
## 4:         1900                la plata    2012-08-01  2013-01-31
## 5:     C1120AAQ            buenos aires    2012-09-01  2013-08-31
## 6:     R8403BNH san carlos de bariloche    2009-08-01  2013-04-30
##     main_disciplin main_disc_nummer project_length  base_disc_name
## 1:     Art studies              104       455 days Social Sciences
## 2: Social sciences              102       455 days Social Sciences
## 3: Social sciences              102       365 days Social Sciences
## 4: Social sciences              102       183 days Social Sciences
## 5:         History              103       364 days Social Sciences
## 6:     Art studies              104      1368 days Social Sciences
```

```r
save(file='data/dat_clean.RData', dat)
save(file='data/dat_agg_clean.RData', dat.agg)
write.csv(file='data/dat_clean.csv', dat)
write.csv(file='data/dat_agg_lyb_clean.csv', dat.lyb)
write.csv(file='data/dat_ly_ts.csv', dat.ts)
```






