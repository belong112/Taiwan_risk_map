import json 
import csv 
  
# Opening JSON file and loading the data 
# into the variable data 
with open('yilan.json',"r",encoding="utf-8") as json_file: 
    datas = json.load(json_file) 
  
true_data = datas['data']
  
# now we will open a file for writing 
o_file = open('output.csv', 'w', newline ='') 
  
# create the csv writer object 
csv_writer = csv.writer(o_file) 

variable_needed = ['基地面積','建築面積','總樓地板面積','建築物高度','建造類別','構造別','地號','樓層用途']

# Counter variable used for writing  
# headers to the CSV file 
count = 0
for single_house in true_data:
	if count == 0:
	# Writing headers of CSV file 
		csv_writer.writerow(variable_needed) 
		count += 1
	row_data = []
	for var in single_house:
		if var in variable_needed:
			if var=='基地面積' or var=='建築面積' or var=='總樓地板面積' or var=='建築物高度':
				row_data.append(single_house[var][:-1])
			elif var == '地號':
				row_data.append(str(single_house[var][0]['行政區']))
			else:
				row_data.append(single_house[var])

	for floor_usage in single_house['樓層概要']:
		row_data.append(floor_usage['樓層用途'])
		csv_writer.writerow(row_data)
		row_data.pop()
	
# Writing data of CSV file  
o_file.close() 