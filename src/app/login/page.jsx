'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLanguage } from "@/lib/LanguageContext"

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false);



  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log(data)
      const response = await fetch('backendforfamily-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Login failed');
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      toast.success('Login successful!');
      router.push('/'); // Redirect to dashboard
    } catch (error) {
      toast.error(error.message || 'Error logging in.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t.loginTitle}</CardTitle>
            <CardDescription className="text-center">{t.loginDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parentUsername">{t.parentUsername}</Label>
                <Input
                  id="parentUsername"
                  type="text"
                  placeholder={t.parentUsernamePlaceholder}
                  {...register("parentUsername", { required: t.parentUsernameRequired })}
                />
                {errors.parentUsername && (
                  <p className="text-sm text-red-500">{errors.parentUsername.message}</p>
                )}
              </div>
        
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    {...register("password", { required: t.passwordRequired })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  {t.loggingIn}
                </motion.div>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> {t.login}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '10px',
          },
        }}
      />
    </div>
  )
}

export default LoginForm;
