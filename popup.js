let analyseButton = document.getElementById("analyseButton");

handle_firstinstall()


//console in the popup:
// chrome.storage.local.get(["console_data"], (result) => {
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

function handle_firstinstall() {

  chrome.storage.local.get(["settings"], (result) => {
    console.log(result.settings)
    if(result.settings.firstinstall) {
      chrome.storage.local.set({settings: {firstinstall: false}},()=>{
        console.log('FORCE RELOAD')
        callback = () => {document.location.reload(true)}
        analyse(callback)
        
      })
      
      
    } else {
      analyse()
    }
  })

}

async function analyse(callback = ()=>(null)) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: on_analyseButton_click,
  },(injectionResults)=>{
    //SEUL TRUC QUI MARCHE PAS ENCORE
    console.log(injectionResults)
    console.log("analyse button click callback")
    update_displayed_stats();
    callback();
    //document.location.reload(true)
  })
}


// chrome.storage.local.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
analyseButton.addEventListener("click", async () => {
    analyse()


  });
  
  // The body of this function will be executed as a content script inside the
  // current page


function on_analyseButton_click () {
  
  //console.log("test")

  if (get_tab_url() == "https://music.youtube.com/history" && is_user_connected()) {

  //   console.log("analyse")
    let data_list = get_data()
    callback = (music_data) => update_stats(music_data)
    chrome.storage.local.get(["music_data"], (result) => {save_data(data_list,result,callback)})


   } else {

     alert("Pas sur la bonne page ou pas connecte !")

   }


  function get_data(){

    var data_list = []

    //let rootContent = getElementByXpath("/html/body/ytmusic-app/ytmusic-app-layout/div[3]/ytmusic-browse-response/ytmusic-section-list-renderer/div[2]/ytmusic-shelf-renderer[1]/div[2]",document)
    
    songsXpath = '/html/body/ytmusic-app/ytmusic-app-layout/div[3]/ytmusic-browse-response/ytmusic-section-list-renderer/div[2]/ytmusic-shelf-renderer[1]/div[2]/ytmusic-responsive-list-item-renderer'
    let songs = getElementsListByXPath(songsXpath)

    for (song of songs) {

      //console.log(song)

      let data = {}

      let image = getElementByXpath('div[1]/ytmusic-thumbnail-renderer/yt-img-shadow/img',song)
      
      data["image_url"] = image.src
  
      let textRoot = getElementByXpath('div[2]',song)
  
      let titre = getElementByXpath('div[1]/yt-formatted-string/a', textRoot)
      
      var artist = getElementByXpath('div[3]/yt-formatted-string[1]/a[1]', textRoot)

      if(artist === null) {
        artist = getElementByXpath('div[3]/yt-formatted-string[1]/span[1]',textRoot)
      }

        
      let album = getElementByXpath('div[3]/yt-formatted-string[2]/a', textRoot)
      
  
      data["song_name"] = titre.innerHTML
      data["artist_name"] = artist.innerHTML
      data["album_name"] = album.innerHTML


      // chrome.storage.local.get(["music_data"], (result) => {save_data(data,result)});
      data_list.push(data)
    }

    // chrome.storage.local.get(["music_data"], (result) => {console.log(result.music_data)})

    return data_list

    //let first_thing = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]',rootContent)

    // data = {}

    // let image = getElementByXpath('//*[@id="img"]',first_thing)
    
    // data["image_url"] = image.src

    // let textRoot = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]/div[2]',first_thing)

    // let titre = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]/div[2]/div[1]/yt-formatted-string/a', textRoot)
    
    // let artist = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]/div[2]/div[3]/yt-formatted-string[1]/a[1]', textRoot)

    // let album = getElementByXpath('//*[@id="contents"]/ytmusic-responsive-list-item-renderer[1]/div[2]/div[3]/yt-formatted-string[2]/a', textRoot)


    // data["song_name"] = titre.innerHTML
    // data["artist_name"] = artist.innerHTML
    // data["album_name"] = album.innerHTML

    //save_data(data)

    // chrome.storage.local.get(["music_data"], (result) => {save_data(data,result)});

    //alert(JSON.stringify(data))
    
  }


  function save_data(data_list,result,callback) {
    

    var music_data = result.music_data

    function update_music_data(result) {
      music_data = result.music_data;
    }


    for (data of data_list) {

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


    }
    // console.log(music_data)
    chrome.storage.local.set({music_data : music_data}, ()=> {
      console.log('saved data : ')
      console.log(music_data)
      callback(music_data)
    })
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

  function update_stats(music_data) {


    //song stats
    let stats = {}
    let categories = ['song','album','artist']
    for(categorie of categories) {
      let sortable = [];
      for (let songKey in music_data[categorie]) {
  
        sortable.push(music_data[categorie][songKey])
  
      }
  
      sortable.sort((a,b) => a.listenings > b.listenings ? -1 : b.listenings > a.listenings ? 1 : 0)
      sortable = sortable.slice(0,5)
      stats[categorie] = sortable

    }



    console.log(stats)
    chrome.storage.local.set({stats : stats})

    //console.log(music_data.song.sort((a,b) => (a.listenings > b.listenings) ? 1 : (a.listenings > b.listenings) ? -1 : 0))

    // chrome.storage.local.get(["stats"], (result) => {
  
    //   let stats = result.stats

      
  
    //   console.log(music_data.song.sort((a,b) => (a.listenings > b.listenings) ? 1 : (a.listenings > b.listenings) ? -1 : 0))
  
    // })
  
  
  }

  true

}

function update_displayed_stats() {

  console.log("update displayed stats...");
  chrome.storage.local.get(["stats"], (result) => {

    let stats = result.stats
    console.log(stats)
    let first_song = stats.song[0]
    let first_album = stats.album[0]
    let first_artist = stats.artist[0]

    document.getElementById("song_songName").innerHTML = first_song.song_name
    document.getElementById("song_artistName").innerHTML = first_song.artist_name
    document.getElementById("song_albumName").innerHTML = first_song.album_name
    document.getElementById("song_listenings").innerHTML = first_song.listenings + ' listenings'
    document.getElementById("song_img").src = first_song.image_url


    document.getElementById("album_artistName").innerHTML = first_album.artist_name
    document.getElementById("album_albumName").innerHTML = first_album.album_name
    document.getElementById("album_listenings").innerHTML = first_album.listenings + ' listenings'
    document.getElementById("album_img").src = first_album.image_url

    document.getElementById("artist_artistName").innerHTML = first_artist.artist_name
    document.getElementById("artist_listenings").innerHTML = first_artist.listenings + ' listenings'
    document.getElementById("artist_img").src = first_artist.image_url
    
  })

}