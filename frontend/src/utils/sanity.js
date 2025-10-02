import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'ybaq07b6',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03'
})

export default client