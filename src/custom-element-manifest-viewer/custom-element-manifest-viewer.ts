import { html, LitElement, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { produce } from 'immer';
import type { CustomElement } from 'custom-elements-manifest/schema';
import {
  fetchConfig,
  fetchManifest,
  getAttributes,
  removeBackticks,
  removeQuotes,
  renderKnob,
} from './utils.js';
import { getHighlighter, Highlighter } from 'shiki';
import type { PropertyLike } from 'custom-elements-manifest';
import { Config, Theme } from './types';

export class CustomElementManifestViewer extends LitElement {
  @property({ reflect: true }) theme: Theme = 'github-dark-default';

  @property() manifest: string = '';

  @property() config: string = '';

  @property({ attribute: 'tag-name' }) tagName: string = '';

  @state() customElement?: CustomElement;

  @state() customElementConfig?: Config;

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

      const preview = document.createElement(this.tagName);

      Object.entries(this.propertyKnobs).forEach(([key, value]) => {
        // @ts-expect-error
        preview.setAttribute(key, value);
        // @ts-expect-error
        preview[key] = value;
      });

      preview.innerHTML = this.renderSlots();

      this.componentPreview.innerHTML = '';
      this.componentPreview.appendChild(preview);
    }

    if (this.codeSample) {
      const highlightedCode = this.highlighter?.codeToHtml(this.codeSample, {
        lang: 'html',
        theme: this.theme,
      });
      if (this.codeSection) {
        if (highlightedCode) this.codeSection.innerHTML = highlightedCode;
        else this.codeSection.innerText = this.codeSample;
      }
    }
  }

  private setSlotKnobs() {
    if (this.customElementConfig?.slotKnobs) {
      this.slotKnobs = produce(this.slotKnobs, (draft) => {
        Object.entries(this.customElementConfig?.slotKnobs || {}).forEach(
          ([key, value]) => {
            Object.entries(value).forEach(([slotName, slotContent]) => {
              if (!draft[key]) {
                draft[key] = {};
              }
              if (draft) {
                draft[key][slotName] = slotContent;
              }
            });
          },
        );
      });
    }
  }

  private setDefaultValues() {
    if (this.customElementConfig?.propertyDefaultValues) {
      this.propertyKnobs = produce(this.propertyKnobs, (draft) => {
        Object.entries(
          this.customElementConfig?.propertyDefaultValues || {},
        ).forEach(([key, value]) => {
          if (draft) {
            draft[key] = value;
          }
        });
      });
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    const manifest = await fetchManifest(this.manifest);
    this.customElementConfig = (await fetchConfig(this.config))?.[this.tagName];

    if (manifest) {
      this.customElement = manifest.modules?.find(
        (module) =>
          (module.declarations?.[0] as CustomElement)?.tagName === this.tagName,
      )?.declarations?.[0] as CustomElement;

      this.propertyKnobs = produce(this.propertyKnobs, (draft) => {
        (this.customElement?.members as PropertyLike[])?.forEach(
          (member: PropertyLike) => {
            if (draft && member?.default != null)
              draft[member.name] = ['true', 'false'].includes(member.default)
                ? member.default === 'true'
                : removeQuotes(member.default);
          },
        );
      });
    }

    this.setDefaultValues();
    this.setSlotKnobs();
    this.highlighter = await getHighlighter({
      themes: [this.theme],
      langs: ['html'],
    });
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
                  // @ts-expect-error
                  defaultValue:
                    (property?.default &&
                      removeBackticks(removeQuotes(property.default))) ||
                    this.propertyKnobs?.[property.name],
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
        ${Object.values(this.slotKnobs).some(
          (knob) => Object.keys(knob)?.length > 1,
        )
          ? html`<b>Slots</b>`
          : nothing}
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
