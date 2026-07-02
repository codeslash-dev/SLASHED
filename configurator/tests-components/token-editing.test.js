/**
 * Component tests for the two token-editing primitives every panel is built
 * from: SliderRow (numeric/raw-CSS knob) and TokenRow (generic bind → set →
 * reset row). Covers bind (initial render reflects value/override state),
 * override-set (interacting with the control calls onChange/onSet), and
 * reset (the reset affordance calls onReset).
 */
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import SliderRow from '../src/components/inputs/SliderRow.svelte';
import TokenRow from '../src/components/inputs/TokenRow.svelte';

describe('SliderRow', () => {
  const baseProps = {
    label: 'Base size',
    value: 16,
    min: 8,
    max: 32,
    step: 1,
    unit: 'px',
    overridden: false,
    onChange: () => {},
    onReset: () => {},
  };

  test('bind: renders the label and reflects the current value in the number field', () => {
    render(SliderRow, { props: baseProps });
    expect(screen.getByText('Base size')).toBeTruthy();
    expect(screen.getByRole('spinbutton')).toHaveValue(16);
    expect(screen.getByRole('slider')).toHaveValue('16');
  });

  test('override-set: dragging the range input fires onChange with a clamped number', async () => {
    const onChange = vi.fn();
    render(SliderRow, { props: { ...baseProps, onChange } });
    const range = screen.getByRole('slider');
    await fireEvent.input(range, { target: { value: '24' } });
    expect(onChange).toHaveBeenCalledWith(24);
  });

  test('override-set: editing the number field fires onChange, clamped to [min, max]', async () => {
    const onChange = vi.fn();
    render(SliderRow, { props: { ...baseProps, onChange } });
    const spinbutton = screen.getByRole('spinbutton');
    await fireEvent.change(spinbutton, { target: { value: '999' } });
    expect(onChange).toHaveBeenCalledWith(32); // clamped to max
  });

  test('reset: reset affordance is absent when not overridden', () => {
    render(SliderRow, { props: baseProps });
    expect(screen.queryByText('reset')).toBeNull();
  });

  test('reset: clicking reset fires onReset when overridden', async () => {
    const onReset = vi.fn();
    render(SliderRow, { props: { ...baseProps, overridden: true, onReset } });
    await fireEvent.click(screen.getByText('reset'));
    expect(onReset).toHaveBeenCalledOnce();
  });

  test('raw mode: typing a raw CSS value fires onRawSet', async () => {
    const onRawSet = vi.fn();
    render(SliderRow, {
      props: {
        ...baseProps,
        rawDefault: '1rem',
        currentRaw: 'var(--sf-text-base)', // matches the raw-CSS-expression auto-detect
        onRawSet,
      },
    });
    const rawInput = screen.getByPlaceholderText('1rem');
    await fireEvent.input(rawInput, { target: { value: 'clamp(1rem, 2vw, 2rem)' } });
    expect(onRawSet).toHaveBeenCalledWith('clamp(1rem, 2vw, 2rem)');
  });

  test('raw mode: clearing the raw field and blurring fires onReset', async () => {
    const onReset = vi.fn();
    render(SliderRow, {
      props: {
        ...baseProps,
        overridden: true,
        rawDefault: '1rem',
        currentRaw: 'var(--sf-text-base)',
        onRawSet: () => {},
        onReset,
      },
    });
    const rawInput = screen.getByPlaceholderText('1rem');
    await fireEvent.input(rawInput, { target: { value: '' } });
    await fireEvent.blur(rawInput);
    expect(onReset).toHaveBeenCalledOnce();
  });
});

describe('TokenRow', () => {
  const token = {
    name: '--sf-space-m',
    value: '1rem',
    tier: 'public',
    role: 'knob',
  };

  test('bind: renders the short name and the default value when not overridden', () => {
    render(TokenRow, { props: { token, onSet: () => {}, onReset: () => {} } });
    expect(screen.getByText('space-m')).toBeTruthy();
    expect(screen.getByText('1rem')).toBeTruthy();
    expect(screen.queryByText('✕')).toBeNull();
  });

  test('bind: renders the override value and reset affordance when overridden', () => {
    render(TokenRow, { props: { token, overrideValue: '2rem', onSet: () => {}, onReset: () => {} } });
    expect(screen.getByText('2rem')).toBeTruthy();
    expect(screen.getByText('✕')).toBeTruthy();
  });

  test('override-set: editing the value and blurring with a new value calls onSet', async () => {
    const onSet = vi.fn();
    const onReset = vi.fn();
    render(TokenRow, { props: { token, onSet, onReset } });

    await fireEvent.click(screen.getByTitle('1rem'));
    const input = screen.getByDisplayValue('1rem');
    await fireEvent.input(input, { target: { value: '1.5rem' } });
    await fireEvent.blur(input);

    expect(onSet).toHaveBeenCalledWith('1.5rem');
    expect(onReset).not.toHaveBeenCalled();
  });

  test('reset: blurring with the value unchanged from the default calls onReset, not onSet', async () => {
    const onSet = vi.fn();
    const onReset = vi.fn();
    render(TokenRow, { props: { token, overrideValue: '2rem', onSet, onReset } });

    await fireEvent.click(screen.getByTitle('2rem'));
    const input = screen.getByDisplayValue('2rem');
    await fireEvent.input(input, { target: { value: '1rem' } }); // back to token.value
    await fireEvent.blur(input);

    expect(onReset).toHaveBeenCalledOnce();
    expect(onSet).not.toHaveBeenCalled();
  });

  test('reset: clicking the ✕ button calls onReset directly', async () => {
    const onReset = vi.fn();
    render(TokenRow, { props: { token, overrideValue: '2rem', onSet: () => {}, onReset } });
    await fireEvent.click(screen.getByText('✕'));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
