import dbConnect from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  await dbConnect();

  const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">Contact Messages</h1>
        <p className="text-[14px] text-ink/60">Messages submitted through the public Contact page.</p>
      </div>

      <div className="bg-white border border-line-light rounded-sm shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-ink/50">No messages received yet.</div>
        ) : (
          <div className="divide-y divide-line-light">
            {messages.map((m: any) => (
              <div key={m._id.toString()} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-navy text-[15px]">{m.name}</div>
                    <div className="text-[13px] text-ink/60">
                      <a href={`mailto:${m.email}`} className="hover:text-gold-bright">{m.email}</a>
                      {m.phone ? ` · ${m.phone}` : ''}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-ink/40 tracking-wider whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[14px] text-ink/80 leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
