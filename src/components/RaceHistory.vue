<template>
  <section class="section">
    <div class="notification" v-if="!hasStorage">>
      Race history depends on local storage which is not available.
    </div>
    <div class="container" v-if="hasStorage">
      <h1 class="title">Race History</h1>
      <div class="table_wrapper">
        <table class="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>#</th>
              <th>Time Elapsed</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record,index) in records.slice().reverse()" :key="index">
              <td>{{ records.length - index }}</td>
              <td>{{ formatElapsed(record.startMills, record.endMills) }}</td>
              <td>
                <div>{{ (new Date(record.startMills))| moment("ddd, H:m:s") }}</div>
                <div><small>{{ record.latStart }},{{ record.lngStart }}</small></div>
              </td>
              <td>
                <div v-if="record.endMills">
                  {{ (new Date(record.endMills)) | moment("ddd, H:m:s") }}
                </div>
                <div v-else>-</div>
                <div><small>{{ record.latEnd }},{{ record.lngEnd }}</small></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <a v-on:click="clearHistory" class="button is-text has-text-link is-pulled-right">
        Clear History
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RaceHistory',
  props: {
    timerKey: String
  },
  data () {
    return {
      records: [],
      hasStorage: null
    }
  },
  mounted () {
    if (this.storageAvailable('localStorage')) {
      this.hasStorage = true
    } else {
      this.hasStorage = false
    }

    this.fetchRecords()
    // listen for updates
    // we can improve this by making one event handler and detect the type
    Event.$on(this.timerKey + '_update_pos', this.updatePosition)
    Event.$on(this.timerKey + '_new_record', this.newRecord)
    Event.$on(this.timerKey + '_record_ended', this.recordEnded)
  },

  methods: {
    formatElapsed: function (start, end) {
      if (end == null || end === 0) return ''

      var e = end - start

      var mill = e % 1000
      e = (e - mill) / 1000

      var sec = e % 60
      e = (e - sec) / 60

      var min = e % 60
      var hr = (e - min) / 60

      return ('00' + hr).slice(-2) + ':' + ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2)
    },
    fetchRecords: function () {
      if (this.hasStorage) {
        var recordsString = localStorage.getItem(this.timerKey)
        if (recordsString != null) {
          this.records = JSON.parse(recordsString)
        }
      }
    },
    clearHistory: function () {
      this.records = []
      this.updateLocalStorage()
    },
    updateLocalStorage: function () {
      localStorage.setItem(this.timerKey, JSON.stringify(this.records))
      // Event.$emit(this.timerKey)
      this.fetchRecords()
    },
    // type will be start or end
    updatePosition: function (position, type, startMills) {
      var record = null
      this.records.forEach(r => {
        if (r.startMills === startMills) {
          record = r
        }
      })
      if (record == null) {
        return
      }

      if (type === 'start') {
        record.latStart = position.coords.latitude
        record.lngStart = position.coords.longitude
      } else if (type === 'end') {
        record.latEnd = position.coords.latitude
        record.lngEnd = position.coords.longitude
      }
      this.updateLocalStorage()
    },
    newRecord: function (startMills) {
      this.records.push({
        startMills: Number(startMills),
        endMills: null,
        latStart: null,
        lngStart: null,
        latEnd: null,
        lngEnd: null
      })
      this.updateLocalStorage()
    },
    recordEnded: function (startMills, endMills) {
      var record = null
      this.records.forEach(r => {
        if (r.startMills === startMills) {
          console.log('found z ' + r.endMills)
          record = r
        }
      })
      if (record == null) {
        return
      }
      record.endMills = Number(endMills)
      this.updateLocalStorage()
    },
    storageAvailable: function (type) {
      // ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
      var storage
      var x = '__storage_test__'

      try {
        storage = window[type]
        storage.setItem(x, x)
        storage.removeItem(x)
        return true
      } catch (e) {
        return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          storage.length !== 0
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .table_wrapper {
    overflow-x: auto;
  }
</style>
