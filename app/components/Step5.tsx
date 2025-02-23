import React from "react";

interface Step5Props {
  onRestart: () => void;
}

const Step5: React.FC<Step5Props> = ({ onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 İşlem Tamamlandı! 🎉</h1>
      <p className="text-lg text-gray-700 mb-6">
        Tebrikler! XML imzalama işlemi başarıyla tamamlandı.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <p className="text-gray-600 text-sm">Made by</p>
        <h2 className="text-xl font-semibold text-blue-600">
          Can Matik <span className="text-red-500">❤️</span>
        </h2>
        <a
          href="https://www.linkedin.com/in/can-matik/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          linkedin.com/in/can-matik
        </a>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
      >
        Yeni İşlem Başlat
      </button>

      <footer className="mt-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} Can Matik. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Step5;
