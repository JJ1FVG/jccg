// Yahoo!アプリケーションID
let yAppId = 'dj00aiZpPVByTlQ0dGhYR1VrRSZzPWNvbnN1bWVyc2VjcmV0Jng9MjI-';

// Yahoo!マップ
let ymap = new Y.Map("map");

// Yahoo!マップ コントロール
ymap.addControl(new Y.LayerSetControl());
ymap.addControl(new Y.HomeControl());
ymap.addControl(new Y.CenterMarkControl());
ymap.addControl(new Y.ScaleControl());
ymap.addControl(new Y.SliderZoomControlHorizontal());
ymap.addControl(new Y.SearchControl());

// Yahoo!マップ イベントハンドラ
ymap.bind('moveend', function() {
    let mapCenter = ymap.getCenter();
    getAddressYolp(mapCenter.Lat, mapCenter.Lon);
});

// 位置情報取得成功時の処理
function success(position) {
    document.getElementById('notice').style.display="none";
    document.getElementById('map').style.display="block"
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    ymap.drawMap(new Y.LatLng(latitude, longitude), 17, Y.LayerSetId.NORMAL);
    getAddressYolp(latitude, longitude);
};

// 位置情報取得失敗時の処理
function error() {
  document.getElementById('notice').style.display="none";
  document.getElementById('notice2').style.display="block";
};

// 緯度・経度から住所取得
function getAddressYolp(latitude, longitude) {
    let url = 'https://map.yahooapis.jp/geoapi/V1/reverseGeoCoder?lat=' + latitude + '&lon=' + longitude + '&output=json&appid=' + yAppId;
    fetchJsonp(url)
        .then(response => {
            let obj = response.json();
            return response.json();
        })
        .then(data => {
            address = data.Feature[0].Property.Address;
            //日本国外の判定
            if (address == "" || data.Feature[0].Property.Country.Code != 'JP') {
              showTable2(latitude, longitude, address, json, 'out');
            } else {
                city = data.Feature[0].Property.AddressElement[1].Name;
                showTable2(latitude, longitude, address, json, sliceGun(city));
                return address;
            }

        });
};

// 住所から市郡区を切り出す
function sliceGun(str) {
    for (let i = 0; i < str.length; i++) {
        if (str.substring(i, i + 1) == '郡' || str.substring(i, i + 1) == '市' || str.substring(i, i + 1) == '区') {
            return str.substring(0, i);
        }
    }
    return str;
};

// テーブルの表示
function showTable2(lat, lon, add, item, key) {
    if(key == 'out'){
      result.text = '<table class="table"><tr><th>住所</th><td colspan="3">日本国外</td></tr><tr><th>緯度</th><th>経度</th><th>市郡区</th><th>JCC/JCG</th></tr><tr><td>' + lat.toFixed(4) + '</td><td>' + lon.toFixed(4) + '</td><td>-</td><td>-</td></tr></table>';
    }
    else{
      let matchData = searchJson(item, key);
      result.text = '<table class="table"><tr><th>住所</th><td colspan="3">' + add + '</td></tr><tr><th>緯度</th><th>経度</th><th>市郡区</th><th>JCC/JCG</th></tr><tr><td>' + lat.toFixed(4) + '</td><td>' + lon.toFixed(4) + '</td><td>' + key + '</td><td>' + matchData[0].no + '</td></tr></table>';
    }
    document.getElementById('result').style.display="block";
};
