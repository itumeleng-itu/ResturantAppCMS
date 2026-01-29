import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 md:p-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Illustration */}
        <div className="flex flex-col items-center lg:items-start space-y-8">
          <h1 className="text-6xl font-extrabold text-[#F97316] tracking-tighter">the eatery.</h1>
          
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            {/* SVG Donut Illustration */}
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl transform hover:scale-105 transition-transform duration-500">
               {/* Dough */}
               <circle cx="100" cy="100" r="80" fill="#FDBA74" />
               <circle cx="100" cy="100" r="30" fill="white" />
               
               {/* Icing */}
               <path d="M175,100c0,41.4-33.6,75-75,75s-75-33.6-75-75c0-15,5-30,15-40c5-5,15-10,15-20c0-10-5-15-5-20
                        c0-10,10-15,20-15c5,0,10,5,15,5c10,0,15-10,15-20c10,0,20,5,30,10c5,5,10,5,15,5
                        c15,0,30,10,35,25c5,10,10,15,10,25C185,75,175,85,175,100z" fill="#F472B6" />
               <circle cx="100" cy="100" r="30" fill="white" />
               
               {/* Sprinkles */}
               <rect x="60" y="60" width="10" height="4" rx="2" fill="#FEF08A" transform="rotate(45 60 60)" />
               <rect x="130" y="70" width="10" height="4" rx="2" fill="#60A5FA" transform="rotate(-30 130 70)" />
               <rect x="90" y="150" width="10" height="4" rx="2" fill="#A78BFA" transform="rotate(10 90 150)" />
               <rect x="150" y="110" width="10" height="4" rx="2" fill="#34D399" transform="rotate(90 150 110)" />
               <rect x="40" y="100" width="10" height="4" rx="2" fill="#F87171" transform="rotate(-15 40 100)" />
               <rect x="110" y="40" width="10" height="4" rx="2" fill="#FEF08A" transform="rotate(60 110 40)" />
               
               {/* Bite mark */}
               <circle cx="40" cy="150" r="18" fill="white" />
               <circle cx="28" cy="135" r="15" fill="white" />
               <circle cx="55" cy="160" r="15" fill="white" />
            </svg>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="flex justify-center lg:justify-end">
             <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Admin login.</h2>
                    <p className="text-gray-400 text-sm mt-2">Enter your email below to log into your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600 uppercase">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600 uppercase">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            <div className="font-semibold mb-1 flex items-center gap-2">
                                <span className="material-icons text-sm">error</span>
                                Login Failed
                            </div>
                            <div className="text-red-600">{error}</div>
                            <div className="text-xs text-red-500 mt-2 opacity-75">
                                If this persists, please contact support.
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#F97316] hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
             </div>
        </div>

      </div>
    </div>
  );
}