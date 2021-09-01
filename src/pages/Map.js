import React, { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, useMap, Tooltip } from "react-leaflet";
import YambaruNaturalPark from '../geojsons/yambaru_natural_park';
import YambaruNationalForest from '../geojsons/yambaru_national_forest';


const YambaruNaturalParkLayer = () => {
    const [data, setData] = React.useState();
    const map = useMap();
    useEffect(() => {
        setData(YambaruNaturalPark);
    }, []);
    const mapPolygonColorToArea = (area => {
        return area === "普通地域"
            ? '#fcbba1'
            : area === "特別保護地区"
                ? '#a50f15'
                : area === "第1種特別地域"
                    ? '#de2d26'
                    : area === "第2種特別地域"
                        ? '#fb6a4a'
                        : area === "第3種特別地域"
                            ? '#fc9272'
                            : '#fee5d9';
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
        return "失敗";
    }
};


const YambaruNationalForestLayer = () => {
    const [data, setData] = React.useState();
    const map = useMap();
    useEffect(() => {
        setData(YambaruNationalForest);
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
            fillColor: 'white',
            weight: 2,
            opacity: 1,
            color: mapPolygonColorToShuban(feature.properties.shuban),
            dashArray: '2',
            fillOpacity: 0
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
        return "失敗";
    }
};


const Map = (props) => {
    return (
        <MapContainer
            doubleClickZoom={false}
            id="mapId"
            zoom={18}
            center={[128.252335, 26.737332]}
        >
            <YambaruNaturalParkLayer />
            <YambaruNationalForestLayer />
            <TileLayer
                url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                attribution="地理院地図 https://maps.gsi.go.jp/development/ichiran.html"
            />
        </MapContainer>
    );
};


export default Map;
