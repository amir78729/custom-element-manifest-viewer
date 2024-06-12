import { html, LitElement, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";

import { produce } from "immer";

import type { CustomElement } from "custom-elements-manifest/schema";
import { fetchManifest } from "./utils";

const removeQuotes = (string: string) =>
  string?.trim()?.replaceAll("'", "")?.replaceAll('"', "");

const getAttributes = (properties: Record<string, unknown>): string => {
  return (
    Object.entries(properties)
      // .filter(([key, value]) => !["false"].includes(value))
      .filter(([key, value]) => value)
      .map(
        ([key, value]) =>
          `${key}${value !== true ? `=${typeof value === "string" ? '"' : ""}${typeof value === "string" ? removeQuotes(value) : value}${typeof value === "string" ? '"' : ""}` : ""}`,
      )
      .join(" ")
      .replaceAll(`"false"`, "false")
      .replaceAll(`"true"`, "true")
      .replaceAll(`'false'`, "false")
      .replaceAll(`'true'`, "true")
  );
};

export class CustomElementManifestViewer extends LitElement {
  @property() src: string = "";

  @property({ attribute: "tag-name" }) tagName: string = "";

  @state() customElement?: CustomElement;

  @state() propertyKnobs?: Record<string, unknown> = {};

  @state() cssPropertiesKnobs?: Record<string, unknown> = {};

  @state() codeSample?: string = "";

  @query("#component-preview") componentPreview?: HTMLElement;

  updateCodeSample() {
    if (this.componentPreview && this.propertyKnobs) {
      this.codeSample = `<${this.customElement?.tagName} ${getAttributes(this.propertyKnobs)}>test</${this.customElement?.tagName}>`;
      this.componentPreview.innerHTML = this.codeSample;
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    const manifest = await fetchManifest(this.src);
    if (manifest) {
      this.customElement = manifest.modules?.find(
        (module) => module.declarations?.[0]?.tagName === this.tagName,
      )?.declarations?.[0] as CustomElement;
    }
    this.propertyKnobs = produce(this.propertyKnobs, (draft) => {
      this.customElement?.members?.forEach((member) => {
        draft[member.name] = ["true", "false"].includes(member.default)
          ? member.default === "true"
          : removeQuotes(member.default);
      });
    });

    this.cssPropertiesKnobs = produce(this.cssPropertiesKnobs, (draft) => {
      this.customElement?.cssProperties?.forEach((member) => {
        draft[member.name] = member.default;
      });
    });
  }

  updated() {
    this.updateCodeSample();
  }

  handleChangePropertyKnob(key: string, value: unknown) {
    if (this)
      this.propertyKnobs = produce(this.propertyKnobs, (draft) => {
        this.customElement?.members?.forEach((member) => {
          draft[key] = typeof value === "string" ? removeQuotes(value) : value;
        });
      });
  }

  handleChangeCssPropertyKnob(key: string, value: unknown) {
    if (this)
      this.cssPropertiesKnobs = produce(this.cssPropertiesKnobs, (draft) => {
        this.customElement?.cssProperties?.forEach((_) => {
          draft[key] = value;
        });
      });
  }

  renderKnob({
    name,
    type,
    description,
    defaultValue,
    onChange,
  }: {
    name?: string;
    type?: string;
    description?: string;
    defaultValue?: string;
    onChange: (name: string, value: string | boolean) => void;
  }) {
    if (type === "boolean") {
      return html`<input
        @change=${(e) => this.handleChangePropertyKnob(name, e.target.checked)}
        type="checkbox"><code>${name}</code></input> `;
    }
    if (type === "string") {
      return html`
        <code>${name}</code>
        <input
          type="text"
          placeholder=${description}
          value=${defaultValue || ``}
          @change=${(e) => {
            this.handleChangePropertyKnob(name, e.target.value);
          }}
        />
      `;
    }
    if (type === "number") {
      return html`
        <code>${name}</code>
        <input
          @change=${(e) => this.handleChangePropertyKnob(name, e.target.value)}
          type="number"
          placeholder=${description}
          value=${defaultValue}
        />
      `;
    }
    if (type?.includes("|")) {
      const options = type?.split("|")?.map((option) => removeQuotes(option));
      return html`
        <code>${name}</code>
        <select
          @change=${(e) => this.handleChangePropertyKnob(name, e.target.value)}
          value=${removeQuotes(defaultValue)}
        >
          ${options.map(
            (option) =>
              html` <option value=${option}><code>${option}</code></option>`,
          )}
        </select>
      `;
    }
  }

  private renderProperties() {
    return this.customElement?.members
      ? html`
          <h2>Components Properties</h2>
          ${this.customElement?.members?.map(
            (property) =>
              html` <div>
                ${this.renderKnob({
                  name: property?.name,
                  type: property?.type?.text,
                  description: property?.description,
                  defaultValue: property?.default,
                  onChange: this.handleChangePropertyKnob,
                })}
              </div>`,
          )}
        `
      : nothing;
  }

  private renderCssProps() {
    return this.customElement?.members
      ? html`
          <h2>CSS Properties</h2>
          ${this.customElement?.cssProperties?.map(
            (cssProperty) =>
              html` <div>
                ${this.renderKnob({
                  name: cssProperty?.name,
                  description: cssProperty?.summary,
                  type: "string",
                  defaultValue: cssProperty.default,
                  onChange: this.handleChangeCssPropertyKnob,
                })}
              </div>`,
          )}
        `
      : nothing;
  }

  render() {
    if (this.customElement)
      return html`
        <h1>${this.customElement.tagName}</h1>
        <pre>${this.codeSample}</pre>
        <pre>propertyKnobs ${JSON.stringify(this.propertyKnobs, null, 4)}</pre>
        <pre>
cssPropertiesKnobs ${JSON.stringify(this.cssPropertiesKnobs, null, 4)}</pre
        >
        <div id="component-preview"></div>
        ${this.renderProperties()} ${this.renderCssProps()}
      `;
    return nothing;
  }
}
