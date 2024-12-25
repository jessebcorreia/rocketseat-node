import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  // é a única função que o environment precisa - ela será executada sempre antes de cada arquivo de testes
  async setup() {
    console.log('Setup')

    // o retorno é o "teardown", que será executado ao final de cada arquivo de testes
    return {
      async teardown() {
        console.log('Teardown')
      },
    }
  },
}
