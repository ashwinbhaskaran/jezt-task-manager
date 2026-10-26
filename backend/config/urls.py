from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Django admin
    path("admin/", admin.site.urls),

    # JWT authentication
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # User registration and current user
    path("api/auth/", include("users.urls")),

    # Projects and tasks
    path("api/", include("projects.urls")),

    # Law and Policy AI chatbot
    path("api/chatbot/", include("chatbot.urls")),
]