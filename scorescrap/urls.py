from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^get_scores$', views.get_scores, name='scores'),
    url(r'^search_by_team/(?P<team_name>[\w ]+)$',views.search_by_team, name='search_team')
]
