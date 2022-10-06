import UpdateMaintenanceFee from "./UpdateMaintenanceFee";
import UpdateOwnerFee from "./UpdateOwnerFee";
import UpdateBookingBefore from "./UpdateBookingBefore";
import UpdateBookingAfter from "./UpdateBookingAfter";
import UpdateCancelBefore from "./UpdateCancelBefore";
import UpdateOfferBefore from "./UpdateOfferBefore";
import UpdateAcceptOfferBefore from "./UpdateAcceptOfferBefore";
import UpdateOfferPrice from "./UpdateOfferPrice";
import UpdateFactoryAddress from "./UpdateFactoryAddress";

export default function UpdateContract() {
  return (
    <>
      <header className="bg-white">
        <div className="mt-20 mb-20 text-center">
          <h1 className="mb-1 font-bold text-5xl ">
            Update your Smart Contract
          </h1>
        </div>
      </header>

      <main className="grid gap-4 px-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        <UpdateOwnerFee />
        <UpdateMaintenanceFee />
        <UpdateOfferPrice />

        <UpdateBookingBefore />
        <UpdateBookingAfter />
        <UpdateCancelBefore />

        <UpdateOfferBefore />
        <UpdateAcceptOfferBefore />

        <UpdateFactoryAddress />
      </main>
    </>
  );
}
