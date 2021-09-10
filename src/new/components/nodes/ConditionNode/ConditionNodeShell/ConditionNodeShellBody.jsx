import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import ConditionRowShell from './ConditionRowShell';

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

const ConditionTable = React.memo(() => {
  const classes = useStyles();
  const condition = { parameter: '', operator: '', value: '' };

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="condition table">
        <TableBody>
          <ConditionRowShell condition={condition} isLastRow />
        </TableBody>
      </Table>
    </TableContainer>
  );
});

const ConditionNodeShellBody = () => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <ConditionTable />
    </main>
  );
};

export default React.memo(ConditionNodeShellBody);
