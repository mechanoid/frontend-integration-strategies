/* global customElements, HTMLElement, FormData, fetch, URLSearchParams */

class AsyncForm extends HTMLElement {
  connectedCallback () {
    this.form = this.querySelector('form')
    this.submit = this.querySelector('input[type=submit]')
    this.submitBaseValue = this.submit.getAttribute('value')

    this.addEventListener('submit', async (event) => {
      event.preventDefault()
      this.submit.setAttribute('disable', true)
      this.submit.setAttribute('value', '...')

      const result = await fetch(this.form.action, {
        method: this.form.method,
        body: new URLSearchParams([...(new FormData(this.form))])
      })
        .finally(() => {
          this.submit.setAttribute('disable', false)
          this.submit.setAttribute('value', this.submitBaseValue)
        })

      if (result.ok) {
        console.log('added item to basket!')
      }
    })
  }
}

customElements.define('async-form', AsyncForm)
