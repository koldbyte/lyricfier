import Component from 'vue-class-component'

@Component({
    props: {
        'ipc': {
            'type': Object
        },
        'shell': {
            'type': Object
        },
        'settings': {
            'type': Object
        },
        'onChangeSettings': {
            'type': Function
        }
    },
    template: `
    <div class="full-vertical-flex" :class="settings.fontSize">
      <div class="app-drag-bar">
          <h1>lyricfier</h1>
      </div>
      <div class="settings-container">
        <h2 class="flow-text">Settings</h2>
        <div>
          <input
            type="checkbox"
            id="alwaysOnTopCheckbox"
            v-model="settings.alwaysOnTop"
            v-on:change="onChangeSettings()"
          >
          <label for="alwaysOnTopCheckbox">Always On Top</label>
        </div>
        <div>
          <select
            id="themeSelector"
            v-model="settings.theme"
            v-on:change="onChangeSettings()"
          >
              <option>dark</option>
              <option>light</option>
          </select>
          <label for="themeSelector">Theme</label>
        </div>
        <div>
          <select
            id="fontSizeSelector"
            v-model="settings.fontSize"
            v-on:change="onChangeSettings()"
          >
              <option value="eight-pt">8 pt</option>
              <option value="ten-pt">10 pt</option>
              <option value="twelve-pt">12 pt</option>
              <option value="fourteen-pt">14 pt</option>
              <option value="sixteen-pt">16 pt</option>
          </select>
          <label for="fontSizeSelector">Font Size</label>
        </div>
        <div>
          <select
            id="refreshIntervalSelector"
            v-model="settings.refreshInterval"
            v-on:change="onChangeSettings()"
          >
              <option :value="1000">1 sec</option>
              <option :value="3000">3 sec</option>
              <option :value="5000">5 sec</option>
              <option :value="7000">7 sec</option>
              <option :value="10000">10 sec</option>
          </select>
          <label for="refreshIntervalSelector">Refresh Rate</label>
        </div>
        <div>
          <select
            id="playerSelector"
            v-model="settings.playerName"
            v-on:change="onChangeSettings()">
              <option value="vlc">VLC</option>
              <option value="clementine">Clementine</option>
              <option value="cantata">Cantata</option>
          </select>
          <label for="playerSelector">CHoose Media Player</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="useMPRISCheckbox"
            v-model="settings.useMPRIS"
            v-on:change="onChangeSettings()">
          <label for="useMPRISCheckbox">Use MPRIS</label>
        </div>
      </div>
    </div>
  `
})
export class SettingsRender {
    protected settings;
    protected ipc;
    protected shell;
    protected onChangeSettings;

    data() {
        return {
        }
    }

    openExternal(url) {
        this.shell.openExternal(url);
    }

}
