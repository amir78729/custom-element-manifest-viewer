import { customElement } from 'lit/decorators.js';
import { CustomElementManifestViewer } from './custom-element-manifest-viewer.js';
import styles from './custom-element-manifest-viewer.style.js';

/**
 * ### Example
 *
 * ##### Simple
 *
 * ```html
 * <tap-avatar image="avatar.png"></tap-avatar>
 * ```
 *
 * ##### Placeholder
 *
 * ```html
 * <tap-avatar image="avatar.png">AV</tap-avatar>
 * ```
 *
 * ##### Size
 *
 * ```html
 * <tap-avatar size="small" image="avatar.png">AV</tap-avatar>
 * <tap-avatar size="xSmall" image="avatar.png">AV</tap-avatar>
 * <tap-avatar size="large" image="avatar.png">AV</tap-avatar>
 * ```
 *
 * @summary Display user profile image, initials or fallback icon
 *
 * @slot - The default slot to use when image is not present.
 *
 * @prop {string} [label=''] - A label to use to describe the avatar to assistive devices.
 * @prop {string} [image=''] - The image source to use for the avatar.
 * @prop {'eager' | 'lazy'} [loading='eager'] -  Indicates how the browser should load the image.
 * @prop {'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'} [size='medium'] - The size of the avatar.
 *
 * @csspart [avatar] - The container that wraps the avatar component.
 * @csspart [placeholder] - The container that wraps the avatar's placeholder.
 * @csspart [image] - The avatar image. Only shown when the image is present.
 *
 * @cssprop [--cemnama-avatar-background-color=--cemnama-sys-color-surface-secondary]
 * @cssprop [--cemnama-avatar-border-color=--cemnama-sys-color-border-primary]
 * @cssprop [--cemnama-avatar-border-radius=--cemnama-sys-radius-full]
 *
 * @cssprop [--cemnama-avatar-width-xxSmall=--cemnama-sys-spacing-8]
 * @cssprop [--cemnama-avatar-height-xxSmall=--cemnama-sys-spacing-8]
 *
 * @cssprop [--cemnama-avatar-width-xSmall=--cemnama-sys-spacing-9]
 * @cssprop [--cemnama-avatar-height-xSmall=--cemnama-sys-spacing-9]
 *
 * @cssprop [--cemnama-avatar-width-small=--cemnama-sys-spacing-10]
 * @cssprop [--cemnama-avatar-height-small=--cemnama-sys-spacing-10]
 *
 * @cssprop [--cemnama-avatar-width-medium=--cemnama-sys-spacing-11]
 * @cssprop [--cemnama-avatar-height-medium=--cemnama-sys-spacing-11]
 *
 * @cssprop [--cemnama-avatar-width-large=56px]
 * @cssprop [--cemnama-avatar-height-large=56px]
 *
 * @cssprop [--cemnama-avatar-width-xLarge=72px]
 * @cssprop [--cemnama-avatar-height-xLarge=72px]
 */
@customElement('custom-element-manifest-viewer')
export class CustomElementManifestViewerComponent extends CustomElementManifestViewer {
  static readonly styles = [styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-element-manifest-viewer': CustomElementManifestViewerComponent;
  }
}
