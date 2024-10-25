import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const convertToString = (input) => {
  if (typeof input === 'string') {
    return input;
  } else if (Array.isArray(input)) {
    return input.map(convertToString).join(', ');
  } else if (typeof input === 'object' && input !== null) {
    return Object.entries(input)
      .map(([key, value]) => `${key}: ${convertToString(value)}`)
      .join(', ');
  }
  return input.toString();
};

const parseMessageContent = (input) => {
  // Safeguard for empty or undefined input
  if (!input || typeof input !== 'object') {
    return <Typography variant="body2">No data available</Typography>;
  }

  // Safeguard to ensure modelreply exists and is an object
  if (typeof input.modelreply !== 'object' || !input.modelreply) {
    return <Typography variant="body2">Invalid or missing data</Typography>;
  }

  // Get the table headers (keys) from the modelreply object
  const tableHeaders = Object.keys(input.modelreply);

  // Safeguard: Ensure there's at least one key (column) to display
  if (tableHeaders.length === 0) {
    return <Typography variant="body2">No data available</Typography>;
  }

  // Safeguard: Ensure that input.modelreply[tableHeaders[0]] exists and is an array
  const firstColumnData = input.modelreply[tableHeaders[0]];
  if (!Array.isArray(firstColumnData)) {
    return <Typography variant="body2">Unexpected data format</Typography>;
  }

  // Create the rows by iterating over the first column's entries (assuming all columns have the same number of rows)
  const tableData = firstColumnData.map((_, index) => {
    return tableHeaders.map(header => input.modelreply[header][index] || '');
  });

  // Render the table
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {tableHeaders.map((header, index) => (
            <TableCell key={index}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default parseMessageContent;
