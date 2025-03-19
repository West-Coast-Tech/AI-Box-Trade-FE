import React from 'react';
import useScrollToTop from '../../customHooks/useScrollToTop';

const PrivacyPolicy: React.FC = () => {
    useScrollToTop();
    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

            {/* Section 1: Introduction */}
            <section>
                <h2 className="text-3xl font-bold mb-4">1. Introduction</h2>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel lacus eu magna sodales ultrices. Praesent at erat nec metus dignissim aliquet.</p>
            </section>

            {/* Section 2: Data Collection */}
            <section>
                <h2 className="text-3xl font-bold mb-4">2. Data Collection</h2>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Fusce ac vestibulum nisi, ut fermentum odio.</p>
            </section>

            {/* Section 3: Data Usage */}
            <section>
                <h2 className="text-3xl font-bold mb-4">3. Data Usage</h2>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst. Nulla facilisi. Integer ac lorem in massa gravida imperdiet.</p>
            </section>

            {/* Section 4: Cookies and Tracking */}
            <section>
                <h2 className="text-3xl font-bold mb-4">4. Cookies and Tracking</h2>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet arcu ac odio bibendum finibus. Aliquam erat volutpat.</p>
            </section>

            {/* Section 5: Third-Party Sharing */}
            <section>
                <h2 className="text-3xl font-bold mb-4">5. Third-Party Sharing</h2>
                <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt, elit nec pharetra ullamcorper, velit justo tristique nisl, non semper lorem felis a ligula.
                </p>
            </section>

            {/* Section 6: User Rights */}
            <section>
                <h2 className="text-3xl font-bold mb-4">6. User Rights</h2>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed leo nec dui sollicitudin tempor. Vivamus nec nunc et urna placerat convallis.</p>
            </section>

            {/* Section 7: Data Security */}
            <section>
                <h2 className="text-3xl font-bold mb-4">7. Data Security</h2>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec dui cursus, fermentum nisi quis, dictum leo. Proin id purus in lectus convallis malesuada.</p>
            </section>

            {/* Section 8: Changes to This Privacy Policy */}
            <section>
                <h2 className="text-3xl font-bold mb-4">8. Changes to This Privacy Policy</h2>
                <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at nunc semper, vulputate dolor non, interdum sapien. Nulla euismod dolor vel urna fermentum, quis consequat elit
                    scelerisque.
                </p>
            </section>

            {/* Section 9: Contact Information */}
            <section>
                <h2 className="text-3xl font-bold mb-4">9. Contact Information</h2>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in turpis elit. In non tempor lectus, at commodo nisi.</p>
                <p className="mb-4">
                    If you have any questions regarding this Privacy Policy, please contact us at: <strong>privacy@example.com</strong>.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
