from django.contrib import admin
from .models import Action
from django.contrib.auth.models import Group

admin.site.unregister(Group)

@admin.register(Action)
class ActionAdmin(admin.ModelAdmin):
    list_display = ('user', 'verb', 'target', 'created')
    list_filter = ('created',)
    search_fields = ('verb',)
