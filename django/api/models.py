from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    edad = models.PositiveIntegerField(null=True)
    ubicacion = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    imagen_perfil = models.ImageField(upload_to="perfil/", null=True, blank=True)


class publication(models.Model):
    nombre_usuario = models.ForeignKey("CustomUser", on_delete=models.CASCADE)
    descripcion = models.TextField(default="")
    imagen = models.ImageField(upload_to="imagenes/", null=True, blank=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)


class Chat(models.Model):
    participants = models.ManyToManyField(CustomUser, related_name="chats", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        participants = ", ".join([p.username for p in self.participants.all()])
        return f"Chat ({participants})"


class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to="messages/img/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje de {self.sender.username} en Chat {self.chat.id}"
