import Component from 'vue-class-component';
import {Searcher} from "./Searcher";
import {template} from './template';
import {CurrentTrackService} from './CurrentTrackService';
import {SpotifyService} from './SpotifyService';
import {MprisService} from './MprisService';
const platform = require('os').platform();

@Component({
    props: {
        'shell': {
            'type': Object
        },
        'showError': {
            'type': Function
        },
        'settings': {
            'type': Object
        }
    },
    template: template('Song')
})

export class SongRender {
    protected lastSongSync;
    protected service:CurrentTrackService;
    protected song;
    protected shell;
    protected searcher: Searcher;
    protected showError;
    protected timer = null;
    protected settings;

    data() {
        return {
            song: null,
            lastSongSync: {},
            searcher: new Searcher(),
        }
    }

    scheduleNextCall() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            console.warn(
            'Scheduling ',
            this.settings.refreshInterval / 1000,
            ' seconds'
            );
            this.timer = setTimeout(() => {
                this.refresh();
            }, this.settings.refreshInterval);
    }

    ready() {
        this.refresh();
    }

    refresh() {
        console.log('refreshing');
        var currentTrackService = this.getCurrentTrackService();

        currentTrackService.getCurrentSong((err, song) => {
            if (err) {
                this.showError('Current song error: ' + err);
                this.scheduleNextCall();
            } else if (this.isLastSong(song)) {
                console.log('is last song nothing to do here');
                this.scheduleNextCall();
            } else {
                console.log('is not last song searching by title and artist');
                song.lyric = 'Loading Lyrics...';
                this.displaySong(song);
                this.saveLastSong(song);
                this.searcher.search(song.title, song.artist, (err, lyric) => {
                    if (err) {
                        this.showError('Plugin error: ' + err);
                        return;
                    }
                    if (lyric === null) {
                      song.lyric = 'Sorry, couldn\'t find lyrics for this song!';
                    } else {
                      song.lyric = lyric;
                    }
                    this.displaySong(song);
                    this['$nextTick'](() => {
                        document.getElementById("lyricBox").scrollTop = 0;
                    });
                    this.scheduleNextCall();
                });
            }
        });
    }

    displaySong(song) {
      const newSongObject = {};
      for (let k of Object.keys(song)) {
          newSongObject[k] = song[k];
      }
      this.song = newSongObject;
    }

    isLastSong(song) {
        for (let k of ['title']) {
            if (song[k] !== this.lastSongSync[k]) {
                return false;
            }
        }
        return true;
    }

    saveLastSong(song) {
        for (let k of Object.keys(song)) {
            this.lastSongSync[k] = song[k];
        }
    }

    getCurrentTrackService() {
        if (!this.service) {
            if(platform == 'linux' && this.settings.useMPRIS == true){
                this.service = new MprisService(this.settings);
            }else{
                this.service = new SpotifyService();
            }
        }
        return this.service;
    }

    openExternal(url) {
        this.shell.openExternal(url);
    }
}
