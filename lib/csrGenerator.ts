// lib/csrGenerator.ts
import forge from "node-forge";

export interface CsrConfig {
  country: string;
  organizationUnit: string;
  organization: string;
  commonName: string;
}

export async function generateCsr(config: CsrConfig): Promise<{ privateKey: string; csrBase64: string }> {
  return new Promise((resolve, reject) => {
    try {
      // RSA anahtar çifti oluşturma (alternatif olarak EC algoritması da kullanılabilir)
      const keys = forge.pki.rsa.generateKeyPair(2048);
      const csr = forge.pki.createCertificationRequest();
      csr.publicKey = keys.publicKey;
      csr.setSubject([
        { name: 'countryName', value: config.country },
        { name: 'organizationalUnitName', value: config.organizationUnit },
        { name: 'organizationName', value: config.organization },
        { name: 'commonName', value: config.commonName }
      ]);

      csr.sign(keys.privateKey, forge.md.sha256.create());
      const csrPem = forge.pki.certificationRequestToPem(csr);
      const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);

      // CSR'yi Base64 formatına çeviriyoruz
      const csrBase64 = Buffer.from(csrPem).toString('base64');

      // İsteğe bağlı: Özel anahtarın header/footer kısımlarını temizleyebilirsiniz.
      const privateKeyClean = privateKeyPem.replace(/-----BEGIN PRIVATE KEY-----/g, "")
        .replace(/-----END PRIVATE KEY-----/g, "")
        .replace(/\n/g, "").trim();

      resolve({ privateKey: privateKeyClean, csrBase64 });
    } catch (error) {
      reject(error);
    }
  });
}
