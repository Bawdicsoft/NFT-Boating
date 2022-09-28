import {
  BadgeCheckIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/outline"
import { Link } from "react-router-dom"
import heroImg from "./../../Assets/8763487326873785.webp"

const features = [
  {
    name: "Become a member",
    description:
      "The NFT membership is a great way to stay afloat all year round! With this unique offer, you can choose any boat and rent it out for your next adventure.",
    icon: UserGroupIcon,
  },
  {
    name: "Choose your date & reserve your boat",
    description:
      "Why not make your next party or getaway a luxury yacht experience? Book today and we'll provide the rest. Might as well go out with a bang!",
    icon: CalendarIcon,
  },
  {
    name: "Grab your bathing suit & enjoy",
    description:
      "Sit back, relax, and celebrate! Our rented yachts give you the freedom and relaxation of being on open water without any worries about managing navigation or other Captains' duties.",
    icon: ClockIcon,
  },
  {
    name: "Enjoy 5 years of benefits",
    description:
      "With the purchase of one NFT boating membership, you get 5 years' worth of boat days for the price of one. That means 4 free boat days in the upcoming 4 years. That's more than twice as much fun!.",
    icon: BadgeCheckIcon,
  },
]

export default function LandingPage() {
  return (
    <>
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pt-24 lg:pb-28 xl:pb-32 ">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline text-center">
                    Decentralize leisure.
                  </span>
                </h1>
                <p className="mt-3 text-base text-justify text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Did you hear? NFTs are the future of boat ownership. Innovate
                  your weekend fun with cutting-edge blockchain technology. Get
                  memberships and services of your choice, all in one place.
                  Book yours today to experience hassle-free Web3 boat rentals!
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/listed-boats"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Book Your's Now
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/about"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      About US
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src={heroImg}
            alt=""
          />
        </div>
      </div>
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              How it works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Accessible charters. Unparalleled Service.
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              The future of boating is now possible with NFT Boating&#39;s
              revolutionary new blockchain- based system. With one simple
              transaction, you can instantly own a boat membership and enjoy all
              the perks that come along with it - from exclusive offers on
              accessories to luxury dining experiences! Claim your digital
              certificate of ownership today.
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
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to ride the waves in style?</span>
            <span className="block text-indigo-600">
              Become a member today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/listed-boats"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Book yours now,
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                About us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
