import { Link } from 'react-router-dom';

// Image
// import indicator from '../../../public/assets/images/homepage/JPindicators-1536x1160.webp';
// import indicator from '../../../public/assets/images/homepage/JPindicators.jpg';
import indicator from '../../assets/Imqges/DesignPortfolio.png';

const Indicators = () => {
    return (
        <section className="xl:py-36 py-16 overflow-x-hidden bg-gradient-to-br from-gray-300 via-white to-gray-200  dark:from-black dark:via-blue-950/70 dark:to-black px-6 sm:px-12">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:gap-24 gap-10 items-center">
                    {/* Image Section - Appears on top in mobile */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <img src={indicator} className="rounded-lg shadow-lg w-full max-w-md lg:max-w-full" />
                    </div>

                    {/* Text Section */}
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-6 text-left text-blue-500">
                            Portfolio<span className="text-white"> Builder</span>
                        </h2>
                        <p className=" leading-relaxed text-left">
                            Use AIBOX portfolio builder to create a customized investment plan in seconds. Just enter your investment size, duration, and risk appetiton. Our system finds the right
                            stocks for you.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Indicators;
