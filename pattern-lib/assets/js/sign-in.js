/* global customElements, HTMLElement, document, window */

class SignIn extends HTMLElement {
  connectedCallback () {
    console.log('Sign-In Connected!')
    this.button = this.querySelector('button')
    this.button.addEventListener('click', this.signIn)
  }

  signIn () {
    const d = new Date()
    d.setTime(d.getTime() + (10 * 60 * 1000))
    const expires = 'expires=' + d.toUTCString()
    const userId = Math.ceil(Math.random() * 1000000000)

    document.cookie = `simple-shop-user-id=${userId};${expires};path=/`
    console.log('signed in', userId)

    window.location && window.location.reload && window.location.reload()
  }
}

customElements.define('sign-in', SignIn)
