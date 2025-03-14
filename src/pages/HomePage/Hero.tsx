import { Link } from 'react-router-dom';

// Import assets
import video from '/assets/video/homepage/main_bg3.mp4';
import jp from '/assets/images/homepage/JP-Home.png';

const Hero = () => {
    return (
        <section className="relative w-full flex items-center justify-center p-5">
            {/* Background Video */}
            <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-lg">
                <source src={video} type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200/90  via-blue-100/90 to-blue-200/90 dark:from-black/95 dark:via-black/95 dark:to-blue-950/95 rounded-lg"></div>

            {/* Content Wrapper */}
            <div className="relative z-10 container mx-auto lg:px-16 flex flex-col lg:flex-row items-center justify-between">
                {/* Left Side - Text */}
                <div className="text-center lg:text-left w-full lg:w-[60%] xl:w-[50%]">
                    <h1 className="text-3xl sm:text-4xl font-bold dark:text-white mb-4 sm:pr-10">
                        Trade Smarter <span className="text-blue-500">With Ai Insights</span>
                    </h1>
                    <p className="dark:text-white-dark text-sm sm:text-base leading-7 text-justify mb-5 sm:mb-0 lg:text-left lg:pr-12 xl:pr-28 py-4">
                        AI BOX Trade is your all-in-one trading companion, built to help you spot opportunities, build strong portfolios, and navigate the market with confidence. With powerful
                        AI-driven insights, you’ll trade smarter and stay ahead—every step of the way.
                    </p>
                    <div className="mt-6 py-3">
                        <Link to="" className="py-3 px-6 text-lg font-semibold rounded text-white bg-blue-700 hover:bg-blue-600 transition-all">
                            <a href="">Explore more</a>
                        </Link>
                    </div>
                </div>

                {/* Right Side - Static Image */}
                <div className="w-full lg:w-full flex justify-center lg:justify-end mt-10 lg:mt-0">
                    <img src={jp} alt="Lorem Ipsum" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
