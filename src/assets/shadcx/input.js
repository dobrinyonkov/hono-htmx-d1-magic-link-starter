var e=`
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  blockquote, dl, dd, hr, figure, p, pre { margin: 0; }
  ol, ul { list-style: none; margin: 0; padding: 0; }
  a { color: inherit; text-decoration: inherit; }
  button, input, optgroup, select, textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }
  button, select { text-transform: none; }
  button, [type='button'], [type='reset'], [type='submit'] {
    appearance: button;
    background-color: transparent;
    background-image: none;
  }
  :-moz-focusring { outline: auto; }
  :-moz-ui-invalid { box-shadow: none; }
  progress { vertical-align: baseline; }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; }
  [type='search'] { appearance: textfield; outline-offset: -2px; }
  ::-webkit-search-decoration { -webkit-appearance: none; }
  ::-webkit-file-upload-button { font: inherit; appearance: button; }
  textarea { resize: vertical; }
  fieldset { margin: 0; padding: 0; min-width: 0; }
  legend { padding: 0; }
  ::placeholder { color: hsl(var(--muted-foreground)); opacity: 1; }
  [hidden] { display: none !important; }

  :host { display: flex; }

  .root {
    display: flex;
    width: 100%;
    height: 2.25rem;
    border-radius: calc(var(--radius) - 2px);
    border: 1px solid hsl(var(--input));
    background-color: hsl(var(--background));
    padding-inline: 0.75rem;
    padding-block: 0.25rem;
    font-size: 1rem;
    color: hsl(var(--foreground));
    transition: color 0.15s, border-color 0.15s, box-shadow 0.15s;
  }

  .root::placeholder { color: hsl(var(--muted-foreground)); }
  .root:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
  }
  .root:disabled { cursor: not-allowed; opacity: 0.5; }
  .root::file-selector-button {
    border: 0;
    background-color: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }
  .root[aria-invalid] { border-color: hsl(var(--destructive)); }

  @media (min-width: 768px) {
    .root { font-size: 0.875rem; }
  }
`,t=class extends HTMLElement{static{this.observedAttributes=[`type`,`placeholder`,`disabled`,`required`,`readonly`,`aria-invalid`]}get type(){return this.getAttribute(`type`)??`text`}set type(e){this.setAttribute(`type`,e)}get placeholder(){return this.getAttribute(`placeholder`)??``}set placeholder(e){this.setAttribute(`placeholder`,e)}get disabled(){return this.hasAttribute(`disabled`)}set disabled(e){this.toggleAttribute(`disabled`,e)}get required(){return this.hasAttribute(`required`)}set required(e){this.toggleAttribute(`required`,e)}get readonly(){return this.hasAttribute(`readonly`)}set readonly(e){this.toggleAttribute(`readonly`,e)}get ariaInvalid(){return this.getAttribute(`aria-invalid`)}set ariaInvalid(e){e===null?this.removeAttribute(`aria-invalid`):this.setAttribute(`aria-invalid`,e)}connectedCallback(){this.shadowRoot||this.attachShadow({mode:`open`}),this.render()}attributeChangedCallback(){this.render()}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>${e}</style>
      <input
        part="root"
        class="root"
        type="${this.type}"
        placeholder="${this.placeholder}"
        ${this.disabled?`disabled`:``}
        ${this.required?`required`:``}
        ${this.readonly?`readonly`:``}
        ${this.ariaInvalid?`aria-invalid="${this.ariaInvalid}"`:``}
      >
    `)}};customElements.get(`shadcx-input`)||customElements.define(`shadcx-input`,t);