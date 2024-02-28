import { getUserSubscriptionPlan } from "@/lib/stripe";
import BillingForm from "@/components/BillingForm";
const page = async() => {
    const subscriptionPlan = await getUserSubscriptionPlan()
  return (
    <BillingForm subscriptionPlan = {subscriptionPlan}/>
  )
}

export default page