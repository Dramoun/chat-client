import { HandShakeMessage, ChatMessage, WSMessage } from './wsManager.types';

export class WSManager{
  private _ws!: WebSocket;
  private _id: string = "";
  private _username: string = "";
  public isConnected: boolean;

  constructor(
    private readonly _adress: string,
    private readonly _port: number,
    private chatMessageHandler: (message: ChatMessage) => void,
    private handShakeMessageHandler: (message: HandShakeMessage) => void,
    private handleWsErrorHandler: (error:Event) => void
  ){
    this._createNewWS();
    this.isConnected = false;
  }

  public sendChatMessage(message: string){
    const chatMessage: ChatMessage = {
      type: 'chat',
      id: this._id,
      name: this._username,
      message
    };

    this._ws.send(JSON.stringify(chatMessage));
  }

  public _onOpen(){
    const handshake: HandShakeMessage = {
      type: 'handshake',
      id: this._id,
      name: this._username
    };

    this._ws.send(JSON.stringify(handshake));
  }

  // todo update on error to display we are not connected
  private _onError(error: Event) {
    console.error('WebSocket error:', error);
    this.handleWsErrorHandler(error);
    console.log('Attempting to reconnect in 5 seconds...');
  }

  private _onMessage(data: string){
    const parsedData = JSON.parse(data) as WSMessage;

    if ( parsedData.type === 'handshake' ){
      this.onHandshake(parsedData as HandShakeMessage);
      this.handShakeMessageHandler(parsedData as HandShakeMessage);
      this.isConnected = true;
    }
    else if ( parsedData.type === 'chat' ){
      this._onChat(parsedData as ChatMessage);
      this.chatMessageHandler(parsedData as ChatMessage)
    }
  }

  public onHandshake(data: HandShakeMessage){
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

    this._ws.addEventListener('open', this._onOpen.bind(this));
    this._ws.addEventListener('error', this._onError.bind(this));
    this._ws.addEventListener('message', (event) => this._onMessage(event.data));
    this._ws.addEventListener('close', this._onClose.bind(this));
  }

  private _onClose(){
    this.isConnected = false;
    setTimeout(() => {
      this._createNewWS();
    }, 5000);
  }
}