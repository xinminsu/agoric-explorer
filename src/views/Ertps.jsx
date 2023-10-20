import { useState, useReducer } from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {withApplicationContext} from "../contexts/Application.jsx";
import Card from "../components/Card.jsx";
import Loading from "../components/Loading.jsx";
import CardItem from "../components/CardItem.jsx";
import {defaultIcon, icons} from "../util/Icons.js";
import Petname from "../components/Petname.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Purses from "../components/Purses.jsx";

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`ertp-tabpanel-${index}`}
          aria-labelledby={`ertp-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `ertp-tab-${index}`,
    'aria-controls': `ertp-tabpanel-${index}`,
  };
}

export const ErtpsnewWithoutContext = ({
                                         issuers,
                                         pendingPurseCreations,
                                         schemaActions,
                                         services,
                                       }) => {
  const [value, setValue] = React.useState(0);

  const [selectedIssuer, setSelectedIssuer] = useState(null);
  const handleCreatePurse = id => setSelectedIssuer(id);
  const closeMakePurse = () => setSelectedIssuer(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Issuer = (issuer, index) => {
    return (
        <CardItem key={issuer.id} hideDivider={index === 0}>
          <div className="Left">
            <img
                alt="icon"
                src={icons[issuer.issuerPetname] ?? defaultIcon}
                height="32px"
                width="32px"
            />
            <div>
              <Petname name={issuer.issuerPetname} />
              <div>
                Board ID: (<span className="Board">{issuer.issuerBoardId}</span>)
              </div>
            </div>
          </div>
          <div className="Right">
            {pendingPurseCreations.has(issuer.id) ? (
                <div className="IssuerProgressWrapper">
                  <CircularProgress size={30} />
                </div>
            ) : (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleCreatePurse(issuer.id)}
                >
                  Make Purse
                </Button>
            )}
          </div>
        </CardItem>
    );
  };

  const issuerItems = (issuers && issuers.map(Issuer)) ?? (
      <Loading defaultMessage="Fetching issuers..."/>
  );

  return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Purses" {...a11yProps(0)} />
            <Tab label="Issuers" {...a11yProps(1)} />
            <Tab label="Boards" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <div className="Flex-item Purses">
            <Purses />
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="Card-wrapper">
            <Card>{issuerItems}</Card>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
  );
}

export default withApplicationContext(ErtpsnewWithoutContext, context => ({
  issuers: context.issuers,
  pendingPurseCreations: context.pendingPurseCreations,
  schemaActions: context.schemaActions,
  services: context.services,
}));