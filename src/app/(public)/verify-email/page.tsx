import SubscriptionAction from "@/app/components/molecules/SubscriptionAction/SubscriptionAction";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <SubscriptionAction
      token={token}
      endpoint="/api/subscription/verify"
      title="Email ünvanını təsdiqlə"
      description="Abunəliyi aktivləşdirmək üçün aşağıdakı düyməyə klikləyin."
      buttonLabel="Abunəliyi təsdiqlə"
    />
  );
}
