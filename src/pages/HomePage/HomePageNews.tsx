// Image
// import news from '/assets/images/homepage/realtime_news_blue.png';
import news from '/assets/images/homepage/JPnews.jpg';

const HomePageNews = () => {
    return (
        <section className="xl:py-1 py-1 overflow-x-hidden bg-gradient-to-br from-gray-200  via-white-200 to-gray-200 dark:from-black dark:via-blue-950/70 dark:to-black px-6">
            <div className="container">
                <div className="xl:py-20 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:gap-24 gap-10 items-center">
                        {/* Image Section */}
                        <div className="flex justify-center sm:pr-0 pr-16 lg:justify-start">
                            <img src={news} className="sm:w-5/6 max-w-xs  lg:max-w-md pl-16 mask-fade-bottom " />
                        </div>

                        {/* Text Section */}
                        <div className="text-center lg:text-left px-6 sm:px-10 lg:px-0 ">
                            <h2 className="text-3xl sm:text-4xl mb-6 pr-10 dark:text-white hidden sm:block font-bold">
                                Stay Ahead With <span className="text-blue-500">Real-Time Market Updates.</span>
                            </h2>
                            <h2 className="text-3xl sm:text-4xl mb-6 pr-10 text-white text-center sm:hidden font-bold">
                                Real-Time<span className="text-blue-500"> Insights</span>
                            </h2>
                            <p className=" pr-10 text-left">
                                Get the latest market news, analyst updates, and economic calendars—all in one place. From earnings reports to economic events, AI BOX Trade keeps you updated with
                                real-time insights to make informed investment decisions.
                                <br />
                                <br />
                                <div className="text-left font-bold text-xl ">Calendars</div>
                            </p>
                            <ul className="mt-2 space-y-1 pr-10 sm:mb-0 mb-16 text-left pb-5">
                                <li>✔ Dividend calendar </li>
                                <li>✔ Economic calendar </li>
                                <li>✔ Earnings calendar </li>
                                {/* <li>✔ Elit Sed Do</li>
                                <li>✔ Eiusmod Tempor</li>
                                <li>✔ Incididunt Ut</li>
                                <li>✔ Labore Et Dolore</li>
                                <li>✔ ...Lorem Ipsum!</li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomePageNews;
