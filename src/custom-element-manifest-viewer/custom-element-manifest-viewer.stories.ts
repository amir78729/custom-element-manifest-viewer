import { html, TemplateResult } from 'lit';
import './index.js';
import { Meta } from '@storybook/web-components';

import "@tapsioss/web-components/dist/avatar";
import "@tapsioss/web-components/dist/badge";
import "@tapsioss/web-components/dist/badge-wrapper";
import "@tapsioss/web-components/dist/banner";
import "@tapsioss/web-components/dist/bottom-navigation";
import "@tapsioss/web-components/dist/bottom-navigation-item";
import "@tapsioss/web-components/dist/button";
import "@tapsioss/web-components/dist/checkbox";
import "@tapsioss/web-components/dist/divider";
import "@tapsioss/web-components/dist/icon-button";
import "@tapsioss/web-components/dist/input";
import "@tapsioss/web-components/dist/modal";
import "@tapsioss/web-components/dist/pinwheel";
import "@tapsioss/web-components/dist/pinwheel-group";
import "@tapsioss/web-components/dist/progress-indicator";
import "@tapsioss/web-components/dist/radio";
import "@tapsioss/web-components/dist/radio-group";
import "@tapsioss/web-components/dist/row";
import "@tapsioss/web-components/dist/segmented-button";
import "@tapsioss/web-components/dist/segmented-button-group";
import "@tapsioss/web-components/dist/skeleton";
import "@tapsioss/web-components/dist/spinner";
import "@tapsioss/web-components/dist/step-indicator";
import "@tapsioss/web-components/dist/stepper";
import "@tapsioss/web-components/dist/toast";
import "@tapsioss/web-components/dist/tooltip";
import "@tapsioss/web-components/dist/button";
import "@tapsioss/web-components/dist/styles/theme.css";

export default {
  title: 'custom-element-manifest-viewer',
  component: 'custom-element-manifest-viewer',
  argTypes: {
    src: {
      description: 'the source of the custom element manifest',
    },
    'tagName': {
      description: 'target tag name',
      control: { type: 'select' },
      options: [
        "tap-avatar",
        "tap-badge",
        "tap-badge-wrapper",
        "tap-banner",
        "tap-base-button",
        "tap-bottom-navigation",
        "tap-bottom-navigation-item",
        "tap-base-button",
        "tap-button",
        "tap-base-button",
        "tap-checkbox",
        "tap-divider",
        "tap-icon-button",
        "tap-input",
        "tap-modal",
        "tap-notice",
        "tap-pinwheel",
        "tap-pinwheel-group",
        "tap-progress-indicator",
        "tap-radio",
        "tap-radio-group",
        "tap-row",
        "tap-segmented-button",
        "tap-segmented-button-group",
        "tap-skeleton",
        "tap-spinner",
        "tap-step-indicator",
        "tap-stepper",
        "tap-text-field",
        "tap-textarea",
        "tap-toast",
        "tap-tooltip",
        "tap-button",
      ]
    },
  },
} as Meta;

interface Story<T> {
  (args: T): TemplateResult;

  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  src: string;
  tagName: string;
}

const Template: Story<ArgTypes> = ({ tagName}) => html`
  <custom-element-manifest-viewer tag-name=${tagName} src="../../dist/custom-elements.json">
  </custom-element-manifest-viewer>



`;



// <div>
//   ${[
//     "tap-avatar",
//     "tap-badge",
//     "tap-badge-wrapper",
//     "tap-banner",
//     "tap-base-button",
//     "tap-bottom-navigation",
//     "tap-bottom-navigation-item",
//     "tap-base-button",
//     "tap-button",
//     "tap-base-button",
//     "tap-checkbox",
//     "tap-divider",
//     "tap-icon-button",
//     "tap-input",
//     "tap-modal",
//     "tap-notice",
//     "tap-pinwheel",
//     "tap-pinwheel-group",
//     "tap-progress-indicator",
//     "tap-radio",
//     "tap-radio-group",
//     "tap-row",
//     "tap-segmented-button",
//     "tap-segmented-button-group",
//     "tap-skeleton",
//     "tap-spinner",
//     "tap-step-indicator",
//     "tap-stepper",
//     "tap-text-field",
//     "tap-textarea",
//     "tap-toast",
//     "tap-tooltip",
//     "tap-button",
//   ].map(component => html`<custom-element-manifest-viewer tag-name=${componentZ} src="../../dist/custom-elements.json"></custom-element-manifest-viewer>`)}
//   </div>


export const Avatar = Template.bind({});

Avatar.args = {
  src: 'https://picsum.photos/100',
  tagName: 'tap-avatar'
};
