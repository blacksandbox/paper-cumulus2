# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-10-17 19:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flipbooks', '0015_auto_20171017_1317'),
    ]

    operations = [
        migrations.AlterField(
            model_name='strip',
            name='order',
            field=models.IntegerField(default='-1'),
        ),
    ]