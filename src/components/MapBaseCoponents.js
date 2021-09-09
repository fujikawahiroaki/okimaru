import React, { useEffect, useState, useRef, memo, useCallback, createContext, useContext } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Grid from '@material-ui/core/Grid';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "@material-ui/core/Drawer"
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        margin: theme.spacing(1),
    },
    link: {
        textDecoration: "none",
        color: theme.palette.text.secondary,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#ffffff",
        backgroundColor: "#000000",
        alignItems: 'center',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
    },
    closeMenuButton: {
        marginRight: 'auto',
        marginLeft: 0,
    },
    title: {
        flexGrow: 1,
        textDecoration: "none"
    },
    black: {
        backgroundColor: "#000000"
    },
    text: {
        textDecoration: "none"
    },
    lastIcon: {
        marginRight: "5px"
    },
    newsFirstRow: {
        marginRight: "16px",
        marginLeft: "16px",
        padding: 0,
        flexGrow: 1
    },
    flexGorw1: {
        flexGrow: 1
    },
    list: {
        width: 250
    },
    fullList: {
        width: 'auto'
    }
}));

export const useWindowDimensions = () => {
    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
    }
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
        const onResize = () => {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return windowDimensions;
}

export function LinkButton(props) {
    const classes = useStyles();
    return (<Box m={1}>
        <Link>
            <RouterLink to={props.link} className={classes.text} style={{
                color: props.textColor
            }}>
                <Typography>
                    {props.text}
                </Typography>
            </RouterLink>
        </Link>
    </Box>)
}

export function LogoButton(props) {
    const classes = useStyles();
    const { width, height } = useWindowDimensions();

    if (width > 330) {
        return (<Box className={classes.title}>
            <Typography variant="h6">
                <Link underline="none">
                    <RouterLink to="/yambarumap" className={classes.text} style={{
                        color: props.textColor
                    }}>
                        やんばる昆虫調査補助マップ
                    </RouterLink>
                </Link>
            </Typography>
        </Box>)
    } else {
        return (<Box className={classes.title}></Box>)
    }
}

export function LogoButtonAsListItem(props) {
    const classes = useStyles();
    return (<Box m={1}>
        <Typography variant="h6">
            <Link underline="none">
                <RouterLink to="/yambarumap" className={classes.text} style={{
                    color: props.textColor
                }}>
                    <ListItem>
                        やんばる昆虫調査補助マップ
                    </ListItem>
                </RouterLink>
            </Link>
        </Typography>
    </Box>);
}

export function LinkButtonAsListItem(props) {
    const classes = useStyles();

    return (<Box m={1}>
        <Link underline="none">
            <RouterLink to={props.link} className={classes.text} style={{
                color: props.textColor
            }}>
                <ListItem button="true">
                    <Typography>{props.text}</Typography>
                </ListItem>
            </RouterLink>
        </Link>
    </Box>)
}

function HeaderDesktop() {
    const classes = useStyles();
    return (<Box className={classes.root}>
        <AppBar position="fixed" className={classes.black}>
            <Toolbar>
                <LogoButton textColor="#ffffff" />
                <LinkButton link="/features/" text="特色" textColor="#ffffff" />
                <LinkButton link="/functions/" text="機能" textColor="#ffffff" />
                <LinkButton link="/techinfo/" text="技術情報" textColor="#ffffff" />
                <LinkButton link="/notice/" text="免責事項" textColor="#ffffff" />
                <LinkButton link="/contact/" text="ご意見&#183;ご要望" textColor="#ffffff" />
            </Toolbar>
        </AppBar>
    </Box>);
}

function HeaderMobile() {
    const classes = useStyles();
    return (<Box className={classes.root}>
        <AppBar position="fixed" className={classes.black}>
            <Toolbar>
                <TemporaryDrawer />
                <LogoButton textColor="#ffffff" />
            </Toolbar>
        </AppBar>
    </Box>);
}

function TemporaryDrawer() {
    const classes = useStyles();
    const [state, setState] = React.useState(false);
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({
            ...state,
            [anchor]: open
        });
    };
    const list = (anchor) => (<div className={classes.fullList} role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
        <List>
            <LogoButtonAsListItem textColor="#000000" />
            <LinkButtonAsListItem link="/features/" text="特色" textColor="#000000" />
            <LinkButtonAsListItem link="/functions/" text="機能" textColor="#000000" />
            <LinkButtonAsListItem link="/techinfo/" text="技術情報" textColor="#000000" />
            <LinkButtonAsListItem link="/notice/" text="免責事項" textColor="#000000" />
            <LinkButtonAsListItem link="/contact/" text="ご意見&#183;ご要望" textColor="#000000" />
        </List>
    </div>);
    return (<div>
        {
            ['left'].map((anchor) => (<React.Fragment key={anchor}>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(anchor, true)}>
                    <MenuIcon />
                </IconButton>
                <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                    {list(anchor)}
                </Drawer>
            </React.Fragment>))
        }
    </div>);
}

export function Header() {
    const mobileWidth = 835;
    const { width, height } = useWindowDimensions();
    if (width > mobileWidth) {
        return (<HeaderDesktop />);
    } else {
        return (<HeaderMobile />);
    }
}

export const Copyright = () => {
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