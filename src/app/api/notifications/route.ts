import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/Notification";

export const dynamic = "force-dynamic";

// GET /api/notifications — get all unread notifications for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Use adminId if it's an admin, otherwise use the generic user id
    const userId = (session.user as any).adminId || session.user.id;
    
    if (!userId) {
      return NextResponse.json({ error: "No user ID found" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") !== "false";
    
    const filter: Record<string, unknown> = { recipientId: userId };
    if (unreadOnly) filter.isRead = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("Notifications GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/notifications — mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = (session.user as any).adminId || session.user.id;

    const body = await req.json();
    const { notificationIds, markAll } = body; // array of IDs to mark read, or markAll=true

    if (markAll) {
      await Notification.updateMany(
        { recipientId: userId, isRead: false },
        { isRead: true }
      );
    } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, recipientId: userId },
        { isRead: true }
      );
    } else {
      return NextResponse.json({ error: "No notifications specified" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notifications PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
