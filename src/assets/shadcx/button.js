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
  :host([disabled]) { pointer-events: none; }

  .root {
    text-transform: none;
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: calc(var(--radius) - 2px);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    outline: none;
    transition: color 0.15s, background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
  }

  .root:disabled { opacity: 0.5; pointer-events: none; }
  .root:focus-visible { box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring)); }
  .root ::slotted(svg) { pointer-events: none; width: 1rem; height: 1rem; flex-shrink: 0; }

  [data-size='default'] { height: 2.25rem; padding-inline: 1rem; }
  [data-size='xs'] { height: 1.75rem; padding-inline: 0.5rem; font-size: 0.8125rem; }
  [data-size='sm'] { height: 2rem; padding-inline: 0.75rem; font-size: 0.8125rem; }
  [data-size='lg'] { height: 2.5rem; padding-inline: 1.5rem; }
  [data-size='icon'] { height: 2.25rem; width: 2.25rem; padding: 0; }
  [data-size='icon-xs'] { height: 1.75rem; width: 1.75rem; padding: 0; }
  [data-size='icon-sm'] { height: 2rem; width: 2rem; padding: 0; }
  [data-size='icon-lg'] { height: 2.5rem; width: 2.5rem; padding: 0; }

  [data-variant='default'] {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  }
  [data-variant='default']:hover { background-color: hsl(var(--primary) / 0.9); }

  [data-variant='destructive'] {
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  [data-variant='destructive']:hover { background-color: hsl(var(--destructive) / 0.9); }

  [data-variant='outline'] {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    border-color: hsl(var(--input));
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  [data-variant='outline']:hover { background-color: hsl(var(--accent)); color: hsl(var(--accent-foreground)); }

  [data-variant='secondary'] {
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  [data-variant='secondary']:hover { background-color: hsl(var(--secondary) / 0.8); }

  [data-variant='ghost'] { background-color: transparent; color: hsl(var(--foreground)); }
  [data-variant='ghost']:hover { background-color: hsl(var(--accent)); color: hsl(var(--accent-foreground)); }

  [data-variant='link'] { background-color: transparent; color: hsl(var(--primary)); text-underline-offset: 4px; }
  [data-variant='link']:hover { text-decoration: underline; }

  [aria-invalid='true'] { border-color: hsl(var(--destructive)); box-shadow: 0 0 0 1px hsl(var(--destructive) / 0.2); }
`,t=class extends HTMLElement{static{this.observedAttributes=[`variant`,`size`,`disabled`]}get variant(){return this.getAttribute(`variant`)??`default`}set variant(e){this.setAttribute(`variant`,e)}get size(){return this.getAttribute(`size`)??`default`}set size(e){this.setAttribute(`size`,e)}get disabled(){return this.hasAttribute(`disabled`)}set disabled(e){this.toggleAttribute(`disabled`,e)}connectedCallback(){this.shadowRoot||this.attachShadow({mode:`open`}),this.render()}attributeChangedCallback(){this.render()}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>${e}</style>
      <button part="root" class="root" data-variant="${this.variant}" data-size="${this.size}" ${this.disabled?`disabled`:``}>
        <slot></slot>
      </button>
    `)}};customElements.get(`shadcx-button`)||customElements.define(`shadcx-button`,t);