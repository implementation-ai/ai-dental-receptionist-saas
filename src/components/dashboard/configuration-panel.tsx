'use client'

import React, { useEffect, useState } from 'react'

export default function ConfigurationPanel() {
  const [greeting, setGreeting] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const tenantId = 'demo-tenant'

  useEffect(() => {
    fetchPrompt()
  }, [])

  async function fetchPrompt() {
    setLoading(true)
    try {
      const res = await fetch(`/api/prompts/${tenantId}/greeting`)
      if (res.ok) {
        const data = await res.json()
        setGreeting(data.template_content ?? '')
      } else {
        setGreeting('')
      }
    } catch (err) {
      console.error(err)
      setGreeting('')
    } finally {
      setLoading(false)
    }
  }

  async function savePrompt() {
    setLoading(true)
    try {
      await fetch(`/api/prompts/${tenantId}/greeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_content: greeting })
      })
      alert('Saved')
    } catch (err) {
      console.error(err)
      alert('Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Prompts - Configuration (Demo)</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700">Greeting Prompt</label>
          <textarea
            className="w-full mt-2 p-2 border rounded"
            rows={6}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
          />
          <div className="mt-2">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded"
              onClick={savePrompt}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )

}