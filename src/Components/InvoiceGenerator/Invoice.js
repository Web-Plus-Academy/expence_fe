import React from 'react';
import './Invoice.css'

const InvoiceGenerator = ({ INV }) => {
    const downloadInvoice = async (paymentId) => {
        try {
            const response = await fetch(`https://expence-be.onrender.com/invoice/${paymentId}`, {
                method: 'GET',
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice-${paymentId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    };

    console.log(INV);

    return (
        <div>
            {/* <h1>Invoice Generator</h1> */}
            <button className="download-btn" onClick={() => downloadInvoice(INV)}>
                Download Invoice
            </button>

        </div>
    );
};

export default InvoiceGenerator;
