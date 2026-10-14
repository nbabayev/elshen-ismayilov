import SubscriptionAction from "@/app/components/molecules/SubscriptionAction/SubscriptionAction";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <SubscriptionAction
      token={token}
      endpoint="/api/subscription/unsubscribe"
      title="Abunəlikdən çıx"
      description="Təsdiqlədikdən sonra yeniliklər barədə email bildirişləri almayacaqsınız."
      buttonLabel="Abunəlikdən çıx"
    />
  );
}
