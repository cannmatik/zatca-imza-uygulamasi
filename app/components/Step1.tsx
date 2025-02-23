"use client";
import React, { useState, useEffect } from "react";
import { useAppContext, TitleType } from "../context/AppContext";

interface Step1Props {
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
  const { updateCertificate } = useAppContext();
  const [formData, setFormData] = useState({
    country: "SA",
    organization: "",
    organizationalUnit: "",
    commonName: "",
    registeredAddress: "",
    serialNumber: "89e83ba3-8fe1-412f-91d6-5dcd67f7987c",
    businessCategory: "",
    vatNumber: "300000000000003",
    title: "1100" as TitleType,
    email: "",
    telephone: "+966",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ortak ad (CN) otomatik güncelleniyor
  useEffect(() => {
    const newCommonName = `${formData.organization} - ${formData.organizationalUnit}`.trim();
    setFormData((prev) => ({ ...prev, commonName: newCommonName }));
  }, [formData.organization, formData.organizationalUnit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (
      !formData.organization ||
      !formData.organizationalUnit ||
      !formData.registeredAddress ||
      !formData.serialNumber ||
      !formData.businessCategory ||
      !formData.vatNumber
    ) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      setIsLoading(false);
      return;
    }

    try {
      // API route'a POST isteği ile CSR oluşturuluyor
      const response = await fetch("/api/create-csr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: formData.organization,
          organizationalUnit: formData.organizationalUnit,
          commonName: formData.commonName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`CSR oluşturma hatası: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      // CSR ve private key bilgileri güncelleniyor
      updateCertificate({ ...formData, csr: data.csr, privateKey: data.privateKey });
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Sertifika Bilgileri</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form alanları */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Ülke (C) *</label>
          <input type="text" value={formData.country} disabled className="mt-1 p-2 w-full border rounded-md bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Organizasyon (O) *</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            placeholder="Örn: Al Tazaj"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Organizasyon Birimi (OU) *</label>
          <input
            type="text"
            value={formData.organizationalUnit}
            onChange={(e) => setFormData({ ...formData, organizationalUnit: e.target.value })}
            placeholder="Örn: 10 Haneli Vergi Kimlik Numarası"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ortak Ad (CN)</label>
          <input type="text" value={formData.commonName} disabled className="mt-1 p-2 w-full border rounded-md bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kayıtlı Adres *</label>
          <input
            type="text"
            value={formData.registeredAddress}
            onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
            placeholder="Örn: Riyadh"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Seri Numarası *</label>
          <input
            type="text"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">İş Kategorisi *</label>
          <input
            type="text"
            value={formData.businessCategory}
            onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
            placeholder="Örn: Food Business"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vergi Numarası (15 haneli) *</label>
          <input
            type="text"
            value={formData.vatNumber}
            onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
            placeholder="Örn: 300000000000003"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unvan (T) *</label>
          <select
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value as TitleType })}
            className="mt-1 p-2 w-full border rounded-md"
            required
          >
            <option value="1100">1100 - Standard & Simplified</option>
            <option value="1000">1000 - Standard</option>
            <option value="0100">0100 - Simplified</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-posta Adresi</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Örn: email@domain.com"
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefon Numarası *</label>
          <input
            type="text"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            placeholder="Örn: +966"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md">
          {isLoading ? "Yükleniyor..." : "İleri"}
        </button>
      </form>
    </div>
  );
};

export default Step1;
