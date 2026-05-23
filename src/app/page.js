
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [clapDone, setClapDone] = useState(false)
  const [exit, setExit] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
      return
    }
    setClapDone(true)
    setTimeout(() => setExit(true), 600)
    setTimeout(() => router.push('/home'), 1400)
  }

  return (
    <main
      className="w-screen h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <AnimatePresence>
        {!exit && (
          <motion.div
            className="relative flex flex-col items-center"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))' }}
            animate={exit ? { rotateZ: -90, x: -800, opacity: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            {/* Top Clapper */}
            <motion.div
              className="w-80 origin-left"
              style={{ marginBottom: '-28px' }}
              animate={clapDone ? { rotateZ: 0 } : { rotateZ: -30 }}
              transition={{ duration: 0.15, ease: 'easeIn' }}
            >
              <Image src="/top.svg" alt="clapper top" width={320} height={60} />
            </motion.div>

            {/* Bottom Board */}
            <div className="relative w-80">
              <Image src="/whitebottom.svg" alt="clapper bottom" width={320} height={240} />

              {/* Form overlaid on board */}
              <div className="absolute inset-0 flex flex-col justify-center gap-3 px-8">
                <input
                  type="email"
                  placeholder="ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black text-white px-4 py-2 outline-black"
                />
                <input
                  type="password"
                  placeholder="Pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black text-white px-4 py-2 outline-black"
                />
                <button
                  onClick={handleLogin}
                  className="self-center bg-black text-white px-6 py-2 hover:opacity-80"
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
