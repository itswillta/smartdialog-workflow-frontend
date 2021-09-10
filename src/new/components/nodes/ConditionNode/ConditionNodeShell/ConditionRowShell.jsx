import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircle';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';

const useStyles = makeStyles(theme => ({
  tableRow: {
    position: 'relative',
  },
  lastRow: {
    '& > .MuiTableCell-root': {
      border: 'none',
    },
  },
  actionCell: {
    padding: '2px 4px 2px 4px !important',
    borderRadius: 4,

    '& .MuiIconButton-root': {
      width: 20,
      height: 20,
      padding: theme.spacing(0.75),

      '& .MuiSvgIcon-root': {
        width: 16,
        height: 16,
      },
    },
  },
}));

const ConditionRow = React.memo(({ condition, isLastRow }) => {
  const classes = useStyles();

  return (
    <>
      <TableRow
        key={condition.parameter}
        className={clsx(classes.tableRow, isLastRow ? classes.lastRow : '')}
      >
        <Tooltip title="Parameter">
          <TableCell>
            <Autocomplete
              options={[]}
              getOptionKey={option => option.id}
              getOptionLabel={option => option.displayName}
              value={condition.parameter}
              placeholder="Parameter"
              fixedWidth={144}
            />
          </TableCell>
        </Tooltip>
        <Tooltip title="Operator">
          <TableCell align="center">
            <Autocomplete
              options={[]}
              getOptionKey={option => option}
              getOptionLabel={option => option}
              value={condition.operator}
              shouldShowFullOptions
              fixedWidth={48}
            />
          </TableCell>
        </Tooltip>
        <Tooltip title="Value">
          <TableCell>
            <Autocomplete
              options={[]}
              getOptionKey={option => option}
              getOptionLabel={option => option}
              value={condition.value}
              fixedWidth={96}
            />
          </TableCell>
        </Tooltip>
        <TableCell className={classes.actionCell}>
          <IconButton>
            <DeleteIcon />
          </IconButton>
          <IconButton>
            <AddIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
});

export default React.memo(ConditionRow);
