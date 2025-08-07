from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from .models import Cliente, Direccion
from .serializer import ClienteSerializer, DireccionSerializer
from rest_framework.exceptions import NotFound
from rest_framework.decorators import action


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [AllowAny]  # Cambié a IsAuthenticated para mayor seguridad
    authentication_classes = [TokenAuthentication]
    parser_classes = [JSONParser]

    def perform_create(self, serializer):
        """
        Método para crear un cliente con sus direcciones.
        """
        serializer.save()

    def perform_update(self, serializer):
        """
        Método para actualizar un cliente con sus direcciones.
        """
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """
        Elimina un cliente y sus direcciones.
        """
        cliente_instance = self.get_object()

        # Aseguramos que el cliente exista
        if not cliente_instance:
            raise NotFound(detail="Cliente no encontrado.")

        # Eliminar direcciones asociadas
        try:
            cliente_instance.direcciones.all().delete()  # Eliminar las direcciones primero
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        cliente_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        try:
            cliente = Cliente.objects.get(user=request.user)

            if request.method == 'PATCH':
                serializer = self.get_serializer(cliente, data=request.data, partial=True)
                if serializer.is_valid():
                    # Guardar los datos del cliente y las direcciones
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(cliente)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cliente.DoesNotExist:
            return Response({"detail": "Cliente no encontrado."}, status=status.HTTP_404_NOT_FOUND)
class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        # Aseguramos que la dirección se asocia al cliente
        cliente = self.request.user.cliente 
        serializer.save(cliente=cliente)
