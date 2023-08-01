import { TranslationServiceClient } from '@google-cloud/translate';
import { ImageAnnotatorClient } from '@google-cloud/vision';

const credential = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
);
const translationClient = new TranslationServiceClient({
    credentials: {
        client_email: credential.client_email,
        private_key: credential.private_key,
    },
})
const visionClient = new ImageAnnotatorClient({
    credentials: {
        client_email: credential.client_email,
        private_key: credential.private_key,
    },
})

const projectId = process.env.GCLOUD_PROJECT_ID
const location = "global"

export const translate = async (text, targetLanguage) => {
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: "text/plain",
        targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateText(request);
    return (response.translations[0]);
}

export const labelImage = async (imageURI) => {
    const [result] = await visionClient.labelDetection(imageURI);
    const labels = result.labelAnnotations;
    return labels;
}

export const detectText = async (imageURI) => {
    const [result] = await visionClient.textDetection(imageURI);
    const detections = result.textAnnotations;
    return detections;
}