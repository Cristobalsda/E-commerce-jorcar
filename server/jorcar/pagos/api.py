from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse
import mercadopago
from django.conf import settings

class CreatePreferenceViewSet(ViewSet):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]

    def create(self, request):
        items = request.data.get('items', [])
        total = request.data.get('total', 0)

        # Validar que los items no estén vacíos y que el total sea positivo
        if not items or total <= 0:
            return JsonResponse({"error": "Faltan datos necesarios o el total es inválido"}, status=400)

        # Inicializar MercadoPago SDK
        sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

        # Crear el diccionario para la preferencia
        preference_data = {
            "items": items,
            "back_urls": {
                "success": "http://localhost:3000/",  
                "failure": "http://localhost:3000/failure",  
                "pending": "http://localhost:3000/pending",  
            },
            "auto_return": "approved",  
        }

        # Crear la preferencia
        try:
            preference = sdk.preference().create(preference_data)

            # Verificar si la preferencia fue creada exitosamente
            if preference['status'] == 201:
                return JsonResponse(preference["response"])
            else:
                return JsonResponse({"error": "Hubo un error al crear la preferencia"}, status=500)

        except Exception as e:
            # Manejar errores al crear la preferencia
            return JsonResponse({"error": str(e)}, status=500)
