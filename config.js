var config = [];

mongo = {
    db:       'localdb',
    host:     'localhost',
    password: '',
    port:     27017,
    ssl:      false,
    url:      'mongodb://localhost:27017/localdb',
    username: '',
};

config['dev'] = {
    greeting: 'hola!',
    mongoUrl: 'mongodb://localhost/localdb',
    mongo_express_config: {

        mongodb: {
            server: process.env.ME_CONFIG_MONGODB_SERVER || mongo.host,
            port: process.env.ME_CONFIG_MONGODB_PORT || mongo.port,
            ssl: process.env.ME_CONFIG_MONGODB_SSL || mongo.ssl,
            sslValidate: process.env.ME_CONFIG_MONGODB_SSLVALIDATE || true,
            sslCA: [],
            autoReconnect: true,
            poolSize: 4,
            admin: process.env.ME_CONFIG_MONGODB_ENABLE_ADMIN ? process.env.ME_CONFIG_MONGODB_ENABLE_ADMIN.toLowerCase() === 'true' : false,
            auth: [
                {
                    database: process.env.ME_CONFIG_MONGODB_AUTH_DATABASE || mongo.db,
                    username: process.env.ME_CONFIG_MONGODB_AUTH_USERNAME || mongo.username,
                    password: process.env.ME_CONFIG_MONGODB_AUTH_PASSWORD || mongo.password,
                },
            ],
            adminUsername: process.env.ME_CONFIG_MONGODB_ADMINUSERNAME || '',
            adminPassword: process.env.ME_CONFIG_MONGODB_ADMINPASSWORD || '',
            whitelist: [],
            blacklist: [],
        },
        site: {
            baseUrl: process.env.ME_CONFIG_SITE_BASEURL || '/',
            cookieKeyName: 'mongo-express',
            cookieSecret: process.env.ME_CONFIG_SITE_COOKIESECRET || 'cookiesecret',
            host: process.env.VCAP_APP_HOST || 'localhost',
            port: process.env.VCAP_APP_PORT || 8081,
            requestSizeLimit: process.env.ME_CONFIG_REQUEST_SIZE || '50mb',
            sessionSecret: process.env.ME_CONFIG_SITE_SESSIONSECRET || 'sessionsecret',
            sslCert: process.env.ME_CONFIG_SITE_SSL_CRT_PATH || '',
            sslEnabled: process.env.ME_CONFIG_SITE_SSL_ENABLED || false,
            sslKey: process.env.ME_CONFIG_SITE_SSL_KEY_PATH || '',
        },
        useBasicAuth: process.env.ME_CONFIG_BASICAUTH_USERNAME !== '',
        basicAuth: {
            username: process.env.ME_CONFIG_BASICAUTH_USERNAME || 'admin',
            password: process.env.ME_CONFIG_BASICAUTH_PASSWORD || 'pass',
        },
        options: {
            console: true,
            documentsPerPage: 10,
            editorTheme: process.env.ME_CONFIG_OPTIONS_EDITORTHEME || 'rubyblue',
            maxPropSize: (100 * 1000),  // default 100KB
            maxRowSize: (1000 * 1000),  // default 1MB
            cmdType: 'eval',
            subprocessTimeout: 300,
            readOnly: false,
            collapsibleJSON: true,
            collapsibleJSONDefaultUnfold: 1,
        },
        defaultKeyNames: {}
    }
}

config['prod'] = {
    greeting: 'hello!',
    mongoUrl: 'mongodb://mongo/localdb'
}


module.exports = config;