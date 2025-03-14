import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../redux/features/themeConfigSlice';
import API from '../../utils/API';
import { INews } from '../../redux/types';
import Pagination from '../Elements/Pagination';

const NewsList = () => {
    const dispatch = useDispatch();
    const [news, setNews] = useState<INews[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5; // Adjust as needed
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        dispatch(setPageTitle('News List'));
    }, [dispatch]);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await API.getNews();
                const fetchedNews: INews[] = response.data;

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
    }, []);
    const paginatedNews = news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // If using server-side pagination, you might want to fetch data here
    };
    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">News List</h5>
            </div>
            <div className="mb-5">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <>
                        <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                            {paginatedNews.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10"
                                >
                                    <div className="ltr:mr-3 rtl:ml-3">
                                        <img src={item.img || '/assets/images/default-news.jpg'} alt={item.title} className="rounded-full w-12 h-12 object-cover" />
                                    </div>
                                    <div className="flex-1 font-semibold">
                                        <h6 className="mb-1 text-base">{item.title}</h6>
                                        <p className="text-xs">Source: {item.source}</p>
                                        <p className="text-xs">{item.ago}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsList;
