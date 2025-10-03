import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../utils/config';
import { InternetCommon } from '../utils/internet.common';
import { OpenAiConversation } from '../models/open-ai-conversation.interface';
import { LangUtils } from '../utils/lang';

@Injectable({
    providedIn: 'root'
})
export class InternetService {

    APP = Config.SERVER.dev ? 'api/v1' : 'api/v1';
    SERVER = Config.SERVER.dev ? Config.SERVER.local : Config.SERVER.remote;
    internetCommon: InternetCommon | undefined;

    constructor(
        private httpClient: HttpClient
    ) {
        this.internetCommon = new InternetCommon(this.httpClient);
    }

    //
    //  OPENAI
    //
    sendOpenAi(query: string, history: Array<OpenAiConversation>, system: string, callback: any) {
        const lang: string = LangUtils.detectLanguage();
        this.internetCommon?.doPost(this.SERVER + '/' + this.APP, {
            action: 'ReceiveUserQuestion',
            lang,
            data: {
                query,
                history,
                system,
            }
        }, callback);   
    }
    //
    //  RCS
    //
    sendRcsCard(to: string, payload: any, callback: any) {
        const lang: string = LangUtils.detectLanguage();
        this.internetCommon?.doPost(this.SERVER + '/' + this.APP, {
            action: 'SendRCS',
            lang,
            data: {
                to,
                type: 'card',
                payload,
            }
        }, callback);   
    }
}