import React from "react";
import Subscriptions from "@/services/subscription.service";
const SubscriptionPage = async () => {
  const subs = await Subscriptions.getSubscribers(10, 1);
  console.log(subs);
  return <div>page</div>;
};

export default SubscriptionPage;
