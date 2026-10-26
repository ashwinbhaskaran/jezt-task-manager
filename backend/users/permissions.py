
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        profile = getattr(request.user, 'profile', None)
        return bool(profile and profile.role in ['ADMIN', 'MANAGER'])


class IsAdminManagerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        if request.user.is_superuser:
            return True

        profile = getattr(request.user, 'profile', None)
        return bool(profile and profile.role in ['ADMIN', 'MANAGER'])


class IsAssignedInternOrManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        profile = getattr(request.user, 'profile', None)

        if profile and profile.role in ['ADMIN', 'MANAGER']:
            return True

        return (
            profile is not None
            and profile.role == 'INTERN'
            and obj.assigned_to_id == request.user.id
        )
