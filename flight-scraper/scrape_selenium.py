import sys
import requests
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from apscheduler.schedulers.blocking import BlockingScheduler

def sendRequest(msg, name, url):
  html_prefix = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Scraper</title></head><body>';
  html_suffix = '</body></html>';
  ld = 'https://wordsmith.lionheart.design/mail'
  sender = 'devinleonhart@fastmail.com'
  recipient = '7272384865@tmomail.net'
  recipient2 = 'ronsresume@hotmail.com'
  post_data = { 'to': [recipient, recipient2, sender], 'from': sender, 'subject': 'Nekonny Flight Notification', 'body': html_prefix + msg + '<br /><a href="' + url + '">' + name + '</a>' + html_suffix, 'content_type':'text/html; charset=utf-8'}
  r = requests.post(ld, data=json.dumps(post_data))
  
def checkFlight():
  flight1 = ('NRT->TPA 29', 'https://www.aa.com/awardMap/book?destination=TPA&origin=NRT&departureMinDate=03%2F29%2F2020&jqueryDateFormat=mm%2Fdd%2Fyy&dateFormat=MM%2Fdd%2Fyyyy&miles=200%2C000&includePartners=true&_includePartners=on&category=ASIA_PACIFIC_AUSTRALIA&pax=1&roundTrip=false&cabin=PREMIUM&maxStopCount=3')
  # ADD MORE FLIGHTS HERE!
  flights = [flight1]
  firefox_options = webdriver.FirefoxOptions()
  firefox_options.set_headless()
  driver = webdriver.Firefox(firefox_options=firefox_options)

  for f in flights:
    try:
      driver.get(f[1])
      awards = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'awardListContainer'))
      )

      economy_class = len(driver.find_elements(By.CLASS_NAME, 'caEconomy-Mile-SAAver')) > 0
      economy_class_selected = len(driver.find_elements(By.CLASS_NAME, 'caEconomy-Mile-SAAver_selected')) > 0
      business_class = len(driver.find_elements(By.CLASS_NAME, 'caBusiness-MileSAAver')) > 0
      business_class_selected = len(driver.find_elements(By.CLASS_NAME, 'caBusiness-MileSAAver_selected')) > 0
      first_class = len(driver.find_elements(By.CLASS_NAME, 'caFirst-MileSAAver')) > 0
      first_class_selected = len(driver.find_elements(By.CLASS_NAME, 'caFirst-MileSAAver_selected')) > 0

      if (economy_class or economy_class_selected):
        sendRequest("Economy Saver Found!", f[0], f[1])

      if ((business_class or business_class_selected):
        sendRequest("Business Saver Found!", f[0], f[1])
      
      if (first_class or first_class_selected):
        sendRequest("First Saver Found!", f[0], f[1])

    except:
      e = sys.exc_info()[0]
      print e

  sendNotification()

  driver.close()
checkFlight()

scheduler = BlockingScheduler();
scheduler.add_job(checkFlight, 'interval', hours=1)
scheduler.start()
