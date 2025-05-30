from django.urls import path
from app.custom_views import auth_views,student_views

urlpatterns = [
    path('login/', auth_views.superuser_login),
    path('students/', student_views.student_list_create),
    path('students/<int:pk>/', student_views.student_detail),
]
