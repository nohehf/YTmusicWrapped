# YTmusicWrapped

A chrome extention to get listening stats from your youtube music account.

Just go to https://music.youtube.com/history and it displays your listening stats from today:

![extention popup](https://raw.githubusercontent.com/nohehf/YTmusicWrapped/main/screenshot.png?token=APP2R5AE7OVHI7GYLXHCV3LBXETMK)

## Warning:
I actually realised that this extension could never provide perfect stats as the history given by youtube music is already filterd, for exemple a song will never appear in the history several times even if you listen to it 25 times/day.
Also, it's impossible to get the full history just after installing the extension as youtube music only gives a fixed ammount of songs in the history, and this seem imposible to get around as the page is server side rendered (the filtering occurs on the backend).

I still wanted to develop the extention after knowing that mostly to learn chrome extension and more or less finish the project.

## Roadmap / possible features:

 1. Advanced stats button -> button that opens a new tab with more stats than in the popup (Top 5 in each categories...)
 2. Not scanning the same song several times
 3. Sync storage (it was a feature at the beginning but chrome sync storage max object size was to limited)
 4. Better data storage
 5. ~~Better stats~~ -> as mentioned above, this is imposible due to youtube music history page limitations.
 6. Better UI
 7. Refactor/clean code
 
## How to install ?
todo
