<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <hr>
    <button v-if="user.uid" @click="doLogout">logout!</button>
    <button v-else="user.uid" @click="doLogin">login!</button>
    <hr>
    <input type="text" v-model="sendText" @keyup.enter.prevent="doSend"/>
    <hr>
    <p v-for="chat in chats">{{chat.name}}:{{chat.text}}</p>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import firebase from 'firebase'

export default {
  name: 'app',
  data(){
    return {
      user : {},
      chats : [],
      sendText : ''
    }
  },
  components: {
    HelloWorld
  },
  created(){
    firebase.auth().onAuthStateChanged(user => {
      if(!user) { return }
      // ログイン状態ならuserが取得できる
      this.user = user
      const ref_message = firebase.database().ref('message')
      console.log({ref_message})
      console.log(ref_message.key)
      ref_message.limitToLast(10).on('child_added', this.childAdded.bind(this))
      ref_message.limitToLast(10).off('child_added', this.childAdded.bind(this))
    })
  },
  methods : {
    doLogin(){
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithPopup(provider)
    },
    doLogout() {
      firebase.auth().signOut().then(()=>{
        this.user = {}
      })
    },
    doSend() {
      console.log('enter!',this.user,this.sendText);
      if (!this.user.uid || !this.sendText.length) { return }

      console.log('send!')

      firebase.database().ref('message').push({
        text: this.sendText,
        name: this.user.displayName
      }, () => {
        this.sendText = '' // フォームを空にする
      })
    },
    childAdded(snap) {
      this.chats.push(snap.val())
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
