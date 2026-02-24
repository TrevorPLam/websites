/**
 * @file packages/ui/src/components/Slider.stories.tsx
 * @summary Storybook stories for Slider component demonstrating various slider configurations.
 * @description Interactive stories showcasing slider sizes, ranges, and form integration.
 * @security None - UI component stories only.
 * @adr none
 * @requirements none
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
    value: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    value: [50],
  },
};

export const WithStep: Story = {
  args: {
    min: 0,
    max: 10,
    step: 1,
    value: [5],
  },
};

export const WithRange: Story = {
  args: {
    min: 100,
    max: 1000,
    step: 50,
    value: [500],
  },
};

export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    value: [30],
    disabled: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState([50]);
    return (
      <div className="w-64 space-y-4">
        <Slider
          min={0}
          max={100}
          value={value}
          onValueChange={setValue}
        />
        <p className="text-center text-sm font-medium">Value: {value[0]}</p>
      </div>
    );
  },
};

export const WithLabels: Story = {
  render: () => {
    const [price, setPrice] = useState([250]);
    return (
      <div className="w-64 space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>$0</span>
          <span>$500</span>
        </div>
        <Slider
          min={0}
          max={500}
          step={10}
          value={price}
          onValueChange={setPrice}
        />
        <p className="text-center font-medium">${price[0]}</p>
      </div>
    );
  },
};

export const VolumeControl: Story = {
  render: () => {
    const [volume, setVolume] = useState([70]);
    return (
      <div className="w-64 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-lg">🔇</span>
          <Slider
            min={0}
            max={100}
            value={volume}
            onValueChange={setVolume}
          />
          <span className="text-lg">🔊</span>
        </div>
        <p className="text-center text-sm">Volume: {volume[0]}%</p>
      </div>
    );
  },
};

export const MultipleSliders: Story = {
  render: () => {
    const [brightness, setBrightness] = useState([50]);
    const [contrast, setContrast] = useState([50]);
    const [saturation, setSaturation] = useState([50]);

    return (
      <div className="w-80 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Brightness</label>
          <Slider
            min={0}
            max={100}
            value={brightness}
            onValueChange={setBrightness}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Contrast</label>
          <Slider
            min={0}
            max={100}
            value={contrast}
            onValueChange={setContrast}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Saturation</label>
          <Slider
            min={0}
            max={100}
            value={saturation}
            onValueChange={setSaturation}
          />
        </div>
      </div>
    );
  },
};

export const PriceRange: Story = {
  render: () => {
    const [minPrice, setMinPrice] = useState([100]);
    const [maxPrice, setMaxPrice] = useState([900]);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-lg font-semibold">Price Range</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum: ${minPrice[0]}</label>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={minPrice}
            onValueChange={setMinPrice}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Maximum: ${maxPrice[0]}</label>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={maxPrice}
            onValueChange={setMaxPrice}
          />
        </div>
        <p className="text-sm text-gray-600">
          Range: ${minPrice[0]} - ${maxPrice[0]}
        </p>
      </div>
    );
  },
};
