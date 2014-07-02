---
title: Track the Swiss post-docs
author: David Pham
date: June 17, 2014
subtitle: Where do the young Swiss researcher start their career?
job: Coursera Student
framework   : io2012        # {io2012, html5slides, shower, dzslides, ...}
highlighter : highlight.js  # {highlight.js, prettify, highlight}
hitheme     : tomorrow      # 
widgets     : []            # {mathjax, quiz, bootstrap}
mode        : selfcontained # {standalone, draft}
knit        : slidify::knit2slides
---


## Introduction



output:
  ioslides_presentation:
    widescreen: yes

1. The Swiss national scientific fund (SNSF or SNF) is responsible for allocating money to research in Switzerland.
2. They were interested in the principal destination of junior researcher (post-docs) from Switzerland for their first assignment
3. The data processing is explained on [rpubs](http://rpubs.com/davidpham87/19545).

--- 

## Data

- *iso3*: The three letter country intiial (eg: CHE for Switzerland).
- *project_year*: Year of the project.
- *N*: Number of projects.
- *base_disciplin*: Disciplin of the funded project with three code factors: Social Sciences (1), Base Sciences/Engineering (2), Biology Medical Sciences (3)


```
## [[1]]
##      iso3 project_year base_disciplin N
##   1:  ALB         2013              1 1
##   2:  ARG         2008              1 1
##   3:  ARG         2010              1 1
##   4:  ARG         2012              1 2
##   5:  ARG         2009              1 1
##  ---                                   
## 510:  ZAF         2013              3 3
## 511:  ZAF         2014              3 1
## 512:  ZAF         2012              3 1
## 513:  ZAF         2010              3 1
## 514:  ZWE         2011              1 1
## 
## [[2]]
##      iso3 base_disciplin  N
##   1:  ALB              1  1
##   2:  ARG              1  5
##   3:  ARG              2  2
##   4:  ARG              3  1
##   5:  AUT              1 24
##  ---                       
## 134:  VNM              2  1
## 135:  ZAF              1 10
## 136:  ZAF              2  1
## 137:  ZAF              3 10
## 138:  ZWE              1  1
## 
## [[3]]
##                    host_city project_year base_disciplin N
##    1:                  korça         2013              1 1
##    2: ciudad de buenos aires         2008              1 1
##    3:           buenos aires         2010              1 1
##    4:               la plata         2012              1 1
##    5:           buenos aires         2012              1 1
##   ---                                                     
## 2504:          potchefstroom         2014              3 1
## 2505:              cape town         2009              3 1
## 2506:              cape town         2012              3 1
## 2507:              cape town         2010              3 1
## 2508:                 harare         2011              1 1
## 
## [[4]]
##                     host_city base_disciplin N
##    1:                   korça              1 1
##    2:  ciudad de buenos aires              1 1
##    3:            buenos aires              1 2
##    4:                la plata              1 1
##    5: san carlos de bariloche              1 1
##   ---                                         
## 1227:   kuruman river reserve              3 1
## 1228:               tygerberg              3 1
## 1229:               cape town              3 4
## 1230:           potchefstroom              3 1
## 1231:                  harare              1 1
```

---
## Some Exploratory Data Analysis 


```
## Error: objet 'base_disc_name' introuvable
```

## Shiny Apps


## Slide 2

Test slide 2.

$x^2+ x- 12 = 0 = (x+4)(x-3)$


```
## [1] 55
```

$\pi = $ 3.1416.

---

## Slide 3

---

## Slide 4

--- 

## Slide 5

This is the last line
