import { useState, useEffect } from 'react'

import AESGCM from './AESGCM'

function App () {
  const aesGcm = new AESGCM()
  // const key = aesGcm.generateKey();

  const [input, setInput] = useState('')
  const [encryption, setEncryption] = useState('')
  const [output, setOutput] = useState('')
  const [key, setKey] = useState()
  const [iv, setIv] = useState()

  async function generateNewKey () {
    const key = await aesGcm.generateKey()
    setKey(key)
  }

  useEffect(() => {
    generateNewKey()
  }, [])

  useEffect(() => {
    // console.log(key)
    // console.log("Iv:", iv);
  }, [iv, key])

  async function generateAesKey () {
    // Generate a random 256-bit AES key
    const aesKey = await crypto.subtle.generateKey(
      { name: 'AES-CTR', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
    return aesKey
  }

  async function handleEncryption (message) {
    const encodedPlaintext = new TextEncoder().encode(message)

    const aesKey = await generateAesKey()

    setKey(aesKey)

    const iv = crypto.getRandomValues(new Uint8Array(16)) // Initialization vector (IV)

    setIv(iv)

    // Encrypt
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-CTR', counter: iv, length: 64 },
      aesKey,
      encodedPlaintext
    )

    // // Decrypt
    // const decryptedArrayBuffer = await crypto.subtle.decrypt(
    //   { name: "AES-CTR", counter: iv, length: 64 },
    //   aesKey,
    //   ciphertext
    // );

    // const decryptedText = new TextDecoder().decode(decryptedArrayBuffer);

    // setOutput(decryptedText);

    setEncryption(new Uint8Array(ciphertext))
  }

  async function handleDecryption (encrypted, key, iv) {
    // Decrypt
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      { name: 'AES-CTR', counter: iv, length: 64 },
      key,
      encrypted
    )

    const decryptedText = new TextDecoder().decode(decryptedArrayBuffer)

    setOutput(decryptedText)
  }

  async function decrypt (ciphertext, key, iv) {
    const encryptedtext = await aesGcm.hexToArrayBuffer(ciphertext)
    const decryptedText = await aesGcm.decrypt(encryptedtext, key, iv)
    setOutput(decryptedText)
  }

  async function handleForm (e) {
    e.preventDefault()

    const { ciphertext, iv } = await aesGcm.encrypt(input, key)

    setIv(iv)

    const hexCipherText = await aesGcm.arrayBufferToHex(ciphertext)

    setEncryption(hexCipherText)
  }

  return (
    <div className='App'>
      <form onSubmit={handleForm}>
        <input
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
      {/* <div>{JSON.stringify(encryption)}</div> */}
      <div>{encryption}</div>
      <button onClick={() => decrypt(encryption, key, iv)}>
        Decrypt message
      </button>
      <div>{output}</div>
    </div>
  )
}

export default App
