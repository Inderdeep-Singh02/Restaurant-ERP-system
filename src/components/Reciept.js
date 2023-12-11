import React from 'react';

const Receipt = ({ salesperson, discount, invoiceItems, totalAmount, Data}) => {
  // console.log("invoice:",invoiceItems);
  console.log("D:",Data);

  return (
    <div>
      <h2>Receipt</h2>
      <pre>
        {`------------------------
Receipt
------------------------
Salesperson: ${salesperson}
Discount: ${discount}%
------------------------
Item          Qty  Total
------------------------
${Data[0].map((item) => (
  ` ${item.id}       ${item.name}        ${item.price}\n`
)).join('')}  
------------------------
Total Amount (INR): ${totalAmount}
------------------------`}
      </pre>
    </div>
  );
};

export default Receipt;
