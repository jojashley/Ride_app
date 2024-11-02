import CustomButton from "@/components/CustomButton";
import {fetchAPI} from "@/lib/fetch";
import {router} from "expo-router";

const Payment = ({id}:{id:number}) => {
    const  openPaymentSheet = async () => {
      try{
        await fetchAPI("/(api)/modifyPaymentRides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ride_id: id,
            new_payment_status: "paid"
          }),
        });
        router.push("/(root)/(tabs)/home");
      } catch (error) {
        console.log("Error:", error.message);
      }
    };
    return (
        <>
            <CustomButton
                title="Confirm Ride"
                className="my-10"
                onPress={openPaymentSheet}
            />
        </>
    )
}

export default Payment;