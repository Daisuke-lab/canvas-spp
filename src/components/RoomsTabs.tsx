import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import RoomsPreview from '../../src/components/RoomsPreview'
import { OWNED_BY_YOU, RECENT, STARRED } from '../constant';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function RoomsTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={RECENT} {...a11yProps(0)} style={{textTransform: "none"}}/>
          <Tab label={STARRED} {...a11yProps(1)} style={{textTransform: "none"}} />
          <Tab label={OWNED_BY_YOU} {...a11yProps(2)} style={{textTransform: "none"}} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <RoomsPreview tabName={RECENT}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <RoomsPreview tabName={STARRED}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <RoomsPreview tabName={OWNED_BY_YOU}/>
      </TabPanel>
    </Box>
  );
}