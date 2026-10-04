export async function api(path: string, body?: unknown) {
  const t = localStorage.getItem('tk')
  const r = await fetch(path, { method: body ? 'POST' : 'GET', body: body ? JSON.stringify(body) : undefined,
    headers: { 'content-type': 'application/json', ...(t ? { authorization: 'Bearer ' + t } : {}) } })
  const j = await r.json()
  if (!r.ok) throw new Error(j.error || 'Error')
  return j
}
