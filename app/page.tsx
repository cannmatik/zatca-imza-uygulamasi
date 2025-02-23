"use client";
import { useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  const restart = () => setCurrentStep(1); // Yeniden başlatma

  // Toplam 5 adım (1-5) – ilerleme yüzdesi
  const progressPercent = ((currentStep - 1) / 4) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={nextStep} />;
      case 2:
        return <Step2 onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3 onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4 onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <Step5 onRestart={restart} />; // 🔥 Son adım artık Step5!
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-300 h-4 rounded">
            <div className="bg-blue-600 h-4 rounded" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-center mt-2">Step {currentStep} / 5</p>
        </div>
        {renderStep()}
      </div>
    </div>
  );
}
