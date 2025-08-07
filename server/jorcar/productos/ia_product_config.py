import anthropic
from django.conf import settings
from datetime import datetime
from .models import Producto
from .serializers import ProductoSerializer

# Cliente de la API de Anthropic
client = anthropic.Anthropic(api_key=settings.IA_API_KEY)

def obtener_descripcion_ia(nombre_producto, categorias_producto, calidad_producto):
    calidad_producto = calidad_producto if calidad_producto in ["original", "alternativo", "otras referencias"] else "otras referencias"
    try:
        # Convertir las categorías en una cadena de texto
        categorias_str = ", ".join(categorias_producto)

        # Construir el contexto para la IA
        prompt = f"""Genera una descripción técnica y detallada de las especificaciones de un producto de una tienda de repuestos.  
                    1. El producto se llama '{nombre_producto}'.  
                    2. Pertenece a las categorías: {categorias_str}. 
                    3. La calidad del producto es '{calidad_producto}', al final del mensaje menciona la calidad del producto. puede ser original, alternativo, otras referencias.
                    4. Incluye las especificaciones técnicas relevantes, como dimensiones, materiales, peso, tipo de conexión, o tecnología.  
                    5. Describe la compatibilidad detallada con vehículos, especificando marcas, modelos y años compatibles.  
                    6. Indica usos recomendados, posibles restricciones o condiciones de instalación.  
                    7. No incluyas estimaciones de precios ni información relacionada con costos.""" 
        
        # Realizar la solicitud a la API de Anthropic
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",  # Usar el modelo adecuado que estás utilizando en Anthropic
            max_tokens=1000,
            temperature=0.7,
            messages=[{"role": "user", "content": prompt}]
        )

        # Depuración: Imprimir la respuesta completa de la API para verificar la estructura
        print("Respuesta completa de la API:", response)
        print(nombre_producto)
        print(categorias_str)
        print(calidad_producto)

        # Verificar la estructura de la respuesta
        
        if hasattr(response, 'content') and len(response.content) > 0:
            # Acceder correctamente al contenido de la respuesta
            descripcion = response.content[0].text.strip()
            print("Descripción extraída del bloque:", descripcion)
        else:
            descripcion = "Error: No se encontró el campo 'content' o 'text' en la respuesta."

        # Limpiar la descripción
        descripcion_final = descripcion.replace("\n", " ").replace("\r", " ").strip()
        

        # Si la descripción está disponible, devolverla
        if descripcion_final:
            return {"success": True, "descripcion": descripcion_final}
        else:
            return {"success": False, "descripcion": "Descripción vacía en el contenido."}

    except Exception as e:
        print(f"Error al comunicarse con la API de Anthropic: {e}")
        return {"success": False, "descripcion": f"Descripción no disponible: {str(e)}"}





# Función para procesar el producto con la IA y actualizar la base de datos
def procesar_producto_con_ia(producto_id):
    try:
        # Obtener el producto de la base de datos
        producto = Producto.objects.get(id=producto_id)

        # Verificar si el producto ya fue procesado
        if not producto.procesado_por_ia:
            # Obtener la descripción generada por la IA
            descripcion_ia = obtener_descripcion_ia(producto.nombre, producto.categoria.nombre)

            # Si la IA genera una descripción, actualizar el producto
            if descripcion_ia:
                producto.descripcion = descripcion_ia
                producto.procesado_por_ia = True
                producto.fecha_primer_procesamiento = datetime.now()
                producto.fecha_ultima_modificacion_ia = datetime.now()
                producto.save()

                print(f"Producto {producto.nombre} procesado exitosamente por la IA.")
            else:
                print(f"No se pudo generar una descripción para el producto {producto.nombre}.")
        else:
            print(f"El producto {producto.nombre} ya fue procesado por la IA anteriormente.")

    except Producto.DoesNotExist:
        print(f"Producto con ID {producto_id} no encontrado.")
    except Exception as e:
        print(f"Error al procesar el producto con IA: {e}")

        

