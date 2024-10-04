import { useState } from 'react';

import './App.css';

/** GitHub Pages で公開するにあたってサブディレクトリのパスを付与するために用意 */
const publicPathPrefix = '/human-face-ai/';

/** 画像ファイルのルート相対パス一覧 */
const imageFilePaths = [
  'human-face-angry-01.jpg',
  'human-face-angry-02.jpg',
  'human-face-fun-01.jpg',
  'human-face-fun-02.jpg',
  'human-face-normal-01.jpg',
  'human-face-normal-02.jpg',
  'human-face-sad-01.jpg',
  'human-face-sad-02.jpg'
].map(imageFileName => `${publicPathPrefix}${imageFileName}`);

/** 配列から1要素をランダムに取得する */
const getRandomOneFromArray = (array: Array<any>): any => array[Math.floor(Math.random() * array.length)];

/** プロンプトを組み立てる */
const createMessages = (text: string): Array<{ role: 'user' | 'assistant', content: string }> => [
  { role: 'user', content: 'あなたの親指には人面瘡が表れています。これから質問をしますので、ユーモアを交えて人面草の状況について答えてください。' },
  { role: 'assistant', content: 'もちろんです！では、どんな質問でも受け付けますよ。人面瘡の様子を楽しくお答えします。' },
  { role: 'user', content: text }
];

/** GPT API をコールする */
const callGpt = async (messages: Array<{ role: 'user' | 'assistant', content: string }>): Promise<string> => {
  const response = await fetch('https://nexra.aryahcr.cc/api/chat/gpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: messages,
      model: 'gpt3.5-turbo',
      stream: false,
      markdown: false
    })
  });
  const json = await response.json();
  return json.gpt.trim();
};

/** App */
export default function App() {
  /** 画像ファイルパスの State 変数 */
  const [imageFilePath, setImageFilePath] = useState(getRandomOneFromArray(imageFilePaths));
  /** 質問文の State 変数 */
  const [inputText, setInputText] = useState('');
  /** 回答文の State 変数 */
  const [outputText, setOutputText] = useState('人面瘡に質問してみよう！');
  /** 質問ボタンを比活性にするか否か */
  const [isDisabled, setIsDisabled] = useState(true);
  
  /** 質問ボタン押下時に API コールする */
  const handleSubmit = async () => {
    if(inputText.trim() === '') return;
    
    setIsDisabled(true);  // 二度押し防止
    setOutputText('人面瘡の状況を尋ねています…');
    
    const messages = createMessages(inputText.trim());
    const result = await callGpt(messages).catch(_error => '人面瘡の状況が分かりませんでした');
    
    setOutputText(result);
    setIsDisabled(false);
  };
  
  return (
    <div className="container">
      <h1><a href="https://github.com/mkrydik/human-face-ai">Human Face AI</a></h1>
      <div className="image-container">
        <img src={imageFilePath} onClick={() => setImageFilePath(getRandomOneFromArray(imageFilePaths))} />
      </div>
      <p>{outputText}</p>
      <p><input type="text" value={inputText} onInput={event => setIsDisabled((event.target as any).value.trim() === '')} onChange={event => setInputText(event.target.value)} placeholder="質問を入力してね" /></p>
      <p><button type="button" onClick={handleSubmit} disabled={isDisabled}>質問</button></p>
    </div>
  );
}
