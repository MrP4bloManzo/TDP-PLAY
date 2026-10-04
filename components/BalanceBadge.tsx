'use client'
import Link from 'next/link'
import { useStore } from '@/lib/store'
export default function BalanceBadge() {
  const { balance } = useStore()
  return <Link href="/wallet" className="rounded-lg bg-white/10 px-3 py-1 text-sm font-semibold text-green-400">{balance.toLocaleString()} TDP</Link>
}
