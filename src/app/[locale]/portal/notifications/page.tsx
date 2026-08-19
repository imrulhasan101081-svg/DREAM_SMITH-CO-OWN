import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations, getLocale } from 'next-intl/server';
import { redirect, Link } from "@/i18n/navigation";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/Notification";

export const dynamic = "force-dynamic";

export default async function PortalNotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "investor") redirect({ href: "/login", locale: await getLocale() });

  const t = await getTranslations('Portal.notifications');

  await dbConnect();

  // Mark all unread notifications for this user as read
  await Notification.updateMany(
    { recipientId: session.user.id, isRead: false },
    { $set: { isRead: true } }
  );

  const notifications = await Notification.find({ recipientId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <div className="max-w-[800px]">
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">{t('title')}</h1>
        <p className="text-[14px] text-ink/60">{t('description')}</p>
      </div>

      <div className="card-elevated overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-ink/50">
            {t('emptyState')}
          </div>
        ) : (
          <div className="divide-y divide-line-light">
            {notifications.map((notif: any) => (
              <div key={notif._id.toString()} className={`p-6 flex gap-5 ${notif.isRead ? 'bg-white' : 'bg-ivory/50'}`}>
                <div className="w-10 h-10 rounded-full bg-ivory-dim border border-line-light flex items-center justify-center shrink-0">
                  <span className="text-[16px]">
                    {notif.type === 'kyc_verified' || notif.type === 'document_approved' ? '✓' :
                     notif.type === 'document_submitted' || notif.type === 'document_revision' || notif.type === 'document_rejected' ? '📄' :
                     notif.type === 'certificate_issued' ? '🏆' :
                     notif.type === 'system_alert' ? '🔔' : 'ℹ️'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-navy text-[15px] mb-1">{notif.title}</h3>
                  <p className="text-[13.5px] text-ink/80 leading-relaxed mb-3">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-ink/40 tracking-wider">
                      {new Date(notif.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {notif.link && (
                      <Link href={notif.link} className="text-[12px] font-medium text-gold hover:text-gold-bright transition-colors">
                        {t('viewDetails')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
