'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Car, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be 10 digits').max(13, 'Invalid phone'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  vehicleMake: z.string().min(1, 'Vehicle make required'),
  vehicleModel: z.string().min(1, 'Vehicle model required'),
  licensePlate: z.string().min(5, 'Invalid license plate').toUpperCase(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const evModels = [
  { make: 'Tata', models: ['Nexon EV', 'Tiago EV', 'Punch EV', 'Tigor EV'] },
  { make: 'MG', models: ['ZS EV', 'Comet EV'] },
  { make: 'Hyundai', models: ['Ioniq 5', 'Kona Electric'] },
  { make: 'Kia', models: ['EV6', 'Niro EV'] },
  { make: 'BYD', models: ['Atto 3', 'Seal'] },
  { make: 'Other', models: ['Other'] },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, trigger, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const selectedMake = watch('vehicleMake');

  const goToStep2 = async () => {
    const valid = await trigger(['name', 'email', 'phone', 'password', 'confirmPassword']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: RegisterForm) => {
    await new Promise(r => setTimeout(r, 800));
    setSuccess(true);
    setTimeout(() => router.push('/auth/login'), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Account Created!</h2>
          <p className="text-white/50">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-volt-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-volt-500 flex items-center justify-center shadow-lg shadow-electric-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">VoltMap</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Create your account</h1>
          <p className="text-white/40 mt-2 text-sm">Join Bangalore's EV charging network</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-electric-500' : 'bg-white/10'}`} />
              <div className={`text-xs mt-1 text-center transition-colors ${s === step ? 'text-electric-400' : s < step ? 'text-white/40' : 'text-white/20'}`}>
                {s === 1 ? 'Personal Info' : 'Vehicle Details'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900/60 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input {...register('name')} type="text" placeholder="Arjun Sharma" className="input-field pl-10" />
                  </div>
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input {...register('email')} type="email" placeholder="you@example.com" className="input-field pl-10" />
                  </div>
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input {...register('phone')} type="tel" placeholder="+91 9876543210" className="input-field pl-10" />
                  </div>
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" className="input-field pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input {...register('confirmPassword')} type="password" placeholder="Repeat password" className="input-field pl-10" />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button type="button" onClick={goToStep2} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="w-5 h-5 text-electric-400" />
                  <h3 className="font-semibold text-white">Your EV Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Vehicle Make</label>
                  <select {...register('vehicleMake')} className="input-field">
                    <option value="">Select make</option>
                    {evModels.map(({ make }) => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                  {errors.vehicleMake && <p className="text-xs text-red-400 mt-1">{errors.vehicleMake.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Vehicle Model</label>
                  <select {...register('vehicleModel')} className="input-field" disabled={!selectedMake}>
                    <option value="">Select model</option>
                    {evModels.find(m => m.make === selectedMake)?.models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  {errors.vehicleModel && <p className="text-xs text-red-400 mt-1">{errors.vehicleModel.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">License Plate</label>
                  <input {...register('licensePlate')} type="text" placeholder="KA01AB1234" className="input-field uppercase" />
                  {errors.licensePlate && <p className="text-xs text-red-400 mt-1">{errors.licensePlate.message}</p>}
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                    Back
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                    ) : (
                      <>Create Account <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-electric-400 hover:text-electric-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
