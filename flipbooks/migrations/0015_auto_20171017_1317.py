# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-10-17 13:17
from __future__ import unicode_literals

from django.db import migrations
import easy_thumbnails.fields
import flipbooks.models


class Migration(migrations.Migration):

    dependencies = [
        ('flipbooks', '0014_auto_20170929_2337'),
    ]

    operations = [
        migrations.AlterField(
            model_name='frame',
            name='frame_image',
            field=easy_thumbnails.fields.ThumbnailerImageField(upload_to=flipbooks.models.frame_upload_path),
        ),
    ]