<template>
  <div class="AuthPage">
    <div class="h1 my-5">Tunggalika Admin Interface</div>
    <div class="container text-center shadow pt-3 auth-form">
      <div class="h2 mb-3">Login</div>
      <form class="container text-center" @submit.prevent="login()">
        <div class="form-group">
          <input class="form-control text-center mb-3" type="text" placeholder="Username" v-model="username">
        </div>
        <div class="form-group">
          <input class="form-control text-center mb-3" type="password" placeholder="Password" v-model="password">
        </div>
        <div class="form-group">
          <input class="form-control btn btn-primary mb-3" type="submit" value="Log In">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Axios from 'axios'
import Swal from 'sweetalert2'
const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export default {
  name: 'AuthPage',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      Axios({
        method: 'POST',
        url: 'https://mighty-stream-85910.herokuapp.com/manage/login',
        data: {
          username: this.username,
          password: this.password
        }
      })
      .then(({ data }) => {
        localStorage.access_token = data.access_token
        this.$router.push({
          path: '/'
        })
        Toast.fire({
          icon: 'success',
          title: 'Login Success!'
        })
      })
      .catch(err => {
        let msg = null;
        if (err.response) {
          if (Array.isArray(err.response.data.message)) {
            msg = err.response.data.message.join('<br>');
          } else {
            msg = err.response.data.message;
          }
        } else if (err.request) {
          msg = err.request;
        } else {
          msg = err.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: `${msg}`
        })
      })
    }
  }
}
</script>
