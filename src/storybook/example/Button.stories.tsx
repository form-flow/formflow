import { action } from '@storybook/addon-actions';
import * as React from 'react';
import { userEvent, waitFor, within } from '@storybook/testing-library';

import { Button } from './Button';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    level: {
      control: 'radio',
      options: {'None': '', 'Primary': 'primary', 'Secondary': 'secondary'},
    },
    size: {
      control: 'select', 
      options: {'None': '', 'Small': 'small', 'Medium': 'medium', 'Large': 'large'},
    },
    boolean: {
      control: 'boolean',
    },
    number: {
      control: { type: 'number', min: 1, max: 100, step: 10 },
    },
    range: {
      control: { type: 'range', min: 1, max: 100, step: 10 },
    },
    object: {
      control: 'object',
    },
    file: {
      control: { type: 'file', accept: '.png' },
    },
    radio: {
      control: 'radio',
      options: [10, 20, 30],
    },
    check: {
      control: { type: 'check', options: [10, 20, 30] },
    },
    select: { 
      control: 'select', 
      options: [10, 20, 30, 40, 50] 
    },
    text: {
      control: 'text',
    },
    color: {
      control: { type: 'color', presetColors: ['#ff0000', '#00ff00', '#0000ff'] },
    },
    date: {
      control: 'date',
    },
  },
 };

const Template = (args: any) => {
  const {level, size} = args;

  const className = [level, size].filter(el => el).join(' ');
  return <>
    <Button className={className} onClick={action('button-click')}>
      {level || 'Button'}
    </Button>
    <hr/>
    <br/>boolean: {args.boolean}
    <br/>number: {args.number}
    <br/>range: {args.range}
    <br/>object: {JSON.stringify(args.object)}
    <br/>radio: {args.radio} 
    <br/>check: {args.check}
    <br/>select: {args.select}
    <br/>text: {args.text}
    <br/>color: {args.color}
    <br/>date: {new Date(args.date).toString()}
  </>;
};

export const Primary: any = Template.bind({});
// These are for Controls tab
Primary.args = {
  level: '',
  size: '',
  boolean: false,
  number: 10,
  range: 20,
  object: {hello: 'object'},
  radio: 10, 
  check: [10],
  select: 30,
  text: 'Primary',
  color: 'orange',
  date: new Date()
};

// These are for Interactions tab
Primary.play = async ({ args, canvasElement }: any) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button'));
};