import type { CustomElement, Package } from 'custom-elements-manifest';
import { html, nothing } from 'lit';

export function hasCustomElements(
  manifest?: Package | null,
): manifest is Package {
  return (
    !!manifest &&
    Array.isArray(manifest.modules) &&
    manifest.modules.some(
      (x) =>
        x.exports?.some((y) => y.kind === 'custom-element-definition') ||
        x.declarations?.some((z) => (z as CustomElement).customElement),
    )
  );
}

export async function fetchManifest(src: string): Promise<Package | null> {
  try {
    const file = await fetch(src);
    const manifest = (await file.json()) as Package;
    if (hasCustomElements(manifest)) {
      return manifest;
    }
    throw new Error(`No element definitions found at ${src}`);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const removeQuotes = (originalString: string): string =>
  originalString?.trim()?.replace(/'/g, '')?.replace(/"/g, '');

export function removeBackticks(input: string): string {
  return input?.replace(/`/g, '');
}

export function renderKnob({
  name,
  type,
  description,
  defaultValue,
  onChange,
}: {
  name: string;
  type: string;
  description?: string;
  defaultValue?: string;
  onChange?: (...args: unknown[]) => void;
}) {
  if (type === 'boolean') {
    return html`<input
      part="input"
      @change=${onChange}
      type="checkbox"><code part="label">${name}</code></input> `;
  }
  if (type === 'string') {
    return html`
      <code part="label">${name}</code>
      <input
        part="input"
        type="text"
        placeholder=${description}
        value=${defaultValue || ``}
        @change=${onChange}
      />
    `;
  }
  if (type === 'number') {
    return html`
      <code part="label">${removeBackticks(name)}</code>
      <input
        part="input"
        @change=${onChange}
        type="number"
        placeholder=${description}
        value=${defaultValue}
      />
    `;
  }
  if (type?.includes('|')) {
    const options = type?.split('|')?.map((option) => removeQuotes(option));

    return html`
      <code part="label">${removeBackticks(name)}</code>
      <select
        part="input"
        @change=${onChange}
        value=${defaultValue ? removeQuotes(defaultValue) : nothing}
      >
        ${options.map(
          (option) =>
            html` <option ?selected=${option === defaultValue} value=${option}>
              <code>${option}</code>
            </option>`,
        )}
      </select>
    `;
  }
}

export function getAttributes(properties: Record<string, unknown>): string {
  return Object.entries(properties)
    .filter(([_, value]) => value)
    .map(([key, value]) => {
      const _key = removeBackticks(key);
      const _value = typeof value === 'string' ? removeBackticks(value) : value;
      return `${_key}${value !== true ? `=${typeof _value === 'string' ? '"' : ''}${typeof _value === 'string' ? removeQuotes(_value) : _value}${typeof _value === 'string' ? '"' : ''}` : ''}`;
    })
    .join(' ')
    .replace(/"false"/g, 'false')
    .replace(/"true"/g, 'true')
    .replace(/'false'/g, 'false')
    .replace(/'true'/g, 'true');
}

export function createElementFromHTML(htmlString: string): HTMLElement | null {
  const template = document.createElement('template');
  htmlString = htmlString.trim(); // Trim the string to avoid issues with leading/trailing spaces
  template.innerHTML = htmlString;
  return template.content.firstElementChild as HTMLElement;
}