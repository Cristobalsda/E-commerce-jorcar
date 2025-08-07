from django.urls import path 
from . import views 
from .views import LoginView, RegisterView, UserProfileView
urlpatterns = [
    path("",views.home_view,name='home'),
    path("api/auth/login/",LoginView.as_view(),name='login'),
    path("logout",views.logout_page,name='logout'),
    path("api/auth/register/", RegisterView.as_view(), name='register'),
    path("api/user-profile/", UserProfileView.as_view(), name='user_profile'),
    
]