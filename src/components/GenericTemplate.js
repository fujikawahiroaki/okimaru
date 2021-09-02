import React from "react";
import PropTypes from 'prop-types';
import clsx from "clsx";
import { createMuiTheme } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import { makeStyles, createStyles, Theme, useTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from '@material-ui/core/Hidden';
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import CloseIcon from '@material-ui/icons/Close';
import ExploreIcon from '@material-ui/icons/Explore';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Dashboard } from "@material-ui/icons";


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  palette: {
    primary: { main: "#000000" }, // テーマの色
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.secondary,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#ffffff",
    backgroundColor: "#000000",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  closeMenuButton: {
    marginRight: 'auto',
    marginLeft: 0,
  },
}));

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      沖丸環境調査
      {" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

function GenericTemplate({
  children,
  title,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen)
  }
  const drawer = (
    <div>
      <List>
        <Link to="/" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="トップページ" />
          </ListItem>
        </Link>
        <Link to="/yambarumap" target="_blank" rel="noopener noreferrer" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="やんばる昆虫調査補助マップ" />
          </ListItem>
        </Link>
        <a href="https://www.webspecimanager.net/" target="_blank" rel="noopener noreferrer" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <CloudQueueIcon />
            </ListItemIcon>
            <ListItemText primary="標本DB管理サービスWebSpecimanager" />
          </ListItem>
        </a>
      </List>
    </div>
  );
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            沖丸環境調査
          </Typography>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <IconButton onClick={handleDrawerToggle} className={classes.closeMenuButton}>
              <CloseIcon />
            </IconButton>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <div className={classes.content}>
        <div className={classes.toolbar} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {children}
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </div>
  );
}

GenericTemplate.propTypes = {
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
};

export default GenericTemplate;