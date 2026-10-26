
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, "profile", None)

        if request.user.is_superuser:
            role = "ADMIN"
        elif profile:
            role = profile.role
        else:
            role = "INTERN"

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "role": role,
        })
