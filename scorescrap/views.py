from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from urllib import urlopen
from bs4 import BeautifulSoup
import json
from django.views.decorators.cache import cache_page
from couchdb import Server

def index(request):
	return HttpResponse("Welcome!")

def removeEmptyKeys(match_data):
	match_data_keys = match_data.keys()
	for key in match_data_keys:
		if not match_data[key]:
			del match_data[key]
	return match_data

def storeDataInCouchdb(match_data):
	couchdb_server = Server('http://127.0.0.1:5984')
	match_db = couchdb_server['cricket_scores']
	match_data_cleaned = removeEmptyKeys(match_data)
	match_db.save(match_data_cleaned)

def getUnicodeString(text):
	return unicode(text.strip())

def getMatchDetails(match):
		match_report = {}
		location = match.find('span',{'class':'match-no'})
		if location != None:
			match_report["location"] = getUnicodeString(location.text)
		team1 = match.find('div',{'class':'innings-info-1'})
		team1_score = team1.find('span',{'class':'bold'})
		if team1_score != None:
			match_report["score_1"] = getUnicodeString(team1_score.text)
			team1_name = team1_score.previous_sibling
			if team1_name != None:
				match_report["team_1"] = getUnicodeString(team1_name)
		team2 = match.find('div',{'class':'innings-info-2'})
		team2_score = team2.find('span',{'class':'bold'})
		if team2_score != None:
			match_report["score_2"] = getUnicodeString(team2_score.text)
			team2_name = team2_score.previous_sibling
			if team1_name != None:
				match_report["team_2"] = getUnicodeString(team2_name)
		match_status = match.find('div',{'class':'match-status'})
		if match_status != None:
			match_report["status"] = getUnicodeString(match_status.text)
		return match_report

def getAllMatchBlocks(parsed_page):
	all_matches = []
	for matches_category in parsed_page.find_all('div', {'class':'match-section-head'}):
		matches = matches_category.find_next_sibling('section', {'class':'matches-day-block'})
		if matches != None:
			for match in matches.find_all('section', {'class':'default-match-block'}):
				all_matches.append(match)
	return all_matches

@cache_page(10)
def get_scores(request):
	response = urlopen("http://www.espncricinfo.com/ci/engine/match/index.html?view=live")
	parsed_page = BeautifulSoup(response,"html.parser")
	all_matches = getAllMatchBlocks(parsed_page)

	for match_block in all_matches:
		match_report = {}
		match_report = getMatchDetails(match_block)
		storeDataInCouchdb(match_report)

	return 	HttpResponse(status = 200)
