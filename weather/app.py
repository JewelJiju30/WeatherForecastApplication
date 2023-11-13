from flask import Flask, request, render_template, jsonify
import requests
import json
from flask_cors import CORS
from flask_pymongo import PyMongo
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)
 
api_key = "6e7c89d540009fa84fa86c67729900ae"


# Corrected MongoDB connection URI
mongo_uri = "mongodb://jeweljiju3030:Minu1969@localhost:27017/WeatherDB"

try:
    client = MongoClient(mongo_uri)
    print("Connected to MongoDB successfully.")
except Exception as e:
    print(f"Error: {e}")
    # Handle the error as needed

# Accessing the "WeatherDB" database and "Weather" collection
db = client["WeatherDB"]
weather_collection = db["Weather"]
weather_forecast_collection=db["WeatherForecast"]
 
def read_config_days():
    with open('config.json', 'r') as config_file:
        config_data = json.load(config_file)
    return config_data.get('defaultDays', 3)  
 
 
def read_json_file():
    location_names = []
    loc_ids=[]

    # Iterate through all documents in the collection
    for document in weather_collection.find({}, {"_id": 0, "city.location_name": 1, "city.loc_id": 1}):
        location_name = document.get("city", {}).get("location_name")
        loc_id = document.get("city",{}).get("loc_id")
        print(loc_id)
        if location_name:
            location_names.append(location_name)
            if loc_id is not None:  # Check if loc_id is present
                loc_ids.append(loc_id)
    print(location_names)
    print(loc_ids)
    return location_names,loc_ids

def read_json_file_forecast():
       
    location_names = []
    # Iterate through all documents in the collection
    for document in weather_forecast_collection.find({}, {"_id": 0, "city.location_name": 1}):
        location_name = document.get("city", {}).get("location_name")
        if location_name:
            location_names.append(location_name)
    print(location_names)
    return location_names

def update_json_file(city, data):
    query = {f'{city}.location_name': city}
    existing_document = weather_collection.find_one(query)
    print(existing_document)
    if existing_document:
        weather_collection.update_one(query,{"$set":{city:data}},upsert=True)
    else:
        weather_collection.insert_one({city:data})      
 
 
def update_json_file_forecast(city, data):
    query = {'city.location_name': city}
    existing_document = weather_forecast_collection.find_one(query)
    print(existing_document)
    if existing_document:
        weather_forecast_collection.update_one(query,{"$set":{"city":data}},upsert=True)
    else:
        weather_forecast_collection.insert_one({"city":data})      
 
 
@app.route('/weather/getTempDay', methods=['POST'])
def getTempDay():
        location_details= request.json.get("location")
        city_name = location_details.get('city_name')
        latitude = location_details.get('latitude')
        longitude = location_details.get('longitude')
 
 
        if city_name:
            complete_url = f"http://api.openweathermap.org/data/2.5/weather?appid={api_key}&q={city_name}&units=metric"
        elif latitude and longitude:
            complete_url = f"http://api.openweathermap.org/data/2.5/weather?appid={api_key}&lat={latitude}&lon={longitude}&units=metric"
        else:
            return "Invalid input"
 
 
        url_response = requests.get(complete_url)
        data = url_response.json()
        response = {}
 
        if data["cod"] != "404":
            response['location_name'] = data["name"]
            response['temperature'] = data["main"]["temp"]
            response['pressure'] = data["main"]["pressure"]
            response['humidity'] = data["main"]["humidity"]
            response['description'] = data["weather"][0]["description"]
            response['coord'] = {
                'longitude': data["coord"]["lon"],
                'latitude': data["coord"]["lat"]
            }
            response['temp_min'] = data["main"]["temp_min"]
            response['temp_max'] = data["main"]["temp_max"]
            response['wind'] = data["wind"]
            response['loc_id'] = data["id"]
            # query={"Bali.location_name":"Bali"}
            # document=weather_collection.find_one(query)
            # print(document)
            print(data["name"])
            update_json_file(data["name"], response)
        else:
            return "City Not Found"
 
        # update_json_file(city_name, response)
        return response
 
 
@app.route('/weather/getExisting/day', methods=['GET'])
def getExisting():
    city_list,city_id = read_json_file()
    cityIds = ",".join(str(city_id) for city_id in city_id)
    group_temp_url = f"https://api.openweathermap.org/data/2.5/group?appid={api_key}&id={cityIds}&units=metric"
    response = requests.get(group_temp_url)
    data = response.json()
    return data
 
@app.route('/weather/getExisting/forecast', methods=['GET'])
def getExistingForecast():
    city_list = read_json_file_forecast()
    # city_list = weather_data.get("city", [])
    # city_details = weather_data.get("city_details", {})
 
    api_responses = []
 
    for city in city_list:
        response_req={}
        count = 1 
        complete_url = f"http://api.openweathermap.org/data/2.5/forecast?appid={api_key}&q={city}&units=metric&cnt={read_config_days()}"
        response = requests.get(complete_url)
        if response.status_code == 200:
            api_data = response.json()
            for listData in api_data["list"]:
                response_key = f"tempDetails{count}"
                response_req[response_key] = listData["main"]
                response_key2 = f"descpDetails{count}"
                response_req[response_key2] = listData["weather"]
                count += 1
            response_req["location_name"]=city
            response_req["count"]=read_config_days()
            response_req["coord"]=api_data["city"]["coord"]

            api_responses.append({"city": response_req})
        else:
            api_responses.append({"city": f"Error - {response.status_code}"})
 
    return api_responses
 
 
@app.route('/weather/getNew/forecast', methods=['POST'])
def getForecast():
    location_details= request.json.get("location")
    city_name = location_details.get('city_name')
    latitude = location_details.get('latitude')
    longitude = location_details.get('longitude')
 
    if city_name:
        complete_url = f"http://api.openweathermap.org/data/2.5/forecast?appid={api_key}&q={city_name}&units=metric&cnt={read_config_days()}"
    elif latitude and longitude:
        complete_url = f"http://api.openweathermap.org/data/2.5/forecast?appid={api_key}&lat={latitude}&lon={longitude}&units=metric&cnt={read_config_days()}"
    else:
        return "Invalid input"
 
    url_response = requests.get(complete_url)
    data = url_response.json()
    response = {}
    
    if data["cod"] != "404":
            response['location_name'] = data["city"]["name"]
            temperature_list=[]
            weather_list=[]
            for tempItem in data["list"] :
                temperature_list.append({"temperature_List": tempItem["main"]})
                weather_list.append({"weather_List": tempItem["weather"]})
               
            response['coord'] = {
                'longitude': data["city"]["coord"]["lon"],
                'latitude': data["city"]["coord"]["lat"]
            }
            response['loc_id'] = data["city"]["id"]
            response["temperature"]=temperature_list
            response["weather"] = weather_list

    else:
        return "City Not Found"
 
    update_json_file_forecast(data["city"]["name"],response)
    return response
 
 
if __name__ == '__main__':    
    app.run(debug=True, host='0.0.0.0', port=5000)