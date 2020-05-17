import json 
import csv 
  
# Opening JSON file and loading the data 
# into the variable data 
with open('teststst.json',"r",encoding="utf-8") as json_file: 
    datas = json.load(json_file) 
  
true_data = datas['data']
  
# now we will open a file for writing 
o_file = open('output.csv', 'w') 
  
# create the csv writer object 
csv_writer = csv.writer(o_file) 
  
# Counter variable used for writing  
# headers to the CSV file 
count = 0
  
for emp in true_data:
	if count == 0:
	# Writing headers of CSV file 
		header = emp.keys() 
		csv_writer.writerow(header) 
		count += 1
	elif emp.keys() == "樓層概要":
		
	elif emp.keys() == "地號":

	elif emp.keys() == "門牌":
		

	# Writing data of CSV file 
	csv_writer.writerow(emp.values())
  
o_file.close() 