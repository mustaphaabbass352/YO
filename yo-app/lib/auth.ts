"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"
import { auth as firebaseAuth } from "./firebase"
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { User as FirebaseUser } from "firebase/auth"

interface AuthContextType {
  user: SupabaseUser | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithPhone: (phoneNumber: string) => Promise<{ verificationId: string }>
  verifyOtp: (verificationId: string, otp: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    const unsubscribeFirebase = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      setFirebaseUser(firebaseUser)
    })

    return () => {
      subscription.unsubscribe()
      unsubscribeFirebase()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    })

    if (error) throw error

    if (data.user) {
      const { createProfile } = await import("./supabase-utils")
      await createProfile(data.user.id, fullName, phone)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const signInWithPhone = async (phoneNumber: string) => {
    const appVerifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
      size: "invisible",
    })

    const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier)
    return { verificationId: confirmationResult.verificationId }
  }

  const verifyOtp = async (verificationId: string, otp: string, fullName?: string) => {
    const credential = PhoneAuthProvider.credential(verificationId, otp)
    const firebaseResult = await signInWithCredential(firebaseAuth, credential)
    
    const idToken = await firebaseResult.user.getIdToken()
    
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "firebase",
      token: idToken,
    })

    if (error) throw error

    if (data.user && fullName) {
      const { createProfile } = await import("./supabase-utils")
      
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()
      
      if (!existingProfile) {
        await createProfile(data.user.id, fullName, firebaseResult.user.phoneNumber || "")
      }
    }
  }

  const signOut = async () => {
    await firebaseAuth.signOut()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      loading, 
      signUp, 
      signIn, 
      signInWithPhone, 
      verifyOtp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
