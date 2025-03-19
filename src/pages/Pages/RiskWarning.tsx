import React from 'react';
import useScrollToTop from '../../customHooks/useScrollToTop';

const RiskWarning: React.FC = () => {
    useScrollToTop();
    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <h1 className="text-4xl font-bold text-center mb-8">Risk Warning</h1>

            {/* Section 1: General Risk Warning */}
            <section>
                <h2 className="text-3xl font-bold mb-4">1. General Risk Warning</h2>
                <p className="mb-4">
                    Trading and investing involve significant risks. Prices of assets can be highly volatile, and you may lose part or all of your invested funds. It is essential to understand the
                    risks before engaging in trading activities.
                </p>
            </section>

            {/* Section 2: Market Risks */}
            <section>
                <h2 className="text-3xl font-bold mb-4">2. Market Risks</h2>
                <p className="mb-4">
                    The financial market is influenced by numerous factors, including economic conditions, political events, and global market trends. These uncertainties can impact asset prices
                    unpredictably.
                </p>
            </section>

            {/* Section 3: No Guarantee of Profits */}
            <section>
                <h2 className="text-3xl font-bold mb-4">3. No Guarantee of Profits</h2>
                <p className="mb-4">
                    Past performance does not guarantee future results. There are no assurances that any trading strategy will be successful, and losses may occur despite careful analysis and
                    planning.
                </p>
            </section>

            {/* Section 4: Technical and Operational Risks */}
            <section>
                <h2 className="text-3xl font-bold mb-4">4. Technical and Operational Risks</h2>
                <p className="mb-4">
                    Trading platforms and digital transactions are subject to technical issues, such as system failures, hacking attempts, and internet connectivity problems. These risks may affect
                    order execution and account access.
                </p>
            </section>

            {/* Section 5: Legal and Regulatory Compliance */}
            <section>
                <h2 className="text-3xl font-bold mb-4">5. Legal and Regulatory Compliance</h2>
                <p className="mb-4">Users must ensure they comply with the laws and regulations of their jurisdiction. Some financial services may not be legally permitted in certain regions.</p>
            </section>

            {/* Section 6: Advice and Responsibility */}
            <section>
                <h2 className="text-3xl font-bold mb-4">6. Advice and Responsibility</h2>
                <p className="mb-4">We do not provide financial, legal, or investment advice. Users should seek professional guidance before making any financial decisions.</p>
            </section>

            {/* Section 7: Contact Information */}
            <section>
                <h2 className="text-3xl font-bold mb-4">7. Contact Information</h2>
                <p className="mb-4">
                    If you have any questions regarding risk factors, please contact us at: <strong>support@example.com</strong>.
                </p>
            </section>
        </div>
    );
};

export default RiskWarning;
