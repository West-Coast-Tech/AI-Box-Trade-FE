import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../redux/features/themeConfigSlice';
import API from '../../utils/API';
import { INews } from '../../redux/types';
import Pagination from '../Elements/Pagination';
const NewsPage = () => {
    const dispatch = useDispatch();
    const [news, setNews] = useState<INews[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 16; // Adjust as needed
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        dispatch(setPageTitle('News Page'));
    }, [dispatch]);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await API.getNews(); // Ensure your API supports pagination
                const fetchedNews: INews[] = response.data;

                // If your API supports pagination, adjust accordingly
                // For example, if API.getNews accepts page and limit parameters:
                // const response = await API.getNews(currentPage, itemsPerPage);
                // const fetchedNews: INews[] = response.data.news;
                // const totalItems: number = response.data.total;
                // setTotalPages(Math.ceil(totalItems / itemsPerPage));

                // For client-side pagination:
                setNews(fetchedNews);
                setTotalPages(Math.ceil(fetchedNews.length / itemsPerPage));
            } catch (err: any) {
                console.error('Error fetching news:', err);
                setError('Failed to fetch news data.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [currentPage]);

    // For client-side pagination, slice the news items based on currentPage
    const paginatedNews = news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatTime = (timeInMillis: string | number): string => {
        const date = new Date(Number(timeInMillis));
        return date.toDateString();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // If using server-side pagination, you might want to fetch data here
    };

    return (
        <div className="panel mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Latest News</h2>
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {paginatedNews.map((item, index) => (
                            <a href={item.url}>
                                <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-md h-full">
                                    <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">{item.text}</p>
                                        <div className="text-sm text-gray-500">
                                            <p>Source: {item.source}</p>
                                            <p>{formatTime(item.time)}</p>
                                            <p className="italic">{item.ago}</p>
                                        </div>
                                        {/* <div className="mt-3">
                                            <Link to={item.url} className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition" target="_blank" rel="noopener noreferrer">
                                                Read More
                                            </Link>
                                        </div> */}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default NewsPage;
