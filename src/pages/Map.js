import React, { useEffect, useState, useRef, memo, useCallback, createContext, useContext } from "react";
import L from "leaflet";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from "@material-ui/core/Box";
import { MapContainer, TileLayer, GeoJSON, useMap, Tooltip, Popup } from "react-leaflet";
import YambaruNaturalPark from '../geojsons/yambaru_natural_park';
import YambaruNationalForest from '../geojsons/yambaru_national_forest_shuban_ver';
import YambaruNationalForestDetail from '../geojsons/yambaru_national_forest'
import GenericTemplate from '../components/GenericTemplate';
import { Header, Copyright, useStyles } from "../components/MapBaseCoponents";


// 国立公園区画色定義
const NP_NOMAL_AREA = '#fcbba1'
const NP_SP_AREA = '#a50f15'
const NP_FIRST_AREA = '#de2d26'
const NP_SECOND_AREA = '#fb6a4a'
const NP_THIRD_AREA = '#fc9272'
const NP_OTHER_AREA = '#fee5d9'


const SelectedRinpansContext = createContext();

const useSelectedRinpansContext = () => {
    return useContext(SelectedRinpansContext);
};

export const SelectedRinpansProvider = ({ children }) => {
    const [selectedRinpans, setSelectedRinpans] = useState([]);
    const pushRinpan = (rinpan) => { setSelectedRinpans((selectedRinpans) => [...selectedRinpans, rinpan]) };
    const popRinpan = (rinpan) => { setSelectedRinpans((selectedRinpans) => selectedRinpans.filter(eachRinpan => eachRinpan !== rinpan)) };
    const isChoicedRinpan = (rinpan) => {
        if (selectedRinpans.includes(rinpan)) {
            return true;
        } else {
            return false;
        }
    }
    const value = {
        selectedRinpans,
        setSelectedRinpans,
        pushRinpan,
        popRinpan,
        isChoicedRinpan,
    }
    return (
        <SelectedRinpansContext.Provider value={value}>
            {children}
        </SelectedRinpansContext.Provider>
    )
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
    const { selectedRinpans, pushRinpan, popRinpan, isChoicedRinpan } = useSelectedRinpansContext();
    const map = useMap();
    const rinpanRef = useRef();
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
        if (selectedRinpans.includes(feature.properties.shuban)) {
            return ({
                fillColor: mapPolygonColorToShuban(feature.properties.shuban),
                weight: 2,
                opacity: 1,
                color: mapPolygonColorToShuban(feature.properties.shuban),
                dashArray: '2',
                fillOpacity: 0.8
            });
        } else {
            return ({
                fillColor: mapPolygonColorToShuban(feature.properties.shuban),
                weight: 2,
                opacity: 1,
                color: mapPolygonColorToShuban(feature.properties.shuban),
                dashArray: '2',
                fillOpacity: 0
            });
        }

    });
    const detailStyle = (feature => {
        if (selectedRinpans.includes(feature.properties.shuban)) {
            return ({
                fillColor: mapPolygonColorToShuban(feature.properties.shuban),
                weight: 2,
                opacity: 1,
                color: mapPolygonColorToShuban(feature.properties.shuban),
                dashArray: '2',
                fillOpacity: 0.8
            });
        } else {
            return ({
                fillColor: mapPolygonColorToShuban(feature.properties.shuban),
                weight: 1,
                opacity: 1,
                color: mapPolygonColorToShuban(feature.properties.shuban),
                dashArray: '2 5',
                fillOpacity: 0
            });
        }
    });
    const onEachRinpan = (feature, layer) => {
        const shubanName = feature.properties.shuban;
        layer.on('mouseover', function (e) {
            if (!selectedRinpans.includes(feature.properties.shuban)) {
                layer.setStyle({ fillOpacity: 0.5 })
            }
        });
        layer.on('mouseout', function (e) {
            if (!selectedRinpans.includes(feature.properties.shuban)) {
                layer.setStyle({ fillOpacity: 0 })
            }
        });
        layer.on('click', function (e) {
            console.log(rinpanRef.current)
            if (isChoicedRinpan(feature.properties.shuban)) {
                console.log("もうあるよ")
                console.log(selectedRinpans)
                popRinpan(feature.properties.shuban);
            } else {
                console.log("まだないよ")
                console.log(selectedRinpans)
                pushRinpan(feature.properties.shuban);
            }
            rinpanRef.current.resetStyle();
        });
        layer.bindTooltip(`${shubanName}`, { permanent: true, direction: "center" }).openTooltip();
    }
    if (data) {
        return (
            <div>
                <GeoJSON
                    data={detailData}
                    style={detailStyle}
                />
                <GeoJSON
                    data={data}
                    style={style}
                    onEachFeature={onEachRinpan}
                    ref={rinpanRef}
                />
            </div>
        )
    } else {
        return "データを読み込み中です...";
    }
};

const Legend = ({ map }) => {
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


const SupportCard = () => {
    const { selectedRinpans } = useSelectedRinpansContext();
    console.log(selectedRinpans)
    return (
        <Card>
            <CardContent>
                <Typography>
                    ※本サービスはまだβ版のため、機能不足ですがご容赦ください
                    {
                        selectedRinpans.map(rinpan => <li>{rinpan}</li>)
                    }
                </Typography>
            </CardContent>
        </Card>
    )
};
const Map = (props) => {
    const classes = useStyles();
    const [map, setMap] = useState(null);
    return (
        <div>
            <SelectedRinpansProvider>
                <CssBaseline />
                <Header />
                <div className={classes.content}>
                    <div className={classes.toolbar} />
                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={4}>
                                <SupportCard />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Card>
                                    <CardContent>
                                        <MapContainer
                                            style={{ height: "80vh", width: "100%" }}
                                            doubleClickZoom={false}
                                            id="mapId"
                                            zoom={12}
                                            center={[26.737332, 128.252335]}
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
            </SelectedRinpansProvider>
        </div>
    );
};


export default Map;
