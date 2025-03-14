import IncrementalChart from '../../components/AmChart/IncrementalChart';
import charts from '/assets/images/homepage/JPcharts-2048x1530.webp';

const InstitutionalCharting = () => {
    return (
        <section className="bg-s-to-br from-gray-300  via-gray-100 to-gray-200  dark:from-blue-950 dark:via-black/95 dark:to-black/95 dark:text-white-dark py-16  rounded-lg mt-10">
            <div className="mx-auto text-center">
                <h2 className="text-3xl sm:text-5xl font-bold mb-6 dark:text-white ">
                    Institutional Grade <span className="text-blue-500">Charting</span>
                </h2>
            </div>

            {/* Image Container */}
            <div className="flex flex-col items-center">
                <div className="w-full  overflow-hidden rounded-lg shadow-lg panel">
                    <IncrementalChart />
                </div>
            </div>

            {/* Mobile-Friendly Layout Fix */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-x-10 gap-y-6 lg:gap-y-0">
                {/* Left Section - Text */}
                <div className="lg:col-span-3 flex items-center justify-center">
                    <p className="text-base max-w-xl lg:max-w-3xl text-left lg:text-left px-4 sm:px-10">
                        Stay ahead with powerful tools that simplify research, refine your strategy, and help you make smarter investment decisions.
                    </p>
                </div>

                {/* Right Section - List */}
                <div className="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h4 className="text-lg sm:text-2xl font-semibold mb-4">Everything you need for successful investing:</h4>
                    <ul className="text-base sm:text-lg text-blue-800 dark:text-white-dark space-y-2 text-left">
                        <li>&bull; Screenors</li>
                        <li>&bull; Portfolio Builders</li>
                        <li>&bull; Stock Filters</li>
                        <li>&bull; Analyst Rating</li>
                        <li>&bull; 7-Box Rule</li>
                        <li>&bull; Sector Wise Picks</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default InstitutionalCharting;
