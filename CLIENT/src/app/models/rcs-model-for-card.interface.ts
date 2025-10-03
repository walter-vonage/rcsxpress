export interface RCSModelForCard {
    id?: number,
    title: string,
    description: string,
    image: string,
    buttons: Array<{
        label: string,
        type: 'reply' | 'url',
        reply?: string,
        url?: string
    }>,
    phoneToSendMessage: string
}