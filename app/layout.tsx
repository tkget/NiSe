'use client';
import type { Metadata } from 'next'
import 'app/globals.css'

export const metadata: Metadata = {
  title: 'NiSe',
  description: 'prototype',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
