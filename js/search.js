//jsonファイルの取得
function fetchJson(jsonFileName) {
    fetch(jsonFileName).then(function(response) {
        return response.json();
    }).then(function(data) {
        showTable(data, '');
        return json = data;
    });
}

//jsonファイルの検索
function searchJson(item, key) {
    let matchData = item.filter(function(item, index) {
        if ((item.no).indexOf(key) >= 0) {
            return true;
        } else if ((item.cityKanji).indexOf(key) >= 0) {
            return true;
        } else if ((item.cityRomaji.toLowerCase()).indexOf(key.toLowerCase()) >= 0) {
            return true;
        } else if ((item.cityRomaji.toLowerCase()).indexOf(jaconv.toHebon(key).toLowerCase()) >= 0) {
            return true;
        };
    });
    return matchData;
};

//テーブルの表示
function showTable(item, key) {
    let matchData = searchJson(item, key);
    let html = "<table class=\"table table-striped\">";
    for (item of matchData) {
        html += '<tr><td>' + item.no + '</td><td>' + item.cityKanji + '</td>';
    }
    html += '</table>';
    result.text = html;
};
