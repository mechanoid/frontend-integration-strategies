/* global customElements, HTMLElement, fetch */

class ShoppingBasketPreview extends HTMLElement {
  async connectedCallback () {
    this.eventBus = document.querySelector('body')

    this.link = this.querySelector('a')
    this.href = this.link.getAttribute('href')

    if (this.href) {
      const preview = await this.updateList(this.href)
      this.innerHTML = preview
    }

    this.eventBus.addEventListener('basket:item-removed', ev => {
      this.querySelector(`#item-${ev.detail.id}`).remove()
    })

    this.eventBus.addEventListener('basket:item-added', async ev => {
      const preview = await this.updateList(this.href)
      this.innerHTML = preview
    })
  }

  async updateList (href) {
    const result = await fetch(href, { credentials: 'include', headers: { 'Fint-Partialized': true } })

    if (!result.ok) {
      console.log('failed to fetch shopping preview', result.status)
    }

    const preview = await result.text()
    return preview
  }
}

customElements.define('shopping-basket-preview', ShoppingBasketPreview)
