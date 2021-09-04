from config.wsgi import *
from django.test import TestCase
from core.erp.models import Type, Employee

# listar

query = Type.objects.all()
# print(query)

# insertar
# t = Type()
# t.name = 'Terry Gillian'
# t.save()

# # edicion
# try:
#     t = Type.objects.get(pk=1)
#     t.name = 'Presidente'
#     t.save()
# except Exception as e:
#     print(e)

# eliminacion
# t = Type.objects.get(pk=1)
# t.delete()

# obj = Type.objects.filter(name__icontains='pru')

Employee.objects.filter(type_id=1)
for i in Type.objects.filter(name__endswith='a')[:2]:
    print(i.name)

