# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, MessageViewSet, UsersViewSet

# Crea una instancia de DefaultRouter
router = DefaultRouter()

# Registra los ViewSets con el router
router.register(r"chats", ChatViewSet, basename="chat")
router.register(r"messages", MessageViewSet, basename="messages")
router.register(r"allUsers", UsersViewSet, basename="Users")

# Incluye las URLs del router en el patrón de URLs
urlpatterns = [
    path("", include(router.urls)),
]
