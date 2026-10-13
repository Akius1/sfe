import { api, ApiError } from './client'

function mockFetch(response: Response) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api client', () => {
  it('returns the body of a successful response', async () => {
    mockFetch(Response.json({ data: { id: 'txn_1' } }))
    await expect(api.get('/transactions/txn_1')).resolves.toEqual({ data: { id: 'txn_1' } })
  })

  it('throws an ApiError carrying the status, code and message of an error response', async () => {
    mockFetch(
      Response.json({ error: { code: 'NOT_FOUND', message: 'Transaction not found' } }, { status: 404 })
    )

    const error = await api.get('/transactions/nope').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 404, code: 'NOT_FOUND', message: 'Transaction not found' })
  })

  it('still throws an ApiError when the error body is not JSON', async () => {
    mockFetch(new Response('<html>Bad gateway</html>', { status: 502 }))
    await expect(api.get('/transactions')).rejects.toMatchObject({ status: 502, code: 'UNKNOWN' })
  })
})
