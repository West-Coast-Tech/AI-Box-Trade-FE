import React from 'react';

const RefundPolicy: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <h1 className="text-4xl font-bold text-center mb-8">Refund Policy</h1>

            {/* Section 1: Introduction */}
            <section>
                <h2 className="text-3xl font-bold mb-4">1. Overview</h2>
                <p className="mb-4">
                    We strive to provide the best products and services to our customers. If you are not satisfied with your purchase, you may be eligible for a refund under the conditions outlined
                    below.
                </p>
            </section>

            {/* Section 2: Eligibility for Refunds */}
            <section>
                <h2 className="text-3xl font-bold mb-4">2. Eligibility for Refunds</h2>
                <p className="mb-4">To be eligible for a refund, you must meet the following conditions:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Request the refund within [number] days of purchase.</li>
                    <li>The product must be unused and in the original condition.</li>
                    <li>Proof of purchase is required.</li>
                </ul>
            </section>

            {/* Section 3: Non-Refundable Items */}
            <section>
                <h2 className="text-3xl font-bold mb-4">3. Non-Refundable Items</h2>
                <p className="mb-4">The following items are not eligible for refunds:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Downloadable digital products.</li>
                    <li>Customized or personalized items.</li>
                    <li>Gift cards and promotional items.</li>
                </ul>
            </section>

            {/* Section 4: Refund Process */}
            <section>
                <h2 className="text-3xl font-bold mb-4">4. Refund Process</h2>
                <p className="mb-4">To request a refund, follow these steps:</p>
                <ul className="list-decimal list-inside mb-4">
                    <li>
                        Contact our support team at <strong>support@example.com</strong> with your order details.
                    </li>
                    <li>Provide a valid reason for the refund request.</li>
                    <li>Ship the product back (if applicable) and provide tracking information.</li>
                </ul>
            </section>

            {/* Section 5: Processing Time */}
            <section>
                <h2 className="text-3xl font-bold mb-4">5. Processing Time</h2>
                <p className="mb-4">Once your refund request is approved, it may take [number] business days to process. Refunds will be issued to the original payment method.</p>
            </section>

            {/* Section 6: Late or Missing Refunds */}
            <section>
                <h2 className="text-3xl font-bold mb-4">6. Late or Missing Refunds</h2>
                <p className="mb-4">
                    If you haven’t received a refund yet, please check your bank account first. Then contact your bank or payment provider as it may take some time before your refund is officially
                    posted.
                </p>
            </section>

            {/* Section 7: Contact Information */}
            <section>
                <h2 className="text-3xl font-bold mb-4">7. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about our refund policy, please contact us at <strong>support@example.com</strong>.
                </p>
            </section>
        </div>
    );
};

export default RefundPolicy;
