import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
})

const signupSchema = z.object({
  fullName: z.string().min(2, 'שם מלא חייב להכיל לפחות 2 תווים'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות לא תואמות",
  path: ["confirmPassword"],
})

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn, signUp } = useAuthStore()

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onLoginSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
      toast.success('ברוך הבא! מתחבר למערכת...')
    } catch (error) {
      toast.error('שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignupSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    try {
      await signUp(data.email, data.password, data.fullName)
      toast.success('נרשמת בהצלחה! בדוק את האימייל לאימות החשבון.')
      setIsSignup(false)
    } catch (error) {
      toast.error('שגיאה ברישום. נסה שוב.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-apple-blue/20 to-apple-purple/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-apple-pink/20 to-apple-orange/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="apple-card p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-apple-blue to-apple-purple rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-apple-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="heading-lg mb-2">מנהל משימות מודרני</h1>
            <p className="text-caption">
              {isSignup ? 'צור חשבון חדש' : 'היכנס לחשבון שלך'}
            </p>
          </div>

          {/* Tabs */}
          <div className="nav-apple mb-6">
            <button
              className={`nav-item ${!isSignup ? 'nav-item-active' : ''}`}
              onClick={() => setIsSignup(false)}
            >
              התחברות
            </button>
            <button
              className={`nav-item ${isSignup ? 'nav-item-active' : ''}`}
              onClick={() => setIsSignup(true)}
            >
              הרשמה
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {!isSignup ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 inline ml-2" />
                    כתובת אימייל
                  </label>
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    className="input-apple"
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Lock className="w-4 h-4 inline ml-2" />
                    סיסמה
                  </label>
                  <div className="relative">
                    <input
                      {...loginForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="input-apple pr-12"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner-apple w-5 h-5 ml-2" />
                      מתחבר...
                    </div>
                  ) : (
                    'התחבר'
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline ml-2" />
                    שם מלא
                  </label>
                  <input
                    {...signupForm.register('fullName')}
                    type="text"
                    className="input-apple"
                    placeholder="השם המלא שלך"
                    disabled={isLoading}
                  />
                  {signupForm.formState.errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 inline ml-2" />
                    כתובת אימייל
                  </label>
                  <input
                    {...signupForm.register('email')}
                    type="email"
                    className="input-apple"
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Lock className="w-4 h-4 inline ml-2" />
                    סיסמה
                  </label>
                  <div className="relative">
                    <input
                      {...signupForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="input-apple pr-12"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Lock className="w-4 h-4 inline ml-2" />
                    אימות סיסמה
                  </label>
                  <div className="relative">
                    <input
                      {...signupForm.register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="input-apple pr-12"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner-apple w-5 h-5 ml-2" />
                      נרשם...
                    </div>
                  ) : (
                    'הירשם'
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Demo Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              <strong>זוהי גרסת דמו:</strong> השתמש בכל אימייל וסיסמה להתחברות
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Fix for AnimatePresence import
const AnimatePresence = motion.div