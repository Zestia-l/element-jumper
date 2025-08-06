import { LitElement, html, css } from 'lit';
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
    this.active = false; // 默认不激活overlay元素
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateEventListeners();
    window.addEventListener('dev-overlay-active-change', () => {
      this.updateEventListeners();
    });
  }
  updateEventListeners() {
    const isActive = window.__DEV_OVERLAY_ACTIVE === true;
    // 移除已有的事件监听器（避免重复绑定）
    this.removeEventListener('mouseenter', this.handleMouseEnter);
    this.removeEventListener('mouseleave', this.handleMouseLeave);
    
    if (isActive) {
      this.addEventListener('mouseenter', this.handleMouseEnter);
      this.addEventListener('mouseleave', this.handleMouseLeave);
    }
  }
  handleMouseEnter = () => {
    this.active = true;
  };

  handleMouseLeave = () => {
    this.active = false;
  };

  render() {
    return html`
      <slot></slot>
      <div class="overlay"></div>
    `;
  }
}

customElements.define('overlay-element', OverlayElement);