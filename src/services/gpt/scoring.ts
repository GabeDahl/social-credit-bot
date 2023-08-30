import OpenAI from 'openai';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const secretMgrClient = new SecretManagerServiceClient();
const [accessResponse] = await secretMgrClient.accessSecretVersion({
  name: 'projects/808553059840/secrets/OPENAI_API_KEY/versions/latest',
});
const key = accessResponse.payload?.data?.toString();
const openai = new OpenAI({
  apiKey: key,
});

export const getScore = async (message: string): Promise<number> => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `
Your job is to score messages for my satirical discord bot. Imagine you're an authoritarian regime that fears western values. If a message contains pro-freedom or anti-state sentiment, score it -1. If a message contains pro-authoritarianism or anti-freedom sentiment, score it 1.
Otherwise score it 0.
Format your response as a single integer score.

Score this statement:
${message}`,
      },
    ],
    model: 'gpt-3.5-turbo',
  });
  console.log(completion.choices);
  return parseInt(completion.choices[0].message.content || '0');
};
