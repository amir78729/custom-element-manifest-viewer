import { css } from 'lit';

export default css`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }

  .avatar {
    background-color: var(
      --cemv-avatar-background-color,
      var(--cemv-sys-color-surface-secondary)
    );
    border: 1px solid
      var(--cemv-avatar-border-color, var(--cemv-sys-color-border-primary));
    border-radius: var(--cemv-avatar-border-radius, var(--cemv-sys-radius-full));
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .avatar img,
  .avatar .placeholder,
  .avatar ::slotted(svg) {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  :host([size='xxSmall']) .avatar {
    width: var(--cemv-avatar-width-xxSmall, var(--cemv-sys-spacing-8));
    height: var(--cemv-avatar-height-, vxxSmallar(--cemv-sys-spacing-8));
  }

  :host([size='xSmall']) .avatar {
    width: var(--cemv-avatar-width-xSmall, var(--cemv-sys-spacing-9));
    height: var(--cemv-avatar-height-xSmall, var(--cemv-sys-spacing-9));
  }

  :host([size='small']) .avatar {
    width: var(--cemv-avatar-width-small, var(--cemv-sys-spacing-10));
    height: var(--cemv-avatar-height-small, var(--cemv-sys-spacing-10));
  }

  :host([size='medium']) .avatar {
    width: var(--cemv-avatar-width-medium, var(--cemv-sys-spacing-11));
    height: var(--cemv-avatar-height-medium, var(--cemv-sys-spacing-11));
  }

  // TODO: add to tokens
  :host([size='large']) .avatar {
    width: var(--cemv-avatar-width-large, 56px);
    height: var(--cemv-avatar-height-large, 56px);
  }

  // TODO: add to tokens
  :host([size='xLarge']) .avatar {
    width: var(--cemv-avatar-width-xLarge, 72px);
    height: var(--cemv-avatar-height-xLarge, 72px);
  }
`;
