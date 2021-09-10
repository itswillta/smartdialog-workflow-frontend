import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import ConditionRow from './ConditionRow';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 1, 0.5, 1),
    flexDirection: 'column',
  },
  table: {
    borderCollapse: 'inherit',
    border: '1px solid #e9e9ef',
    borderRadius: 4,
    '& > .MuiTableCell-root': {
      color: '#253134',
    },
    '& .MuiTableCell-root': {
      padding: theme.spacing(0.25),
    },
  },
}));

const ConditionTable = React.memo(({ node, storeId }) => {
  const classes = useStyles();
  const conditions =
    node.data && Array.isArray(node.data.conditions)
      ? node.data.conditions
      : [];

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="condition table">
        <TableBody>
          {conditions.length > 0 ? (
            conditions.map((condition, index) => (
              <ConditionRow
                key={condition.parameter}
                node={node}
                condition={condition}
                index={index}
                isLastRow={index === conditions.length - 1}
                isTheOnlyRow={conditions.length === 1}
                storeId={storeId}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                style={{ textAlign: 'center', width: 348 }}
              >
                There is no condition
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

const ConditionNodeBody = ({ node, storeId }) => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <ConditionTable node={node} storeId={storeId} />
    </main>
  );
};

export default React.memo(ConditionNodeBody);
