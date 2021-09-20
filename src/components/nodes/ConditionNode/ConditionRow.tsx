import { Node, useSolidFlowyStoreById } from 'solid-flowy/lib';
import { useI18n } from '@amoutonbrady/solid-i18n';

import FilledInput from '../../common/FilledInput/FilledInput';
import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../App';
import { getAvailableParameters } from '../../../utils/conditions';
import { Component, createMemo, createSignal, Show } from 'solid-js';
import Tooltip from '../../common/Tooltip/Tooltip';
import IconButton from '../../common/IconButton/IconButton';
import DeleteIcon from '../../icons/DeleteIcon';
import AddCircleIcon from '../../icons/AddCircleIcon';
import './ConditionRow.scss';

interface ConditionRowProps {
  node: Node;
  index: number;
  isLastRow: boolean;
  isTheOnlyRow: boolean;
  storeId: string;
  condition: Record<string, unknown>;
}

const operators = ['=', '!='];
const numberOperators = ['>=', '<=', '>', '<'];

const ConditionRow: Component<ConditionRowProps> = (props) => {
  const [t] = useI18n();
  const { intents, slots, actions } = useWorkflowContext();
  const [state, { upsertNode }] = useSolidFlowyStoreById(props.storeId);
  const availableParams = createMemo(() =>
    getAvailableParameters({
      storeId: props.storeId,
      node: props.node,
      slots: slots(),
      intents: intents(),
      actions: actions(),
    })
  );
  const isSelectedParamNotInAvailableList = createMemo(
    () => props.condition.parameter && !availableParams().find(({ name }) => name === props.condition.parameter)
  );
  const [shouldShowAllSlots, setShouldShowAllSlots] = createSignal(isSelectedParamNotInAvailableList());
  const sortedSlots = createMemo(() =>
    slots().sort((slotA, slotB) => slotA.displayName.localeCompare(slotB.displayName))
  );
  const currentParam = createMemo(() => availableParams().find((param) => param.name === props.condition.parameter));

  const updateCondition = (key: string, value: string) => {
    const newConditions = props.node.data.conditions.map((c, i) => {
      if (c.parameter !== props.condition.parameter || i !== props.index) return c;

      return { ...c, [key]: value };
    });

    const updatedNode = {
      ...props.node,
      data: { ...props.node.data, conditions: newConditions },
    };

    upsertNode(updatedNode);
  };

  const handleParameterChange = (newParameterName: string) => {
    if (props.condition.parameter === newParameterName) return;

    const newParameter = availableParams().find(({ name }) => name === newParameterName) || { name: '' };

    updateCondition('parameter', newParameter.name);
  };

  const handleOperatorChange = (newOperator: string) => {
    if (props.condition.operator === newOperator) return;

    updateCondition('operator', newOperator);
  };

  const handleParameterValueChange = (newParameterValue: string) => {
    if (props.condition.value === newParameterValue) return;

    updateCondition('value', newParameterValue);
  };

  const deleteCondition = () => {
    const newConditions = props.node.data.conditions.filter((c, i) => i !== props.index);
    const updatedNode = {
      ...props.node,
      data: { ...props.node.data, conditions: newConditions },
    };

    upsertNode(updatedNode);
  };

  const addParameter = () => {
    let newConditions = [];
    const newCondition = {
      parameter: '',
      operator: '',
      value: '',
    };

    if (props.node.data && Array.isArray(props.node.data.conditions)) {
      newConditions = [...props.node.data.conditions, newCondition];
    } else {
      newConditions = [newCondition];
    }

    const newNode = {
      ...props.node,
      data: { ...props.node.data, conditions: newConditions },
    };

    upsertNode(newNode);
  };

  const toggleShowAllSlots = () => {
    if (shouldShowAllSlots() && isSelectedParamNotInAvailableList()) return;

    setShouldShowAllSlots((s) => !s);
  };

  const availableOperators = createMemo(() => {
    if (props.condition.value !== '' && !Number.isNaN(Number(props.condition.value)))
      return [...operators, ...numberOperators];

    return operators;
  });

  return (
    <tr
      classList={{
        'condition-node-body__table__row': true,
        'condition-node-body__table__row--last': props.isLastRow,
      }}
    >
      <td>
        <Tooltip title={t('parameter')}>
          <Autocomplete
            options={shouldShowAllSlots() ? sortedSlots() : availableParams()}
            getOptionKey={(option) => option.name as string}
            getOptionLabel={(option) => option.displayName as string}
            value={props.condition.parameter as string}
            onChange={handleParameterChange}
            placeholder={t('parameter')}
            fixedWidth="144px"
          >
            <div
              classList={{
                'condition-node-body__table__row__show-all-option': true,
                'condition-node-body__table__row__show-all-option--disabled':
                  isSelectedParamNotInAvailableList() && shouldShowAllSlots(),
              }}
              onClick={toggleShowAllSlots}
            >
              {shouldShowAllSlots() ? t('showAvailableOnly') : t('showAll')}
            </div>
          </Autocomplete>
        </Tooltip>
      </td>
      <td>
        <Tooltip title={t('operator')}>
          <Autocomplete
            options={availableOperators()}
            getOptionKey={(option) => option}
            getOptionLabel={(option) => option}
            value={props.condition.operator as string}
            onChange={handleOperatorChange}
            shouldShowFullOptions
            fixedWidth="48px"
          />
        </Tooltip>
      </td>
      <td>
        <Tooltip title={t('value')}>
          <Show
            when={currentParam() && currentParam().customData && Array.isArray(currentParam().customData.values)}
            fallback={
              <FilledInput
                value={props.condition.value as string}
                onChange={(event) => handleParameterValueChange(event.currentTarget.value)}
                width="96px"
              />
            }
          >
            <Autocomplete
              options={currentParam().customData.values.concat('NULL')}
              getOptionKey={(option) => option}
              getOptionLabel={(option) => option}
              value={props.condition.value as string}
              onChange={handleParameterValueChange}
              shouldAllowFreeInput
              fixedWidth="96px"
            />
          </Show>
        </Tooltip>
      </td>
      <td class="condition-node-body__table__row__action-cell">
        <IconButton onClick={deleteCondition} disabled={props.isTheOnlyRow}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={addParameter}>
          <AddCircleIcon />
        </IconButton>
      </td>
    </tr>
  );
};

export default ConditionRow;
