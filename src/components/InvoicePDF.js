// InvoicePDF.js
import React from 'react';
import { Page, Document, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  invoiceDate: {
    fontSize: 12,
  },
  table: {
    display: 'table',
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 30,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    padding: 8,
    borderRightColor: '#000',
    borderRightWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
  },
});

const InvoicePDF = ({ invoiceData }) => {
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Invoice</Text>
        <View style={styles.invoiceInfo}>
          <Text>Invoice Date: {currentDate}</Text>
          <Text>Invoice Number: 001</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Unit Price</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {invoiceData.map((invoice, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{invoice.name}</Text>
              <Text style={styles.tableCell}>{invoice.quantity}</Text>
              <Text style={styles.tableCell}>${invoice.price.toFixed(2)}</Text>
              <Text style={styles.tableCell}>${(invoice.price * invoice.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
