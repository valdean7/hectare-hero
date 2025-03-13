import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Screen } from '@testing-library/react';
import App from './App';
import PricingResultsList from './components/PricingResultsList';
import { HectarePricing } from './types/hectare';

type Options = {
  name?: string;
  price?: string;
  width?: string;
  length?: string;
  clearPrice?: boolean;
};

const onRemovePricingMock = vi.fn();

const addHectarePricing = async (screen: Screen, options?: Options) => {
  const button = await screen.findByText('Calcular Preço');
  const inputName = await screen.findByPlaceholderText('Ex: Jhon Doe');
  const inputHectarePerPrice = await screen.findByPlaceholderText('Ex: 100');
  const inputWidth = await screen.findByPlaceholderText('Ex: 10');
  const inputLength = await screen.findByPlaceholderText('Ex: 1000');

  await userEvent.type(inputName, options?.name || 'TEST');
  if (options?.clearPrice) await userEvent.clear(inputHectarePerPrice);
  await userEvent.type(inputHectarePerPrice, options?.price || '100');
  await userEvent.type(inputWidth, options?.width || '10');
  await userEvent.type(inputLength, options?.length || '1000');
  fireEvent.click(button);
};

describe('<App /> & <HectareCalculator />', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('should render the parent component', () => {
    expect(screen.getByText('HECTARE HERO')).toBeInTheDocument();
  });

  it('should found the list of hectare on component', () => {
    expect(screen.getByText('Resultados de Precificação')).toBeInTheDocument();
    expect(screen.getByText('Adicione precificações para visualizar aqui')).toBeInTheDocument();
  });

  it('should check if button is disable', () => {
    expect(screen.getByLabelText('Gerar arquivo PDF com os resultados de precificação')).toBeDisabled();
  });

  it('should be invalid if the input is not passed', async () => {
    const button = await screen.findByText('Calcular Preço');
    fireEvent.click(button);

    const inputName = await screen.findByPlaceholderText('Ex: Jhon Doe');
    const inputHectarePerPrice = await screen.findByPlaceholderText('Ex: 100');
    const inputWidth = await screen.findByPlaceholderText('Ex: 10');
    const inputLength = await screen.findByPlaceholderText('Ex: 1000');

    expect(inputName.ariaInvalid).toEqual('true');
    expect(inputHectarePerPrice.ariaInvalid).toEqual('true');
    expect(inputWidth.ariaInvalid).toEqual('true');
    expect(inputLength.ariaInvalid).toEqual('true');
  });

  it('should add a hectare pricing on list', async () => {
    await addHectarePricing(screen);
    const pricingName = await screen.findByText('TEST');
    expect(pricingName).toBeInTheDocument();
  });

  it('should add two pricing on the list', async () => {
    await addHectarePricing(screen, { name: 'FIRST TEST' });

    await addHectarePricing(screen, { name: 'SECOND TEST', price: '200', clearPrice: true });

    const pricingNameFirst = await screen.findByText('FIRST TEST');
    expect(pricingNameFirst).toBeInTheDocument();

    const pricingNameSecond = await screen.findByText('SECOND TEST');
    expect(pricingNameSecond).toBeInTheDocument();
  });

  it('should remove a hectare pricing from the list', async () => {
    await addHectarePricing(screen, { name: 'FIRST TEST' });

    await addHectarePricing(screen, { name: 'SECOND TEST', price: '200', clearPrice: true });

    const pricing = await screen.findByLabelText('Remover precificação de FIRST TEST');

    fireEvent.click(pricing);
    expect(pricing).not.toBeInTheDocument();

    screen.debug();
  });

  it('should clear all inputs less hectarePerPrice after the submit', async () => {
    await addHectarePricing(screen);

    const inputName = (await screen.findByPlaceholderText('Ex: Jhon Doe')) as HTMLInputElement;
    const inputPrice = (await screen.findByPlaceholderText('Ex: 100')) as HTMLInputElement;
    const inputWidth = (await screen.findByPlaceholderText('Ex: 10')) as HTMLInputElement;
    const inputLength = (await screen.findByPlaceholderText('Ex: 1000')) as HTMLInputElement;

    expect(inputName.value).toEqual('');
    expect(inputPrice.value).toEqual('100');
    expect(inputWidth.value).toEqual('');
    expect(inputLength.value).toEqual('');
  });
});

describe('<PricingResultsList />', () => {
  const data: HectarePricing[] = [
    {
      id: Date.now().toString(),
      name: 'TEST',
      pricePerHectare: 100,
      width: 10,
      length: 1000,
      hectares: 10 * 1000,
      totalPrice: ((10 * 1000) / 10000) * 100,
    },
  ];
  it('should render the component correctly', () => {
    render(<PricingResultsList hectareData={data} onRemovePricing={onRemovePricingMock} />);
    expect(screen.getByText('TEST')).toBeInTheDocument();
    screen.debug();
  });

  it('should call the remove method when deleting the pricing', async () => {
    render(<PricingResultsList hectareData={data} onRemovePricing={onRemovePricingMock} />);
    const removeBtn = await screen.findByLabelText('Remover precificação de TEST');
    fireEvent.click(removeBtn);

    expect(onRemovePricingMock).toHaveBeenCalledOnce();
  });
});
