var e=`
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  blockquote, dl, dd, hr, figure, p, pre { margin: 0; }
  ol, ul { list-style: none; margin: 0; padding: 0; }
  a { color: inherit; text-decoration: inherit; }
  [hidden] { display: none !important; }
`,t=`
  ${e}

  :host {
    --shadcx-card-padding: 1.5rem;
    --shadcx-card-gap: 1.5rem;
    display: block;
  }

  :host([size='sm']) {
    --shadcx-card-padding: 1rem;
    --shadcx-card-gap: 1rem;
  }

  .root {
    display: flex;
    flex-direction: column;
    gap: var(--shadcx-card-gap);
    border-radius: calc(var(--radius) + 2px);
    border: 1px solid hsl(var(--border));
    background-color: hsl(var(--card));
    color: hsl(var(--card-foreground));
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .root ::slotted(img),
  .root ::slotted([data-card-image]) {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
`,n=`
  ${e}

  :host { display: block; }

  .root {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 0.375rem 1rem;
    padding: var(--shadcx-card-padding) var(--shadcx-card-padding) 0;
  }

  .root ::slotted(shadcx-card-title),
  .root ::slotted(shadcx-card-description) {
    grid-column: 1;
  }

  .root ::slotted(shadcx-card-action) {
    grid-column: 2;
    grid-row: 1 / span 2;
    justify-self: end;
    align-self: start;
  }
`,r=`
  ${e}

  :host { display: block; }

  .root {
    color: hsl(var(--card-foreground));
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.01em;
  }
`,i=`
  ${e}

  :host { display: block; }

  .root {
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
    line-height: 1.45;
  }
`,a=`
  ${e}

  :host { display: block; }

  .root {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`,o=`
  ${e}

  :host { display: block; }

  .root {
    padding-inline: var(--shadcx-card-padding);
    color: hsl(var(--card-foreground));
    font-size: 0.875rem;
    line-height: 1.5;
  }
`,s=`
  ${e}

  :host { display: block; }

  .root {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 var(--shadcx-card-padding) var(--shadcx-card-padding);
    color: hsl(var(--card-foreground));
    font-size: 0.875rem;
    line-height: 1.5;
  }
`,c=class extends HTMLElement{constructor(...e){super(...e),this.partName=`root`,this.rootClassName=`root`}connectedCallback(){this.shadowRoot||this.attachShadow({mode:`open`}),this.render()}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>${this.styles}</style>
      <div part="${this.partName}" class="${this.rootClassName}"><slot></slot></div>
    `)}},l=[[`shadcx-card`,class extends HTMLElement{static{this.observedAttributes=[`size`]}get size(){return this.getAttribute(`size`)??`default`}set size(e){this.setAttribute(`size`,e)}connectedCallback(){this.shadowRoot||this.attachShadow({mode:`open`}),this.render()}attributeChangedCallback(){this.render()}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>${t}</style>
      <div part="root" class="root" data-size="${this.size}"><slot></slot></div>
    `)}}],[`shadcx-card-header`,class extends c{constructor(...e){super(...e),this.styles=n}}],[`shadcx-card-title`,class extends c{constructor(...e){super(...e),this.styles=r}}],[`shadcx-card-description`,class extends c{constructor(...e){super(...e),this.styles=i}}],[`shadcx-card-action`,class extends c{constructor(...e){super(...e),this.styles=a}}],[`shadcx-card-content`,class extends c{constructor(...e){super(...e),this.styles=o}}],[`shadcx-card-footer`,class extends c{constructor(...e){super(...e),this.styles=s}}]];for(let[e,t]of l)customElements.get(e)||customElements.define(e,t);