from google.genai.types import GoogleSearchRetrieval
import sqlite3
import requests 

client_database_path = ""

conn = sqlite3.connect(client_database_path)
cursor = conn.cursor()

def retrive_client_info(id: str):
    """
    Fetch data about client from clients database
    by primary key id

    Args:
        id: primary key client database

    Returns:
        str: A sql query output
    """
    return cursor.execute(f"SELECT * from Clients where id = {id}")

def company_data_search(query: dict):
    """
    Fetch data about company 

    Args:
        query: input in the following format {"company1": "information to retrive"}

    Returns:
        str: json information asked about given companies
    """

    url = ("https://idchat-api-containerapp01-dev.orangepebble-16234c4b."
           "switzerlandnorth.azurecontainerapps.io//companydatasearch"
           f"?query={query}")
    response = requests.post(url)
    return response.json()

def ohlcv(query: str, first="01.01.2024", last=None):
    """
    Price Data. Search a company by name and get its historical price data. 
    Query is a string like: "banco santander", first is the first date to retrieve data and last(optional) is the last date to retrieve data. Dates are strings in the format "dd.mm.yyyy".

    Args: 
        query: str, company name
        first: first date to retrive data
        last: last data optional to retrive data

    Returns:
        str: json price data for companies
    """
    url = ("https://idchat-api-containerapp01-dev.orangepebble-16234c4b."
           "switzerlandnorth.azurecontainerapps.io//ohlcv"
           f"?query={query}&first={first}")
    if last:
        url = f"{url}&last={last}"
    response = requests.post(url)
    return response.json()

def summary_company(query: str):
    """
    This tools retrieves basic information about a company.

    Args:
        query: str name of company

    Returns:
        json
    """
    url = ("https://idchat-api-containerapp01-dev.orangepebble-16234c4b."
           "switzerlandnorth.azurecontainerapps.io//summary"
           f"?query={query}")
    response = requests.post(url)
    return response.json()

tool_list = [summary_company, ohlcv, company_data_search, retrive_client_info]

if __name__ == "__main__":
    print(summary_company("nestle"))
