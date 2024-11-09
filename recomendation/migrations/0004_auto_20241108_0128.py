# Generated by Django 3.2.25 on 2024-11-07 18:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recomendation', '0003_movie_average_rating_movie_cast_movie_director_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rating',
            name='user_id',
        ),
        migrations.AddField(
            model_name='rating',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
