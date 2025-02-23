// app/components/Step3.tsx
"use client";
import React from "react";
import { useAppContext } from "../context/AppContext";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

const Step3: React.FC<Step3Props> = ({ onNext, onBack }) => {
  const { certificate } = useAppContext();

  if (!certificate || !certificate.generatedCert || !certificate.privateKey) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Sertifika Oluşturma</h1>
        <p>Sertifika oluşturulamadı. Lütfen sertifika bilgilerini kontrol edip yeniden deneyin.</p>
        <button onClick={onBack} className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4">
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sertifika Başarıyla Oluşturuldu</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Oluşturulan Sertifika</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto break-all">{certificate.generatedCert}</pre>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Özel Anahtar</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto break-all">{certificate.privateKey}</pre>
      </div>
      {certificate.csr && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">CSR Bilgisi</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto break-all">{certificate.csr}</pre>
        </div>
      )}
      <div className="flex space-x-4">
        <button onClick={onNext} className="bg-blue-600 text-white py-2 px-4 rounded-md">
          Devam Et
        </button>
        <button onClick={onBack} className="bg-gray-300 text-black py-2 px-4 rounded-md">
          Geri Dön
        </button>
      </div>
    </div>
  );
};

export default Step3;
