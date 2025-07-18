// import { LitElement, html, css } from 'lit';
import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3.0.0/+esm';
class OverlayElement extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      pointer-events: auto;
    }
    
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(45, 45, 45, 0.92);
      opacity: 0;
      visibility: hidden;
      transition: 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    :host([active]) .overlay {
      opacity: 1;
      visibility: visible;
    }
  `;

  static properties = {
    active: { type: Boolean, reflect: true },
    trigger: { type: String }
  };

  constructor() {
    super();
    this.active = true;
    this.trigger = 'click';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.trigger === 'click') {
      this.addEventListener('click', () => this.active = !this.active);
    } else {
      this.addEventListener('mouseenter', () => this.active = true);
      this.addEventListener('mouseleave', () => this.active = false);
    }
  }

  render() {
    return html`
      <slot></slot>
      <div class="overlay"></div>
    `;
  }
}

customElements.define('overlay-element', OverlayElement);