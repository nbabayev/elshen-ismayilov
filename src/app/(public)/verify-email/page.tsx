import { connectDB } from "@/@lib/api/db";
import VerifyEmailAction from "@/app/components/molecules/VerifyEmailAction/VerifyEmailAction";
import subscriptionService from "@/services/subscription.service";
import { notFound } from "next/navigation";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  await connectDB();
  const status = await subscriptionService.getVerifyPageStatus(token);

  if (status !== "pending" || !token) {
    notFound();
  }

  return <VerifyEmailAction token={token} />;
}
