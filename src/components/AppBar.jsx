import { useState } from 'react';

import { makeStyles, useTheme } from '@mui/styles';
import HelpIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import IconButton from '@mui/material/IconButton';
import Public from '@mui/icons-material/Public';
import Tooltip from '@mui/material/Tooltip';

import NavDrawer from './NavDrawer';
import ConnectionSettingsDialog from './ConnectionSettingsDialog';
import { withApplicationContext } from '../contexts/Application';

const logoUrl =
  'https://agoric.com/wp-content/themes/agoric_2021_theme/assets/img/logo.svg';
const helpUrl = 'https://agoric.com/documentation/guides/wallet/ui.html';

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.background.default,
    borderBottom: '1px solid #eaecef',
    margin: 'auto',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: theme.appBarHeight,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  connecting: {
    animation: `$throb 2s infinite`,
  },
  '@keyframes throb': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.2,
    },
    '100%': {
      opacity: 1,
    },
  },
  productLink: {
    alignItems: 'center',
    display: 'flex',
  },
  productLogo: {
    transform: 'scale(0.85)',
  },
  appBarSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4px',
    margin: '8px',
    height: '100%',
  },
}));

// Exported for testing only.
export const AppBarWithoutContext = ({
  connectionComponent,
  wantConnection,
  setWantConnection,
  connectionState,
  connectionStatus,
  connectionConfig,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [dialogOpened, setDialogOpened] = useState(connectionConfig === null);
  const handleClosed = () => {
    setDialogOpened(false);
  };

  const connectionTitle =
    connectionStatus &&
    connectionStatus[0].toUpperCase() + connectionStatus.slice(1);

  return (
    <header className={classes.header}>
      <div className={classes.appBarSection}>
        <NavDrawer />
        <a href="/" >
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU1IiBoZWlnaHQ9IjM2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48cGF0aCBpZD0iYSIgZD0iTS4xNzguMTg1aDE0LjU5M3YyMS4yODFILjE3OHoiLz48cGF0aCBpZD0iYyIgZD0iTTAgMzQuMDk0aDE1NC45NFYuMTY1SDB6Ii8+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTIyLjMzOCAzMy44MjJoMzMuNTA2Vi4zMTZIMjIuMzM4djMzLjUwNnptMTEuMTY5LTExLjE2OWgxMS4xNjhWMTEuNDg0SDMzLjUwN3YxMS4xN3pNMCAyMi42NTNoMTEuMTY5VjExLjQ4NEgweiIgZmlsbD0iI0Q3MzI1MiIvPjxwYXRoIGQ9Ik03MS4zNDIgMjAuMjgyaDYuMjZsLTMuMTQ3LTguNTQtMy4xMTMgOC41NHptMTMuMjIxIDcuMjUxaC00LjMxOGwtMS40NC0zLjkzaC04LjY2OGwtMS40MzkgMy45M2gtNC4zMTdsNy45NjUtMjAuMzNoNC4yNTFsNy45NjYgMjAuMzN6IiBmaWxsPSIjMDAwIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAuMTUpIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4NS41NSAxMi42MjcpIj48bWFzayBpZD0iYiIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjYSIvPjwvbWFzaz48cGF0aCBkPSJNMTAuMDM1IDQuNjU4QzkuNCAzLjkxMiA4LjU4IDMuNTM5IDcuNTc1IDMuNTM5Yy0uOTYgMC0xLjc1MS4zOS0yLjM3NiAxLjE3LS42MjUuNzc5LS45MzcgMS43NjctLjkzNyAyLjk2NCAwIDEuMTk4LjMwNiAyLjE3NC45MiAyLjkzMS42MTQuNzU3IDEuNDExIDEuMTM1IDIuMzk0IDEuMTM1IDEuMDI2IDAgMS44NTEtLjM2NyAyLjQ3Ni0xLjEuNjI1LS43MzUuOTM3LTEuNzIzLjkzNy0yLjk2NiAwLTEuMjY1LS4zMTgtMi4yNy0uOTU0LTMuMDE1em00LjczNiA5LjU0MmMwIDIuMS0uNjI1IDMuNzk1LTEuODc0IDUuMDgzLTEuMjUgMS4yODctMy4wOCAyLjE4My01LjQyMiAyLjE4My0yLjk3OSAwLTUuMjY3LTEuMzc3LTYuOTY4LTMuNzA2TDIuNyAxNS42ODVjMS4zMjkgMS41MDEgMy4zOTUgMy4wMiA1Ljg1NSAyLjE4NCAxLjgxMi0uNjE2IDIuMi0yLjM0NyAyLjItMy41Njd2LTEuMTRoLS4xNjdhMy4yMDcgMy4yMDcgMCAwMS0uMTE4LjIwNGMtLjA1NS4wOS0uMTkuMjQ4LS40MDIuNDc0YTMuNjc3IDMuNjc3IDAgMDEtLjcxOS41OTNjLS4yNjguMTctLjY0Ny4zMjItMS4xMzguNDU4YTYuMDIzIDYuMDIzIDAgMDEtMS42MDYuMjAzYy0xLjg1MiAwLTMuMzg2LS43LTQuNjAzLTIuMUMuNzg2IDExLjU5Mi4xNzggOS43OTYuMTc4IDcuNjA0YzAtMi4yMzYuNjItNC4wMzIgMS44NTgtNS4zODdDMy4yNzQuODYzIDQuODQyLjE4NSA2LjczOS4xODVhNi4zMiA2LjMyIDAgMDExLjg0LjI1NGMuNTU4LjE3IDEuMDA0LjM3OCAxLjMzOS42MjcuMzM1LjI0OC42Mi40OTcuODU0Ljc0NS4yMzQuMjQ5LjM5Ni40NTIuNDg1LjYxbC4xMzQuMjcxaC4xMzRMMTIuMTYuNTI0aDIuNjFWMTQuMnoiIGZpbGw9IiMwMDAiIG1hc2s9InVybCgjYikiLz48L2c+PHBhdGggZD0iTTExMi43ODMgMjMuMzVjLjYzNi0uNzY4Ljk1NC0xLjc5Ni45NTQtMy4wODMgMC0xLjI2NS0uMzE4LTIuMjg3LS45NTQtMy4wNjctLjYzNi0uNzgtMS40NDUtMS4xNjktMi40MjctMS4xNjktMS4wMDQgMC0xLjgyNC4zOS0yLjQ2IDEuMTctLjYzNi43NzktLjk1NCAxLjgtLjk1NCAzLjA2NiAwIDEuMjg3LjMxMiAyLjMxNS45MzcgMy4wODMuNjI1Ljc2OCAxLjQ1IDEuMTUyIDIuNDc3IDEuMTUyLjk4MiAwIDEuNzktLjM4NCAyLjQyNy0xLjE1Mm0yLjc3OCAyLjMyMWMtMS40MTcgMS4zNjctMy4xNTIgMi4wNS01LjIwNSAyLjA1LTIuMDc1IDAtMy44MjEtLjY4My01LjIzOC0yLjA1LTEuNDE3LTEuMzY2LTIuMTI1LTMuMTQ1LTIuMTI1LTUuMzM2IDAtMi4yMTQuNzA4LTQuMDIyIDIuMTI1LTUuNDIyIDEuNDE3LTEuNCAzLjE2My0yLjEgNS4yMzgtMi4xIDIuMDUzIDAgMy43ODguNyA1LjIwNSAyLjEgMS40MTYgMS40IDIuMTI1IDMuMjA4IDIuMTI1IDUuNDIyIDAgMi4xOS0uNzA5IDMuOTctMi4xMjUgNS4zMzZtMTMuOTMtOS4wOThoLTEuODczYy0uOTYgMC0xLjczNS4zMTEtMi4zMjcuOTMyLS41OS42MjItLjg4NiAxLjQ2My0uODg2IDIuNTI0djcuMzUzaC00LjAxN3YtMTQuMjNoMi41MWwuNTY5IDIuMWguMjAxYy43MzctMS40IDIuMDQyLTIuMSAzLjkxNi0yLjFoMS45MDd2My40MjF6IiBmaWxsPSIjMDAwIi8+PG1hc2sgaWQ9ImQiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2MiLz48L21hc2s+PHBhdGggZD0iTTEzMS43MDggMjcuMzgzaDQuMDE3VjEzLjE1aC00LjAxN3YxNC4yMzJ6bS4zNjgtMTcuMTEyYy0uNDQ2LS40My0uNjctLjk4My0uNjctMS42NiAwLS42NzguMjI0LTEuMjM3LjY3LTEuNjc4LjQ0Ni0uNDQgMS4wMDUtLjY2IDEuNjc0LS42Ni42NyAwIDEuMjMzLjIyIDEuNjkuNjYuNDU4LjQ0LjY4NiAxIC42ODYgMS42NzggMCAuNjc3LS4yMjggMS4yMy0uNjg2IDEuNjYtLjQ1Ny40My0xLjAyLjY0NC0xLjY5LjY0NC0uNjcgMC0xLjIyOC0uMjE1LTEuNjc0LS42NDR6bTguMjY4IDE1LjM0OWMtMS4zNjItMS40LTIuMDQyLTMuMTg0LTIuMDQyLTUuMzUzIDAtMi4xNjkuNjgtMy45NTQgMi4wNDItNS4zNTQgMS4zNi0xLjQgMy4xNDYtMi4xIDUuMzU1LTIuMS44OTMgMCAxLjcwNy4xMDcgMi40NDMuMzIuNzM3LjIxNiAxLjI1LjQyNSAxLjU0LjYyOGwuNDM1LjMzOS0xLjAzOCAyLjkxNGMtLjg3LS41NjUtMS44NzQtLjg0Ny0zLjAxMi0uODQ3LTEuMDkzIDAtMS45ODYuMzczLTIuNjc4IDEuMTE4LS42OTEuNzQ1LTEuMDM3IDEuNzQtMS4wMzcgMi45ODIgMCAxLjI2NS4zNDYgMi4yNjQgMS4wMzcgMi45OTguNjkyLjczNSAxLjU4NSAxLjEwMiAyLjY3OCAxLjEwMi41MTMgMCAxLjAyLS4wNzQgMS41MjMtLjIyLjUwMi0uMTQ3Ljg3Ni0uMjg4IDEuMTIxLS40MjRsLjM2OC0uMjAzIDEuMDA1IDIuODhjLS4xMTIuMDktLjI3NC4yMDktLjQ4Ni4zNTYtLjIxMi4xNDYtLjY5Mi4zNDQtMS40NC41OTItLjc0Ny4yNDktMS41NjYuMzczLTIuNDU5LjM3My0yLjIxIDAtMy45OTQtLjctNS4zNTUtMi4xIiBmaWxsPSIjMDAwIiBtYXNrPSJ1cmwoI2QpIi8+PHBhdGggZD0iTTE1NC45NCAyNi4yN2ExLjQ1MSAxLjQ1MSAwIDExLTIuOTAyIDAgMS40NTEgMS40NTEgMCAwMTIuOTAyIDAiIGZpbGw9IiNGRkYiIG1hc2s9InVybCgjZCkiLz48cGF0aCBkPSJNMTUzLjQ5IDI0LjgyYTEuNDUxIDEuNDUxIDAgMTAwIDIuOTAyIDEuNDUxIDEuNDUxIDAgMDAwLTIuOTAybTAgLjI1NWExLjE5NyAxLjE5NyAwIDAxMCAyLjM5MSAxLjE5NiAxLjE5NiAwIDAxLS4wMDEtMi4zOTEiIGZpbGw9IiMwMDAiIG1hc2s9InVybCgjZCkiLz48cGF0aCBmaWxsPSIjMDAwIiBtYXNrPSJ1cmwoI2QpIiBkPSJNMTUyLjU2MiAyNS44NzJoLjczM3YuMTkyaC0uMjU2di43M2gtLjIydi0uNzNoLS4yNTd6bTEuNDk2LjQxM2wtLjE5Ni4yNjRoLS4wOTJsLS4xOTgtLjI2NnYuNTFoLS4yMThsLjAwMS0uOTIyaC4xNzhsLjI4Mi4zOTYuMjgzLS4zOTZoLjE3N2wuMDAyLjkyM2gtLjIxOXoiLz48L2c+PC9nPjwvc3ZnPg==" alt="Agoric"/>
        </a>
      </div>
      <div className={classes.appBarSection}>
        <div className={classes.connector}>
          {connectionComponent}
          <Tooltip title={connectionTitle}>
            <IconButton
              size="medium"
              color={wantConnection ? 'primary' : 'secondary'}
              onClick={() =>
                setWantConnection(!wantConnection && connectionConfig !== null)
              }
            >
              <Public
                className={
                  connectionStatus === 'connecting' ? classes.connecting : ''
                }
                fontSize="inherit"
              >
                {connectionState}
              </Public>
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.connector}>
          <Tooltip title="Settings">
            <IconButton
              color="primary"
              size="medium"
              target="_blank"
              onClick={() => setDialogOpened(true)}
            >
              <SettingsIcon fontSize="inherit">Help</SettingsIcon>
            </IconButton>
          </Tooltip>
          <ConnectionSettingsDialog
            open={dialogOpened}
            onClose={handleClosed}
          />
        </div>
        <div className={classes.connector}>
          <Tooltip title="Help">
            <IconButton
              color="primary"
              size="medium"
              target="_blank"
              href={helpUrl}
            >
              <HelpIcon fontSize="inherit">Help</HelpIcon>
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default withApplicationContext(AppBarWithoutContext, context => ({
  connectionComponent: context.connectionComponent,
  connectionState: context.connectionState,
  wantConnection: context.wantConnection,
  setWantConnection: context.setWantConnection,
  connectionStatus: context.connectionStatus,
  connectionConfig: context.connectionConfig,
}));
