const request = require('request').defaults({timeout: 5000});
const async = require('async');
var mpris = require('mpris');
import {Settings} from "../Settings.js";

export class MprisService {
    settings: any;
    metadata: any;
    playbackStatus: any;
    
    constructor(settings: Settings){
        this.settings = settings;

        var self = this;
        mpris.disconnect();      
        /*mpris.Player.on('MetadataChanged', function (newValue, oldValue) {
            if(!oldValue || Object.keys(newValue).length != Object.keys(oldValue).length) {
                console.log("Metadata updated:");
                console.log("Artist: " + newValue['xesam:artist']);
                console.log("Title: " + newValue['xesam:title']);
                console.log("Album: " + newValue['xesam:album']);
                self.metadata = newValue;
            }
        });

        mpris.Player.on('PlaybackStatusChanged', function (newValue, oldValue) {
            if(newValue != oldValue) {
                mpris.GetIdentity(function (error, identity) {
                    mpris.Player.GetMetadata(function (error, metadata) {
                        console.log(identity+' is now '+newValue.toLowerCase()+' "'+metadata['xesam:url']+'"');
                        self.playbackStatus = newValue.toLowerCase();
                    });
                });
            }
        });
        */
        mpris.connect(this.settings.playerName, function (error, mc) {
            console.log('MPRIS Connected.');
            mpris.Player.GetMetadata(function(err, data) {
				mpris.Player.emit('MetadataChanged', data);
			});

			mpris.Player.GetPlaybackStatus(function(err, data) {
				mpris.Player.emit('PlaybackStatusChanged', data);
			});
        });
    }

    public getCurrentSong(cb){
        var self = this;

        mpris.Player.GetPlaybackStatus(function(error, playbackStatus){
            if(error) return cb('No song', null);
            if(playbackStatus){
                mpris.Player.GetMetadata(function (error, metadata){
                    self.metadata = metadata;
                });
                self.playbackStatus = playbackStatus;
            }
        });

        if(!this.metadata) return cb('No song', null);

        const result = {
            playing: this.playbackStatus,
            artist: this.metadata['xesam:artist'] ? this.metadata['xesam:artist'] : 'Unknown',
            title: this.metadata['xesam:title'] ? this.metadata['xesam:title'] : 'Unknown',
            album: {
                name: this.metadata['xesam:album'] ? this.metadata['xesam:album'] : 'Unknown',
                images: null
            }
        };

        return cb(null, result);
    }
}


