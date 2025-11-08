import { faker } from "@faker-js/faker";

const columns = [
  { key: "productName", name: "Product Name" },
  { key: "category", name: "Category" },
  { key: "orderDate", name: "Order Date" },
  { key: "inStock", name: "In Stock" },
  { key: "unitPrice", name: "Unit Price" },
  { key: "quantity", name: "Quantity" },
  { key: "discount", name: "Discount" },
  { key: "totalAmount", name: "Total Amount" },
  { key: "region", name: "Region" },
  { key: "contact", name: "Contact" },
];

export function generateRows(length = 100) {
  const data = new Array(length).fill(0).map((_, id) => {
    const unitPrice = parseFloat(faker.commerce.price({ min: 10, max: 200 }));
    const quantity = faker.number.int({ min: 1, max: 50 });
    const discount = parseFloat(
      faker.finance.amount({ min: 0, max: 50, dec: 2 }),
    );
    const totalAmount = (unitPrice * quantity) - discount;

    return {
      id,
      "Product Name": faker.commerce.productName(),
      "Category": faker.commerce.department(),
      "Order Date": faker.date.past({ years: 2 }).toISOString(),
      "In Stock": faker.datatype.boolean().toString(),
      "Price": unitPrice,
      "Quantity": quantity,
      "Discount": discount,
      "Total": totalAmount,
      "Region": faker.location.country(),
      "Contact": faker.internet.email(),
    };
  });

  const summaryRow = {
    id: "summary-123",
    "Product Name": "Summary",
    "Category": "Totals",
    "Order Date": "",
    "In Stock": "",
    Price: data.reduce((acc, row) => acc + row.Price, 0) / data.length,
    Quantity: data.reduce((acc, row) => acc + row.Quantity, 0),
    Discount: data.reduce((acc, row) => acc + row.Discount, 0) / data.length,
    Total: data.reduce((acc, row) => acc + row.Total, 0),
    Region: "N/A",
    Contact: "",
  };

  const finalData = [...data];

  return {
    data: finalData,
    pinnedRows: {
      bottom: [summaryRow],
    },
  };
}
