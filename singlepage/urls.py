from django.urls import path
from . import views

# 作者: 吴永婷
# 创建时间: 2024年

urlpatterns = [
    path('', views.index, name='index'),
    path('ajax/', views.ajax_page, name='ajax_page'),
    path('forms/', views.forms_page, name='forms_page'),
    path('infinite-scroll/', views.infinite_scroll, name='infinite_scroll'),
    path('sections/<str:num>/', views.section, name='section'),
    path('submit/', views.submit, name='submit'),
    path('infinite-load', views.infinite_load, name='infinite_load'),
]