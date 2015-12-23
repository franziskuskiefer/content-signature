// Generates signature values for the example.
base64 = x => btoa(String.fromCharCode.apply(null, new Uint8Array(x)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/={1,2}$/,'');
dex = x=>new Uint8Array(x.replace(/ /g,'').split('').map(x => parseInt(x, 16)).reduce((a, x, i) => (a.push(((i%2) ? (a.pop() << 4) : 0) | x), a), []));
message = 'Hello, World!\r\n';
crypto.subtle.generateKey({name: 'ECDSA', namedCurve: 'P-256'}, false, ['sign'])
  .then(k => {
    crypto.subtle.exportKey('raw', k.publicKey)
      .then(p => console.log(base64(p)));
    crypto.subtle.sign({name: 'ECDSA', hash: 'SHA-256'}, k.privateKey,
                       new TextEncoder('utf-8').encode('Content-Signature:\u0000' + message))
      .then(sig => console.log(base64(sig)));
  });
