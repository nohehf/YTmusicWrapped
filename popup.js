let analyseButton = document.getElementById("analyseButton");


//console in the popup:
// chrome.storage.sync.get(["console_data"], (result) => {
//   document.getElementById("devConsole").innerHTML = result.console_data;
// });

// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     alert(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`
//     );
//   }
// });

function clg(text) {

  document.getElementById("devConsole").innerHTML = text;

}


// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
analyseButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: on_analyseButton_click,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page



function on_analyseButton_click () {
  
  //console.log("test")

  if (get_tab_url() == "https://music.youtube.com/history" && is_user_connected()) {

  //   console.log("analyse")
     get_data()

   } else {

     alert("Pas sur la bonne page ou pas connecte !")

   }


  function get_data(){

    

    let rootContent = getElementByXpath("/html/body/ytmusic-app/ytmusic-app-layout/div[3]/ytmusic-browse-response/ytmusic-section-list-renderer/div[2]/ytmusic-shelf-renderer[1]/div[2]",document)
    
    let songs = getElementsListByXPath('ytmusic-responsive-list-item-renderer',rootContent)

    for (song of songs) {
      
    }

    //let first_thing = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]',rootContent)

    data = {}

    let image = getElementByXpath('//*[@id="img"]',first_thing)
    
    data["image_url"] = image.src

    let textRoot = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]/div[2]',first_thing)

    let titre = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]/div[2]/div[1]/yt-formatted-string/a', textRoot)
    
    let artist = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]/div[2]/div[3]/yt-formatted-string[1]/a[1]', textRoot)

    let album = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]/div[2]/div[3]/yt-formatted-string[2]/a', textRoot)


    data["song_name"] = titre.innerHTML
    data["artist_name"] = artist.innerHTML
    data["album_name"] = album.innerHTML

    //save_data(data)

    chrome.storage.sync.get(["music_data"], (result) => {save_data(data,result)});

    //alert(JSON.stringify(data))
    
  }

  function save_data(data,result) {

    var music_data = result.music_data

    function update_music_data(result) {
      music_data = result.music_data;
    }

    songKey = data.song_name + data.artist_name + data.album_name
    albumKey = data.artist_name + data.album_name
    artistKey = data.artist_name
    if (! (songKey in music_data["song"])) {

      //ajouter son
      music_data["song"][songKey] = {song_name: data.song_name, artist_name: data.artist_name, album_name: data.album_name, image_url: data.image_url, listenings: 0}

      if(!(albumKey in music_data["album"])) {

        music_data["album"][albumKey] = {artist_name: data.artist_name, album_name: data.album_name, image_url: data.image_url, listenings: 0}

        if(!(data.artist_name in music_data["artist"])) {

          music_data["artist"][artistKey] = {artist_name: data.artist_name, image_url: data.image_url, listenings: 0}

        }

      }

    }

    

    //incrémenter les listenings:
    music_data["song"][songKey]["listenings"] += 1
    music_data["album"][albumKey]["listenings"] += 1
    music_data["artist"][artistKey]["listenings"] += 1

    console.log(music_data)

    chrome.storage.sync.set({music_data : music_data});
  }

  function getElementByXpath(path, root) {
    return document.evaluate(path, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  function getElementsListByXPath(xpath, parent)
  {
      let results = [];
      let query = document.evaluate(xpath, parent || document,
          null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          results.push(query.snapshotItem(i));
      }
      return results;
  }

  function get_tab_url(){
    return document.URL
  }
  
  function is_user_connected() {
    return true //todo
  }

}