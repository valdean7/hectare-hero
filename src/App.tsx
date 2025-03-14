import { useState } from 'react';
import { Ruler } from 'lucide-react';
import HectareCalculator from './components/HectareCalculator';
import PricingResultsList from './components/PricingResultsList';
import { HectarePricing } from './types/hectare';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const [hectareData, setHectareData] = useState<HectarePricing[]>([]);

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-white">
        {/* Header */}
        <header className="animate-fade-in-down px-4 py-8 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-1 inline-flex items-center justify-center space-x-2">
              <Ruler className="h-6 w-6 text-sky-500" />
              <p className="text-sm font-medium text-sky-500">HECTARE HERO</p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Precificador de Hectare</h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-gray-600">
              Calcule rapidamente o valor de um terreno com base em suas dimensões e preço por hectare.
            </p>
          </div>
          <hr className="mx-auto mt-8 max-w-md border-gray-200" />
        </header>
        <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
              <div className="animate-fade-in-up">
                <HectareCalculator onAddPricing={setHectareData} />
              </div>
              <div className="animate-fade-in-up">
                <PricingResultsList hectareData={hectareData} onRemovePricing={setHectareData} />
              </div>
            </div>
          </div>
        </main>
        <footer className="px-4 py-6 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Hectare Hero Pricer. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
