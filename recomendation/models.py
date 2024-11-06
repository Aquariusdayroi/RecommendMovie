from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=200)
    release_date = models.DateField()
    genre = models.CharField(max_length=100)
    poster_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

class Rating(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user_id = models.IntegerField()
    rating = models.IntegerField()

    def __str__(self):
        return f"{self.user_id} - {self.movie.title} - {self.rating}"
