let music_data = {
	song : {},
	album : {},
	artist : {},
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({music_data : music_data});
  chrome.storage.sync.set({console_data : "empty console"});
  console.log(music_data)
});