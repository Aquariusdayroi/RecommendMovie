# Generated by Django 5.1.3 on 2024-11-21 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recomendation', '0008_remove_movie_average_rating_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='avatar',
            field=models.ImageField(default='default-avatar.png', upload_to='avatars/'),
        ),
    ]
