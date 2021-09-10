import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import InputIcon from '@material-ui/icons/Input';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import HelpIcon from '@material-ui/icons/Help';
import ForumIcon from '@material-ui/icons/Forum';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from '../../../../../i18n';
import CircleIcon from '../icons/Circle';
import DoubleCircleIcon from '../icons/DoubleCircle';
import EmptyCircleIcon from '../icons/EmptyCircle';
import FilterAltIcon from '../icons/FilterAlt';
import DraggableBlock from './DraggableBlock';
import StartNodeShell from '../nodes/StartNode/StartNodeShell';
import IntentNodeShell from '../nodes/IntentNode/IntentNodeShell/IntentNodeShell';
import ConditionNodeShell from '../nodes/ConditionNode/ConditionNodeShell/ConditionNodeShell';
import ActionNodeShell from '../nodes/ActionNode/ActionNodeShell/ActionNodeShell';
import LocalTerminateNodeShell from '../nodes/LocalTerminateNode/LocalTerminateNodeShell';
import GlobalTerminateNodeShell from '../nodes/GlobalTerminateNode/GlobalTerminateNodeShell';
import SubWorkflowNodeShell from '../nodes/SubWorkflowNode/SubWorkflowNodeShell/SubWorkflowNodeShell';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_MINIMIZED_WIDTH = 68;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: ({ isMinimized }) =>
      isMinimized ? SIDEBAR_MINIMIZED_WIDTH : SIDEBAR_WIDTH,
    overflowX: 'hidden',
  },
  drawerPaper: ({ isMinimized }) => ({
    width: isMinimized ? SIDEBAR_MINIMIZED_WIDTH : SIDEBAR_WIDTH,
    border: 'none',
    boxShadow: theme.shadows[6],
    padding: isMinimized ? theme.spacing(1) : theme.spacing(2),
    alignItems: isMinimized ? 'center' : 'unset',
    overflowX: 'hidden',
  }),
  mainBlockTitle: {
    fontSize: 20,
    color: 'var(--black)',
    marginTop: theme.spacing(3.5),
    fontWeight: 500,
  },
  otherBlockTitle: {
    fontSize: 20,
    color: 'var(--black)',
    marginTop: 0,
    fontWeight: 500,
  },
  draggableMainBlocks: {
    marginTop: ({ isMinimized }) =>
      isMinimized ? theme.spacing(2) : theme.spacing(3),
  },
  draggableOtherBlocks: {
    marginTop: ({ isMinimized }) => (isMinimized ? 0 : theme.spacing(3)),
    flexGrow: 1,
  },
  footer: ({ isMinimized }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMinimized ? 'center' : 'space-between',
    padding: 0,
  }),
  userGuideButton: {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    transition: 'color 0.3s ease-in',
    '& .MuiSvgIcon-root': {
      color: theme.palette.grey[700],
      marginRight: theme.spacing(0.75),
      transition: 'color 0.3s ease-in',
    },
    '&:hover': {
      color: theme.palette.primary.dark,
      '& .MuiSvgIcon-root': {
        color: theme.palette.grey[800],
      },
    },
  },
  exitButton: {
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.75),
    },
  },
  minimizeButton: ({ isMinimized }) => ({
    position: isMinimized ? 'relative' : 'absolute',
    right: isMinimized ? 'unset' : theme.spacing(1),
    width: 40,
    height: 40,
  }),
}));

const draggableMainBlocks = [
  {
    name: 'start',
    description: 'startNodeDescription',
    nodeType: 'startNode',
    Icon: CircleIcon,
    DragShell: StartNodeShell,
  },
  {
    name: 'intent',
    description: 'intentNodeDescription',
    nodeType: 'intentNode',
    Icon: InputIcon,
    DragShell: IntentNodeShell,
  },
  {
    name: 'condition',
    description: 'conditionNodeDescription',
    nodeType: 'conditionNode',
    Icon: FilterAltIcon,
    DragShell: ConditionNodeShell,
  },
  {
    name: 'action',
    description: 'actionNodeDescription',
    nodeType: 'actionNode',
    Icon: FlashOnIcon,
    DragShell: ActionNodeShell,
  },
  {
    name: 'localTerminate',
    description: 'localTerminateNodeDescription',
    nodeType: 'localTerminateNode',
    Icon: EmptyCircleIcon,
    DragShell: LocalTerminateNodeShell,
  },
  {
    name: 'globalTerminate',
    description: 'globalTerminateNodeDescription',
    nodeType: 'globalTerminateNode',
    Icon: DoubleCircleIcon,
    DragShell: GlobalTerminateNodeShell,
  },
];

const draggableOtherBlocks = [
  {
    name: 'subWorkflow',
    description: 'subWorkflowNodeDescription',
    nodeType: 'subWorkflowNode',
    Icon: ForumIcon,
    DragShell: SubWorkflowNodeShell,
  },
];

const Sidebar = ({ handleClose, storeId }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const classes = useStyles({ isMinimized });
  const { t } = useTranslation('dialog');

  const toggleMinimized = () => {
    setIsMinimized(iM => !iM);
  };

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
      >
        {!isMinimized && (
          <img
            src="/static/img/workflow-logo.png"
            width="193"
            height="auto"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
            alt="Workflow Logo"
          />
        )}
        <IconButton
          className={classes.minimizeButton}
          onClick={toggleMinimized}
        >
          <MenuIcon />
        </IconButton>
        {!isMinimized && (
          <Typography
            className={classes.mainBlockTitle}
            variant="h5"
            align="left"
          >
            {t('mainBlocks')}
          </Typography>
        )}
        <section className={classes.draggableMainBlocks}>
          {draggableMainBlocks.map(
            ({ name, description, nodeType, Icon, DragShell }) => (
              <DraggableBlock
                key={name}
                Icon={Icon}
                DragShell={DragShell}
                name={name}
                description={description}
                nodeType={nodeType}
                storeId={storeId}
                isMinimized={isMinimized}
              />
            ),
          )}
        </section>
        {!isMinimized && (
          <Typography
            className={classes.otherBlockTitle}
            variant="h5"
            align="left"
          >
            {t('others')}
          </Typography>
        )}
        <section className={classes.draggableOtherBlocks}>
          {draggableOtherBlocks.map(
            ({ name, description, nodeType, Icon, DragShell }) => (
              <DraggableBlock
                key={name}
                Icon={Icon}
                DragShell={DragShell}
                name={name}
                description={description}
                nodeType={nodeType}
                storeId={storeId}
                isMinimized={isMinimized}
              />
            ),
          )}
        </section>
        <footer className={classes.footer}>
          {!isMinimized && (
            <button className={classes.userGuideButton} type="button">
              <HelpIcon />
              {t('userGuide')}
            </button>
          )}
          {!isMinimized ? (
            <Button className={classes.exitButton} onClick={handleClose}>
              <ExitToAppIcon />
              {t('exit')}
            </Button>
          ) : (
            <Tooltip title={t('exit')}>
              <IconButton onClick={handleClose}>
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          )}
        </footer>
      </Drawer>
    </>
  );
};

export default React.memo(Sidebar);
