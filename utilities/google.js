import { TranslationServiceClient } from '@google-cloud/translate';

export const translate = async (text, targetLanguage) => {
    const credential = JSON.parse(
        Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
    );
    const client = new TranslationServiceClient({
        credentials: {
            client_email: credential.client_email,
            private_key: credential.private_key,
        },
    })

    const projectId = process.env.GCLOUD_PROJECT_ID
    const location = "global"

    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: "text/plain",
        targetLanguageCode: targetLanguage,
    };
    
    const [response] = await client.translateText(request);
    return (response.translations[0]);
}