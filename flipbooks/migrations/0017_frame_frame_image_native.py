# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-12-05 20:18
from __future__ import unicode_literals

from django.db import migrations, models
import flipbooks.models


class Migration(migrations.Migration):

    dependencies = [
        ('flipbooks', '0016_auto_20171017_1919'),
    ]

    operations = [
        migrations.AddField(
            model_name='frame',
            name='frame_image_native',
            field=models.ImageField(blank=True, upload_to=flipbooks.models.frame_upload_path2),
        ),
    ]
