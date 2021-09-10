import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import { useStatusStore } from '../../../store/status.store';
import ProblemPopover from '../../problemPopover/ProblemPopover';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#434343',
    padding: theme.spacing(1),
    color: '#fff',
    width: 32,
    height: 32,
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)',
    borderRadius: '50%',
  },
}));

const StartNode = ({ node, storeId }) => {
  const classes = useStyles();
  const shouldShowInvalidNodes = useStatusStore(
    state => state.shouldShowInvalidNodes,
  );
  const problematicNode = useStatusStore(state =>
    state.problematicNodes.find(pN => pN.id === node.id),
  );

  return (
    <ExtendedNodeContainer node={node} storeId={storeId}>
      <div className={node.isSelected ? classes.selected : ''}>
        <Paper className={classes.container} elevation={4} />
        {shouldShowInvalidNodes && problematicNode && (
          <ProblemPopover
            status={problematicNode.status}
            message={problematicNode.message}
          />
        )}
      </div>
    </ExtendedNodeContainer>
  );
};

export default React.memo(StartNode);
