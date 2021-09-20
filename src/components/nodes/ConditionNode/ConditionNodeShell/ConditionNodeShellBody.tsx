import { Component } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import FilledInput from '../../../common/FilledInput/FilledInput';
import IconButton from '../../../common/IconButton/IconButton';
import AddCircleIcon from '../../../icons/AddCircleIcon';
import DeleteIcon from '../../../icons/DeleteIcon';
import '../ConditionNodeBody.scss';
import '../ConditionRow.scss';

const ConditionTable: Component = () => {
  const [t] = useI18n();

  return (
    <table class="condition-node-body__table" aria-label="condition table">
      <tbody>
        <tr
          classList={{
            'condition-node-body__table__row': true,
            'condition-node-body__table__row--last': true,
          }}
        >
          <td>
            <Autocomplete
              options={[]}
              getOptionKey={(option) => option}
              getOptionLabel={(option) => option}
              value={''}
              placeholder={t('parameter')}
              fixedWidth="144px"
            />
          </td>
          <td>
            <Autocomplete
              options={[]}
              getOptionKey={(option) => option}
              getOptionLabel={(option) => option}
              value={''}
              fixedWidth="48px"
            />
          </td>
          <td>
            <FilledInput value={''} width="96px" />
          </td>
          <td class="condition-node-body__table__row__action-cell">
            <IconButton disabled>
              <DeleteIcon />
            </IconButton>
            <IconButton>
              <AddCircleIcon />
            </IconButton>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const ConditionNodeShellBody: Component = () => {
  return (
    <main class="condition-node-body">
      <ConditionTable />
    </main>
  );
};

export default ConditionNodeShellBody;
