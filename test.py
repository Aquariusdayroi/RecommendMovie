import requests   

def get_movie_image(title):
    api_key = "9de9e07ab5ab14a81cd1467c9bc145f9"
    url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={title}"
    response = requests.get(url)
    data = response.json()
    # print(data)
    if data['results']:
        movie = data['results'][0]
        poster_path = movie['poster_path']
        image_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
        return image_url
    return None




print(get_movie_image("Silence of the Palace"))
print("helo")