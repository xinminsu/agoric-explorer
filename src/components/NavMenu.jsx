import { useMemo, forwardRef } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { makeStyles, useTheme } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GavelIcon from '@mui/icons-material/Gavel';
import WebAssetIcon from '@mui/icons-material/WebAsset';

const useStyles = makeStyles(theme => ({
  nav: {
    position: 'fixed',
    top: theme.appBarHeight,
    width: theme.navMenuWidth,
    height: `calc(100vh - ${theme.appBarHeight})`,
    overflowY: 'auto',
    [theme.breakpoints.down('md')]: {
      position: 'relative',
      top: '0',
    },
  },
  sectionHeader: {
    padding: '16px',
    fontFamily: ['Montserrat', 'Arial', 'sans-serif'].join(','),
    fontWeight: 700,
    letterSpacing: '0.15px',
    fontSize: '16px',
  },
}));

const ListItemLink = ({ icon, primary, to, onClick }) => {
  const match = useRouteMatch({
    path: to,
    exact: true,
  });

  const renderLink = useMemo(
    () =>
      forwardRef((itemProps, ref) => {
        return (
          <Link
            to={to}
            ref={ref}
            {...itemProps}
            role={undefined}
            onClick={onClick}
          />
        );
      }),
    [to],
  );

  return (
    <li>
      <ListItem
        selected={match !== null}
        button
        style={{ borderRadius: '0 32px 32px 0' }}
        component={renderLink}
        color="primary"
      >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};

const NavMenu = ({ setDrawerOpened }) => {
  const styles = useStyles(useTheme());
  const onLinkClick = () => {
    if (setDrawerOpened) {
      setDrawerOpened(false);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.sectionHeader}>explorer</div>
      <List>
        <ListItemLink
          onClick={onLinkClick}
          to="/"
          primary="Transactions"
          icon={<ReceiptIcon />}
        />
        <ListItemLink
          onClick={onLinkClick}
          to="/contracts"
          primary="Contract Facets"
          icon={<GavelIcon />}
        />
        <ListItemLink
          onClick={onLinkClick}
          to="/ertps"
          primary="ERTP Assets"
          icon={<WebAssetIcon />}
        />
      </List>
    </nav>
  );
};

export default NavMenu;
