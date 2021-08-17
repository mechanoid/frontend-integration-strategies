/* global customElements, HTMLElement, FormData, fetch, URLSearchParams, CustomEvent */

class AsyncForm extends HTMLElement {
  connectedCallback () {
    this.eventBus = document.querySelector('body')

    this.form = this.querySelector('form')
    this.submit = this.querySelector('input[type=submit]')
    this.submitBaseValue = this.submit.getAttribute('value')
    this.successEvent = this.getAttribute('on-success')
    this.addedProps = this.getAttribute('form-event-props')

    this.addEventListener('submit', async (event) => {
      event.preventDefault()

      this.submit.setAttribute('disable', true)
      this.submit.setAttribute('value', '...')

      const formData = new FormData(this.form)

      const result = await fetch(this.form.action, {
        method: this.form.method,
        body: new URLSearchParams([...(formData)])
      })
        .finally(() => {
          this.submit.setAttribute('disable', false)
          this.submit.setAttribute('value', this.submitBaseValue)
        })

      if (result.ok) {
        if (this.successEvent) {
          const detail = { id: formData.get('id') }

          if (this.addedProps) {
            const props = this.addedProps.split(',') // TODO: clean allowed properties
            props.forEach(p => {
              detail[p] = formData.get(p)
            })
          }

          const createdEvent = new CustomEvent(this.successEvent, { bubbles: true, detail })
          this.form.dispatchEvent(createdEvent)
        }
        console.log('added item to basket!')
      }
    })
  }
}

customElements.define('async-form', AsyncForm)
