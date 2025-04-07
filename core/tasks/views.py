from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import UserRegistrationSerializer
from django.contrib.auth.models import User
from datetime import date


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        title = self.request.data.get('title', '').lower()
        description = self.request.data.get('description', '').lower()
        due_date = self.request.data.get('due_date')

        # Compute priority
        priority = 'Low'
        if any(word in title + description for word in ['urgent', 'asap', 'important']):
            priority = 'High'
        elif due_date:
            try:
                due_date_obj = date.fromisoformat(due_date)
                days_left = (due_date_obj - date.today()).days
                if days_left <= 1:
                    priority = 'High'
                elif days_left <= 3:
                    priority = 'Medium'
            except ValueError:
                pass  # In case due_date is not in the right format

        serializer.save(owner=self.request.user, priority=priority)

