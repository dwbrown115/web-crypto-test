export default class AESGCM {
  static ALGORITHM = "AES-GCM";
  static KEY_SIZE = 256;

  // async generateKey() {
  //   return crypto.subtle.generateKey(
  //     { name: "AES-GCM", length: 256 },
  //     true,
  //     ["encrypt", "decrypt"]
  //   );
  // }

  async generateKey() {
    return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
      "encrypt",
      "decrypt",
    ]);
  }

  async encrypt(plaintext, key) {
    const encodedPlaintext = new TextEncoder().encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector (IV)

    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      encodedPlaintext
    );

    return { ciphertext, iv };
  }

  async decrypt(ciphertext, key, iv) {
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      ciphertext
    );

    const decryptedText = new TextDecoder().decode(decryptedArrayBuffer);
    return decryptedText;
  }

  arrayBufferToHex(buffer) {
      return Array.from(new Uint8Array(buffer))
          .map(byte => byte.toString(16).padStart(2, '0'))
              .join('');
              
  }

  hexToArrayBuffer(hex) {
      const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
              }
                return bytes.buffer;
                
  }
}

