import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // o objeto environmentMatchGlobs recebe um array, e dentro dele um outro array com 2 parâmetros
    // o primeiro parâmetro é o caminho dos testes, ** indica todos os arquivos dentro de /src/http/controllers
    // o segundo parâmetro do array é o nome do diretório, excluindo a primeira parte obrigatória, por exemplo:
    // se o nome do diretório é "vitest-environment-prisma", o parâmetro será "prisma"
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
})
