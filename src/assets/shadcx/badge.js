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

  :host { display: inline-flex; }

  .root {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    white-space: nowrap;
    border-radius: var(--radius);
    border: 1px solid transparent;
    padding-inline: 0.625rem;
    height: 1.375rem;
    font-size: 0.75rem;
    line-height: 1;
    font-weight: 500;
    transition: color 0.15s, background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
  }

  .root:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
  }

  .root ::slotted(svg),
  .root ::slotted([data-icon]) {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
  }

  .root ::slotted([data-icon='inline-start']) { margin-inline-end: 0.125rem; }
  .root ::slotted([data-icon='inline-end']) { margin-inline-start: 0.125rem; }

  [data-variant='default'] {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }
  [data-variant='default']:hover { background-color: hsl(var(--primary) / 0.9); }

  [data-variant='secondary'] {
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
  }
  [data-variant='secondary']:hover { background-color: hsl(var(--secondary) / 0.8); }

  [data-variant='destructive'] {
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
  }
  [data-variant='destructive']:hover { background-color: hsl(var(--destructive) / 0.9); }

  [data-variant='outline'] {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    border-color: hsl(var(--border));
  }
  [data-variant='outline']:hover {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  [data-variant='ghost'] {
    background-color: transparent;
    color: hsl(var(--foreground));
  }
  [data-variant='ghost']:hover {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  [data-variant='link'] {
    background-color: transparent;
    border-color: transparent;
    color: hsl(var(--primary));
    text-underline-offset: 4px;
  }
  [data-variant='link']:hover { text-decoration: underline; }
`,t=class extends HTMLElement{static{this.observedAttributes=[`variant`]}get variant(){return this.getAttribute(`variant`)??`default`}set variant(e){this.setAttribute(`variant`,e)}connectedCallback(){this.shadowRoot||this.attachShadow({mode:`open`}),this.render()}attributeChangedCallback(){this.render()}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>${e}</style>
      <span part="root" class="root" data-variant="${this.variant}" tabindex="0"><slot></slot></span>
    `)}};customElements.get(`shadcx-badge`)||customElements.define(`shadcx-badge`,t);