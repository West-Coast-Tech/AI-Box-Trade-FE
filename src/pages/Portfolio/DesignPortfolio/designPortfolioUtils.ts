import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import { UserParameters } from './DesignPortfolioPage';

export const saveDesignPortfolio = async (userParameters: UserParameters, stocks: any[], portfolioName: string): Promise<string | null> => {
    const portfolioParameters = {
        investmentDuration: userParameters.type,
        investmentCapital: userParameters.investment,
        riskFactor: userParameters.mode,
        portfolioName,
    };

    try {
        const userId = localStorage.getItem('id') || '';
        const response = await PortfolioApi.saveDesignPortfolio(userId, portfolioParameters, stocks);
        console.log('response', response);
        // Accept both 200 and 201 as success status codes
        if (response.status === 200 || response.status === 201) {
            return response.data._id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error saving design portfolio:', error);
        return null;
    }
};

export const getAllDesignPortfolios = async (): Promise<{ _id: string; portfolioName: string }[] | null> => {
    try {
        const userId = localStorage.getItem('id') || '';
        const response = await PortfolioApi.getAllDesignPortfolios(userId);

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting design portfolio:', error);
        return null;
    }
};

export const loadDesignPortfolio = async (portfolioId: string): Promise<any> => {
    try {
        const userId = localStorage.getItem('id') || '';
        const response = await PortfolioApi.loadDesignPortfolio(userId, portfolioId);
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting design portfolio:', error);
        return null;
    }
};

export const updateDesignPortfolio = async (portfolioId: string, newPortfolioName: string): Promise<any> => {
    try {
        const userId = localStorage.getItem('id') || '';
        const response = await PortfolioApi.updateDesignPortfolio(userId, portfolioId, newPortfolioName);

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting design portfolio:', error);
        return null;
    }
};

export const deleteDesignPortfolio = async (portfolioId: string): Promise<any> => {
    try {
        const userId = localStorage.getItem('id') || '';
        const response = await PortfolioApi.deleteDesignPortfolio(userId, portfolioId);

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting design portfolio:', error);
        return null;
    }
};
