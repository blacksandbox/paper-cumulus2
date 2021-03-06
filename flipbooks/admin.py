# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from . import models
from . import models_v2 as models2  # TODO: change name of this model

# def frame_order(obj):
#     return ("%d-%d" % (1, obj.id))

# note: I think FrameModelAdmin don't actually have to be here
#       You can have this in models.py and import it.

class BookModelAdmin(admin.ModelAdmin):
    list_display = ("id", 'title', "slug")

class ChapterModelAdmin(admin.ModelAdmin):
    list_display = ("id", "__str__", "is_demo", "children_li", 'date_created')

class SceneModelAdmin(admin.ModelAdmin):
    list_display = ("id", "__str__", "id64", "order", "name", "children_li")

class StripModelAdmin(admin.ModelAdmin):
    list_display = ("id", "__str__", "scene", "dimension", "frame_duration", "children_li", "description")
    empty_value_display = 'unknown'

class FrameModelAdmin(admin.ModelAdmin):
    def frame_order(self, obj):
        if obj.strip is None:
            return "%s-%d" % ("<Stray>", obj.order)
        else:
            return "%d-%d" % (obj.strip.order, obj.order)

    list_display = ("id", "frame_order", 'strip', 'note', 'dimension', 'frame_image', 'date_created',)
    empty_value_display = 'unknown'

    #testing custom form
    #form = forms.FrameForm


class OldseriesModelAdmin(admin.ModelAdmin):
    list_display = ("id", 'title', "slug", "is_demo")

class EpisodeModelAdmin(admin.ModelAdmin):
    list_display = ("id", "__str__", "id64", "title", 'order')


# Register your models here.
admin.site.register(models2.Oldseries, OldseriesModelAdmin)
admin.site.register(models2.Episode, EpisodeModelAdmin)

admin.site.register(models.Chapter, ChapterModelAdmin)
admin.site.register(models.Scene, SceneModelAdmin)
admin.site.register(models.Strip, StripModelAdmin)
admin.site.register(models.Frame, FrameModelAdmin)
