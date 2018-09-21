<template>
  <section class="section">
    <div class="container">
      <div class="content">
          <h3>Intro</h3>
          <p>The project is created using vue-cli to speed up the development process and to benefit from standard workflows. Also, it provides a project structure which is organized and if best practices are followed, testing and debugging will be easier. Bulma is chosen as the CSS framework which also supports SASS customization which would be useful for future developments.</p>

          <p>The following commands will help to run the project after cloning from the repository:</p>

          <blockquote>
          # install dependencies<br>
          npm install<br><br>

          # serve with hot reload at localhost:8080<br>
          npm run dev<br><br>

          # build for production with minification<br>
          npm run build
          </blockquote>

          <h3>Project Structure</h3>
          <p>The main part of project lives in the src folder </p>

          <blockquote>
          src<br>
          |--assets<br>
          &nbsp;&nbsp;&nbsp;&nbsp;|--sass<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|--main.scss<br>
          |--components<br>
          &nbsp;&nbsp;&nbsp;&nbsp;|--Hello.vue<br>
          &nbsp;&nbsp;&nbsp;&nbsp;|--RaceHistory.vue<br>
          &nbsp;&nbsp;&nbsp;&nbsp;|--RaceTimer.vue<br>
          &nbsp;&nbsp;&nbsp;&nbsp;|--WorldRace.vue<br>
          |--router<br>
          &nbsp;&nbsp;&nbsp;&nbsp;|--index.js<br>
          |--sw<br>
          &nbsp;&nbsp;&nbsp;&nbsp;|--sw.js<br>
          App.vue<br>
          main.js<br>
          </blockquote>

          <h3>Components Description</h3>
          <p>Following best practices, each task is seperated into a compoenent to make different parts of the project more maintanable.
          <h6>RaceTimer</h6>
          <p>The RaceTimer component is responsible for recording the time and location. It will also notify the user if the geo services are not available in the browser (or denied by the user).</p>
          <h6>RaceHistory</h6>
          <p>The RaceHistory component will deal with local storage to save each peice of information for each record. It will recieve the updates from the RaceTimer using vue events. Also, it uses the Moment library to format the dates. Due to time contraints the time-zones are not implemented.</p>
          <h6>WorldRace</h6>
          <p>This component is only serving as a view to put RaceTimer and RaceHistory in a page together. Both components require a timer-key attribute to pass to them, which will be used for the key as local storage and events handling. This strategy will allow having multiple timers and history tables even on a single page.</p>

          <h3>Offline Compatible</h3>
          <p>To enable offline viewing, I have done a basic implementation of the Google Workbox library which provides a clean API for Service Workers. The chosen strategy will cache the app, but only uses the network if it is unavailable, such as the wifi situation in the zeppelin!</p>
      </div>
      <div class="has-text-centered">
        <router-link class="button is-medium is-primary" :to="'race'">Start the App!</router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
