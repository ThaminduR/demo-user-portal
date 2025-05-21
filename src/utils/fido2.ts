export function arrayBufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function encodeCredential(response: any) {
    if (response.u2fResponse) {
        return response;
    }

    let clientExtensionResults = {};
    try {
        clientExtensionResults = response.getClientExtensionResults();
    } catch (e) {
        console.error('getClientExtensionResults failed', e);
    }

    if (response.response.attestationObject) {
        return {
            id: response.id,
            response: {
                attestationObject: arrayBufferToBase64url(response.response.attestationObject),
                clientDataJSON: arrayBufferToBase64url(response.response.clientDataJSON),
            },
            clientExtensionResults,
            type: response.type,
        };
    } else {
        return {
            id: response.id,
            response: {
                authenticatorData: arrayBufferToBase64url(response.response.authenticatorData),
                clientDataJSON: arrayBufferToBase64url(response.response.clientDataJSON),
                signature: arrayBufferToBase64url(response.response.signature),
                userHandle: response.response.userHandle
                    ? arrayBufferToBase64url(response.response.userHandle)
                    : null,
            },
            clientExtensionResults,
            type: response.type,
        };
    }
}

export function base64urlToUint8Array(base64url: string): Uint8Array {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    const decoded = atob(base64 + pad);
    return new Uint8Array(decoded.split('').map((c) => c.charCodeAt(0)));
}

export function decodePublicKeyCredentialOptions(request: any): PublicKeyCredentialCreationOptions {
    return {
        ...request,
        attestation: 'direct',
        challenge: base64urlToUint8Array(request.challenge),
        user: {
            ...request.user,
            id: base64urlToUint8Array(request.user.id),
        },
        excludeCredentials: (request.excludeCredentials || []).map((cred: any) => ({
            ...cred,
            id: base64urlToUint8Array(cred.id),
        })),
    };
}

export async function createPasskey(interactionData: string): Promise<{
    requestId: string;
    credential: ReturnType<typeof encodeCredential>;
}> {
    const interaction = JSON.parse(interactionData);
    const requestId = interaction.requestId;
    const options = decodePublicKeyCredentialOptions(interaction.publicKeyCredentialCreationOptions);

    const credential = await navigator.credentials.create({ publicKey: options });

    if (!credential) {
        throw new Error('Credential creation failed');
    }

    return {
        requestId,
        credential: encodeCredential(credential),
    };
}
