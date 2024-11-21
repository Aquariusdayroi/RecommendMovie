from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User 


class Movie(models.Model):
    title = models.CharField(max_length=200)
    release_date = models.DateField(null=True, blank=True)
    genre = models.CharField(max_length=100, blank=True, null=True)
    poster_url = models.URLField(max_length=500, blank=True, null=True)
    overview = models.TextField(blank=True, null=True)
    director = models.CharField(max_length=200, blank=True, null=True)
    cast = models.TextField(blank=True, null=True)
    runtime = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.title


class Rating(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()  # Giá trị rating (1-5)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('movie', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.movie.title} - {self.rating}"



class Comment(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()  # Nội dung bình luận
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    occupation = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', default='default-avatar.png')  # Avatar
    
    def __str__(self):
        return f"{self.user.username} - Profile"

