export default function NFT() {
  return (
    <div className="NFT min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">NFT</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8"> */}
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-4 md:gap-10">
              <div className="md:col-span-2">
                <div className="px-4 sm:px-0">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg"
                    alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                    className="bg-gray-100 rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <h1 className="text-3xl mt-10 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Technical Specifications
                </h1>
                <p className="mt-4 text-gray-500">
                  The walnut wood card tray is precision milled to perfectly fit
                  a stack of Focus cards. The powder coated steel divider
                  separates active cards from new ones, or can be used to
                  archive important task lists.
                </p>

                <div className="md:grid md:grid-cols-4 md:gap-10">
                  <button className="md:col-span-2 cursor-pointer mt-20 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    hello
                  </button>
                  <button className="md:col-span-2 cursor-pointer mt-20 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    hello
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </main>
    </div>
  );
}
