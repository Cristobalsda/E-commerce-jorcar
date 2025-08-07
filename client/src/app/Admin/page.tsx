export default function Admin() {
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
          <div className="absolute mx-4 -mt-4 grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 bg-clip-border text-white shadow-lg shadow-blue-500/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-6 w-6 text-white"
            >
              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
              <path
                fillRule="evenodd"
                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                clipRule="evenodd"
              ></path>
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="text-blue-gray-600 block font-sans text-sm font-normal leading-normal antialiased">
              Ventas de hoy
            </p>
            <h4 className="text-blue-gray-900 block font-sans text-2xl font-semibold leading-snug tracking-normal antialiased">
              $53k
            </h4>
          </div>
          <div className="border-blue-gray-50 border-t p-4">
            <p className="text-blue-gray-600 block font-sans text-base font-normal leading-relaxed antialiased">
              <strong className="text-green-500">+55%</strong>&nbsp;than last week
            </p>
          </div>
        </div>
        <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
          <div className="absolute mx-4 -mt-4 grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-pink-600 to-pink-400 bg-clip-border text-white shadow-lg shadow-pink-500/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-6 w-6 text-white"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="text-blue-gray-600 block font-sans text-sm font-normal leading-normal antialiased">
              Today's Users
            </p>
            <h4 className="text-blue-gray-900 block font-sans text-2xl font-semibold leading-snug tracking-normal antialiased">
              2,300
            </h4>
          </div>
          <div className="border-blue-gray-50 border-t p-4">
            <p className="text-blue-gray-600 block font-sans text-base font-normal leading-relaxed antialiased">
              <strong className="text-green-500">+3%</strong>&nbsp;than last month
            </p>
          </div>
        </div>
        <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
          <div className="absolute mx-4 -mt-4 grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-green-600 to-green-400 bg-clip-border text-white shadow-lg shadow-green-500/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-6 w-6 text-white"
            >
              <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="text-blue-gray-600 block font-sans text-sm font-normal leading-normal antialiased">
              Nuevos Clientes
            </p>
            <h4 className="text-blue-gray-900 block font-sans text-2xl font-semibold leading-snug tracking-normal antialiased">
              3,462
            </h4>
          </div>
          <div className="border-blue-gray-50 border-t p-4">
            <p className="text-blue-gray-600 block font-sans text-base font-normal leading-relaxed antialiased">
              <strong className="text-red-500">-2%</strong>&nbsp;than yesterday
            </p>
          </div>
        </div>
        <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
          <div className="absolute mx-4 -mt-4 grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 bg-clip-border text-white shadow-lg shadow-orange-500/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-6 w-6 text-white"
            >
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
            </svg>
          </div>
          <div className="p-4 text-right">
            <p className="text-blue-gray-600 block font-sans text-sm font-normal leading-normal antialiased">Ventas</p>
            <h4 className="text-blue-gray-900 block font-sans text-2xl font-semibold leading-snug tracking-normal antialiased">
              $103,430
            </h4>
          </div>
          <div className="border-blue-gray-50 border-t p-4">
            <p className="text-blue-gray-600 block font-sans text-base font-normal leading-relaxed antialiased">
              <strong className="text-green-500">+5%</strong>&nbsp;than yesterday
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="relative flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-md xl:col-span-2">
          <div className="relative m-0 flex items-center justify-between overflow-hidden rounded-xl bg-transparent bg-clip-border p-6 text-gray-700 shadow-none">
            <div>
              <h6 className="text-blue-gray-900 mb-1 block font-sans text-base font-semibold leading-relaxed tracking-normal antialiased">
                Projects
              </h6>
              <p className="text-blue-gray-600 flex items-center gap-1 font-sans text-sm font-normal leading-normal antialiased">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-4 w-4 text-blue-500"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                </svg>
                <strong>30 done</strong> this month
              </p>
            </div>
            <button
              aria-expanded="false"
              aria-haspopup="menu"
              id=":r5:"
              className="middle none text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 relative h-8 max-h-[32px] w-8 max-w-[32px] rounded-lg text-center font-sans text-xs font-medium uppercase transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currenColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
          <div className="overflow-x-scroll p-6 px-0 pb-2 pt-0">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                    <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                      companies
                    </p>
                  </th>
                  <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                    <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                      budget
                    </p>
                  </th>
                  <th className="border-blue-gray-50 border-b px-6 py-3 text-left">
                    <p className="text-blue-gray-400 block font-sans text-[11px] font-medium uppercase antialiased">
                      completion
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="flex items-center gap-4">
                      <p className="text-blue-gray-900 block font-sans text-sm font-bold leading-normal antialiased">
                        Material XD Version
                      </p>
                    </div>
                  </td>

                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <p className="text-blue-gray-600 block font-sans text-xs font-medium antialiased">$14,000</p>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="w-10/12">
                      <p className="text-blue-gray-600 mb-1 block font-sans text-xs font-medium antialiased">60%</p>
                      <div className="flex-start bg-blue-gray-50 flex h-1 w-full overflow-hidden rounded-sm font-sans text-xs font-medium">
                        <div className="flex h-full items-center justify-center bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="flex items-center gap-4">
                      <p className="text-blue-gray-900 block font-sans text-sm font-bold leading-normal antialiased">
                        Add Progress Track
                      </p>
                    </div>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <p className="text-blue-gray-600 block font-sans text-xs font-medium antialiased">$3,000</p>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="w-10/12">
                      <p className="text-blue-gray-600 mb-1 block font-sans text-xs font-medium antialiased">10%</p>
                      <div className="flex-start bg-blue-gray-50 flex h-1 w-full overflow-hidden rounded-sm font-sans text-xs font-medium">
                        <div className="flex h-full items-center justify-center bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="flex items-center gap-4">
                      <p className="text-blue-gray-900 block font-sans text-sm font-bold leading-normal antialiased">
                        Fix Platform Errors
                      </p>
                    </div>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <p className="text-blue-gray-600 block font-sans text-xs font-medium antialiased">Not set</p>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="w-10/12">
                      <p className="text-blue-gray-600 mb-1 block font-sans text-xs font-medium antialiased">100%</p>
                      <div className="flex-start bg-blue-gray-50 flex h-1 w-full overflow-hidden rounded-sm font-sans text-xs font-medium">
                        <div className="flex h-full items-center justify-center bg-gradient-to-tr from-green-600 to-green-400 text-white"></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="flex items-center gap-4">
                      <p className="text-blue-gray-900 block font-sans text-sm font-bold leading-normal antialiased">
                        Launch our Mobile App
                      </p>
                    </div>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <p className="text-blue-gray-600 block font-sans text-xs font-medium antialiased">$20,500</p>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="w-10/12">
                      <p className="text-blue-gray-600 mb-1 block font-sans text-xs font-medium antialiased">100%</p>
                      <div className="flex-start bg-blue-gray-50 flex h-1 w-full overflow-hidden rounded-sm font-sans text-xs font-medium">
                        <div className="flex h-full items-center justify-center bg-gradient-to-tr from-green-600 to-green-400 text-white"></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="flex items-center gap-4">
                      <p className="text-blue-gray-900 block font-sans text-sm font-bold leading-normal antialiased">
                        Add the New Pricing Page
                      </p>
                    </div>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <p className="text-blue-gray-600 block font-sans text-xs font-medium antialiased">$500</p>
                  </td>
                  <td className="border-blue-gray-50 border-b px-5 py-3">
                    <div className="w-10/12">
                      <p className="text-blue-gray-600 mb-1 block font-sans text-xs font-medium antialiased">25%</p>
                      <div className="flex-start bg-blue-gray-50 flex h-1 w-full overflow-hidden rounded-sm font-sans text-xs font-medium">
                        <div className="flex h-full items-center justify-center bg-gradient-to-tr from-blue-600 to-blue-400 text-white"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
