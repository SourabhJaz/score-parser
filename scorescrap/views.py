from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from urllib import urlopen
from bs4 import BeautifulSoup
import json
from django.views.decorators.cache import cache_page

def getExportString(text):
	return unicode(text.strip())

def iterate_matches(parsed_page):
	all_matches = []
	for matches_category in parsed_page.find_all('div', {'class':'match-section-head'}):
		matches = matches_category.find_next_sibling('section', {'class':'matches-day-block'})
		if matches != None:
			for match in matches.find_all('section', {'class':'default-match-block'}):
				match_report = {}
				match_report = getMatchDetails(match, matches_category)
				all_matches.append(match_report)
	return all_matches

def getMatchDetails(match, matches_category):
		match_report={'category':'', 'location':'', 'team_1':'', 'team_2':'', 'score_1':'', 'score_2':'', 'status':''}

		if matches_category != None:
			match_report["category"] = getExportString(matches_category.text)
		location = match.find('span',{'class':'match-no'})
		if location != None:
			match_report["location"] = getExportString(location.text)
		team1 = match.find('div',{'class':'innings-info-1'})
		team1_score = team1.find('span',{'class':'bold'})
		if team1_score != None:
			match_report["score_1"] = getExportString(team1_score.text)
			team1_name = team1_score.previous_sibling
			if team1_name != None:
				match_report["team_1"] = getExportString(team1_name)
		team2 = match.find('div',{'class':'innings-info-2'})
		team2_score = team2.find('span',{'class':'bold'})
		if team2_score != None:
			match_report["score_2"] = getExportString(team2_score.text)
			team2_name = team2_score.previous_sibling
			if team1_name != None:
				match_report["team_2"] = getExportString(team2_name)
		match_status = match.find('div',{'class':'match-status'})
		if match_status != None:
			match_report["status"] = getExportString(match_status.text)
		return match_report

def index(request):
	return HttpResponse("Welcome!")

@cache_page(10)
def get_scores(request):
	response = urlopen("http://www.espncricinfo.com/ci/engine/match/index.html?view=live")
	parsed_page = BeautifulSoup(response,"html.parser")
	data = iterate_matches(parsed_page)
	match_dict = {'matches':data}
	return JsonResponse(match_dict)	
