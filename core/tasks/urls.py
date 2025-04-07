from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, RegisterUserView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),  # 👈 Add this
    path('', include(router.urls)),  # task endpoints like /tasks/, /tasks/<id>/
]
   