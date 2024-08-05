import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Telegram Mini App',
  description: 'A simple Telegram Mini App using Next.js 14'
};

async function fetchWelcomeAudio(username: string): Promise<Blob> {
  const response = await fetch('https://your-flask-app-url/generate_audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch audio');
  }

  return response.blob();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const initData = window.Telegram.WebApp.initDataUnsafe;
    if (initData?.user?.username) {
      setUsername(initData.user.username);
    }
  }, []);

  useEffect(() => {
    if (username) {
      async function playWelcomeAudio() {
        try {
          const audioBlob = await fetchWelcomeAudio(username);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }

      playWelcomeAudio();
    }
  }, [username]);

  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        {React.cloneElement(children, { username })}
      </body>
    </html>
  );
}
