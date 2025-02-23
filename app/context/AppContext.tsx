// app/context/AppContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type EnvironmentType = "production" | "simulation" | "developer";
export type TitleType = "1100" | "1000" | "0100";

export interface CertificateData {
  country: string;
  organization: string;
  organizationalUnit: string;
  commonName: string;
  registeredAddress: string;
  serialNumber: string;
  businessCategory: string;
  vatNumber: string;
  title: TitleType;
  email: string;
  telephone: string;
  generatedCert?: string;
  privateKey?: string;
  csr?: string;
  requestID?: string;
}

interface AppContextType {
  certificate: CertificateData | null;
  environment: {
    type: EnvironmentType;
    reportingURL: string;
    clearanceURL: string;
    authorization: string;
  };
  updateCertificate: (data: Partial<CertificateData>) => void;
  setEnvironment: (type: EnvironmentType) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [environment, setEnv] = useState({
    type: "production" as EnvironmentType,
    reportingURL: "",
    clearanceURL: "",
    authorization: "",
  });

  const updateCertificate = (data: Partial<CertificateData>) => {
    setCertificate((prev) => {
      if (prev) {
        return { ...prev, ...data };
      } else {
        const defaultCertificate: CertificateData = {
          country: "SA",
          organization: "",
          organizationalUnit: "",
          commonName: "",
          registeredAddress: "",
          serialNumber: "89e83ba3-8fe1-412f-91d6-5dcd67f7987c",
          businessCategory: "",
          vatNumber: "300000000000003",
          title: "1100",
          email: "",
          telephone: "+966",
          ...data,
        };
        return defaultCertificate;
      }
    });
  };

  const updateEnvironment = useCallback((type: EnvironmentType) => {
    const urls: Record<EnvironmentType, { reportingURL: string; clearanceURL: string }> = {
      developer: {
        reportingURL: "https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/invoices/reporting/single",
        clearanceURL: "https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/invoices/clearance/single",
      },
      simulation: {
        reportingURL: "https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/invoices/reporting/single",
        clearanceURL: "https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/invoices/clearance/single",
      },
      production: {
        reportingURL: "https://gw-fatoora.zatca.gov.sa/e-invoicing/core/invoices/reporting/single",
        clearanceURL: "https://gw-fatoora.zatca.gov.sa/e-invoicing/core/invoices/clearance/single",
      },
    };

    setEnv({
      type,
      ...urls[type],
      authorization: "",
    });
  }, []);

  useEffect(() => {
    updateEnvironment("production");
  }, [updateEnvironment]);

  return (
    <AppContext.Provider
      value={{
        certificate,
        environment,
        updateCertificate,
        setEnvironment: updateEnvironment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
