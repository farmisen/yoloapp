import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"

import "~/styles/globals.css"
import { TRPCReactProvider } from "~/trpc/react"

import Navbar from "./_components/Navbar"

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }]
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Navbar />
          <main className="container mx-auto py-4">{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
