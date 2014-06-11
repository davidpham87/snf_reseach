import pandas as pd
import numpy as np
import os

os.getcwd()

dat = pd.read_csv('data/Dataset2.csv')
dat.columns = map(lambda x : x.lower(), list(dat.columns))

### Transform date
cols_date = ['project_start', 'project_end']
to_iso_date = lambda x: pd.to_datetime(x, format = '%d.%m.%Y')
dat[cols_date]  = dat[cols_date].applymap(to_iso_date)

### Project length 
dat['project_length'] = dat[cols_date[1]] - dat[cols_date[0]] # in nanoseconds

### Time series of numbers of project by key:
### date (month/year), host_country, zipcode_host (ie university), discipline



### See if any institute gather everything # groupby host_country / zipcode_host / host_city

### Issue with host_city: the name of the cities are not standardized
### exemple with paris, boston (cambridge, ma)
 
dat['host_city'] = dat['host_city'].map(lambda x : str(x).strip().lower())
dat_city_disc =  dat.groupby(['host_city', 'maindiscnummer'])['project_id'].count()

dat_city = dat_city_disc.groupby(level = 'host_city').sum()
dat_city.sort()

dat_city = pd.DataFrame(dat_city, columns = ['project_count'])
print dat_city.query('project_count > 10') # 79 cities where more than 10 projects
print dat_city.query('project_count > 10').sum()

print dat_city.query('project_count > 50') # 15 cities where more than 10 projects

### Same analysis with the country
dat_country_disc =  dat.groupby(['host_country', 'maindiscnummer'])['project_id'].count()

dat_country = dat_country_disc.groupby(level = 'host_country').sum()
dat_country.sort()









