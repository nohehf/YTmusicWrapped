let music_data = {
	song : {},
	album : {},
	artist : {},
}

let stats = {
  song: [{
    "song_name": "SPECIAL (avec Nekfeu et Fousheé)",
    "artist_name": "Laylow",
    "album_name": "L'Étrange Histoire de Mr.Anderson",
    "image_url": "https://lh3.googleusercontent.com/k-nBzmf7_F6fa1K8Y-eSLAECSGQtvR4rXId6AgSTTISpthhEONfR-gaVWEepBFW2ayiBRUOB2iIgxN65=w120-h120-l90-rj",
    "listenings": 1
}],
  album: [{
    "artist_name": "Orelsan",
    "album_name": "Civilisation",
    "image_url": "https://lh3.googleusercontent.com/rSCf5ko1GNYd5BO3TGN4QYKcYEhor-JRqN4C89WHS8Z2uOhA8byShQERtvbS7zrpKmOph4KSe0K3mCC_=w120-h120-l90-rj",
    "listenings": 4
}],
  artist: [{
    "artist_name": "Orelsan",
    "image_url": "https://lh3.googleusercontent.com/rSCf5ko1GNYd5BO3TGN4QYKcYEhor-JRqN4C89WHS8Z2uOhA8byShQERtvbS7zrpKmOph4KSe0K3mCC_=w120-h120-l90-rj",
    "listenings": 4
}],
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({music_data : music_data});
  chrome.storage.sync.set({stats : stats});
  chrome.storage.sync.set({console_data : "empty console"});
  console.log(music_data)
});