import { AppProvider } from '../context/AppContext';
import Step1 from '../../app/components/Step1';

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <Step1 />
        </div>
      </div>
    </AppProvider>
  );
}