import requests
import csv
from bs4 import BeautifulSoup
from io import StringIO

# Space physics data facility
spdf = "https://omniweb.gsfc.nasa.gov/cgi/nx1.cgi"

# Define the form data as a dictionary
form_data = {
    "activity": "retrieve", 
    "res": "hourly",
    "start_date": "20190101", 
    "end_date": "20190627", 
    "vars": ["06", "07", "10", "11"],
    "spacecraft": "dscovr_hr_merge",
}

mo = 0
yr = 0
intensity = 0
decline = 0
incline = 0
north = 0
east = 0
vertical = 0
horizontal = 0



month_ranges = [
    (1, 31),    # January
    (32, 59),   # February
    (60, 90),   # March
    (91, 120),  # April
    (121, 151), # May
    (152, 181), # June
    (182, 212), # July
    (213, 243), # August
    (244, 273), # September
    (274, 304), # October
    (305, 334), # November
    (335, 365)  # December
]

def get_month_number(day_of_year):
    # Iterate through the month ranges and find the corresponding month
    for month, (start_day, end_day) in enumerate(month_ranges, start=1):
        if start_day <= day_of_year <= end_day:
            return month

    # Return -1 if the day_of_year is out of range (should not happen for valid inputs)
    return -1


# Send an HTTP POST request with the form data
response = requests.post(spdf, data=form_data)

# Check if the request was successful
if response.status_code == 200:
    print("Form submitted successfully.")

    # Parse the HTML response with BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract the data table
    table = soup.find('pre')

    # Initialize a CSV buffer
    csv_buffer = StringIO()

    # Write the CSV header
    csv_header = "year,month,bx_gsm,by_gsm,bz_gsm,bt,intensity,declination,inclination,north,east,vertical,horizontal\n"
    csv_buffer.write(csv_header)

    # Extract and write the data rows
    for line in table.get_text().split('\n')[7:-2]:
        # Clean up the data and split it into columns
        columns = line.split()
        year = int(columns[0])
        doy = int(columns[1])
        month = int(get_month_number(doy))
        # hour = columns[2]
        # minute = columns[3]
        bt = columns[4]
        bx_gsm = columns[5]
        by_gsm = columns[6]
        bz_gsm = columns[7]

        if(month != mo or year != yr):

            # Define the URL for the geomagnetic field data endpoint
            bgs = f"https://geomag.bgs.ac.uk/web_service/GMModels/igrf/13/?latitude=86.5&longitude=164.04&altitude=0&date={year}-{month}-15&format=json"

            # Send an HTTP GET request to the endpoint
            response = requests.get(bgs)

            # Check if the request was successful
            if response.status_code == 200:
                # Parse the JSON response
                data = response.json()

                # Extract relevant information
                intensity = data["geomagnetic-field-model-result"]["field-value"]["total-intensity"]["value"]
                decline = data["geomagnetic-field-model-result"]["field-value"]["declination"]["value"]
                incline = data["geomagnetic-field-model-result"]["field-value"]["inclination"]["value"]
                north = data["geomagnetic-field-model-result"]["field-value"]["north-intensity"]["value"]
                east = data["geomagnetic-field-model-result"]["field-value"]["east-intensity"]["value"]
                vertical = data["geomagnetic-field-model-result"]["field-value"]["vertical-intensity"]["value"]
                horizontal = data["geomagnetic-field-model-result"]["field-value"]["horizontal-intensity"]["value"]

                mo, yr = month, year
                
            else:
                print(year,month)
                print(f"Failed to fetch data from the endpoint. Status code: {response.status_code}")


        # Build the CSV row
        csv_row = f"{year},{month},{bt},{bx_gsm},{by_gsm},{bz_gsm},{intensity},{decline},{incline},{north},{east},{vertical},{horizontal}\n"

        # Write the row to the CSV buffer
        csv_buffer.write(csv_row)

    # Reset the buffer position
    csv_buffer.seek(0)

    # Save the CSV data to a file or process it further
    # Example: Save to a file
    with open(f"./Dataset-{form_data['start_date'][:4]}.csv", 'w') as csv_file:
        csv_file.write(csv_buffer.read())

    print("CSV data saved to 'dataset.csv'.")

    # Close the CSV buffer
    csv_buffer.close()
else:
    print(f"Form submission failed with status code {response.status_code}")
