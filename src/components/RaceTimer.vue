<template>
  <section class="section">
    <div class="columns">
      <div class="column is-half-tablet is-offset-one-quarter-tablet
        is-one-third-desktop is-offset-one-third-desktop">
        <div class="card">
          <div class="notification" v-if="geoNotAvailable && showGeoWarning">
            <button class="delete" v-on:click="showGeoWarning=false"></button>
            Location data is not available.
          </div>
          <div class="card-content has-text-primary has-text-centered">
            <span class="is-size-1">
              {{elapsed}}
            </span>
            <span class="is-size-5">
              .{{elapsedMills}}
            </span>
          </div>
          <a class="button is-success btnTimer" v-show="!interval" v-on:click="start" >
            Start
          </a>
          <a class="button is-warning btnTimer" v-show="interval" v-on:click="stop">
            Stop
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RaceTimer',
  props: {
    timerKey: String
  },
  data () {
    return {
      interval: null,
      elapsedMills: '00',
      elapsed: '00:00:00',
      geoNotAvailable: null,
      showGeoWarning: true,
      record: null
    }
  },
  mounted: function () {
    if ('geolocation' in navigator) {
      this.geoNotAvailable = false
    } else {
      this.geoNotAvailable = true
    }
  },
  methods: {

    tick: function () {
      var e = Date.now() - this.record.startMills

      var mill = e % 1000
      e = (e - mill) / 1000

      var sec = e % 60
      e = (e - sec) / 60

      var min = e % 60
      var hr = (e - min) / 60

      this.elapsedMills = ('00' + Math.trunc(mill / 10)).slice(-2)

      this.elapsed = ('00' + hr).slice(-2) + ':' + ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2)
    },
    reset: function () {
      this.record = {
        startMills: null,
        endMills: null,
        latStart: null,
        lngStart: null,
        latEnd: null,
        lngEnd: null
      }
    },

    start: function () {
      // reset the record
      this.reset()
      this.record.startMills = Date.now()
      Event.$emit(this.timerKey + '_new_record', this.record.startMills)

      this.getPosition('start')

      this.interval = setInterval(this.tick, 120)
    },

    stop: function () {
      if (this.record == null) {
        return
      }
      this.record.endMills = Date.now()
      Event.$emit(this.timerKey + '_record_ended', this.record.startMills, this.record.endMills)

      if (this.interval != null) {
        clearInterval(this.interval)
        this.interval = null
      }
      this.getPosition('end')
    },

    getPosition: function (type) {
      var startMills = this.record.startMills
      var options = {
        timeout: 10000
      }
      navigator.geolocation.getCurrentPosition(function (position) {
        // this.updatePosition(position, type, startMills)
        Event.$emit(this.timerKey + '_update_pos', position, type, startMills)
      }.bind(this),
      this.positionError,
      options)
    },
    positionError: function (err) {
      this.geoNotAvailable = true
      console.log('Coult not get pos')
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }
  },
  beforeDestroy () {
    this.stop()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btnTimer {
    width: 100%;
    border-radius: 0;
  }
</style>
