from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from urllib import urlopen
from bs4 import BeautifulSoup
import json
from django.views.decorators.cache import cache_page
from couchdb import Server

def index(request):
	return HttpResponse("Welcome!")

def removeEmptyKeys(match_report):
	match_data_keys = match_report.keys()
	for key in match_data_keys:
		if not match_report[key]:
			del match_report[key]
	return match_report

def storeDataInCouchdb(match_report):
	# Type for couchDB views
	match_report['type'] = 'scorecard'
	match_data_cleaned = removeEmptyKeys(match_report)

	# CouchDB operations
	couchdb_server = Server('http://127.0.0.1:5984')
	try:
		match_db = couchdb_server['cricket_scores_db']		
	except:
		match_db = couchdb_server.create('cricket_scores_db')	
	match_db.save(match_data_cleaned)

def getTeamDetailsFromBlock(team):
	team_name = ''
	team_score = ''
	team_score_span = team.find('span',{'class':'bold'})
	if team_score_span != None:
		team_score = getUnicodeString(team_score_span.text)
		team_name_string = team_score_span.previous_sibling
		if team_name_string != None:
			team_name = getUnicodeString(team_name_string)
	return team_name, team_score

def getUnicodeString(text):
	return unicode(text.strip())

def getMatchDetails(match):
		match_report = {}

		location = match.find('span',{'class':'match-no'})
		if location != None:
			match_report["location"] = getUnicodeString(location.text)

		team1 = match.find('div',{'class':'innings-info-1'})
		team1_name, team1_score = getTeamDetailsFromBlock(team1)
		match_report["team_1"] = team1_name
		match_report["score_1"] = team1_score

		team2 = match.find('div',{'class':'innings-info-2'})
		team2_name, team2_score = getTeamDetailsFromBlock(team2)
		match_report["team_2"] = team2_name
		match_report["score_2"] = team2_score

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
