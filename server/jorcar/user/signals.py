from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.contrib.auth.models import Group

@receiver(user_signed_up)
def assign_user_role(sender, request, user, **kwargs):
    # Crear el grupo 'user' si no existe
    user_group, created = Group.objects.get_or_create(name='user')
    # Asignar el usuario al grupo 'user'
    user.groups.add(user_group)