
export class Config {

    public static VERSION = '0.0.1';   
    public static dev = true;

    public static SERVER = {
        dev: true,
        local: 'http://localhost:3020',
        remote: 'https://8a7f2c328ff6.ngrok-free.app',
    }

    public static CLIENT = {
        dev: true,
        local: 'http://localhost:4200/#',
        remote: 'https://vonage.com/#',
    }

}