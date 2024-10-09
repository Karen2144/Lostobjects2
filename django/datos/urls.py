from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views import *


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("api.urls")),
    path("register", register),
    path("login", login),
    path("publicar", post),
    path("mostrar", mostrar),
    path("perfil", profile),
    path("foto", actualizar),
]

if settings.DEBUG:  # Solo sirve archivos de medios en desarrollo
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
