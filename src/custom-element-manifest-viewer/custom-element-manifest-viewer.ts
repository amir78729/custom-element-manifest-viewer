import { html, LitElement, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { produce } from 'immer';
import type { CustomElement } from 'custom-elements-manifest/schema';
import {
  createElementFromHTML,
  fetchManifest,
  getAttributes,
  removeBackticks,
  removeQuotes,
  renderKnob,
} from './utils.js';
import { getHighlighter, Highlighter } from 'shiki';
import type { PropertyLike } from 'custom-elements-manifest';

export class CustomElementManifestViewer extends LitElement {
  @property() src: string = '';

  @property({ attribute: 'tag-name' }) tagName: string = '';

  @state() customElement?: CustomElement;

  @state() propertyKnobs?: Record<string, unknown> = {};

  @state() slotKnobs: Record<string, Record<string, string>> = {};

  @state() selectedSlots: Record<string, string> = {};

  @state() codeSample?: string = '';

  private highlighter?: Highlighter;

  @query('#component-preview') componentPreview?: HTMLElement;

  @query('#code') codeSection?: HTMLElement;

  private renderSlots() {
    let content = Object.keys(this.slotKnobs).length > 0 ? '\n' : '';
    Object.entries(this.slotKnobs)?.forEach(([key]) => {
      if (!this.selectedSlots[key]) {
        this.selectedSlots[key] = Object.values(this.slotKnobs[key])[0];
      }

      let slotContent = this.selectedSlots[key];

      if (key === 'default') {
        slotContent = slotContent.replace(` slot="${key}"`, '');
      }
      content += `  ${slotContent}\n`;
    });
    return content;
  }

  private updateCodeSample() {
    if (this.componentPreview && this.propertyKnobs) {
      this.codeSample = `<${this.customElement?.tagName} ${getAttributes(this.propertyKnobs)}>${this.renderSlots()}</${this.customElement?.tagName}>`;
      this.componentPreview.innerHTML = this.codeSample;
    }

    if (this.codeSample) {
      const highlightedCode = this.highlighter?.codeToHtml(this.codeSample, {
        lang: 'html',
        theme: 'github-dark-default',
      });
      if (this.codeSection) {
        if (highlightedCode) this.codeSection.innerHTML = highlightedCode;
        else this.codeSection.innerText = this.codeSample;
      }
    }
  }

  private setSlotKnobs() {
    const slot = this.querySelectorAll<HTMLTemplateElement>(`template`);

    this.slotKnobs = produce(this.slotKnobs, (draft) => {
      slot.forEach((s) => {
        if (s.getAttribute('datatype') === 'slot') {
          const slotContent = createElementFromHTML(s.innerHTML);
          let slotCategory = 'default';
          if (slotContent?.getAttribute('slot')) {
            //@ts-expect-error
            slotCategory = slotContent.getAttribute('slot');
          }
          const slotName = s.getAttribute('title');

          if (draft && slotName && slotCategory) {
            if (!draft[slotCategory]) {
              draft[slotCategory] = {};
            }
            draft[slotCategory][slotName] = s.innerHTML
              .trim()
              .replace(/\s(datatype|title|style)="[^"]*"/g, '');
          }
        }
      });
    });
  }

  private setDefaultValues() {
    const slot = this.querySelectorAll<HTMLTemplateElement>(`template`);

    this.propertyKnobs = produce(this.propertyKnobs, (draft) => {
      slot.forEach((s) => {
        if (s.getAttribute('datatype') === 'prop-default-value') {
          const slotName = s.getAttribute('title');
          if (slotName && draft) {
            draft[slotName] = s.innerHTML.trim();
          }
        }
      });
    });
    console.log('🐕 sag this.propertyKnobs', this.propertyKnobs); // TODO: REMOVE ME ⚠️
  }

  async connectedCallback() {
    super.connectedCallback();
    const manifest = await fetchManifest(this.src);
    if (manifest) {
      this.customElement = manifest.modules?.find(
        (module) =>
          (module.declarations?.[0] as CustomElement)?.tagName === this.tagName,
      )?.declarations?.[0] as CustomElement;

      this.propertyKnobs = produce(this.propertyKnobs, (draft) => {
        (this.customElement?.members as PropertyLike[])?.forEach(
          (member: PropertyLike) => {
            if (draft && member.default != null)
              draft[member.name] = ['true', 'false'].includes(member.default)
                ? member.default === 'true'
                : removeQuotes(member.default);
          },
        );
      });
    }

    this.highlighter = await getHighlighter({
      themes: ['github-dark-default'],
      langs: ['html'],
    });

    this.setDefaultValues();
    this.setSlotKnobs();
    this.updateCodeSample();
  }

  updated() {
    this.setSlotKnobs();
    this.updateCodeSample();
  }

  private handleChangePropertyKnob(key: string, value: unknown) {
    if (this)
      this.propertyKnobs = produce(this.propertyKnobs, (draft) => {
        this.customElement?.members?.forEach(() => {
          if (draft)
            draft[key] =
              typeof value === 'string' ? removeQuotes(value) : value;
        });
      });
  }

  private handleChangeSlotKnob(key: string, value: string) {
    if (this)
      this.selectedSlots = produce(this.selectedSlots, (draft) => {
        this.customElement?.slots?.forEach(() => {
          if (draft) draft[key] = this.slotKnobs?.[key]?.[value];
        });
      });
  }

  private renderPropertiesKnobs() {
    return this.customElement?.members
      ? html`
          <b part="title">Components Properties</b>
          ${this.customElement?.members?.map(
            (property: PropertyLike) =>
              html` <div>
                ${renderKnob({
                  name: removeBackticks(property?.name),
                  type: property?.type?.text
                    ? removeBackticks(property.type.text)
                    : 'string',
                  description: property?.description,
                  defaultValue:
                    (property?.default &&
                      removeBackticks(removeQuotes(property.default))) ||
                    this.propertyKnobs[property.name],
                  // @ts-expect-error
                  onChange: (e: Event) => {
                    const input = e.target as HTMLInputElement;
                    this.handleChangePropertyKnob(
                      property?.name,
                      property?.type?.text &&
                        removeBackticks(property?.type?.text) === 'boolean'
                        ? input.checked
                        : input.value,
                    );
                  },
                })}
              </div>`,
          )}
        `
      : nothing;
  }

  private renderSlotsKnobs() {
    if (Object.keys(this.slotKnobs).length > 0)
      return html`
        <b>Slots</b>
        ${Object.entries(this.slotKnobs).map(([slot]) => {
          const type = Object.keys(this.slotKnobs?.[slot] || {}).join('|');
          return renderKnob({
            name: slot,
            type: type,
            // @ts-expect-error
            onChange: (e: Event) => {
              const input = e.target as HTMLInputElement;
              const value = input.value;
              this.handleChangeSlotKnob(slot, value);
            },
            defaultValue: Object.keys(this.slotKnobs[slot])[0],
            // defaultValue: Object.values(this.slotKnobs[slot])[0],
          });
        })}
      `;
    return nothing;
  }

  render() {
    if (this.customElement)
      return html`
        <div part="container">
          <div id="component-preview" part="component-preview"></div>
          <div id="knobs" part="knobs">
            ${this.renderPropertiesKnobs()} ${this.renderSlotsKnobs()}
          </div>
          <pre id="code" part="code"></pre>
        </div>
        <slot hidden name="slots"></slot>
      `;
    return nothing;
  }
}
