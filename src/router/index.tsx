import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';

const finalRoutes = routes.map((route) => {
    let wrappedElement = route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>;

    // If the route is protected, wrap it with the ProtectedRoute component
    if (route.protected) {
        wrappedElement = <ProtectedRoute>{wrappedElement}</ProtectedRoute>;
    }
    return {
        ...route,
        element: wrappedElement,
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
