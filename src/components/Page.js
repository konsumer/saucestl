import React from 'react'
import { Provider, createClient } from 'urql'
import Head from 'next/head'

export const client = createClient({
  url: '/api/graphql'
})

export default ({ children, title = 'saucestl' }) => (
  <Provider value={client}>
    {children}
    <Head>
      <title>{title}</title>
    </Head>
    <style jsx global>{`
      body {
        font-family: sans-serif;
      }

      .page {
        padding: 20px;
      }
   `}</style>
  </Provider>
)
