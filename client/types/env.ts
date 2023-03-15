declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GOOGLE_API_TOKEN: string,
            OPENAI_API_TOKEN: string
        }
    }
}

export {}