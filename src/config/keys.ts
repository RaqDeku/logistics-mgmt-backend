export default {
    mongoURI: "mongodb+srv://s224dr:4MGkPQ2yPT8VEK2z@cluster0.5lx2kws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    emailConfig: {
      transport: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || 'your-email@example.com',
          pass: process.env.SMTP_PASS || 'your-password',
        },
      },
      defaults: {
        from: '"Your App" <your-email@example.com>',
      },
      template: {
        dir: __dirname + '/templates',
        // adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }
}