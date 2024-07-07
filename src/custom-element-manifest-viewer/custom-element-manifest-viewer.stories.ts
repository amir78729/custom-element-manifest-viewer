import { html, TemplateResult } from "lit";
import "./index.js";
import { Meta } from "@storybook/web-components";

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
import { themes } from "./constants";
import type { Theme } from "./types";

const isDev = process.env.NODE_ENV === "development";

const manifestSource = isDev ? "../sample-custom-elements.json" : "../custom-element-manifest-viewer/sample-custom-elements.json";
const configSource = isDev ? "../custom-elements-config.json" : "../custom-element-manifest-viewer/custom-elements-config.json";

export default {
  title: "custom-element-manifest-viewer",
  component: "custom-element-manifest-viewer",
  argTypes: {
    "tagName": {
      description: "target tag name",
      control: { type: "select" },
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
        "tap-button"
      ]
    },
    "theme": {
      description: "code preview theme",
      control: { type: "select" },
      options: themes
    }
  }
} as Meta;

interface Story<T> {
  (args: T): TemplateResult;

  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  manifest: string;
  tagName: string;
  theme: Theme;
}

const Template: Story<ArgTypes> = ({ tagName, theme }) => html`
  <custom-element-manifest-viewer config=${configSource} tag-name=${tagName} .theme=${theme} manifest=${manifestSource}>
  </custom-element-manifest-viewer>
`;

export const Default = Template.bind({});

Default.args = {
  tagName: "tap-avatar"
};

// ---

const Slots: Story<ArgTypes> = ({ tagName, theme }) => html`
  <custom-element-manifest-viewer config=${configSource} tag-name='tap-row' .theme=${theme} manifest=${manifestSource}>
  </custom-element-manifest-viewer>

  <hr>

  <custom-element-manifest-viewer config=${configSource} tag-name='tap-button' manifest=${manifestSource}>
    <template datatype="slot" title="default">
      Click!
    </template>
  </custom-element-manifest-viewer>
`;

export const CustomSlots = Slots.bind({});

CustomSlots.args = {
  tagName: "tap-avatar"
};

// ---

const DefaultTemplate: Story<ArgTypes> = ({ tagName, theme }) => html`
  <custom-element-manifest-viewer config=${configSource}   tag-name='tap-avatar' .theme=${theme} manifest=${manifestSource}>
    <template datatype="prop-default-value" title="image">
      https://picsum.photos/200
    </template>
  </custom-element-manifest-viewer>
`;

export const DefaultValue = DefaultTemplate.bind({});

DefaultValue.args = {
  tagName: "tap-avatar"
};

// ---

const Theme: Story<ArgTypes> = ({ tagName, theme }) => html`
  <style>
    custom-element-manifest-viewer::part(container) {
      display: flex;
      flex-wrap: wrap;
      font-family: Arial, sans;
      border-radius: 24px;

      border: 16px solid black;
    }

    custom-element-manifest-viewer::part(label) {
      border-radius: 4px;
      padding: 3px 6px;
      transition: color 0.25s, background-color 0.5s;
      font-size: 0.875em;
    }

    custom-element-manifest-viewer::part(input) {
      transition: all 0.3s;
      border: 1px solid #e2e2e3;
      padding: 8px;
      background: transparent;
      border-radius: 8px;
      color: white
    }

    custom-element-manifest-viewer::part(input):hover, custom-element-manifest-viewer::part(input):focus {
      border: 1px solid #ff5722;
    }

    custom-element-manifest-viewer::part(component-preview) {
      background-color: #fff;
      background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
      color: black;
      padding: 16px;
      border-radius: 8px 0 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60%;
      direction: rtl;
    }

    custom-element-manifest-viewer::part(knobs) {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 24px;
      border-radius: 0 8px 0 0;
      position: relative;
      width: 40%;
      background: #202127;
      color: white
    }

    custom-element-manifest-viewer::part(code) {
      position: relative;
      z-index: 1;
      margin: 0;
      padding: 20px 24px;
      background: #0d1117;
      overflow-x: auto;
      font-size: 0.875em;
      width: 100%;
      border-radius: 0 0 8px 8px;
    }
  </style>
  <custom-element-manifest-viewer config=${configSource}   tag-name=${tagName} .theme=${theme} manifest=${manifestSource}>
  </custom-element-manifest-viewer>
`;

export const UsingTheme = Theme.bind({});

UsingTheme.args = {
  tagName: "tap-avatar",
  theme: 'github-dark'
};