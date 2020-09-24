from django import forms
from .models import Image
from urllib.request import Request, urlopen
from django.core.files.base import ContentFile
from django.utils.text import slugify

class ImageCreateForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = {'title', 'url', 'description'}
        widgets = {
            'url': forms.HiddenInput,
        }

    def clean_url(self):
        url = self.cleaned_data['url'].split('?')[0]
        # if compressed change compression url to full sized pic
        # if
        valid_extensions = ['jpg', 'jpeg']
        if "jpg" in str(url):
            extension = "jpg"
        else:
            extension = "jpeg"
        if extension not in valid_extensions:
            raise forms.ValidationError('The given URL does not '\
                                        'match valid image extensions.')
        return url

    def save(self, force_insert=False,
                   force_update=False,
                   commit=True):
        image = super().save(commit=False)
        image_url = self.cleaned_data['url']
        name = slugify(image.title)
        if "jpg" in str(image_url):
            extension = "jpg"
        else:
            extension = "jpeg"
        image_name = f'{name}.{extension}'

        #download image from the given URL
        req = Request(image_url, headers= {"User-Agent": "Mozilla/5.0"})
        response = urlopen(req)
        image.image.save(image_name,
                         ContentFile(response.read()),
                         save=False)
        if commit:
            image.save()
        return image
