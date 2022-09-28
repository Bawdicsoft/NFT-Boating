import {
  AnnotationIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
} from "@heroicons/react/outline"

const features = [
  {
    name: "Competitive pricing",
    description:
      "Purchase your yearly boating membership at the best market rates, every day purchased is worth it for 5 days.",
    icon: GlobeAltIcon,
  },
  {
    name: "Transfer in Tether Coin (USDT) or NFTility Coin (NNT)",
    description:
      "Transfers are processed at lightning speed, meaning you become an NFT Boating membership owner instantly.",
    icon: ScaleIcon,
  },
  {
    name: "No hidden fees",
    description:
      "We don't do additional charges. The price you see at checkout is the full price.",
    icon: LightningBoltIcon,
  },
  {
    name: "Prompt notifications",
    description:
      "A notification of your transaction and the amount paid are sent to your mobile phone instantly.",
    icon: AnnotationIcon,
  },
]

export default function About() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            About Us
          </p>
          <p className="mt-4 max-w-3xl text-base text-gray-500 lg:mx-auto">
            NFT Boating is a company dedicated to decentralizing boat rentals
            through an innovative NFT membership program. As the first-ever
            Web3-based boat rental service for boats worldwide - we are here to
            make your nautical dreams come true!
          </p>
          <p className="mt-4 max-w-3xl text-base text-gray-500 lg:mx-auto">
            Cryptography is a serious business, and our team has over 15 years
            of experience in the field. We believe in the power of utility NFTs:
            They are cryptographically represented, unique digital assets stored
            on a blockchain. Using NFTs to represent boating memberships is an
            innovative way of partnering with our clients. With our unique
            NFTility tokens, we offer customers an unforgettable experience with
            decentralized assets. It's a win-win scenario.
          </p>
          <p className="mt-4 max-w-3xl text-base text-gray-500 lg:mx-auto">
            NFTs, or non-fungible tokens, are stored on the blockchain and act
            as a certificate of ownership. The immutability and transparency of
            blockchain technology means that it is easy for NFT owners to prove
            that an NFT is stored in their wallet and nobody else's.
          </p>
          <p className="mt-4 max-w-3xl text-base text-gray-500 lg:mx-auto">
            NFT boating allows renters to enjoy all the benefits of owning a
            boat without the hassle of storage. Yachts can be rented for short
            periods of time, making them perfect for weekend getaways. So,
            whether you're in the mood for a luxurious yacht party or a romantic
            getaway, NFT boating has you covered.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-10 text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          How it Works
        </p>
        <div className="grid grid-cols-2 gap-5">
          <div className="mt-10">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              For Hosts
            </h3>
            <div className="mt-4">
              <ul className="list-disc space-y-2 pl-4 text-sm">
                <li className="text-gray-400">
                  <span className="text-sm font-medium text-gray-900">
                    Request boat listing :{" "}
                  </span>
                  <span className="text-gray-600">
                    Hosts can register by providing their boat's details and
                    their wallet address.
                  </span>
                </li>
                <li className="text-gray-400">
                  <span className="text-sm font-medium text-gray-900">
                    Get approved :{" "}
                  </span>
                  <span className="text-gray-600">
                    Once you get approved, your boat is listed in a smart
                    contract, and you can start renting to users.
                  </span>
                </li>
                <li className="text-gray-400">
                  <span className="text-sm font-medium text-gray-900">
                    Select your guests & start earning :{" "}
                  </span>
                  <span className="text-gray-600">
                    As the host, you can select which hosts to approve for your
                    rental. Earn 80% on all your hosting transactions.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              For Membership Holders
            </h3>
            <div className="mt-4">
              <ul className="list-disc space-y-2 pl-4 text-sm">
                <li className="text-gray-400">
                  <span className="text-sm font-medium text-gray-900">
                    Register :{" "}
                  </span>
                  <span className="text-gray-600">
                    Purchase your membership by minting a ticket. The yearly
                    maintenance fee is $300 USDT, which includes the boat and
                    your PPE (safety kit). Upon purchase, your membership is
                    valid for 5 years.
                  </span>
                </li>
                <li className="text-gray-400">
                  <span className="text-sm font-medium text-gray-900">
                    Book :{" "}
                  </span>
                  <span className="text-gray-600">
                    Place your boat rental booking up to as much as 30 days in
                    advance. Each membership can be redeemed for one booking per
                    year. Additional fees, such as captain, fuel, and food &
                    beverage fees, may apply.
                  </span>
                </li>
                <li className="text-gray-400">
                  <span className="text-sm font-medium text-gray-900">
                    Get approved and sail away :{" "}
                  </span>
                  <span className="text-gray-600">
                    Once you get approved by the host, pack your bags, and get
                    ready to make unforgettable memories!
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
