
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer
from users.permissions import (
    IsAdminManagerOrReadOnly,
    IsAssignedInternOrManager,
)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsAdminManagerOrReadOnly]

    def get_queryset(self):
        return Project.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsAssignedInternOrManager]

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser:
            return Task.objects.all()

        profile = getattr(user, 'profile', None)

        if profile and profile.role in ['ADMIN', 'MANAGER']:
            return Task.objects.all()

        return Task.objects.filter(assigned_to=user)
