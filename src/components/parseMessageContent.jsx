// parseMessageContent.js

import React from 'react'; // Ensure React is imported if you're returning JSX
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
  if (!input || typeof input !== 'object') {
    return <Typography variant="body2">No data available</Typography>;
  }

  if (typeof input.modelreply !== 'object' || !input.modelreply) {
    return <Typography variant="body2">Invalid or missing data</Typography>;
  }

  const tableHeaders = Object.keys(input.modelreply);

  if (tableHeaders.length === 0) {
    return <Typography variant="body2">No data available</Typography>;
  }

  const firstColumnData = input.modelreply[tableHeaders[0]];
  if (!Array.isArray(firstColumnData)) {
    return <Typography variant="body2">Unexpected data format</Typography>;
  }

  const tableData = firstColumnData.map((_, index) => {
    return tableHeaders.map(header => input.modelreply[header][index] || '');
  });

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
