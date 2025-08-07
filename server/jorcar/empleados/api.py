from rest_framework import viewsets
from .models import Empleado
from .serializers import EmpleadoSerializer
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication


class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    permission_classes =[AllowAny]
    authentication_classes = [TokenAuthentication]
    serializer_class = EmpleadoSerializer