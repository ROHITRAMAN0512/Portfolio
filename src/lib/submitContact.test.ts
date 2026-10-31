import { describe, expect, test } from 'vitest'
import { submitContact } from './submitContact'
import type { ContactInput } from './validate'

const input: ContactInput = {
  name: '  Asha Rao ',
  email: ' asha@example.com ',
  projectType: 'Integration',
  message: '  We need a billing API built for our clinic app.  ',
  botcheck: false,
}

type FakeResponse = { ok: boolean; json?: unknown } | Error

function fakeFetch(response: FakeResponse) {
  const calls: { url: string; init: RequestInit }[] = []
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} })
    if (response instanceof Error) throw response
    return { ok: response.ok, json: async () => response.json } as Response
  }) as typeof fetch
  return { impl, calls }
}

const opts = (fetchImpl: typeof fetch, accessKey: string | null = 'key-123') => ({
  accessKey: accessKey ?? undefined,
  mailtoTo: 'me@x.com',
  fetchImpl,
})

describe('submitContact', () => {
  test('without an access key it returns a mailto link and never calls fetch', async () => {
    const { impl, calls } = fakeFetch({ ok: true, json: { success: true } })
    const result = await submitContact(input, opts(impl, null))
    expect(result.status).toBe('mailto')
    expect(result.status === 'mailto' && result.href.startsWith('mailto:me@x.com?')).toBe(true)
    expect(calls).toHaveLength(0)
  })

  test('success posts trimmed JSON to the Web3Forms endpoint once', async () => {
    const { impl, calls } = fakeFetch({ ok: true, json: { success: true } })
    const result = await submitContact(input, opts(impl))
    expect(result).toEqual({ status: 'sent' })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toBe('https://api.web3forms.com/submit')
    expect(calls[0]?.init.method).toBe('POST')
    const body = JSON.parse(String(calls[0]?.init.body))
    expect(body).toMatchObject({
      access_key: 'key-123',
      name: 'Asha Rao',
      email: 'asha@example.com',
      message: 'We need a billing API built for our clinic app.',
      subject: 'Project enquiry from Asha Rao',
    })
  })

  test('a non-ok response is an error that carries a mailto link', async () => {
    const { impl } = fakeFetch({ ok: false, json: { success: false } })
    const result = await submitContact(input, opts(impl))
    expect(result.status).toBe('error')
    expect(result.status === 'error' && result.mailtoHref.startsWith('mailto:me@x.com?')).toBe(true)
  })

  test('success:false from the service is an error', async () => {
    const { impl } = fakeFetch({ ok: true, json: { success: false, message: 'Invalid key' } })
    const result = await submitContact(input, opts(impl))
    expect(result.status === 'error' && result.message).toBe('Invalid key')
  })

  test('a rejected fetch is an error', async () => {
    const { impl } = fakeFetch(new Error('network down'))
    const result = await submitContact(input, opts(impl))
    expect(result.status).toBe('error')
  })

  test('a message with a lone surrogate still resolves instead of throwing', async () => {
    const { impl } = fakeFetch({ ok: true, json: { success: true } })
    const broken = { ...input, message: 'a pasted message that ends in half an emoji \uD83D' }
    await expect(submitContact(broken, opts(impl, null))).resolves.toMatchObject({ status: 'mailto' })
    await expect(submitContact(broken, opts(impl))).resolves.toEqual({ status: 'sent' })
  })

  test('a tripped honeypot reports sent without calling fetch', async () => {
    const { impl, calls } = fakeFetch({ ok: true, json: { success: true } })
    const result = await submitContact({ ...input, botcheck: true }, opts(impl))
    expect(result).toEqual({ status: 'sent' })
    expect(calls).toHaveLength(0)
  })
})
