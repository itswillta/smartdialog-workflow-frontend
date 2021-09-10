import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircle';

import {
  edgesSelector,
  nodesSelector,
  useReactFlowyStoreById,
} from 'react-flowy';

import { useTranslation } from '../../../../../../i18n';
import FilledInput from '../../common/FilledInput/FilledInput';
import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../..';
import { getAvailableParameters } from '../../../utils/conditions';

const operators = ['=', '!='];
const numberOperators = ['>=', '<=', '>', '<'];

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

const ConditionRow = React.memo(
  ({ node, condition, index, isLastRow, isTheOnlyRow, storeId }) => {
    const classes = useStyles();
    const { intents, slots, actions } = useWorkflowContext();
    const useReactFlowyStore = useReactFlowyStoreById(storeId);
    const nodes = useReactFlowyStore(nodesSelector);
    const edges = useReactFlowyStore(edgesSelector);
    const availableParams = getAvailableParameters({
      nodes,
      edges,
      node,
      slots,
      intents,
      actions,
    });
    const upsertNode = useReactFlowyStore(state => state.upsertNode);
    const currentParam = availableParams.find(
      param => param.name === condition.parameter,
    );
    const { t } = useTranslation('dialog');

    const updateCondition = (key, value) => {
      const newConditions = node.data.conditions.map((c, i) => {
        if (c.parameter !== condition.parameter || i !== index) return c;

        return { ...c, [key]: value };
      });

      const updatedNode = {
        ...node,
        data: { ...node.data, conditions: newConditions },
      };

      upsertNode(updatedNode);
    };

    const handleParameterChange = newParameterName => {
      if (condition.parameter === newParameterName) return;

      const newParameter = availableParams.find(
        ({ name }) => name === newParameterName,
      ) || { name: '' };

      updateCondition('parameter', newParameter.name);
    };

    const handleOperatorChange = newOperator => {
      if (condition.operator === newOperator) return;

      updateCondition('operator', newOperator);
    };

    const handleParameterValueChange = newParameterValue => {
      if (condition.value === newParameterValue) return;

      updateCondition('value', newParameterValue);
    };

    const deleteCondition = () => {
      const newConditions = node.data.conditions.filter((c, i) => i !== index);
      const updatedNode = {
        ...node,
        data: { ...node.data, conditions: newConditions },
      };

      upsertNode(updatedNode);
    };

    const addParameter = () => {
      let newConditions = [];
      const newCondition = {
        parameter: {},
        operator: '',
        value: '',
      };

      if (node.data && Array.isArray(node.data.conditions)) {
        newConditions = [...node.data.conditions, newCondition];
      } else {
        newConditions = [newCondition];
      }

      const newNode = {
        ...node,
        data: { ...node.data, conditions: newConditions },
      };

      upsertNode(newNode);
    };

    const availableOperators = useMemo(
      () => {
        if (condition.value !== '' && !Number.isNaN(Number(condition.value)))
          return [...operators, ...numberOperators];

        return operators;
      },
      [condition.value],
    );

    useEffect(
      () => {
        if (condition.value !== '' && !Number.isNaN(Number(condition.value)))
          return;

        if (numberOperators.includes(condition.operator)) {
          handleOperatorChange('=');
        }
      },
      [condition.value],
    );

    return (
      <>
        <TableRow
          key={condition.parameter}
          className={clsx(classes.tableRow, isLastRow ? classes.lastRow : '')}
        >
          <Tooltip title={t('parameter')}>
            <TableCell>
              <Autocomplete
                options={availableParams}
                getOptionKey={option => option.name}
                getOptionLabel={option => option.displayName}
                value={condition.parameter}
                onChange={handleParameterChange}
                placeholder={t('parameter')}
                fixedWidth={144}
              />
            </TableCell>
          </Tooltip>
          <Tooltip title={t('operator')}>
            <TableCell align="center">
              <Autocomplete
                options={availableOperators}
                getOptionKey={option => option}
                getOptionLabel={option => option}
                value={condition.operator}
                onChange={handleOperatorChange}
                shouldShowFullOptions
                fixedWidth={48}
              />
            </TableCell>
          </Tooltip>
          <Tooltip title={t('parameterValue')}>
            <TableCell>
              {currentParam &&
              currentParam.customData &&
              Array.isArray(currentParam.customData.values) ? (
                <Autocomplete
                  options={currentParam.customData.values.concat('NULL')}
                  getOptionKey={option => option}
                  getOptionLabel={option => option}
                  value={condition.value}
                  onChange={handleParameterValueChange}
                  shouldAllowFreeInput
                  fixedWidth={96}
                />
              ) : (
                <FilledInput
                  value={condition.value}
                  onChange={event =>
                    handleParameterValueChange(event.target.value)
                  }
                  width={96}
                />
              )}
            </TableCell>
          </Tooltip>
          <TableCell className={classes.actionCell}>
            <IconButton onClick={deleteCondition} disabled={isTheOnlyRow}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={addParameter}>
              <AddIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      </>
    );
  },
);

export default React.memo(ConditionRow);
