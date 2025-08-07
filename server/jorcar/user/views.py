from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomUser
from django.contrib.auth  import get_user_model
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.contrib.auth.models import Group
from clientes.models import Cliente

CustomUser = get_user_model()

@login_required
def home_view(request):
    return redirect('http://localhost:3000')

@login_required
def logout_page(request):
    logout(request)  
    messages.success(request, 'Cesion cerrada correctamente') 
    return redirect('http://localhost:3000')

class LoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        User = get_user_model()
        
        try:
            user = User.objects.get(email=email)  
            print(f"User found: {user}")  
            
            if check_password(password, user.password):
                print("Password is correct")  
                token, _ = Token.objects.get_or_create(user=user)
                roles = user.groups.values_list('name', flat=True)
                rol = roles[0] if roles else "Sin rol asignado"
               
                
                return Response({
                    "token": token.key,
                    "message": "Login successful",
                    "rol": rol
                }, status=status.HTTP_200_OK)
            else:
                print("Invalid password")  # Agrega este print para depuración
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            print("User does not exist")  # Agrega este print para depuración
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    permission_classes = [AllowAny]  # Permitir acceso a cualquier usuario

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()

            Cliente.objects.create(
                user=user,  
                nombre=f"{user.first_name} {user.last_name}".strip(), 
                email=user.email
            )
            # Asignar el rol 'user' por defecto
            user_group, created = Group.objects.get_or_create(name='user')
            user.groups.add(user_group)
            return Response({"message": "Usuario registrado correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # print(f"Datos del usuario: {user.__dict__}")
        
        return Response({
            "id": user.id,
            "name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }, status=status.HTTP_200_OK)



