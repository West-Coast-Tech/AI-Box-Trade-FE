import { NavLink } from 'react-router-dom';
import bg from '../../assets/Imqges/bg-img.jpg';
import image from '/assets/images/knowledge/pattern.png';
import wlogo from '../../assets/Imqges/footer-logo-100x.png';
import blogo from '../../assets/Imqges/footer-logo-black-100x.png';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
import { IRootState } from '../../redux/store';
const Footer = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const logo = themeConfig.isDarkMode ? wlogo : blogo;
    return (
        <div
            className="dark:text-white-dark text-nowrap text-center sm:text-left w-full flex  justify-between rounded-t-lg shadow-md gap-4 shadow-white mt-auto  bg-cover bg-center "
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className="flex justify-between w-full bg-blue-950/30 p-10 ">
                <div className=" ">
                    <img src={logo} alt="logo" className="w-[80%] " />
                    <div className="w-[60%]  py-10 rounded-lg">© {new Date().getFullYear()}. Stocks. All rights reserved.</div>
                </div>
                <div className="gap-4 flex flex-col lg:flex-row items-center">
                    <NavLink to="/page/faq">Faq</NavLink>
                    <NavLink to="/page/contact-us">Contact Us</NavLink>
                    <NavLink to="/page/terms-conditions">Terms and Conditions</NavLink>
                    <NavLink to="/page/privacy-policy">Privacy Policy</NavLink>
                    <NavLink to="/page/refund-policy">Refund Policy</NavLink>
                    <NavLink to="/page/risk-warning">Risk Warning</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Footer;
