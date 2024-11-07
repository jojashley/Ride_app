import CustomButton from "@/components/CustomButton";
import {fetchAPI} from "@/lib/fetch";
import {router} from "expo-router";
import { useUser } from "@clerk/clerk-expo";

const Payment = ({id, email}:{id:number, email:string}) => {
  const { user } = useUser();
    const  openPaymentSheet = async () => {
      try{
        await fetchAPI("/(api)/modifyPaymentRides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ride_id: id,
            new_payment_status: "reserved"
          }),
        });
        const response = await fetchAPI("/(api)/userRides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
            rideId: id,
          }),
        });
        console.log(response);
        router.push("/(root)/(tabs)/home");
        //if(user) {console.log(user?.emailAddresses[0].emailAddress ?? "")}
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