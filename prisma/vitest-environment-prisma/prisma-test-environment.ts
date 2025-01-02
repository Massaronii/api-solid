import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('execute')

    return {
      teardown() {
        console.log('teardown')
      },
    }
  },
}
