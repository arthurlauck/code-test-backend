interface Config {
    port: number;
    nodeEnv: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 8282,
    nodeEnv: process.env.NODE_ENV || 'dev',
};

export default config;