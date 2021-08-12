import { Component } from 'solid-js';
import { Node } from 'solid-flowy/lib';

import styles from './IntentNodeHeader.module.css';

interface IntentNodeHeaderProps {
  node: Node;
  storeId: string;
}

const IntentIcon = () => {
  return (
    <svg className={styles.LeadingIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2zM11 16l4-4-4-4v3H1v2h10v3z"></path>
    </svg>
  );
};

const IntentNodeHeader: Component<IntentNodeHeaderProps> = (props) => {
  return (
    <header className={styles.Header}>
      <IntentIcon />
      <h3 className={styles.Title}>Intent</h3>
    </header>
  );

  // return (
  //   <header className={classes.header}>
  //     <InputIcon className={classes.leadingIcon} />
  //     <Typography className={classes.title} variant="h3">Intent</Typography>
  //     <IconButton className={classes.moreOptionsButton} aria-label="more options" onClick={handleOpenMenu}>
  //       <MoreHorizIcon />
  //     </IconButton>
  //   </header>
  // )
};

export default IntentNodeHeader;
