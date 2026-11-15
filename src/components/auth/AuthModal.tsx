import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authPromptReason, signInDemoGoogle, signInWithEmail } =
    useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    signInWithEmail(name || email.split('@')[0], email);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={mode === 'signin' ? 'Sign in to DineDubai' : 'Create your DineDubai account'}
      subtitle={
        authPromptReason ??
        'Save favorite restaurants, bookmark curated collections, and share dining notes.'
      }
      maxWidthClass="max-w-md"
    >
      <div className="space-y-5">
        <button
          type="button"
          onClick={signInDemoGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-sm font-semibold text-[#222222] transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
            />
          </svg>
          <span>Continue with Google (Demo Member)</span>
        </button>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-[#E8E2D9]" />
          <span className="shrink mx-3 text-xs text-[#222222]/50">or continue with email</span>
          <div className="flex-grow border-t border-[#E8E2D9]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-medium text-[#222222]/80 mb-1">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Al Mazrouei"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-sm text-[#222222] focus:outline-none focus:border-[#146C5B]"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium text-[#222222]/80 mb-1">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-sm text-[#222222] focus:outline-none focus:border-[#146C5B]"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-medium text-[#222222]/80 mb-1">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-sm text-[#222222] focus:outline-none focus:border-[#146C5B]"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#222222]/65">
          {mode === 'signin' ? (
            <>
              New to DineDubai?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className="font-semibold text-[#146C5B] hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className="font-semibold text-[#146C5B] hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
