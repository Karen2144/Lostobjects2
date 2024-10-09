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


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    # Acción personalizada para obtener los mensajes de un chat específico
    @action(detail=True, methods=["get"])
    def messages(self, request, pk=None):
        # Obtener el chat específico por el ID (pk)
        chat = self.get_object()

        # Obtener todos los mensajes relacionados con ese chat
        messages = chat.messages.all()

        # Serializar los mensajes y retornarlos en la respuesta
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer