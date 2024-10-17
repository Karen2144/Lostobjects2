from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import *
from rest_framework import status
from .models import *
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    parser_classes,
    action,
)
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser


# @api_view(['POST'])
# @permission_classes([AllowAny])
# def register(request):
#     serializer = UserSerializer(data=request.data)

#     if serializer.is_valid():
#         serializer.save()

#         user= CustomUser.objects.get(username=serializer.data['username'])
#         user.set_password(serializer.data['password'])
#         user.save()

#         token= Token.objects.create(user=user)
#         return Response({'token': token.key, 'user': serializer.data},status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Vista para registro de usuarios
@api_view(["POST"])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response(
            {"token": token.key, "user": serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    user = get_object_or_404(CustomUser, username=request.data["username"])

    if not user.check_password(request.data["password"]):
        return Response(
            {"error": "invalid password"}, status=status.HTTP_400_BAD_REQUEST
        )

    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response(
        {"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    publicaciones = CustomUser.objects.all()
    serializer = UserSerializer(publicaciones, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def post(request):
    serializer = PubliSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mostrar(request):
    publicaciones = publication.objects.all()
    serializer = PubliSerializer(publicaciones, many=True)
    return Response(serializer.data)


# @api_view(['PATCH'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# @parser_classes([MultiPartParser, FormParser])
# def actualizar(request):
#     try:
#         user = CustomUser.objects.get(id=request.user.id)  # Asegúrate de usar el modelo CustomUser
#         if 'imagen_perfil' in request.data:
#             user.imagen_perfil = request.data['imagen_perfil']
#             user.save()
#             return Response({'imagen_perfil': user.imagen_perfil.url}, status=status.HTTP_200_OK)
#         return Response({"error": "Imagen no proporcionada"}, status=status.HTTP_400_BAD_REQUEST)
#     except CustomUser.DoesNotExist:
#         return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def actualizar(request):
    try:
        user = CustomUser.objects.get(
            id=request.user.id
        )  # Asegúrate de usar el modelo CustomUser
        serializer = UserSerializer(
            user, data=request.data, partial=True
        )  # partial=True permite actualización parcial

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except CustomUser.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


# __________________________________________


class UsersViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer

    def get_queryset(self):
        """
        Filtra los mensajes para un chat específico pasado en los parámetros de la solicitud.
        """
        chat_id = self.request.query_params.get("chat")
        if chat_id:
            return Message.objects.filter(chat_id=chat_id).select_related(
                "sender", "chat"
            )
        return Message.objects.none()

    def perform_create(self, serializer):
        """
        Al crear un mensaje, asegura que pertenezca a un chat válido y el remitente sea el usuario autenticado.
        """
        serializer.save(sender=self.request.user)


class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer

    def get_queryset(self):
        """
        Filtra los chats donde el usuario autenticado sea uno de los participantes.
        """
        user = self.request.user
        return Chat.objects.filter(participants=user).prefetch_related(
            "messages", "participants"
        )

    def perform_create(self, serializer):
        """
        Al crear un chat, añade a los participantes correctamente.
        """
        chat = serializer.save()
        chat.participants.add(self.request.user)  # Añadir al creador como participante

    @action(detail=False, methods=["post"])
    def get_or_create_chat(self, request):
        """
        Verifica si ya existe un chat con los participantes especificados.
        Si no existe, crea uno nuevo.
        """
        participants = request.data.get("participants", [])

        # Validar que haya al menos dos participantes
        if len(participants) < 2:
            return Response(
                {"detail": "Se necesitan al menos dos participantes."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Asegurarse de que el usuario autenticado esté incluido
        if request.user.id not in participants:
            participants.append(request.user.id)

        # Verificar si ya existe un chat con los mismos participantes
        existing_chats = Chat.objects.filter(
            participants__id__in=participants
        ).distinct()

        for chat in existing_chats:
            # Verificar si contiene exactamente los mismos participantes
            chat_participant_ids = set(chat.participants.values_list("id", flat=True))
            if chat_participant_ids == set(participants):
                serializer = ChatSerializer(chat)
                return Response(serializer.data)

        # Crear un nuevo chat si no existe
        new_chat = Chat.objects.create()
        new_chat.participants.set(participants)  # Asignar los participantes
        serializer = ChatSerializer(new_chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def messages(self, request, pk=None):
        """
        Retorna todos los mensajes de un chat específico.
        Asegura que solo los participantes puedan acceder.
        """
        chat = self.get_object()

        # Verificar si el usuario tiene acceso al chat
        if request.user not in chat.participants.all():
            return Response(
                {"detail": "No tienes acceso a este chat."},
                status=status.HTTP_403_FORBIDDEN,
            )

        messages = chat.messages.all().select_related(
            "sender"
        )  # Optimiza las consultas
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
