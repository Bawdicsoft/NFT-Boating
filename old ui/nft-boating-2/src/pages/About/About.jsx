import {
  AnnotationIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
} from "@heroicons/react/outline"

const features = [
  {
    name: "Competitive Pricing",
    description:
      "You will be able to purchase our services at the best available rates.",
    icon: GlobeAltIcon,
  },
  {
    name: "No hidden fees",
    description:
      "NO EXTRA CHARGES whatsoever, apart from the prices mentioned on our website.",
    icon: ScaleIcon,
  },
  {
    name: "Transfers are in Tether Coin (USDT)",
    description:
      "Transactions are lightning fast. You will become an instant owner of your NFT.",
    icon: LightningBoltIcon,
  },
  {
    name: "Prompt Notifications",
    description:
      "Notifications of transactions and amounts received are sent on the mobile phone instantly whenever the transaction takes place.",
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
          <p className="mt-4 max-w-3xl text-xl text-gray-500 lg:mx-auto">
            Our team has over 15 years of experience in cryptography, and We are
            the first Web3.0-based boat rental in the world. We believe in the
            utility of the NFT, utility NFTs work in the same way as other NFTs.
            They are cryptographically represented, and unique digital assets
            stored on a blockchain. The immutability and transparency of
            blockchain technology means that it is easy for NFT owners to prove
            that an NFT is stored in their wallet and nobody else's.
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
      </div>
    </div>
  )
}
