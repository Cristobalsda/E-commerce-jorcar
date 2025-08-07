from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from .models import Sucursal
from .serializers import SucursalSerializer

class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    serializer_class = SucursalSerializer

    @action(detail=True, methods=['PATCH'], url_path='toggle-disponibilidad')
    def toggle_disponibilidad(self, request, pk=None):
        """
        Cambia el estado de la sucursal de disponible a no disponible y viceversa.
        """
        sucursal = self.get_object()
        sucursal.disponible = not sucursal.disponible  # Alternamos el valor de disponible
        sucursal.save()
        return Response(
            {"message": f"Sucursal { 'abierta' if sucursal.disponible else 'cerrada' } correctamente."},
            status=status.HTTP_200_OK
        )
