declare const _default: {
    mongoURI: string;
    emailConfig: {
        transport: {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
        };
        defaults: {
            from: string;
        };
        template: {
            dir: string;
            options: {
                strict: boolean;
            };
        };
    };
};
export default _default;
