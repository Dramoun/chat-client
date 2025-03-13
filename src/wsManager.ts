import WebSocket from 'ws';

import { HandShakeMessage, ChatMessage, WSMessage } from './types/wsManager.types';

export class WSManager{
  private _ws!: WebSocket;
  private _id: string = "";
  private _username: string = "";
  public isConnected: boolean;

  constructor(
    private readonly _adress: string,
    private readonly _port: number
  ){
    this._createNewWS();
    this.isConnected = false;
  }

  sendChatMessage(message: string){
    const chatMessage: ChatMessage = {
      type: 'chat',
      id: this._id,
      name: this._username,
      message
    };

    this._ws.send(JSON.stringify(chatMessage));
  }

  private _onOpen(){
    const handshake: HandShakeMessage = {
      type: 'handshake',
      id: this._id,
      name: this._username
    };

    this._ws.send(JSON.stringify(handshake));
  }

  private _onError(error: any){
    console.error(`Error: ${error.message}`);
    if (error.code === 'ECONNREFUSED'){
      console.log('Connection refused, trying to reconnect in 5 seconds...');
    }
  }

  private _onMessage(data: string){
    const parsedData = JSON.parse(data) as WSMessage;

    if ( parsedData.type === 'handshake' ){
      this._onHandshake(parsedData as HandShakeMessage);
      this.isConnected = true;
    }
    else if ( parsedData.type === 'chat' ){
      this._onChat(parsedData as ChatMessage);
    }
  }

  private _onHandshake(data: HandShakeMessage){
    this._id = data.id;
    this._username = data.name;
    console.log(`Connected as ${this._username}`);
  }
  private _onChat(data: ChatMessage){
    console.log(`${data.name}: ${data.message}`);
  }

  private _createNewWS(){
    this._ws = new WebSocket(`ws://${this._adress}:${this._port}`);

    console.log(`${this._id} - ${this._username}`);

    this._ws.on('open', this._onOpen.bind(this));
    this._ws.on('error', this._onError.bind(this));
    this._ws.on('message', this._onMessage.bind(this));
    this._ws.on('close', this._onClose.bind(this));
  }

  private _onClose(){
    this.isConnected = false;
    setTimeout(() => {
      this._createNewWS();
    }, 5000);
  }
}