import * as React from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MonacoEditor from 'react-monaco-editor';

import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import Mermaid from '../../components/Memarid';
import UncodeBridge from '../../../uncode-bridge';
import { ReactComponent as MicroServicesIcon } from '../../assets/architecture/microservices.svg';

import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function TabPanel(props) {
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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export function DesignPage() {
  let [modeling, setModeling] = useState('');
  let [guard, setGuard] = useState('');

  useEffect(() => {
    UncodeBridge.title('Uncode - Design');
    UncodeBridge.get_design('modeling').then((model: string) => {
      let without_puml = model.replace('@startuml', '').replace('@enduml', '');
      let mermaid_str = 'classDiagram\n' + without_puml;
      setModeling(mermaid_str);
    });

    UncodeBridge.get_design('guard').then((model: string) => {
      setGuard(model);
    });
  }, []);

  let guard_options = {
    language: 'java',
  };

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let design_dsl = `
flow login {
    SEE HomePage
    DO [Click] "Login".Button
        REACT Success: SHOW "Login Success".Toast with ANIMATE(bounce)
        REACT Failure: SHOW "Login Failure".Dialog

    SEE "Login Failure".Dialog
    DO [Click] "ForgotPassword".Button
        REACT: GOTO ForgotPasswordPage

    SEE ForgotPasswordPage
    DO [Click] "RESET PASSWORD".Button
        REACT: SHOW "Please Check Email".Message
}

page HomePage {
    LayoutGrid: 12x
    LayoutId: HomePage
    Router: "/home"
}

component Navigation {
    LayoutId: Navigation
}

component TitleComponent {}
component ImageComponent {
    Size: 1080px
}
component BlogList {
    BlogDetail, Space8
    BlogDetail, Space8
    BlogDetail, Space8
    BlogDetail, Space8
    BlogDetail, Space8
    BlogDetail, Space8
}
`;

  const rebuild = () => {
    UncodeBridge.build_modeling().then(data => {
      console.log(data);
      setModeling('classDiagram\n' + data);
    });
  };

  return (
    <>
      <Helmet>
        <title>Uncode Design</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Paper className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Architecture Description" />
            <Tab label="Modeling" />
            <Tab label="Guard Design" />
            <Tab label="Fitness" />
            <Tab label="UI Design" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <MicroServicesIcon />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Button variant="contained" onClick={rebuild}>
              Rebuild
            </Button>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <MonacoEditor
                  width="100%"
                  height="600"
                  value={modeling}
                  options={guard_options}
                />
              </Grid>
              <Grid item xs={6}>
                <Mermaid chart={modeling} config={{}} name={''} />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <MonacoEditor
                  width="100%"
                  height="600"
                  value={guard}
                  options={guard_options}
                />
              </Grid>
              <Grid item xs={6}>
                <p>todo</p>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <div>todo</div>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <MonacoEditor
              width="50%"
              height="600"
              value={design_dsl}
              options={guard_options}
            />
          </TabPanel>
        </Paper>
      </PageWrapper>
    </>
  );
}

export const ArchDesc = styled.img`
  width: 800px;
  height: auto;
`;

export const A = styled.a`
  color: ${p => p.theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }
`;
