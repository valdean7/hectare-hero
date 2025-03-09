import React, { SetStateAction } from 'react';
import { FileDown, Ruler, DollarSign, Eraser } from 'lucide-react';
import { HectarePricing } from '../types/hectare';
import { generatePricingPDF } from '../utils/generate-pdf';

type PricingResultsListProps = {
  hectareData: HectarePricing[];
  onRemovePricing: React.Dispatch<SetStateAction<HectarePricing[]>>;
};

const PricingResultsList: React.FC<PricingResultsListProps> = ({ hectareData, onRemovePricing }) => {
  const handleRemove = (id: string) => {
    onRemovePricing((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGeneratePDF = () => {
    generatePricingPDF(hectareData);
  };

  return (
    <div className="max-w-[448px] rounded-md bg-white p-7 shadow-lg">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold tracking-tighter text-sky-800">Resultados de Precificação</h3>
        {hectareData.length === 0 ? (
          <p className="text-md pb-6 text-gray-500">Adicione precificações para visualizar aqui</p>
        ) : (
          <div
            className="mt-2 mb-6 flex h-100 w-full flex-col gap-3 overflow-hidden overflow-y-auto"
            aria-live="polite"
          >
            {hectareData.map((pricing) => (
              <div
                key={pricing.id}
                className="flex flex-col gap-2 rounded-md border border-gray-100 p-3 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-row justify-between">
                  <h3 className="text-3xl text-gray-900">{pricing.name}</h3>
                  <button
                    onClick={() => handleRemove(pricing.id)}
                    aria-label={`Remover precificação de ${pricing.name}`}
                  >
                    <Eraser className="h-4 w-4 cursor-pointer text-gray-500 transition-colors duration-200 hover:text-sky-600" />
                  </button>
                </div>
                <div className="flex flex-row">
                  <div className="w-full">
                    <div className="flex flex-row items-center gap-1">
                      <Ruler className="h-3.5 w-3.5 text-sky-600" />
                      <span className="text-center text-gray-600">
                        {pricing.width.toString().replace('.', ',')}m x {pricing.length.toString().replace('.', ',')}m
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-sky-600" />
                      <span className="text-center text-gray-600">
                        R$ {pricing.pricePerHectare.toFixed(2).toString().replace('.', ',')}/ha
                      </span>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex flex-row items-center gap-1">
                      <Ruler className="h-3.5 w-3.5 text-sky-600" />
                      <span className="text-center text-gray-600">
                        {pricing.hectares.toFixed(4).toString().replace('.', ',')} ha
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-sky-700" />
                      <span className="text-center font-semibold text-sky-700">
                        R$ {pricing.totalPrice.toFixed(2).toString().replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          disabled={hectareData.length > 0 ? false : true}
          onClick={handleGeneratePDF}
          className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-sky-700 py-2 text-white transition-all duration-200 not-disabled:hover:bg-sky-800 disabled:opacity-50"
          aria-label="Gerar arquivo PDF com os resultados de precificação"
        >
          <FileDown aria-hidden={true} size={16} />
          Gerar PDF
        </button>
      </div>
    </div>
  );
};

export default PricingResultsList;
