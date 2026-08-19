'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('ContactForm');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('genericError'));
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setError(err.message || t('genericError'));
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-sage/10 text-sage flex items-center justify-center text-[24px] mx-auto mb-5">✓</div>
        <h4 className="font-serif text-[20px] text-navy mb-2">{t('successTitle')}</h4>
        <p className="text-[14px] text-ink/60 mb-6">{t('successMessage')}</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-[13px] font-medium text-gold-bright hover:underline"
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="bg-red-50 text-red-700 p-4 text-[13px] rounded-sm">{error}</div>
      )}
      <div>
        <label className="block text-[13px] font-medium text-navy mb-1">{t('fullName')}</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px] disabled:opacity-50"
          placeholder={t('fullNamePlaceholder')}
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium text-navy mb-1">{t('email')}</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px] disabled:opacity-50"
          placeholder={t('emailPlaceholder')}
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium text-navy mb-1">{t('phone')}</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px] disabled:opacity-50"
          placeholder={t('phonePlaceholder')}
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium text-navy mb-1">{t('message')}</label>
        <textarea
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className="w-full border border-line-light rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-[14px] resize-y disabled:opacity-50"
          placeholder={t('messagePlaceholder')}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-gold text-navy-deep py-3.5 font-semibold rounded-sm hover:bg-gold-bright transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? t('sending') : t('send')}
      </button>
    </form>
  );
}
