import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { HectarePricing } from '../types/hectare';

const requiredFieldMsg = 'Este campo é obrigatório';
const greaterThanZero = 'O valor deve ser maior que zero';
const numberRequired = 'Este campo deve receber um número';
const numberRegex = /^-?\d+(?:[.,]\d+)?$/;

const HectareCalculatorSchema = z.object({
  name: z.string().nonempty(requiredFieldMsg),
  pricePerHectare: z
    .string()
    .refine((value) => value.length > 0, { message: requiredFieldMsg })
    .refine((value) => numberRegex.test(value), {
      message: numberRequired,
    })
    .refine((value) => Number(value.replace(',', '.')) > 0, { message: greaterThanZero }),
  width: z
    .string()
    .refine((value) => value.length > 0, { message: requiredFieldMsg })
    .refine((value) => numberRegex.test(value), {
      message: numberRequired,
    })
    .refine((value) => Number(value.replace(',', '.')) > 0, { message: greaterThanZero }),
  length: z
    .string()
    .refine((value) => value.length > 0, { message: requiredFieldMsg })
    .refine((value) => numberRegex.test(value), {
      message: numberRequired,
    })
    .refine((value) => Number(value.replace(',', '.')) > 0, { message: greaterThanZero }),
});

type HectareCalculatorFormData = z.infer<typeof HectareCalculatorSchema>;

type HectareCalculatorProps = {
  onAddPricing: React.Dispatch<React.SetStateAction<HectarePricing[]>>;
};

const HectareCalculator: React.FC<HectareCalculatorProps> = ({ onAddPricing }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<HectareCalculatorFormData>({
    resolver: zodResolver(HectareCalculatorSchema),
  });

  const formValid = (data: HectareCalculatorFormData) => {
    const dataWidth = Number(data.width.replace(',', '.'));
    const dataLength = Number(data.length.replace(',', '.'));
    const dataPrice = Number(data.pricePerHectare.replace(',', '.'));

    if (isNaN(dataWidth) || isNaN(dataLength)) return;
    const hectares = (dataWidth * dataLength) / 10000;
    const totalPrice = hectares * dataPrice;

    const pricing: HectarePricing = {
      id: Date.now().toString(),
      name: data.name,
      pricePerHectare: dataPrice,
      width: dataWidth,
      length: dataLength,
      hectares: hectares,
      totalPrice: totalPrice,
    };

    onAddPricing((prev) => [pricing, ...prev]);
    reset({ name: '', width: '', length: '' });
  };

  return (
    <div className="max-w-[450px] rounded-md bg-white p-7 shadow-lg">
      <form role="form" onSubmit={handleSubmit(formValid)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            className="input-field"
            type="text"
            placeholder="Ex: Jhon Doe"
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="pricePerHectare">Preço por Hectare (R$)</label>
          <input
            id="pricePerHectare"
            className="input-field"
            type="number"
            placeholder="Ex: 100"
            step="0.01"
            {...register('pricePerHectare')}
            aria-invalid={errors.pricePerHectare ? 'true' : 'false'}
            aria-describedby={errors.pricePerHectare ? 'pricePerHectare-error' : undefined}
          />
          {errors.pricePerHectare && <span className="text-xs text-red-500">{errors.pricePerHectare.message}</span>}
        </div>
        <div className="grid grid-cols-2 grid-rows-1 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="width">Largura (metros)</label>
            <input
              id="width"
              className="input-field"
              type="number"
              placeholder="Ex: 10"
              step="0.01"
              min={1}
              {...register('width')}
              aria-invalid={errors.width ? 'true' : 'false'}
              aria-describedby={errors.width ? 'width-error' : undefined}
            />
            {errors.width && <span className="text-xs text-red-500">{errors.width.message}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="truncate overflow-hidden" htmlFor="length">
              Comprimento (metros)
            </label>
            <input
              id="length"
              className="input-field"
              type="number"
              placeholder="Ex: 1000"
              step="0.01"
              min={1}
              {...register('length')}
              aria-invalid={errors.length ? 'true' : 'false'}
              aria-describedby={errors.length ? 'length-error' : undefined}
            />
            {errors.length && <span className="text-xs text-red-500">{errors.length.message}</span>}
          </div>
        </div>
        <button
          className="cursor-pointer rounded-md bg-sky-500 py-2 text-center font-semibold text-white transition-all duration-200 hover:bg-sky-600 hover:shadow-sm"
          type="submit"
        >
          Calcular Preço
        </button>
      </form>
    </div>
  );
};

export default HectareCalculator;
