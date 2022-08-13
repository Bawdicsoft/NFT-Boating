import {
  AnnotationIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
} from "@heroicons/react/outline"

const features = [
  {
    name: "Competetive Pricing ",
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
    name: "Transfers are instant",
    description:
      "Transactions are lightning fast. You will become an instant owner of your NFT.",
    icon: LightningBoltIcon,
  },
  {
    name: "Prompt Notifications",
    description:
      "Notifications of transactions and amounts received are sent on mobile phone instantly whenever the transaction takes place.",
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
            We are the first Web3.0 based boat rental across the world. Using
            our years of experience in the business, we are the right choice to
            delve deep into "uncharted seas". Our goal is to provide ease of
            access to our clients and partners by eliminating hassles of payment
            modes and choosing the desired date hands on at the time of booking.
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
