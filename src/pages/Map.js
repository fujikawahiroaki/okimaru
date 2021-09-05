import React, { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import L from "leaflet";
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
import { MapContainer, TileLayer, GeoJSON, useMap, Tooltip, Popup } from "react-leaflet";
import YambaruNaturalPark from '../geojsons/yambaru_natural_park';
import YambaruNationalForest from '../geojsons/yambaru_national_forest_shuban_ver';
import YambaruNationalForestDetail from '../geojsons/yambaru_national_forest'
import GenericTemplate from '../components/GenericTemplate';


const useStyles = makeStyles(theme => ({
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

// 国立公園区画色定義
const NP_NOMAL_AREA = '#fcbba1'
const NP_SP_AREA = '#a50f15'
const NP_FIRST_AREA = '#de2d26'
const NP_SECOND_AREA = '#fb6a4a'
const NP_THIRD_AREA = '#fc9272'
const NP_OTHER_AREA = '#fee5d9'

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

function Header() {
    const mobileWidth = 835;
    const { width, height } = useWindowDimensions();
    if (width > mobileWidth) {
        return (<HeaderDesktop />);
    } else {
        return (<HeaderMobile />);
    }
}

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

const YambaruNaturalParkLayer = () => {
    const [data, setData] = React.useState();
    const map = useMap();
    useEffect(() => {
        setData(YambaruNaturalPark);
    }, []);
    const mapPolygonColorToArea = (area => {
        return area === "普通地域"
            ? NP_NOMAL_AREA
            : area === "特別保護地区"
                ? NP_SP_AREA
                : area === "第1種特別地域"
                    ? NP_FIRST_AREA
                    : area === "第2種特別地域"
                        ? NP_SECOND_AREA
                        : area === "第3種特別地域"
                            ? NP_THIRD_AREA
                            : NP_OTHER_AREA;
    })
    const style = (feature => {
        return ({
            fillColor: mapPolygonColorToArea(feature.properties.area),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '2',
            fillOpacity: 0.5
        });
    });
    if (data) {
        // These next 3 lines purely for debuggins:
        const geojsonObject = L.geoJSON(data);
        map.fitBounds(geojsonObject.getBounds());
        console.log(geojsonObject);
        // end debugging
        return (
            <GeoJSON
                data={data}
                style={style}
            />)
    } else {
        return "データを読み込み中です...";
    }
};

const YambaruNationalForestLayer = () => {
    const [data, setData] = useState();
    const [detailData, setDetailData] = useState();
    const selectedRinpans = [];
    const map = useMap();
    useEffect(() => {
        setData(YambaruNationalForest);
        setDetailData(YambaruNationalForestDetail);
    }, []);
    const mapPolygonColorToShuban = (shuban => {
        return shuban <= 46
            ? '#03fcfc'
            : shuban >= 47
                ? '#18fc03'
                : '#fee5d9';
    })
    const style = (feature => {
        return ({
            fillColor: mapPolygonColorToShuban(feature.properties.shuban),
            weight: 2,
            opacity: 1,
            color: mapPolygonColorToShuban(feature.properties.shuban),
            dashArray: '2',
            fillOpacity: 0
        });
    });
    const detailStyle = (feature => {
        return ({
            fillColor: mapPolygonColorToShuban(feature.properties.shuban),
            weight: 1,
            opacity: 1,
            color: mapPolygonColorToShuban(feature.properties.shuban),
            dashArray: '2 5',
            fillOpacity: 0
        });
    });
    const selectedStyle = (feature => {
        return ({
            fillColor: mapPolygonColorToShuban(feature.properties.shuban),
            weight: 2,
            opacity: 1,
            color: mapPolygonColorToShuban(feature.properties.shuban),
            dashArray: '2',
            fillOpacity: 0.8
        });
    });
    const onEachRinpan = (feature, layer) => {
        const shubanName = feature.properties.shuban;
        layer.on('mouseover', function (e) {
            layer.bindPopup(`${shubanName}`).openTooltip();
            layer.setStyle({ fillOpacity: 0.5 })
        });
        layer.on('mouseout', function (e) {
            layer.setStyle({ fillOpacity: 0 })
        });
        layer.on('click', function (e) {
            layer.setStyle({ fillOpacity: 0.8 })
        });
        layer.bindTooltip(`${shubanName}`, { permanent: true, direction: "center" }).openTooltip();
    }
    const onEachShouRinpan = (feature, layer) => {
        const shubanName = feature.properties.shuban;
        layer.on('mouseover', function (e) {
            layer.bindPopup(`${shubanName}`).openTooltip();
            layer.setStyle({ fillOpacity: 0.5 })
        });
        layer.on('mouseout', function (e) {
            layer.setStyle({ fillOpacity: 0 })
        });
        layer.on('click', function (e) {
            layer.setStyle({ fillOpacity: 0.8 })
        });
    }
    if (data) {
        // These next 3 lines purely for debuggins:
        const geojsonObject = L.geoJSON(data);
        map.fitBounds(geojsonObject.getBounds());
        console.log(geojsonObject);
        // end debugging
        return (
            <div>
                <GeoJSON
                    data={data}
                    style={style}
                    onEachFeature={onEachRinpan}
                />
                <GeoJSON
                    data={detailData}
                    style={detailStyle}
                    onEachFeature={onEachShouRinpan}
                />
            </div>
        )
    } else {
        return "データを読み込み中です...";
    }
};

const Legend = ({ map }) => {
    const mobileWidth = 835;
    const { width, height } = useWindowDimensions();
    useEffect(() => {
        if (map) {
            const legend = L.control({ position: "bottomright" });
            legend.onAdd = function (map) {
                var div = L.DomUtil.create("div", "legend");
                div.innerHTML += '国立公園</span><br>';
                div.innerHTML += `<i style="background: ${NP_SP_AREA}"></i><span>特別保護地区</span><br>`;
                div.innerHTML += `<i style="background: ${NP_FIRST_AREA}"></i><span>第一種特別地域</span><br>`;
                div.innerHTML += `<i style="background: ${NP_SECOND_AREA}"></i><span>第二種特別地域</span><br>`;
                div.innerHTML += `<i style="background: ${NP_THIRD_AREA}"></i><span>第三種特別地域</span><br>`;
                div.innerHTML += `<i style="background: ${NP_NOMAL_AREA}"></i><span>普通地域</span><br>`;
                div.innerHTML += "数字は林班主番"
                return div;
            };
            legend.addTo(map);
        }
    }, [map]); //here add map
    return null;
}

const Map = (props) => {
    const classes = useStyles();
    const [map, setMap] = useState(null);
    const mobileWidth = 835;
    const { width, height } = useWindowDimensions();
    return (
        <div>
            <CssBaseline />
            <Header />
            <div className={classes.content}>
                <div className={classes.toolbar} />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography>
                                        ※本サービスはまだβ版のため、機能不足ですがご容赦ください
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <MapContainer
                                        style={{ height: "80vh", width: "100%" }}
                                        doubleClickZoom={false}
                                        id="mapId"
                                        zoom={18}
                                        center={[128.252335, 26.737332]}
                                        whenCreated={setMap}>
                                        <YambaruNaturalParkLayer />
                                        <YambaruNationalForestLayer />
                                        <TileLayer
                                            url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                                            attribution="地理院地図 https://maps.gsi.go.jp/development/ichiran.html"
                                        />
                                        <Legend map={map} />
                                    </MapContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </main>
            </div>
        </div>
    );
};


export default Map;
