// app/components/Step2.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

const apiDefaults = {
  production: { label: "Production", defaultOtp: "" },
  simulation: { label: "Simulation", defaultOtp: "" },
  developer: { label: "Developer", defaultOtp: "123456" },
};

const Step2: React.FC<Step2Props> = ({ onNext, onBack }) => {
  const [selectedEnv, setSelectedEnv] = useState<"production" | "simulation" | "developer">("developer");
  const { certificate, updateCertificate, setEnvironment } = useAppContext();
  const [otp, setOtp] = useState(apiDefaults.developer.defaultOtp);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEnvironment(selectedEnv);
    setOtp(apiDefaults[selectedEnv].defaultOtp);
    console.log(`Environment changed to ${selectedEnv}. Default OTP is: ${apiDefaults[selectedEnv].defaultOtp}`);
  }, [selectedEnv, setEnvironment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Production ortamı için OTP doğrulaması
    if (selectedEnv === "production" && !otp.trim().match(/^\d{6}$/)) {
      alert("Production ortamında 6 haneli geçerli bir OTP girilmelidir!");
      setIsLoading(false);
      return;
    }

    if (!certificate?.csr) {
      alert("CSR bilgisi eksik. Lütfen Step1'e geri dönün.");
      setIsLoading(false);
      return;
    }

    // CSR temizleme: PEM başlık ve sonlandırıcıları kaldırıyoruz
    const cleanCsr = certificate.csr
      .replace(/-----BEGIN CERTIFICATE REQUEST-----/g, "")
      .replace(/-----END CERTIFICATE REQUEST-----/g, "")
      .replace(/\r?\n/g, "")
      .trim();

    try {
      const response = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Version": "V2",
          "OTP": otp.trim(),
        },
        body: JSON.stringify({
          environment: selectedEnv,
          csr: cleanCsr,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("ZATCA API Error:", errorData);
        throw new Error(`API isteği başarısız: ${errorData}`);
      }

      const data = await response.json();
      updateCertificate({ generatedCert: data.signedCertificate });
      alert("Sertifika başarıyla oluşturuldu!");
      onNext();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Bilinmeyen hata");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Ortam Seçimi ve OTP</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Environment *</label>
          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value as "production" | "simulation" | "developer")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="production">Production</option>
            <option value="simulation">Simulation</option>
            <option value="developer">Developer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">OTP *</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={selectedEnv === "developer" ? "Varsayılan OTP: 123456" : "OTP giriniz"}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required={selectedEnv === "production"}
          />
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded-md">
            Geri
          </button>
          <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            {isLoading ? "Yükleniyor..." : "Sertifika Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;
