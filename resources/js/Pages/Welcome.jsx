import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Future-Ready Smart Banking" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/40 to-pink-900/20"></div>
                
                {/* Geometric background shapes */}
                <div className="absolute top-0 right-0 w-1/2 h-full">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    {/* Navigation */}
                    <nav className="flex justify-between items-center px-6 py-8 lg:px-12">
                        <div className="flex items-center space-x-3">
                            {/* Bank Logo */}
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-white text-xl font-bold">FutureBank</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-white/80 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <main className="flex-1 flex items-center justify-center px-6 lg:px-12">
                        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Side - Content */}
                            <div className="text-left">
                                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                    BIG bucks,<br />
                                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                        SMA3T BANKING
                                    </span>
                                </h1>
                                
                                <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-lg">
                                    YuHp Zhis is a space to welcome visitors to the site. 
                                    Grab their attention with copy that clearly 
                                    states what the site is about. and ofcourse this is going to be long text to test the layout.

                                    otherwise, this is bonita speaking.

                                    <i color='red' style={{fontSize: '20px'}} fontfamily='verdana'>Bonnie</i>
                                </p>
                                
                                {!auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
                                    >
                                        Get Started
                                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )}
                                
                                {auth.user && (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
                                    >
                                        Go to Dashboard
                                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                            
                            {/* Right Side - Visual Elements */}
                            <div className="relative">
                                {/* Banking Card Mockup */}
                                <div className="relative">
                                    <div className="w-80 h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-300">
                                        <div className="p-6 h-full flex flex-col justify-between text-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm opacity-80">Balance</p>
                                                    <p className="text-2xl font-bold">$12,500.00</p>
                                                </div>
                                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm opacity-80">**** **** **** 1234</p>
                                                <div className="flex justify-between items-end mt-2">
                                                    <div>
                                                        <p className="text-xs opacity-60">Valid Thru</p>
                                                        <p className="text-sm">12/28</p>
                                                    </div>
                                                    <p className="text-lg font-semibold">FutureBank</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Second Card */}
                                    <div className="absolute -top-4 -right-4 w-80 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl transform -rotate-3 hover:-rotate-1 transition-transform duration-300">
                                        <div className="p-6 h-full flex flex-col justify-between text-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm opacity-80">Savings</p>
                                                    <p className="text-2xl font-bold">$25,750.00</p>
                                                </div>
                                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm opacity-80">**** **** **** 5678</p>
                                                <div className="flex justify-between items-end mt-2">
                                                    <div>
                                                        <p className="text-xs opacity-60">Valid Thru</p>
                                                        <p className="text-sm">09/27</p>
                                                    </div>
                                                    <p className="text-lg font-semibold">FutureBank</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Elements */}
                                <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                            </div>
                        </div>
                    </main>
                    
                    {/* Features Section */}
                    <section className="px-6 lg:px-12 pb-20">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Secure Banking</h3>
                                    <p className="text-white/70">Bank-level security with advanced encryption and fraud protection.</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Instant Transfers</h3>
                                    <p className="text-white/70">Send and receive money instantly with real-time notifications.</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Smart Analytics</h3>
                                    <p className="text-white/70">Track your Zpending with intelligent ins1ghts and budget1ng t00ls.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
