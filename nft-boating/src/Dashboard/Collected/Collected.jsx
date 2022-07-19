import { Link, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { PencilIcon } from "@heroicons/react/solid";

const callouts = [
  {
    name: "Desk and Office",
    description: "Work from home accessories",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg",
    imageAlt:
      "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
    href: "#"
  },
  {
    name: "Self-Improvement",
    description: "Journals and note-taking",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg",
    imageAlt:
      "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
    href: "#"
  },
  {
    name: "Travel",
    description: "Daily commute essentials",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg",
    imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
    href: "#"
  }
];

export default function Collected() {
  // const navigate = useNavigate();
  
  // const buyNew = () => {
  //   navigate(`/`);
  // };

  // const [state, SetState] = useImmer({
  //   data: [],
  //   userNFT: 0
  // });

  // useEffect(() => {
  //   console.log(">");
  //   if (active) {
  //     const run = async () => {
  //       let addresses;
  //       try {
  //         addresses = await ContractFactory.getUserAllContractAddress(account);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //       console.log(addresses, account);

  //       if (addresses.length) {
  //         for (let i = 0; i < addresses.length; i++) {
  //           const ContractNFTYacht = new ethers.Contract(
  //             addresses[i],
  //             NFTYacht,
  //             provider
  //           );

  //           const name = await ContractNFTYacht.name();
  //           const symbol = await ContractNFTYacht.symbol();

  //           const date = {
  //             id: i,
  //             name: name,
  //             symbol: symbol,
  //             address: addresses[i],
  //             imageSrc:
  //               "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
  //             imageAlt: "Front of men's Basic Tee in black."
  //           };

  //           SetState(draft => {
  //             draft.userNFT = addresses.length;
  //             draft.data.push(date);
  //           });
  //         }
  //       } else {
  //         SetState(draft => {
  //           draft.userNFT = 0;
  //         });
  //       }
  //     };
  //     run();
  //   }
  // }, [active]);

  return (
    'hello'
    // <div className="Collected min-h-full">
    //   <header className="bg-white shadow">
    //     <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    //       <div className="lg:flex lg:items-center lg:justify-between">
    //         <div className="flex-1 min-w-0">
    //           <h1 className="text-3xl font-bold text-gray-900">Created</h1>
    //         </div>
    //         <div className="mt-5 flex lg:mt-0 lg:ml-4">
    //           <span className="sm:ml-3">
    //             <button
    //               onClick={buyNew}
    //               className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //             >
    //               <PencilIcon
    //                 className="-ml-1 mr-2 h-5 w-5 text-white"
    //                 aria-hidden="true"
    //               />
    //               Buy New
    //             </button>
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </header>
    //   <main>
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="max-w-2xl mx-auto py-10 sm:py-10 lg:py-10 lg:max-w-none">
    //         <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
    //           {state.data.map(Contract => (
    //             <Link
    //               to={`/contract/${Contract.address}`}
    //               key={Contract.id}
    //               className="group relative"
    //             >
    //               <div className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75  lg:aspect-none">
    //                 <img
    //                   src={Contract.imageSrc}
    //                   alt={Contract.imageAlt}
    //                   className="w-full h-full object-center object-cover lg:w-full lg:h-full"
    //                 />
    //               </div>
    //               <div className="mt-4 flex justify-between">
    //                 <div>
    //                   <h3 className="text-sm text-gray-700">
    //                     <a href="#">
    //                       <span
    //                         aria-hidden="true"
    //                         className="absolute inset-0"
    //                       />
    //                       {Contract.name}
    //                     </a>
    //                   </h3>
    //                 </div>
    //               </div>
    //             </Link>
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
}
