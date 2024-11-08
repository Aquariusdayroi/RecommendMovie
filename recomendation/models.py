from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User 


class Movie(models.Model):
    title = models.CharField(max_length=200)
    release_date = models.DateField(null=True, blank=True)
    genre = models.CharField(max_length=100, blank=True, null=True)
    poster_url = models.URLField(max_length=500, blank=True, null=True)
    overview = models.TextField(blank=True, null=True)
    average_rating = models.FloatField(blank=True, null=True)  # Đổi tên thành average_rating
    director = models.CharField(max_length=200, blank=True, null=True)
    cast = models.TextField(blank=True, null=True)
    runtime = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.title

class Rating(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    timestamp = models.DateTimeField(default=timezone.now) # Đặt mặc định là thời gian hiện tại

    def __str__(self):
        return f"{self.user.username} - {self.movie.title} - {self.rating}"
