// app/components/Step4.tsx
import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useDropzone } from "react-dropzone";
import { QRCode } from "react-qrcode-logo";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

interface SampleFile {
  label: string;
  path: string;
}

const Step4: React.FC<Step4Props> = ({ onNext, onBack }) => {
  const { certificate } = useAppContext();
  const [mode, setMode] = useState<"upload" | "sample">("upload");
  const [sampleFiles, setSampleFiles] = useState<SampleFile[]>([]);
  const [selectedSample, setSelectedSample] = useState<string>("");
  const [xmlContent, setXmlContent] = useState<string>("");
  const [signedXML, setSignedXML] = useState<string>("");
  const [invoiceHash, setInvoiceHash] = useState<string>("");

  // API'den örnek XML dosyalarını getir
  useEffect(() => {
    fetch("/api/sample-files")
      .then((res) => {
        if (!res.ok) {
          throw new Error("API isteği başarısız.");
        }
        return res.json();
      })
      .then((data) => {
        setSampleFiles(data.files);
        if (data.files.length > 0) {
          setSelectedSample(data.files[0].path);
        }
      })
      .catch((err) => console.error("Error fetching sample files:", err));
  }, []);

  // Dosya yükleme modu için dropzone ayarları
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/xml": [".xml"] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result;
          if (typeof text === "string") {
            setXmlContent(text);
          }
        };
        reader.readAsText(file);
      }
    },
    disabled: mode === "sample",
  });

  // Örnek XML seçiliyse, dosyayı fetch ile oku
  useEffect(() => {
    if (mode === "sample" && selectedSample) {
      fetch(selectedSample)
        .then((res) => {
          if (!res.ok) throw new Error("Örnek XML dosyası bulunamadı.");
          return res.text();
        })
        .then((text) => setXmlContent(text))
        .catch((err) => console.error("Örnek XML Hatası:", err));
    }
  }, [mode, selectedSample]);

  // XML İmzala butonuna basıldığında API çağrısı
  const handleSignXML = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xmlContent) {
      alert("XML içeriği boş.");
      return;
    }
    if (!certificate || !certificate.generatedCert || !certificate.privateKey) {
      alert("Sertifika verileri eksik. Lütfen sertifika bilgilerini tamamlayın.");
      onBack();
      return;
    }
    try {
      const response = await fetch("/api/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xml: xmlContent,
          certificate: certificate.generatedCert,
          privateKey: certificate.privateKey,
        }),
      });
      if (!response.ok) throw new Error("XML imzalama başarısız.");
      const data = await response.json();
      setSignedXML(data.signedXML);
      setInvoiceHash(data.invoiceHash);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Bilinmeyen hata");
    }
  };

  // Örnek dosya indirme işlemi
  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = selectedSample;
    link.download = selectedSample.split("/").pop() || "sample.xml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">XML İmzalama</h1>
      <div className="mb-6">
        <p className="mb-2 font-medium">XML Dosyası Seçimi</p>
        <div className="flex space-x-4 mb-4">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              value="upload"
              checked={mode === "upload"}
              onChange={() => {
                setMode("upload");
                setXmlContent("");
              }}
            />
            <span>Dosya Yükle</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              value="sample"
              checked={mode === "sample"}
              onChange={() => {
                setMode("sample");
                setXmlContent("");
              }}
            />
            <span>Örnek XML Kullan</span>
          </label>
        </div>
        {mode === "upload" ? (
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-6 rounded-md text-center cursor-pointer hover:bg-gray-50 transition"
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              XML dosyasını buraya sürükleyin veya tıklayarak seçin.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <select
              value={selectedSample}
              onChange={(e) => setSelectedSample(e.target.value)}
              className="p-2 border rounded"
            >
              {sampleFiles.map((file) => (
                <option key={file.path} value={file.path}>
                  {file.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleDownloadSample}
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Örnek XML İndir
            </button>
          </div>
        )}
      </div>
      <button
        onClick={handleSignXML}
        className="bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        XML İmzala
      </button>
      {signedXML && (
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">İmzalanmış XML</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64 whitespace-pre-wrap break-all">
              {signedXML}
            </pre>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Invoice Hash (PIH)</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64 whitespace-pre-wrap break-all">
              {invoiceHash}
            </pre>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">QR Kod</h2>
            {invoiceHash ? (
              <QRCode
                value={invoiceHash}
                size={300}
                bgColor="#ffffff"
                fgColor="#000000"
                qrStyle="squares"
                removeQrCodeBehindLogo
              />
            ) : (
              <p>QR kod verisi henüz mevcut değil.</p>
            )}
          </div>
          <button
            onClick={onNext}
            className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
          >
            Devam Et
          </button>
        </div>
      )}
      <button
        onClick={onBack}
        className="mt-4 bg-gray-300 text-black py-2 px-4 rounded-md"
      >
        Geri Dön
      </button>
    </div>
  );
};

export default Step4;
