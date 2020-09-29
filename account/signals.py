from django.db.models.signals import post_save
from django.dispatch import receiver
from account.models import Profile
from django.contrib.auth.models import User

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, photo="account/static/img/no_image.png")

@receiver(post_save, sender=User)
def update_profile(sender, instance, created, **kwargs):
    if not created:
        instance.profile.save()
